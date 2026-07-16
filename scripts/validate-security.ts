import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSecurityHeaders } from './security-validation.ts';

const rootDirectory = fileURLToPath(new URL('..', import.meta.url));
const headersFile = join(rootDirectory, 'public/_headers');
const sourceDirectory = join(rootDirectory, 'src');

function findInlineScripts(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findInlineScripts(path);
    if (!entry.isFile() || !entry.name.endsWith('.astro')) return [];

    const content = readFileSync(path, 'utf-8');
    return /<script\b[^>]*\bis:inline\b[^>]*>/i.test(content)
      ? [relative(rootDirectory, path)]
      : [];
  });
}

function main() {
  const issues = validateSecurityHeaders(readFileSync(headersFile, 'utf-8'));
  const inlineScripts = findInlineScripts(sourceDirectory);

  for (const path of inlineScripts) {
    issues.push({
      field: path,
      message: 'Executable is:inline scripts are incompatible with script-src self.',
    });
  }

  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`${issue.field}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Validated security headers and CSP-compatible Astro scripts.');
}

main();
