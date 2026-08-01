# PatentPATH Homepage Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abstract featured PatentPATH wireframe with a one-pass animated sequence of the real Overview, Patents, and Risk Check screens.

**Architecture:** Keep `FeaturedProject.astro` as the linked featured-card shell and replace only the PatentPATH branch inside `ProjectVisual.astro`. Use the existing reveal observer as the animation trigger and CSS transforms/opacity for the sequence, so no carousel state, timers, content fields, or dependencies are introduced.

**Tech Stack:** Astro, TypeScript, scoped CSS, Playwright, Vitest

---

## File structure

- Modify `src/components/ProjectVisual.astro`: render the three local screenshots and own their sequence, progress marks, responsive frame, and reduced-motion behavior.
- Modify `src/components/FeaturedProject.astro`: retarget the existing foreground selector from the removed abstract `.patent-visual` implementation to the new real preview without changing the card shell or pointer cue.
- Modify `tests/portfolio.spec.ts`: define browser-level contracts for real screenshots, one-pass sequencing, pointer behavior, and reduced motion.

### Task 1: Replace the abstract visual with real product screens

**Files:**
- Modify: `tests/portfolio.spec.ts`
- Modify: `src/components/ProjectVisual.astro`
- Modify: `src/components/FeaturedProject.astro`

- [ ] **Step 1: Write the failing real-screen contract**

Extend the existing featured-project test after the motion-layer assertion:

```ts
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
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npx playwright test tests/portfolio.spec.ts --grep "featured project visual"
```

Expected: FAIL because `[data-patent-preview]` and its screenshots do not exist.

- [ ] **Step 3: Replace the PatentPATH markup**

In `src/components/ProjectVisual.astro`, replace the abstract PatentPATH branch with:

```astro
{
  props.projectId === 'patentpath' && (
    <div
      class="project-visual patent-preview"
      data-patent-preview
      role="img"
      aria-label={props.label}
    >
      <div class="patent-preview__bar" aria-hidden="true">
        <span class="patent-preview__brand">patentPATH</span>
        <span class="patent-preview__progress">
          <i class="patent-preview__mark patent-preview__mark--overview"></i>
          <i class="patent-preview__mark patent-preview__mark--patents"></i>
          <i class="patent-preview__mark patent-preview__mark--risk"></i>
        </span>
      </div>
      <div class="patent-preview__stage" aria-hidden="true">
        <img
          class="patent-preview__screen patent-preview__screen--overview"
          data-patent-preview-screen
          src="/projects/patentpath/overview.png"
          alt=""
          width="1440"
          height="960"
          loading="lazy"
          decoding="async"
        />
        <img
          class="patent-preview__screen patent-preview__screen--patents"
          data-patent-preview-screen
          src="/projects/patentpath/patents.png"
          alt=""
          width="1440"
          height="960"
          loading="lazy"
          decoding="async"
        />
        <img
          class="patent-preview__screen patent-preview__screen--risk"
          data-patent-preview-screen
          src="/projects/patentpath/risk-check.png"
          alt=""
          width="1440"
          height="960"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  )
}
```

Replace the removed abstract PatentPATH CSS in the same component with the static real-screen frame:

```css
.patent-preview {
  overflow: hidden;
  border: 1px solid var(--ink);
  background: var(--paper);
}

.patent-preview__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 2rem;
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--line);
}

.patent-preview__brand {
  color: var(--ink);
  font-size: 0.64rem;
  font-weight: 700;
}

.patent-preview__progress {
  display: flex;
  gap: 0.3rem;
}

.patent-preview__mark {
  display: block;
  width: 1.25rem;
  height: 2px;
  background: var(--line);
}

.patent-preview__mark--overview {
  background: var(--accent);
}

.patent-preview__stage {
  position: relative;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--surface);
}

.patent-preview__screen {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  opacity: 0;
}

.patent-preview__screen--overview {
  opacity: 1;
}
```

In `src/components/FeaturedProject.astro`, replace every scoped `:global(.patent-visual)` selector with `:global(.patent-preview)`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npx playwright test tests/portfolio.spec.ts --grep "featured project visual"
```

Expected: PASS and all three images report complete local sources.

- [ ] **Step 5: Commit the static real-screen replacement**

```bash
git add src/components/ProjectVisual.astro src/components/FeaturedProject.astro tests/portfolio.spec.ts
git commit -m "feat: show real PatentPATH screens on the homepage"
```

### Task 2: Add the one-pass three-screen sequence

**Files:**
- Modify: `tests/portfolio.spec.ts`
- Modify: `src/components/ProjectVisual.astro`

- [ ] **Step 1: Write the failing sequence test**

In the featured-project test, after scrolling the link into view, add:

```ts
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
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npx playwright test tests/portfolio.spec.ts --grep "featured project visual"
```

Expected: FAIL because Risk Check remains at opacity `0` and has no animation.

- [ ] **Step 3: Add the reveal-triggered CSS sequence**

Add these rules and keyframes to `ProjectVisual.astro`:

```css
html[data-motion='ready']
  :global(.project-featured__visual.reveal--visible)
  .patent-preview__screen,
html[data-motion='ready']
  :global(.project-featured__visual.reveal--visible)
  .patent-preview__mark {
  animation-duration: 4500ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: both;
  animation-iteration-count: 1;
}

html[data-motion='ready']
  :global(.project-featured__visual.reveal--visible)
  .patent-preview__screen--overview {
  animation-name: patent-overview-sequence;
}

html[data-motion='ready']
  :global(.project-featured__visual.reveal--visible)
  .patent-preview__screen--patents {
  animation-name: patent-patents-sequence;
}

