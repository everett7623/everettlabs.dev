import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { commands } from '../src/utils/commands.ts';
import { site } from '../src/utils/site.ts';
import { validateLinkContracts, type SiteLink } from './link-validation.ts';
import { frontmatterValue } from './frontmatter.ts';

const rootDirectory = fileURLToPath(new URL('..', import.meta.url));
const projectsDirectory = join(rootDirectory, 'src/content/projects');
const sourceDirectory = join(rootDirectory, 'src');
const publicDirectory = join(rootDirectory, 'public');

interface ProjectLinkData {
  slug: string;
  repository: string;
  website?: string;
  screenshotSource?: string;
}

function readProjectLinks(): ProjectLinkData[] {
  return readdirSync(projectsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const content = readFileSync(join(projectsDirectory, file), 'utf-8');
      const slug = frontmatterValue(content, 'slug');
      const repository = frontmatterValue(content, 'repository');
      const website = frontmatterValue(content, 'website');
      const screenshotSource = frontmatterValue(content, 'screenshotSource');

      if (!slug || !repository) {
        throw new Error(`${file} must define slug and repository.`);
      }
      return {
        slug,
        repository,
        ...(website ? { website } : {}),
        ...(screenshotSource ? { screenshotSource } : {}),
      };
    });
}

function collectAstroLiteralLinks(directory: string): SiteLink[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectAstroLiteralLinks(path);
    if (!entry.isFile() || !entry.name.endsWith('.astro')) return [];

    const content = readFileSync(path, 'utf-8');
    return [...content.matchAll(/href="(\/[^"]*)"/g)].map((match) => ({
      source: relative(rootDirectory, path),
      href: match[1],
      external: false,
    }));
  });
}

function collectPublicAssetRoutes(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectPublicAssetRoutes(path);
    if (!entry.isFile()) return [];

    const publicPath = relative(publicDirectory, path).split(sep).join('/');
    return [`/${publicPath}`];
  });
}

function collectLinks(projects: readonly ProjectLinkData[]): SiteLink[] {
  const configuredLinks = [
    ['site.github', site.github],
    ['site.seedloc', site.seedloc],
    ['site.telegram', site.telegram],
    ['site.koFi', site.koFi],
  ] as const;

  return [
    ...commands.map((command) => ({
      source: `command:${command.id}`,
      href: command.href,
      external: command.external === true,
    })),
    ...configuredLinks
      .filter(([, href]) => href.length > 0)
      .map(([source, href]) => ({ source, href, external: true })),
    ...projects.flatMap((project) => [
      {
        source: `project:${project.slug}:repository`,
        href: `https://github.com/${project.repository}`,
        external: true,
      },
      ...(project.website
        ? [
            {
              source: `project:${project.slug}:website`,
              href: project.website,
              external: true,
            },
          ]
        : []),
      ...(project.screenshotSource
        ? [
            {
              source: `project:${project.slug}:screenshot-source`,
              href: project.screenshotSource,
              external: true,
            },
          ]
        : []),
    ]),
    ...collectAstroLiteralLinks(sourceDirectory),
  ];
}

async function warnAboutUnavailableExternalLinks(links: readonly SiteLink[]) {
  const urls = [...new Set(links.filter((link) => link.external).map((link) => link.href))];

  await Promise.all(
    urls.map(async (url) => {
      try {
        const headResponse = await requestExternalLink(url, 'HEAD');
        if (headResponse.ok) return;

        const getResponse = await requestExternalLink(url, 'GET');
        if (!getResponse.ok) {
          console.warn(`External link warning: ${url} returned ${getResponse.status}.`);
        }
      } catch (error) {
        try {
          const getResponse = await requestExternalLink(url, 'GET');
          if (getResponse.ok) return;
          console.warn(`External link warning: ${url} returned ${getResponse.status}.`);
        } catch (fallbackError) {
          console.warn(
            `External link warning: ${url} could not be reached: ${
              fallbackError instanceof Error
                ? fallbackError.message
                : String(fallbackError ?? error)
            }`,
          );
        }
      }
    }),
  );
}

function requestExternalLink(url: string, method: 'HEAD' | 'GET') {
  return fetch(url, {
    method,
    redirect: 'follow',
    headers: method === 'GET' ? { Range: 'bytes=0-0' } : undefined,
    signal: AbortSignal.timeout(8_000),
  });
}

async function main() {
  const projects = readProjectLinks();
  const internalRoutes = new Set([
    '/',
    '/projects',
    '/about',
    '/coffee',
    '/404',
    ...projects.map((project) => `/projects/${project.slug}`),
    ...collectPublicAssetRoutes(publicDirectory),
  ]);
  const links = collectLinks(projects);
  const issues = validateLinkContracts(links, internalRoutes);

  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`${issue.source}: ${issue.message} (${issue.href})`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Validated ${links.length} link references against ${internalRoutes.size} internal routes.`,
  );

  if (process.argv.includes('--external')) {
    await warnAboutUnavailableExternalLinks(links);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
