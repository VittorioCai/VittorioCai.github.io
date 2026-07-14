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

for (const path of caseStudyRoutes) {
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
