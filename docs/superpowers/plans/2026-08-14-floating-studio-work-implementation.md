# Floating Studio Work Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rigid homepage and Work project layouts with one responsive Floating Studio composition that keeps PatentPATH dominant and presents the other projects as softer evidence-led fragments.

**Architecture:** A shared `ProjectStudio.astro` component controls teaser/full composition, while `StudioProjectCard.astro` owns one semantic project and its safe actions. `ProjectVisual.astro` supplies real or procedural evidence visuals for all project IDs; typed localized `workIntro` copy supplies the Work-page introduction.

**Tech Stack:** Astro 7, TypeScript 6, scoped/global CSS, existing IntersectionObserver reveal controller, Vitest, Playwright, axe-core

---

## File Map

- Create `src/components/ProjectStudio.astro`: shared homepage/full-work section composition.
- Create `src/components/StudioProjectCard.astro`: featured and supporting project article variants.
- Create `src/utils/project-route.ts`: exhaustive project-ID-to-localized-case-study route mapping.
- Modify `src/components/ProjectVisual.astro`: support all four project visuals and studio selectors.
- Modify `src/components/HomePage.astro`: render `ProjectStudio` in teaser mode.
- Modify `src/components/WorkPage.astro`: render `ProjectStudio` in full mode.
- Modify `src/content/types.ts`: add typed localized `workIntro` copy.
- Modify `src/content/en.ts`, `src/content/de.ts`, `src/content/zh.ts`: populate `workIntro`.
- Modify `src/styles/global.css`: remove obsolete project-grid rules and add the responsive studio system.
- Modify `tests/content.test.ts`: require complete localized work introductions.
- Modify `tests/build-output.test.ts`: assert homepage/full-work composition in built HTML.
- Modify `tests/portfolio.spec.ts`: verify responsive layout, motion, actions, and reduced motion.
- Delete `src/components/FeaturedProject.astro` and `src/components/ProjectGrid.astro` after all imports move to the studio components.

### Task 1: Add the Localized Work Introduction Contract

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/en.ts`
- Modify: `src/content/de.ts`
- Modify: `src/content/zh.ts`
- Test: `tests/content.test.ts`

- [ ] **Step 1: Write the failing localized-content test**

Add this test inside `describe('localized portfolio content', ...)`:

```ts
it('defines a complete localized Floating Studio introduction', () => {
  for (const locale of locales) {
    const intro = content[locale].workIntro;

    expect(intro.eyebrow).toBeTruthy();
    expect(intro.title).toBeTruthy();
    expect(intro.summary).toBeTruthy();
  }
});
```

- [ ] **Step 2: Run the focused test and verify the type/test failure**

Run: `npx vitest run tests/content.test.ts`

Expected: FAIL because `workIntro` does not exist on `SiteContent`.

- [ ] **Step 3: Add the typed content and translations**

Add to `SiteContent` after `hero`:

```ts
workIntro: {
  eyebrow: string;
  title: string;
  summary: string;
};
```

Add these values after each locale's `hero` object:

```ts
// en.ts
workIntro: {
  eyebrow: 'Selected work · 2024–2026',
  title: 'From a hard question to something useful.',
  summary:
    'Products, automations and evidence-led analyses. Each project shows the problem, my role and the proof — not just a technology list.',
},

// de.ts
workIntro: {
  eyebrow: 'Ausgewählte Projekte · 2024–2026',
  title: 'Von einer schwierigen Frage zu etwas Nutzbarem.',
  summary:
    'Produkte, Automatisierungen und evidenzbasierte Analysen. Jedes Projekt zeigt die Aufgabe, meinen Beitrag und die Belege — nicht nur eine Technologieliste.',
},

// zh.ts
workIntro: {
  eyebrow: '代表项目 · 2024–2026',
  title: '从难题出发，做成真正可用的成果。',
  summary:
    '这里有产品、自动化工具和以证据为基础的分析。每个项目都说明问题、我的职责与成果依据，而不只是罗列技术。',
},
```

- [ ] **Step 4: Run the focused test**

Run: `npx vitest run tests/content.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the content contract**

