# PatentPATH Case Study Expansion

- **Date:** 2026-07-31
- **Status:** Approved in conversation
- **Routes:** `/work/patentpath/`, `/de/work/patentpath/`, `/zh/work/patentpath/`

## Purpose

Turn the PatentPATH case study from a short project summary into a recruiter-facing product story. A visitor should understand within one minute what the product does, why its workflow is unusual, what Vittorio personally delivered, and where the public evidence can be inspected.

The primary message is: Vittorio helped turn complex patent analysis into a usable product for nontechnical users. His frontend, PostgreSQL/pgvector, integration, and deployment work provide the supporting evidence. The TUM and Fuyao context explains the business setting without overstating individual ownership of a team project.

## Approaches considered

1. **Product narrative with real interface evidence (selected):** combine a concise product story, three real screenshots, the four-phase workflow, technical contribution, and clear project boundaries. This is the strongest option for recruiters because it explains both value and execution.
2. **Technical deep dive:** center the page on data structures, embeddings, APIs, and deployment. This would better serve an engineering audience but would make the product harder to understand quickly and could expose details that are not public.
3. **Screenshot gallery:** present the live product as a visual tour with short captions. This would improve the current page visually but would not establish Vittorio's responsibility or explain why the workflow matters.

## Narrative structure

### 1. Outcome-led introduction

The first viewport states that PatentPATH turns a plain-language product design into preliminary, claim-level patent risk intelligence and design-improvement guidance. It includes:

- The verified TUM and Fuyao team-project context.
- A direct live-demo action with the existing cold-start note.
- A real Overview screenshot that immediately establishes this as a working product.
- A concise statement separating the product outcome from Vittorio's personal contribution.

The introduction must not use decorative metrics, generic technology badges, or claims about legal certainty.

### 2. Product workflow

The page explains the live product as one continuous four-phase workflow:

1. **Patent Understanding:** read patents, extract features and claims, and structure the corpus.
2. **Risk Identification:** compare a product design with the corpus and identify claim-level overlap.
3. **Design Improvement:** generate structured preliminary suggestions from a stored risk analysis.
4. **Innovation Opportunities:** surface patterns and potential gaps across the patent landscape.

The workflow is rendered as a numbered editorial sequence rather than four identical cards. Each step remains meaningful without animation.

### 3. Interface walkthrough

Three screenshots from the public demo are stored as local, optimized assets so the case study does not depend on the demo backend being awake:

1. **Overview:** the four-phase product flow, current demo-corpus risk distribution, and high-overlap entries.
2. **Patents:** PDF analysis, semantic concept search, and catalogue filtering.
3. **Risk Check:** plain-language design input and the visible parse, match, and overlap-scoring process.

Screenshots exclude browser chrome and user-specific information. They are captured at a consistent desktop viewport, cropped only to improve focus, and exported at sufficient resolution for high-density displays. Each image has a localized caption and descriptive alt text. All essential information also appears as HTML text, so the screenshots are evidence rather than the only explanation.

The case study does not submit a new design or upload a document merely to manufacture a result screenshot. It uses only public, already-rendered product states.

### 4. What makes PatentPATH distinctive

The page explains four verified differentiators:

- Concept-based semantic retrieval instead of exact-keyword search alone.
- Claim-level overlap findings instead of only document-level similarity.
- Design-improvement suggestions grounded in a stored risk analysis.
- Reuse of the same structured corpus for both individual risk checks and broader innovation insights.

This section describes product behavior, not Vittorio's sole ownership. It also states that PatentPATH provides preliminary screening rather than a legal opinion.

### 5. Vittorio's contribution

The contribution section uses a compact, connected technical sequence:

1. **Web product:** built the frontend and the user journey from design description to actionable findings.
2. **Data layer:** owned the PostgreSQL/pgvector database module for structured patent text and embeddings.
3. **System integration:** connected the team's extraction, retrieval, and screening pipeline to the deployed interface.
4. **Delivery:** deployed and operated the product using Vercel, FastAPI, and Neon Postgres.

The wording continues to identify PatentPATH as a team project. It must not imply that Vittorio designed every model, authored every pipeline stage, or completed legal validation.

### 6. Architecture and evidence

A lightweight HTML/CSS architecture diagram shows the verified path:

`Design description or patent PDF → Web interface → FastAPI services → PostgreSQL/pgvector corpus → overlap findings and grounded suggestions`

The final evidence section includes:

- Public live demo.
- TUM GenAI Project collaboration with Fuyao.
- The three interface screenshots.
- The existing free-tier cold-start disclosure.
- A preliminary-screening disclaimer.

No private repository link, private source code, confidential project material, invented performance metric, or permanent claim about the current demo-corpus size is added.

## Visual direction

The page remains part of the current portfolio:

- Existing blue, ink, muted-text, line, and surface tokens.
- Existing self-hosted Schibsted Grotesk typeface.
- Existing editorial grid, square corners, ruled sections, and disciplined whitespace.
- One image-led visual rhythm: large screenshot, explanation, technical evidence, then the next screenshot.
- Subtle use of the existing reveal behavior only. No new parallax, carousel, modal, glass effect, gradient text, or decorative dashboard metrics.

PatentPATH receives a dedicated detailed presentation within the shared case-study shell. The other three case studies keep their current markup, copy, and layout.

## Responsive behavior

- Desktop uses a wide reading column that gives product screenshots substantially more space than the current rail illustration.
- Tablet and mobile stack all narrative blocks in document order.
- Screenshots scale to the viewport and never require horizontal scrolling.
- The workflow and architecture diagram reflow vertically at narrow widths.
- Captions remain readable at 200% text enlargement.
- English, German, and Simplified Chinese keep equivalent content and layout quality.

## Accessibility and performance

- One page-level `h1` and correctly nested section headings.
- Semantic `figure` and `figcaption` markup for screenshots.
- Localized alt text describes each screen's purpose without duplicating the caption.
- Visible keyboard focus and a clear live-demo link.
- Reduced-motion users receive complete static content.
- Images use explicit dimensions, responsive sizing, lazy loading below the fold, and compressed local formats.
- The first screenshot loads eagerly because it is part of the initial product explanation; later screenshots load lazily.
- Existing 320 CSS-pixel reflow and axe checks remain required.

## Component and content changes

- Add a focused PatentPATH story component inside the existing case-study shell instead of expanding the generic layout with repeated conditionals.
- Extend the typed localized content with PatentPATH-only workflow, differentiator, contribution, architecture, caption, alt-text, and disclaimer copy.
- Add three local screenshot assets under a dedicated PatentPATH public-assets directory.
- Reuse the existing safe live-demo URL resolution, metadata, language routing, next-project navigation, and JSON-LD.
- Preserve the current generic four-section rendering for English Job Agent, News Sentiment, and Water Quality.

## Verification

- Content tests confirm all three locales define the complete PatentPATH story and preserve the same verified contribution boundaries.
- Built-HTML tests confirm all three PatentPATH routes contain the four workflow stages, three local screenshots, localized captions and alt text, contribution sequence, architecture, evidence, disclaimer, and live-demo action.
- Built-HTML tests confirm no other case-study route gains the PatentPATH-specific walkthrough.
- Asset tests confirm every referenced screenshot exists in `dist/` and is not sourced from the live demo at runtime.
- Browser tests confirm screenshot visibility, mobile stacking, 320-pixel reflow, one `h1`, keyboard navigation, and no serious axe violations.
- The full `npm run verify` gate must pass before publication.
