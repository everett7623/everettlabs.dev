import { describe, expect, it } from 'vitest';
import { renderProjectOpenGraphImage, wrapText } from '../scripts/og-image.ts';

describe('project Open Graph image generation', () => {
  it('renders a 1200 by 630 local SVG with project metadata', () => {
    const image = renderProjectOpenGraphImage({
      name: 'Linketry',
      slug: 'linketry',
      projectType: 'edge-application',
      summary: 'Self-hosted link management built for reliable redirects.',
      accent: 'violet',
    });

    expect(image).toContain('width="1200" height="630"');
    expect(image).toContain('Linketry — Everett Labs');
    expect(image).toContain('#8b5cf6');
    expect(image).toContain('everettlabs.dev/projects/linketry');
  });

  it('escapes untrusted frontmatter before writing XML', () => {
    const image = renderProjectOpenGraphImage({
      name: '<Project & Lab>',
      slug: 'safe-project',
      projectType: 'web-application',
      summary: 'Useful < reliable & open.',
    });

    expect(image).not.toContain('<Project & Lab>');
    expect(image).toContain('&lt;Project &amp; Lab&gt;');
  });

  it('wraps descriptions without exceeding the configured line length', () => {
    const lines = wrapText(
      'A practical browser-based toolkit for international operations and logistics.',
      32,
    );

    expect(lines.length).toBeGreaterThan(1);
    expect(lines.every((line) => line.length <= 32)).toBe(true);
  });
});
