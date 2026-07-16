import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseHeadersFile, validateSecurityHeaders } from '../scripts/security-validation.ts';

const headersFile = join(process.cwd(), 'public/_headers');

describe('security header validation', () => {
  it('accepts the current Cloudflare static asset headers', () => {
    expect(validateSecurityHeaders(readFileSync(headersFile, 'utf-8'))).toEqual([]);
  });

  it('parses case-insensitive header names', () => {
    const headers = parseHeadersFile('/*\n  X-Frame-Options: DENY\n');
    expect(headers.get('x-frame-options')).toBe('DENY');
  });

  it('rejects unsafe script policies and missing object restrictions', () => {
    const content = readFileSync(headersFile, 'utf-8')
      .replace("script-src 'self'", "script-src 'self' 'unsafe-inline'")
      .replace("object-src 'none'; ", '');
    const messages = validateSecurityHeaders(content).map((issue) => issue.message);

    expect(messages).toContain("script-src must not include 'unsafe-inline'.");
    expect(messages).toContain("object-src must include 'none'.");
  });

  it('requires privacy-sensitive permissions to be disabled', () => {
    const content = readFileSync(headersFile, 'utf-8').replace('camera=(), ', '');
    expect(validateSecurityHeaders(content).map((issue) => issue.message)).toContain(
      'Missing camera=().',
    );
  });

  it('allows only the approved Cloudflare Web Analytics endpoints', () => {
    const content = readFileSync(headersFile, 'utf-8')
      .replace(' https://static.cloudflareinsights.com', '')
      .replace(' https://cloudflareinsights.com', '');
    const messages = validateSecurityHeaders(content).map((issue) => issue.message);

    expect(messages).toContain('script-src must include https://static.cloudflareinsights.com.');
    expect(messages).toContain('connect-src must include https://cloudflareinsights.com.');
  });
});
