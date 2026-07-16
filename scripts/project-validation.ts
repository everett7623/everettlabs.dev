import { frontmatterValue } from './frontmatter.ts';

export interface ProjectDocument {
  file: string;
  content: string;
}

export interface ProjectValidationIssue {
  file: string;
  message: string;
}

interface ExpectedProject {
  repository: string;
  category: 'product' | 'infrastructure' | 'community';
  ownership: 'original' | 'community';
  featured: 'true' | 'false';
  homeOrder: string;
  riskNotice?: boolean;
  credits?: boolean;
  screenshot?: boolean;
}

const expectedProjects: Record<string, ExpectedProject> = {
  linketry: {
    repository: 'everett7623/Linketry',
    category: 'product',
    ownership: 'original',
    featured: 'true',
    homeOrder: '1',
  },
  favgrove: {
    repository: 'everett7623/FavGrove',
    category: 'product',
    ownership: 'original',
    featured: 'true',
    homeOrder: '2',
    screenshot: true,
  },
  linkvitals: {
    repository: 'everett7623/LinkVitals',
    category: 'product',
    ownership: 'original',
    featured: 'true',
    homeOrder: '3',
  },
  globokit: {
    repository: 'everett7623/Globokit',
    category: 'product',
    ownership: 'original',
    featured: 'true',
    homeOrder: '4',
  },
  'vps-scripts': {
    repository: 'everett7623/vps_scripts',
    category: 'infrastructure',
    ownership: 'original',
    featured: 'false',
    homeOrder: '1',
  },
  'nezha-cleaner': {
    repository: 'everett7623/Nezha-cleaner',
    category: 'infrastructure',
    ownership: 'original',
    featured: 'false',
    homeOrder: '2',
    riskNotice: true,
  },
  distrolift: {
    repository: 'everett7623/debian-auto-upgrade',
    category: 'infrastructure',
    ownership: 'original',
    featured: 'false',
    homeOrder: '3',
    riskNotice: true,
  },
  'nodeloc-bench': {
    repository: 'everett7623/nodeloc_vps_test',
    category: 'community',
    ownership: 'community',
    featured: 'false',
    homeOrder: '4',
    credits: true,
  },
};

const prohibitedContent = [
  /\bairport recommendations?\b/i,
  /\bproxy subscriptions?\b/i,
  /\bproxy providers?\b/i,
  /\bclash subscriptions?\b/i,
  /\btraffic resale\b/i,
  /\bairport rankings?\b/i,
  /\bjichang\.gg\b/i,
  /\bmofa-guide\b/i,
  /\bairport-recommendations-2026\b/i,
  /\bhy2\b/i,
];

const requiredFields = [
  'name',
  'slug',
  'repository',
  'category',
  'projectType',
  'status',
  'ownership',
  'featured',
  'homeOrder',
  'summary',
] as const;

export function validateProjectDocuments(
  documents: readonly ProjectDocument[],
  approvedRepositories: readonly string[],
): ProjectValidationIssue[] {
  const issues: ProjectValidationIssue[] = [];
  const approved = new Set(approvedRepositories);
  const seenSlugs = new Set<string>();
  const seenRepositories = new Set<string>();

  if (documents.length !== Object.keys(expectedProjects).length) {
    issues.push({
      file: 'src/content/projects',
      message: `Expected 8 project documents, found ${documents.length}.`,
    });
  }

  for (const document of documents) {
    validateDocument(document, approved, seenSlugs, seenRepositories, issues);
  }

  for (const slug of Object.keys(expectedProjects)) {
    if (!seenSlugs.has(slug)) {
      issues.push({ file: `${slug}.mdx`, message: `Required project is missing: ${slug}.` });
    }
  }

  return issues;
}

