export interface GitHubSyncMeta {
  syncedAt: string;
}

export function parseGitHubSyncMeta(value: unknown): GitHubSyncMeta {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('GitHub sync meta must be an object.');
  }

  const syncedAt = (value as { syncedAt?: unknown }).syncedAt;
  if (typeof syncedAt !== 'string' || Number.isNaN(Date.parse(syncedAt))) {
    throw new Error('GitHub sync meta has an invalid syncedAt timestamp.');
  }

  return { syncedAt };
}

export interface SnapshotAgePolicy {
  warnAfterDays: number;
  failAfterDays: number;
  now?: Date;
}

export type SnapshotAgeResult =
  | { status: 'ok'; ageDays: number }
  | { status: 'warn'; ageDays: number; message: string }
  | { status: 'fail'; ageDays: number; message: string };

export function evaluateSnapshotAge(
  syncedAt: string,
  policy: SnapshotAgePolicy,
): SnapshotAgeResult {
  const syncedMs = Date.parse(syncedAt);
  if (Number.isNaN(syncedMs)) {
    return {
      status: 'fail',
      ageDays: Number.POSITIVE_INFINITY,
      message: 'GitHub sync meta has an invalid syncedAt timestamp.',
    };
  }

  const now = policy.now ?? new Date();
  const ageDays = (now.getTime() - syncedMs) / (24 * 60 * 60 * 1000);

  if (ageDays > policy.failAfterDays) {
    return {
      status: 'fail',
      ageDays,
      message: `GitHub metadata snapshot is ${ageDays.toFixed(1)} days old (limit ${policy.failAfterDays}). Run npm run sync:github.`,
    };
  }

  if (ageDays > policy.warnAfterDays) {
    return {
      status: 'warn',
      ageDays,
      message: `GitHub metadata snapshot is ${ageDays.toFixed(1)} days old (warn after ${policy.warnAfterDays}).`,
    };
  }

  return { status: 'ok', ageDays };
}

export function resolveSnapshotAgeLimits(env: NodeJS.ProcessEnv = process.env): {
  warnAfterDays: number;
  failAfterDays: number;
} {
  const failAfterDays = Number.parseInt(env.GITHUB_SNAPSHOT_MAX_AGE_DAYS ?? '90', 10);
  const warnAfterDays = Number.parseInt(env.GITHUB_SNAPSHOT_WARN_AGE_DAYS ?? '45', 10);

  if (!Number.isFinite(failAfterDays) || failAfterDays <= 0) {
    throw new Error('GITHUB_SNAPSHOT_MAX_AGE_DAYS must be a positive integer.');
  }
  if (!Number.isFinite(warnAfterDays) || warnAfterDays <= 0) {
    throw new Error('GITHUB_SNAPSHOT_WARN_AGE_DAYS must be a positive integer.');
  }
  if (warnAfterDays > failAfterDays) {
    throw new Error('GITHUB_SNAPSHOT_WARN_AGE_DAYS must be <= GITHUB_SNAPSHOT_MAX_AGE_DAYS.');
  }

  return { warnAfterDays, failAfterDays };
}
