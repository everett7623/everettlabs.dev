import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { approvedRepositories } from '../src/utils/approved-repositories.ts';
import { parseGitHubMetadataSnapshot } from '../src/utils/github-metadata.ts';
import type { GitHubProjectMeta } from '../src/types/github.ts';
import {
  mergeGitHubMetadata,
  parseGitHubRepository,
  parseLatestRelease,
} from './github-metadata.ts';

const outFile = join(
  fileURLToPath(new URL('../src/generated/github-projects.json', import.meta.url)),
);

async function fetchJson(url: string, token?: string): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchRepo(repo: string, token?: string): Promise<GitHubProjectMeta> {
  const base = `https://api.github.com/repos/${repo}`;
  const data = await fetchJson(base, token);

  let latestRelease: string | null = null;
  try {
    latestRelease = parseLatestRelease(await fetchJson(`${base}/releases/latest`, token));
  } catch {
    // Repository may not have releases.
  }

  return parseGitHubRepository(repo, data, latestRelease);
}

function readCachedMetadata(): GitHubProjectMeta[] {
  try {
    const value: unknown = JSON.parse(readFileSync(outFile, 'utf-8'));
    return parseGitHubMetadataSnapshot(value);
  } catch (error) {
    console.warn(
      'Unable to read the existing GitHub metadata snapshot:',
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('GITHUB_TOKEN not set. Skipping live GitHub sync; existing snapshot preserved.');
    return;
  }

  const results: GitHubProjectMeta[] = [];
  for (const repo of approvedRepositories) {
    try {
      results.push(await fetchRepo(repo, token));
    } catch (err) {
      console.error(`Failed to fetch ${repo}:`, err instanceof Error ? err.message : String(err));
    }
  }

  const merged = mergeGitHubMetadata(approvedRepositories, readCachedMetadata(), results);
  writeFileSync(outFile, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(
    `Synced ${results.length} repositories; preserved ${merged.length - results.length} cached entries.`,
  );
}

main().catch((err) => {
  console.error(err);
  // Never fail the build because of an API failure.
  process.exit(0);
});
