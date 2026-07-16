import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateGlobalAccessibilityStyles,
  validateMarkupAccessibility,
  validateThemeContrastStyles,
  type AccessibilityIssue,
} from './accessibility-validation.ts';

const rootDirectory = fileURLToPath(new URL('..', import.meta.url));
const sourceDirectory = join(rootDirectory, 'src');
const globalStyles = join(sourceDirectory, 'styles/global.css');

function validateSourceFiles(directory: string): AccessibilityIssue[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return validateSourceFiles(path);
    if (!entry.isFile() || !/\.(astro|tsx)$/.test(entry.name)) return [];

    const file = relative(rootDirectory, path);
    return validateMarkupAccessibility(readFileSync(path, 'utf-8'), file);
  });
}

function main() {
  const globalStylesSource = readFileSync(globalStyles, 'utf-8');
  const issues = [
    ...validateSourceFiles(sourceDirectory),
    ...validateGlobalAccessibilityStyles(globalStylesSource, relative(rootDirectory, globalStyles)),
    ...validateThemeContrastStyles(globalStylesSource, relative(rootDirectory, globalStyles)),
  ];

  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`${issue.file}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Validated static accessibility contracts.');
}

main();
