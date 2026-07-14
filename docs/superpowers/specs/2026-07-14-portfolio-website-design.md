# Vittorio Cai Portfolio Website Design

- **Date:** 2026-07-14
- **Status:** Approved visual and technical direction; ready for implementation planning
- **Target URL:** `https://vittoriocai.github.io`

## 1. Purpose

Create a fast, multilingual personal website for German recruiters hiring working students and interns. The site should show Vittorio as a cross-functional candidate who connects business understanding, data analysis, and applied AI.

The site is not a copy of the CV and not a developer-only portfolio. Its main job is to let a recruiter understand Vittorio's positioning, strongest evidence, availability, and contact path within about one minute.

### Primary audience

- Recruiters and hiring managers in Germany
- Roles in data and business intelligence, supply chain analytics, and applied AI
- English-speaking teams that value both business context and technical execution

### Goals

- Establish a clear `Business × Data × AI` positioning.
- Make PatentPATH and English Job Agent for Germany easy to understand and explore.
- Give credible supporting evidence from research projects, internships, education, and skills.
- Provide direct access to email, LinkedIn, GitHub, the PatentPATH demo, and an English CV PDF.
- Offer complete English, German, and Simplified Chinese versions.

### Non-goals

- No blog, CMS, login, database, contact form, analytics, or backend.
- No auto-generated claims, live GitHub statistics, or external APIs.
- No personal portrait in the initial release.
- No phone number directly on the website. The approved downloadable CV may contain it.
- No claim that Vittorio independently built team projects in full.

## 2. Source of truth and content boundaries

Public claims must come from one of these verified sources:

- `CV_VittorioCai_MB.pdf`, supplied on 2026-07-14
- The public `VittorioCai/english-job-agent-germany` repository
- The public PatentPATH demo at `https://new-patent-path.vercel.app`
- User-confirmed PatentPATH contribution: frontend development and database design/implementation

The private PatentPATH repository must not be linked or exposed. Its project card links to the public demo and describes only the verified role. The OR-Gym repository is not a launch-priority project because it is a fork and is less aligned with the recruiter's first-pass story.

## 3. Information architecture

The initial release is a compact portfolio with a homepage and project detail pages.

### Routes

| English | German | Chinese | Purpose |
|---|---|---|---|
| `/` | `/de/` | `/zh/` | Main portfolio |
| `/work/patentpath/` | `/de/work/patentpath/` | `/zh/work/patentpath/` | PatentPATH case study |
| `/work/english-job-agent/` | `/de/work/english-job-agent/` | `/zh/work/english-job-agent/` | Open-source case study |
| `/404.html` | shared | shared | Branded not-found page |

The news-sentiment and water-quality projects remain concise homepage entries in the initial release. They may receive dedicated case studies later when richer artifacts are available.

### Navigation

- Work
- Profile
- Experience
- Contact
- Language switcher: `EN · DE · 中文`

Homepage navigation links scroll to sections. Project pages keep the same header and link back to the corresponding homepage section. The language switcher preserves the current content route whenever a translated equivalent exists.

## 4. Homepage content hierarchy

### 4.1 Header

- `VITTORIO CAI` wordmark on the left
- Section navigation and language switcher on the right
- A three-pixel blue rule at the top of the page
- Sticky behavior is allowed on desktop if it remains visually quiet

### 4.2 Hero

Primary line:

> Business insight.<br>
> Data discipline.<br>
> Useful AI.

Supporting copy should explain that Vittorio connects business questions with analytics, machine learning, and software, then turns the result into something people can use.

The hero also contains:

- `TUM MMDT · Heilbronn, Germany`
- Availability for working student and internship roles in Germany
- Focus areas: Data & BI, Supply Chain Analytics, Applied AI
- `View projects` and `Download CV` actions

### 4.3 Selected work

Projects appear in this order:

1. **PatentPATH — featured**
   - TUM GenAI team project with Fuyao on HUD windshield patents
   - AI-assisted patent analysis that converts a design description into an overlap-risk report
   - Vittorio's contribution: web frontend and PostgreSQL/pgvector database
   - Links: public live demo and internal case study

2. **English Job Agent for Germany — open source**
   - Finds and ranks English-friendly student jobs in Germany
   - Detects hidden German-language requirements and sends a daily digest
   - Technology summary: Python, LLM evaluation, public ATS feeds, GitHub Actions
   - Links: GitHub repository and internal case study

