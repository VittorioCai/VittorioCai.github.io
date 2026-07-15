const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const finePointerQuery = '(hover: hover) and (pointer: fine)';

function initScrollProgress(accentRule: HTMLElement, reduceMotion: boolean) {
  if (reduceMotion) {
    accentRule.style.setProperty('--scroll-progress', '1');
    return;
  }

  accentRule.classList.add('accent-rule--progress');
  let frame = 0;

  const update = () => {
    frame = 0;
    const scrollRange =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollRange > 0 ? window.scrollY / scrollRange : 1;
    const visualProgress = 0.08 + Math.min(1, Math.max(0, progress)) * 0.92;

    accentRule.style.setProperty(
      '--scroll-progress',
      String(visualProgress),
    );
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
}

function initHeroParallax(hero: HTMLElement) {
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const render = () => {
    frame = 0;
    hero.style.setProperty('--pointer-x', pointerX.toFixed(3));
    hero.style.setProperty('--pointer-y', pointerY.toFixed(3));
  };

  const requestRender = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(render);
  };

  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    requestRender();
  });

  hero.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    requestRender();
  });
}

function initProjectPointer(link: HTMLElement) {
  const update = (event: PointerEvent) => {
    const bounds = link.getBoundingClientRect();
    link.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    link.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };

  link.addEventListener('pointerenter', update);
  link.addEventListener('pointermove', update);
}

export function initMotion() {
  const reduceMotion = window.matchMedia(reducedMotionQuery).matches;
  const finePointer = window.matchMedia(finePointerQuery).matches;
  const accentRule = document.querySelector<HTMLElement>('.accent-rule');

  document.documentElement.dataset.motion = 'ready';

  if (accentRule) initScrollProgress(accentRule, reduceMotion);
  if (reduceMotion || !finePointer) return;

  const hero = document.querySelector<HTMLElement>('[data-hero-motion]');
  if (hero) initHeroParallax(hero);

  for (const link of document.querySelectorAll<HTMLElement>(
    '[data-project-pointer-link]',
  )) {
    initProjectPointer(link);
  }
}
