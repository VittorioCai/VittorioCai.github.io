# PatentPATH Case Study Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the short PatentPATH case study with a localized, screenshot-led product story that explains the four-phase workflow, verified differentiators, Vittorio's contribution, architecture, evidence, and limits without changing the other case studies.

**Architecture:** Keep `ProjectCaseStudy.astro` as the shared route shell and metadata owner. Add one focused `PatentPathStory.astro` component for PatentPATH-only markup, backed by a strongly typed `story` object inside each locale's PatentPATH case-study content. Store three public-demo screenshots locally under `public/projects/patentpath/` so the case study remains understandable while the demo backend sleeps.

**Tech Stack:** Astro 7, TypeScript 6, localized TypeScript content, CSS custom properties, Vitest, Cheerio build-output tests, Playwright, axe-core.

---

## File structure

- Create `src/components/PatentPathStory.astro`: PatentPATH-only narrative, screenshots, workflow, differentiators, contribution, architecture, evidence, and disclaimer.
- Modify `src/components/ProjectCaseStudy.astro`: route PatentPATH to the focused story component while preserving the generic renderer for the other three projects.
- Modify `src/content/types.ts`: define the exact localized PatentPATH story contract.
- Modify `src/content/en.ts`: add English story copy and screenshot metadata.
- Modify `src/content/de.ts`: add German story copy and screenshot metadata.
- Modify `src/content/zh.ts`: add Simplified Chinese story copy and screenshot metadata.
- Create `public/projects/patentpath/overview.png`: real public-demo Overview screenshot.
- Create `public/projects/patentpath/patents.png`: real public-demo Patents screenshot.
- Create `public/projects/patentpath/risk-check.png`: real public-demo Risk Check screenshot.
- Modify `tests/content.test.ts`: enforce complete and equivalent story data in all locales.
- Modify `tests/repository-contract.test.ts`: enforce the three local screenshot assets.
- Modify `tests/build-output.test.ts`: enforce rendered PatentPATH structure and isolation from other case studies.
- Modify `tests/portfolio.spec.ts`: enforce desktop image presentation, loaded local media, and the existing responsive/accessibility contract.

### Task 1: Add the typed three-language PatentPATH story

**Files:**
- Modify: `tests/content.test.ts`
- Modify: `src/content/types.ts`
- Modify: `src/content/en.ts`
- Modify: `src/content/de.ts`
- Modify: `src/content/zh.ts`

- [ ] **Step 1: Write the failing localized-content test**

Add this test to `tests/content.test.ts`:

```ts
it('defines the complete PatentPATH product story in every locale', () => {
  const expectedScreenshotPaths = [
    '/projects/patentpath/overview.png',
    '/projects/patentpath/patents.png',
    '/projects/patentpath/risk-check.png',
  ];

  for (const locale of locales) {
    const story = content[locale].caseStudies.patentpath.story;

    expect(story.context).toBeTruthy();
    expect(story.workflowHeading).toBeTruthy();
    expect(story.workflow).toHaveLength(4);
    expect(story.workflow.every((step) => (
      Boolean(step.title) && Boolean(step.description)
    ))).toBe(true);
    expect(story.differentiatorsHeading).toBeTruthy();
    expect(story.differentiators).toHaveLength(4);
    expect(story.architectureHeading).toBeTruthy();
    expect(story.architecture).toHaveLength(5);
    expect(story.disclaimer).toBeTruthy();
    expect(Object.values(story.screenshots).map(({ src }) => src)).toEqual(
      expectedScreenshotPaths,
    );
    expect(
      Object.values(story.screenshots).every(({ alt, caption }) => (
        Boolean(alt) && Boolean(caption)
      )),
    ).toBe(true);
  }
});
```

- [ ] **Step 2: Run the content test and verify RED**

Run:

```bash
npx vitest run tests/content.test.ts
```

Expected: FAIL because `caseStudies.patentpath.story` does not exist.

- [ ] **Step 3: Define the exact story types**

Add these interfaces after `CaseStudy` in `src/content/types.ts`:

```ts
interface PatentPathStoryStep {
  title: string;
  description: string;
}

interface PatentPathScreenshot {
  src: string;
  alt: string;
  caption: string;
  width: 1440;
  height: 960;
}

interface PatentPathStory {
  context: string;
  workflowHeading: string;
  workflow: [
    PatentPathStoryStep,
    PatentPathStoryStep,
    PatentPathStoryStep,
    PatentPathStoryStep,
  ];
  differentiatorsHeading: string;
  differentiators: [string, string, string, string];
  architectureHeading: string;
  architecture: [string, string, string, string, string];
  screenshots: {
    overview: PatentPathScreenshot;
    patents: PatentPathScreenshot;
    riskCheck: PatentPathScreenshot;
  };
  disclaimer: string;
}
```

