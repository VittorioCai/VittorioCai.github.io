import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const homeRoutes = ['/', '/de/', '/zh/'] as const;
const homeWidths = [320, 390, 768, 1440] as const;
const caseStudyRoutes = [
  '/work/patentpath/',
  '/de/work/patentpath/',
  '/zh/work/patentpath/',
  '/work/english-job-agent/',
  '/de/work/english-job-agent/',
  '/zh/work/english-job-agent/',
] as const;
const sectionPageRoutes = [
  '/work/',
  '/profile/',
  '/contact/',
  '/de/work/',
  '/de/profile/',
  '/de/contact/',
  '/zh/work/',
  '/zh/profile/',
  '/zh/contact/',
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth,
  );
}

test('Precision Atlas brings the journey and Selected Work into the desktop first viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/');

  const journey = page.locator('[data-hero-journey]');
  await expect(journey).toBeVisible();
  await expect(journey.locator('[data-journey-route-leg]')).toHaveCount(2);
  await expect(journey.locator('[data-journey-map-stop]')).toHaveCount(3);

  const geometry = await page.evaluate(() => ({
    heroBottom: document.querySelector('.hero')!.getBoundingClientRect().bottom,
    workHeadingTop: document
      .querySelector('#work .section-heading')!
      .getBoundingClientRect().top,
  }));

  expect(geometry.heroBottom).toBeLessThan(800);
  expect(geometry.workHeadingTop).toBeLessThanOrEqual(800);
});

test('the mobile first-paint headline is visible before intro motion completes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    window.sessionStorage.removeItem('vc-intro-played');
    window.sessionStorage.removeItem('vittorio-portfolio-visited');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const headline = await page.locator('.hero__title').evaluate((title) => {
    const titleBox = title.getBoundingClientRect();
    const style = getComputedStyle(title);
    const lineStates = [
      ...title.querySelectorAll<HTMLElement>('.hero__title-line'),
    ].map((line) => {
      const range = document.createRange();
      range.selectNodeContents(line);
      const clip = line.parentElement!.getBoundingClientRect();
      const lineBox = line.getBoundingClientRect();
      const lineStyle = getComputedStyle(line);
      const visibleTextRectangles = [...range.getClientRects()].filter(
        (rect) => {
          const visibleHeight =
            Math.min(window.innerHeight, clip.bottom, rect.bottom) -
            Math.max(0, clip.top, rect.top);

          return (
            rect.width > 0 &&
            rect.height > 0 &&
            visibleHeight >= rect.height * 0.5 &&
            rect.right > Math.max(0, clip.left) &&
            rect.left < Math.min(window.innerWidth, clip.right)
          );
        },
      ).length;

      return {
        height: lineBox.height,
        opacity: lineStyle.opacity,
        visibleTextRectangles,
      };
    });

    return {
      height: titleBox.height,
      lineStates,
      opacity: style.opacity,
    };
  });

  expect(headline.height).toBeGreaterThan(0);
  expect(headline.opacity).toBe('1');
  expect(headline.lineStates).toHaveLength(3);
  for (const line of headline.lineStates) {
    expect(line.height).toBeGreaterThan(0);
    expect(line.opacity).toBe('1');
    expect(line.visibleTextRectangles).toBeGreaterThan(0);
  }
});

test('the PatentPATH responsibility chapter clears the sticky header offset', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/work/patentpath/');

  await page
    .locator(
      '[data-case-rail-link][href="#patentpath-responsibility-heading"]',
    )
    .click();
  await expect(page).toHaveURL(/#patentpath-responsibility-heading$/);
  const target = page.locator('#patentpath-responsibility-heading');
  await expect(target).toBeInViewport();

  const geometry = await page.evaluate(() => ({
    headerBottom: document
      .querySelector('.site-header')!
      .getBoundingClientRect().bottom,
    targetTop: document
      .querySelector('#patentpath-responsibility-heading')!
      .getBoundingClientRect().top,
  }));

  expect(geometry.targetTop).toBeGreaterThanOrEqual(
    geometry.headerBottom + 16,
  );
});

test('PatentPATH chapter and screen indicators share the Atlas line weight', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/work/patentpath/');

  const indicators = await page.evaluate(() => {
    const chapter = document.querySelector<HTMLElement>(
      '[data-case-rail-link]',
    )!;
    const screen = document.querySelector<HTMLButtonElement>(
      '[data-patentpath-stage-button]',
    )!;

    return {
      chapterLine: getComputedStyle(chapter).borderBottomWidth,
      screenLine: getComputedStyle(screen, '::after').height,
    };
  });

  expect(indicators.chapterLine).toBe('1px');
  expect(indicators.screenLine).toBe('1px');
});

