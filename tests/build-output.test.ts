import { execFileSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { extname, join, relative } from 'node:path';
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
const personData = (name: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name,
  url: 'https://vittoriocai.github.io',
  sameAs: [
    'https://github.com/VittorioCai',
    'https://www.linkedin.com/in/vittorio-cai-3ba0b7385',
  ],
  jobTitle: 'M.Sc. student, Management and Digital Technology (TUM)',
});

const localizedHomepages = [
  {
    file: 'index.html',
    lang: 'en',
    displayName: 'Vittorio Cai',
    introWords: ['Vittorio', 'Cai'],
    workPath: '/work/',
    demoNote: 'Free-tier backend — first load may take up to 40 s to wake.',
  },
  {
    file: 'de/index.html',
    lang: 'de',
    displayName: 'Vittorio Cai',
    introWords: ['Vittorio', 'Cai'],
    workPath: '/de/work/',
    demoNote: 'Backend im Free-Tier — der erste Aufruf kann bis zu 40 s dauern.',
  },
  {
    file: 'zh/index.html',
    lang: 'zh-CN',
    displayName: '蔡一贤',
    introWords: ['蔡一贤'],
    workPath: '/zh/work/',
    demoNote: '演示后端为免费实例，首次打开约需 40 秒唤醒。',
  },
] as const;

const caseStudyActionLabels = {
  en: 'Case study',
  de: 'Projektbericht',
  'zh-CN': '项目详情',
} as const;
const caseStudySlugs = {
  patentpath: 'patentpath',
  'english-job-agent': 'english-job-agent',
  'news-sentiment': 'news-sentiment',
  'water-quality': 'water-quality',
} as const;

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
    displayName: 'Vittorio Cai',
    languageHeading: 'Languages',
    journeyStops: ['Florence', 'Wenzhou', 'Heilbronn'],
  },
  {
    file: 'de/profile/index.html',
    lang: 'de',
    displayName: 'Vittorio Cai',
    languageHeading: 'Sprachen',
    journeyStops: ['Florenz', 'Wenzhou', 'Heilbronn'],
  },
  {
    file: 'zh/profile/index.html',
    lang: 'zh-CN',
    displayName: '蔡一贤',
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
  {
    file: 'work/news-sentiment/index.html',
    lang: 'en',
    project: 'news-sentiment',
    publicLink: null,
  },
  {
    file: 'de/work/news-sentiment/index.html',
    lang: 'de',
    project: 'news-sentiment',
    publicLink: null,
  },
  {
    file: 'zh/work/news-sentiment/index.html',
    lang: 'zh-CN',
    project: 'news-sentiment',
    publicLink: null,
  },
  {
    file: 'work/water-quality/index.html',
    lang: 'en',
    project: 'water-quality',
    publicLink: null,
  },
  {
    file: 'de/work/water-quality/index.html',
    lang: 'de',
    project: 'water-quality',
    publicLink: null,
  },
  {
    file: 'zh/work/water-quality/index.html',
    lang: 'zh-CN',
    project: 'water-quality',
    publicLink: null,
  },
] as const;

const caseStudySectionLabels = {
  en: ['The problem', 'My responsibility', 'What I built', 'Evidence & results'],
  de: [
    'Die Herausforderung',
    'Meine Verantwortung',
    'Was ich umgesetzt habe',
    'Belege & Ergebnisse',
  ],
  'zh-CN': ['问题', '我的职责', '实现内容', '依据与结果'],
} as const;

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
  displayName,
  introWords,
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
    expect($('[data-wordmark]').text().trim()).toBe(displayName);
    expect(
      $('[data-intro-word]')
        .map((_, element) => $(element).text().trim())
        .get(),
    ).toEqual(introWords);
    expect($('.site-footer').text()).toContain(displayName);

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
    expect(
      parseJsonLdScripts($).filter(
        (entry) =>
          typeof entry === 'object' &&
          entry !== null &&
          '@type' in entry &&
          entry['@type'] === 'Person',
      ),
    ).toEqual([personData(displayName)]);
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

    const localePrefix = lang === 'en' ? '' : lang === 'de' ? '/de' : '/zh';

    for (const [projectId, slug] of Object.entries(caseStudySlugs)) {
      const path = `${localePrefix}/work/${slug}/`;
      const caseStudyLink = $(
        `[data-project-id="${projectId}"] .text-actions a[href="${path}"]`,
      );

      expect(caseStudyLink).toHaveLength(1);
      expect(caseStudyLink.text().trim()).toBe(caseStudyActionLabels[lang]);
    }
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
  displayName,
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
    expect($('[data-profile-identity] h1').text().trim()).toBe(displayName);
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
      $('a[href="https://www.linkedin.com/in/vittorio-cai-3ba0b7385"]'),
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
      article
        .find('.case-study__body > section > h2')
        .map((_, element) => $(element).text().trim())
        .get(),
    ).toEqual(caseStudySectionLabels[lang]);
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

    expect(externalLinks).toEqual(publicLink ? [publicLink] : []);

    if (project === 'patentpath') {
      expect(article.find('a[href*="github.com"]')).toHaveLength(0);
    } else {
      expect(article.find('a[href*="vercel.app"]')).toHaveLength(0);
    }
  });
});

describe('public assets and privacy', () => {
  it('publishes Person JSON-LD only on localized homepages', () => {
    const homepagePeople = new Map<string, ReturnType<typeof personData>>(
      localizedHomepages.map(({ file, displayName }) => [
        file,
        personData(displayName),
      ]),
    );

    for (const htmlPath of listHtmlFiles(distRoot)) {
      const file = relative(distRoot, htmlPath);
      const $ = load(readFileSync(htmlPath, 'utf8'));
      const people = parseJsonLdScripts($).filter(
        (entry) =>
          typeof entry === 'object' &&
          entry !== null &&
          '@type' in entry &&
          entry['@type'] === 'Person',
      );

      const person = homepagePeople.get(file);

      expect(people, file).toEqual(person ? [person] : []);
    }
  });

  it('uses the Chinese display name throughout localized page text', () => {
    for (const htmlPath of listHtmlFiles(join(distRoot, 'zh'))) {
      const file = relative(distRoot, htmlPath);
      const $ = load(readFileSync(htmlPath, 'utf8'));
      const pageText = $.root().text();

      expect(pageText, file).toContain('蔡一贤');
      expect(pageText, file).not.toContain('Vittorio Cai');
    }
  });

  it('builds the complete 25-page localized site', () => {
    expect(listHtmlFiles(distRoot)).toHaveLength(25);
  });

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
