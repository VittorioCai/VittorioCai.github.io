import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const baseLayout = readFileSync(
  fileURLToPath(new URL('../src/layouts/BaseLayout.astro', import.meta.url)),
  'utf8',
);
const globalCss = readFileSync(
  fileURLToPath(new URL('../src/styles/global.css', import.meta.url)),
  'utf8',
);
const headerSource = readFileSync(
  fileURLToPath(new URL('../src/components/Header.astro', import.meta.url)),
  'utf8',
);

describe('editorial shell contract', () => {
  it('uses the approved LinkedIn profile URL', () => {
    expect(baseLayout).toContain('https://linkedin.com/in/vittorio-cai');
    expect(baseLayout).not.toContain('3ba0b7385');
  });

  it('keeps the exact root and body color contract', () => {
    const rootBlock = globalCss.match(/:root\s*\{([\s\S]*?)\}/)?.[1];
    const bodyBlock = globalCss.match(/body\s*\{([\s\S]*?)\}/)?.[1];

    expect(rootBlock).toContain('--muted: #666666;');
    expect(rootBlock).toContain('--paper: #ffffff;');
    expect(rootBlock).toContain(
      'font-family: Arial, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;',
    );
    expect(rootBlock).toContain('color: var(--ink);');
    expect(rootBlock).toContain('background: var(--paper);');
    expect(bodyBlock).toContain('background: var(--paper);');
  });

  it('publishes the approved component selector interface', () => {
    const requiredSelectors = [
      '.rule',
      '.external::after',
      '.hero__main',
      '.hero__summary',
      '.hero__aside',
      '.project-featured__body',
      '.project-featured__visual',
      '.case-study__rail',
      '.case-study__body',
      '.case-study__body section',
    ];

    for (const selector of requiredSelectors) {
      expect(globalCss).toContain(selector);
    }
  });

  it('removes mobile shell borders without hiding horizontal overflow', () => {
    expect(globalCss).toMatch(
      /@media \(max-width: 760px\)[\s\S]*?\.site-shell\s*\{[^}]*border-inline:\s*0;/,
    );
    expect(globalCss).not.toContain('overflow-x: hidden');
  });

  it('places the mobile menu button before its controlled primary navigation', () => {
    const menuButtonIndex = headerSource.search(
      /<button[^>]*class="menu-button"/s,
    );
    const primaryNavigationIndex = headerSource.search(
      /<nav[^>]*class="site-nav"/s,
    );

    expect(menuButtonIndex).toBeGreaterThanOrEqual(0);
    expect(primaryNavigationIndex).toBeGreaterThanOrEqual(0);
    expect(menuButtonIndex).toBeLessThan(primaryNavigationIndex);
    expect(headerSource).toContain('aria-controls="primary-navigation"');
    expect(headerSource).toContain('id="primary-navigation"');
  });

  it('gives language links practical touch targets', () => {
    const languageLinkBlock = globalCss.match(
      /\.language-nav a\s*\{([\s\S]*?)\}/,
    )?.[1];

    expect(languageLinkBlock).toContain('min-height: 44px;');
    expect(languageLinkBlock).toContain('min-width: 44px;');
    expect(languageLinkBlock).toContain('display: inline-flex;');
    expect(languageLinkBlock).toContain('align-items: center;');
    expect(languageLinkBlock).toContain('justify-content: center;');
    expect(languageLinkBlock).toContain('padding-inline:');
  });

  it('localizes primary and language navigation labels', () => {
    const labels = [
      'Primary navigation',
      'Language selection',
      'Hauptnavigation',
      'Sprachauswahl',
      '主导航',
      '语言选择',
    ];

    for (const label of labels) {
      expect(headerSource).toContain(label);
    }

    expect(headerSource).toContain('aria-label={navigationLabel.primary}');
    expect(headerSource).toContain('aria-label={navigationLabel.language}');
  });
});
