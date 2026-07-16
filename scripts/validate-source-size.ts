import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  countSubstantiveLines,
  sourceLineLimit,
  validateSourceSizes,
  type SourceDocument,
} from './source-size-validation.ts';

const rootDirectory = fileURLToPath(new URL('..', import.meta.url));
const excludedDirectories = new Set([
  '.astro',
  '.git',
  '.venv',
  '__pycache__',
  'build',
  'dist',
  'node_modules',
  'vendor',
]);

function collectSourceDocuments(directory: string): SourceDocument[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) return [];

    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceDocuments(path);
    if (!entry.isFile() || !sourceLineLimit(entry.name)) return [];

    return [
      {
        file: relative(rootDirectory, path).replaceAll('\\', '/'),
        content: readFileSync(path, 'utf-8'),
      },
    ];
  });
}

const documents = collectSourceDocuments(rootDirectory);
const issues = validateSourceSizes(documents);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(
      `${issue.file}: ${issue.lines} effective lines exceeds the ${issue.limit}-line limit.`,
    );
  }
  process.exitCode = 1;
} else {
  const closest = documents
    .map((document) => {
      const lines = countSubstantiveLines(document.content);
      const limit = sourceLineLimit(document.file) ?? 0;
      return { file: document.file, remaining: limit - lines };
    })
    .sort((a, b) => a.remaining - b.remaining)[0];
  console.log(
    closest
      ? `Validated ${documents.length} source files. Closest limit: ${closest.file} (${closest.remaining} lines remaining).`
      : 'Validated 0 source files.',
  );
}
