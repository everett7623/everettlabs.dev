import { describe, expect, it } from 'vitest';
import {
  createPageSchema,
  createProfilePageSchema,
  createSoftwareSchema,
  serializeStructuredData,
} from '../src/utils/seo.ts';

describe('SEO structured data', () => {
  it('uses WebSite only for the homepage', () => {
    const base = {
      title: 'Everett Labs',
      description: 'Independent software lab',
      url: 'https://everettlabs.dev/',
    };

    expect(createPageSchema({ ...base, home: true })['@type']).toBe('WebSite');
    expect(createPageSchema({ ...base, home: false })['@type']).toBe('WebPage');
  });

  it('describes the About page as a ProfilePage', () => {
    const schema = createProfilePageSchema({
      title: 'About Everett Labs',
      description: 'About the lab',
      url: 'https://everettlabs.dev/about',
    });

    expect(schema['@type']).toBe('ProfilePage');
    expect(schema.mainEntity).toMatchObject({ '@type': 'Person', name: 'Frank' });
  });

  it('creates project SoftwareApplication metadata without fabricated ratings', () => {
    const schema = createSoftwareSchema({
      title: 'Linketry — Everett Labs',
      name: 'Linketry',
      description: 'Self-hosted link management.',
      url: 'https://everettlabs.dev/projects/linketry',
      category: 'edge-application',
      repository: 'everett7623/Linketry',
      tags: ['TypeScript', 'Cloudflare Workers'],
      license: 'MIT',
      release: 'v1.0.0',
      website: 'https://linketry.com',
    });

    expect(schema).toMatchObject({
      '@type': 'SoftwareApplication',
      applicationCategory: 'edge application',
      codeRepository: 'https://github.com/everett7623/Linketry',
      softwareVersion: 'v1.0.0',
    });
    expect(schema).not.toHaveProperty('aggregateRating');
  });

  it('escapes markup-sensitive characters in JSON-LD', () => {
    const schema = createPageSchema({
      title: '</script>',
      description: 'Safe serialization',
      url: 'https://everettlabs.dev/',
    });

    expect(serializeStructuredData(schema)).not.toContain('</script>');
    expect(serializeStructuredData(schema)).toContain('\\u003c/script>');
  });
});
