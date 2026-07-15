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

  await visualLink.scrollIntoViewIfNeeded();
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
      overflowY: style.overflowY,
      top: box.top,
    };
  });
  const headerBottom = await header.evaluate(
    (element) => element.getBoundingClientRect().bottom,
  );

  expect(initial.top).toBeCloseTo(headerBottom, 0);
  expect(initial.bottom).toBeLessThanOrEqual(760);
  expect(initial.overflowY).toBe('auto');

  await page.evaluate(() => window.scrollTo(0, 600));

  const scrolledTop = await panel.evaluate(
    (element) => element.getBoundingClientRect().top,
  );

  expect(scrolledTop).toBeCloseTo(initial.top, 0);
  await expect(header).toHaveCSS('position', 'sticky');
});

test('/profile/ fits the identity rail without internal scrolling on a short desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/profile/');

  const panel = page.locator('.profile-identity__sticky');
  const name = page.locator('.profile-identity__heading h1');
  const panelDimensions = await panel.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
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
        return overflowX === 'hidden' || overflowX === 'clip';
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
