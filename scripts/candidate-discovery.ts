import { isBlockedCandidateText, isExcludedFromDiscovery } from './blocked-repositories.ts';

export type CandidatePriority = 'P0' | 'P1' | 'P2' | 'watch' | 'skip';

export interface DiscoveryRepoInput {
  fullName: string;
  name: string;
  description: string | null;
  language: string | null;
  license: string | null;
  homepage: string | null;
  stars: number;
  forks: number;
  topics: readonly string[];
  fork: boolean;
  archived: boolean;
  pushedAt: string;
}

export interface CandidateAssessment {
  repository: string;
  priority: CandidatePriority;
  reason: string;
  description: string | null;
  language: string | null;
  license: string | null;
  homepage: string | null;
  stars: number;
  pushedAt: string;
}

const STALE_MS = 365 * 24 * 60 * 60 * 1000;

const knownPriorities: Readonly<Record<string, { priority: CandidatePriority; reason: string }>> = {
  'everett7623/wordpress-theme-rackora': {
    priority: 'P0',
    reason: 'Pairs with Halo Rackora; clear product description and active maintenance.',
  },
  'everett7623/rackora': {
    priority: 'P1',
    reason: 'Brand site for Rackora themes; prefer an external link on the existing project page.',
  },
  'everett7623/vpsknow-stock': {
    priority: 'P2',
    reason: 'Infrastructure product fit; maturity and licensing still need README review.',
  },
  'everett7623/domainmonitor': {
    priority: 'watch',
    reason: 'Tooling intent present; description missing and activity is low.',
  },
  'everett7623/pttools': {
    priority: 'watch',
    reason: 'Utility repo without a clear public product brief.',
  },
  'everett7623/frankimg': {
    priority: 'watch',
    reason: 'Image host experiment; needs a clearer product brief before listing.',
  },
};

export function assessDiscoveryRepo(
  repo: DiscoveryRepoInput,
  approvedRepositories: readonly string[],
  now = new Date(),
): CandidateAssessment | null {
  const repository = repo.fullName;
  const approved = new Set(approvedRepositories.map((item) => item.toLowerCase()));

  if (repo.fork || repo.archived) return null;
  if (approved.has(repository.toLowerCase())) return null;
  if (isExcludedFromDiscovery(repository)) return null;
  if (isBlockedCandidateText(repo.name, repo.description, repo.topics)) return null;

  const pushedAt = Date.parse(repo.pushedAt);
  const stale = Number.isNaN(pushedAt) || now.getTime() - pushedAt > STALE_MS;
  const emptyShell = !repo.description?.trim() && stale;

  if (emptyShell) return null;

  const known = knownPriorities[repository.toLowerCase()];
  if (known) {
    return {
      repository,
      priority: known.priority,
      reason: known.reason,
      description: repo.description,
      language: repo.language,
      license: repo.license,
      homepage: repo.homepage,
      stars: repo.stars,
      pushedAt: repo.pushedAt,
    };
  }

  if (!repo.description?.trim()) {
    return {
      repository,
      priority: 'watch',
      reason: 'Public non-fork repository without a description; needs editorial review.',
      description: repo.description,
      language: repo.language,
      license: repo.license,
      homepage: repo.homepage,
      stars: repo.stars,
      pushedAt: repo.pushedAt,
    };
  }

  return {
    repository,
    priority: 'watch',
    reason: 'Not on the curated shortlist; review before whitelist consideration.',
    description: repo.description,
    language: repo.language,
    license: repo.license,
    homepage: repo.homepage,
    stars: repo.stars,
    pushedAt: repo.pushedAt,
  };
}

const priorityRank: Record<CandidatePriority, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  watch: 3,
  skip: 4,
};

export function sortCandidates(candidates: readonly CandidateAssessment[]): CandidateAssessment[] {
  return [...candidates].sort((left, right) => {
    const byPriority = priorityRank[left.priority] - priorityRank[right.priority];
    if (byPriority !== 0) return byPriority;
    const byPush = Date.parse(right.pushedAt) - Date.parse(left.pushedAt);
    if (byPush !== 0) return byPush;
    return right.stars - left.stars;
  });
}

export function renderCandidateReport(
  candidates: readonly CandidateAssessment[],
  generatedAt: string,
): string {
  const lines = [
    '# Everett Labs project candidate report',
    '',
    `Generated at: ${generatedAt}`,
    '',
    'This report never auto-lists projects. Editorial MDX and the whitelist remain the source of truth.',
    'Airport, proxy-subscription, and bypass repositories are filtered out.',
    '',
  ];

  if (candidates.length === 0) {
    lines.push('No candidates matched the discovery rules.', '');
    return `${lines.join('\n')}`;
  }

  lines.push('| Priority | Repository | Language | Stars | Pushed | Reason |');
  lines.push('| --- | --- | --- | ---: | --- | --- |');

  for (const candidate of candidates) {
    const description = candidate.description?.replaceAll('|', '\\|') ?? '';
    lines.push(
      `| ${candidate.priority} | \`${candidate.repository}\` | ${candidate.language ?? '—'} | ${candidate.stars} | ${candidate.pushedAt.slice(0, 10)} | ${candidate.reason}${description ? ` — ${description}` : ''} |`,
    );
  }

  lines.push('');
  return `${lines.join('\n')}`;
}
