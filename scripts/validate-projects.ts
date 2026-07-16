import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { approvedRepositories } from '../src/utils/approved-repositories.ts';
import { frontmatterValue } from './frontmatter.ts';
import { validateProjectDocuments, type ProjectDocument } from './project-validation.ts';

const projectsDir = fileURLToPath(new URL('../src/content/projects', import.meta.url));
const publicDir = fileURLToPath(new URL('../public', import.meta.url));
const maximumImageBytes = 250 * 1024;

function validateMedia(documents: readonly ProjectDocument[]): string[] {
  return documents.flatMap((document) => {
    const paths = [
      frontmatterValue(document.content, 'screenshot'),
      frontmatterValue(document.content, 'screenshotAvif'),
    ].filter((path): path is string => Boolean(path));

    return paths.flatMap((path) => {
      const absolutePath = resolve(publicDir, path.replace(/^\/+/, ''));
      const relativePath = relative(publicDir, absolutePath);
      if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
        return [`${document.file}: Media asset escapes public/: ${path}.`];
      }
      if (!existsSync(absolutePath)) return [`${document.file}: Missing media asset: ${path}.`];
      const size = statSync(absolutePath).size;
      if (size === 0 || size > maximumImageBytes) {
        return [`${document.file}: Media asset exceeds 250 KB: ${path}.`];
      }

      const bytes = readFileSync(absolutePath).subarray(0, 32);
      const ascii = bytes.toString('ascii');
      const valid = path.endsWith('.webp')
        ? ascii.startsWith('RIFF') && ascii.includes('WEBP')
        : path.endsWith('.avif') && ascii.includes('ftypavif');
      return valid ? [] : [`${document.file}: Media format does not match its extension: ${path}.`];
    });
  });
}

function main() {
  const files = readdirSync(projectsDir).filter((f) => f.endsWith('.mdx'));
  const documents: ProjectDocument[] = files.map((file) => ({
    file,
    content: readFileSync(`${projectsDir}/${file}`, 'utf-8'),
  }));
  const issues = [
    ...validateProjectDocuments(documents, approvedRepositories),
    ...validateMedia(documents).map((message) => ({ file: 'project-media', message })),
  ];

  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`${issue.file}: ${issue.message}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${files.length} project content contracts and safety boundaries.`);
}

main();
