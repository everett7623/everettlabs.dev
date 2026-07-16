import type { GitHubProjectMeta } from '../src/types/github.ts';

export function mergeGitHubMetadata(
  approvedRepositories: readonly string[],
  cached: readonly GitHubProjectMeta[],
  fresh: readonly GitHubProjectMeta[],
): GitHubProjectMeta[] {
  const cachedByRepository = new Map(cached.map((item) => [item.repository.toLowerCase(), item]));
  const freshByRepository = new Map(fresh.map((item) => [item.repository.toLowerCase(), item]));

  return approvedRepositories.flatMap((repository) => {
    const key = repository.toLowerCase();
    const metadata = freshByRepository.get(key) ?? cachedByRepository.get(key);
    return metadata ? [{ ...metadata, repository }] : [];
  });
}

export function parseGitHubRepository(
  repository: string,
  value: unknown,
  latestRelease: string | null,
): GitHubProjectMeta {
  if (!isRecord(value)) {
    throw new Error('GitHub repository response must be an object.');
  }

  const stars = nullableNumber(value.stargazers_count, 'stargazers_count');
  const forks = nullableNumber(value.forks_count, 'forks_count');
  const updatedAt = nullableString(value.updated_at, 'updated_at');
  const archived = value.archived;

  if (!updatedAt) {
    throw new Error('GitHub repository response is missing updated_at.');
  }
  if (typeof archived !== 'boolean') {
    throw new Error('GitHub repository response has an invalid archived field.');
  }

  let license: string | null = null;
  if (value.license !== null && value.license !== undefined) {
    if (!isRecord(value.license)) {
      throw new Error('GitHub repository response has an invalid license field.');
    }
    license = nullableString(value.license.spdx_id, 'license.spdx_id');
  }

  return {
    repository,
    stars,
    forks,
    language: nullableString(value.language, 'language'),
    latestRelease,
    updatedAt,
    license,
    archived,
  };
}

export function parseLatestRelease(value: unknown): string | null {
  if (!isRecord(value)) {
    throw new Error('GitHub release response must be an object.');
  }
  return nullableString(value.tag_name, 'tag_name');
}

function nullableNumber(value: unknown, field: string): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`GitHub response has an invalid ${field} field.`);
  }
  return value;
}

function nullableString(value: unknown, field: string): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') {
    throw new Error(`GitHub response has an invalid ${field} field.`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
