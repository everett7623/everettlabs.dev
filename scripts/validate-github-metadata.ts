import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { approvedRepositories } from '../src/utils/approved-repositories.ts';
import { parseGitHubMetadataSnapshot } from '../src/utils/github-metadata.ts';

const snapshotFile = fileURLToPath(
  new URL('../src/generated/github-projects.json', import.meta.url),
);

function main() {
  const value: unknown = JSON.parse(readFileSync(snapshotFile, 'utf-8'));
  const metadata = parseGitHubMetadataSnapshot(value);
  const actual = metadata.map((item) => item.repository.toLowerCase());
  const expected = approvedRepositories.map((repository) => repository.toLowerCase());

  const missing = expected.filter((repository) => !actual.includes(repository));
  const unexpected = actual.filter((repository) => !expected.includes(repository));
  if (missing.length > 0 || unexpected.length > 0) {
    if (missing.length > 0) console.error(`Missing cached repositories: ${missing.join(', ')}`);
    if (unexpected.length > 0) {
      console.error(`Unapproved cached repositories: ${unexpected.join(', ')}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${metadata.length} cached GitHub metadata entries.`);
}

main();
