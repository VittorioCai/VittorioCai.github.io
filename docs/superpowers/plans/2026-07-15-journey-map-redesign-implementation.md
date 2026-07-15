# Journey Map Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abstract profile journey graphic with a recognizable, self-hosted world map that accurately presents Florence → Wenzhou → Heilbronn.

**Architecture:** A new `JourneyMap.astro` component owns inline Natural Earth land geometry, the graticule, route legs, numbered markers, animation, and the localized semantic legend. `ProfileIdentity.astro` keeps identity and contact responsibilities and passes its existing journey strings into that component. Built-output and browser tests lock down geometry, privacy, animation, reduced motion, and responsive containment.

**Tech Stack:** Astro, TypeScript props, inline SVG/CSS, Vitest + Cheerio, Playwright

---

### Task 1: Lock down the corrected map contract

**Files:**
- Modify: `tests/build-output.test.ts`
- Modify: `tests/portfolio.spec.ts`

- [x] **Step 1: Add failing built-output assertions**

Add assertions to each localized profile contract for substantial land geometry, two route legs, three map stops, one current stop, and no third-party map embed:

```ts
expect($('[data-journey-land] path').length).toBeGreaterThan(3);
expect($('[data-journey-route-leg]')).toHaveLength(2);
expect($('[data-journey-map-stop]')).toHaveLength(3);
expect($('[data-current-stop]')).toHaveLength(1);
expect($('[data-profile-journey] img, [data-profile-journey] iframe, [data-profile-journey] script')).toHaveLength(0);
expect($('[data-journey-land] path').first().attr('d')?.length).toBeGreaterThan(1000);
```

- [x] **Step 2: Add failing browser assertions**

Update the desktop and reduced-motion tests to address both route legs and add a marker-containment assertion:

```ts
const routeAnimations = await page.locator('[data-journey-route-leg]').evaluateAll((legs) =>
  legs.map((leg) => getComputedStyle(leg).animationName),
);
expect(routeAnimations.every((name) => name.includes('journey-route-in'))).toBe(true);

const contained = await page.locator('[data-profile-journey] svg').evaluate((svg) => {
  const frame = svg.getBoundingClientRect();
  return [...svg.querySelectorAll('[data-journey-map-stop]')].every((marker) => {
    const box = marker.getBoundingClientRect();
    return box.left >= frame.left && box.right <= frame.right && box.top >= frame.top && box.bottom <= frame.bottom;
  });
});
expect(contained).toBe(true);
```

- [x] **Step 3: Run tests to verify they fail**

Run: `npm run build && npx vitest run tests/build-output.test.ts && npx playwright test tests/portfolio.spec.ts --grep "journey|identity rail"`

Expected: FAIL because the old map has no real-land group, route-leg hooks, or map-stop hooks.

### Task 2: Build the real world journey component

**Files:**
- Create: `src/components/JourneyMap.astro`
- Modify: `src/components/ProfileIdentity.astro`

- [x] **Step 1: Add a focused component interface**

Create the component with the existing localized strings as its only data dependency:

```astro
---
interface Props {
  heading: string;
  stops: string[];
}

const { heading, stops } = Astro.props;
---
```

- [x] **Step 2: Add self-hosted map geometry and route semantics**

Render public-domain Natural Earth 1:110m land paths inside a `0 0 360 180` projection, two route paths, and three map markers:

```astro
<figure class="journey-map" data-profile-journey>
  <figcaption>{heading}</figcaption>
  <svg viewBox="0 0 360 180" aria-hidden="true">
    <g data-journey-graticule>...</g>
    <g data-journey-land>...</g>
    <g data-journey-route>
      <path data-journey-route-leg pathLength="1" d="M191.3 46.2C225 24 276 32 300.7 62" />
      <path data-journey-route-leg pathLength="1" d="M300.7 62C270 18 220 22 189.2 40.9" />
    </g>
    <g data-journey-map-stop>...</g>
    <g data-journey-map-stop>...</g>
    <g data-journey-map-stop data-current-stop>...</g>
  </svg>
  <ol>...</ol>
</figure>
```

- [x] **Step 3: Add restrained route and marker motion**

Use normalized SVG path lengths so both legs share one animation, then delay the return leg and marker reveals. Make the reduced-motion state complete and static:

```css
[data-journey-route-leg] {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: journey-route-in 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--route-delay) both;
}

@keyframes journey-route-in {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  [data-journey-route-leg], [data-journey-map-stop] {
    animation: none;
    opacity: 1;
  }
}
```

- [x] **Step 4: Replace the old inline map**

Import and render the component from `ProfileIdentity.astro`, then remove the obsolete map markup and map-specific styles:

```astro
import JourneyMap from './JourneyMap.astro';

<JourneyMap
  heading={profileRail.journeyHeading}
  stops={profileRail.journeyStops}
/>
```

- [x] **Step 5: Run targeted tests to verify they pass**

Run: `npm run build && npx vitest run tests/build-output.test.ts && npx playwright test tests/portfolio.spec.ts --grep "journey|identity rail"`

Expected: PASS.

### Task 3: Verify the rendered result and publish

**Files:**
- Modify only if browser review exposes a specific defect: `src/components/JourneyMap.astro`

- [x] **Step 1: Inspect desktop and mobile renderings**

Run: `npm run dev -- --host 127.0.0.1`

Open `/profile/` at 1440×1000 and 390×844. Confirm recognizable land geometry, route direction, legible numbered markers, aligned legend, and no horizontal overflow. Inspect browser console errors.

- [x] **Step 2: Run frontend quality detection**

Run: `npx impeccable detect src/components/ProfileIdentity.astro src/components/JourneyMap.astro`

Expected: no blocking design-system or implementation findings.

- [x] **Step 3: Run the complete verification suite**

Run: `npm run verify`

Expected: all lint, type, unit, build, accessibility, and Playwright checks pass.

- [x] **Step 4: Commit the implementation**

```bash
git add src/components/JourneyMap.astro src/components/ProfileIdentity.astro tests/build-output.test.ts tests/portfolio.spec.ts docs/superpowers/plans/2026-07-15-journey-map-redesign-implementation.md
git commit -m "feat: rebuild profile journey map"
```

- [x] **Step 5: Push the verified `main` branch**

Run: `git push origin main`

Expected: `main -> main` and local `main` is synchronized with `origin/main`.
