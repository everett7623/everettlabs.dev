import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, printParseErrorCode, type ParseError } from 'jsonc-parser';
import { site } from '../src/utils/site.ts';
import { validateSiteContracts } from './site-validation.ts';

const rootDirectory = fileURLToPath(new URL('..', import.meta.url));

function read(relativePath: string): string {
  return readFileSync(join(rootDirectory, relativePath), 'utf-8');
}

function parseJson(relativePath: string): unknown {
  const errors: ParseError[] = [];
  const value = parse(read(relativePath), errors, { allowTrailingComma: true });
  if (errors.length > 0) {
    const messages = errors.map((error) => printParseErrorCode(error.error)).join(', ');
    throw new Error(`Unable to parse ${relativePath}: ${messages}.`);
  }
  return value;
}

const issues = validateSiteContracts({
  siteUrl: site.url,
  astroConfig: read('astro.config.mjs'),
  robots: read('public/robots.txt'),
  manifest: parseJson('public/manifest.webmanifest'),
  wrangler: parseJson('wrangler.jsonc'),
  layoutSource: read('src/layouts/Layout.astro'),
  seoSource: read('src/components/SEO.astro'),
  notFoundSource: read('src/pages/404.astro'),
});

if (issues.length > 0) {
  for (const issue of issues) console.error(issue);
  process.exitCode = 1;
} else {
  console.log('Validated canonical URL, sitemap, robots, manifest, and 404 deployment contracts.');
}