function validateDocument(
  document: ProjectDocument,
  approved: ReadonlySet<string>,
  seenSlugs: Set<string>,
  seenRepositories: Set<string>,
  issues: ProjectValidationIssue[],
) {
  for (const field of requiredFields) {
    if (!frontmatterValue(document.content, field)) {
      issues.push({ file: document.file, message: `Missing required field: ${field}.` });
    }
  }
  if (!/^tags:\s*$/m.test(document.content) || !/^\s+-\s+.+$/m.test(document.content)) {
    issues.push({ file: document.file, message: 'Project must define at least one tag.' });
  }

  const slug = frontmatterValue(document.content, 'slug');
  const repository = frontmatterValue(document.content, 'repository');
  if (!slug || !repository) return;

  if (seenSlugs.has(slug)) {
    issues.push({ file: document.file, message: `Duplicate project slug: ${slug}.` });
  }
  if (seenRepositories.has(repository.toLowerCase())) {
    issues.push({ file: document.file, message: `Duplicate repository: ${repository}.` });
  }
  seenSlugs.add(slug);
  seenRepositories.add(repository.toLowerCase());

  if (document.file !== `${slug}.mdx`) {
    issues.push({ file: document.file, message: `Filename must match slug: ${slug}.mdx.` });
  }
  if (!approved.has(repository)) {
    issues.push({ file: document.file, message: `Repository is not approved: ${repository}.` });
  }

  for (const pattern of prohibitedContent) {
    if (pattern.test(document.content)) {
      issues.push({
        file: document.file,
        message: `Prohibited website content matched ${pattern.source}.`,
      });
    }
  }

  const expected = expectedProjects[slug];
  if (!expected) {
    issues.push({ file: document.file, message: `Unexpected project slug: ${slug}.` });
    return;
  }

  validateExpectedFields(document, expected, issues);
  validateScreenshotFields(document, slug, issues);
}

function validateExpectedFields(
  document: ProjectDocument,
  expected: ExpectedProject,
  issues: ProjectValidationIssue[],
) {
  const expectedFields = {
    repository: expected.repository,
    category: expected.category,
    ownership: expected.ownership,
    featured: expected.featured,
    homeOrder: expected.homeOrder,
  };

  for (const [field, value] of Object.entries(expectedFields)) {
    if (frontmatterValue(document.content, field) !== value) {
      issues.push({ file: document.file, message: `${field} must be ${value}.` });
    }
  }

  if (expected.riskNotice && !frontmatterValue(document.content, 'riskNotice')) {
    issues.push({ file: document.file, message: 'System-changing tools require a riskNotice.' });
  }
  if (expected.credits && !frontmatterValue(document.content, 'credits')) {
    issues.push({ file: document.file, message: 'Community projects require visible credits.' });
  }
  if (expected.screenshot && !frontmatterValue(document.content, 'screenshot')) {
    issues.push({
      file: document.file,
      message: 'FavGrove requires its approved project screenshot.',
    });
  }
}

function validateScreenshotFields(
  document: ProjectDocument,
  slug: string,
  issues: ProjectValidationIssue[],
) {
  const fields = [
    'screenshot',
    'screenshotAvif',
    'screenshotAlt',
    'screenshotWidth',
    'screenshotHeight',
    'screenshotSource',
  ] as const;
  const values = Object.fromEntries(
    fields.map((field) => [field, frontmatterValue(document.content, field)]),
  );
  const populated = fields.filter((field) => values[field] !== undefined).length;
  if (populated === 0) return;
  if (populated !== fields.length) {
    issues.push({
      file: document.file,
      message: 'Project screenshots require WebP, AVIF, alt text, dimensions, and source.',
    });
    return;
  }

  if (
    !values.screenshot?.startsWith(`/projects/${slug}/`) ||
    !values.screenshot.endsWith('.webp')
  ) {
    issues.push({ file: document.file, message: 'Screenshot must be a local project WebP asset.' });
  }
  if (
    !values.screenshotAvif?.startsWith(`/projects/${slug}/`) ||
    !values.screenshotAvif.endsWith('.avif')
  ) {
    issues.push({ file: document.file, message: 'Screenshot AVIF must be a local project asset.' });
  }
  if ((values.screenshotAlt?.length ?? 0) < 24) {
    issues.push({
      file: document.file,
      message: 'Screenshot alt text must describe the interface.',
    });
  }
  if (!isPositiveInteger(values.screenshotWidth) || !isPositiveInteger(values.screenshotHeight)) {
    issues.push({
      file: document.file,
      message: 'Screenshot dimensions must be positive integers.',
    });
  }
  if (!values.screenshotSource?.startsWith('https://github.com/')) {
    issues.push({ file: document.file, message: 'Screenshot source must be an HTTPS GitHub URL.' });
  }
}

function isPositiveInteger(value: string | undefined): boolean {
  return typeof value === 'string' && /^\d+$/.test(value) && Number(value) > 0;
}
