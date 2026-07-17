# Vittorio Cai Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a fast, accessible, trilingual portfolio at `https://vittoriocai.github.io` that presents Vittorio as a business, data, supply-chain analytics, and applied-AI candidate.

**Architecture:** Astro 7 statically generates English, German, and Simplified Chinese routes from typed content objects. Shared components render the approved editorial grid without runtime APIs; Vitest validates content and built HTML, Playwright validates routing, accessibility, and responsive behavior, and GitHub Actions deploys the static output to GitHub Pages.

**Tech Stack:** Astro 7.0.9, TypeScript 6.0.3, Vitest 4.1.10, Cheerio 1.2.0, Playwright 1.61.1, axe-core 4.12.1, Node.js 24, GitHub Pages

---

## File map

### Project and tooling

- `package.json`: scripts and pinned dependencies
- `package-lock.json`: reproducible npm installation
- `astro.config.mjs`: canonical site URL and sitemap integration
- `tsconfig.json`: Astro strict TypeScript settings
- `vitest.config.ts`: unit and built-output test configuration
- `playwright.config.ts`: browser test server and viewports
- `.gitignore`: local and generated files

### Content and routes

- `src/content/types.ts`: locale, navigation, project, education, experience, and site-content types
- `src/content/en.ts`: canonical English content
- `src/content/de.ts`: professional German translation
- `src/content/zh.ts`: Simplified Chinese translation
- `src/content/index.ts`: locale lookup and completeness guard
- `src/i18n/routes.ts`: localized route mapping and language-alternative generation

### Layout, components, and styling

- `src/layouts/BaseLayout.astro`: document metadata, canonical/hreflang links, global shell
- `src/components/Header.astro`: desktop/mobile navigation and language switcher
- `src/components/Hero.astro`: identity, positioning, availability, calls to action
- `src/components/ProjectVisual.astro`: restrained PatentPATH interface schematic and job-agent pipeline diagram
- `src/components/ProjectGrid.astro`: featured and supporting project cards
- `src/components/ProfileSection.astro`: summary and education
- `src/components/ExperienceList.astro`: work experience rows
- `src/components/SkillGroups.astro`: grouped skills and languages
- `src/components/ContactBlock.astro`: email, LinkedIn, GitHub, CV
- `src/components/HomePage.astro`: homepage composition
- `src/components/ProjectCaseStudy.astro`: shared case-study composition
- `src/styles/global.css`: approved white/gray/deep-blue editorial system and responsive rules

### Pages

- `src/pages/index.astro`, `src/pages/de/index.astro`, `src/pages/zh/index.astro`: localized homepages
- `src/pages/work/patentpath/index.astro`, plus `/de/` and `/zh/` equivalents
- `src/pages/work/english-job-agent/index.astro`, plus `/de/` and `/zh/` equivalents
- `src/pages/404.astro`: multilingual recovery page

### Public assets

- `public/Vittorio-Cai-CV-English.pdf`: approved CV download
- `public/favicon.svg`: simple VC monogram
- `public/og-card.svg`: social preview in the approved palette
- `public/robots.txt`: crawl policy and sitemap location

### Tests and delivery

- `tests/content.test.ts`: truth, privacy, and translation completeness
- `tests/routes.test.ts`: localized URL behavior
- `tests/build-output.test.ts`: generated routes, metadata, links, and HTML privacy
- `tests/portfolio.spec.ts`: browser navigation, mobile overflow, and axe checks
- `.github/workflows/deploy.yml`: quality gate, Astro build, Pages deployment
- `README.md`: maintenance, content updates, local verification, and deployment

## Fixed public values

Use these exact verified links and labels:

```ts
export const links = {
  email: 'mailto:vittorio.cai@tum.de',
  linkedin: 'https://www.linkedin.com/in/vittorio-cai-3ba0b7385',
  github: 'https://github.com/VittorioCai',
  patentPathDemo: 'https://new-patent-path.vercel.app',
  jobAgentRepo: 'https://github.com/VittorioCai/english-job-agent-germany',
  cv: '/Vittorio-Cai-CV-English.pdf',
} as const;
```

Never add the private PatentPATH repository URL. Never add the phone number to source content or rendered HTML.

---

### Task 1: Scaffold Astro and verification tooling

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Create: `src/env.d.ts`

- [ ] **Step 1: Write the package manifest**

Create `package.json` exactly as follows:

```json
{
  "name": "vittoriocai.github.io",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "verify": "npm run check && npm run test && npm run build && npm run test:e2e"
  },
  "dependencies": {
    "@astrojs/sitemap": "3.7.3",
    "astro": "7.0.9"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.9",
    "@axe-core/playwright": "4.12.1",
    "@playwright/test": "1.61.1",
    "cheerio": "1.2.0",
    "typescript": "6.0.3",
    "vitest": "4.1.10"
  }
}
```

- [ ] **Step 2: Install dependencies and lock them**

Run:

```bash
npm install
npx playwright install chromium
```

Expected: `package-lock.json` is created and both commands exit 0.

- [ ] **Step 3: Add strict Astro and test configuration**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vittoriocai.github.io',
  integrations: [sitemap()],
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
playwright-report/
test-results/
.DS_Store
```

Create `src/env.d.ts`:

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 4: Run the empty-project checks**

Run:

```bash
npm run check
npm run test -- --passWithNoTests
```

Expected: Astro type checking exits 0; Vitest reports no tests and exits 0 because of the explicit flag.

- [ ] **Step 5: Commit the scaffold**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts .gitignore src/env.d.ts
git commit -m "chore: scaffold Astro portfolio"
```

---

### Task 2: Add typed trilingual content with truth and privacy tests

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/en.ts`
- Create: `src/content/de.ts`
- Create: `src/content/zh.ts`
- Create: `src/content/index.ts`
- Create: `tests/content.test.ts`

- [ ] **Step 1: Write the failing content tests**

Create `tests/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { content, locales } from '../src/content';
import { containsGermanMobileNumber } from './phone-privacy';

