interface SiteContractInput {
  siteUrl: string;
  astroConfig: string;
  robots: string;
  manifest: unknown;
  wrangler: unknown;
  layoutSource: string;
  seoSource: string;
  notFoundSource: string;
}

type UnknownRecord = Record<string, unknown>;

export function validateSiteContracts(input: SiteContractInput): string[] {
  const issues: string[] = [];
  const expectedSitemap = `${input.siteUrl}/sitemap-index.xml`;
  const manifest = asRecord(input.manifest);
  const wrangler = asRecord(input.wrangler);
  const assets = asRecord(wrangler?.assets);
  const routes = Array.isArray(wrangler?.routes) ? wrangler.routes.map(asRecord) : [];

  if (!isCanonicalOrigin(input.siteUrl)) {
    issues.push('site.url must be an HTTPS origin without a path.');
  }
  if (!input.astroConfig.includes(input.siteUrl)) {
    issues.push('astro.config.mjs must use the canonical site URL.');
  }
  if (!/sitemap\(\{[\s\S]*filter:/.test(input.astroConfig)) {
    issues.push('Astro sitemap must define a route filter.');
  }
  if (!input.astroConfig.includes("'/404'")) {
    issues.push('Astro sitemap must exclude the 404 route.');
  }

  validateRobots(input.robots, expectedSitemap, issues);
  validateManifest(manifest, input.layoutSource, issues);

  if (assets?.directory !== './dist') {
    issues.push('Wrangler assets.directory must be ./dist.');
  }
  if (assets?.not_found_handling !== '404-page') {
    issues.push('Wrangler must use 404-page not-found handling.');
  }
  if (!isIsoDate(wrangler?.compatibility_date)) {
    issues.push('Wrangler compatibility_date must be a valid ISO date.');
  }
  if (wrangler?.workers_dev !== true) {
    issues.push('Wrangler must keep workers.dev enabled.');
  }
  if (wrangler?.preview_urls !== true) {
    issues.push('Wrangler must keep version preview URLs enabled.');
  }
  if (
    !routes.some((route) => route?.pattern === 'everettlabs.dev' && route.custom_domain === true)
  ) {
    issues.push('Wrangler must declare everettlabs.dev as a custom domain.');
  }

  if (!input.layoutSource.includes('href="/manifest.webmanifest"')) {
    issues.push('The base layout must link the web manifest.');
  }
  if (!input.seoSource.includes("'noindex, nofollow'")) {
    issues.push('SEO metadata must support noindex, nofollow.');
  }
  if (!/<title>\s*\{title\}\s*<\/title>/.test(input.seoSource)) {
    issues.push('SEO metadata must render the document title.');
  }
  if (!/<Layout[\s\S]*?\bnoindex\b/.test(input.notFoundSource)) {
    issues.push('The 404 page must opt out of indexing.');
  }

  return issues;
}

function validateRobots(robots: string, expectedSitemap: string, issues: string[]): void {
  if (!/^User-agent:\s*\*$/m.test(robots)) {
    issues.push('robots.txt must define the wildcard user agent.');
  }
  const sitemap = robots.match(/^Sitemap:\s*(\S+)$/m)?.[1];
  if (sitemap !== expectedSitemap) {
    issues.push(`robots.txt sitemap must be ${expectedSitemap}.`);
  }
}

function validateManifest(
  manifest: UnknownRecord | null,
  layoutSource: string,
  issues: string[],
): void {
  if (!manifest) {
    issues.push('manifest.webmanifest must contain a JSON object.');
    return;
  }

  for (const field of ['name', 'short_name', 'description'] as const) {
    if (!isNonEmptyString(manifest[field])) {
      issues.push(`Manifest ${field} must be a non-empty string.`);
    }
  }
  for (const field of ['id', 'start_url', 'scope'] as const) {
    if (manifest[field] !== '/') {
      issues.push(`Manifest ${field} must be /.`);
    }
  }
  if (manifest.display !== 'standalone') {
    issues.push('Manifest display must be standalone.');
  }
  if (!isHexColor(manifest.background_color) || !isHexColor(manifest.theme_color)) {
    issues.push('Manifest background_color and theme_color must be hex colors.');
  }

  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
  const hasSvgIcon = icons.some((icon) => {
    const record = asRecord(icon);
    return (
      record?.src === '/favicon.svg' && record.sizes === 'any' && record.type === 'image/svg+xml'
    );
  });
  if (!hasSvgIcon) {
    issues.push('Manifest must declare the local SVG favicon.');
  }

  const themeColor = manifest.theme_color;
  if (typeof themeColor === 'string' && !layoutSource.includes(`content="${themeColor}"`)) {
    issues.push('Layout and manifest theme colors must match.');
  }
}

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isCanonicalOrigin(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.pathname === '/' && !url.search && !url.hash;
  } catch {
    return false;
  }
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
