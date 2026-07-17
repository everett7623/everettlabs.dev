export interface SecurityIssue {
  field: string;
  message: string;
}

const requiredHeaders: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'cross-origin-opener-policy': 'same-origin',
};

const requiredHeaderCspDirectives: Record<string, readonly string[]> = {
  'object-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

const astroOwnedDirectives = ['default-src', 'script-src', 'style-src', 'connect-src'];

const requiredAstroDirectives = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  "manifest-src 'self'",
];

export function parseHeadersFile(content: string): Map<string, string> {
  const headers = new Map<string, string>();
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s+([^:]+):\s*(.+)$/);
    if (match) headers.set(match[1].trim().toLowerCase(), match[2].trim());
  }
  return headers;
}

export function validateSecurityHeaders(content: string): SecurityIssue[] {
  const headers = parseHeadersFile(content);
  const issues: SecurityIssue[] = [];

  for (const [name, expected] of Object.entries(requiredHeaders)) {
    const actual = headers.get(name);
    if (actual !== expected) {
      issues.push({ field: name, message: `Expected ${expected}, found ${actual ?? 'nothing'}.` });
    }
  }

  const permissions = headers.get('permissions-policy') ?? '';
  for (const permission of ['camera=()', 'microphone=()', 'geolocation=()']) {
    if (!permissions.includes(permission)) {
      issues.push({ field: 'permissions-policy', message: `Missing ${permission}.` });
    }
  }

  const csp = parseCsp(headers.get('content-security-policy') ?? '');
  for (const [directive, requiredValues] of Object.entries(requiredHeaderCspDirectives)) {
    const actual = csp.get(directive) ?? [];
    for (const required of requiredValues) {
      if (!actual.includes(required)) {
        issues.push({
          field: 'content-security-policy',
          message: `${directive} must include ${required}.`,
        });
      }
    }
  }

  for (const directive of astroOwnedDirectives) {
    if (csp.has(directive)) {
      issues.push({
        field: 'content-security-policy',
        message: `${directive} must be managed by Astro's hash-based CSP meta policy.`,
      });
    }
  }

  return issues;
}

export function validateAstroCsp(config: unknown): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  const root = asRecord(config);
  const security = asRecord(root?.security);
  const csp = asRecord(security?.csp);

  if (!csp) {
    return [{ field: 'astro.config.mjs', message: 'security.csp must be configured.' }];
  }

  const directives = stringArray(csp.directives);
  for (const directive of requiredAstroDirectives) {
    if (!directives.includes(directive)) {
      issues.push({ field: 'astro.config.mjs', message: `CSP must include ${directive}.` });
    }
  }

  const scripts = stringArray(asRecord(csp.scriptDirective)?.resources);
  for (const resource of ["'self'", 'https://static.cloudflareinsights.com']) {
    if (!scripts.includes(resource)) {
      issues.push({
        field: 'astro.config.mjs',
        message: `scriptDirective must include ${resource}.`,
      });
    }
  }

  const styles = stringArray(asRecord(csp.styleDirective)?.resources);
  if (!styles.includes("'self'")) {
    issues.push({ field: 'astro.config.mjs', message: "styleDirective must include 'self'." });
  }

  for (const unsafeSource of ["'unsafe-inline'", "'unsafe-eval'", '*']) {
    if (scripts.includes(unsafeSource)) {
      issues.push({
        field: 'astro.config.mjs',
        message: `scriptDirective must not include ${unsafeSource}.`,
      });
    }
  }

  for (const unsafeSource of ["'unsafe-inline'", '*']) {
    if (styles.includes(unsafeSource)) {
      issues.push({
        field: 'astro.config.mjs',
        message: `styleDirective must not include ${unsafeSource}.`,
      });
    }
  }

  return issues;
}

function parseCsp(value: string): Map<string, string[]> {
  const directives = new Map<string, string[]>();
  for (const segment of value.split(';')) {
    const [name, ...sources] = segment.trim().split(/\s+/);
    if (name) directives.set(name.toLowerCase(), sources);
  }
  return directives;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
}