Replace the homogeneous case-study record in `SiteContent` with:

```ts
caseStudies: {
  patentpath: CaseStudy & { story: PatentPathStory };
  'english-job-agent': CaseStudy;
  'news-sentiment': CaseStudy;
  'water-quality': CaseStudy;
};
```

- [ ] **Step 4: Add the English story**

Add this `story` property inside `content.en.caseStudies.patentpath`, after `evidence`:

```ts
story: {
  context: 'Team project · TUM GenAI Project × Fuyao Europe',
  workflowHeading: 'From patent corpus to design decision',
  workflow: [
    {
      title: 'Patent Understanding',
      description:
        'Read patents, extract features and claims, and structure the corpus.',
    },
    {
      title: 'Risk Identification',
      description:
        'Compare a product design with the corpus and flag claim-level overlap.',
    },
    {
      title: 'Design Improvement',
      description:
        'Generate structured preliminary suggestions from a stored risk analysis.',
    },
    {
      title: 'Innovation Opportunities',
      description:
        'Surface patterns and potential gaps across the patent landscape.',
    },
  ],
  differentiatorsHeading: 'What makes the workflow different',
  differentiators: [
    'Semantic retrieval ranks patents by conceptual similarity, with keyword overlap as a fallback.',
    'Results identify overlap at claim level rather than stopping at document similarity.',
    'Design-improvement suggestions are generated only from a stored claim-level risk analysis.',
    'The same structured corpus supports individual design checks and wider landscape insights.',
  ],
  architectureHeading: 'How my work connects',
  architecture: [
    'Design description or patent PDF',
    'Web interface',
    'FastAPI services',
    'PostgreSQL + pgvector',
    'Overlap findings + grounded suggestions',
  ],
  screenshots: {
    overview: {
      src: '/projects/patentpath/overview.png',
      alt: 'PatentPATH Overview showing the four product phases and patent-risk summary.',
      caption:
        'The Overview connects patent understanding, risk identification, design improvement and innovation insights in one product flow.',
      width: 1440,
      height: 960,
    },
    patents: {
      src: '/projects/patentpath/patents.png',
      alt: 'PatentPATH Patents screen with PDF analysis, semantic search and catalogue filters.',
      caption:
        'The patent workspace combines document intake, concept-based retrieval and corpus filtering.',
      width: 1440,
      height: 960,
    },
    riskCheck: {
      src: '/projects/patentpath/risk-check.png',
      alt: 'PatentPATH Risk Check screen with a design description field and a three-step analysis explanation.',
      caption:
        'A plain-language design description is parsed, matched against the patent corpus and scored for claim overlap.',
      width: 1440,
      height: 960,
    },
  },
  disclaimer:
    'PatentPATH supports preliminary patent screening. It does not provide a legal opinion or replace professional patent review.',
},
```

- [ ] **Step 5: Add the German story**

Add this `story` property inside `content.de.caseStudies.patentpath`, after `evidence`:

