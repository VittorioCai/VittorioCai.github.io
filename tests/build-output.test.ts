import { execFileSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { load } from 'cheerio';
import { beforeAll, describe, expect, it } from 'vitest';

import {
  containsGermanMobileNumber,
  syntheticGermanMobileFixtures,
} from './phone-privacy';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const distRoot = fileURLToPath(new URL('../dist/', import.meta.url));
const siteUrl = 'https://vittoriocai.github.io';

const localizedHomepages = [
  {
    file: 'index.html',
    lang: 'en',
    workPath: '/work/',
    demoNote: 'Free-tier backend — first load may take up to 40 s to wake.',
  },
  {
    file: 'de/index.html',
    lang: 'de',
    workPath: '/de/work/',
    demoNote: 'Backend im Free-Tier — der erste Aufruf kann bis zu 40 s dauern.',
  },
  {
    file: 'zh/index.html',
    lang: 'zh-CN',
    workPath: '/zh/work/',
    demoNote: '演示后端为免费实例，首次打开约需 40 秒唤醒。',
  },
] as const;

const workPages = [
  {
    file: 'work/index.html',
    lang: 'en',
    pipelineStages: [
      'Public ATS feeds',
      'Language check',
      'Ranked digest',
    ],
  },
  {
    file: 'de/work/index.html',
    lang: 'de',
    pipelineStages: [
      'Öffentliche ATS-Feeds',
      'Sprachprüfung',
      'Priorisierte Übersicht',
    ],
  },
  {
    file: 'zh/work/index.html',
    lang: 'zh-CN',
    pipelineStages: [
      '公开 ATS 数据源',
      '语言要求判断',
      '岗位优先级摘要',
    ],
  },
] as const;

const profilePages = [
  {
    file: 'profile/index.html',
    lang: 'en',
    languageHeading: 'Languages',
    journeyStops: ['Florence', 'Wenzhou', 'Heilbronn'],
  },
  {
    file: 'de/profile/index.html',
    lang: 'de',
    languageHeading: 'Sprachen',
    journeyStops: ['Florenz', 'Wenzhou', 'Heilbronn'],
  },
  {
    file: 'zh/profile/index.html',
    lang: 'zh-CN',
    languageHeading: '语言',
    journeyStops: ['佛罗伦萨', '温州', '海尔布隆'],
  },
] as const;

const contactPages = [
  { file: 'contact/index.html', lang: 'en' },
  { file: 'de/contact/index.html', lang: 'de' },
  { file: 'zh/contact/index.html', lang: 'zh-CN' },
] as const;

const caseStudyPages = [
  {
    file: 'work/patentpath/index.html',
    lang: 'en',
    project: 'patentpath',
    publicLink: 'https://new-patent-path.vercel.app',
  },
  {
    file: 'de/work/patentpath/index.html',
    lang: 'de',
    project: 'patentpath',
    publicLink: 'https://new-patent-path.vercel.app',
  },
  {
    file: 'zh/work/patentpath/index.html',
    lang: 'zh-CN',
    project: 'patentpath',
    publicLink: 'https://new-patent-path.vercel.app',
  },
  {
    file: 'work/english-job-agent/index.html',
    lang: 'en',
    project: 'english-job-agent',
    publicLink:
      'https://github.com/VittorioCai/english-job-agent-germany',
  },
  {
    file: 'de/work/english-job-agent/index.html',
    lang: 'de',
    project: 'english-job-agent',
    publicLink:
      'https://github.com/VittorioCai/english-job-agent-germany',
  },
  {
    file: 'zh/work/english-job-agent/index.html',
    lang: 'zh-CN',
    project: 'english-job-agent',
    publicLink:
      'https://github.com/VittorioCai/english-job-agent-germany',
  },
] as const;

beforeAll(() => {
  execFileSync('npm', ['run', 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
  });
});

function loadHomepage(file: string) {
  const outputPath = fileURLToPath(
    new URL(`../dist/${file}`, import.meta.url),
  );

  expect(existsSync(outputPath)).toBe(true);

  return load(readFileSync(outputPath, 'utf8'));
}

function parseJsonLdScripts($: ReturnType<typeof load>) {
  return $('script[type="application/ld+json"]')
    .map((_, element) => JSON.parse($(element).text()) as unknown)
    .get();
}

function listHtmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) return listHtmlFiles(path);

    return extname(path) === '.html' ? [path] : [];
  });
}

