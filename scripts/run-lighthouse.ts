import { spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import { printLighthouseSummary, resolveLighthouseOutputDirectory } from './lighthouse-summary';

const lighthouseArguments = process.argv.slice(2);
const result = spawnSync(
  process.execPath,
  ['node_modules/@lhci/cli/src/cli.js', 'autorun', ...lighthouseArguments],
  {
    env: {
      ...process.env,
      CHROME_PATH: process.env.LIGHTHOUSE_CHROME_PATH ?? chromium.executablePath(),
    },
    stdio: 'inherit',
  },
);

if (result.error) throw result.error;

const exitCode = result.status ?? 1;
if (exitCode === 0) {
  printLighthouseSummary(resolveLighthouseOutputDirectory(lighthouseArguments));
}

process.exitCode = exitCode;
