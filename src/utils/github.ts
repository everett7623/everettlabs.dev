import snapshot from '../generated/github-projects.json';
import type { GitHubProjectMeta } from '../types/github.ts';
import { parseGitHubMetadataSnapshot } from './github-metadata.ts';

export type { GitHubProjectMeta } from '../types/github.ts';

function loadProjects(): GitHubProjectMeta[] {
  return parseGitHubMetadataSnapshot(snapshot);
}

export function getRepoMeta(repository: string): GitHubProjectMeta | undefined {
  return loadProjects().find((r) => r.repository.toLowerCase() === repository.toLowerCase());
}