test('the project language switcher preserves the PatentPATH route', async ({
  page,
}) => {
  await page.goto('/work/patentpath/');
  await page
    .getByRole('navigation', { name: 'Language selection' })
    .getByRole('link', { name: 'DE', exact: true })
    .click();

  await expect(page).toHaveURL(/\/de\/work\/patentpath\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('case navigation stays visible and follows the PatentPATH reading position', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/patentpath/');

  const rail = page.locator('[data-case-rail-inner]');
  const navigation = page.locator('[data-case-rail-nav]');
  const links = navigation.locator('[data-case-rail-link]');

  await expect(rail).toHaveCSS('position', 'sticky');
  await expect(links).toHaveCount(6);
  await expect(links.first()).toHaveAttribute('aria-current', 'location');

  await page
    .locator('#patentpath-architecture-heading')
    .evaluate((heading) => heading.scrollIntoView({ block: 'center' }));

  await expect(
    navigation.locator(
      '[data-case-rail-link][href="#patentpath-architecture-heading"]',
    ),
  ).toHaveAttribute('aria-current', 'location');
});

test('the PatentPATH scroll walkthrough switches real product screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/patentpath/');

  const walkthrough = page.locator('[data-patentpath-walkthrough]');
  const scenes = walkthrough.locator('[data-patentpath-scene]');
  const figures = walkthrough.locator('[data-patentpath-stage-figure]');
  const controls = walkthrough.locator('[data-patentpath-stage-button]');

  await expect(walkthrough).toBeVisible();
  await expect(scenes).toHaveCount(4);
  await expect(figures).toHaveCount(3);
  await expect(controls).toHaveCount(3);
  await expect(figures.first()).toHaveAttribute('aria-hidden', 'false');

  await scenes
    .nth(1)
    .evaluate((scene) => scene.scrollIntoView({ block: 'center' }));
  await expect(figures.nth(1)).toHaveAttribute('aria-hidden', 'false');

  const stickyGeometry = await page.evaluate(() => ({
    headerBottom: document
      .querySelector('.site-header')!
      .getBoundingClientRect().bottom,
    stageTop: document
      .querySelector('.patentpath-story__stage')!
      .getBoundingClientRect().top,
  }));
  expect(stickyGeometry.stageTop).toBeGreaterThan(
    stickyGeometry.headerBottom + 16,
  );

  await controls.nth(2).click();
  await expect(controls.nth(2)).toHaveAttribute('aria-pressed', 'true');
  await expect(figures.nth(2)).toHaveAttribute('aria-hidden', 'false');
});

test('/work/patentpath/ presents a loaded screenshot-led product story', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/work/patentpath/');

  const story = page.locator('[data-patentpath-story]');
  const screenshots = story.locator('[data-patentpath-screenshot]');

  await expect(story).toBeVisible();
  await expect(screenshots).toHaveCount(3);

  for (const screenshot of await screenshots.all()) {
    await expect(screenshot).toBeVisible();
    await expect(screenshot).toHaveJSProperty('complete', true);
    expect(
      await screenshot.evaluate((image) =>
        image instanceof HTMLImageElement ? image.naturalWidth : 0,
      ),
    ).toBeGreaterThan(1000);
  }

  const overview = page.locator(
    '[data-patentpath-screenshot][src="/projects/patentpath/overview.png"]',
  );
  const overviewBox = await overview.boundingBox();

  expect(overviewBox?.width).toBeGreaterThan(450);
});

test('the editorial typeface is self-hosted and applied to body and display text', async ({
  page,
}) => {
  const remoteFontRequests: string[] = [];

  page.on('request', (request) => {
    if (/fonts\.(?:googleapis|gstatic)\.com/.test(request.url())) {
      remoteFontRequests.push(request.url());
    }
  });

  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const typography = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    heading: getComputedStyle(document.querySelector('main h1')!).fontFamily,
    loaded: document.fonts.check('700 64px "Schibsted Grotesk Variable"'),
  }));

  expect(typography.body).toContain('Schibsted Grotesk Variable');
  expect(typography.heading).toContain('Schibsted Grotesk Variable');
  expect(typography.loaded).toBe(true);
  expect(remoteFontRequests).toEqual([]);
});

