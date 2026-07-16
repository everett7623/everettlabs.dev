export interface AccessibilityIssue {
  file: string;
  message: string;
}

export function validateMarkupAccessibility(source: string, file: string): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  for (const tag of extractOpeningTags(source, 'a')) {
    if (/target=["']_blank["']/i.test(tag)) {
      const rel = tag.match(/rel=["']([^"']+)["']/i)?.[1] ?? '';
      if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
        issues.push({ file, message: 'External target=_blank links require noopener noreferrer.' });
      }
    }
  }

  for (const tag of extractOpeningTags(source, 'img')) {
    if (!/\balt\s*=/i.test(tag)) {
      issues.push({ file, message: 'Images require an alt attribute.' });
    }
  }

  for (const tag of extractOpeningTags(source, 'button')) {
    if (!/\btype\s*=/i.test(tag)) {
      issues.push({ file, message: 'Buttons require an explicit type attribute.' });
    }
  }

  for (const tag of extractOpeningTags(source, 'input')) {
    if (!/\baria-label\s*=|\bid\s*=/i.test(tag)) {
      issues.push({ file, message: 'Inputs require an accessible label or id.' });
    }
  }

  for (const match of source.matchAll(/(?:class|className)=["']([^"']*)["']/gis)) {
    const classes = match[1].split(/\s+/);
    if (classes.includes('outline-none')) {
      issues.push({ file, message: 'Do not remove focus outlines without a visible replacement.' });
    }
  }

  return issues;
}

function extractOpeningTags(source: string, tagName: string): string[] {
  const tags: string[] = [];
  const startPattern = new RegExp(`<${tagName}\\b`, 'gi');

  for (const match of source.matchAll(startPattern)) {
    const start = match.index ?? 0;
    let quote: '"' | "'" | '`' | null = null;
    let braceDepth = 0;

    for (let index = start; index < source.length; index += 1) {
      const character = source[index];
      const previous = source[index - 1];

      if (quote) {
        if (character === quote && previous !== '\\') quote = null;
        continue;
      }
      if (character === '"' || character === "'" || character === '`') {
        quote = character;
      } else if (character === '{') {
        braceDepth += 1;
      } else if (character === '}') {
        braceDepth = Math.max(0, braceDepth - 1);
      } else if (character === '>' && braceDepth === 0) {
        tags.push(source.slice(start, index + 1));
        break;
      }
    }
  }

  return tags;
}

export function validateGlobalAccessibilityStyles(
  source: string,
  file: string,
): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  if (!source.includes(':focus-visible')) {
    issues.push({ file, message: 'Global styles require a visible focus-visible rule.' });
  }
  if (!source.includes('@media (prefers-reduced-motion: reduce)')) {
    issues.push({ file, message: 'Global styles must respect prefers-reduced-motion.' });
  }
  return issues;
}

interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

export function validateThemeContrastStyles(source: string, file: string): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const colors = new Map<string, RgbColor>();
  const requiredTokens = [
    'background',
    'surface',
    'surface-raised',
    'text-muted',
    'accent-violet',
    'accent-violet-text',
    'accent-cyan',
    'status-green',
    'warning',
    'danger',
  ];

  for (const token of requiredTokens) {
    const color = extractThemeColor(source, token);
    if (color) {
      colors.set(token, color);
    } else {
      issues.push({ file, message: `Theme color --color-${token} must be a six-digit hex value.` });
    }
  }
  if (issues.length > 0) return issues;

  const backgrounds = ['background', 'surface', 'surface-raised'];
  for (const background of backgrounds) {
    requireContrast(colors, 'text-muted', background, 4.5, issues, file);
  }
  requireContrast(colors, 'white', 'accent-violet', 4.5, issues, file, {
    white: { red: 255, green: 255, blue: 255 },
  });

  const badgePairs = [
    ['accent-violet-text', 'accent-violet'],
    ['accent-cyan', 'accent-cyan'],
    ['status-green', 'status-green'],
    ['warning', 'warning'],
    ['danger', 'danger'],
  ] as const;
  for (const [foreground, tint] of badgePairs) {
    for (const background of backgrounds) {
      const blended = blend(colors.get(tint)!, colors.get(background)!, 0.1);
      const ratio = contrastRatio(colors.get(foreground)!, blended);
      if (ratio < 4.5) {
        issues.push({
          file,
          message: `Theme color --color-${foreground} requires 4.5:1 contrast on ${tint}/10 over --color-${background}; found ${ratio.toFixed(2)}:1.`,
        });
      }
    }
  }

  return issues;
}

function extractThemeColor(source: string, token: string): RgbColor | null {
  const value = source.match(new RegExp(`--color-${token}:\\s*(#[0-9a-f]{6})\\s*;`, 'i'))?.[1];
  if (!value) return null;
  return {
    red: Number.parseInt(value.slice(1, 3), 16),
    green: Number.parseInt(value.slice(3, 5), 16),
    blue: Number.parseInt(value.slice(5, 7), 16),
  };
}

function requireContrast(
  colors: Map<string, RgbColor>,
  foreground: string,
  background: string,
  minimum: number,
  issues: AccessibilityIssue[],
  file: string,
  additionalColors: Record<string, RgbColor> = {},
): void {
  const foregroundColor = colors.get(foreground) ?? additionalColors[foreground];
  const backgroundColor = colors.get(background) ?? additionalColors[background];
  if (!foregroundColor || !backgroundColor) return;
  const ratio = contrastRatio(foregroundColor, backgroundColor);
  if (ratio < minimum) {
    issues.push({
      file,
      message: `Theme color ${foreground} requires ${minimum}:1 contrast on ${background}; found ${ratio.toFixed(2)}:1.`,
    });
  }
}

function blend(foreground: RgbColor, background: RgbColor, alpha: number): RgbColor {
  return {
    red: foreground.red * alpha + background.red * (1 - alpha),
    green: foreground.green * alpha + background.green * (1 - alpha),
    blue: foreground.blue * alpha + background.blue * (1 - alpha),
  };
}

function contrastRatio(first: RgbColor, second: RgbColor): number {
  const brighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (brighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color: RgbColor): number {
  const [red, green, blue] = [color.red, color.green, color.blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}
