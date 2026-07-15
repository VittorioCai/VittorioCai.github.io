# Vittorio Cai — Portfolio

Source for [vittoriocai.github.io](https://vittoriocai.github.io), a multilingual portfolio presenting Vittorio Cai's work across business, data, supply chain analytics, and applied AI.

## Stack and structure

The site is a static [Astro](https://astro.build/) project written in TypeScript and tested with Vitest, Playwright, and axe-core. Its Schibsted Grotesk Variable typography is self-hosted through Fontsource, so the page does not depend on a third-party font service at runtime. It requires Node.js 22.12 or newer; CI uses Node.js 24.

- `src/content/` owns all English, German, and Chinese content.
- `src/pages/` defines the localized home and case-study routes.
- `src/components/` contains the shared editorial UI.
- `src/styles/` contains the global design system.
- `public/` contains stable public assets, including the downloadable CV.
- `tests/` contains content, build-output, accessibility, and responsive checks.

## Local development

```sh
npm ci
npx playwright install chromium
npm run dev
```

On Linux or in CI, install Chromium and its system dependencies with `npx playwright install --with-deps chromium`.

Before committing, run the same full quality gate used by CI:

```sh
npm run verify
```

For a production build only:

```sh
npm run build
```

## Content and routes

The three locale files are the source of truth:

- `src/content/en.ts`
- `src/content/de.ts`
- `src/content/zh.ts`

Keep all three files aligned whenever copy, links, projects, experience, skills, or labels change. Shared types in `src/content/types.ts` make omissions visible during checks.

To add or maintain a route, update the relevant pages under `src/pages/` for English, German, and Chinese, reuse the shared layout and components, and preserve equivalent language-switcher destinations. Then run `npm run verify` to check generated output, accessibility, and responsive behavior.

## CV and privacy

The public CV lives at `public/Vittorio-Cai-CV-English.pdf` and is published at [vittoriocai.github.io/Vittorio-Cai-CV-English.pdf](https://vittoriocai.github.io/Vittorio-Cai-CV-English.pdf). Replace that file in place so the public URL remains stable.

The CV is intentionally public and contains a phone number. Authored site content and rendered HTML must never contain a phone number. Keep phone numbers out of source files other than the approved public CV, and run the repository privacy checks before publishing.

Public project links follow strict boundaries:

- PatentPATH links only to its public demo.
- English Job Agent links only to its public source repository.
- Never add or expose the private PatentPATH repository.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`. The workflow installs dependencies, runs the full quality gate, builds the Astro site, and deploys it through GitHub Pages. Configure the repository's Pages source as **GitHub Actions**; no branch-based Pages build is used.