```ts
story: {
  context: 'Teamprojekt · TUM GenAI Project × Fuyao Europe',
  workflowHeading: 'Vom Patentkorpus zur Designentscheidung',
  workflow: [
    {
      title: 'Patentverständnis',
      description:
        'Patente lesen, Merkmale und Ansprüche extrahieren und den Korpus strukturieren.',
    },
    {
      title: 'Risikoerkennung',
      description:
        'Ein Produktdesign mit dem Korpus vergleichen und Überschneidungen auf Anspruchsebene kennzeichnen.',
    },
    {
      title: 'Designverbesserung',
      description:
        'Strukturierte vorläufige Vorschläge aus einer gespeicherten Risikoanalyse erzeugen.',
    },
    {
      title: 'Innovationsmöglichkeiten',
      description:
        'Muster und potenzielle Lücken in der Patentlandschaft sichtbar machen.',
    },
  ],
  differentiatorsHeading: 'Was den Arbeitsablauf besonders macht',
  differentiators: [
    'Die semantische Suche ordnet Patente nach inhaltlicher Ähnlichkeit; Keyword-Überschneidung dient als Fallback.',
    'Die Ergebnisse zeigen Überschneidungen auf Anspruchsebene, statt bei Dokumentähnlichkeit stehen zu bleiben.',
    'Designverbesserungen entstehen nur auf Grundlage einer gespeicherten Risikoanalyse auf Anspruchsebene.',
    'Derselbe strukturierte Korpus unterstützt einzelne Designprüfungen und übergreifende Landschaftsanalysen.',
  ],
  architectureHeading: 'Wie meine Arbeit zusammenwirkt',
  architecture: [
    'Designbeschreibung oder Patent-PDF',
    'Web-Oberfläche',
    'FastAPI-Services',
    'PostgreSQL + pgvector',
    'Überschneidungsbefunde + fundierte Vorschläge',
  ],
  screenshots: {
    overview: {
      src: '/projects/patentpath/overview.png',
      alt: 'PatentPATH-Übersicht mit vier Produktphasen und Zusammenfassung der Patentrisiken.',
      caption:
        'Die Übersicht verbindet Patentverständnis, Risikoerkennung, Designverbesserung und Innovationsanalysen in einem Produktablauf.',
      width: 1440,
      height: 960,
    },
    patents: {
      src: '/projects/patentpath/patents.png',
      alt: 'PatentPATH-Patentansicht mit PDF-Analyse, semantischer Suche und Katalogfiltern.',
      caption:
        'Der Patentarbeitsbereich kombiniert Dokumentaufnahme, konzeptbasierte Suche und Korpusfilterung.',
      width: 1440,
      height: 960,
    },
    riskCheck: {
      src: '/projects/patentpath/risk-check.png',
      alt: 'PatentPATH-Risikoprüfung mit Eingabefeld für eine Designbeschreibung und dreistufiger Analyseerklärung.',
      caption:
        'Eine frei formulierte Designbeschreibung wird zerlegt, mit dem Patentkorpus abgeglichen und auf Anspruchsüberschneidungen bewertet.',
      width: 1440,
      height: 960,
    },
  },
  disclaimer:
    'PatentPATH unterstützt die vorläufige Patentprüfung. Das Produkt liefert keine Rechtsberatung und ersetzt keine professionelle Patentprüfung.',
},
```

- [ ] **Step 6: Add the Simplified Chinese story**

Add this `story` property inside `content.zh.caseStudies.patentpath`, after `evidence`:

```ts
story: {
  context: '团队项目 · TUM GenAI Project × Fuyao Europe',
  workflowHeading: '从专利语料到设计决策',
  workflow: [
    {
      title: '专利理解',
      description: '读取专利，提取技术特征与权利要求，并构建结构化语料。',
    },
    {
      title: '风险识别',
      description: '将产品设计与专利语料比较，标记权利要求级的重叠。',
    },
    {
      title: '设计改进',
      description: '基于已保存的风险分析生成结构化初步建议。',
    },
    {
      title: '创新机会',
      description: '发现专利版图中的模式与潜在空白。',
    },
  ],
  differentiatorsHeading: '这套工作流的特别之处',
  differentiators: [
    '语义检索按概念相似度排序专利，并以关键词重叠作为回退方式。',
    '结果定位到权利要求级重叠，而不止停留在文档相似度。',
    '设计改进建议只基于已保存的权利要求级风险分析生成。',
    '同一套结构化语料既支持单项设计检查，也支持更广泛的专利版图洞察。',
  ],
  architectureHeading: '我的工作如何连接起来',
  architecture: [
    '设计描述或专利 PDF',
    'Web 界面',
    'FastAPI 服务',
    'PostgreSQL + pgvector',
    '重叠发现 + 有依据的建议',
  ],
  screenshots: {
    overview: {
      src: '/projects/patentpath/overview.png',
      alt: 'PatentPATH 总览页，展示四个产品阶段与专利风险概况。',
      caption:
        '总览页把专利理解、风险识别、设计改进与创新洞察连接成一套产品流程。',
      width: 1440,
      height: 960,
    },
    patents: {
      src: '/projects/patentpath/patents.png',
      alt: 'PatentPATH 专利页，包含 PDF 分析、语义检索与语料筛选。',
      caption:
        '专利工作区把文档导入、基于概念的检索和语料筛选放在同一界面中。',
      width: 1440,
      height: 960,
    },
    riskCheck: {
      src: '/projects/patentpath/risk-check.png',
      alt: 'PatentPATH 风险检查页，包含设计描述输入框与三步分析说明。',
      caption:
        '自然语言设计描述会被解析、与专利语料匹配，并评估权利要求重叠。',
      width: 1440,
      height: 960,
    },
  },
  disclaimer:
    'PatentPATH 用于初步专利筛查，不构成法律意见，也不能替代专业专利审查。',
},
```

- [ ] **Step 7: Run the content tests and type check**

Run:

```bash
npx vitest run tests/content.test.ts
npm run check
```

Expected: the content tests pass and Astro reports zero errors.

- [ ] **Step 8: Commit the typed story content**

```bash
git add tests/content.test.ts src/content/types.ts src/content/en.ts src/content/de.ts src/content/zh.ts
git commit -m "feat: add the localized PatentPATH product story"
```

### Task 2: Capture and contract-test three real product screenshots

**Files:**
- Modify: `tests/repository-contract.test.ts`
- Create: `public/projects/patentpath/overview.png`
- Create: `public/projects/patentpath/patents.png`
- Create: `public/projects/patentpath/risk-check.png`

- [ ] **Step 1: Write the failing public-asset test**

Change the Node filesystem import in `tests/repository-contract.test.ts` to:

```ts
import {
  existsSync,
  readFileSync,
  statSync,
} from 'node:fs';
```

Add:

```ts
const patentPathScreenshots = [
  'public/projects/patentpath/overview.png',
  'public/projects/patentpath/patents.png',
  'public/projects/patentpath/risk-check.png',
];
```

Add this test:

```ts
it('keeps the PatentPATH walkthrough screenshots local and nonempty', () => {
  for (const screenshot of patentPathScreenshots) {
    const path = join(projectRoot, screenshot);

    expect(existsSync(path), screenshot).toBe(true);
    expect(statSync(path).size, screenshot).toBeGreaterThan(20_000);
  }
});
```

- [ ] **Step 2: Run the asset test and verify RED**

Run:

```bash
npx vitest run tests/repository-contract.test.ts
```

Expected: FAIL because the three screenshot files do not exist.

- [ ] **Step 3: Create the asset directory**

Run:

```bash
mkdir -p public/projects/patentpath
```

- [ ] **Step 4: Warm the public demo and capture Overview**

Run:

```bash
npx playwright screenshot \
  --browser chromium \
  --viewport-size "1440,960" \
  --wait-for-selector 'a[href="/patents/CN112498058B"]' \
  --wait-for-timeout 1200 \
  --timeout 60000 \
  https://new-patent-path.vercel.app/ \
  public/projects/patentpath/overview.png
```

Expected: a 1440 × 960 screenshot without browser chrome showing the loaded workflow and demo-corpus overview.

- [ ] **Step 5: Capture Patents**

Run:

```bash
npx playwright screenshot \
  --browser chromium \
  --viewport-size "1440,960" \
  --wait-for-selector 'input[aria-label="Semantic search query"]' \
  --wait-for-timeout 1200 \
  --timeout 60000 \
  https://new-patent-path.vercel.app/patents \
  public/projects/patentpath/patents.png
```

Expected: a 1440 × 960 screenshot showing PDF analysis, semantic search, and catalogue filters.

- [ ] **Step 6: Capture Risk Check**

Run:

```bash
npx playwright screenshot \
  --browser chromium \
  --viewport-size "1440,960" \
  --wait-for-selector 'textarea' \
  --wait-for-timeout 1200 \
  --timeout 60000 \
  https://new-patent-path.vercel.app/risk-check \
  public/projects/patentpath/risk-check.png
```

Expected: a 1440 × 960 screenshot showing the design input and three visible analysis steps without submitting a design.

- [ ] **Step 7: Inspect the three images**

Run:

```bash
file public/projects/patentpath/*.png
du -h public/projects/patentpath/*.png
```

Then inspect each image visually. Reject and recapture any screenshot with a blank main area, loading failure, browser chrome, clipped navigation, or personal information.

- [ ] **Step 8: Run the asset test and verify GREEN**

Run:

```bash
npx vitest run tests/repository-contract.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit the verified screenshots**

```bash
git add tests/repository-contract.test.ts public/projects/patentpath/overview.png public/projects/patentpath/patents.png public/projects/patentpath/risk-check.png
git commit -m "assets: add PatentPATH product walkthrough screenshots"
```

### Task 3: Render the dedicated PatentPATH story without changing other case studies

**Files:**
- Create: `src/components/PatentPathStory.astro`
- Modify: `src/components/ProjectCaseStudy.astro`
- Modify: `tests/build-output.test.ts`
- Modify: `tests/portfolio.spec.ts`

- [ ] **Step 1: Write the failing built-HTML contract**

Inside the `describe.each(caseStudyPages)` test in `tests/build-output.test.ts`, replace the unconditional four-heading assertion with this conditional contract:

```ts
if (project === 'patentpath') {
  expect(article.find('[data-patentpath-story]')).toHaveLength(1);
  expect(article.find('[data-patentpath-workflow-step]')).toHaveLength(4);
  expect(article.find('[data-patentpath-differentiator]')).toHaveLength(4);
  expect(article.find('[data-patentpath-contribution]')).toHaveLength(4);
  expect(article.find('[data-patentpath-architecture-node]')).toHaveLength(5);
  expect(article.find('[data-patentpath-screenshot]')).toHaveLength(3);
  expect(article.find('[data-patentpath-disclaimer]')).toHaveLength(1);
  expect(article.find('.demo-note')).toHaveLength(1);
  expect(
    article
      .find('[data-patentpath-screenshot]')
      .map((_, element) => $(element).attr('src'))
      .get(),
  ).toEqual([
    '/projects/patentpath/overview.png',
    '/projects/patentpath/patents.png',
    '/projects/patentpath/risk-check.png',
  ]);
  article.find('[data-patentpath-screenshot]').each((_, element) => {
    expect($(element).attr('alt')).toBeTruthy();
    expect($(element).attr('width')).toBe('1440');
    expect($(element).attr('height')).toBe('960');
  });
  expect(article.find('figure figcaption')).toHaveLength(3);
  expect(article.find('[data-case-section="responsibility"]')).toHaveLength(1);
} else {
  expect(article.find('[data-patentpath-story]')).toHaveLength(0);
  expect(
    article
      .find('.case-study__body > section > h2')
      .map((_, element) => $(element).text().trim())
      .get(),
  ).toEqual(caseStudySectionLabels[lang]);
}
```

Keep the existing external-link, JSON-LD, responsibility-length, and private-repository assertions.

Add this additional isolation test after the localized case-study table:

```ts
it('renders the PatentPATH walkthrough only on PatentPATH routes', () => {
  const detailedPages = caseStudyPages.filter(
    ({ project }) => project === 'patentpath',
  );
  const genericPages = caseStudyPages.filter(
    ({ project }) => project !== 'patentpath',
  );

  for (const { file } of detailedPages) {
    expect(loadHomepage(file)('[data-patentpath-story]')).toHaveLength(1);
  }

  for (const { file } of genericPages) {
    expect(loadHomepage(file)('[data-patentpath-story]')).toHaveLength(0);
  }
});
```

- [ ] **Step 2: Write the failing browser contract**

Add this test to `tests/portfolio.spec.ts`:

```ts
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
    expect(await screenshot.evaluate((image) => (
      image instanceof HTMLImageElement ? image.naturalWidth : 0
    ))).toBeGreaterThan(1000);
  }

  const overview = page.locator(
    '[data-patentpath-screenshot][src="/projects/patentpath/overview.png"]',
  );
  const overviewBox = await overview.boundingBox();

  expect(overviewBox?.width).toBeGreaterThan(700);
});
```

- [ ] **Step 3: Run the new contracts and verify RED**

Run:

```bash
npx vitest run tests/build-output.test.ts
npx playwright test tests/portfolio.spec.ts --grep "screenshot-led product story"
```

Expected: both fail because the PatentPATH-specific markup does not exist.

- [ ] **Step 4: Create `PatentPathStory.astro`**

Create `src/components/PatentPathStory.astro` with this structure:

```astro
---
import type { SiteContent } from '../content';

interface Props {
  caseStudy: SiteContent['caseStudies']['patentpath'];
  summary: string;
  labels: SiteContent['caseStudyLabels'];
}

const { caseStudy, summary, labels } = Astro.props;
const { story } = caseStudy;
const screenshots = [
  ['overview', story.screenshots.overview, 'eager'],
  ['patents', story.screenshots.patents, 'lazy'],
  ['risk-check', story.screenshots.riskCheck, 'lazy'],
] as const;
---