test('the Chinese desktop hero preserves its three authored headline lines', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('/zh/');
  await page.evaluate(() => document.fonts.ready);

  const lineCounts = await page.locator('.hero__title-line').evaluateAll(
    (lines) =>
      lines.map((line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        return range.getClientRects().length;
      }),
  );

  expect(lineCounts).toEqual([1, 1, 1]);
});

test('the hero title entrance keeps text fully opaque', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-hero-motion]')).toHaveClass(
    /hero--animate/,
  );

  const animatedOpacityKeyframes = await page
    .locator('.hero__title-line')
    .first()
    .evaluate((line) =>
      line
        .getAnimations()
        .flatMap((animation) =>
          animation.effect instanceof KeyframeEffect
            ? animation.effect.getKeyframes()
            : [],
        )
        .map((keyframe) => keyframe.opacity)
        .filter((opacity) => opacity !== undefined),
    );

  expect(animatedOpacityKeyframes).toEqual([]);
});

test('the mobile menu opens with short transform and opacity feedback', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const siteHeader = page.locator('[data-site-header]');
  const menuButton = siteHeader.getByRole('button', {
    name: 'Menu',
    exact: true,
  });
  const navigation = siteHeader.getByRole('navigation', {
    name: 'Primary navigation',
  });

  await menuButton.click();

  const motion = await navigation.evaluate((element) => {
    const style = getComputedStyle(element);

    return {
      properties: style.transitionProperty
        .split(',')
        .map((value) => value.trim()),
      durations: style.transitionDuration
        .split(',')
        .map((value) => Number.parseFloat(value) * 1000),
    };
  });

  expect(motion.properties).toEqual(
    expect.arrayContaining(['opacity', 'transform']),
  );
  expect(
    motion.durations.every((duration) => duration > 0 && duration <= 200),
  ).toBe(true);
});

test('the primary call to action acknowledges pointer press', async ({
  page,
}) => {
  await page.goto('/');

  const primaryAction = page.getByRole('link', {
    name: 'View projects',
    exact: true,
  });

  await primaryAction.hover();
  await page.mouse.down();
  await page.waitForTimeout(120);

  const translateY = await primaryAction.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
  });

  await page.mouse.up();
  expect(translateY).toBeCloseTo(1, 1);
});

test('the homepage stages its hero through masked kinetic lines', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('[data-hero-motion]')).toHaveClass(
    /hero--animate/,
  );

  const titleClips = page.locator('.hero__title-clip');
  await expect(titleClips).toHaveCount(3);

  const motion = await titleClips.first().evaluate((clip) => {
    const line = clip.querySelector('.hero__title-line');
    const keyframes = line
      ?.getAnimations()
      .flatMap((animation) =>
        animation.effect instanceof KeyframeEffect
          ? animation.effect.getKeyframes()
          : [],
      );

    return {
      clipPath: getComputedStyle(clip).clipPath,
      firstTransform: keyframes?.[0]?.transform,
    };
  });

  expect(motion.clipPath).toContain('inset');
  expect(motion.firstTransform).toContain('110%');
});

test('the homepage motion controller responds to scroll and pointer position', async ({
  page,
}) => {
  await page.goto('/');
  await page.waitForFunction(
    () => document.documentElement.dataset.motion === 'ready',
  );

  const hero = page.locator('[data-hero-motion]');
  await expect(hero).toHaveCount(1);

  const heroBox = await hero.boundingBox();
  expect(heroBox).not.toBeNull();
  await page.mouse.move(heroBox!.x + heroBox!.width * 0.8, heroBox!.y + 160);
  await page.waitForTimeout(50);

  const pointerX = await hero.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).getPropertyValue('--pointer-x')),
  );
  expect(Math.abs(pointerX)).toBeGreaterThan(0.2);

  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await page.waitForFunction(
    () =>
      Number.parseFloat(
        getComputedStyle(document.querySelector('.accent-rule')!).getPropertyValue(
          '--scroll-progress',
        ),
      ) > 0.95,
  );
});

