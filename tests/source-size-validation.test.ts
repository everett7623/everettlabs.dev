import { describe, expect, it } from 'vitest';
import { countSubstantiveLines, validateSourceSizes } from '../scripts/source-size-validation.ts';

describe('source size validation', () => {
  it('ignores blank and pure comment lines', () => {
    const source = `
      // line comment
      /* block
       * comment */
      const enabled = true;
      <!-- template comment -->
      <main>{enabled}</main>
    `;

    expect(countSubstantiveLines(source)).toBe(2);
  });

  it('applies component and TypeScript limits', () => {
    const issues = validateSourceSizes([
      { file: 'src/Large.tsx', content: 'const value = 1;\n'.repeat(201) },
      { file: 'scripts/large.ts', content: 'const value = 1;\n'.repeat(301) },
    ]);

    expect(issues).toEqual([
      { file: 'src/Large.tsx', lines: 201, limit: 200 },
      { file: 'scripts/large.ts', lines: 301, limit: 300 },
    ]);
  });

  it('ignores unsupported files and accepts sources at the limit', () => {
    expect(
      validateSourceSizes([
        { file: 'README.md', content: 'text\n'.repeat(500) },
        { file: 'src/Page.astro', content: '<div />\n'.repeat(200) },
      ]),
    ).toEqual([]);
  });
});