html[data-motion='ready']
  :global(.project-featured__visual.reveal--visible)
  .patent-preview__screen--risk {
  animation-name: patent-risk-sequence;
}

html[data-motion='ready']
  :global(.project-featured__visual.reveal--visible)
  .patent-preview__mark--overview {
  animation-name: patent-overview-mark;
}

html[data-motion='ready']
  :global(.project-featured__visual.reveal--visible)
  .patent-preview__mark--patents {
  animation-name: patent-patents-mark;
}

html[data-motion='ready']
  :global(.project-featured__visual.reveal--visible)
  .patent-preview__mark--risk {
  animation-name: patent-risk-mark;
}

:global(.project-featured__visual-link:hover)
  .patent-preview__screen,
:global(.project-featured__visual-link:hover)
  .patent-preview__mark,
:global(.project-featured__visual-link:focus-visible)
  .patent-preview__screen,
:global(.project-featured__visual-link:focus-visible)
  .patent-preview__mark {
  animation-play-state: paused;
}

@keyframes patent-overview-sequence {
  0%,
  28% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  38%,
  100% {
    opacity: 0;
    transform: translate3d(-4%, 0, 0) scale(0.985);
  }
}

@keyframes patent-patents-sequence {
  0%,
  28% {
    opacity: 0;
    transform: translate3d(5%, 0, 0) scale(1.015);
  }

  38%,
  62% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  72%,
  100% {
    opacity: 0;
    transform: translate3d(-4%, 0, 0) scale(0.985);
  }
}

@keyframes patent-risk-sequence {
  0%,
  62% {
    opacity: 0;
    transform: translate3d(5%, 0, 0) scale(1.015);
  }

  72%,
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes patent-overview-mark {
  0%,
  28% {
    opacity: 1;
    transform: scaleX(1);
  }

  38%,
  100% {
    opacity: 0.35;
    transform: scaleX(0.72);
  }
}

@keyframes patent-patents-mark {
  0%,
  28%,
  72%,
  100% {
    opacity: 0.35;
    transform: scaleX(0.72);
  }

  38%,
  62% {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes patent-risk-mark {
  0%,
  62% {
    opacity: 0.35;
    transform: scaleX(0.72);
  }

  72%,
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npx playwright test tests/portfolio.spec.ts --grep "featured project visual"
```

Expected: PASS after approximately 4.5 seconds, with one finite animation and Risk Check at opacity `1`.

- [ ] **Step 5: Commit the carousel sequence**

```bash
git add src/components/ProjectVisual.astro tests/portfolio.spec.ts
git commit -m "feat: animate the PatentPATH product preview"
```

### Task 3: Guarantee reduced-motion behavior

**Files:**
- Modify: `tests/portfolio.spec.ts`
- Modify: `src/components/ProjectVisual.astro`

- [ ] **Step 1: Write the failing reduced-motion test**

Add:

```ts
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
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npx playwright test tests/portfolio.spec.ts --grep "product preview stays static"
```

Expected: FAIL because the three sequence animations still run when reduced motion is requested.

- [ ] **Step 3: Add the reduced-motion override**

Add to `ProjectVisual.astro`:

```css
@media (prefers-reduced-motion: reduce) {
  .patent-preview__screen,
  .patent-preview__mark {
    animation: none !important;
  }

  .patent-preview__screen {
    opacity: 0;
    transform: none;
  }

  .patent-preview__screen--overview {
    opacity: 1;
  }

  .patent-preview__mark {
    opacity: 0.35;
    transform: none;
  }

  .patent-preview__mark--overview {
    opacity: 1;
  }
}
```

- [ ] **Step 4: Run both focused tests and verify GREEN**

Run:

```bash
npx playwright test tests/portfolio.spec.ts --grep "featured project visual|product preview stays static"
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit the accessible fallback**

```bash
git add src/components/ProjectVisual.astro tests/portfolio.spec.ts
git commit -m "test: cover reduced-motion PatentPATH preview"
```

### Task 4: Validate and publish

**Files:**
- Verify: all tracked files

- [ ] **Step 1: Run static and full regression checks**

Run:

```bash
npm run verify
```

Expected:

- Astro check reports zero errors, warnings, and hints.
- All Vitest tests pass.
- Astro builds 25 pages.
- All Playwright tests pass, including 320px overflow and axe checks.

- [ ] **Step 2: Inspect desktop and mobile renders**

Start the local site and capture:

```bash
npm run dev -- --host 127.0.0.1 --port 4321
npx playwright screenshot --browser chromium --full-page --viewport-size "1440,1000" http://127.0.0.1:4321/ /tmp/patentpath-carousel-desktop.png
npx playwright screenshot --browser chromium --full-page --viewport-size "390,844" http://127.0.0.1:4321/ /tmp/patentpath-carousel-mobile.png
```

Confirm the frame uses real interface imagery, the mobile card remains balanced, no screenshot is distorted, and project actions remain readable.

- [ ] **Step 3: Confirm the commit scope**

Run:

```bash
git diff --check
git status --short
```

Expected: only planned files are changed; the unrelated untracked `.impeccable/` directory remains unstaged.

- [ ] **Step 4: Push main and monitor deployment**

Run:

```bash
git push origin main
gh run list --workflow deploy.yml --branch main --limit 1
gh run watch "$(gh run list --workflow deploy.yml --branch main --limit 1 --json databaseId --jq '.[0].databaseId')" --exit-status
```

Expected: the GitHub Pages workflow completes successfully for the final commit.

- [ ] **Step 5: Verify the live page**

Open:

```text
https://vittoriocai.github.io/
```

Confirm the deployed featured PatentPATH visual displays the real screenshot sequence and the abstract wireframe is absent.
