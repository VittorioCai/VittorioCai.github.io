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

interface CaseStudy {
  outcome: string;
  problem: string;
  responsibility: string;
  build: string[];
  evidence: string[];
}

export interface SiteContent {
  locale: Locale;
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
  projects: [Project, Project, Project, Project];
  profile: string;
  education: Array<{
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
  caseStudies: Record<
    'patentpath' | 'english-job-agent',
    CaseStudy
  >;
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
