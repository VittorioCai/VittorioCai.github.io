# Floating Studio Work Redesign

**Date:** 2026-08-14

**Status:** Approved for implementation

**Scope:** Homepage Selected Work and the localized `/work/` pages

## Objective

Replace the current rigid featured-project grid with a softer, more personal portfolio presentation. The redesign should feel like an active studio wall: project fragments are lightly offset and layered, while the reading order, evidence, and actions stay immediately understandable to a recruiter.

The design keeps the existing Precision Atlas identity—blue, white, editorial typography, precise language—but reduces its reliance on boxes, dividers, and equally weighted columns.

## Success Criteria

- A recruiter can identify the featured product, Vittorio's role, and the case-study action within the first project block.
- PatentPATH remains visually dominant; the other three projects do not compete at equal scale.
- Homepage and Work page feel related without duplicating the same amount of content.
- Desktop presentation feels layered and authored; mobile presentation remains a simple, natural vertical reading flow.
- Motion adds spatial continuity without looping, distracting, or hiding content.
- English, German, and Chinese routes retain equivalent structure and actions.
- Existing project claims, public-link boundaries, and case-study routes remain intact.

## Visual Direction

### Tone

The chosen direction is **Floating Studio**: calm, tactile, lightly imperfect, and professional. It uses soft atmospheric surfaces, restrained shadows, overlapping cards, and small rotational offsets to suggest work in progress without looking playful or scrapbook-like.

### Visual hierarchy

1. Page-level introduction establishes the theme and invites scanning.
2. PatentPATH appears as the large featured studio card with a real product-screen composition.
3. English Job Agent, News Sentiment, and Water Quality appear as smaller project fragments below it.
4. Role, outcome, evidence, and action are visually more important than tag lists.
5. Technology tags remain supporting metadata and use quiet pill treatments.

### Surfaces and decoration

- Use existing color tokens; introduce no unrelated accent colors.
- Replace most hard dividers with negative space, soft surface contrast, and low-opacity shadows.
- Use a pale blue-to-warm-neutral studio field behind the project composition.
- Apply rotations below roughly two degrees so text still feels stable.
- Avoid glassmorphism, heavy gradients, floating blobs, and decorative animation unrelated to project meaning.

## Information Architecture

### Homepage Selected Work

The homepage is a teaser, not a duplicate of the full archive.

- Section heading remains localized.
- Show only PatentPATH as the featured project.
- Present its kicker, title, short summary, Vittorio's contribution, demo/case-study actions, cold-start note, and real product-screen preview.
- Add the localized “All projects” action at the end of the studio block.
- Do not show the other three project cards on the homepage.

### Work page

The Work page is the complete studio.

- Add a compact localized introduction consisting of eyebrow, display heading, and short deck.
- Render PatentPATH as the large featured card.
- Render the other three projects as smaller studio fragments in a loose two-column composition on wide screens.
- Each supporting fragment includes its kicker, title, summary, contribution when available, two concise evidence/detail signals, tags, and available public actions.
- Each project remains a semantic `article`; visual positioning must not alter DOM reading order.
- All four case-study links retain their existing localized routes.

## Component Architecture

### `ProjectStudio.astro`

Create one shared composition component with two explicit modes:

- `mode="teaser"` for the homepage.
- `mode="full"` for the Work page.

Inputs remain the existing localized projects, sections, visuals, and actions. The component owns section composition and project ordering but not locale-specific copy.

### `StudioProjectCard.astro`

Create a focused project-card component with `featured` and `supporting` variants. It owns:

- semantic article markup;
- project content and safe public actions;
- role/contribution presentation;
- tags and evidence/details;
- the correct project visual;
- variant-specific reveal hooks.

This boundary prevents `ProjectStudio.astro` from becoming a large conditional template and allows card behavior to be tested independently.

### `ProjectVisual.astro`

Keep the real PatentPATH screen sequence and the existing English Job Agent pipeline. Add restrained, data-shaped procedural visuals for News Sentiment and Water Quality so every supporting card has visual evidence without inventing screenshots or claims.

- News Sentiment: a compact firm-day/prompt-to-portfolio diagram using existing labels or accessible localized descriptions.
- Water Quality: a compact six-model comparison motif without fabricated performance values.

The visuals are decorative supplements; their accessible labels come from existing localized project content.

### Content types

Add a localized `workIntro` structure to `SiteContent` with:

- `eyebrow`
- `title`
- `summary`

Populate it in `en.ts`, `de.ts`, and `zh.ts`. Do not change existing project claims or action URLs as part of this redesign.

## Responsive Behavior

### Wide screens

- Studio surface contains one large featured card followed by a loose two-column supporting layout.
- Cards may be visually offset and rotated, but no text or action may cross another card.
- The PatentPATH card combines copy and product visual in two columns.

### Tablet

- Reduce offsets and rotations.
- Preserve a two-column supporting layout only while each card maintains a readable minimum width.
- PatentPATH may remain two-column until the existing mobile breakpoint.

### Mobile

- Use a single DOM and visual column.
- Remove rotation, overlap, cursor-follow behavior, and off-axis transforms.
- Put project copy before its visual where this preserves context.
- Maintain at least 44px interactive targets and no horizontal scrolling.
- Avoid horizontal carousels or swipe-only content.

## Motion Design

Motion communicates cards settling into the studio rather than continuously floating.

- On reveal, each card moves a short distance into place while rotating toward its final small offset.
- PatentPATH visual layers unfold once when entering the viewport.
- Supporting procedural visuals may draw or reveal once.
- Hover raises a card by only a few pixels and strengthens its shadow; actions keep explicit focus styles.
- No infinite motion, background drift, or scroll-jacking.
- All motion uses the existing duration/easing tokens and remains below the site's current restraint threshold.
- Under `prefers-reduced-motion: reduce`, cards render immediately at their final position and all visual sequences become static.

## Accessibility and Interaction

- Visual order and DOM order are identical.
- Every project action remains a normal anchor with its current destination.
- Decorative layers are ignored by assistive technology.
- Procedural project visuals receive concise accessible labels.
- Focus indication must remain visible against studio and card surfaces.
- Text and controls meet existing contrast requirements.
- Motion never gates access to content or actions.

## Implementation Boundaries

- Do not modify Profile, Experience, Contact, Header, Footer, or case-study page layouts.
- Do not add a JavaScript animation dependency.
- Do not add remote fonts or remote image dependencies.
- Do not expose the private PatentPATH repository.
- Do not add fabricated metrics, project screenshots, or new external links.
- Preserve the current safe-URL validation path for project actions.

## Verification

Automated verification must cover:

- Astro type check, unit tests, production build, and Playwright suite.
- Homepage renders one featured PatentPATH studio card and one All Projects action in all locales.
- Work pages render exactly four semantic project articles in all locales.
- All existing demo, source, and localized case-study URLs remain correct.
- PatentPATH cold-start note remains visible only where the demo action appears.
- Desktop cards exhibit the intended static offsets after reveal.
- Mobile cards are unrotated, single-column, and horizontally overflow-free at 320px and 390px.
- Reduced-motion mode disables entry transforms and product-screen animation.
- Axe checks report no new accessibility violations.

Visual verification should inspect at least English desktop, Chinese desktop, English mobile, and reduced-motion mobile. Pay particular attention to Chinese line wrapping, German action length, card overlap, and focus visibility.

## Acceptance Criteria

The redesign is complete when homepage and Work page share the Floating Studio language, PatentPATH clearly leads the hierarchy, supporting projects remain scannable, mobile loses all decorative spatial distortion, and the full repository quality gate passes without weakening existing tests.
