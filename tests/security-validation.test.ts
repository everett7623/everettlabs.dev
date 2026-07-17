import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  parseHeadersFile,
  validateAstroCsp,
  validateSecurityHeaders,
} from '../scripts/security-validation.ts';
import astroConfig from '../astro.config.mjs';

const headersFile = join(process.cwd(), 'public/_headers');

describe('security header validation', () => {
  it('accepts the current Cloudflare static asset headers', () => {
    expect(validateSecurityHeaders(readFileSync(headersFile, 'utf-8'))).toEqual([]);
  });

  it('parses case-insensitive header names', () => {
    const headers = parseHeadersFile('/*\n  X-Frame-Options: DENY\n');
    expect(headers.get('x-frame-options')).toBe('DENY');
  });

  it('rejects resource directives in the response header and missing object restrictions', () => {
    const content = readFileSync(headersFile, 'utf-8')
      .replace("object-src 'none'; ", "default-src 'self'; ")
      .replace("object-src 'none'; ", '');
    const messages = validateSecurityHeaders(content).map((issue) => issue.message);

    expect(messages).toContain(
      "default-src must be managed by Astro's hash-based CSP meta policy.",
    );
    expect(messages).toContain("object-src must include 'none'.");
  });

  it('requires privacy-sensitive permissions to be disabled', () => {
    const content = readFileSync(headersFile, 'utf-8').replace('camera=(), ', '');
    expect(validateSecurityHeaders(content).map((issue) => issue.message)).toContain(
      'Missing camera=().',
    );
  });

  it('requires HTTPS responses to advertise HSTS', () => {
    const content = readFileSync(headersFile, 'utf-8').replace(
      '  Strict-Transport-Security: max-age=31536000\n',
      '',
    );

    expect(validateSecurityHeaders(content).map((issue) => issue.message)).toContain(
      'Expected max-age=31536000, found nothing.',
    );
  });

  it('accepts the current Astro hash-based CSP configuration', () => {
    expect(validateAstroCsp(astroConfig)).toEqual([]);
  });

  it('requires the approved analytics endpoints', () => {
    const messages = validateAstroCsp({
      security: {
        csp: {
          directives: ["default-src 'self'", "img-src 'self' data: https:", "font-src 'self'"],
          scriptDirective: { resources: ["'self'"] },
          styleDirective: { resources: ["'self'"] },
        },
      },
    }).map((issue) => issue.message);

    expect(messages).toContain(
      'scriptDirective must include https://static.cloudflareinsights.com.',
    );
    expect(messages).toContain(
      "CSP must include connect-src 'self' https://cloudflareinsights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com.",
    );
    expect(messages).toContain('scriptDirective must include https://*.googletagmanager.com.');
  });

  it('rejects broad script and style sources', () => {
    const csp = structuredClone(astroConfig.security?.csp);
    if (!csp || typeof csp === 'boolean') throw new Error('Expected configured CSP.');

    csp.scriptDirective = { resources: ["'self'", "'unsafe-inline'"] };
    csp.styleDirective = { resources: ["'self'", '*'] };
    const messages = validateAstroCsp({ security: { csp } }).map((issue) => issue.message);

    expect(messages).toContain("scriptDirective must not include 'unsafe-inline'.");
    expect(messages).toContain('styleDirective must not include *.');
  });
});
