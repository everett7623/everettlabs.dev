import { describe, expect, it } from 'vitest';
import {
  isBlockedCandidateText,
  isBlockedRepository,
  isExcludedFromDiscovery,
} from '../scripts/blocked-repositories.ts';
import {
  assessDiscoveryRepo,
  renderCandidateReport,
  sortCandidates,
  type DiscoveryRepoInput,
} from '../scripts/candidate-discovery.ts';

const approved = ['everett7623/Linketry', 'everett7623/halo-theme-rackora'] as const;

function repo(overrides: Partial<DiscoveryRepoInput> = {}): DiscoveryRepoInput {
  return {
    fullName: 'everett7623/example',
    name: 'example',
    description: 'A useful developer tool',
    language: 'TypeScript',
    license: 'MIT',
    homepage: null,
    stars: 1,
    forks: 0,
    topics: [],
    fork: false,
    archived: false,
    pushedAt: '2026-10-01T00:00:00Z',
    ...overrides,
  };
}

describe('blocked repository rules', () => {
  it('blocks explicit airport and proxy repositories', () => {
    expect(isBlockedRepository('everett7623/hy2')).toBe(true);
    expect(isBlockedRepository('everett7623/airport-recommendations-2026')).toBe(true);
    expect(isExcludedFromDiscovery('everett7623/everettlabs.dev')).toBe(true);
  });

  it('detects blocked content in names, descriptions, and topics', () => {
    expect(isBlockedCandidateText('guide', '2026 机场推荐', [])).toBe(true);
    expect(isBlockedCandidateText('clash-pt-rules', null, [])).toBe(true);
    expect(isBlockedCandidateText('FavGrove', 'Local-first bookmarks', ['chrome-extension'])).toBe(
      false,
    );
  });
});

describe('assessDiscoveryRepo', () => {
  it('returns null for approved, forked, archived, and blocked repositories', () => {
    expect(assessDiscoveryRepo(repo({ fullName: 'everett7623/Linketry' }), approved)).toBeNull();
    expect(assessDiscoveryRepo(repo({ fork: true }), approved)).toBeNull();
    expect(assessDiscoveryRepo(repo({ archived: true }), approved)).toBeNull();
    expect(
      assessDiscoveryRepo(
        repo({
          fullName: 'everett7623/hy2',
          name: 'hy2',
          description: 'Hysteria 2 deploy scripts',
        }),
        approved,
      ),
    ).toBeNull();
  });

  it('ranks the curated shortlist priorities', () => {
    expect(
      assessDiscoveryRepo(
        repo({
          fullName: 'everett7623/wordpress-theme-rackora',
          name: 'wordpress-theme-rackora',
          description: 'Rackora WordPress theme',
        }),
        approved,
      ),
    ).toMatchObject({ priority: 'P0' });

    expect(
      assessDiscoveryRepo(
        repo({
          fullName: 'everett7623/Rackora',
          name: 'Rackora',
          description: 'Official site for Rackora themes',
        }),
        approved,
      ),
    ).toMatchObject({ priority: 'P1' });
  });

  it('drops empty shells that have been inactive for more than a year', () => {
    expect(
      assessDiscoveryRepo(
        repo({
          description: null,
          pushedAt: '2024-01-01T00:00:00Z',
        }),
        approved,
        new Date('2026-11-03T00:00:00Z'),
      ),
    ).toBeNull();
  });
});

describe('candidate report rendering', () => {
  it('sorts by priority then recency and renders markdown', () => {
    const sorted = sortCandidates([
      {
        repository: 'everett7623/watch-me',
        priority: 'watch',
        reason: 'review',
        description: 'tool',
        language: 'Go',
        license: null,
        homepage: null,
        stars: 0,
        pushedAt: '2026-09-01T00:00:00Z',
      },
      {
        repository: 'everett7623/wordpress-theme-rackora',
        priority: 'P0',
        reason: 'pair',
        description: 'theme',
        language: 'PHP',
        license: 'GPL-3.0',
        homepage: null,
        stars: 0,
        pushedAt: '2026-10-30T00:00:00Z',
      },
    ]);

    expect(sorted[0]?.repository).toBe('everett7623/wordpress-theme-rackora');
    expect(renderCandidateReport(sorted, '2026-11-03T00:00:00.000Z')).toContain('| P0 |');
    expect(renderCandidateReport(sorted, '2026-11-03T00:00:00.000Z')).toContain(
      'never auto-lists projects',
    );
  });
});
