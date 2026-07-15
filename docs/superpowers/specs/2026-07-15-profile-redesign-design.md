# Luka-Inspired Profile Redesign

- **Date:** 2026-07-15
- **Status:** Approved in conversation
- **Routes:** `/profile/`, `/de/profile/`, `/zh/profile/`

## Purpose

Make the profile page feel personal and memorable without weakening the portfolio homepage. Recruiters should be able to identify Vittorio, understand his international path, scan education and work experience, and reach his CV or professional profiles quickly.

The redesign borrows the useful structure of `wzsyyh/luka-homepage-template`, especially its fixed identity rail and chronological content column. It does not copy the template's warm palette, academic styling, external font requests, dark mode, or visitor-tracking widget.

## Approaches considered

1. **Full Luka-style replacement:** reproduce the reference layout, colors, portrait treatment, and section styling. This creates the strongest resemblance but would conflict with the existing editorial blue brand and make the profile feel like a separate website.
2. **Integrated identity rail (selected):** keep the current site shell and visual system, then introduce a Luka-inspired sticky rail and a single chronological content column only on the profile route. This adds personality while preserving continuity with the homepage and case studies.
3. **Small profile card only:** add a compact identity block above the current layout. This is the lowest-risk option but does not materially improve the page hierarchy or make the international journey memorable.

## Page structure

### Identity rail

The left rail is sticky on large screens and contains:

- A circular `VC` typographic monogram that can later be replaced by a portrait without changing the layout.
- Name, professional positioning, current location, and TUM email.
- Direct links to email, LinkedIn, GitHub, and the English CV.
- A compact journey map titled in the active language.

The rail uses the existing white, quiet-gray, and deep-blue palette. It must not use a generic card shadow, gradients, external tracking scripts, or visitor analytics.

### Journey map

The map is a lightweight inline SVG with a route and three confirmed stops in this order:

1. Florence
2. Wenzhou
3. Heilbronn

Each stop has a visible localized label and remains readable without animation. The SVG is decorative; the same three stops are exposed as an ordered semantic list for assistive technology. A short load animation may draw the route when motion is allowed. Reduced-motion users see the completed route immediately.

### Profile content

The right column contains the existing verified copy and data in this sequence:

1. Profile summary and education
2. Experience
3. Skills and languages

Education and experience use one continuous timeline grammar: compact year, organization or school, role or degree, and supporting evidence. Existing claims and periods remain unchanged. Florence is introduced only as a journey-map stop unless a later content update supplies a verified institution and period for the education timeline.

## Responsive behavior

- At desktop widths, the identity rail remains sticky while the right column scrolls.
- At tablet and mobile widths, the rail becomes a normal top section and all content follows in document order.
- The map scales within the available width and never creates horizontal scrolling.
- The monogram is smaller on mobile, and links retain practical touch targets.
- English, German, and Simplified Chinese keep equal layout quality.

## Accessibility and privacy

- One page-level `h1`, followed by correctly nested section headings.
- Visible focus styles and descriptive link labels.
- The monogram is marked decorative until a real portrait with meaningful alt text is supplied.
- The journey list provides a text equivalent for the SVG.
- `prefers-reduced-motion` disables route drawing and entrance motion.
- No visitor location tracking, map tiles, cookies, analytics, or third-party scripts.
- Reflow must work at 320 CSS pixels and at 200% text enlargement.

## Component and content changes

- Add a focused `ProfileIdentity.astro` component for the monogram, links, and journey map.
- Extend localized content with profile-rail labels, positioning text, and the three localized journey-stop names.
- Wrap the existing profile sections in a page-level two-column shell.
- Restyle the existing profile, experience, and skill components for the new single-column content area instead of duplicating their data or markup.
- Keep the public URLs and verified profile claims unchanged.

## Verification

- Built HTML tests confirm all three profile routes render the identity rail, ordered journey stops, contact actions, and existing section anchors.
- Browser tests confirm desktop stickiness, mobile stacking, no horizontal overflow, one `h1`, and no serious axe violations.
- Reduced-motion tests confirm the map remains fully visible without animation.
- Full Astro, unit, build, and Playwright verification must pass before completion.