test('the featured project visual offers a pointer-follow case study cue', async ({
  page,
}) => {
  await page.goto('/');

  const visualLink = page.locator('[data-project-pointer-link]');
  await expect(visualLink).toHaveCount(1);
  await expect(visualLink).toHaveAttribute('href', '/work/patentpath/');
  await expect(visualLink.locator('[data-project-pointer-pill]')).toHaveText(
    'Case study',
  );
  await expect(visualLink.locator('[data-project-motion-layer]')).toHaveCount(2);

  const preview = visualLink.locator('[data-patent-preview]');
  const screens = preview.locator('[data-patent-preview-screen]');

  await expect(preview).toHaveCount(1);
  await expect(screens).toHaveCount(3);
  for (const screen of await screens.all()) {
    await expect(screen).toHaveAttribute('alt', '');
  }
  await expect(screens.nth(0)).toHaveAttribute(
    'src',
    '/projects/patentpath/overview.png',
  );
  await expect(screens.nth(1)).toHaveAttribute(
    'src',
    '/projects/patentpath/patents.png',
  );
  await expect(screens.nth(2)).toHaveAttribute(
    'src',
    '/projects/patentpath/risk-check.png',
  );
  await expect(visualLink.locator('.patent-workspace')).toHaveCount(0);

  await visualLink.scrollIntoViewIfNeeded();
  await expect(
    visualLink.locator('.patent-preview__screen--risk'),
  ).toHaveCSS('opacity', '1', { timeout: 6_000 });

  const riskAnimation = await visualLink
    .locator('.patent-preview__screen--risk')
    .evaluate((element) => {
      const animation = element.getAnimations()[0];
      const timing =
        animation?.effect instanceof KeyframeEffect
          ? animation.effect.getComputedTiming()
          : null;

      return {
        count: element.getAnimations().length,
        duration: timing?.duration,
        iterations: timing?.iterations,
      };
    });

  expect(riskAnimation).toEqual({
    count: 1,
    duration: 4500,
    iterations: 1,
  });

  const previewTransform = await preview.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);

    return {
      scaleX: matrix.a,
      skewY: matrix.b,
      skewX: matrix.c,
      scaleY: matrix.d,
      translateX: matrix.e,
      translateY: matrix.f,
    };
  });

  expect(previewTransform.scaleX).toBeCloseTo(1, 3);
  expect(previewTransform.skewY).toBeCloseTo(0, 3);
  expect(previewTransform.skewX).toBeCloseTo(0, 3);
  expect(previewTransform.scaleY).toBeCloseTo(1, 3);
  expect(previewTransform.translateX).toBeCloseTo(0, 3);
  expect(previewTransform.translateY).toBeCloseTo(0, 3);

  const box = await visualLink.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.65, box!.y + box!.height * 0.45);
  await page.waitForTimeout(80);

  const pointerX = await visualLink.evaluate((element) =>
    Number.parseFloat(element.style.getPropertyValue('--pointer-x')),
  );
  expect(pointerX).toBeGreaterThan(box!.width * 0.5);

  const pillScale = await visualLink
    .locator('[data-project-pointer-pill]')
    .evaluate(
      (element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
    );
  expect(pillScale).toBeGreaterThan(0.8);

  const pillBox = await visualLink
    .locator('[data-project-pointer-pill]')
    .boundingBox();
  expect(pillBox?.width).toBeLessThanOrEqual(80);
});

test('the mobile featured project places the product between lead and proof', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const lead = page.locator('.project-featured__lead');
  const visual = page.locator('.project-featured__visual');
  const proof = page.locator('.project-featured__proof');
  const geometry = await Promise.all([
    lead.boundingBox(),
    visual.boundingBox(),
    proof.boundingBox(),
  ]);

  expect(geometry.every(Boolean)).toBe(true);
  expect(geometry[0]!.y + geometry[0]!.height).toBeLessThanOrEqual(
    geometry[1]!.y,
  );
  expect(geometry[1]!.y + geometry[1]!.height).toBeLessThanOrEqual(
    geometry[2]!.y,
  );
});

test('ambient motion settles instead of looping forever', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.status-dot')).toHaveCSS(
    'animation-iteration-count',
    '2',
  );

  await page.goto('/profile/');
  await expect(page.locator('.journey-map__current-ring')).toHaveCSS(
    'animation-iteration-count',
    '3',
  );
});