```bash
git add src/content/types.ts src/content/en.ts src/content/de.ts src/content/zh.ts tests/content.test.ts
git commit -m "content: add the localized Floating Studio introduction"
```

### Task 2: Centralize Project Case-Study Routing

**Files:**
- Create: `src/utils/project-route.ts`
- Test: `tests/routes.test.ts`

- [ ] **Step 1: Write the failing project-route test**

```ts
import { getProjectCaseStudyPath } from '../src/utils/project-route';

it('maps every project ID to its localized case-study route', () => {
  expect(getProjectCaseStudyPath('en', 'patentpath')).toBe('/work/patentpath/');
  expect(getProjectCaseStudyPath('de', 'english-job-agent')).toBe('/de/work/english-job-agent/');
  expect(getProjectCaseStudyPath('zh', 'news-sentiment')).toBe('/zh/work/news-sentiment/');
  expect(getProjectCaseStudyPath('en', 'water-quality')).toBe('/work/water-quality/');
});
```

- [ ] **Step 2: Run the focused route test**

Run: `npx vitest run tests/routes.test.ts`

Expected: FAIL because `src/utils/project-route.ts` does not exist.

- [ ] **Step 3: Implement the exhaustive route helper**

```ts
import type { Locale } from '../content';
import type { ProjectId } from '../content/types';
import { getLocalizedPath } from '../i18n/routes';

const projectRoutes = {
  patentpath: 'patentpath',
  'english-job-agent': 'jobAgent',
  'news-sentiment': 'newsSentiment',
  'water-quality': 'waterQuality',
} as const;

export function getProjectCaseStudyPath(
  locale: Locale,
  projectId: ProjectId,
): string {
  return getLocalizedPath(locale, projectRoutes[projectId]);
}
```

- [ ] **Step 4: Run the focused route test**

Run: `npx vitest run tests/routes.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the route helper**

```bash
git add src/utils/project-route.ts tests/routes.test.ts
git commit -m "refactor: centralize project case-study routes"
```

### Task 3: Build Visual Evidence for Every Project

**Files:**
- Modify: `src/components/ProjectVisual.astro`
- Test: `tests/shell-contract.test.ts`

- [ ] **Step 1: Add a failing source contract for the new visual variants**

Read `ProjectVisual.astro` alongside the existing component sources at the top of `tests/shell-contract.test.ts`, then add:

```ts
const projectVisualSource = readFileSync(
  fileURLToPath(
    new URL('../src/components/ProjectVisual.astro', import.meta.url),
  ),
  'utf8',
);

it('defines evidence-shaped visuals for every project type', () => {
  for (const projectId of [
    'patentpath',
    'english-job-agent',
    'news-sentiment',
    'water-quality',
  ]) {
    expect(projectVisualSource).toContain(
      `data-project-visual="${projectId}"`,
    );
  }

  expect(projectVisualSource).toContain('data-sentiment-step');
  expect(projectVisualSource).toContain('data-model-mark');
});
```

- [ ] **Step 2: Run the focused source-contract test**

Run: `npx vitest run tests/shell-contract.test.ts`

Expected: FAIL because the research visuals are absent.

- [ ] **Step 3: Expand `ProjectVisual.astro`**

Change its props to accept every `ProjectId`, an accessible `label`, and optional job-agent stages. Preserve the PatentPATH real-image preview and job pipeline. Add:

```astro
{props.projectId === 'news-sentiment' && (
  <div class="project-visual sentiment-visual" data-project-visual="news-sentiment" role="img" aria-label={props.label}>
    <span data-sentiment-step><i></i><i></i><i></i></span>
    <b aria-hidden="true">→</b>
    <span data-sentiment-step><i></i><i></i><i></i><i></i></span>
    <b aria-hidden="true">→</b>
    <span data-sentiment-step><i></i><i></i></span>
  </div>
)}

