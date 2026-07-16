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

const organization = {
  '@type': 'Organization',
  name: 'Everett Labs',
  url: site.url,
  sameAs: [site.github, site.seedloc, site.telegram],
};

export function createPageSchema(input: PageSchemaInput): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': input.home ? 'WebSite' : 'WebPage',
    name: input.title,
    description: input.description,
    url: input.url,
    publisher: organization,
  };
}

export function createProfilePageSchema(input: PageSchemaInput): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: input.title,
    description: input.description,
    url: input.url,
    mainEntity: {
      '@type': 'Person',
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
    name: input.name,
    description: input.description,
    url: input.url,
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

export function serializeStructuredData(data: StructuredData): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}
