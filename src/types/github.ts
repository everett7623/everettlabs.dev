export interface GitHubProjectMeta {
  repository: string;
  stars: number | null;
  forks: number | null;
  language: string | null;
  latestRelease: string | null;
  updatedAt: string;
  license: string | null;
  archived: boolean;
}
