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
    pipelineStages: [
      'Public ATS feeds',
      'Language check',
      'Ranked digest',
    ],
    languageHeading: 'Languages',
  },
  {
    file: 'de/index.html',
    lang: 'de',
    pipelineStages: [
      'Öffentliche ATS-Feeds',
      'Sprachprüfung',
      'Priorisierte Übersicht',
    ],
    languageHeading: 'Sprachen',
  },
  {
    file: 'zh/index.html',
    lang: 'zh-CN',
    pipelineStages: [
      '公开 ATS 数据源',
      '语言要求判断',
      '岗位优先级摘要',
    ],
    languageHeading: '语言',
  },
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
  pipelineStages,
  languageHeading,
}) => {
  it(`renders the ${lang} homepage contract`, () => {
    const $ = loadHomepage(file);

    expect($('html').attr('lang')).toBe(lang);
    expect($('main')).toHaveLength(1);

    for (const id of ['work', 'profile', 'experience', 'contact']) {
      expect($(`#${id}`)).toHaveLength(1);
    }

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

  it(`renders the ${lang} language skill heading`, () => {
    const $ = loadHomepage(file);

    const languageGroup = $('[data-skill-group="languages"]');

    expect(languageGroup).toHaveLength(1);
    expect(languageGroup.find('h3').text().trim()).toBe(languageHeading);
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
      `${siteUrl}/og-card.svg`,
    );
    expect($('a[href="mailto:vittorio.cai@tum.de"]')).toHaveLength(1);
    expect($('a[href="/Vittorio-Cai-CV-English.pdf"]').length).toBeGreaterThan(
      0,
    );
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
    const robotsPath = join(distRoot, 'robots.txt');
    const cvPath = join(distRoot, 'Vittorio-Cai-CV-English.pdf');

    for (const path of [faviconPath, ogCardPath, robotsPath, cvPath]) {
      expect(existsSync(path)).toBe(true);
    }

    expect(readFileSync(faviconPath, 'utf8')).toContain('#1f5fae');
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
