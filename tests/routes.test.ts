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

  it('returns route-equivalent language links in locale order', () => {
    expect(getLanguageLinks('jobAgent')).toEqual([
      { locale: 'en', href: '/work/english-job-agent/' },
      { locale: 'de', href: '/de/work/english-job-agent/' },
      { locale: 'zh', href: '/zh/work/english-job-agent/' },
    ]);
  });
});
