# Luka-Inspired Profile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the three localized profile routes with a sticky identity rail, replaceable VC monogram, Florence → Wenzhou → Heilbronn journey map, and a single scannable education/experience timeline.

**Architecture:** Astro continues to statically generate the site from typed locale objects. A new focused `ProfileIdentity.astro` owns identity links and the inline SVG journey map; existing profile, experience, and skill components remain responsible for their current content but adopt a profile-page timeline layout inside a new two-column shell.

**Tech Stack:** Astro 7, TypeScript, scoped CSS, inline SVG, Vitest/Cheerio, Playwright, axe-core

---

## File map

- Create `src/components/ProfileIdentity.astro`: identity rail, monogram, professional links, journey map, reduced-motion styling.
- Modify `src/content/types.ts`: typed localized profile-rail copy and three-stop tuple.
- Modify `src/content/en.ts`, `src/content/de.ts`, `src/content/zh.ts`: localized identity and journey labels.
- Modify `src/components/ProfilePage.astro`: compose the rail and right-hand content column.
- Modify `src/components/ProfileSection.astro`: make the page summary and education a timeline section with an `h2`.
- Modify `src/components/ExperienceList.astro`: use the same timeline grammar.
- Modify `src/components/SkillGroups.astro`: render skills inside the right-hand content column.
- Modify `src/styles/global.css`: remove obsolete full-width profile-grid rules.
- Modify `tests/content.test.ts`: verify localized journey data and exact stop order.
- Modify `tests/build-output.test.ts`: verify the three built profile pages.
- Modify `tests/portfolio.spec.ts`: verify desktop stickiness, mobile stacking/reflow, reduced motion, and accessibility.

### Task 1: Type and localize the profile rail

**Files:**
- Modify: `tests/content.test.ts`
- Modify: `src/content/types.ts`
- Modify: `src/content/en.ts`
- Modify: `src/content/de.ts`
- Modify: `src/content/zh.ts`

- [ ] **Step 1: Write the failing locale test**

Add a test that asserts every locale exposes a three-stop tuple and that English uses the user-confirmed order:

```ts
it('defines a localized three-stop profile journey', () => {
  expect(en.profileRail.journeyStops).toEqual([
    'Florence',
    'Wenzhou',
    'Heilbronn',
  ]);

  for (const content of [en, de, zh]) {
    expect(content.profileRail.role).toBeTruthy();
    expect(content.profileRail.currentLocation).toBeTruthy();
    expect(content.profileRail.journeyHeading).toBeTruthy();
    expect(content.profileRail.linksHeading).toBeTruthy();
    expect(content.profileRail.journeyStops).toHaveLength(3);
  }
});
```

- [ ] **Step 2: Run the test and confirm it fails because `profileRail` is absent**

Run: `npx vitest run tests/content.test.ts`

Expected: FAIL with an undefined `profileRail` access.

- [ ] **Step 3: Add the type and localized content**

Add this field to `SiteContent`:

```ts
profileRail: {
  role: string;
  currentLocation: string;
  journeyHeading: string;
  linksHeading: string;
  journeyStops: [string, string, string];
};
```

Add equivalent values to each locale. Use these exact stop tuples:

```ts
// en
journeyStops: ['Florence', 'Wenzhou', 'Heilbronn']

// de
journeyStops: ['Florenz', 'Wenzhou', 'Heilbronn']

// zh
journeyStops: ['佛罗伦萨', '温州', '海尔布隆']
```

- [ ] **Step 4: Run the content test and confirm it passes**

Run: `npx vitest run tests/content.test.ts`

Expected: all content tests pass.

### Task 2: Add the identity rail and journey map

**Files:**
- Modify: `tests/build-output.test.ts`
- Create: `src/components/ProfileIdentity.astro`
- Modify: `src/components/ProfilePage.astro`

- [ ] **Step 1: Extend the built-profile contract first**

For every localized profile page, assert:

```ts
expect($('[data-profile-identity]')).toHaveLength(1);
expect($('[data-profile-monogram]').text().trim()).toBe('VC');
expect($('[data-profile-journey]')).toHaveLength(1);
expect(
  $('[data-journey-stop]')
    .map((_, element) => $(element).text().trim())
    .get(),
).toHaveLength(3);
expect($('a[href="mailto:vittorio.cai@tum.de"]')).toHaveLength(1);
expect($('a[href="https://www.linkedin.com/in/vittorio-cai-3ba0b7385"]')).toHaveLength(1);
expect($('a[href="https://github.com/VittorioCai"]')).toHaveLength(1);
expect($('a[href="/Vittorio-Cai-CV-English.pdf"]')).toHaveLength(1);
```

- [ ] **Step 2: Build and confirm the contract fails**

Run: `npm run build && npx vitest run tests/build-output.test.ts`

Expected: FAIL because the identity rail and journey selectors are missing.

- [ ] **Step 3: Create `ProfileIdentity.astro`**

The component must accept `profileRail`, `actions`, and `locale`; render `Vittorio Cai` as the single `h1`; expose text links; draw a decorative SVG route; and render the localized stops as an ordered list. The core structure is:

```astro
<aside class="profile-identity" data-profile-identity>
  <div class="profile-identity__sticky">
    <div class="profile-identity__monogram" data-profile-monogram aria-hidden="true">VC</div>
    <h1>Vittorio Cai</h1>
    <p class="profile-identity__role">{profileRail.role}</p>
    <p class="profile-identity__location">{profileRail.currentLocation}</p>
    <nav aria-label={profileRail.linksHeading}>
      <a href="mailto:vittorio.cai@tum.de">{actions.email}</a>
      <a href="https://www.linkedin.com/in/vittorio-cai-3ba0b7385" rel="noreferrer">LinkedIn</a>
      <a href="https://github.com/VittorioCai" rel="noreferrer">GitHub</a>
      <a href="/Vittorio-Cai-CV-English.pdf" download>{actions.cv}</a>
    </nav>
    <figure data-profile-journey>
      <figcaption>{profileRail.journeyHeading}</figcaption>
      <svg aria-hidden="true" viewBox="0 0 320 170">
        <path
          data-journey-route
          d="M70 110 C130 28 246 42 270 108 C220 18 126 24 88 62"
        />
        <circle cx="70" cy="110" r="6" />
        <circle cx="270" cy="108" r="6" />
        <circle cx="88" cy="62" r="6" />
      </svg>
      <ol>
        {profileRail.journeyStops.map((stop) => <li data-journey-stop>{stop}</li>)}
      </ol>
    </figure>
  </div>
</aside>
```

Use CSS-only route drawing with `stroke-dasharray` and `stroke-dashoffset`; inside `prefers-reduced-motion: reduce`, disable animation and keep `stroke-dashoffset: 0`.

- [ ] **Step 4: Compose the two-column shell**

Update `ProfilePage.astro` to render the identity component first and wrap existing sections in `.profile-page__content`:

```astro
<div class="profile-page" data-profile-page>
  <ProfileIdentity locale={locale} profileRail={copy.profileRail} actions={copy.actions} />
  <div class="profile-page__content">
    <ProfileSection
      heading={copy.sections.profile}
      profile={copy.profile}
      education={copy.education}
    />
    <ExperienceList
      heading={copy.sections.experience}
      experience={copy.experience}
    />
    <SkillGroups
      heading={copy.sections.skills}
      skillGroups={copy.skillGroups}
      languages={copy.languages}
      languageHeading={copy.sections.languages}
    />
  </div>
</div>
```

At widths above `760px`, use a `minmax(18rem, 0.8fr) minmax(0, 2.2fr)` grid and a one-pixel divider. At `760px` and below, use one column and normal document flow.

- [ ] **Step 5: Build and confirm the contract passes**

Run: `npm run build && npx vitest run tests/build-output.test.ts`

Expected: all built-output tests pass.

### Task 3: Convert the right column to a timeline

**Files:**
- Modify: `src/components/ProfileSection.astro`
- Modify: `src/components/ExperienceList.astro`
- Modify: `src/components/SkillGroups.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Reuse one section grammar**

Give all three components the class `.profile-content-section`, with a compact heading header and content body. Education and experience entries keep their current semantic `article` elements and data but share a timeline wrapper and dot:

```astro
<article class="profile-timeline__entry">
  <span class="profile-timeline__dot" aria-hidden="true"></span>
  <p class="profile-timeline__period">{entry.period}</p>
  <div>
    <h3>{entry.school}</h3>
    <p>{entry.degree}</p>
    <p>{entry.location}</p>
  </div>
</article>
```

The right column starts with an `h2`; the page-level `h1` remains in `ProfileIdentity.astro`.

- [ ] **Step 2: Remove obsolete global profile grid rules**

Delete the old `.profile-grid`, `.experience-grid`, `.section-side`, `.section-main`, `.education-row`, and `.experience-row` layout rules once the scoped component styles no longer use them. Keep unrelated project, case-study, and homepage styles unchanged.

- [ ] **Step 3: Check type and build output**

Run: `npm run check && npm run build`

Expected: zero Astro diagnostics and 19 generated pages.

### Task 4: Verify responsive and motion behavior

**Files:**
- Modify: `tests/portfolio.spec.ts`

- [ ] **Step 1: Add browser tests before final styling changes**

Add tests that assert:

```ts
test('/profile/ keeps its identity rail sticky on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/profile/');
  await expect(page.locator('[data-profile-identity]')).toHaveCSS('position', 'relative');
  await expect(page.locator('.profile-identity__sticky')).toHaveCSS('position', 'sticky');
});

test('/profile/ stacks its identity rail on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/profile/');
  await expect(page.locator('.profile-identity__sticky')).toHaveCSS('position', 'static');
  await expectNoHorizontalOverflow(page);
});

test('/profile/ keeps the journey visible with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/profile/');
  await expect(page.locator('[data-journey-route]')).toHaveCSS('stroke-dashoffset', '0px');
});
```

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `npx playwright test tests/portfolio.spec.ts --grep 'identity rail|journey visible'`

Expected: FAIL until responsive and reduced-motion selectors are complete.

- [ ] **Step 3: Finish scoped responsive CSS**

Ensure the sticky rail, one-column mobile layout, map sizing, focus styles, and route fallback satisfy the focused tests without adding JavaScript or third-party map assets.

- [ ] **Step 4: Run focused tests until green**

Run: `npx playwright test tests/portfolio.spec.ts --grep 'identity rail|journey visible'`

Expected: all focused profile tests pass.

### Task 5: Full verification and visual QA

**Files:**
- No production files unless verification reveals a regression.

- [ ] **Step 1: Run the complete project verification**

Run: `npm run verify`

Expected: Astro check, Vitest, build, and all Playwright tests pass.

- [ ] **Step 2: Repeat the accessibility suite**

Run: `npx playwright test tests/portfolio.spec.ts --grep 'sound landmarks' --repeat-each=3`

Expected: zero serious axe violations across all runs.

- [ ] **Step 3: Inspect English, German, and Chinese profile pages**

Use a production preview at desktop and mobile widths. Confirm the monogram reads as an intentional placeholder, the route order is Florence → Wenzhou → Heilbronn, text never overlaps the map, and all three languages preserve the same hierarchy.

- [ ] **Step 4: Confirm a clean diff**

Run: `git diff --check && git status --short`

Expected: only the approved profile redesign files are modified.