3. **LLM News-Sentiment & Portfolio Study — empirical ML**
   - TUM Campus Challenge team project
   - Roughly 59,000 firm-day news observations
   - Controlled `2×2×2` prompt experiment and Fama-French validation
   - No repository or demo link unless a public artifact is supplied later

4. **Water Quality Prediction — supervised ML**
   - Six-model benchmark for an imbalanced dataset
   - Vittorio implemented and tuned SVM and AdaBoost and designed cross-model evaluation
   - No repository or demo link unless a public artifact is supplied later

### 4.4 Profile and education

- M.Sc. Management and Digital Technology, Technical University of Munich, 2025-present
- B.A. Financial Management, Wenzhou University, 2021-2025
- A short paragraph connecting financial-management foundations with current data, ML, and software work

### 4.5 Experience

- Ruian Municipal Bureau of Commerce — Finance Intern, 2024-2025
  - Interactive Excel dashboards covering more than 50 enterprises
  - Surfaced two cost inefficiencies
- Ruian Tongyan Embroidery Co., Ltd. — Accountant Intern, 2024
  - Automated piece-rate wage calculation, saving more than 10 hours per month
  - Built a tracking database supporting procurement decisions

### 4.6 Skills and languages

Use grouped text, not decorative skill badges or progress bars.

- Data: Python, SQL, PostgreSQL, R, SPSS, Excel/VBA
- ML and product: scikit-learn, PyTorch in progress, pgvector, Git/GitHub
- Reporting: interactive Excel/VBA dashboards, Matplotlib, Microsoft 365
- Languages: Mandarin native, English C1, German A1

### 4.7 Contact

- Email: `vittorio.cai@tum.de`
- LinkedIn: `https://linkedin.com/in/vittorio-cai`
- GitHub: `https://github.com/VittorioCai`
- English CV PDF download

There is no contact form. Email uses a `mailto:` link. External links clearly indicate that they open outside the site.

## 5. Project case-study structure

Both case studies use the same sequence so recruiters can scan them quickly:

1. One-sentence outcome
2. Context and user problem
3. Vittorio's specific responsibility
4. What was built
5. Technical decisions
6. Result or evidence
7. Links and next navigation

PatentPATH emphasizes the frontend and PostgreSQL/pgvector responsibility without claiming ownership of the team's full AI pipeline. The job-agent case study emphasizes the practical problem, source coverage, language-requirement logic, daily automation, and open-source usability.

Project visuals should be lightweight diagrams, interface frames, and verified screenshots. No invented performance charts or unverified metrics are allowed.

## 6. Visual design system

The approved direction is a minimal editorial grid inspired by a restrained news portal, not by a generic portfolio template.

### Palette

- Primary text: `#171717`
- Accent blue: `#1F5FAE`
- Secondary text: `#666666`
- Borders: `#DEDEDE`
- Quiet surface: `#FAFAFA`
- Page background: `#FFFFFF`

Blue replaces the earlier red concept. It appears only in the top rule, small section labels, active language, and primary text links. There are no gradients, glows, large blue panels, or multicolor skill badges.

### Typography

- Use a fast system sans-serif stack: `Arial`, `Helvetica Neue`, and appropriate platform fallbacks.
- Include CJK system fallbacks such as `PingFang SC`, `Microsoft YaHei`, and `Noto Sans CJK SC` when installed.
- Use weight, size, and whitespace for hierarchy rather than multiple font families.
- Headings are direct and compact; body copy uses comfortable line height.

### Layout

- Wide centered page with a strict editorial grid
- Thin one-pixel separators
- Large white space around the hero
- PatentPATH receives the largest project block
- Secondary projects form a simple equal-width row on large screens
- No portrait, hero illustration, floating glass cards, or decorative dashboard metrics

### Motion

- Subtle link underline or arrow movement only
- Optional short section reveal that respects `prefers-reduced-motion`
- No parallax, cursor effects, loading animation, or motion that delays reading

## 7. Responsive behavior

- Desktop: multi-column editorial grid
- Tablet: reduced columns and spacing while preserving separators
- Mobile: one content column, compact header, accessible menu, and projects stacked in priority order
- Language switching remains directly accessible on mobile
- Tap targets are at least 44 CSS pixels where practical
- No horizontal scroll at 320 CSS pixels