test('the compact header uses a deliberate language row at 320px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toHaveCount(0);

  const header = page.locator('[data-site-header]');
  const wordmark = await header.locator('[data-wordmark]').boundingBox();
  const menu = await header.getByRole('button', { name: 'Menu' }).boundingBox();
  const languages = await header
    .getByRole('navigation', { name: 'Language selection' })
    .boundingBox();

  expect(wordmark).not.toBeNull();
  expect(menu).not.toBeNull();
  expect(languages).not.toBeNull();
  expect(
    Math.abs(
      wordmark!.y +
        wordmark!.height / 2 -
        (menu!.y + menu!.height / 2),
    ),
  ).toBeLessThan(2);
  expect(languages!.y).toBeGreaterThanOrEqual(
    wordmark!.y + wordmark!.height,
  );
  await expectNoHorizontalOverflow(page);
});

test('the current primary route is exposed and visually addressable', async ({
  page,
}) => {
  await page.goto('/work/patentpath/');

  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Work', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});

test('internal navigation uses reduced-motion-safe Astro view transitions', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.locator('meta[name="astro-view-transitions-enabled"]'),
  ).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'ready');
});

test('the PatentPATH product preview stays static with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const preview = page.locator('[data-patent-preview]');
  const overview = preview.locator('.patent-preview__screen--overview');
  const animatedScreens = await preview
    .locator('[data-patent-preview-screen]')
    .evaluateAll((screens) =>
      screens.map((screen) => getComputedStyle(screen).animationName),
    );

  await expect(overview).toHaveCSS('opacity', '1');
  expect(animatedScreens).toEqual(['none', 'none', 'none']);
});

test('reduced motion exposes the Atlas route, headline, and PatentPATH controls immediately', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/');

  const route = await page
    .locator('[data-hero-journey] [data-journey-route-leg]')
    .evaluateAll((legs) =>
      legs.map((leg) => {
        const style = getComputedStyle(leg);

        return {
          animationName: style.animationName,
          strokeDashoffset: style.strokeDashoffset,
        };
      }),
    );
  const stops = await page
    .locator('[data-hero-journey] [data-journey-map-stop]')
    .evaluateAll((markers) =>
      markers.map((marker) => ({
        opacity: getComputedStyle(marker).opacity,
        visible: marker.getBoundingClientRect().width > 0,
      })),
    );
  const headlineLines = await page
    .locator('.hero__title-line')
    .evaluateAll((lines) =>
      lines.map((line) => ({
        animationName: getComputedStyle(line).animationName,
        opacity: getComputedStyle(line).opacity,
        visible: line.getBoundingClientRect().height > 0,
      })),
    );

  expect(route).toHaveLength(2);
  expect(
    route.every(
      (leg) =>
        leg.animationName === 'none' &&
        Number.parseFloat(leg.strokeDashoffset) === 0,
    ),
  ).toBe(true);
  expect(stops).toHaveLength(3);
  expect(
    stops.every((stop) => stop.opacity === '1' && stop.visible),
  ).toBe(true);
  expect(headlineLines).toHaveLength(3);
  expect(
    headlineLines.every(
      (line) =>
        line.animationName === 'none' &&
        line.opacity === '1' &&
        line.visible,
    ),
  ).toBe(true);

  await page.goto('/work/patentpath/');
  const finalControl = page
    .locator('[data-patentpath-stage-button]')
    .last();
  await finalControl.click();
  await expect(finalControl).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.locator('[data-patentpath-stage-figure]').last(),
  ).toHaveAttribute('aria-hidden', 'false');
});

test('/profile/ presents a sticky identity rail and animated journey on desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/profile/');

  await expect(page.locator('[data-profile-page]')).toHaveCSS(
    'display',
    'grid',
  );
  await expect(page.locator('.profile-identity__sticky')).toHaveCSS(
    'position',
    'sticky',
  );

  const journeyAnimations = await page
    .locator('[data-journey-route-leg]')
    .evaluateAll((legs) =>
      legs.map((leg) => getComputedStyle(leg).animationName),
    );

  expect(journeyAnimations).toHaveLength(2);
  expect(
    journeyAnimations.every((name) => name.includes('journey-route-in')),
  ).toBe(true);

  const markersContained = await page
    .locator('[data-profile-journey] svg')
    .evaluate((svg) => {
      const frame = svg.getBoundingClientRect();

      return [...svg.querySelectorAll('[data-journey-map-stop]')].every(
        (marker) => {
          const box = marker.getBoundingClientRect();

          return (
            box.left >= frame.left &&
            box.right <= frame.right &&
            box.top >= frame.top &&
            box.bottom <= frame.bottom
          );
        },
      );
    });

  expect(markersContained).toBe(true);
});

