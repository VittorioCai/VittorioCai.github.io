import type { Locale } from '../content';
import type { ProjectId } from '../content/types';
import { getLocalizedPath } from '../i18n/routes';

const projectRoutes = {
  patentpath: 'patentpath',
  'english-job-agent': 'jobAgent',
  'news-sentiment': 'newsSentiment',
  'water-quality': 'waterQuality',
} as const;

export function getProjectCaseStudyPath(
  locale: Locale,
  projectId: ProjectId,
): string {
  return getLocalizedPath(locale, projectRoutes[projectId]);
}
