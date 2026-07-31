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
  demoNote?: string;
  contribution?: string;
  details: string[];
  tags: string[];
  actions: {
    demo?: string;
    source?: string;
    caseStudy?: boolean;
  };
}

interface CaseStudy {
  outcome: string;
  problem: string;
  responsibility: string;
  build: string[];
  evidence: string[];
}

interface PatentPathStoryStep {
  title: string;
  description: string;
}

interface PatentPathScreenshot {
  src: string;
  alt: string;
  caption: string;
  width: 1440;
  height: 960;
}

interface PatentPathStory {
  context: string;
  workflowHeading: string;
  workflow: [
    PatentPathStoryStep,
    PatentPathStoryStep,
    PatentPathStoryStep,
    PatentPathStoryStep,
  ];
  differentiatorsHeading: string;
  differentiators: [string, string, string, string];
  architectureHeading: string;
  architecture: [string, string, string, string, string];
  screenshots: {
    overview: PatentPathScreenshot;
    patents: PatentPathScreenshot;
    riskCheck: PatentPathScreenshot;
  };
  disclaimer: string;
}

export interface SiteContent {
  locale: Locale;
  displayName: string;
  meta: {
    title: string;
    description: string;
  };
  nav: {
    work: string;
    profile: string;
    experience: string;
    contact: string;
    menu: string;
  };
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
    allProjects: string;
    cv: string;
    demo: string;
    source: string;
    caseStudy: string;
    email: string;
  };
  pageMeta: {
    work: { title: string; description: string };
    profile: { title: string; description: string };
    contact: { title: string; description: string };
  };
  sections: {
    work: string;
    profile: string;
    experience: string;
    skills: string;
    languages: string;
    contact: string;
    contribution: string;
  };
  visuals: {
    jobAgentStages: [string, string, string];
  };
  profileRail: {
    role: string;
    currentLocation: string;
    journeyHeading: string;
    linksHeading: string;
    journeyStops: [string, string, string];
  };
  projects: [Project, Project, Project, Project];
  profile: string;
  education: Array<{
    institution: 'tum' | 'wzu';
    school: string;
    degree: string;
    period: string;
    location: string;
  }>;
  experience: Array<{
    organization: string;
    role: string;
    period: string;
    bullets: string[];
  }>;
  skillGroups: Array<{
    title: string;
    items: string[];
  }>;
  languages: string[];
  caseStudies: {
    patentpath: CaseStudy & { story: PatentPathStory };
    'english-job-agent': CaseStudy;
    'news-sentiment': CaseStudy;
    'water-quality': CaseStudy;
  };
  caseStudyLabels: {
    problem: string;
    responsibility: string;
    build: string;
    evidence: string;
    backToWork: string;
    nextProject: string;
  };
  footer: string;
}
