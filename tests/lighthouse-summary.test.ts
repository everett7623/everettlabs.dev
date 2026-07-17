import { describe, expect, it } from 'vitest';
import { formatLighthouseSummary, parseLighthouseSummary } from '../scripts/lighthouse-summary';

const manifestEntry = {
  url: 'https://everettlabs.dev/',
  summary: {
    performance: 0.99,
    accessibility: 1,
    'best-practices': 1,
    seo: 1,
  },
};

const report = {
  audits: {
    'first-contentful-paint': { numericValue: 1090 },
    'largest-contentful-paint': { numericValue: 1720 },
    'total-blocking-time': { numericValue: 0 },
    'cumulative-layout-shift': { numericValue: 0.0012 },
  },
};

describe('Lighthouse summary', () => {
  it('formats category scores and core timing metrics', () => {
    const summary = parseLighthouseSummary(manifestEntry, report);

    expect(formatLighthouseSummary(summary)).toBe(
      'https://everettlabs.dev/ | P 99 | A 100 | BP 100 | SEO 100 | FCP 1.1s | LCP 1.7s | TBT 0ms | CLS 0.001',
    );
  });

  it('rejects reports with missing metrics', () => {
    expect(() => parseLighthouseSummary(manifestEntry, { audits: {} })).toThrow(
      'Lighthouse report is missing first-contentful-paint.',
    );
  });
});
