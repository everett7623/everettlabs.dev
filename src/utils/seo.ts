import type { StructuredData } from '../types/seo.ts';
import { site } from './site.ts';

interface PageSchemaInput {
  title: string;
  description: string;
  url: string;
  home?: boolean;
}

interface SoftwareSchemaInput extends PageSchemaInput {
  name: string;
  category: string;
  repository: string;
  tags: readonly string[];
  license?: string;
  release?: string | null;
  website?: string;
}

interface ProjectsCollectionSchemaInput extends PageSchemaInput {
  projects: readonly {
    name: string;
    url: string;
  }[];
}

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

const organization = {
  '@type': 'Organization',
  '@id': organizationId,
  name: 'Everett Labs',
  description: site.description,
  url: site.url,
  founder: {
    '@type': 'Person',
    '@id': `${site.url}/about#frank`,
    name: 'Frank',
  },
  sameAs: [site.github, site.seedloc, site.telegram],
};

const websiteReference = {
  '@type': 'WebSite',
  '@id': websiteId,
  name: site.title,
  url: `${site.url}/`,
};

export function createPageSchema(input: PageSchemaInput): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': input.home ? 'WebSite' : 'WebPage',
    '@id': input.home ? websiteId : `${input.url}#webpage`,
    name: input.title,
    description: input.description,
    url: input.url,
    inLanguage: site.lang,
    publisher: organization,
    ...(input.home ? {} : { isPartOf: websiteReference }),
  };
}

export function createProfilePageSchema(input: PageSchemaInput): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${input.url}#webpage`,
    name: input.title,
    description: input.description,
    url: input.url,
    inLanguage: site.lang,
    isPartOf: websiteReference,
    publisher: organization,
    mainEntity: {
      '@type': 'Person',
      '@id': `${site.url}/about#frank`,
      name: 'Frank',
      affiliation: organization,
      sameAs: [site.github, site.seedloc, site.telegram],
    },
  };
}

export function createSoftwareSchema(input: SoftwareSchemaInput): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${input.url}#software`,
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: site.lang,
    isPartOf: websiteReference,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${input.url}#webpage`,
    },
    applicationCategory: input.category.replaceAll('-', ' '),
    codeRepository: `https://github.com/${input.repository}`,
    author: organization,
    isAccessibleForFree: true,
    keywords: input.tags.join(', '),
    ...(input.license ? { license: input.license } : {}),
    ...(input.release ? { softwareVersion: input.release } : {}),
    ...(input.website ? { sameAs: input.website } : {}),
  };
}

export function createProjectsCollectionSchema(
  input: ProjectsCollectionSchemaInput,
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${input.url}#webpage`,
    name: input.title,
    description: input.description,
    url: input.url,
    inLanguage: site.lang,
    isPartOf: websiteReference,
    publisher: organization,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: input.projects.length,
      itemListElement: input.projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: project.name,
          url: project.url,
        },
      })),
    },
  };
}

export function serializeStructuredData(data: StructuredData): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}
