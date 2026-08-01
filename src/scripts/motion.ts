const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const finePointerQuery = '(hover: hover) and (pointer: fine)';
const visitedSessionKey = 'vittorio-portfolio-visited';
const INTRO_KEY = 'vc-intro-played';
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_SETTLE = 'cubic-bezier(0.22, 1, 0.36, 1)';

let activeCleanups: Array<() => void> = [];

function skipIntro(intro: HTMLElement, shell: HTMLElement) {
  intro.remove();
  shell.removeAttribute('data-intro-wait');
}

function initIntro(reduceMotion: boolean) {
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  const shell = document.querySelector<HTMLElement>('[data-intro-wait]');
  if (!intro || !shell) return;

  let played = false;
  try {
    played = window.sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    // If storage is unavailable, the intro plays on each homepage visit.
  }

  if (reduceMotion || played) {
    skipIntro(intro, shell);
    return;
  }

  try {
    window.sessionStorage.setItem(INTRO_KEY, '1');
  } catch {
    // The animation can still run without persisting its session state.
  }

  const words = intro.querySelectorAll<HTMLElement>('[data-intro-word]');
  const name = intro.querySelector<HTMLElement>('[data-intro-name]');
  const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');
  if (!name || !wordmark) {
    skipIntro(intro, shell);
    return;
  }

  wordmark.style.animation = 'none';
  wordmark.style.opacity = '0';

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      words.forEach((word, index) => {
        word.style.transition =
          `transform 420ms ${EASE_OUT} ${index * 60}ms`;
        word.style.transform = 'none';
      });
    });
  });

  window.setTimeout(() => {
    const from = name.getBoundingClientRect();
    const to = wordmark.getBoundingClientRect();
    name.style.transition = `transform 440ms ${EASE_SETTLE}`;
    name.style.transform = `translate(${to.left - from.left}px, ${
      to.top - from.top
    }px) scale(${to.width / from.width})`;
    intro.style.transition = 'background-color 300ms ease 80ms';
    intro.style.backgroundColor = 'transparent';

    window.setTimeout(() => {
      shell.removeAttribute('data-intro-wait');
    }, 260);
    window.setTimeout(() => {
      wordmark.style.opacity = '1';
      intro.remove();
    }, 500);
  }, 520);
}

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

function initScrollProgress(
  accentRule: HTMLElement,
  reduceMotion: boolean,
) {
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

  return () => {
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
    if (frame) window.cancelAnimationFrame(frame);
  };
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
  return () => observer.disconnect();
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
        const requestedDelay = Number.parseInt(
          element.dataset.revealDelay ?? '0',
          10,
        );
        element.style.transitionDelay = `${Math.min(requestedDelay, 180)}ms`;
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
  return () => observer.disconnect();
}

function initCaseStudyNavigation() {
  const navigation =
    document.querySelector<HTMLElement>('[data-case-rail-nav]');
  if (!navigation) return;

  const links = Array.from(
    navigation.querySelectorAll<HTMLAnchorElement>('[data-case-rail-link]'),
  );
  const locations = links
    .map((link) => {
      const id = link.hash.slice(1);
      const heading = document.getElementById(id);
      return heading ? { heading, link } : null;
    })
    .filter(
      (
        location,
      ): location is { heading: HTMLElement; link: HTMLAnchorElement } =>
        location !== null,
    );
  if (locations.length === 0) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    const readingLine = window.innerHeight * 0.55;
    let activeIndex = 0;

    locations.forEach(({ heading }, index) => {
      if (heading.getBoundingClientRect().top <= readingLine) {
        activeIndex = index;
      }
    });

    locations.forEach(({ link }, index) => {
      if (index === activeIndex) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });

  return () => {
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
    if (frame) window.cancelAnimationFrame(frame);
  };
}

function initPatentPathWalkthrough(reduceMotion: boolean) {
  const walkthrough = document.querySelector<HTMLElement>(
    '[data-patentpath-walkthrough]',
  );
  if (!walkthrough) return;

  const scenes = Array.from(
    walkthrough.querySelectorAll<HTMLElement>('[data-patentpath-scene]'),
  );
  const figures = Array.from(
    walkthrough.querySelectorAll<HTMLElement>(
      '[data-patentpath-stage-figure]',
    ),
  );
  const buttons = Array.from(
    walkthrough.querySelectorAll<HTMLButtonElement>(
      '[data-patentpath-stage-button]',
    ),
  );

  const setActive = (screenIndex: number, activeScene?: HTMLElement) => {
    figures.forEach((figure, index) => {
      const isActive = index === screenIndex;
      figure.classList.toggle('is-active', isActive);
      figure.setAttribute('aria-hidden', String(!isActive));
    });

    buttons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === screenIndex));
    });

    scenes.forEach((scene) => {
      const isActive = activeScene
        ? scene === activeScene
        : Number.parseInt(scene.dataset.screenIndex ?? '-1', 10) ===
          screenIndex;
      scene.classList.toggle('is-active', isActive);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const screenIndex = Number.parseInt(
        button.dataset.screenIndex ?? '0',
        10,
      );
      const scene = scenes.find(
        (entry) =>
          Number.parseInt(entry.dataset.screenIndex ?? '-1', 10) ===
          screenIndex,
      );
      setActive(screenIndex, scene);
      scene?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (left, right) =>
            Math.abs(left.boundingClientRect.top - window.innerHeight / 2) -
            Math.abs(right.boundingClientRect.top - window.innerHeight / 2),
        )[0];
      if (!activeEntry) return;

      const scene = activeEntry.target as HTMLElement;
      const screenIndex = Number.parseInt(
        scene.dataset.screenIndex ?? '0',
        10,
      );
      setActive(screenIndex, scene);
    },
    {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    },
  );

  scenes.forEach((scene) => observer.observe(scene));
  return () => observer.disconnect();
}

export function initMotion() {
  activeCleanups.forEach((cleanup) => cleanup());
  activeCleanups = [];

  const reduceMotion = window.matchMedia(reducedMotionQuery).matches;
  initIntro(reduceMotion);

  const finePointer = window.matchMedia(finePointerQuery).matches;
  const accentRule = document.querySelector<HTMLElement>('.accent-rule');

  initVisitedState();
  document.documentElement.dataset.motion = 'ready';

  const revealCleanup = initReveals(
    reduceMotion || navigator.webdriver === true,
  );
  if (revealCleanup) activeCleanups.push(revealCleanup);

  for (const timeline of document.querySelectorAll<HTMLElement>(
    '[data-timeline]',
  )) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      timeline.classList.add('timeline--visible');
    } else {
      activeCleanups.push(initTimeline(timeline));
    }
  }

  const navigationCleanup = initCaseStudyNavigation();
  if (navigationCleanup) activeCleanups.push(navigationCleanup);

  const walkthroughCleanup = initPatentPathWalkthrough(reduceMotion);
  if (walkthroughCleanup) activeCleanups.push(walkthroughCleanup);

  const progressCleanup =
    accentRule && initScrollProgress(accentRule, reduceMotion);
  if (progressCleanup) activeCleanups.push(progressCleanup);
  if (reduceMotion || !finePointer) return;

  const hero = document.querySelector<HTMLElement>('[data-hero-motion]');
  if (hero) initHeroParallax(hero);

  for (const link of document.querySelectorAll<HTMLElement>(
    '[data-project-pointer-link]',
  )) {
    initProjectPointer(link);
  }
}
