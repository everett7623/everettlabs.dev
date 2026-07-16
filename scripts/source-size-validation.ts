import { extname } from 'node:path';

export interface SourceDocument {
  file: string;
  content: string;
}

export interface SourceSizeIssue {
  file: string;
  lines: number;
  limit: number;
}

export const sourceLineLimits: Readonly<Record<string, number>> = {
  '.astro': 200,
  '.cjs': 300,
  '.cts': 300,
  '.jsx': 200,
  '.tsx': 200,
  '.js': 300,
  '.mjs': 300,
  '.mts': 300,
  '.ts': 300,
};

export function sourceLineLimit(file: string): number | undefined {
  return sourceLineLimits[extname(file).toLowerCase()];
}

export function validateSourceSizes(documents: readonly SourceDocument[]): SourceSizeIssue[] {
  return documents.flatMap((document) => {
    const limit = sourceLineLimit(document.file);
    if (!limit) return [];

    const lines = countSubstantiveLines(document.content);
    return lines > limit ? [{ file: document.file, lines, limit }] : [];
  });
}

export function countSubstantiveLines(content: string): number {
  let blockEnd: '*/' | '-->' | null = null;
  let count = 0;

  for (const line of content.split(/\r?\n/)) {
    let remaining = line.trim();

    while (remaining.length > 0) {
      if (blockEnd) {
        const closingIndex = remaining.indexOf(blockEnd);
        if (closingIndex === -1) {
          remaining = '';
          continue;
        }
        remaining = remaining.slice(closingIndex + blockEnd.length).trimStart();
        blockEnd = null;
        continue;
      }

      if (remaining.startsWith('//')) break;
      if (remaining.startsWith('/*')) {
        blockEnd = '*/';
        remaining = remaining.slice(2);
        continue;
      }
      if (remaining.startsWith('<!--')) {
        blockEnd = '-->';
        remaining = remaining.slice(4);
        continue;
      }

      count += 1;
      break;
    }
  }

  return count;
}
