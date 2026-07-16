import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projectSchema = z
  .object({
    name: z.string(),
    slug: z.string(),
    repository: z.string(),
    category: z.enum(['product', 'infrastructure', 'community']),
    projectType: z.string(),
    status: z.enum(['active', 'stable', 'beta', 'experimental', 'maintained', 'archived']),
    ownership: z.enum(['original', 'maintained', 'community']),
    featured: z.boolean().default(false),
    homeOrder: z.number().default(0),
    website: z.string().optional(),
    license: z.string().optional(),
    tags: z.array(z.string()),
    accent: z.enum(['violet', 'cyan', 'green']).optional(),
    summary: z.string().optional(),
    riskNotice: z.string().optional(),
    credits: z.string().optional(),
    screenshot: z.string().optional(),
    screenshotAvif: z.string().optional(),
    screenshotAlt: z.string().optional(),
    screenshotWidth: z.number().int().positive().optional(),
    screenshotHeight: z.number().int().positive().optional(),
    screenshotSource: z.string().optional(),
  })
  .refine(
    (project) => {
      const fields = [
        project.screenshot,
        project.screenshotAvif,
        project.screenshotAlt,
        project.screenshotWidth,
        project.screenshotHeight,
        project.screenshotSource,
      ];
      const populated = fields.filter((value) => value !== undefined).length;
      return populated === 0 || populated === fields.length;
    },
    {
      message: 'Project screenshots require WebP, AVIF, alt text, dimensions, and source.',
    },
  );

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: projectSchema,
});

export const collections = { projects };