{props.projectId === 'water-quality' && (
  <div class="project-visual model-visual" data-project-visual="water-quality" role="img" aria-label={props.label}>
    {Array.from({ length: 6 }, (_, index) => (
      <span data-model-mark style={`--model-index:${index + 1}`}><i></i></span>
    ))}
  </div>
)}
```

Use scoped CSS to present the sentiment visual as three connected evidence stages and the water visual as six neutral comparison marks. Do not encode fabricated metric values. Set `data-project-visual="patentpath"` on the PatentPATH root.

- [ ] **Step 4: Run the focused test and type check**

Run: `npx vitest run tests/shell-contract.test.ts && npm run check`

Expected: PASS.

- [ ] **Step 5: Commit the visual variants**

```bash
git add src/components/ProjectVisual.astro tests/shell-contract.test.ts
git commit -m "feat: add evidence visuals for every project"
```

### Task 4: Create the Studio Project Card

**Files:**
- Create: `src/components/StudioProjectCard.astro`
- Test: `tests/build-output.test.ts`

- [ ] **Step 1: Add the required semantic-card assertions**

For each built Work page:

```ts
expect($('[data-studio-project]')).toHaveLength(4);
expect($('[data-studio-project][data-studio-variant="featured"]')).toHaveLength(1);
expect($('[data-studio-project][data-studio-variant="supporting"]')).toHaveLength(3);
```

- [ ] **Step 2: Implement `StudioProjectCard.astro`**

Define props for locale, project, sections, visuals, actions, variant, and reveal delay. Resolve demo/source URLs with `getSafeProjectAction`; resolve a case-study route only when `project.actions.caseStudy` is true. Render this stable structure:

```astro
<article
  class:list={['studio-project', `studio-project--${variant}`, 'reveal']}
  data-studio-project={project.id}
  data-studio-variant={variant}
  data-reveal-delay={String(revealDelay)}
>
  <div class="studio-project__copy">
    <p class="section-label">{project.kicker}</p>
    <h3>{project.title}</h3>
    <p class="studio-project__summary">{project.summary}</p>
    {project.contribution && <p class="studio-project__role"><strong>{sections.contribution}</strong><span>{project.contribution}</span></p>}
    <ul class="studio-project__evidence">{project.details.map((detail) => <li>{detail}</li>)}</ul>
    <ul class="studio-project__tags" aria-label={project.title}>{project.tags.map((tag) => <li>{tag}</li>)}</ul>
    {(demoUrl || sourceUrl || caseStudyPath) && (
      <div class="text-actions">
        {demoUrl && <a class="external" href={demoUrl} rel="noreferrer">{actions.demo}</a>}
        {demoUrl && project.demoNote && <p class="demo-note">{project.demoNote}</p>}
        {sourceUrl && <a class="external" href={sourceUrl} rel="noreferrer">{actions.source}</a>}
        {caseStudyPath && <a href={caseStudyPath}>{actions.caseStudy}</a>}
      </div>
    )}
  </div>
  <div class="studio-project__visual">
    {caseStudyPath ? (
      <a class="studio-project__visual-link" href={caseStudyPath} aria-label={`${actions.caseStudy}: ${project.title}`}>
        <ProjectVisual projectId={project.id} label={`${project.title}: ${project.summary}`} stages={project.id === 'english-job-agent' ? visuals.jobAgentStages : undefined} />
      </a>
    ) : (
      <ProjectVisual projectId={project.id} label={`${project.title}: ${project.summary}`} stages={project.id === 'english-job-agent' ? visuals.jobAgentStages : undefined} />
    )}
  </div>
