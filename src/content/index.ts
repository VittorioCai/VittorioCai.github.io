import { de } from './de';
import { en } from './en';
import { locales } from './types';
import type { Locale, SiteContent } from './types';
import { zh } from './zh';
import { getSafeProjectAction } from '../utils/external-url';

export { locales };
export type { Locale, SiteContent };

type ContentRegistry = {
  [L in Locale]: SiteContent & { locale: L };
};

export const content = {
  en,
  de,
  zh,
} satisfies ContentRegistry;

export function getContent<L extends Locale>(locale: L): (typeof content)[L] {
  return content[locale];
}

for (const locale of locales) {
  if (content[locale].locale !== locale) {
    throw new Error(`Locale mismatch for content entry "${locale}".`);
  }

  for (const project of content[locale].projects) {
    const actions: SiteContent['projects'][number]['actions'] =
      project.actions;

    for (const action of ['demo', 'source'] as const) {
      if (
        actions[action] !== undefined &&
        getSafeProjectAction(actions, action) === undefined
      ) {
        throw new Error(
          `Unsafe ${action} URL for "${project.id}" in locale "${locale}".`,
        );
      }
    }
  }
}
