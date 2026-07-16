import type { SiteContent } from './types';

export const en = {
  locale: 'en',
  meta: {
    title: 'Vittorio Cai — Business, Data & Applied AI',
    description:
      'Finance-trained TUM MMDT student building useful analytics and AI products for real business problems.',
  },
  nav: {
    work: 'Work',
    profile: 'Profile',
    experience: 'Experience',
    contact: 'Contact',
    menu: 'Menu',
  },
  hero: {
    eyebrow: 'TUM MMDT · Heilbronn, Germany',
    lines: ['Business insight.', 'Data discipline.', 'Useful AI.'],
    summary:
      'Trained in finance, now studying Management and Digital Technology at TUM — I connect business questions with analytics, machine learning and software, then turn the result into something people can actually use.',
    availabilityLabel: 'Currently',
    availability:
      'Open to working student roles (up to 20 h/week) and internships in Germany.',
    focusLabel: 'Focus fields',
    focus: [
      'Data & Business Intelligence',
      'Supply Chain Analytics',
      'Applied AI',
    ],
  },
  actions: {
    viewProjects: 'View projects',
    allProjects: 'All projects',
    cv: 'Download CV',
    demo: 'Live demo',
    source: 'GitHub',
    caseStudy: 'Case study',
    email: 'Email me',
  },
  pageMeta: {
    work: {
      title: 'Projects — Vittorio Cai',
      description:
        'Selected data, analytics and applied AI projects by Vittorio Cai.',
    },
    profile: {
      title: 'Profile & experience — Vittorio Cai',
      description:
        'Education, experience, skills and languages of Vittorio Cai.',
    },
    contact: {
      title: 'Contact — Vittorio Cai',
      description:
        'Get in touch with Vittorio Cai for working student and internship opportunities in Germany.',
    },
  },
  sections: {
    work: 'Selected work',
    profile: 'Profile & education',
    experience: 'Experience',
    skills: 'Skills & languages',
    languages: 'Languages',
    contact: "Let's talk",
    contribution: 'My contribution',
  },
  visuals: {
    jobAgentStages: [
      'Public ATS feeds',
      'Language check',
      'Ranked digest',
    ],
  },
  profileRail: {
    role: 'Business × Data × Applied AI',
    currentLocation: 'Based in Heilbronn, Germany',
    journeyHeading: 'Journey',
    linksHeading: 'Professional links',
    journeyStops: ['Florence', 'Wenzhou', 'Heilbronn'],
  },
  projects: [
    {
      id: 'patentpath',
      kicker: 'Featured · TUM × Fuyao',
      title: 'PatentPATH',
      summary:
        'An AI-assisted patent screening product that turns a plain-language design description into claim-level overlap findings and design-around suggestions.',
      demoNote: 'Free-tier backend — first load may take up to 40 s to wake.',
      contribution:
        "Owned the PostgreSQL/pgvector database module and the web frontend, and integrated the team's extraction and screening pipeline into the deployed product.",
      details: [
        'Structured patent corpus and embedding storage for semantic search.',
        'A user-facing workflow that makes technical analysis useful for nontechnical decisions.',
      ],
      tags: ['Frontend', 'PostgreSQL', 'pgvector', 'FastAPI'],
      actions: {
        demo: 'https://new-patent-path.vercel.app',
        caseStudy: true,
      },
    },
    {
      id: 'english-job-agent',
      kicker: 'Open source',
      title: 'English Job Agent for Germany',
      summary:
        'Finds and ranks English-friendly student jobs, flags hidden German requirements and delivers a daily digest.',
      details: [
        'Public ATS feeds with cross-source deduplication.',
        'LLM-based evidence and red flags with a capped operating budget.',
      ],
      tags: ['Python', 'LLM', 'GitHub Actions'],
      actions: {
        source:
          'https://github.com/VittorioCai/english-job-agent-germany',
        caseStudy: true,
      },
    },
    {
      id: 'news-sentiment',
      kicker: 'TUM Campus Challenge',
      title: 'LLM News-Sentiment & Portfolio Study',
      summary:
        'A controlled prompt experiment across about 59,000 firm-day observations.',
      contribution:
        'Co-built the news sourcing, firm-day panel and data-merging pipeline.',
      details: [
        'Compared prompt conditions through a controlled experimental design.',
        'Validated portfolio results with Fama-French factors.',
      ],
      tags: ['Python', 'Experimental design', 'Empirical finance'],
      actions: { caseStudy: true },
    },
    {
      id: 'water-quality',
      kicker: 'Machine learning',
      title: 'Water Quality Prediction',
      summary:
        'A six-model benchmark for an imbalanced water-quality prediction problem.',
      contribution:
        'Implemented and tuned SVM and AdaBoost, then contributed to the cross-model evaluation.',
      details: [
        'Used stratified k-fold cross-validation.',
        'Compared F1, PR-AUC and ROC-AUC across models.',
      ],
      tags: ['scikit-learn', 'SVM', 'AdaBoost'],
      actions: { caseStudy: true },
    },
  ],
  profile:
    'I started in financial management and now study Management and Digital Technology at TUM. That combination lets me read the numbers, question them, and build the software that acts on them.',
  education: [
    {
      institution: 'tum',
      school: 'Technical University of Munich (TUM)',
      degree: 'M.Sc. Management and Digital Technology',
      period: '2025–present',
      location: 'Heilbronn',
    },
    {
      institution: 'wzu',
      school: 'Wenzhou University',
      degree: 'B.A. Financial Management',
      period: '2021–2025',
      location: 'Wenzhou',
    },
  ],
  experience: [
    {
      organization: 'Ruian Municipal Bureau of Commerce',
      role: 'Finance Intern',
      period: '2024–2025',
      bullets: [
        'Built dashboards covering 50+ enterprises.',
        'Identified two cost inefficiencies through financial analysis.',
      ],
    },
    {
      organization: 'Ruian Tongyan Embroidery',
      role: 'Accountant Intern',
      period: '2024',
      bullets: [
        'Automated wage calculations, saving 10+ hours per month.',
        'Built a tracking database for procurement.',
      ],
    },
  ],
  skillGroups: [
    {
      title: 'Data',
      items: ['Python', 'SQL', 'PostgreSQL', 'R', 'SPSS', 'Excel/VBA'],
    },
    {
      title: 'Machine learning & product',
      items: [
        'scikit-learn',
        'PyTorch (in progress)',
        'pgvector',
        'Git/GitHub',
      ],
    },
    {
      title: 'Reporting',
      items: ['Interactive dashboards', 'Matplotlib', 'Microsoft 365'],
    },
  ],
  languages: ['Mandarin · Native', 'English · C1', 'German · A1 (improving)'],
  caseStudies: {
    patentpath: {
      outcome:
        'Translated patent analysis into a workflow that nontechnical users can act on.',
      problem:
        'A large HUD windshield patent corpus makes potential overlap risk difficult to assess from a new design description.',
      responsibility:
        "Within the team project, I owned the PostgreSQL/pgvector database module and the web frontend, and integrated the team's extraction and screening pipeline into the deployed product.",
      build: [
        'Structured patent text and embeddings for semantic retrieval.',
        'Built the interface from design input to claim-level overlap findings and design-around suggestions.',
        'Created a clear user flow for a technically complex analysis.',
        'Deployed and operated the product: Vercel frontend, FastAPI backend, Neon Postgres.',
      ],
      evidence: [
        'Public live demo.',
        'Team project with Fuyao through the TUM GenAI Project.',
      ],
    },
    'english-job-agent': {
      outcome:
        'Produces a daily shortlist instead of requiring repeated manual searches.',
      problem:
        'English job descriptions can still contain hidden German-language requirements.',
      responsibility:
        'I developed and maintain the open-source pipeline and its operation through GitHub Actions.',
      build: [
        'Collects roles from public ATS feeds.',
        'Combines rules and LLM judgment to assess language requirements.',
        'Deduplicates results and sends a daily digest with evidence.',
      ],
      evidence: [
        'Public repository under the MIT license.',
        'Automated tests and daily GitHub Actions runs.',
      ],
    },
    'news-sentiment': {
      outcome:
        'Tested prompt design against downstream portfolio evidence in one controlled workflow.',
      problem:
        'Prompt conditions need to be held apart from data preparation and financial validation to make sentiment results comparable.',
      responsibility:
        'I co-built the news sourcing, firm-day panel and data-merging pipeline.',
      build: [
        'Built a firm-day panel covering about 59,000 observations.',
        'Compared prompt conditions through a controlled experimental design.',
        'Validated portfolio results with Fama-French factors.',
      ],
      evidence: [
        'Controlled prompt experiment across about 59,000 firm-day observations.',
        'Portfolio results evaluated with Fama-French factors.',
      ],
    },
    'water-quality': {
      outcome:
        'Compared six classifiers with an evaluation setup designed for imbalanced water-quality data.',
      problem:
        'Class imbalance makes accuracy alone insufficient for comparing water-quality classifiers.',
      responsibility:
        'I implemented and tuned SVM and AdaBoost, then contributed to the cross-model evaluation.',
      build: [
        'Used stratified k-fold cross-validation.',
        'Implemented and tuned SVM and AdaBoost.',
        'Compared F1, PR-AUC and ROC-AUC across models.',
      ],
      evidence: [
        'Six-model benchmark.',
        'Evaluation with F1, PR-AUC and ROC-AUC.',
      ],
    },
  },
  caseStudyLabels: {
    problem: 'The problem',
    responsibility: 'My responsibility',
    build: 'What I built',
    evidence: 'Evidence & results',
    backToWork: 'Back to selected work',
    nextProject: 'Next project',
  },
  footer: 'Built in Heilbronn. Designed for clarity.',
} satisfies SiteContent;
