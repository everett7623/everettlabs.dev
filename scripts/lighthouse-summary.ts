import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface LighthouseSummary {
  url: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRecord(parent: JsonRecord, key: string): JsonRecord {
  const value = parent[key];
  if (!isRecord(value)) throw new Error(`Lighthouse report is missing ${key}.`);
  return value;
}

function readNumber(parent: JsonRecord, key: string): number {
  const value = parent[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Lighthouse report has an invalid ${key}.`);
  }
  return value;
}

function readAuditValue(audits: JsonRecord, key: string): number {
  return readNumber(readRecord(audits, key), 'numericValue');
}

export function parseLighthouseSummary(entry: unknown, report: unknown): LighthouseSummary {
  if (!isRecord(entry) || typeof entry.url !== 'string') {
    throw new Error('Lighthouse manifest contains an invalid URL.');
  }
  if (!isRecord(report)) throw new Error('Lighthouse report must be an object.');

  const summary = readRecord(entry, 'summary');
  const audits = readRecord(report, 'audits');

  return {
    url: entry.url,
    performance: readNumber(summary, 'performance'),
    accessibility: readNumber(summary, 'accessibility'),
    bestPractices: readNumber(summary, 'best-practices'),
    seo: readNumber(summary, 'seo'),
    firstContentfulPaint: readAuditValue(audits, 'first-contentful-paint'),
    largestContentfulPaint: readAuditValue(audits, 'largest-contentful-paint'),
    totalBlockingTime: readAuditValue(audits, 'total-blocking-time'),
    cumulativeLayoutShift: readAuditValue(audits, 'cumulative-layout-shift'),
  };
}

export function formatLighthouseSummary(summary: LighthouseSummary): string {
  const score = (value: number) => Math.round(value * 100);
  const seconds = (value: number) => `${(value / 1000).toFixed(1)}s`;

  return [
    summary.url,
    `P ${score(summary.performance)}`,
    `A ${score(summary.accessibility)}`,
    `BP ${score(summary.bestPractices)}`,
    `SEO ${score(summary.seo)}`,
    `FCP ${seconds(summary.firstContentfulPaint)}`,
    `LCP ${seconds(summary.largestContentfulPaint)}`,
    `TBT ${Math.round(summary.totalBlockingTime)}ms`,
    `CLS ${summary.cumulativeLayoutShift.toFixed(3)}`,
  ].join(' | ');
}

export function resolveLighthouseOutputDirectory(arguments_: string[]): string {
  const inlineConfig = arguments_.find((argument) => argument.startsWith('--config='));
  const configIndex = arguments_.indexOf('--config');
  const separateConfig = configIndex >= 0 ? arguments_[configIndex + 1] : undefined;
  const configPath =
    inlineConfig?.slice('--config='.length) ?? separateConfig ?? '.lighthouserc.json';
  const config = JSON.parse(readFileSync(resolve(configPath), 'utf8')) as unknown;

  if (!isRecord(config)) throw new Error('Lighthouse config must be an object.');
  const ci = readRecord(config, 'ci');
  const upload = readRecord(ci, 'upload');
  const outputDirectory = upload.outputDir;
  if (typeof outputDirectory !== 'string' || outputDirectory.length === 0) {
    throw new Error('Lighthouse config is missing ci.upload.outputDir.');
  }

  return resolve(outputDirectory);
}

export function printLighthouseSummary(outputDirectory: string): void {
  const manifest = JSON.parse(
    readFileSync(resolve(outputDirectory, 'manifest.json'), 'utf8'),
  ) as unknown;
  if (!Array.isArray(manifest)) throw new Error('Lighthouse manifest must be an array.');

  console.log('\nLighthouse summary');
  for (const entry of manifest) {
    if (!isRecord(entry) || typeof entry.jsonPath !== 'string') {
      throw new Error('Lighthouse manifest contains an invalid report path.');
    }
    const report = JSON.parse(readFileSync(entry.jsonPath, 'utf8')) as unknown;
    console.log(`- ${formatLighthouseSummary(parseLighthouseSummary(entry, report))}`);
  }
}
