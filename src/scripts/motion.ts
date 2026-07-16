const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const finePointerQuery = '(hover: hover) and (pointer: fine)';
const visitedSessionKey = 'vittorio-portfolio-visited';

function initVisitedState() {
  try {
    if (window.sessionStorage.getItem(visitedSessionKey)) {
      document.documentElement.dataset.visited = 'true';
      return;
    }

    window.sessionStorage.setItem(visitedSessionKey, 'true');
  } catch {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }
}

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

function initTimeline(timeline: HTMLElement) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        timeline.classList.add('timeline--visible');
        observer.disconnect();
      }
    },
    { threshold: 0.25 },
  );

  observer.observe(timeline);
}

function initReveals(reduceMotion: boolean) {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    for (const element of targets) {
      element.classList.add('reveal--visible');
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const element = entry.target as HTMLElement;
        element.style.transitionDelay = `${element.dataset.revealDelay ?? 0}ms`;
        element.classList.add('reveal--visible');
        element.addEventListener(
          'transitionend',
          () => {
            element.style.transitionDelay = '0ms';
          },
          { once: true },
        );
        observer.unobserve(element);
      }
    },
    { threshold: 0.12 },
  );

  for (const element of targets) observer.observe(element);
}

export function initMotion() {
  const reduceMotion = window.matchMedia(reducedMotionQuery).matches;
  const finePointer = window.matchMedia(finePointerQuery).matches;
  const accentRule = document.querySelector<HTMLElement>('.accent-rule');

  initVisitedState();
  document.documentElement.dataset.motion = 'ready';
  initReveals(reduceMotion || navigator.webdriver === true);

  for (const timeline of document.querySelectorAll<HTMLElement>(
    '[data-timeline]',
  )) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      timeline.classList.add('timeline--visible');
    } else {
      initTimeline(timeline);
    }
  }

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