</article>
```

The action block must preserve `rel="noreferrer"` on external links and render `demoNote` only beside an existing demo action. Give the visual link an explicit `${actions.caseStudy}: ${project.title}` accessible name.

- [ ] **Step 3: Run Astro type checking**

Run: `npm run check`

Expected: PASS.

- [ ] **Step 4: Commit the project-card unit**

```bash
git add src/components/StudioProjectCard.astro tests/build-output.test.ts
git commit -m "feat: build the Floating Studio project card"
```

### Task 5: Compose Homepage and Full Work Studio

**Files:**
- Create: `src/components/ProjectStudio.astro`
- Modify: `src/components/HomePage.astro`
- Modify: `src/components/WorkPage.astro`
- Delete: `src/components/FeaturedProject.astro`
- Delete: `src/components/ProjectGrid.astro`
- Test: `tests/build-output.test.ts`

- [ ] **Step 1: Add composition assertions**

For localized homepages:

```ts
expect($('[data-project-studio][data-studio-mode="teaser"]')).toHaveLength(1);
expect($('[data-studio-project]')).toHaveLength(1);
expect($('[data-studio-project="patentpath"]')).toHaveLength(1);
expect($(`a[href="${workPath}"]`)).toHaveLength(1);
```

For localized Work pages:

```ts
expect($('[data-project-studio][data-studio-mode="full"]')).toHaveLength(1);
expect($('[data-work-intro]')).toHaveLength(1);
expect($('[data-studio-project]')).toHaveLength(4);
```

- [ ] **Step 2: Implement `ProjectStudio.astro`**

The component accepts locale, projects, sections, visuals, actions, mode, optional workIntro, and headingTag. It renders the existing localized section heading, the Work introduction only in full mode, one featured `StudioProjectCard`, supporting cards only in full mode, and the localized All Projects link only in teaser mode.

Use `data-project-studio` and `data-studio-mode={mode}` on the section; use `data-studio-field` on the atmospheric card container and preserve `id="work"` plus `aria-labelledby="work-heading"`.

Render this component body:

```astro
<section id="work" aria-labelledby="work-heading" data-project-studio data-studio-mode={mode}>
  <div class="section-heading reveal" data-reveal-delay="0">
    <Heading id="work-heading">{sections.work}</Heading>
  </div>
  {mode === 'full' && workIntro && (
    <header class="work-intro reveal" data-work-intro>
      <p class="section-label">{workIntro.eyebrow}</p>
      <h2>{workIntro.title}</h2>
      <p>{workIntro.summary}</p>
    </header>
  )}
  <div class="studio-field" data-studio-field>
    <StudioProjectCard locale={locale} project={featured} sections={sections} visuals={visuals} actions={actions} variant="featured" revealDelay={0} />
    {mode === 'full' && (
      <div class="studio-supporting">
        {supportingProjects.map((project, index) => (
          <StudioProjectCard locale={locale} project={project} sections={sections} visuals={visuals} actions={actions} variant="supporting" revealDelay={(index + 1) * 70} />
        ))}
      </div>
    )}
  </div>
  {mode === 'teaser' && (
    <div class="studio-all-projects reveal" data-reveal-delay="120">
      <a href={getLocalizedPath(locale, 'work')}>{actions.allProjects} →</a>
    </div>
  )}
</section>
```

- [ ] **Step 3: Integrate both page components**

Replace `FeaturedProject` in `HomePage.astro` with:

```astro
<ProjectStudio
  locale={locale}
  projects={copy.projects}
  sections={copy.sections}
  visuals={copy.visuals}
  actions={copy.actions}
  mode="teaser"
/>
```

Replace `ProjectGrid` in `WorkPage.astro` with the same component using `mode="full"`, `workIntro={copy.workIntro}`, and `headingTag="h1"`.

- [ ] **Step 4: Remove the obsolete project components**

Delete `FeaturedProject.astro` and `ProjectGrid.astro` only after `rg "FeaturedProject|ProjectGrid" src` returns no imports.

- [ ] **Step 5: Run type and unit/build tests**

Run: `npm run check && npx vitest run tests/content.test.ts tests/routes.test.ts tests/build-output.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the shared composition**

```bash
git add src/components/ProjectStudio.astro src/components/StudioProjectCard.astro src/components/HomePage.astro src/components/WorkPage.astro src/components/FeaturedProject.astro src/components/ProjectGrid.astro tests/build-output.test.ts
git commit -m "feat: compose the homepage and Work Floating Studio"
```

