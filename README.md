# Vittorio Cai — Portfolio

Source for [vittoriocai.github.io](https://vittoriocai.github.io), a multilingual portfolio presenting Vittorio Cai's work across business, data, supply chain analytics, and applied AI.

## Stack and structure

The site is a static [Astro](https://astro.build/) project written in TypeScript and tested with Vitest, Playwright, and axe-core. Its Schibsted Grotesk Variable typography is self-hosted through Fontsource, so the page does not depend on a third-party font service at runtime. It requires Node.js 22.12 or newer; CI uses Node.js 24.

- `src/content/` owns all English, German, and Chinese content.
- `src/pages/` defines the localized home and case-study routes.
- `src/components/` contains the shared editorial UI.
- `src/styles/` contains the global design system.
- `public/` contains stable public assets, including the downloadable CV.
- `src/vocab/` owns the standalone vocabulary PWA served at `/deutsch-woerter/`.
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

## Vocabulary app

`/deutsch-woerter/` is a standalone PWA that does not go through Astro's routing.
`scripts/build-vocab-data.mjs` turns the sources in `src/vocab/` into the files
the page actually loads. It runs as part of `npm run dev`, `npm test`, and
`npm run build`.

| Edit | Generated — do not edit, not tracked |
| --- | --- |
| `src/vocab/learn.core.js`, `wrongbook-addon.js`, `mastered-addon.js` | `public/deutsch-woerter/learn.js` |
| `src/vocab/store.js` | `public/deutsch-woerter/store.js` |
| `src/vocab/sw.source.js` | `public/deutsch-woerter/sw.js` |
| `src/vocab/data/cards-mini-*.txt` | `public/deutsch-woerter/cards.json` |
| `src/vocab/data/zh-*.json` | `public/deutsch-woerter/zh.json` |

`public/deutsch-woerter/index.html` and `learn.css` are edited directly.

Two rules keep learners' saved progress intact:

- **Card ids are derived from the word, never from its position in the file.**
  Every scrap of progress is keyed by that id, so a positional scheme would
  orphan everything already saved in people's browsers the first time the deck
  changed. `tests/vocab-data.test.ts` enforces this.
- **The Chinese gloss files are positional arrays** resolved against the deck at
  build time. Adding or removing an A1/A2 word without updating the matching
  `src/vocab/data/zh-*.json` fails the build, and the error names the file to fix.

The service worker's cache name is a hash of the files it caches, so a deploy
that changes anything invalidates it automatically. Nothing needs bumping by hand.

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

`.github/workflows/deploy.yml` runs the full quality gate on every pull request
against `main` and on every push to `main`. Only a push to `main` goes on to
build the Astro site and deploy it through GitHub Pages; pull-request runs stop
after the quality gate. Configure the repository's Pages source as **GitHub
Actions**; no branch-based Pages build is used.