describe.each(localizedHomepages)('$file', ({
  file,
  lang,
  workPath,
  demoNote,
}) => {
  it(`renders the ${lang} homepage contract`, () => {
    const $ = loadHomepage(file);

    expect($('html').attr('lang')).toBe(lang);
    expect($('main')).toHaveLength(1);
    expect($('#work')).toHaveLength(1);
    expect(
      $('[data-project-id="patentpath"]').first().attr('data-featured'),
    ).toBe('true');
    expect($(`a[href="${workPath}"]`).length).toBeGreaterThan(0);

    const demoNotes = $('.demo-note');
    const patentpathActions = $('[data-project-id="patentpath"]')
      .first()
      .find('.text-actions');

    expect(demoNotes).toHaveLength(1);
    expect(demoNotes.text().trim()).toBe(demoNote);
    expect(
      demoNotes.closest('[data-project-id]').attr('data-project-id'),
    ).toBe('patentpath');
    expect(
      patentpathActions.find(
        'a[href="https://new-patent-path.vercel.app"] + .demo-note',
      ),
    ).toHaveLength(1);
  });

  it(`publishes complete ${lang} discovery and contact metadata`, () => {
    const $ = loadHomepage(file);
    const path = file === 'index.html' ? '/' : `/${file.replace('index.html', '')}`;
    const alternates: Record<string, string> = {};

    $('link[rel="alternate"]').each((_, element) => {
      const hreflang = $(element).attr('hreflang');
      const href = $(element).attr('href');

      if (hreflang && href) alternates[hreflang] = href;
    });

    expect($('link[rel="canonical"]').attr('href')).toBe(`${siteUrl}${path}`);
    expect(alternates).toEqual({
      en: `${siteUrl}/`,
      de: `${siteUrl}/de/`,
      'zh-CN': `${siteUrl}/zh/`,
      'x-default': `${siteUrl}/`,
    });
    expect($('link[rel="icon"]').attr('href')).toBe('/favicon.svg');
    expect($('meta[property="og:image"]').attr('content')).toBe(
      `${siteUrl}/og-card.png`,
    );
    expect($('a[href="/Vittorio-Cai-CV-English.pdf"]').length).toBeGreaterThan(
      0,
    );
  });
});

describe.each(workPages)('$file', ({ file, lang, pipelineStages }) => {
  it(`renders the ${lang} work-page contract`, () => {
    const $ = loadHomepage(file);

    expect($('html').attr('lang')).toBe(lang);
    expect($('#work')).toHaveLength(1);
    expect($('main h1')).toHaveLength(1);
    expect($('[data-project-id]')).toHaveLength(4);
    expect(
      $('[data-project-id="patentpath"]').first().attr('data-featured'),
    ).toBe('true');
  });

  it(`renders the ${lang} job-agent pipeline labels`, () => {
    const $ = loadHomepage(file);

    const jobAgentVisual = $(
      '[data-project-visual="english-job-agent"]',
    ).first();

    expect(jobAgentVisual).toHaveLength(1);
    expect(
      jobAgentVisual
        .find('.pipeline-stage')
        .map((_, element) => $(element).text().trim())
        .get(),
    ).toEqual(pipelineStages);
  });
});

describe.each(profilePages)('$file', ({
  file,
  lang,
  languageHeading,
  journeyStops,
}) => {
  it(`renders the ${lang} profile-page contract`, () => {
    const $ = loadHomepage(file);

    expect($('html').attr('lang')).toBe(lang);
    expect($('main h1')).toHaveLength(1);

    for (const id of ['profile', 'experience', 'skills']) {
      expect($(`#${id}`)).toHaveLength(1);
    }

    const languageGroup = $('[data-skill-group="languages"]');

    expect(languageGroup).toHaveLength(1);
    expect(languageGroup.find('h3').text().trim()).toBe(languageHeading);

    expect($('[data-profile-identity]')).toHaveLength(1);
    expect($('[data-profile-monogram]').text().trim()).toBe('VC');
    expect($('[data-profile-journey]')).toHaveLength(1);
    expect(
      $('[data-journey-stop]')
        .map((_, element) => $(element).text().trim())
        .get(),
    ).toEqual(journeyStops);
    expect($('[data-journey-land] path').length).toBeGreaterThan(3);
    expect(
      $('[data-journey-land] path').first().attr('d')?.length,
    ).toBeGreaterThan(1000);
    expect($('[data-journey-route-leg]')).toHaveLength(2);
    expect($('[data-journey-map-stop]')).toHaveLength(3);
    expect($('[data-current-stop]')).toHaveLength(1);
    expect(
      $(
        '[data-profile-journey] img, [data-profile-journey] iframe, [data-profile-journey] script',
      ),
    ).toHaveLength(0);
    expect($('a[href="mailto:vittorio.cai@tum.de"]')).toHaveLength(1);
    expect(
      $('a[href="https://linkedin.com/in/vittorio-cai"]'),
    ).toHaveLength(1);
    expect($('a[href="https://github.com/VittorioCai"]')).toHaveLength(1);
    const cvLink = $('a[href="/Vittorio-Cai-CV-English.pdf"]');

    expect(cvLink).toHaveLength(1);
    expect(cvLink.text().trim()).toBe('CV · EN');
    expect(cvLink.attr('aria-label')).toBeTruthy();

    const profileActions = $('[data-profile-action]');

    expect(profileActions).toHaveLength(4);
    expect(
      profileActions
        .map((_, element) => $(element).attr('data-profile-action'))
        .get(),
    ).toEqual(['email', 'linkedin', 'github', 'cv']);
    expect(profileActions.find('[data-profile-action-icon]')).toHaveLength(4);
    profileActions.each((_, element) => {
      expect($(element).attr('aria-label')).toBeTruthy();
      expect(
        $(element)
          .find('[data-profile-action-icon]')
          .attr('aria-hidden'),
      ).toBe('true');
    });

    const educationLogos = $('[data-education-logo]');

    expect(educationLogos).toHaveLength(2);
    expect(
      educationLogos
        .map((_, element) => $(element).attr('src'))
        .get(),
    ).toEqual([
      '/institutions/tum-logo.svg',
      '/institutions/wenzhou-university-logo.svg',
    ]);
    expect(
      educationLogos
        .map((_, element) => $(element).attr('alt'))
        .get(),
    ).toEqual(['', '']);

    for (const src of educationLogos
      .map((_, element) => $(element).attr('src'))
      .get()) {
      expect(existsSync(join(distRoot, src.slice(1)))).toBe(true);
    }
  });
});

