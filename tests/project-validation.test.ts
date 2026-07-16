import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateProjectDocuments } from '../scripts/project-validation.ts';
import { approvedRepositories } from '../src/utils/approved-repositories.ts';

const projectsDirectory = join(process.cwd(), 'src/content/projects');

function projectDocuments() {
  return readdirSync(projectsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({
      file,
      content: readFileSync(join(projectsDirectory, file), 'utf-8'),
    }));
}

describe('project content validation', () => {
  it('accepts the eight current project documents', () => {
    expect(validateProjectDocuments(projectDocuments(), approvedRepositories)).toEqual([]);
  });

  it('requires community attribution and system risk notices', () => {
    const documents = projectDocuments().map((document) => {
      if (document.file === 'nodeloc-bench.mdx') {
        return { ...document, content: document.content.replace(/^credits:.*$/m, '') };
      }
      if (document.file === 'distrolift.mdx') {
        return { ...document, content: document.content.replace(/^riskNotice:.*$/m, '') };
      }
      return document;
    });
    const messages = validateProjectDocuments(documents, approvedRepositories).map(
      (issue) => issue.message,
    );

    expect(messages).toContain('Community projects require visible credits.');
    expect(messages).toContain('System-changing tools require a riskNotice.');
  });

  it('rejects prohibited content and duplicate slugs', () => {
    const documents = projectDocuments().map((document) => {
      if (document.file === 'vps-scripts.mdx') {
        return {
          ...document,
          content: document.content
            .replace('slug: vps-scripts', 'slug: linketry')
            .concat('\nProxy subscription provider rankings.\n'),
        };
      }
      return document;
    });
    const messages = validateProjectDocuments(documents, approvedRepositories).map(
      (issue) => issue.message,
    );

    expect(messages).toContain('Duplicate project slug: linketry.');
    expect(messages.some((message) => message.startsWith('Prohibited website content'))).toBe(true);
  });

  it('requires complete, local, attributed screenshot metadata', () => {
    const documents = projectDocuments().map((document) =>
      document.file === 'favgrove.mdx'
        ? { ...document, content: document.content.replace(/^screenshotAlt:.*$/m, '') }
        : document,
    );
    const messages = validateProjectDocuments(documents, approvedRepositories).map(
      (issue) => issue.message,
    );

    expect(messages).toContain(
      'Project screenshots require WebP, AVIF, alt text, dimensions, and source.',
    );
  });
});
