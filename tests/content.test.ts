import { describe, expect, it } from 'vitest';

import { content, locales } from '../src/content';
import {
  containsGermanMobileNumber,
  syntheticGermanMobileFixtures,
  syntheticNumericIdentifier,
} from './phone-privacy';

const projectIds = [
  'patentpath',
  'english-job-agent',
  'news-sentiment',
  'water-quality',
];

describe('localized portfolio content', () => {
  it('publishes the same four projects in every supported locale', () => {
    expect(locales).toEqual(['en', 'de', 'zh']);

    const localizedIds = locales.map((locale) =>
      content[locale].projects.map((project) => project.id),
    );

    expect(localizedIds).toEqual([
      projectIds,
      projectIds,
      projectIds,
    ]);
  });

  it('states the verified PatentPATH contribution and enforces exact project actions', () => {
    const contributionTerms = {
      en: [/front/i, /database/i],
      de: [/Frontend/i, /Datenbank/i],
      zh: [/前端/, /数据库/],
    } as const;

    for (const locale of locales) {
      const patentpath = content[locale].projects.find(
        (project) => project.id === 'patentpath',
      );
      const jobAgent = content[locale].projects.find(
        (project) => project.id === 'english-job-agent',
      );
      const newsSentiment = content[locale].projects.find(
        (project) => project.id === 'news-sentiment',
      );
      const waterQuality = content[locale].projects.find(
        (project) => project.id === 'water-quality',
      );

      expect(patentpath?.contribution).toMatch(contributionTerms[locale][0]);
      expect(patentpath?.contribution).toMatch(contributionTerms[locale][1]);
      expect(patentpath?.actions).toEqual({
        demo: 'https://new-patent-path.vercel.app',
        caseStudy: true,
      });
      expect(jobAgent?.actions).toEqual({
        source: 'https://github.com/VittorioCai/english-job-agent-germany',
        caseStudy: true,
      });
      expect(newsSentiment?.actions).toEqual({});
      expect(waterQuality?.actions).toEqual({});
    }
  });

  it('localizes the news-sentiment field tags', () => {
    const localizedTags = {
      en: ['Python', 'Experimental design', 'Empirical finance'],
      de: ['Python', 'Versuchsdesign', 'Empirische Finanzforschung'],
      zh: ['Python', '实验设计', '实证金融'],
    } as const;

    for (const locale of locales) {
      const newsSentiment = content[locale].projects.find(
        (project) => project.id === 'news-sentiment',
      );

      expect(newsSentiment?.tags).toEqual(localizedTags[locale]);
    }
  });

  it('does not expose a German mobile number', () => {
    for (const fixture of syntheticGermanMobileFixtures) {
      expect(containsGermanMobileNumber(fixture)).toBe(true);
    }

    expect(containsGermanMobileNumber(syntheticNumericIdentifier)).toBe(false);
    expect(containsGermanMobileNumber(JSON.stringify(content))).toBe(false);
  });

  it('uses the reviewed German project summaries', () => {
    const jobAgent = content.de.projects.find(
      (project) => project.id === 'english-job-agent',
    );
    const waterQuality = content.de.projects.find(
      (project) => project.id === 'water-quality',
    );

    expect(jobAgent?.summary).toBe(
      'Findet und priorisiert Stellen für Studierende, die für englischsprachige Bewerber geeignet sind, kennzeichnet versteckte Anforderungen an Deutschkenntnisse und erstellt eine tägliche Übersicht.',
    );
    expect(waterQuality?.summary).toBe(
      'Ein Vergleich von sechs Modellen für die Wasserqualitätsklassifikation mit unausgeglichenen Klassen.',
    );
  });

  it('labels the English CV clearly outside the English locale', () => {
    expect(content.de.actions.cv).toContain('Englisch');
    expect(content.zh.actions.cv).toContain('英文');
  });

  it('defines the localized Florence to Wenzhou to Heilbronn journey', () => {
    expect(content.en.profileRail.journeyStops).toEqual([
      'Florence',
      'Wenzhou',
      'Heilbronn',
    ]);

    for (const locale of locales) {
      const profileRail = content[locale].profileRail;

      expect(profileRail.role).toBeTruthy();
      expect(profileRail.currentLocation).toBeTruthy();
      expect(profileRail.journeyHeading).toBeTruthy();
      expect(profileRail.linksHeading).toBeTruthy();
      expect(profileRail.journeyStops).toHaveLength(3);
    }
  });

  it('maps each verified education entry to a school identity', () => {
    for (const locale of locales) {
      expect(
        content[locale].education.map((entry) => entry.institution),
      ).toEqual(['tum', 'wzu']);
    }
  });

  it('owns homepage supporting labels in the typed content registry', () => {
    expect(content.en.sections.languages).toBe('Languages');
    expect(content.de.sections.languages).toBe('Sprachen');
    expect(content.zh.sections.languages).toBe('语言');

    expect(content.en.visuals.jobAgentStages).toEqual([
      'Public ATS feeds',
      'Language check',
      'Ranked digest',
    ]);
    expect(content.de.visuals.jobAgentStages).toEqual([
      'Öffentliche ATS-Feeds',
      'Sprachprüfung',
      'Priorisierte Übersicht',
    ]);
    expect(content.zh.visuals.jobAgentStages).toEqual([
      '公开 ATS 数据源',
      '语言要求判断',
      '岗位优先级摘要',
    ]);
  });

  it('owns the complete case-study label set in every locale', () => {
    expect(content.en.caseStudyLabels).toEqual({
      problem: 'The problem',
      responsibility: 'My responsibility',
      build: 'What I built',
      evidence: 'Evidence & results',
      backToWork: 'Back to selected work',
      nextProject: 'Next project',
    });
    expect(content.de.caseStudyLabels).toEqual({
      problem: 'Die Herausforderung',
      responsibility: 'Meine Verantwortung',
      build: 'Was ich umgesetzt habe',
      evidence: 'Belege & Ergebnisse',
      backToWork: 'Zurück zu den Projekten',
      nextProject: 'Nächstes Projekt',
    });
    expect(content.zh.caseStudyLabels).toEqual({
      problem: '问题',
      responsibility: '我的职责',
      build: '实现内容',
      evidence: '依据与结果',
      backToWork: '返回代表项目',
      nextProject: '下一个项目',
    });

    for (const locale of locales) {
      expect(Object.keys(content[locale].caseStudyLabels)).toEqual([
        'problem',
        'responsibility',
        'build',
        'evidence',
        'backToWork',
        'nextProject',
      ]);
    }
  });
});