describe.each(contactPages)('$file', ({ file, lang }) => {
  it(`renders the ${lang} contact-page contract`, () => {
    const $ = loadHomepage(file);

    expect($('html').attr('lang')).toBe(lang);
    expect($('main h1')).toHaveLength(1);
    expect($('#contact')).toHaveLength(1);
    expect($('a[href="mailto:vittorio.cai@tum.de"]')).toHaveLength(1);
  });
});

describe.each(caseStudyPages)('$file', ({
  file,
  lang,
  project,
  publicLink,
}) => {
  it(`renders the ${lang} ${project} case-study contract`, () => {
    const $ = loadHomepage(file);
    const article = $('main article');

    expect($('html').attr('lang')).toBe(lang);
    expect(article).toHaveLength(1);
    expect(
      article.find('[data-case-section="responsibility"]').text().trim()
        .length,
    ).toBeGreaterThan(20);
    expect(
      parseJsonLdScripts($).some(
        (entry) =>
          typeof entry === 'object' &&
          entry !== null &&
          '@type' in entry &&
          entry['@type'] === 'CreativeWork',
      ),
    ).toBe(true);

    const externalLinks = article
      .find('a.external')
      .map((_, element) => $(element).attr('href'))
      .get();

    expect(externalLinks).toEqual([publicLink]);

    if (project === 'patentpath') {
      expect(article.find('a[href*="github.com"]')).toHaveLength(0);
    } else {
      expect(article.find('a[href*="vercel.app"]')).toHaveLength(0);
    }
  });
});

describe('public assets and privacy', () => {
  it('emits the branded assets, crawler policy, and English CV', () => {
    const faviconPath = join(distRoot, 'favicon.svg');
    const ogCardPath = join(distRoot, 'og-card.svg');
    const ogCardPngPath = join(distRoot, 'og-card.png');
    const robotsPath = join(distRoot, 'robots.txt');
    const cvPath = join(distRoot, 'Vittorio-Cai-CV-English.pdf');

    for (const path of [
      faviconPath,
      ogCardPath,
      ogCardPngPath,
      robotsPath,
      cvPath,
    ]) {
      expect(existsSync(path)).toBe(true);
    }

    expect(readFileSync(faviconPath, 'utf8')).toContain('#1a4e8f');
    expect(readFileSync(ogCardPath, 'utf8')).toContain('#1a4e8f');
    expect(readFileSync(ogCardPath, 'utf8')).toContain(
      'Business insight. Data discipline. Useful AI.',
    );
    expect(readFileSync(robotsPath, 'utf8')).toContain('Allow: /');
    expect(readFileSync(robotsPath, 'utf8')).toContain(
      'Sitemap: https://vittoriocai.github.io/sitemap-index.xml',
    );
  });

  it('renders a non-indexable multilingual 404 recovery page', () => {
    const $ = loadHomepage('404.html');

    expect($('main')).toHaveLength(1);
    expect($('meta[name="robots"]').attr('content')).toBe(
      'noindex,nofollow',
    );
    expect($('link[rel="canonical"]')).toHaveLength(0);
    expect($('link[rel="alternate"]')).toHaveLength(0);
    expect($('[data-recovery-links] a[href="/"]')).toHaveLength(1);
    expect($('[data-recovery-links] a[href="/de/"]')).toHaveLength(1);
    expect($('[data-recovery-links] a[href="/zh/"]')).toHaveLength(1);
    expect($.text()).toContain('Page not found');
    expect($.text()).toContain('Seite nicht gefunden');
    expect($.text()).toContain('页面未找到');
  });

  it('keeps every rendered HTML file free of German mobile numbers', () => {
    for (const fixture of syntheticGermanMobileFixtures) {
      expect(containsGermanMobileNumber(fixture)).toBe(true);
    }

    expect(
      containsGermanMobileNumber(
        '<p>176 projects</p><p>2000 records</p><p>4000 results</p>',
      ),
    ).toBe(false);

    for (const htmlPath of listHtmlFiles(distRoot)) {
      expect(
        containsGermanMobileNumber(readFileSync(htmlPath, 'utf8')),
        `${htmlPath} must not expose a German mobile number`,
      ).toBe(false);
    }
  });
});
