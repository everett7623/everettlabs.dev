/** Explicit repositories that must never appear on the public site. */
export const blockedRepositories = [
  'everett7623/hy2',
  'everett7623/airport-recommendations-2026',
  'everett7623/freego',
  'everett7623/tool',
  'everett7623/YToo',
  'everett7623/Fastlink',
  'everett7623/clash-pt-rules',
  'everett7623/jichang.gg',
  'everett7623/mofa-guide',
] as const;

/** Non-product repositories excluded from candidate discovery. */
export const excludedFromDiscovery = [
  'everett7623/everettlabs.dev',
  'everett7623/everett7623',
] as const;

/**
 * Name, description, and topic patterns that mark airport / proxy / bypass content.
 * Kept aligned with project-validation prohibited content.
 */
export const blockedContentPatterns: readonly RegExp[] = [
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
  /机场/,
  /科学上网/,
  /魔法上网/,
  /梯子网络推荐/,
  /\bclash[- ]?pt[- ]?rules\b/i,
];

const blockedRepositorySet = new Set(
  blockedRepositories.map((repository) => repository.toLowerCase()),
);

const excludedDiscoverySet = new Set(
  excludedFromDiscovery.map((repository) => repository.toLowerCase()),
);

export function isBlockedRepository(repository: string): boolean {
  return blockedRepositorySet.has(repository.toLowerCase());
}

export function isExcludedFromDiscovery(repository: string): boolean {
  const key = repository.toLowerCase();
  return blockedRepositorySet.has(key) || excludedDiscoverySet.has(key);
}

export function matchesBlockedContent(text: string): RegExp | undefined {
  return blockedContentPatterns.find((pattern) => pattern.test(text));
}

export function isBlockedCandidateText(
  name: string,
  description: string | null,
  topics: readonly string[],
): boolean {
  const haystack = [name, description ?? '', ...topics].join('\n');
  return matchesBlockedContent(haystack) !== undefined;
}
