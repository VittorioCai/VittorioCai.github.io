import { describe, expect, it } from 'vitest';

import {
  getSafeExternalUrl,
  getSafeProjectAction,
} from '../src/utils/external-url';

describe('external project action URL boundary', () => {
  it('preserves valid HTTP and HTTPS project links exactly', () => {
    expect(getSafeExternalUrl('https://new-patent-path.vercel.app')).toBe(
      'https://new-patent-path.vercel.app',
    );
    expect(getSafeExternalUrl('http://example.com/work')).toBe(
      'http://example.com/work',
    );
    expect(getSafeExternalUrl('HTTPS://example.com/work')).toBe(
      'HTTPS://example.com/work',
    );
  });

  it('rejects empty, relative, malformed, and non-HTTP project links', () => {
    const unsafeValues = [
      undefined,
      '',
      ' ',
      '/work',
      '//example.com/work',
      'https://',
      'https:///path',
      'http:example.com',
      'https:example.com',
      ' https://example.com',
      'https://example.com\n@evil.com',
      'https://example.com\r@evil.com',
      'https://example.com\t@evil.com',
      'https://example.com/\0private',
      'https://example.com/\u007fprivate',
      'https://user:password@example.com/work',
      'javascript:alert(1)',
      'data:text/html,unsafe',
      'file:///tmp/private',
      'mailto:vittorio.cai@tum.de',
      'ftp://example.com/file',
      'httpsx://example.com',
    ];

    for (const value of unsafeValues) {
      expect(getSafeExternalUrl(value), String(value)).toBeUndefined();
    }
  });

  it('filters an injected project action before rendering', () => {
    expect(
      getSafeProjectAction(
        { demo: 'https://new-patent-path.vercel.app' },
        'demo',
      ),
    ).toBe('https://new-patent-path.vercel.app');
    expect(
      getSafeProjectAction({ source: 'data:text/html,unsafe' }, 'source'),
    ).toBeUndefined();
    expect(getSafeProjectAction({}, 'source')).toBeUndefined();
  });
});