<div class="patentpath-story" data-patentpath-story>
  <header class="patentpath-story__header">
    <p class="patentpath-story__context">{story.context}</p>
    <h1>{caseStudy.outcome}</h1>
    <p class="patentpath-story__intro">{summary}</p>
  </header>

  <figure class="patentpath-story__figure patentpath-story__figure--hero">
    <img
      data-patentpath-screenshot
      src={screenshots[0][1].src}
      alt={screenshots[0][1].alt}
      width={screenshots[0][1].width}
      height={screenshots[0][1].height}
      loading={screenshots[0][2]}
      decoding="async"
    />
    <figcaption>{screenshots[0][1].caption}</figcaption>
  </figure>

  <section aria-labelledby="patentpath-problem-heading">
    <h2 id="patentpath-problem-heading">{labels.problem}</h2>
    <p>{caseStudy.problem}</p>
  </section>

  <section aria-labelledby="patentpath-workflow-heading">
    <h2 id="patentpath-workflow-heading">{story.workflowHeading}</h2>
    <ol class="patentpath-story__workflow">
      {
        story.workflow.map((step, index) => (
          <li data-patentpath-workflow-step>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))
      }
    </ol>
  </section>

  <figure class="patentpath-story__figure">
    <img
      data-patentpath-screenshot
      src={screenshots[1][1].src}
      alt={screenshots[1][1].alt}
      width={screenshots[1][1].width}
      height={screenshots[1][1].height}
      loading={screenshots[1][2]}
      decoding="async"
    />
    <figcaption>{screenshots[1][1].caption}</figcaption>
  </figure>

  <section aria-labelledby="patentpath-differentiators-heading">
    <h2 id="patentpath-differentiators-heading">
      {story.differentiatorsHeading}
    </h2>
    <ol class="patentpath-story__differentiators">
      {
        story.differentiators.map((item, index) => (
          <li data-patentpath-differentiator>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </li>
        ))
      }
    </ol>
  </section>

  <figure class="patentpath-story__figure">
    <img
      data-patentpath-screenshot
      src={screenshots[2][1].src}
      alt={screenshots[2][1].alt}
      width={screenshots[2][1].width}
      height={screenshots[2][1].height}
      loading={screenshots[2][2]}
      decoding="async"
    />
    <figcaption>{screenshots[2][1].caption}</figcaption>
  </figure>

  <section
    aria-labelledby="patentpath-responsibility-heading"
    data-case-section="responsibility"
  >
    <h2 id="patentpath-responsibility-heading">
      {labels.responsibility}
    </h2>
    <p>{caseStudy.responsibility}</p>
    <h3>{labels.build}</h3>
    <ol class="patentpath-story__contribution">
      {
        caseStudy.build.map((item, index) => (
          <li data-patentpath-contribution>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </li>
        ))
      }
    </ol>
  </section>

  <section aria-labelledby="patentpath-architecture-heading">
    <h2 id="patentpath-architecture-heading">
      {story.architectureHeading}
    </h2>
    <ol class="patentpath-story__architecture">
      {
        story.architecture.map((node) => (
          <li data-patentpath-architecture-node>{node}</li>
        ))
      }
    </ol>
  </section>

  <section aria-labelledby="patentpath-evidence-heading">
    <h2 id="patentpath-evidence-heading">{labels.evidence}</h2>
    <ul>
      {caseStudy.evidence.map((item) => <li>{item}</li>)}
    </ul>
    <p class="patentpath-story__disclaimer" data-patentpath-disclaimer>
      {story.disclaimer}
    </p>
  </section>
</div>

