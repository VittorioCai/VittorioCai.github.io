import { locales } from '../content';
import type { Locale } from '../content';

export type RouteKey = 'home' | 'patentpath' | 'jobAgent';

const routeSuffixes = {
  home: '',
  patentpath: 'work/patentpath',
  jobAgent: 'work/english-job-agent',
} satisfies Record<RouteKey, string>;

export function getLocalizedPath(
  locale: Locale,
  route: RouteKey,
): string {
  const localePrefix = locale === 'en' ? '' : `${locale}/`;
  const suffix = routeSuffixes[route];

  return `/${localePrefix}${suffix}${suffix ? '/' : ''}`;
}

export function getLanguageLinks(route: RouteKey) {
  return locales.map((locale) => ({
    locale,
    href: getLocalizedPath(locale, route),
  }));
}