### Task 6: Implement the Responsive Floating Studio and Motion

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/StudioProjectCard.astro`
- Modify: `src/components/ProjectVisual.astro`
- Test: `tests/portfolio.spec.ts`
- Test: `tests/shell-contract.test.ts`

- [ ] **Step 1: Replace obsolete selector contracts**

Update shell-contract selector expectations from `.project-featured__body`, `.project-featured__visual`, and `.project-card` to `.studio-project__copy`, `.studio-project__visual`, and `.studio-project`.

- [ ] **Step 2: Add failing Playwright behavior tests**

Add tests that assert:

```ts
test('/work/ uses one featured and three supporting studio projects', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/');
  await expect(page.locator('[data-studio-project]')).toHaveCount(4);
  await expect(page.locator('[data-studio-variant="featured"]')).toHaveCount(1);
  await expect(page.locator('[data-studio-variant="supporting"]')).toHaveCount(3);
});

test('/work/ removes studio distortion on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/work/');
  for (const card of await page.locator('[data-studio-project]').all()) {
    await expect(card).toHaveCSS('transform', 'none');
  }
  await expectNoHorizontalOverflow(page);
});

test('reduced motion renders the Work studio in its final state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/');
  for (const card of await page.locator('[data-studio-project]').all()) {
    await expect(card).toHaveCSS('animation-name', 'none');
    await expect(card).toHaveCSS('opacity', '1');
  }
});
```

Update former `.project-featured__*` responsive assertions to the new studio selectors rather than deleting their intent.

- [ ] **Step 3: Implement the global studio layout**

Remove `.project-featured`, `.project-grid`, and `.project-card` blocks from `global.css`. Add:

- a roomy Work introduction with a large restrained display heading;
- `studio-field` pale blue/warm-neutral atmospheric background using `color-mix` and existing tokens;
- featured two-column card with low shadow and sub-two-degree final rotation;
- supporting two-column loose grid with unique small static offsets;
- card hover lift only inside the fine-pointer media query;
- single-column layout below 760px with `transform: none`, no overlap, no cursor cue, and 44px actions;
- reduced-motion overrides that remove animation/transition and force final opacity/transform.

Use the existing `--motion-*` and `--ease-*` tokens. Keep all visual movement transform-only; never animate layout properties.

- [ ] **Step 4: Adapt PatentPATH sequence selectors**

Change `ProjectVisual.astro` global selectors from `.project-featured__visual.reveal--visible` to `.studio-project.reveal--visible`, and hover/focus pausing from `.project-featured__visual-link` to `.studio-project__visual-link`.

- [ ] **Step 5: Run the focused browser suite**

Run: `npx playwright test tests/portfolio.spec.ts`

Expected: PASS at desktop, mobile, and reduced-motion cases.

- [ ] **Step 6: Commit the visual system**

```bash
git add src/styles/global.css src/components/StudioProjectCard.astro src/components/ProjectVisual.astro tests/portfolio.spec.ts tests/shell-contract.test.ts
git commit -m "style: soften Work into a responsive Floating Studio"
```

### Task 7: Full Verification and Final Polish

**Files:**
- Modify only files implicated by a failing check.

- [ ] **Step 1: Run formatting and static checks**

Run: `git diff --check && npm run check`

Expected: no whitespace errors and zero Astro diagnostics.

- [ ] **Step 2: Run unit and build verification**

Run: `npm run test && npm run build`

Expected: all Vitest tests pass and Astro builds all localized pages.

- [ ] **Step 3: Run end-to-end and accessibility verification**

Run: `npm run test:e2e`

Expected: all Playwright and axe checks pass.

- [ ] **Step 4: Inspect representative renders**

Inspect `/`, `/work/`, `/de/work/`, and `/zh/work/` at 1440px; inspect `/work/` and `/zh/work/` at 320px/390px; repeat `/work/` with reduced motion. Confirm no card collision, clipped text, hidden actions, or horizontal overflow.

- [ ] **Step 5: Confirm scope and repository hygiene**

Run:

```bash
git status --short
git diff --stat HEAD~1
rg "FeaturedProject|ProjectGrid|project-featured|project-grid|project-card" src tests
```

Expected: only intended implementation/test files differ; obsolete component/selector references are absent. Leave pre-existing `.impeccable/` and `.superpowers/` files untracked and untouched.

- [ ] **Step 6: Commit any verification fixes**

If verification required changes:

```bash
git add -p
git commit -m "fix: harden the Floating Studio across breakpoints"
```

If no changes were required, do not create an empty commit.