describe('portfolio content', () => {
  it('ships all three complete locales with the same project ids', () => {
    expect(locales).toEqual(['en', 'de', 'zh']);
    const projectIds = locales.map((locale) =>
      content[locale].projects.map((project) => project.id),
    );
    expect(projectIds[1]).toEqual(projectIds[0]);
    expect(projectIds[2]).toEqual(projectIds[0]);
    expect(projectIds[0]).toEqual([
      'patentpath',
      'english-job-agent',
      'news-sentiment',
      'water-quality',
    ]);
  });

  it('states the verified PatentPATH role and safe public links', () => {
    for (const locale of locales) {
      const patent = content[locale].projects[0];
      expect(patent.contribution).toMatch(/front|Frontend|前端/);
      expect(patent.contribution).toMatch(/database|Datenbank|数据库/);
      expect(patent.actions.demo).toBe('https://new-patent-path.vercel.app');
      expect(patent.actions.source).toBeUndefined();
    }
    expect(content.en.projects[1].actions.source).toBe(
      'https://github.com/VittorioCai/english-job-agent-germany',
    );
  });

  it('does not expose a phone number in authored site content', () => {
    const serialized = JSON.stringify(content);
    expect(containsGermanMobileNumber(serialized)).toBe(false);
  });

  it('labels the CV as English outside the English locale', () => {
    expect(content.de.actions.cv).toContain('Englisch');
    expect(content.zh.actions.cv).toContain('英文');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: FAIL because `src/content/index.ts` does not exist.

- [ ] **Step 3: Define the content types**

Create `src/content/types.ts`:

```ts
export const locales = ['en', 'de', 'zh'] as const;
export type Locale = (typeof locales)[number];

export type ProjectId =
  | 'patentpath'
  | 'english-job-agent'
  | 'news-sentiment'
  | 'water-quality';

export interface Project {
  id: ProjectId;
  kicker: string;
  title: string;
  summary: string;
  contribution?: string;
  details: string[];
  tags: string[];
  actions: {
    demo?: string;
    source?: string;
    caseStudy?: boolean;
  };
}

export interface SiteContent {
  locale: Locale;
  meta: { title: string; description: string };
  nav: { work: string; profile: string; experience: string; contact: string; menu: string };
  hero: {
    eyebrow: string;
    lines: [string, string, string];
    summary: string;
    availabilityLabel: string;
    availability: string;
    focusLabel: string;
    focus: string[];
  };
  actions: {
    viewProjects: string;
    cv: string;
    demo: string;
    source: string;
    caseStudy: string;
    email: string;
  };
  sections: {
    work: string;
    profile: string;
    experience: string;
    skills: string;
    contact: string;
    contribution: string;
  };
  projects: [Project, Project, Project, Project];
  profile: string;
  education: Array<{ school: string; degree: string; period: string; location: string }>;
  experience: Array<{ organization: string; role: string; period: string; bullets: string[] }>;
  skillGroups: Array<{ title: string; items: string[] }>;
  languages: string[];
  caseStudies: Record<'patentpath' | 'english-job-agent', {
    outcome: string;
    problem: string;
    responsibility: string;
    build: string[];
    evidence: string[];
  }>;
  footer: string;
}
```

- [ ] **Step 4: Create the English canonical content**

Create `src/content/en.ts` using the type above and the fixed links. Use these exact public claims and copy:

```ts
import type { SiteContent } from './types';

export const en = {
  locale: 'en',
  meta: {
    title: 'Vittorio Cai — Business, Data & Applied AI',
    description: 'TUM MMDT student building useful analytics and AI products for real business problems.',
  },
  nav: { work: 'Work', profile: 'Profile', experience: 'Experience', contact: 'Contact', menu: 'Menu' },
  hero: {
    eyebrow: 'TUM MMDT · Heilbronn, Germany',
    lines: ['Business insight.', 'Data discipline.', 'Useful AI.'],
    summary: 'I connect business questions with analytics, machine learning and software — then turn the result into something people can actually use.',
    availabilityLabel: 'Currently',
    availability: 'Open to working student and internship opportunities in Germany.',
    focusLabel: 'Focus',
    focus: ['Data & Business Intelligence', 'Supply Chain Analytics', 'Applied AI'],
  },
  actions: { viewProjects: 'View projects', cv: 'Download CV', demo: 'Live demo', source: 'GitHub', caseStudy: 'Case study', email: 'Email me' },
  sections: { work: 'Selected work', profile: 'Profile & education', experience: 'Experience', skills: 'Skills & languages', contact: "Let's talk", contribution: 'My contribution' },
  projects: [
    {
      id: 'patentpath', kicker: 'Featured · TUM × Fuyao', title: 'PatentPATH',
      summary: 'An AI-assisted patent analysis interface that turns a design description into an actionable overlap-risk report.',
      contribution: 'Frontend development and PostgreSQL/pgvector database design and implementation.',
      details: ['Designed the patent-corpus and embedding storage for semantic search.', 'Built the user-facing workflow for non-technical decision makers.'],
      tags: ['Frontend', 'PostgreSQL', 'pgvector'],
      actions: { demo: 'https://new-patent-path.vercel.app', caseStudy: true },
    },
    {
      id: 'english-job-agent', kicker: 'Open source', title: 'English Job Agent for Germany',
      summary: 'Finds and ranks English-friendly student jobs, detects hidden German requirements, and sends a daily digest.',
      details: ['Public ATS feeds with cross-source deduplication.', 'LLM judgment with evidence, red flags and a capped daily budget.'],
      tags: ['Python', 'LLM', 'GitHub Actions'],
      actions: { source: 'https://github.com/VittorioCai/english-job-agent-germany', caseStudy: true },
    },
    {
      id: 'news-sentiment', kicker: 'Empirical ML · TUM Campus Challenge', title: 'LLM News-Sentiment & Portfolio Study',
      summary: 'A 59,000-observation data pipeline and controlled prompt experiment for US-equity news.',
      details: ['Co-built sourcing, panel structure and merge logic.', 'Validated economic value with Fama-French factor regressions.'],
      tags: ['Python', 'Experimental design', 'Empirical finance'], actions: {},
    },
    {
      id: 'water-quality', kicker: 'Supervised ML', title: 'Water Quality Prediction',
      summary: 'A six-model benchmark designed for an imbalanced prediction problem.',
      contribution: 'Implemented and tuned SVM and AdaBoost and designed cross-model evaluation.',
      details: ['Used stratified k-fold validation.', 'Prioritized F1, PR-AUC and ROC-AUC over raw accuracy.'],
      tags: ['scikit-learn', 'SVM', 'AdaBoost'], actions: {},
    },
  ],
  profile: 'I began in financial management and now study Management and Digital Technology at TUM. My work connects quantitative analysis, business decisions and software implementation.',
  education: [
    { school: 'Technical University of Munich (TUM)', degree: 'M.Sc. Management and Digital Technology', period: '2025–present', location: 'Heilbronn, Germany' },
    { school: 'Wenzhou University', degree: 'B.A. Financial Management', period: '2021–2025', location: 'Wenzhou, China' },
  ],
  experience: [
    { organization: 'Ruian Municipal Bureau of Commerce', role: 'Finance Intern', period: '2024–2025', bullets: ['Built interactive Excel dashboards covering more than 50 enterprises.', 'Surfaced two cost inefficiencies from operational data.'] },
    { organization: 'Ruian Tongyan Embroidery Co., Ltd.', role: 'Accountant Intern', period: '2024', bullets: ['Automated piece-rate wage calculation, saving more than 10 hours per month.', 'Built a tracking database supporting procurement decisions.'] },
  ],
  skillGroups: [
    { title: 'Data', items: ['Python', 'SQL', 'PostgreSQL', 'R', 'SPSS', 'Excel/VBA'] },
    { title: 'ML & product', items: ['scikit-learn', 'PyTorch (in progress)', 'pgvector', 'Git/GitHub'] },
    { title: 'Reporting', items: ['Interactive dashboards', 'Matplotlib', 'Microsoft 365'] },
  ],
  languages: ['Mandarin · Native', 'English · C1', 'German · A1'],
  caseStudies: {
    patentpath: {
      outcome: 'Patent analysis translated into a workflow non-technical users can act on.',
      problem: 'Teams evaluating HUD windshield designs need to navigate a large patent corpus and understand possible overlap risk.',
      responsibility: 'I owned the web frontend and the PostgreSQL/pgvector database design and implementation within the team project.',
      build: ['Structured patent text and embeddings for semantic retrieval.', 'Built the interface from design input to generated risk report.', 'Connected technical output to a clear user-facing flow.'],
      evidence: ['Public working demo.', 'Team project with Fuyao through the TUM GenAI Project.'],
    },
    'english-job-agent': {
      outcome: 'A daily shortlist instead of repeated manual searches across fragmented career sites.',
      problem: 'English job descriptions in Germany often hide German-language requirements in the fine print.',
      responsibility: 'I developed and maintain the open-source pipeline and its GitHub Actions operation.',
      build: ['Aggregated public, no-auth ATS feeds.', 'Added rule-based and LLM language-requirement judgment.', 'Deduplicated jobs and generated an evidence-backed daily digest.'],
      evidence: ['Public MIT-licensed repository.', 'Automated tests and daily GitHub Actions execution.'],
    },
  },
  footer: 'Built in Heilbronn. Designed for clarity.',
} satisfies SiteContent;
```

- [ ] **Step 5: Create complete German and Chinese translations**

Create `src/content/de.ts`:

```ts
import type { SiteContent } from './types';

export const de = {
  locale: 'de',
  meta: {
    title: 'Vittorio Cai — Wirtschaft, Daten & angewandte KI',
    description: 'TUM-MMDT-Student, der Datenanalyse und KI für konkrete betriebliche Fragestellungen nutzbar macht.',
  },
  nav: { work: 'Projekte', profile: 'Profil', experience: 'Erfahrung', contact: 'Kontakt', menu: 'Menü' },
  hero: {
    eyebrow: 'TUM MMDT · Heilbronn, Deutschland',
    lines: ['Geschäftsverständnis.', 'Datendisziplin.', 'Nützliche KI.'],
    summary: 'Ich verbinde betriebliche Fragestellungen mit Datenanalyse, maschinellem Lernen und Software — und entwickle daraus Lösungen, die Menschen tatsächlich nutzen können.',
    availabilityLabel: 'Aktuell',
    availability: 'Offen für Werkstudentenstellen und Praktika in Deutschland.',
    focusLabel: 'Schwerpunkte',
    focus: ['Daten & Business Intelligence', 'Supply Chain Analytics', 'Angewandte KI'],
  },
  actions: { viewProjects: 'Projekte ansehen', cv: 'CV herunterladen (Englisch)', demo: 'Live-Demo', source: 'GitHub', caseStudy: 'Projektbericht', email: 'E-Mail senden' },
  sections: { work: 'Ausgewählte Projekte', profile: 'Profil & Ausbildung', experience: 'Erfahrung', skills: 'Kenntnisse & Sprachen', contact: 'Kontakt', contribution: 'Mein Beitrag' },
  projects: [
    {
      id: 'patentpath', kicker: 'Hauptprojekt · TUM × Fuyao', title: 'PatentPATH',
      summary: 'Eine KI-gestützte Oberfläche für Patentrecherchen, die aus einer Designbeschreibung einen handlungsorientierten Bericht zu möglichen Überschneidungsrisiken erstellt.',
      contribution: 'Frontend-Entwicklung sowie Konzeption und Umsetzung der PostgreSQL/pgvector-Datenbank.',
      details: ['Strukturierung von Patentkorpus und Embeddings für die semantische Suche.', 'Entwicklung des nutzerorientierten Ablaufs für nichttechnische Entscheider.'],
      tags: ['Frontend', 'PostgreSQL', 'pgvector'],
      actions: { demo: 'https://new-patent-path.vercel.app', caseStudy: true },
    },
    {
      id: 'english-job-agent', kicker: 'Open Source', title: 'English Job Agent for Germany',
      summary: 'Findet und bewertet englischsprachige Studierendenstellen, erkennt versteckte Deutschanforderungen und versendet eine tägliche Auswahl.',
      details: ['Öffentliche ATS-Feeds mit quellenübergreifender Deduplizierung.', 'LLM-Bewertung mit Belegen, Warnhinweisen und begrenztem Tagesbudget.'],
      tags: ['Python', 'LLM', 'GitHub Actions'],
      actions: { source: 'https://github.com/VittorioCai/english-job-agent-germany', caseStudy: true },
    },
    {
      id: 'news-sentiment', kicker: 'Empirisches ML · TUM Campus Challenge', title: 'LLM News-Sentiment & Portfolio Study',
      summary: 'Eine Datenpipeline mit 59.000 Beobachtungen und ein kontrolliertes Prompt-Experiment für US-Aktiennachrichten.',
      details: ['Mitentwicklung von Datenbeschaffung, Panelstruktur und Merge-Logik.', 'Validierung des ökonomischen Nutzens mit Fama-French-Faktorregressionen.'],
      tags: ['Python', 'Versuchsdesign', 'Empirische Finanzforschung'], actions: {},
    },
    {
      id: 'water-quality', kicker: 'Überwachtes Lernen', title: 'Water Quality Prediction',
      summary: 'Ein Vergleich von sechs Modellen für ein unausgeglichenes Klassifikationsproblem.',
      contribution: 'Implementierung und Abstimmung von SVM und AdaBoost sowie Konzeption der modellübergreifenden Evaluation.',
      details: ['Stratifizierte k-fache Kreuzvalidierung.', 'Fokus auf F1, PR-AUC und ROC-AUC statt auf reine Accuracy.'],
      tags: ['scikit-learn', 'SVM', 'AdaBoost'], actions: {},
    },
  ],
  profile: 'Mein Ausgangspunkt ist das Finanzmanagement; heute studiere ich Management and Digital Technology an der TUM. In meinen Projekten verbinde ich quantitative Analyse, betriebliche Entscheidungen und Softwareentwicklung.',
  education: [
    { school: 'Technische Universität München (TUM)', degree: 'M.Sc. Management and Digital Technology', period: '2025–heute', location: 'Heilbronn, Deutschland' },
    { school: 'Wenzhou University', degree: 'B.A. Financial Management', period: '2021–2025', location: 'Wenzhou, China' },
  ],
  experience: [
    { organization: 'Ruian Municipal Bureau of Commerce', role: 'Praktikant im Finanzbereich', period: '2024–2025', bullets: ['Interaktive Excel-Dashboards für mehr als 50 Unternehmen entwickelt.', 'Zwei Kostenineffizienzen aus Betriebsdaten sichtbar gemacht.'] },
    { organization: 'Ruian Tongyan Embroidery Co., Ltd.', role: 'Praktikant im Rechnungswesen', period: '2024', bullets: ['Akkordlohn-Berechnung automatisiert und dadurch mehr als zehn Stunden pro Monat eingespart.', 'Eine Tracking-Datenbank zur Unterstützung von Beschaffungsentscheidungen aufgebaut.'] },
  ],
  skillGroups: [
    { title: 'Daten', items: ['Python', 'SQL', 'PostgreSQL', 'R', 'SPSS', 'Excel/VBA'] },
    { title: 'ML & Produkt', items: ['scikit-learn', 'PyTorch (im Aufbau)', 'pgvector', 'Git/GitHub'] },
    { title: 'Reporting', items: ['Interaktive Dashboards', 'Matplotlib', 'Microsoft 365'] },
  ],
  languages: ['Mandarin · Muttersprache', 'Englisch · C1', 'Deutsch · A1'],
  caseStudies: {
    patentpath: {
      outcome: 'Patentanalyse als verständlicher Ablauf, mit dem nichttechnische Nutzer arbeiten können.',
      problem: 'Teams, die HUD-Windschutzscheiben bewerten, müssen einen großen Patentbestand durchsuchen und mögliche Überschneidungsrisiken einordnen.',
      responsibility: 'Im Teamprojekt war ich für das Web-Frontend sowie für Konzeption und Umsetzung der PostgreSQL/pgvector-Datenbank verantwortlich.',
      build: ['Patenttexte und Embeddings für semantische Suche strukturiert.', 'Die Oberfläche von der Designbeschreibung bis zum Risikobericht aufgebaut.', 'Technische Ergebnisse in einen klaren Nutzerablauf übersetzt.'],
      evidence: ['Öffentlich zugängliche Demo.', 'Teamprojekt mit Fuyao im Rahmen des TUM GenAI Project.'],
    },
    'english-job-agent': {
      outcome: 'Eine tägliche, priorisierte Auswahl statt wiederholter manueller Suche auf verteilten Karriereseiten.',
      problem: 'Englische Stellenanzeigen in Deutschland enthalten Deutschanforderungen oft erst im Kleingedruckten.',
      responsibility: 'Ich entwickle und betreue die Open-Source-Pipeline und ihren Betrieb mit GitHub Actions.',
      build: ['Öffentliche ATS-Feeds ohne Anmeldung zusammengeführt.', 'Regelbasierte und LLM-gestützte Bewertung der Sprachanforderungen ergänzt.', 'Stellen dedupliziert und einen beleggestützten täglichen Digest erzeugt.'],
      evidence: ['Öffentliches Repository unter MIT-Lizenz.', 'Automatisierte Tests und tägliche Ausführung mit GitHub Actions.'],
    },
  },
  footer: 'Entwickelt in Heilbronn. Gestaltet für Klarheit.',
} satisfies SiteContent;
```

Create `src/content/zh.ts`:

```ts
import type { SiteContent } from './types';

export const zh = {
  locale: 'zh',
  meta: {
    title: 'Vittorio Cai — 业务、数据与应用 AI',
    description: 'TUM MMDT 学生，用数据分析与 AI 解决真实业务问题。',
  },
  nav: { work: '项目', profile: '关于我', experience: '经历', contact: '联系', menu: '菜单' },
  hero: {
    eyebrow: 'TUM MMDT · 德国海尔布隆',
    lines: ['理解业务。', '尊重数据。', '让 AI 真正有用。'],
    summary: '我把业务问题与数据分析、机器学习和软件开发连接起来，并将结果做成真正可以使用的工具。',
    availabilityLabel: '目前',
    availability: '正在寻找德国的实习与 Working Student 机会。',
    focusLabel: '方向',
    focus: ['数据与商业智能', '供应链分析', '应用 AI'],
  },
  actions: { viewProjects: '查看项目', cv: '下载英文 CV', demo: '在线演示', source: 'GitHub', caseStudy: '项目详情', email: '发送邮件' },
  sections: { work: '代表项目', profile: '个人背景与教育', experience: '实践经历', skills: '技能与语言', contact: '联系我', contribution: '我的贡献' },
  projects: [
    {
      id: 'patentpath', kicker: '重点项目 · TUM × Fuyao', title: 'PatentPATH',
      summary: '一个 AI 辅助专利分析界面，可将设计描述转化为可行动的专利重叠风险报告。',
      contribution: '负责前端开发，以及 PostgreSQL/pgvector 数据库的设计与实现。',
      details: ['为语义检索设计专利语料与向量嵌入的存储结构。', '为非技术决策者构建清晰的用户操作流程。'],
      tags: ['前端', 'PostgreSQL', 'pgvector'],
      actions: { demo: 'https://new-patent-path.vercel.app', caseStudy: true },
    },
    {
      id: 'english-job-agent', kicker: '开源项目', title: 'English Job Agent for Germany',
      summary: '寻找并排序德国的英语友好型学生岗位，识别隐藏的德语要求，并发送每日摘要。',
      details: ['聚合公开 ATS 数据源并进行跨来源去重。', '使用 LLM 提供带证据和风险提示的判断，同时限制每日预算。'],
      tags: ['Python', 'LLM', 'GitHub Actions'],
      actions: { source: 'https://github.com/VittorioCai/english-job-agent-germany', caseStudy: true },
    },
    {
      id: 'news-sentiment', kicker: '实证机器学习 · TUM Campus Challenge', title: 'LLM 新闻情绪与投资组合研究',
      summary: '面向美国股票新闻的约 59,000 条观测数据管线与受控提示词实验。',
      details: ['共同完成数据获取、面板结构和合并逻辑。', '使用 Fama-French 因子回归验证经济价值。'],
      tags: ['Python', '实验设计', '实证金融'], actions: {},
    },
    {
      id: 'water-quality', kicker: '监督学习', title: '水质预测',
      summary: '针对类别不平衡问题设计的六模型基准比较。',
      contribution: '负责实现和调优 SVM 与 AdaBoost，并设计跨模型评估方案。',
      details: ['使用分层 k 折交叉验证。', '优先考察 F1、PR-AUC 和 ROC-AUC，而非单纯准确率。'],
      tags: ['scikit-learn', 'SVM', 'AdaBoost'], actions: {},
    },
  ],
  profile: '我本科主修财务管理，目前在 TUM 学习 Management and Digital Technology。我的项目把定量分析、业务决策与软件实现结合在一起。',
  education: [
    { school: '慕尼黑工业大学（TUM）', degree: 'Management and Digital Technology 硕士', period: '2025–至今', location: '德国海尔布隆' },
    { school: '温州大学', degree: '财务管理学士', period: '2021–2025', location: '中国温州' },
  ],
  experience: [
    { organization: '瑞安市商务局', role: '财务实习生', period: '2024–2025', bullets: ['为 50 多家企业构建交互式 Excel 仪表板。', '从运营数据中识别出两项关键成本低效。'] },
    { organization: '瑞安市通艳刺绣有限公司', role: '会计实习生', period: '2024', bullets: ['自动化计件工资计算，每月节省十小时以上。', '构建支持采购决策的市场价格与供应商跟踪数据库。'] },
  ],
  skillGroups: [
    { title: '数据', items: ['Python', 'SQL', 'PostgreSQL', 'R', 'SPSS', 'Excel/VBA'] },
    { title: '机器学习与产品', items: ['scikit-learn', 'PyTorch（学习中）', 'pgvector', 'Git/GitHub'] },
    { title: '报告与呈现', items: ['交互式仪表板', 'Matplotlib', 'Microsoft 365'] },
  ],
  languages: ['中文 · 母语', '英语 · C1', '德语 · A1'],
  caseStudies: {
    patentpath: {
      outcome: '把专利分析转化为非技术用户能够理解并采取行动的流程。',
      problem: '评估 HUD 挡风玻璃设计的团队需要检索大量专利，并判断可能的重叠风险。',
      responsibility: '在团队项目中，我负责 Web 前端，以及 PostgreSQL/pgvector 数据库的设计与实现。',
      build: ['组织专利文本与向量嵌入以支持语义检索。', '搭建设计输入到风险报告的完整界面流程。', '把技术输出转换为清晰的用户操作路径。'],
      evidence: ['可公开访问的在线演示。', 'TUM GenAI Project 与 Fuyao 合作的团队项目。'],
    },
    'english-job-agent': {
      outcome: '用每日优先级清单代替在分散招聘网站上的重复搜索。',
      problem: '德国的英文岗位描述经常把德语要求隐藏在细节中。',
      responsibility: '我开发并维护该开源管线及其 GitHub Actions 自动运行。',
      build: ['聚合无需登录的公开 ATS 数据源。', '结合规则与 LLM 判断岗位语言要求。', '对岗位去重，并生成带证据的每日摘要。'],
      evidence: ['公开的 MIT 许可代码仓库。', '自动化测试与每日 GitHub Actions 运行。'],
    },
  },
  footer: '构建于海尔布隆，以清晰为设计原则。',
} satisfies SiteContent;
```

- [ ] **Step 6: Add the locale registry**

Create `src/content/index.ts`:

```ts
import { de } from './de';
import { en } from './en';
import { zh } from './zh';
import { locales, type Locale, type SiteContent } from './types';

export { locales } from './types';
export type { Locale, SiteContent } from './types';

export const content = { en, de, zh } satisfies Record<Locale, SiteContent>;

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}

for (const locale of locales) {
  if (content[locale].locale !== locale) {
    throw new Error(`Locale mismatch for ${locale}`);
  }
}
```

- [ ] **Step 7: Run the content tests**

Run:

```bash
npm test -- tests/content.test.ts
npm run check
```

Expected: all four content tests pass and Astro reports no type errors.

- [ ] **Step 8: Commit the verified content model**

```bash
git add src/content tests/content.test.ts
git commit -m "feat: add verified trilingual portfolio content"
```

---

### Task 3: Implement localized routes, metadata, and the editorial shell

**Files:**
- Create: `src/i18n/routes.ts`
- Create: `tests/routes.test.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write failing route tests**

Create `tests/routes.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getLocalizedPath, getLanguageLinks } from '../src/i18n/routes';

describe('localized routes', () => {
  it('keeps English at root and prefixes German and Chinese', () => {
    expect(getLocalizedPath('en', 'home')).toBe('/');
    expect(getLocalizedPath('de', 'home')).toBe('/de/');
    expect(getLocalizedPath('zh', 'home')).toBe('/zh/');
    expect(getLocalizedPath('de', 'patentpath')).toBe('/de/work/patentpath/');
  });

  it('returns all equivalents for a language switcher', () => {
    expect(getLanguageLinks('jobAgent')).toEqual([
      { locale: 'en', href: '/work/english-job-agent/' },
      { locale: 'de', href: '/de/work/english-job-agent/' },
      { locale: 'zh', href: '/zh/work/english-job-agent/' },
    ]);
  });
});
```

- [ ] **Step 2: Run the route tests to verify they fail**

Run `npm test -- tests/routes.test.ts`.

Expected: FAIL because `src/i18n/routes.ts` does not exist.

- [ ] **Step 3: Implement route generation**

Create `src/i18n/routes.ts`:

```ts
import { locales, type Locale } from '../content/types';

export type RouteKey = 'home' | 'patentpath' | 'jobAgent';

const suffixes: Record<RouteKey, string> = {
  home: '',
  patentpath: 'work/patentpath/',
  jobAgent: 'work/english-job-agent/',
};

export function getLocalizedPath(locale: Locale, route: RouteKey): string {
  const prefix = locale === 'en' ? '/' : `/${locale}/`;
  return `${prefix}${suffixes[route]}`;
}

export function getLanguageLinks(route: RouteKey) {
  return locales.map((locale) => ({ locale, href: getLocalizedPath(locale, route) }));
}
```

- [ ] **Step 4: Run the route tests**

Run `npm test -- tests/routes.test.ts`.

Expected: two tests pass.

- [ ] **Step 5: Implement the base layout and header**

`BaseLayout.astro` must:

- import `../styles/global.css`
- set `<html lang={locale === 'zh' ? 'zh-CN' : locale}>`
- render title, description, canonical URL, three `hreflang` links, `x-default`, favicon, Open Graph metadata, and JSON-LD `Person`
- render `Header` before `<main>` and a minimal copyright footer after it
- accept `locale`, `route`, `title`, `description`, and optional `noindex` props

Use this canonical/hreflang logic:

```astro
---
import Header from '../components/Header.astro';
import { getLanguageLinks, getLocalizedPath, type RouteKey } from '../i18n/routes';
import type { Locale } from '../content';
import '../styles/global.css';

interface Props { locale: Locale; route: RouteKey; title: string; description: string; noindex?: boolean }
const { locale, route, title, description, noindex = false } = Astro.props;
if (!Astro.site) throw new Error('astro.config.mjs must define site');
const alternatives = noindex ? [] : getLanguageLinks(route);
const canonical = noindex ? new URL(Astro.url.pathname, Astro.site) : new URL(getLocalizedPath(locale, route), Astro.site);
---
```

`Header.astro` must use semantic `<header>` and `<nav>`, anchor section links back to the localized homepage, render the three language links, mark the active locale with `aria-current="page"`, and provide a button-controlled mobile menu. The menu script only toggles `aria-expanded` and a `data-open` attribute.

- [ ] **Step 6: Implement the approved global visual system**

Create `src/styles/global.css` with these tokens and non-negotiable rules:

```css
:root {
  --ink: #171717;
  --accent: #1f5fae;
  --muted: #666666;
  --line: #dedede;
  --surface: #fafafa;
  --paper: #ffffff;
  --max-width: 1200px;
  --pad: clamp(1rem, 3vw, 2rem);
  font-family: Arial, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: var(--ink);
  background: var(--paper);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; background: var(--paper); }
a { color: inherit; text-underline-offset: .22em; }
a:hover { color: var(--accent); }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.site-shell { width: min(100%, var(--max-width)); margin-inline: auto; border-inline: 1px solid var(--line); }
.accent-rule { height: 3px; background: var(--accent); }
.section-label { color: var(--accent); font-size: .75rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.rule { border-bottom: 1px solid var(--line); }
.external::after { content: " ↗"; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
@media (max-width: 760px) { .site-shell { border-inline: 0; } }
```

Extend the same file with these layout classes. Components must use these names rather than inventing a second style system:

```css
.site-header { display: flex; min-height: 4rem; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 0 var(--pad); border-bottom: 1px solid var(--line); }
.wordmark { font-size: .875rem; font-weight: 700; letter-spacing: .04em; text-decoration: none; }
.site-nav, .language-nav { display: flex; align-items: center; gap: 1rem; font-size: .75rem; }
.language-nav [aria-current="page"] { color: var(--accent); font-weight: 700; }
.menu-button { display: none; min-width: 44px; min-height: 44px; border: 0; background: transparent; color: var(--ink); }
.hero { display: grid; grid-template-columns: minmax(0, 2.1fr) minmax(16rem, .9fr); border-bottom: 1px solid var(--line); }
.hero__main { padding: clamp(3rem, 7vw, 6rem) var(--pad); border-right: 1px solid var(--line); }
.hero__main h1 { margin: .9rem 0 1.25rem; max-width: 14ch; font-size: clamp(2.7rem, 6vw, 5.5rem); line-height: .98; letter-spacing: -.045em; }
.hero__summary { max-width: 44rem; color: var(--muted); font-size: clamp(1rem, 1.8vw, 1.2rem); line-height: 1.65; }
.hero__aside { display: flex; flex-direction: column; justify-content: space-between; gap: 2rem; padding: var(--pad); background: var(--surface); }
.text-actions { display: flex; flex-wrap: wrap; gap: 1.25rem; margin-top: 1.5rem; font-size: .75rem; font-weight: 700; text-transform: uppercase; }
.section-heading { display: flex; justify-content: space-between; padding: 1rem var(--pad); border-bottom: 1px solid var(--line); }
.project-featured { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 1fr); border-bottom: 1px solid var(--line); }
.project-featured__body { padding: clamp(1.5rem, 4vw, 3rem) var(--pad); border-right: 1px solid var(--line); }
.project-featured__visual { display: grid; min-height: 18rem; place-items: center; padding: var(--pad); background: #f3f3f3; }
.project-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid var(--line); }
.project-card { min-width: 0; padding: 1.5rem var(--pad); border-right: 1px solid var(--line); }
.project-card:last-child { border-right: 0; }
.profile-grid, .experience-grid { display: grid; grid-template-columns: minmax(12rem, .8fr) minmax(0, 2.2fr); border-bottom: 1px solid var(--line); }
.section-side { padding: 1.5rem var(--pad); border-right: 1px solid var(--line); }
.section-main { min-width: 0; padding: 1.5rem var(--pad); }
.education-row, .experience-row { display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 1rem; padding: 1rem 0; border-top: 1px solid var(--line); }
.skills-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid var(--line); }
.skill-group { min-width: 0; padding: 1.5rem var(--pad); border-right: 1px solid var(--line); }
.skill-group:last-child { border-right: 0; }
.contact-block { display: flex; align-items: end; justify-content: space-between; gap: 2rem; padding: clamp(2rem, 5vw, 4rem) var(--pad); overflow-wrap: anywhere; }
.case-study { display: grid; grid-template-columns: minmax(14rem, .75fr) minmax(0, 2.25fr); }
.case-study__rail { padding: var(--pad); border-right: 1px solid var(--line); background: var(--surface); }
.case-study__body { min-width: 0; padding: clamp(2rem, 5vw, 5rem) var(--pad); }
.case-study__body section { max-width: 52rem; padding-block: 2rem; border-top: 1px solid var(--line); }

@media (max-width: 760px) {
  .site-header { align-items: flex-start; flex-wrap: wrap; }
  .menu-button { display: inline-grid; place-items: center; }
  .site-nav { display: none; flex-basis: 100%; flex-direction: column; align-items: stretch; padding-bottom: 1rem; }
  .site-header[data-open="true"] .site-nav { display: flex; }
  .hero, .project-featured, .profile-grid, .experience-grid, .case-study { grid-template-columns: 1fr; }
  .hero__main, .project-featured__body, .section-side, .case-study__rail { border-right: 0; border-bottom: 1px solid var(--line); }
  .project-grid, .skills-grid { grid-template-columns: 1fr; }
  .project-card, .skill-group { border-right: 0; border-bottom: 1px solid var(--line); }
  .education-row, .experience-row { grid-template-columns: 1fr; gap: .35rem; }
  .contact-block { align-items: flex-start; flex-direction: column; }
}
```

Use only the approved colors; no gradient, shadow, rounded-card system, or empty portrait block.

- [ ] **Step 7: Run static checks and commit**

Run:

```bash
npm test -- tests/routes.test.ts
npm run check
```

Expected: route tests and Astro check pass.

Commit:

```bash
git add src/i18n src/layouts src/components/Header.astro src/styles/global.css tests/routes.test.ts
git commit -m "feat: add localized editorial site shell"
```

---

### Task 4: Build the three localized homepages

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/ProjectVisual.astro`
- Create: `src/components/ProjectGrid.astro`
- Create: `src/components/ProfileSection.astro`
- Create: `src/components/ExperienceList.astro`
- Create: `src/components/SkillGroups.astro`
- Create: `src/components/ContactBlock.astro`
- Create: `src/components/HomePage.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/de/index.astro`
- Create: `src/pages/zh/index.astro`
- Create: `tests/build-output.test.ts`

- [ ] **Step 1: Write the first failing built-output test**

Create `tests/build-output.test.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { beforeAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';

beforeAll(() => execFileSync('npm', ['run', 'build'], { stdio: 'inherit' }));

const pages = [
  ['dist/index.html', 'en'],
  ['dist/de/index.html', 'de'],
  ['dist/zh/index.html', 'zh-CN'],
] as const;

describe('built homepages', () => {
  it.each(pages)('builds %s with the correct language and sections', (file, lang) => {
    expect(existsSync(file)).toBe(true);
    const $ = load(readFileSync(file, 'utf8'));
    expect($('html').attr('lang')).toBe(lang);
    expect($('main').length).toBe(1);
    expect($('#work').length).toBe(1);
    expect($('#profile').length).toBe(1);
    expect($('#experience').length).toBe(1);
    expect($('#contact').length).toBe(1);
    expect($('[data-project-id="patentpath"]').first().attr('data-featured')).toBe('true');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run `npm test -- tests/build-output.test.ts`.

Expected: FAIL because the pages do not exist.

- [ ] **Step 3: Implement focused homepage components**

Each component receives `SiteContent` or the smallest relevant slice as a typed prop. Required semantics:

- `Hero`: one `<h1>` containing the three approved lines, availability `<aside>`, anchor to `#work`, CV download link
- `ProjectVisual`: for `patentpath`, render a decorative browser frame with a design-input panel and two report panels; for `english-job-agent`, render a simple `Public ATS feeds → language check → ranked digest` pipeline. Use CSS borders and text from the active locale, never invented performance metrics, and mark purely decorative geometry `aria-hidden="true"`.
- `ProjectGrid`: one featured `<article data-project-id="patentpath" data-featured="true">`, followed by three project articles; render only defined actions
- `ProfileSection`: profile paragraph and two education entries
- `ExperienceList`: two `<article>` rows with bullet evidence
- `SkillGroups`: three skill groups and one language group without badge/progress-bar markup
- `ContactBlock`: email, LinkedIn, GitHub, and CV; no form and no phone

Use this action rule in `ProjectGrid.astro`:

```astro
{project.actions.demo && <a class="external" href={project.actions.demo} rel="noreferrer">{copy.actions.demo}</a>}
{project.actions.source && <a class="external" href={project.actions.source} rel="noreferrer">{copy.actions.source}</a>}
{project.actions.caseStudy && <a href={caseStudyHref}>{copy.actions.caseStudy}</a>}
```

Compute `caseStudyHref` only for the two supported IDs:

```ts
const caseStudyHref = project.id === 'patentpath'
  ? getLocalizedPath(locale, 'patentpath')
  : project.id === 'english-job-agent'
    ? getLocalizedPath(locale, 'jobAgent')
    : undefined;
```

- [ ] **Step 4: Compose `HomePage.astro`**

`HomePage.astro` accepts `locale`, obtains `copy = getContent(locale)`, and renders:

```astro
<BaseLayout locale={locale} route="home" title={copy.meta.title} description={copy.meta.description}>
  <Hero copy={copy} />
  <ProjectGrid copy={copy} locale={locale} />
  <ProfileSection copy={copy} />
  <ExperienceList copy={copy} />
  <SkillGroups copy={copy} />
  <ContactBlock copy={copy} />
</BaseLayout>
```

- [ ] **Step 5: Add the three thin route files**

Create each page with only locale selection:

```astro
---
import HomePage from '../components/HomePage.astro';
---
<HomePage locale="en" />
```

Adjust the relative import for `src/pages/de/index.astro` and `src/pages/zh/index.astro`; pass `de` and `zh` respectively.

- [ ] **Step 6: Run the built-homepage test and full static checks**

Run:

```bash
npm test -- tests/build-output.test.ts
npm run check
```

Expected: three localized homepage cases pass; Astro check reports no errors.

- [ ] **Step 7: Commit the homepages**

```bash
git add src/components src/pages/index.astro src/pages/de/index.astro src/pages/zh/index.astro tests/build-output.test.ts
git commit -m "feat: build trilingual portfolio homepages"
```

---

### Task 5: Add PatentPATH and job-agent case studies

**Files:**
- Create: `src/components/ProjectCaseStudy.astro`
- Create: six localized project route files
- Modify: `tests/build-output.test.ts`

- [ ] **Step 1: Extend the failing build test for all case-study routes**

Add:

```ts
const caseStudyPages = [
  'dist/work/patentpath/index.html',
  'dist/de/work/patentpath/index.html',
  'dist/zh/work/patentpath/index.html',
  'dist/work/english-job-agent/index.html',
  'dist/de/work/english-job-agent/index.html',
  'dist/zh/work/english-job-agent/index.html',
];

it.each(caseStudyPages)('builds case study %s', (file) => {
  expect(existsSync(file)).toBe(true);
  const $ = load(readFileSync(file, 'utf8'));
  expect($('main article').length).toBe(1);
  expect($('[data-case-section="responsibility"]').text().trim().length).toBeGreaterThan(20);
  const schemas = $('script[type="application/ld+json"]').toArray().map((node) => JSON.parse($(node).text()));
  expect(schemas.some((schema) => schema['@type'] === 'CreativeWork')).toBe(true);
});
```

- [ ] **Step 2: Run the focused test to verify failure**

Run `npm test -- tests/build-output.test.ts`.

Expected: the six new cases fail because the routes do not exist.

- [ ] **Step 3: Implement the shared case-study component**

`ProjectCaseStudy.astro` accepts `locale` and `projectId: 'patentpath' | 'english-job-agent'`. It renders `BaseLayout` with the matching route key, then one `<article>` containing:

- outcome as the page `<h1>` and introduction
- problem section
- `data-case-section="responsibility"` section
- build bullet list
- evidence bullet list
- only verified public actions
- previous/next navigation back to the localized homepage and the other case study
- page-specific JSON-LD with `@type: 'CreativeWork'`, the verified project name and description, the public demo or repository URL, and Vittorio as `author`; do not add dates, organization ownership, ratings, or performance fields that are not verified

PatentPATH may show the live demo but no source action. English Job Agent may show GitHub but no fake live-demo action.

- [ ] **Step 4: Add six thin locale route files**

Each file imports `ProjectCaseStudy` and passes the locale/project ID, for example:

```astro
---
import ProjectCaseStudy from '../../../components/ProjectCaseStudy.astro';
---
<ProjectCaseStudy locale="en" projectId="patentpath" />
```

Use correct relative imports at each nesting depth.

- [ ] **Step 5: Run the build tests and commit**

Run:

```bash
npm test -- tests/build-output.test.ts
npm run check
```

Expected: all homepage and case-study cases pass.

Commit:

```bash
git add src/components/ProjectCaseStudy.astro src/pages tests/build-output.test.ts
git commit -m "feat: add localized project case studies"
```

---

### Task 6: Add CV, metadata assets, 404 handling, and privacy checks

**Files:**
- Create: `public/Vittorio-Cai-CV-English.pdf`
- Create: `public/favicon.svg`
- Create: `public/og-card.svg`
- Create: `public/robots.txt`
- Create: `src/pages/404.astro`
- Modify: `tests/build-output.test.ts`

- [ ] **Step 1: Extend tests for metadata, links, and HTML privacy**

Change the existing `node:fs` import to:

```ts
import { existsSync, globSync, readFileSync } from 'node:fs';
```

Then add tests that load every built `.html` file recursively and assert:

```ts
it('publishes safe metadata, hreflang and public links', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  const $ = load(html);
  expect($('link[rel="canonical"]').attr('href')).toBe('https://vittoriocai.github.io/');
  expect($('link[hreflang="de"]').attr('href')).toBe('https://vittoriocai.github.io/de/');
  expect($('link[hreflang="zh-CN"]').attr('href')).toBe('https://vittoriocai.github.io/zh/');
  expect($('a[href="mailto:vittorio.cai@tum.de"]').length).toBeGreaterThan(0);
  expect($('a[href="/Vittorio-Cai-CV-English.pdf"]').length).toBeGreaterThan(0);
});

it('keeps the phone number out of every rendered HTML page', () => {
  for (const file of globSync('dist/**/*.html')) {
    const html = readFileSync(file, 'utf8');
    expect(containsGermanMobileNumber(html), file).toBe(false);
  }
});

it('builds the 404 page and public assets', () => {
  for (const file of ['dist/404.html', 'dist/favicon.svg', 'dist/og-card.svg', 'dist/robots.txt', 'dist/Vittorio-Cai-CV-English.pdf']) {
    expect(existsSync(file)).toBe(true);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run `npm test -- tests/build-output.test.ts`.

Expected: FAIL for missing assets and 404 page.

- [ ] **Step 3: Copy the approved CV and create static assets**

Run:

```bash
mkdir -p public
cp /Users/vittoriocai/Desktop/CV_VittorioCai_MB.pdf public/Vittorio-Cai-CV-English.pdf
pdfinfo public/Vittorio-Cai-CV-English.pdf | rg '^Pages:\s+1$'
```

Expected: the PDF exists and reports one page.

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="title">
  <title id="title">Vittorio Cai</title>
  <rect x="1" y="1" width="62" height="62" fill="#fff" stroke="#dedede" stroke-width="2"/>
  <rect width="64" height="5" fill="#1f5fae"/>
  <text x="32" y="40" fill="#171717" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">VC</text>
</svg>
```

Create `public/og-card.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">Vittorio Cai portfolio</title>
  <desc id="desc">Business insight. Data discipline. Useful AI.</desc>
  <rect width="1200" height="630" fill="#fff"/>
  <rect width="1200" height="12" fill="#1f5fae"/>
  <line x1="70" y1="110" x2="1130" y2="110" stroke="#dedede" stroke-width="2"/>
  <text x="70" y="85" fill="#171717" font-family="Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="2">VITTORIO CAI</text>
  <text x="70" y="250" fill="#171717" font-family="Arial, sans-serif" font-size="74" font-weight="700">Business insight.</text>
  <text x="70" y="340" fill="#171717" font-family="Arial, sans-serif" font-size="74" font-weight="700">Data discipline.</text>
  <text x="70" y="430" fill="#171717" font-family="Arial, sans-serif" font-size="74" font-weight="700">Useful AI.</text>
  <text x="70" y="550" fill="#1f5fae" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="3">TUM MMDT · HEILBRONN</text>
</svg>
```

Create `public/robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://vittoriocai.github.io/sitemap-index.xml
```

- [ ] **Step 4: Implement `404.astro`**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  locale="en"
  route="home"
  title="404 — Page not found"
  description="The requested page could not be found."
  noindex
>
  <section class="case-study__body">
    <p class="section-label">404</p>
    <h1>Page not found.</h1>
    <p>Diese Seite wurde nicht gefunden.</p>
    <p>没有找到这个页面。</p>
    <nav class="text-actions" aria-label="Choose a homepage">
      <a href="/">English</a>
      <a href="/de/">Deutsch</a>
      <a href="/zh/">中文</a>
    </nav>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Run the build tests and inspect the copied PDF**

Run:

```bash
npm test -- tests/build-output.test.ts
npm run check
pdfinfo public/Vittorio-Cai-CV-English.pdf
```

Expected: build-output tests pass, Astro check passes, and the PDF is one unencrypted page.

- [ ] **Step 6: Commit assets and metadata**

```bash
git add public src/pages/404.astro src/layouts/BaseLayout.astro tests/build-output.test.ts
git commit -m "feat: add portfolio assets and metadata"
```

---

### Task 7: Verify accessibility, navigation, and responsive behavior in a browser

**Files:**
- Create: `tests/portfolio.spec.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write browser tests before final responsive fixes**

Create `tests/portfolio.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('language switcher preserves the current case study', async ({ page }) => {
  await page.goto('/work/patentpath/');
  await page.getByRole('link', { name: 'DE' }).click();
  await expect(page).toHaveURL('/de/work/patentpath/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

for (const width of [320, 390, 768, 1440]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('mobile navigation is keyboard and state accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
});

for (const path of ['/', '/de/', '/zh/', '/work/patentpath/', '/work/english-job-agent/']) {
  test(`has no serious axe violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious).toEqual([]);
  });
}
```

- [ ] **Step 2: Run browser tests and record actual failures**

Run `npm run test:e2e`.

Expected: any failures identify concrete overflow, menu naming, focus, contrast, or landmark defects. Do not weaken assertions to make them pass.

- [ ] **Step 3: Apply the smallest CSS and semantic fixes**

Fix only reported defects. Required invariants:

- no fixed-width child wider than its grid column
- `overflow-wrap: anywhere` on long email and URL text
- project grids collapse to one column below 760px
- mobile menu control has localized accessible name and correct `aria-expanded`
- visible focus states are never clipped
- accent blue is not used for small low-contrast body text on white
- all landmark and heading-order issues reported by axe are corrected

- [ ] **Step 4: Run all checks and capture screenshots for visual QA**

Run:

```bash
npm run check
npm test
npm run build
npm run test:e2e
npx playwright screenshot --viewport-size=1440,1200 http://127.0.0.1:4321/ /tmp/vittorio-portfolio-desktop.png
npx playwright screenshot --viewport-size=390,844 http://127.0.0.1:4321/ /tmp/vittorio-portfolio-mobile.png
```

If the standalone screenshot commands cannot connect because the test server has stopped, run `npm run dev -- --host 127.0.0.1` in a persistent terminal and repeat them. Inspect both PNGs for clipping, unintended wrapping, broken CJK text, uneven separators, and excessive blue.

With that same local server running, execute Lighthouse 13.4.0 against the English homepage:

```bash
CHROME_PATH="$(node --input-type=module -e "import { chromium } from '@playwright/test'; console.log(chromium.executablePath())")" \
  npx lighthouse@13.4.0 http://127.0.0.1:4321/ \
  --only-categories=accessibility,seo \
  --chrome-flags='--headless --no-sandbox' \
  --output=json \
  --output-path=/tmp/vittorio-portfolio-lighthouse.json
node -e "const r=require('/tmp/vittorio-portfolio-lighthouse.json'); for (const k of ['accessibility','seo']) { if (r.categories[k].score < 0.95) throw new Error(k + ' score ' + r.categories[k].score); }"
```

Expected: all commands exit 0, both Lighthouse categories score at least 0.95, and both screenshots match the approved white/gray/deep-blue editorial direction.

- [ ] **Step 5: Commit responsive and accessibility hardening**

```bash
git add tests/portfolio.spec.ts src/components/Header.astro src/styles/global.css
git commit -m "test: verify accessible responsive portfolio"
```

---

### Task 8: Add current GitHub Pages deployment and maintenance documentation

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

- [ ] **Step 1: Create the GitHub Pages workflow**

Create `.github/workflows/deploy.yml` using the current official Astro/GitHub Pages actions:

```yaml
name: Deploy portfolio to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch: {}

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run verify

  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        with:
          node-version: 24

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Document exact maintenance workflows**

Create `README.md` with:

- purpose and live URL
- `npm install`, `npm run dev`, and `npm run verify`
- content ownership of `src/content/en.ts`, `de.ts`, and `zh.ts`
- instruction that all three locales must be updated together
- CV replacement path and stable filename
- project-link rules: PatentPATH demo only; job-agent public source
- deployment from `main` through `.github/workflows/deploy.yml`
- privacy warning that the CV is public and contains a phone number while rendered HTML must not

- [ ] **Step 3: Validate workflow syntax and full repository checks**

Run:

```bash
python -c 'import yaml; yaml.safe_load(open(".github/workflows/deploy.yml")); print("workflow YAML parsed")'
npm run verify
git diff --check
```

Expected: YAML parses, all project checks pass, and Git reports no whitespace errors.

- [ ] **Step 4: Commit deployment configuration**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "ci: deploy portfolio to GitHub Pages"
```

---

### Task 9: Publish the repository and verify the live site

**Files:**
- No source changes expected

- [ ] **Step 1: Re-run the complete local gate on the final commit**

Run:

```bash
npm ci
npx playwright install chromium
npm run verify
git diff --check
git status -sb
```

Expected: all checks exit 0 and `git status` is clean on `main`.

- [ ] **Step 2: Confirm GitHub CLI access and absence of a conflicting repository**

Run:

```bash
gh --version
gh auth status
gh repo view VittorioCai/VittorioCai.github.io
```

Expected: `gh` is authenticated as VittorioCai; the final command reports that the repository does not exist. If it exists by execution time, stop and inspect it before creating or overwriting anything.

- [ ] **Step 3: Create the public user-site repository and push `main`**

Run only after Step 2 confirms no conflict:

```bash
gh repo create VittorioCai/VittorioCai.github.io --public --source=. --remote=origin --push --description "Multilingual portfolio — business, data, supply chain analytics, and applied AI"
```

Expected: the public repository is created, `origin` points to it, and local `main` tracks `origin/main`.

- [ ] **Step 4: Enable GitHub Pages with workflow builds**

Check current state:

```bash
gh api repos/VittorioCai/VittorioCai.github.io/pages
```

If the API returns 404, enable Pages:

```bash
gh api --method POST repos/VittorioCai/VittorioCai.github.io/pages -f build_type=workflow
```

Expected: Pages reports `build_type: workflow` and the public URL.

- [ ] **Step 5: Monitor the deployment to completion**

Run:

```bash
gh run list --repo VittorioCai/VittorioCai.github.io --workflow deploy.yml --limit 1
RUN_ID="$(gh run list --repo VittorioCai/VittorioCai.github.io --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
test -n "$RUN_ID"
gh run watch "$RUN_ID" --repo VittorioCai/VittorioCai.github.io --exit-status
```

Expected: quality, build, and deploy jobs all complete successfully.

- [ ] **Step 6: Verify the remote commit and public pages**

Run:

```bash
test "$(git rev-parse HEAD)" = "$(git ls-remote origin refs/heads/main | cut -f1)"
curl -fsSL https://vittoriocai.github.io/ | rg 'Business insight|Vittorio Cai'
curl -fsSL https://vittoriocai.github.io/de/ | rg 'Geschäftsverständnis|Vittorio Cai'
curl -fsSL https://vittoriocai.github.io/zh/ | rg '理解业务|Vittorio Cai'
curl -fsI https://vittoriocai.github.io/Vittorio-Cai-CV-English.pdf | rg '200|content-type: application/pdf'
```

Expected: remote `main` equals local `HEAD`, all three homepages return their localized headline, and the CV returns HTTP 200 as a PDF. GitHub Pages propagation can take a few minutes; if the workflow is green but the first request is 404, retry the same read-only checks rather than changing code.

- [ ] **Step 7: Record the published result**

Report:

- repository URL
- live Pages URL
- final commit SHA
- `npm run verify` result
- GitHub Actions run URL and conclusion
- confirmation that all three language routes and CV download were tested live

Do not claim completion until every item has fresh evidence.
