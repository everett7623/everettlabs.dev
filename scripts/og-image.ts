export type ProjectAccent = 'violet' | 'cyan' | 'green';

export interface ProjectOpenGraphData {
  name: string;
  slug: string;
  projectType: string;
  summary: string;
  accent?: ProjectAccent;
}

const accentColors: Record<ProjectAccent, string> = {
  violet: '#8b5cf6',
  cyan: '#22d3ee',
  green: '#7ee787',
};

export function renderProjectOpenGraphImage(project: ProjectOpenGraphData): string {
  const accent = accentColors[project.accent ?? 'cyan'];
  const summaryLines = wrapText(project.summary, 58).slice(0, 3);
  const summary = summaryLines
    .map((line, index) => `<tspan x="100" dy="${index === 0 ? 0 : 40}">${escapeXml(line)}</tspan>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(project.name)} — Everett Labs</title>
  <desc id="description">${escapeXml(project.summary)}</desc>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#07080a"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="80" y="76" width="6" height="478" rx="3" fill="${accent}"/>
  <text x="100" y="126" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" fill="${accent}" letter-spacing="4">EVERETT LABS / PROJECT</text>
  <text x="100" y="190" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" fill="#65707c" letter-spacing="2">${escapeXml(project.projectType.replaceAll('-', ' ').toUpperCase())}</text>
  <text x="100" y="300" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="72" font-weight="700" fill="#f2f5f7">${escapeXml(project.name)}</text>
  <text x="100" y="374" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="28" fill="#9aa4af">${summary}</text>
  <line x1="100" y1="500" x2="1100" y2="500" stroke="${accent}" stroke-opacity="0.35" stroke-width="2"/>
  <text x="100" y="552" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" fill="#65707c">everettlabs.dev/projects/${escapeXml(project.slug)}</text>
</svg>
`;
}

export function wrapText(text: string, maxLength: number): string[] {
  return text.split(/\s+/).reduce<string[]>((lines, word) => {
    const current = lines.at(-1);
    if (!current || current.length + word.length + 1 > maxLength) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
    return lines;
  }, []);
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
