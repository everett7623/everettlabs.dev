import { describe, expect, it } from 'vitest';
import { validateSiteContracts } from '../scripts/site-validation.ts';

const validInput = {
  siteUrl: 'https://everettlabs.dev',
  astroConfig: `
    const site = 'https://everettlabs.dev';
    sitemap({ filter: (page) => new URL(page).pathname !== '/404' })
  `,
  robots: 'User-agent: *\nDisallow:\n\nSitemap: https://everettlabs.dev/sitemap-index.xml\n',
  manifest: {
    id: '/',
    name: 'Everett Labs',
    short_name: 'Everett Labs',
    description: 'Independent software lab.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#07080a',
    theme_color: '#07080a',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  },
  wrangler: {
    compatibility_date: '2026-07-16',
    workers_dev: true,
    preview_urls: true,
    routes: [{ pattern: 'everettlabs.dev', custom_domain: true }],
    assets: { directory: './dist', not_found_handling: '404-page' },
  },
  layoutSource:
    '<link rel="manifest" href="/manifest.webmanifest" /><meta name="theme-color" content="#07080a" />',
  seoSource:
    "<title>{title}</title><meta name=\"robots\" content={noindex ? 'noindex, nofollow' : 'index, follow'} />",
  notFoundSource: '<Layout title="Page not found" noindex>',
};

describe('static site deployment contracts', () => {
  it('accepts the canonical production configuration', () => {
    expect(validateSiteContracts(validInput)).toEqual([]);
  });

  it('rejects an indexable 404 page and sitemap', () => {
    const issues = validateSiteContracts({
      ...validInput,
      astroConfig: "const site = 'https://everettlabs.dev'; sitemap()",
      notFoundSource: '<Layout title="Page not found">',
    });

    expect(issues).toContain('Astro sitemap must define a route filter.');
    expect(issues).toContain('Astro sitemap must exclude the 404 route.');
    expect(issues).toContain('The 404 page must opt out of indexing.');
  });

  it('requires every page to render a document title', () => {
    const issues = validateSiteContracts({
      ...validInput,
      seoSource:
        "<meta name=\"robots\" content={noindex ? 'noindex, nofollow' : 'index, follow'} />",
    });

    expect(issues).toContain('SEO metadata must render the document title.');
  });

  it('rejects inconsistent deployment and manifest settings', () => {
    const issues = validateSiteContracts({
      ...validInput,
      manifest: { ...validInput.manifest, scope: '/app/', icons: [] },
      wrangler: { assets: { directory: './public' } },
    });

    expect(issues).toContain('Manifest scope must be /.');
    expect(issues).toContain('Manifest must declare the local SVG favicon.');
    expect(issues).toContain('Wrangler assets.directory must be ./dist.');
    expect(issues).toContain('Wrangler must use 404-page not-found handling.');
    expect(issues).toContain('Wrangler must keep workers.dev enabled.');
    expect(issues).toContain('Wrangler must keep version preview URLs enabled.');
    expect(issues).toContain('Wrangler must declare everettlabs.dev as a custom domain.');
  });
});
