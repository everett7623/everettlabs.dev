import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { approvedRepositories } from '../src/utils/approved-repositories.ts';
import {
  assessDiscoveryRepo,
  renderCandidateReport,
  sortCandidates,
  type DiscoveryRepoInput,
} from './candidate-discovery.ts';

const reportsDirectory = fileURLToPath(new URL('../.codex/reports', import.meta.url));

interface GitHubListRepo {
  full_name?: unknown;
  name?: unknown;
  description?: unknown;
  language?: unknown;
  homepage?: unknown;
  stargazers_count?: unknown;
  forks_count?: unknown;
  topics?: unknown;
  fork?: unknown;
  archived?: unknown;
  pushed_at?: unknown;
  license?: unknown;
}

async function fetchJson(url: string, token?: string): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'everettlabs-candidate-discovery',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
}

function parseRepo(value: GitHubListRepo): DiscoveryRepoInput | null {
  if (typeof value.full_name !== 'string' || typeof value.name !== 'string') return null;
  if (typeof value.fork !== 'boolean' || typeof value.archived !== 'boolean') return null;
  if (typeof value.pushed_at !== 'string' || typeof value.stargazers_count !== 'number')
    return null;
  if (typeof value.forks_count !== 'number') return null;

  const topics = Array.isArray(value.topics)
    ? value.topics.filter((topic): topic is string => typeof topic === 'string')
    : [];

  let license: string | null = null;
  if (value.license && typeof value.license === 'object' && value.license !== null) {
    const spdx = (value.license as { spdx_id?: unknown }).spdx_id;
    license = typeof spdx === 'string' && spdx !== 'NOASSERTION' ? spdx : null;
  }

  return {
    fullName: value.full_name,
    name: value.name,
    description: typeof value.description === 'string' ? value.description : null,
    language: typeof value.language === 'string' ? value.language : null,
    license,
    homepage:
      typeof value.homepage === 'string' && value.homepage.length > 0 ? value.homepage : null,
    stars: value.stargazers_count,
    forks: value.forks_count,
    topics,
    fork: value.fork,
    archived: value.archived,
    pushedAt: value.pushed_at,
  };
}

async function listPublicRepos(token?: string): Promise<DiscoveryRepoInput[]> {
  const repos: DiscoveryRepoInput[] = [];

  for (let page = 1; page <= 10; page += 1) {
    const url = `https://api.github.com/users/everett7623/repos?per_page=100&page=${page}&sort=updated`;
    const payload = await fetchJson(url, token);
    if (!Array.isArray(payload) || payload.length === 0) break;

    for (const entry of payload) {
      if (!entry || typeof entry !== 'object') continue;
      const parsed = parseRepo(entry as GitHubListRepo);
      if (parsed) repos.push(parsed);
    }

    if (payload.length < 100) break;
  }

  return repos;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const generatedAt = new Date().toISOString();
  const repos = await listPublicRepos(token);
  const candidates = sortCandidates(
    repos
      .map((repo) => assessDiscoveryRepo(repo, approvedRepositories))
      .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null),
  );

  mkdirSync(reportsDirectory, { recursive: true });
  const stamp = generatedAt.slice(0, 10);
  const reportPath = join(reportsDirectory, `project-candidates-${stamp}.md`);
  const report = renderCandidateReport(candidates, generatedAt);
  writeFileSync(reportPath, report);

  const latestPath = join(reportsDirectory, 'project-candidates-latest.md');
  writeFileSync(latestPath, report);

  console.log(`Discovered ${candidates.length} candidates.`);
  console.log(`Wrote ${reportPath}`);
  console.log(`Wrote ${latestPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