test('/profile/ presents its contact actions as one aligned icon row', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/profile/');

  const actions = page.locator('[data-profile-action]');

  await expect(actions).toHaveCount(4);
  await expect(actions.locator('[data-profile-action-icon]')).toHaveCount(4);

  const geometry = await actions.evaluateAll((links) =>
    links.map((link) => {
      const box = link.getBoundingClientRect();

      return {
        height: box.height,
        top: box.top,
        width: box.width,
      };
    }),
  );

  expect(Math.max(...geometry.map(({ top }) => top)) - Math.min(...geometry.map(({ top }) => top))).toBeLessThan(1);
  expect(Math.max(...geometry.map(({ width }) => width)) - Math.min(...geometry.map(({ width }) => width))).toBeLessThan(1);
  expect(geometry.every(({ height }) => height >= 44)).toBe(true);
});

test('/profile/ gives the Atlas route map full rail authority on desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 760 });
  await page.goto('/profile/');

  const journey = page.locator('[data-profile-journey]');
  await expect(journey).toHaveAttribute('data-journey-variant', 'profile');

  const frame = await journey.locator('.journey-map__frame').boundingBox();
  expect(frame).not.toBeNull();
  expect(frame!.width).toBeGreaterThanOrEqual(280);
});

test('/profile/ keeps the desktop identity panel anchored within the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 760 });
  await page.goto('/profile/');

  const header = page.locator('.site-header');
  const panel = page.locator('.profile-identity__sticky');
  const initial = await panel.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    return {
      bottom: box.bottom,
      clientHeight: element.clientHeight,
      overflowY: style.overflowY,
      scrollHeight: element.scrollHeight,
      top: box.top,
    };
  });
  const headerBottom = await header.evaluate(
    (element) => element.getBoundingClientRect().bottom,
  );

  expect(initial.top).toBeCloseTo(headerBottom, 0);
  expect(initial.bottom).toBeCloseTo(760, 0);
  expect(initial.scrollHeight).toBeLessThanOrEqual(initial.clientHeight);
  expect(initial.overflowY).toBe('visible');

  await page.evaluate(() => window.scrollTo(0, 700));

  const scrolled = await panel.evaluate((element) => {
    const panelBox = element.getBoundingClientRect();
    const selectors = [
      '.profile-identity__monogram',
      '.profile-identity__heading h1',
      '.profile-identity__links',
      '[data-profile-journey]',
    ];

    return {
      panelTop: panelBox.top,
      items: selectors.map((selector) => {
        const item = element.querySelector(selector);
        const box = item?.getBoundingClientRect();

        return {
          contained: item ? element.contains(item) : false,
          height: box?.height ?? 0,
          top: box?.top ?? Number.NaN,
        };
      }),
    };
  });

  expect(scrolled.panelTop).toBeCloseTo(initial.top, 0);
  for (const item of scrolled.items) {
    expect(item.contained).toBe(true);
    expect(item.top).toBeGreaterThanOrEqual(headerBottom);
    expect(item.top + item.height).toBeLessThanOrEqual(760);
  }
  await expect(header).toHaveCSS('position', 'sticky');
});

test('/profile/ fits the identity rail without internal scrolling on a short desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/profile/');

  const panel = page.locator('.profile-identity__sticky');
  const name = page.locator('.profile-identity__heading h1');
  const panelDimensions = await panel.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const first = element.querySelector('.profile-identity__monogram');
    const last = element.querySelector('[data-profile-journey]');
    const firstBox = first?.getBoundingClientRect();
    const lastBox = last?.getBoundingClientRect();

    return {
      bottom: box.bottom,
      bottomGap: lastBox ? box.bottom - lastBox.bottom : Number.NaN,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      topGap: firstBox ? firstBox.top - box.top : Number.NaN,
    };
  });
  const nameMetrics = await name.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);

    return {
      clientWidth: element.clientWidth,
      fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
      lineCount: range.getClientRects().length,
      scrollWidth: element.scrollWidth,
    };
  });

  expect(panelDimensions.scrollHeight).toBeLessThanOrEqual(
    panelDimensions.clientHeight,
  );
  expect(panelDimensions.bottom).toBeCloseTo(720, 0);
  expect(panelDimensions.topGap).toBeCloseTo(panelDimensions.bottomGap, 0);
  expect(nameMetrics.fontSize).toBeLessThanOrEqual(40);
  expect(nameMetrics.lineCount).toBe(1);
  expect(nameMetrics.scrollWidth).toBeLessThanOrEqual(nameMetrics.clientWidth);
});

