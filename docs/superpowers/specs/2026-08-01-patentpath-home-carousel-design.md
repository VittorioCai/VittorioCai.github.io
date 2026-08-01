# PatentPATH Homepage Product Carousel

- **Date:** 2026-08-01
- **Status:** Approved in conversation
- **Surface:** Featured PatentPATH card on the localized home and work pages

## Purpose

Replace the abstract PatentPATH wireframe with evidence from the working product. The featured project visual should let a recruiter recognize PatentPATH as a deployed interface before opening the case study, while preserving the portfolio's restrained editorial style.

## Approaches considered

1. **Single real screen with depth motion:** the quietest option, but it communicates only one part of the product.
2. **Three-screen automatic sequence (selected):** show Overview, Patents, and Risk Check in one deliberate sequence. This gives useful breadth without asking visitors to operate another control.
3. **Interactive screen tabs:** provides user control but adds navigation, localized control copy, and mobile interaction to a card whose primary action is already the case-study link.

## Visual structure

The existing layered browser composition remains recognizable, but the abstract blocks inside it are removed.

- The foreground browser frame contains the real PatentPATH screenshots already stored at:
  - `/projects/patentpath/overview.png`
  - `/projects/patentpath/patents.png`
  - `/projects/patentpath/risk-check.png`
- Two restrained blue-tinted paper layers remain behind the browser frame to preserve depth and continuity with the current portfolio.
- The foreground keeps square corners, a one-pixel rule, and the existing ink, accent, surface, and line tokens.
- Screenshots use a consistent 3:2 viewport and `object-fit: cover`; no new colors, fonts, gradients, glass effects, or decorative metrics are introduced.
- Three small progress marks inside the browser bar indicate the current screen without competing with the project actions.

## Motion

The sequence starts only when the featured visual has entered the viewport and the existing reveal observer marks it visible.

1. Overview appears first and establishes the product.
2. Patents moves into the foreground.
3. Risk Check moves into the foreground and remains as the final state because it most clearly demonstrates the product's design-to-analysis value.

The sequence runs once rather than looping. Each transition uses opacity and transform only, with the site's existing exponential ease. The complete sequence lasts approximately 4.5 seconds.

On fine pointers:

- Hovering the visual pauses the sequence at its current frame.
- The foreground receives the existing slight scale treatment.
- The existing pointer-follow case-study cue remains available.

The background paper layers keep the current subtle entry movement. They do not continuously move after the reveal.

## Responsive behavior

- Desktop and tablet show the complete framed screenshot.
- Mobile uses the same screenshot sequence in the stacked featured card, with a shallower frame so the visual does not dominate the page.
- The screenshots remain clipped within the frame and never create horizontal overflow.
- The card's existing case-study link, live-demo link, cold-start note, and all-projects link are unchanged.

## Accessibility

- The carousel is a single linked product preview, not a separate interactive control.
- A descriptive accessible label continues to identify the visual and its case-study destination.
- Individual screenshots are decorative inside that labeled link, because the card's text and case study provide the equivalent information.
- With `prefers-reduced-motion: reduce`, animations are disabled and the Overview screenshot is shown as a stable initial state.
- With JavaScript unavailable, the Overview screenshot remains visible.
- Keyboard focus keeps the existing visible link focus and pointer cue behavior.

## Implementation boundaries

- Change only the PatentPATH variant of `ProjectVisual.astro`, the focused visual styling in `FeaturedProject.astro`, and the tests that define this visual contract.
- Reuse the existing local case-study screenshot assets. Do not recapture the live demo or add runtime dependencies.
- Preserve the English Job Agent visual and every other project card.
- Do not add carousel JavaScript, timers, controls, content fields, dependencies, or a generalized carousel abstraction.

## Verification

- A failing browser test first confirms the featured PatentPATH visual contains all three real screenshot paths and no abstract workspace.
- The browser test confirms the sequence reaches Risk Check after reveal.
- Reduced-motion browser coverage confirms Overview is visible and no carousel animation runs.
- Existing pointer-follow, route, mobile overflow, and accessibility tests remain green.
- `npm run verify` passes before committing and pushing.
