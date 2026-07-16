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

const requiredCspDirectives: Record<string, readonly string[]> = {
  'default-src': ["'self'"],
  'script-src': ["'self'", 'https://static.cloudflareinsights.com'],
  'connect-src': ["'self'", 'https://cloudflareinsights.com'],
  'object-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

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
  for (const [directive, requiredValues] of Object.entries(requiredCspDirectives)) {
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

  const scriptSources = csp.get('script-src') ?? [];
  for (const unsafeSource of ["'unsafe-inline'", "'unsafe-eval'", '*']) {
    if (scriptSources.includes(unsafeSource)) {
      issues.push({
        field: 'content-security-policy',
        message: `script-src must not include ${unsafeSource}.`,
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
