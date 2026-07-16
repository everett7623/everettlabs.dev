import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { frontmatterValue } from './frontmatter.ts';
import {
  renderProjectOpenGraphImage,
  type ProjectAccent,
  type ProjectOpenGraphData,
} from './og-image.ts';

const projectsDirectory = fileURLToPath(new URL('../src/content/projects', import.meta.url));
const outputDirectory = fileURLToPath(new URL('../public/og/projects', import.meta.url));

function readProject(file: string): ProjectOpenGraphData {
  const content = readFileSync(join(projectsDirectory, file), 'utf-8');
  const name = frontmatterValue(content, 'name');
  const slug = frontmatterValue(content, 'slug');
  const projectType = frontmatterValue(content, 'projectType');
  const summary = frontmatterValue(content, 'summary');
  const accent = frontmatterValue(content, 'accent');

  if (!name || !slug || !projectType || !summary) {
    throw new Error(
      `${file} must define name, slug, projectType, and summary for Open Graph generation.`,
    );
  }
  if (accent && !['violet', 'cyan', 'green'].includes(accent)) {
    throw new Error(`${file} has an unsupported accent: ${accent}`);
  }

  return {
    name,
    slug,
    projectType,
    summary,
    ...(accent ? { accent: accent as ProjectAccent } : {}),
  };
}

function main() {
  const projects = readdirSync(projectsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map(readProject);

  mkdirSync(outputDirectory, { recursive: true });
  for (const project of projects) {
    const output = join(outputDirectory, `${project.slug}.svg`);
    writeFileSync(output, renderProjectOpenGraphImage(project));
  }

  console.log(`Generated ${projects.length} project Open Graph images.`);
}

main();
