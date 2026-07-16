import type { GitHubProjectMeta } from '../types/github.ts';

export function parseGitHubMetadataSnapshot(value: unknown): GitHubProjectMeta[] {
  if (!Array.isArray(value)) {
    throw new Error('GitHub metadata snapshot must be an array.');
  }

  const repositories = new Set<string>();
  return value.map((item, index) => {
    const metadata = parseMetadataItem(item, index);
    const key = metadata.repository.toLowerCase();
    if (repositories.has(key)) {
      throw new Error(
        `GitHub metadata snapshot contains duplicate repository ${metadata.repository}.`,
      );
    }
    repositories.add(key);
    return metadata;
  });
}

function parseMetadataItem(value: unknown, index: number): GitHubProjectMeta {
  if (!isRecord(value)) {
    throw new Error(`GitHub metadata item ${index} must be an object.`);
  }

  const repository = requiredString(value.repository, index, 'repository');
  if (!/^[^/\s]+\/[^/\s]+$/.test(repository)) {
    throw new Error(`GitHub metadata item ${index} has an invalid repository.`);
  }

  const updatedAt = requiredString(value.updatedAt, index, 'updatedAt');
  if (Number.isNaN(Date.parse(updatedAt))) {
    throw new Error(`GitHub metadata item ${index} has an invalid updatedAt.`);
  }
  if (typeof value.archived !== 'boolean') {
    throw new Error(`GitHub metadata item ${index} has an invalid archived.`);
  }

  return {
    repository,
    stars: nullableCount(value.stars, index, 'stars'),
    forks: nullableCount(value.forks, index, 'forks'),
    language: nullableString(value.language, index, 'language'),
    latestRelease: nullableString(value.latestRelease, index, 'latestRelease'),
    updatedAt,
    license: nullableString(value.license, index, 'license'),
    archived: value.archived,
  };
}

function requiredString(value: unknown, index: number, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`GitHub metadata item ${index} has an invalid ${field}.`);
  }
  return value;
}

function nullableString(value: unknown, index: number, field: string): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new Error(`GitHub metadata item ${index} has an invalid ${field}.`);
  }
  return value;
}

function nullableCount(value: unknown, index: number, field: string): number | null {
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`GitHub metadata item ${index} has an invalid ${field}.`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