<style>
  .patentpath-story__header {
    padding-bottom: clamp(2.5rem, 6vw, 5rem);
    border-bottom: 1px solid var(--line);
  }

  .patentpath-story__context {
    margin-bottom: 1.25rem;
    color: var(--accent);
    font-weight: 700;
  }

  .patentpath-story__header h1 {
    max-width: 17ch;
    margin-bottom: 1.5rem;
    font-size: clamp(2.4rem, 6vw, 5.5rem);
    letter-spacing: -0.055em;
    line-height: 0.98;
  }

  .patentpath-story__intro {
    max-width: 65ch;
    margin-bottom: 0;
    color: var(--muted);
    font-size: clamp(1.05rem, 2vw, 1.3rem);
  }

  .patentpath-story > section,
  .patentpath-story__figure {
    padding: clamp(2.5rem, 6vw, 5rem) 0;
    margin: 0;
    border-bottom: 1px solid var(--line);
  }

  .patentpath-story__figure img {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--line);
    background: var(--surface);
  }

  .patentpath-story__figure figcaption {
    max-width: 70ch;
    padding-top: 1rem;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .patentpath-story h2 {
    max-width: 22ch;
    margin-bottom: 1.5rem;
    font-size: clamp(1.5rem, 3vw, 2.4rem);
    letter-spacing: -0.035em;
  }

  .patentpath-story h3 {
    font-size: 1rem;
  }

  .patentpath-story__workflow,
  .patentpath-story__differentiators,
  .patentpath-story__contribution,
  .patentpath-story__architecture {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .patentpath-story__workflow {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .patentpath-story__workflow li {
    min-width: 0;
    padding: 1.5rem;
  }

  .patentpath-story__workflow li + li {
    border-left: 1px solid var(--line);
  }

  .patentpath-story__workflow span,
  .patentpath-story__differentiators span,
  .patentpath-story__contribution span {
    display: block;
    margin-bottom: 1rem;
    color: var(--accent);
    font-weight: 700;
  }

  .patentpath-story__workflow h3 {
    margin-bottom: 0.75rem;
  }

  .patentpath-story__workflow p,
  .patentpath-story__differentiators p,
  .patentpath-story__contribution p {
    margin: 0;
  }

  .patentpath-story__differentiators,
  .patentpath-story__contribution {
    border-top: 1px solid var(--line);
  }

  .patentpath-story__differentiators li,
  .patentpath-story__contribution li {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr);
    gap: 1rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--line);
  }

  .patentpath-story__differentiators span,
  .patentpath-story__contribution span {
    margin: 0;
  }

  .patentpath-story__contribution {
    margin-top: 1.5rem;
  }

  .patentpath-story__architecture {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .patentpath-story__architecture li {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 7rem;
    padding: 1rem;
    text-align: center;
    font-weight: 700;
  }

  .patentpath-story__architecture li + li {
    border-left: 1px solid var(--line);
  }

  .patentpath-story__architecture li + li::before {
    position: absolute;
    left: 0;
    padding: 0.25rem;
    color: var(--accent);
    background: var(--paper);
    content: '→';
    transform: translateX(-50%);
  }

  .patentpath-story__disclaimer {
    max-width: 65ch;
    padding: 1rem;
    margin: 1.5rem 0 0;
    color: var(--muted);
    border: 1px solid var(--line);
    font-size: 0.9rem;
  }

  @media (max-width: 900px) {
    .patentpath-story__workflow {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .patentpath-story__workflow li + li {
      border-left: 0;
    }

    .patentpath-story__workflow li:nth-child(even) {
      border-left: 1px solid var(--line);
    }

    .patentpath-story__workflow li:nth-child(n + 3) {
      border-top: 1px solid var(--line);
    }

    .patentpath-story__architecture {
      grid-template-columns: minmax(0, 1fr);
    }

    .patentpath-story__architecture li {
      min-height: 0;
      padding: 1.25rem;
    }

    .patentpath-story__architecture li + li {
      border-top: 1px solid var(--line);
      border-left: 0;
    }

    .patentpath-story__architecture li + li::before {
      top: 0;
      left: 50%;
      content: '↓';
      transform: translate(-50%, -50%);
    }
  }

  @media (max-width: 560px) {
    .patentpath-story__workflow {
      grid-template-columns: minmax(0, 1fr);
    }

    .patentpath-story__workflow li:nth-child(even) {
      border-left: 0;
    }

    .patentpath-story__workflow li + li {
      border-top: 1px solid var(--line);
    }
  }
</style>
```

- [ ] **Step 5: Route PatentPATH to the new component**

In `src/components/ProjectCaseStudy.astro`:

1. Import `PatentPathStory`:

```astro
import PatentPathStory from './PatentPathStory.astro';
```

2. Limit the existing rail visual to English Job Agent:

```astro
{
  projectId === 'english-job-agent' && (
    <div class="case-study__visual">
      <ProjectVisual
        projectId="english-job-agent"
        label={`${project.title}: ${project.summary}`}
        stages={copy.visuals.jobAgentStages}
      />
    </div>
  )
}
```

3. Render the cold-start note below the PatentPATH live-demo link:

```astro
{
  publicLink && (
    <div class="text-actions">
      <a class="external" href={publicLink} rel="noreferrer">
        {publicLinkLabel}
      </a>
      {
        projectId === 'patentpath' && project.demoNote ? (
          <p class="demo-note">{project.demoNote}</p>
        ) : null
      }
    </div>
  )
}
```

4. Replace the current body contents with a conditional:

```astro
<div class="case-study__body">
  {
    projectId === 'patentpath' ? (
      <PatentPathStory
        caseStudy={copy.caseStudies.patentpath}
        summary={project.summary}
        labels={copy.caseStudyLabels}
      />
    ) : (
      <>
        <header class="case-study__header">
          <h1>{caseStudy.outcome}</h1>
          <p class="case-study__intro">{project.summary}</p>
        </header>

        <section aria-labelledby="case-problem-heading">
          <h2 id="case-problem-heading">{copy.caseStudyLabels.problem}</h2>
          <p>{caseStudy.problem}</p>
        </section>

        <section
          aria-labelledby="case-responsibility-heading"
          data-case-section="responsibility"
        >
          <h2 id="case-responsibility-heading">
            {copy.caseStudyLabels.responsibility}
          </h2>
          <p>{caseStudy.responsibility}</p>
        </section>

        <section aria-labelledby="case-build-heading">
          <h2 id="case-build-heading">{copy.caseStudyLabels.build}</h2>
          <ul>
            {caseStudy.build.map((item) => <li>{item}</li>)}
          </ul>
        </section>

        <section aria-labelledby="case-evidence-heading">
          <h2 id="case-evidence-heading">{copy.caseStudyLabels.evidence}</h2>
          <ul>
            {caseStudy.evidence.map((item) => <li>{item}</li>)}
          </ul>
        </section>
      </>
    )
  }

  <nav
    class="case-study__navigation"
    aria-label={copy.sections.work}
  >
    <a href={getLocalizedPath(locale, 'work')}>
      ← {copy.caseStudyLabels.backToWork}
    </a>
    <a href={getLocalizedPath(locale, nextRoute)}>
      {copy.caseStudyLabels.nextProject}: {nextProject.title} →
    </a>
  </nav>
</div>
```

Keep the JSON-LD script after the body and keep the existing generic styles.

- [ ] **Step 6: Run the focused build and browser tests**

Run:

```bash
npx vitest run tests/build-output.test.ts
npx playwright test tests/portfolio.spec.ts --grep "screenshot-led product story"
```

Expected: both pass.

- [ ] **Step 7: Run the related responsive and accessibility tests**

Run:

```bash
npx playwright test tests/portfolio.spec.ts --grep "patentpath|axe violations|horizontal overflow"
```

Expected: all matching tests pass, including the existing 320-pixel PatentPATH checks.

- [ ] **Step 8: Commit the dedicated renderer**

```bash
git add src/components/PatentPathStory.astro src/components/ProjectCaseStudy.astro tests/build-output.test.ts tests/portfolio.spec.ts
git commit -m "feat: expand the PatentPATH case study"
```

### Task 4: Verify, visually inspect, and publish

**Files:**
- Inspect: all files changed in Tasks 1 through 3
- Preserve: `.impeccable/` as unrelated untracked user work

- [ ] **Step 1: Run the full repository quality gate**

Run:

```bash
npm run verify
```

Expected:

- Astro check reports zero errors, warnings, and hints.
- All Vitest files pass.
- Astro builds 25 pages.
- All Playwright tests pass.

- [ ] **Step 2: Inspect the built PatentPATH contract**

Run:

```bash
rg -n "data-patentpath-story|projects/patentpath|data-patentpath-disclaimer" \
  dist/work/patentpath/index.html \
  dist/de/work/patentpath/index.html \
  dist/zh/work/patentpath/index.html
```

Expected: each localized page contains the focused story, all three local screenshot paths, and the localized disclaimer.

Run:

```bash
rg -l "data-patentpath-story" dist/work dist/de/work dist/zh/work
```

Expected: exactly these three files:

```text
dist/work/patentpath/index.html
dist/de/work/patentpath/index.html
dist/zh/work/patentpath/index.html
```

- [ ] **Step 3: Inspect desktop and mobile renders**

Start the production preview:

```bash
npm run preview -- --host 127.0.0.1
```

Inspect `/work/patentpath/`, `/de/work/patentpath/`, and `/zh/work/patentpath/` at desktop and 320-pixel widths. Confirm:

- The first screenshot is visually dominant and sharp.
- All screenshots show real product UI and no blank loading state.
- The four-step workflow and five-node architecture remain legible.
- The live-demo link and cold-start note remain visible.
- The contribution boundary is explicit.
- No horizontal scrolling, clipped text, or unreadably small captions.

- [ ] **Step 4: Check the final diff and repository state**

Run:

```bash
git diff --check
git status --short --branch
git log --oneline -5
```

Expected: no unstaged feature edits remain, local commits are ahead of `origin/main`, and `.impeccable/` remains untracked and unstaged.

- [ ] **Step 5: Push the completed main branch**

Run:

```bash
git push origin main
```

Expected: all new commits push successfully to `origin/main`.

- [ ] **Step 6: Wait for GitHub Pages**

```bash
gh run watch "$(
  gh run list \
    --branch main \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId'
)" --exit-status
```

Expected: quality, build, and deploy jobs all succeed.

- [ ] **Step 7: Verify the live localized pages**

Check:

```text
https://vittoriocai.github.io/work/patentpath/
https://vittoriocai.github.io/de/work/patentpath/
https://vittoriocai.github.io/zh/work/patentpath/
```

Confirm the three screenshots load from local portfolio paths, localized captions and disclaimers appear, the live-demo link remains correct, and the other case studies retain their prior generic layout.