test('/profile/ stacks the identity rail without overflow on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/profile/');

  await expect(page.locator('.profile-identity__sticky')).toHaveCSS(
    'position',
    'static',
  );
  await expectNoHorizontalOverflow(page);
});

test('/profile/ aligns school logos with school copy on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/profile/');

  const alignments = await page
    .locator('.profile-timeline__institution')
    .evaluateAll((entries) =>
      entries.map((entry) => {
        const logo = entry.querySelector('.profile-timeline__logo');
        const content = entry.querySelector('.profile-timeline__content');

        return {
          logoTop: logo?.getBoundingClientRect().top,
          contentTop: content?.getBoundingClientRect().top,
        };
      }),
    );

  expect(alignments).toHaveLength(2);
  for (const alignment of alignments) {
    expect(alignment.logoTop).toBeDefined();
    expect(alignment.contentTop).toBeDefined();
    expect(Math.abs(alignment.logoTop! - alignment.contentTop!)).toBeLessThan(
      4,
    );
  }
});

test('/profile/ keeps the journey visible with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/profile/');

  const routeStates = await page
    .locator('[data-journey-route-leg]')
    .evaluateAll((legs) =>
      legs.map((leg) => {
        const style = getComputedStyle(leg);

        return {
          animationName: style.animationName,
          strokeDashoffset: style.strokeDashoffset,
        };
      }),
    );

  expect(routeStates).toHaveLength(2);
  for (const routeState of routeStates) {
    expect(routeState.animationName).toBe('none');
    expect(Number.parseFloat(routeState.strokeDashoffset)).toBe(0);
  }
});

const mobileNavigationLocales = [
  {
    path: '/',
    menu: 'Menu',
    navigation: 'Primary navigation',
    firstLink: 'Work',
  },
  {
    path: '/de/',
    menu: 'Menü',
    navigation: 'Hauptnavigation',
    firstLink: 'Projekte',
  },
  {
    path: '/zh/',
    menu: '菜单',
    navigation: '主导航',
    firstLink: '项目',
  },
] as const;

for (const locale of mobileNavigationLocales) {
  test(`${locale.path} exposes keyboard-operable localized mobile navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(locale.path);

    const siteHeader = page.locator('[data-site-header]');
    const menuButton = siteHeader.getByRole('button', {
      name: locale.menu,
      exact: true,
    });
    const firstNavigationLink = siteHeader
      .getByRole('navigation', { name: locale.navigation })
      .getByRole('link', { name: locale.firstLink, exact: true });

    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await menuButton.focus();
    await menuButton.press('Enter');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(firstNavigationLink).toBeFocused();
  });
}

for (const path of homeRoutes) {
  for (const width of homeWidths) {
    test(`${path} has no horizontal overflow at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expectNoHorizontalOverflow(page);
    });
  }
}

test('/de/ reflows enlarged text at 320px without clipping overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/de/');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });

  const clippedElements = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((element) => {
        const overflowX = getComputedStyle(element).overflowX;
        const isDecorativeMedia =
          element.getAttribute('role') === 'img' ||
          element.closest('[aria-hidden="true"]') !== null;

        return (
          !isDecorativeMedia &&
          (overflowX === 'hidden' || overflowX === 'clip')
        );
      })
      .map((element) => element.tagName.toLowerCase()),
  );

  expect(clippedElements).toEqual([]);
  await expectNoHorizontalOverflow(page);
});

for (const path of [...caseStudyRoutes, ...sectionPageRoutes]) {
  test(`${path} has no horizontal overflow at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(path);
    await expectNoHorizontalOverflow(page);
  });
}

const auditedRoutes = [
  '/',
  '/de/',
  '/zh/',
  '/work/',
  '/profile/',
  '/contact/',
  '/work/patentpath/',
  '/work/english-job-agent/',
] as const;

for (const path of auditedRoutes) {
  test(`${path} has sound landmarks, headings, and no serious axe violations`, async ({
    page,
  }) => {
    await page.goto(path);

    await expect(page.locator('[data-site-header]')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveCount(1);

    const scan = await new AxeBuilder({ page })
      .exclude('astro-dev-toolbar')
      .analyze();
    const seriousViolations = scan.violations.filter(
      ({ impact }) => impact === 'serious' || impact === 'critical',
    );

    expect(seriousViolations).toEqual([]);
  });
}
