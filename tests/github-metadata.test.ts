import { describe, expect, it } from 'vitest';
import {
  mergeGitHubMetadata,
  parseGitHubRepository,
  parseLatestRelease,
} from '../scripts/github-metadata.ts';
import type { GitHubProjectMeta } from '../src/types/github.ts';
import { parseGitHubMetadataSnapshot } from '../src/utils/github-metadata.ts';

function metadata(repository: string, stars: number): GitHubProjectMeta {
  return {
    repository,
    stars,
    forks: 0,
    language: 'TypeScript',
    latestRelease: null,
    updatedAt: '2026-07-16T00:00:00Z',
    license: 'MIT',
    archived: false,
  };
}

describe('mergeGitHubMetadata', () => {
  it('uses fresh data and preserves cached entries for failed repositories', () => {
    const approved = ['everettlabs/fresh', 'everettlabs/cached'];
    const cached = [metadata('everettlabs/fresh', 1), metadata('everettlabs/cached', 2)];
    const fresh = [metadata('everettlabs/fresh', 10)];

    expect(mergeGitHubMetadata(approved, cached, fresh)).toEqual([
      metadata('everettlabs/fresh', 10),
      metadata('everettlabs/cached', 2),
    ]);
  });

  it('keeps whitelist order and removes unapproved cached entries', () => {
    const approved = ['everettlabs/two', 'everettlabs/one'];
    const cached = [
      metadata('everettlabs/one', 1),
      metadata('everettlabs/two', 2),
      metadata('everettlabs/removed', 3),
    ];

    expect(mergeGitHubMetadata(approved, cached, [])).toEqual([
      metadata('everettlabs/two', 2),
      metadata('everettlabs/one', 1),
    ]);
  });
});

describe('GitHub response parsing', () => {
  it('accepts the approved repository fields', () => {
    expect(
      parseGitHubRepository(
        'everettlabs/project',
        {
          stargazers_count: 12,
          forks_count: 3,
          language: 'TypeScript',
          updated_at: '2026-07-16T00:00:00Z',
          license: { spdx_id: 'MIT' },
          archived: false,
        },
        'v1.0.0',
      ),
    ).toEqual({
      repository: 'everettlabs/project',
      stars: 12,
      forks: 3,
      language: 'TypeScript',
      latestRelease: 'v1.0.0',
      updatedAt: '2026-07-16T00:00:00Z',
      license: 'MIT',
      archived: false,
    });
  });

  it('rejects malformed repository responses', () => {
    expect(() =>
      parseGitHubRepository(
        'everettlabs/project',
        { updated_at: '2026-07-16T00:00:00Z', archived: 'false' },
        null,
      ),
    ).toThrow('invalid archived');
  });

  it('parses release tags without accepting invalid values', () => {
    expect(parseLatestRelease({ tag_name: 'v1.2.3' })).toBe('v1.2.3');
    expect(() => parseLatestRelease({ tag_name: 123 })).toThrow('invalid tag_name');
  });
});

describe('GitHub snapshot parsing', () => {
  it('accepts complete cached metadata', () => {
    expect(parseGitHubMetadataSnapshot([metadata('everettlabs/project', 4)])).toEqual([
      metadata('everettlabs/project', 4),
    ]);
  });

  it('rejects duplicate repositories regardless of case', () => {
    expect(() =>
      parseGitHubMetadataSnapshot([
        metadata('everettlabs/project', 1),
        metadata('EverettLabs/Project', 2),
      ]),
    ).toThrow('duplicate repository');
  });

  it('rejects invalid counts and timestamps', () => {
    expect(() =>
      parseGitHubMetadataSnapshot([{ ...metadata('everettlabs/project', 1), stars: -1 }]),
    ).toThrow('invalid stars');
    expect(() =>
      parseGitHubMetadataSnapshot([
        { ...metadata('everettlabs/project', 1), updatedAt: 'not-a-date' },
      ]),
    ).toThrow('invalid updatedAt');
  });
});
