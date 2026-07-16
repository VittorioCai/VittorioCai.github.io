import type { SiteContent } from './types';

export const de = {
  locale: 'de',
  meta: {
    title: 'Vittorio Cai — Wirtschaft, Daten & angewandte KI',
    description:
      'TUM-MMDT-Student mit Finance-Hintergrund, der nützliche Analyse- und KI-Produkte für reale Geschäftsprobleme entwickelt.',
  },
  nav: {
    work: 'Projekte',
    profile: 'Profil',
    experience: 'Erfahrung',
    contact: 'Kontakt',
    menu: 'Menü',
  },
  hero: {
    eyebrow: 'TUM MMDT · Heilbronn, Deutschland',
    lines: ['Geschäftsverständnis.', 'Datendisziplin.', 'Nützliche KI.'],
    summary:
      'Mit einem Hintergrund im Finanzmanagement studiere ich heute Management and Digital Technology an der TUM. Ich verbinde betriebswirtschaftliche Fragestellungen mit Datenanalyse, Machine Learning und Softwareentwicklung und überführe die Ergebnisse in praktisch nutzbare Lösungen.',
    availabilityLabel: 'Aktuell',
    availability:
      'Offen für Werkstudentenstellen (bis zu 20 Std./Woche) und Praktika in Deutschland.',
    focusLabel: 'Schwerpunkte',
    focus: [
      'Daten & Business Intelligence',
      'Supply Chain Analytics',
      'Angewandte KI',
    ],
  },
  actions: {
    viewProjects: 'Projekte ansehen',
    allProjects: 'Alle Projekte',
    cv: 'CV herunterladen (Englisch)',
    demo: 'Live-Demo',
    source: 'GitHub',
    caseStudy: 'Projektbericht',
    email: 'E-Mail senden',
  },
  pageMeta: {
    work: {
      title: 'Projekte — Vittorio Cai',
      description:
        'Ausgewählte Projekte zu Daten, Analytics und angewandter KI von Vittorio Cai.',
    },
    profile: {
      title: 'Profil & Erfahrung — Vittorio Cai',
      description:
        'Ausbildung, Erfahrung, Kenntnisse und Sprachen von Vittorio Cai.',
    },
    contact: {
      title: 'Kontakt — Vittorio Cai',
      description:
        'Kontakt zu Vittorio Cai für Werkstudentenstellen und Praktika in Deutschland.',
    },
  },
  sections: {
    work: 'Ausgewählte Projekte',
    profile: 'Profil & Ausbildung',
    experience: 'Erfahrung',
    skills: 'Kenntnisse & Sprachen',
    languages: 'Sprachen',
    contact: 'Kontakt',
    contribution: 'Mein Beitrag',
  },
  visuals: {
    jobAgentStages: [
      'Öffentliche ATS-Feeds',
      'Sprachprüfung',
      'Priorisierte Übersicht',
    ],
  },
  profileRail: {
    role: 'Business × Daten × angewandte KI',
    currentLocation: 'In Heilbronn, Deutschland',
    journeyHeading: 'Stationen',
    linksHeading: 'Berufliche Profile',
    journeyStops: ['Florenz', 'Wenzhou', 'Heilbronn'],
  },
  projects: [
    {
      id: 'patentpath',
      kicker: 'Hauptprojekt · TUM × Fuyao',
      title: 'PatentPATH',
      summary:
        'Ein KI-gestütztes Produkt zum Patent-Screening: Aus einer frei formulierten Designbeschreibung entstehen Überschneidungsbefunde auf Anspruchsebene samt Design-around-Vorschlägen.',
      contribution:
        'Verantwortlich für das PostgreSQL/pgvector-Datenbankmodul und das Web-Frontend; Integration der Team-Pipeline in das produktiv bereitgestellte Produkt.',
      details: [
        'Strukturierte Speicherung von Patentkorpus und Embeddings für die semantische Suche.',
        'Eine nutzerorientierte Anwendung, die technische Analysen für nichttechnische Entscheidungen zugänglich macht.',
      ],
      tags: ['Frontend', 'PostgreSQL', 'pgvector'],
      actions: {
        demo: 'https://new-patent-path.vercel.app',
        caseStudy: true,
      },
    },
    {
      id: 'english-job-agent',
      kicker: 'Open Source',
      title: 'English Job Agent for Germany',
      summary:
        'Findet und priorisiert Stellen für Studierende, die für englischsprachige Bewerber geeignet sind, kennzeichnet versteckte Anforderungen an Deutschkenntnisse und erstellt eine tägliche Übersicht.',
      details: [
        'Öffentliche ATS-Feeds mit quellübergreifender Deduplizierung.',
        'LLM-basierte Belege und Warnhinweise bei begrenztem Betriebsbudget.',
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
        'Ein kontrolliertes Prompt-Experiment mit etwa 59.000 Firm-Day-Beobachtungen.',
      contribution:
        'Gemeinsame Entwicklung der Nachrichtenbeschaffung, des Firm-Day-Panels und der Datenzusammenführung.',
      details: [
        'Vergleich mehrerer Prompt-Bedingungen in einem kontrollierten experimentellen Design.',
        'Validierung der Portfolioergebnisse mit Fama-French-Faktoren.',
      ],
      tags: ['Python', 'Versuchsdesign', 'Empirische Finanzforschung'],
      actions: {},
    },
    {
      id: 'water-quality',
      kicker: 'Machine Learning',
      title: 'Water Quality Prediction',
      summary:
        'Ein Vergleich von sechs Modellen für die Wasserqualitätsklassifikation mit unausgeglichenen Klassen.',
      contribution:
        'Implementierung und Abstimmung von SVM und AdaBoost sowie Mitwirkung an der modellübergreifenden Evaluation.',
      details: [
        'Stratifizierte k-fold-Kreuzvalidierung.',
        'Vergleich von F1, PR-AUC und ROC-AUC über alle Modelle hinweg.',
      ],
      tags: ['scikit-learn', 'SVM', 'AdaBoost'],
      actions: {},
    },
  ],
  profile:
    'Mein fachlicher Ausgangspunkt ist das Finanzmanagement. Heute studiere ich Management and Digital Technology an der TUM — diese Kombination erlaubt mir, Zahlen zu verstehen, sie zu hinterfragen und die Software zu bauen, die daraus Entscheidungen macht.',
  education: [
    {
      institution: 'tum',
      school: 'Technical University of Munich (TUM)',
      degree: 'M.Sc. Management and Digital Technology',
      period: '2025–heute',
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
      role: 'Praktikant im Finanzbereich',
      period: '2024–2025',
      bullets: [
        'Erstellung von Dashboards für mehr als 50 Unternehmen.',
        'Identifikation von zwei Kostenineffizienzen durch Finanzanalysen.',
      ],
    },
    {
      organization: 'Ruian Tongyan Embroidery',
      role: 'Praktikant im Rechnungswesen',
      period: '2024',
      bullets: [
        'Automatisierung der Lohnberechnung mit einer Zeitersparnis von mehr als 10 Stunden pro Monat.',
        'Aufbau einer Tracking-Datenbank für den Einkauf.',
      ],
    },
  ],
  skillGroups: [
    {
      title: 'Daten',
      items: ['Python', 'SQL', 'PostgreSQL', 'R', 'SPSS', 'Excel/VBA'],
    },
    {
      title: 'Machine Learning & Produktentwicklung',
      items: [
        'scikit-learn',
        'PyTorch (in Arbeit)',
        'pgvector',
        'Git/GitHub',
      ],
    },
    {
      title: 'Reporting',
      items: ['Interaktive Dashboards', 'Matplotlib', 'Microsoft 365'],
    },
  ],
  languages: [
    'Mandarin · Muttersprache',
    'Englisch · C1',
    'Deutsch · A1 (aktiv lernend)',
  ],
  caseStudies: {
    patentpath: {
      outcome:
        'Patentanalyse wurde in einen Arbeitsablauf übersetzt, auf dessen Grundlage nichttechnische Nutzer handeln können.',
      problem:
        'Bei einem umfangreichen Patentkorpus für HUD-Windschutzscheiben ist das potenzielle Überschneidungsrisiko einer neuen Designbeschreibung schwer zu beurteilen.',
      responsibility:
        'Innerhalb des Teamprojekts verantwortete ich das PostgreSQL/pgvector-Datenbankmodul und das Web-Frontend und integrierte die Extraktions- und Screening-Pipeline des Teams in das produktiv bereitgestellte Produkt.',
      build: [
        'Strukturierung von Patenttexten und Embeddings für die semantische Suche.',
        'Entwicklung der Oberfläche von der Designeingabe bis zu Überschneidungsbefunden auf Anspruchsebene und Design-around-Vorschlägen.',
        'Gestaltung eines klaren Nutzerflusses für eine technisch komplexe Analyse.',
        'Deployment und Betrieb des Produkts: Vercel-Frontend, FastAPI-Backend, Neon Postgres.',
      ],
      evidence: [
        'Öffentlich zugängliche Live-Demo.',
        'Teamprojekt mit Fuyao im Rahmen des TUM GenAI Project.',
      ],
    },
    'english-job-agent': {
      outcome:
        'Erstellt eine tägliche Auswahlliste und ersetzt wiederholte manuelle Suchen.',
      problem:
        'Englische Stellenbeschreibungen können dennoch versteckte Anforderungen an Deutschkenntnisse enthalten.',
      responsibility:
        'Ich habe die Open-Source-Pipeline entwickelt und betreue sie einschließlich des Betriebs über GitHub Actions.',
      build: [
        'Erfasst Stellen aus öffentlichen ATS-Feeds.',
        'Kombiniert Regeln und LLM-Bewertungen zur Beurteilung der Sprachanforderungen.',
        'Dedupliziert Ergebnisse und versendet täglich eine Übersicht mit Belegen.',
      ],
      evidence: [
        'Öffentliches Repository unter der MIT-Lizenz.',
        'Automatisierte Tests und tägliche Ausführung über GitHub Actions.',
      ],
    },
  },
  caseStudyLabels: {
    problem: 'Die Herausforderung',
    responsibility: 'Meine Verantwortung',
    build: 'Was ich umgesetzt habe',
    evidence: 'Belege & Ergebnisse',
    backToWork: 'Zurück zu den Projekten',
    nextProject: 'Nächstes Projekt',
  },
  footer: 'Entwickelt in Heilbronn. Gestaltet für Klarheit.',
} satisfies SiteContent;
