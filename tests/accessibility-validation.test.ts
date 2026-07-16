import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  validateGlobalAccessibilityStyles,
  validateMarkupAccessibility,
  validateThemeContrastStyles,
} from '../scripts/accessibility-validation.ts';

describe('static accessibility validation', () => {
  it('accepts accessible interactive markup', () => {
    const source = `
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>
      <img src="/image.webp" alt="Project preview" />
      <button type="button">Open</button>
      <input onChange={(event) => update(event.target.value)} aria-label="Search" />
    `;
    expect(validateMarkupAccessibility(source, 'sample.astro')).toEqual([]);
  });

  it('reports unsafe external links and missing element attributes', () => {
    const source = `
      <a href="https://example.com" target="_blank">Link</a>
      <img src="/image.webp" />
      <button>Open</button>
      <input />
    `;
    const messages = validateMarkupAccessibility(source, 'sample.astro').map(
      (issue) => issue.message,
    );

    expect(messages).toContain('External target=_blank links require noopener noreferrer.');
    expect(messages).toContain('Images require an alt attribute.');
    expect(messages).toContain('Buttons require an explicit type attribute.');
    expect(messages).toContain('Inputs require an accessible label or id.');
  });

  it('rejects removal of visible focus outlines', () => {
    const source = '<input aria-label="Search" class="outline-none" />';
    expect(validateMarkupAccessibility(source, 'sample.tsx')[0]?.message).toBe(
      'Do not remove focus outlines without a visible replacement.',
    );
  });

  it('requires global focus and reduced-motion styles', () => {
    expect(validateGlobalAccessibilityStyles('body {}', 'global.css')).toHaveLength(2);

    const globalCss = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf-8');
    expect(validateGlobalAccessibilityStyles(globalCss, 'global.css')).toEqual([]);
  });

  it('requires accessible contrast for muted text, primary actions, and badges', () => {
    const globalCss = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf-8');
    expect(validateThemeContrastStyles(globalCss, 'global.css')).toEqual([]);

    const inaccessibleCss = globalCss
      .replace('--color-text-muted: #7b8794;', '--color-text-muted: #65707c;')
      .replace('--color-accent-violet: #7c3aed;', '--color-accent-violet: #8b5cf6;')
      .replace('--color-accent-violet-text: #a78bfa;', '--color-accent-violet-text: #8b5cf6;');
    expect(validateThemeContrastStyles(inaccessibleCss, 'global.css').length).toBeGreaterThan(0);
  });
});
