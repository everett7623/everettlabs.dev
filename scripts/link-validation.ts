export interface SiteLink {
  source: string;
  href: string;
  external: boolean;
}

export interface LinkIssue {
  source: string;
  href: string;
  message: string;
}

export function validateLinkContracts(
  links: readonly SiteLink[],
  internalRoutes: ReadonlySet<string>,
): LinkIssue[] {
  const normalizedRoutes = new Set(
    [...internalRoutes].map((route) => normalizeInternalPath(route)),
  );

  return links.flatMap((link) => {
    const issue = link.external
      ? validateExternalLink(link)
      : validateInternalLink(link, normalizedRoutes);
    return issue ? [issue] : [];
  });
}

export function normalizeInternalPath(href: string): string {
  const path = href.split(/[?#]/, 1)[0] || '/';
  return path !== '/' ? path.replace(/\/+$/, '') : path;
}

function validateInternalLink(
  link: SiteLink,
  internalRoutes: ReadonlySet<string>,
): LinkIssue | null {
  if (!link.href.startsWith('/') || link.href.startsWith('//')) {
    return issue(link, 'Internal links must start with exactly one slash.');
  }

  const path = normalizeInternalPath(link.href);
  if (!internalRoutes.has(path)) {
    return issue(link, `Internal route does not exist: ${path}`);
  }
  return null;
}

function validateExternalLink(link: SiteLink): LinkIssue | null {
  try {
    const url = new URL(link.href);
    if (url.protocol !== 'https:') {
      return issue(link, 'External links must use HTTPS.');
    }
    return null;
  } catch {
    return issue(link, 'External link is not a valid absolute URL.');
  }
}

function issue(link: SiteLink, message: string): LinkIssue {
  return { source: link.source, href: link.href, message };
}
