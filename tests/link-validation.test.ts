import { describe, expect, it } from 'vitest';
import {
  normalizeInternalPath,
  validateLinkContracts,
  type SiteLink,
} from '../scripts/link-validation.ts';

const routes = new Set(['/', '/projects', '/projects/linketry']);

describe('link validation', () => {
  it('accepts known internal routes and secure external URLs', () => {
    const links: SiteLink[] = [
      { source: 'home', href: '/projects/', external: false },
      { source: 'project', href: '/projects/linketry?from=test', external: false },
      { source: 'github', href: 'https://github.com/everett7623', external: true },
    ];

    expect(validateLinkContracts(links, routes)).toEqual([]);
  });

  it('reports missing internal routes', () => {
    const issues = validateLinkContracts(
      [{ source: 'broken', href: '/missing', external: false }],
      routes,
    );

    expect(issues).toEqual([
      {
        source: 'broken',
        href: '/missing',
        message: 'Internal route does not exist: /missing',
      },
    ]);
  });

  it('rejects protocol-relative and insecure external URLs', () => {
    const links: SiteLink[] = [
      { source: 'internal', href: '//example.com', external: false },
      { source: 'external', href: 'http://example.com', external: true },
    ];

    expect(validateLinkContracts(links, routes).map((issue) => issue.message)).toEqual([
      'Internal links must start with exactly one slash.',
      'External links must use HTTPS.',
    ]);
  });

  it('normalizes query strings, fragments, and trailing slashes', () => {
    expect(normalizeInternalPath('/projects/?page=1#top')).toBe('/projects');
    expect(normalizeInternalPath('/')).toBe('/');
  });
});
