import { describe, expect, it } from 'vitest';

import {
  getLanguageLinks,
  getLocalizedPath,
} from '../src/i18n/routes';

describe('localized routes', () => {
  it('maps the home route to each locale root', () => {
    expect(getLocalizedPath('en', 'home')).toBe('/');
    expect(getLocalizedPath('de', 'home')).toBe('/de/');
    expect(getLocalizedPath('zh', 'home')).toBe('/zh/');
  });

  it('maps the German PatentPATH case study', () => {
    expect(getLocalizedPath('de', 'patentpath')).toBe(
      '/de/work/patentpath/',
    );
  });

  it('maps the additional project case studies in every locale', () => {
    expect(getLanguageLinks('newsSentiment')).toEqual([
      { locale: 'en', href: '/work/news-sentiment/' },
      { locale: 'de', href: '/de/work/news-sentiment/' },
      { locale: 'zh', href: '/zh/work/news-sentiment/' },
    ]);
    expect(getLanguageLinks('waterQuality')).toEqual([
      { locale: 'en', href: '/work/water-quality/' },
      { locale: 'de', href: '/de/work/water-quality/' },
      { locale: 'zh', href: '/zh/work/water-quality/' },
    ]);
  });

  it('maps the section pages to each locale', () => {
    expect(getLocalizedPath('en', 'work')).toBe('/work/');
    expect(getLocalizedPath('de', 'profile')).toBe('/de/profile/');
    expect(getLocalizedPath('zh', 'contact')).toBe('/zh/contact/');
  });

  it('returns route-equivalent language links in locale order', () => {
    expect(getLanguageLinks('jobAgent')).toEqual([
      { locale: 'en', href: '/work/english-job-agent/' },
      { locale: 'de', href: '/de/work/english-job-agent/' },
      { locale: 'zh', href: '/zh/work/english-job-agent/' },
    ]);
  });
});
