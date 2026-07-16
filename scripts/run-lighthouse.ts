import { spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';

const result = spawnSync(
  process.execPath,
  ['node_modules/@lhci/cli/src/cli.js', 'autorun', ...process.argv.slice(2)],
  {
    env: {
      ...process.env,
      CHROME_PATH: process.env.LIGHTHOUSE_CHROME_PATH ?? chromium.executablePath(),
    },
    stdio: 'inherit',
  },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