The mobile reading order is hero, availability, PatentPATH, English Job Agent, supporting projects, profile and education, experience, skills, and contact.

## 8. Internationalization

- English is the default route and canonical source language.
- German and Simplified Chinese are human-authored static translations, not browser-machine translation.
- Each page sets the correct `lang` attribute and provides `hreflang` alternatives.
- Project names, company names, university names, URLs, and technology names remain unchanged.
- German copy uses professional recruiter-facing language and does not overstate language proficiency.
- The CV link is labeled `CV (English PDF)` on German and Chinese pages.

If a translation key is missing, the build must fail instead of silently shipping mixed-language content.

## 9. Technical architecture

### Stack

- Astro static site
- TypeScript content and translation data
- CSS with project-level custom properties and component-scoped styles
- GitHub Pages hosting
- GitHub Actions build and deployment

### Component boundaries

- `BaseLayout`: document metadata, language, header, footer
- `LanguageSwitcher`: route-aware language alternatives
- `Hero`: identity, positioning, availability, actions
- `ProjectGrid` and `ProjectCard`: ordered project evidence
- `ExperienceList`: concise role history
- `SkillGroups`: grouped capability text
- `ContactBlock`: verified public contact actions
- `ProjectCaseStudy`: shared detailed-project structure

Each component receives already-translated content and does not fetch external data.

### Data flow

1. Typed content files define projects, experience, skills, links, and translations.
2. Astro validates and renders all language routes at build time.
3. Static HTML, CSS, JavaScript, images, and PDF assets are published to GitHub Pages.
4. The browser performs no API calls other than normal navigation to external links.

## 10. Reliability and error handling

- Validate required translation keys and project fields during the build.
- Render an external action only when its URL is defined and valid.
- Use a branded static 404 page with links back to all three homepages.
- Keep external links independent so a third-party demo outage does not break page rendering.
- Add a visible `Demo` label rather than implying that a private source repository is available.
- Use a stable filename for the downloadable CV.

## 11. Accessibility, privacy, and security

- Semantic landmarks, heading order, keyboard navigation, and visible focus states
- WCAG AA color contrast for normal text and controls
- Descriptive link labels; no repeated ambiguous `click here` links
- Reduced-motion support
- Useful alt text for meaningful visuals and empty alt text for decoration
- No analytics, cookies, trackers, forms, secret values, or inline personal phone number
- External links use safe attributes where a new tab is used
- The public CV is intentionally downloadable and may contain the phone number approved by the user

## 12. Metadata and sharing

- Page-specific titles and descriptions in all three languages
- Canonical URL and `hreflang` links
- Open Graph and social-preview image using the approved white, gray, and blue system
- Favicon based on a simple `VC` monogram, not an imitation of a NetEase logo
- Structured data for `Person` and selected `CreativeWork` items when it can be populated accurately

## 13. Deployment

- Repository: `VittorioCai/VittorioCai.github.io`
- Default branch: `main`
- GitHub Actions builds Astro and deploys the generated static site to Pages
- The root URL is `https://vittoriocai.github.io`
- A custom domain is explicitly out of scope for the first release

## 14. Acceptance criteria

The release is complete when all of the following are true:

- English, German, and Chinese routes build without missing content.
- Navigation and language switching work on homepage and project routes.
- PatentPATH is featured with the exact confirmed contribution and public demo link.
- English Job Agent links to its public GitHub repository.
- Contact links and CV download work.
- Phone number is absent from rendered HTML.
- The site has no horizontal overflow at 320, 390, 768, and 1440 CSS pixels.
- Keyboard navigation and visible focus styling work.
- Automated checks cover the build, internal links, translation completeness, and key public claims.
- Lighthouse checks show no critical accessibility or SEO errors.
- GitHub Pages deployment completes and the public URL returns the built site.

## 15. Approved decisions summary

- Independent personal website, not a GitHub profile README
- Primary audience: German working-student and internship recruiters
- Positioning: business, data, supply chain analytics, and applied AI
- Languages: English, German, Simplified Chinese
- Featured project: PatentPATH; verified role is frontend and database
- Additional highlighted project: English Job Agent for Germany
- Public contact: TUM email, LinkedIn, GitHub, downloadable English CV
- No portrait in the initial release
- Minimal editorial grid with blue accent `#1F5FAE`
- Astro static site deployed through GitHub Pages
