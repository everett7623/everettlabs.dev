# Monthly site maintenance runbook

Cadence: first day of each month (GitHub Actions cron `0 2 1 * *` UTC) plus manual
`workflow_dispatch` when needed. Automation never publishes new projects.

## Automated jobs

Workflow: `.github/workflows/monthly-maintenance.yml`

1. **Sync GitHub snapshot** — runs `npm run sync:github` for the approved whitelist and opens a
   PR that only touches `src/generated/github-projects.json` and
   `src/generated/github-sync-meta.json`.
2. **Discover candidates** — runs `npm run discover:candidates`, uploads
   `.codex/reports/project-candidates-*.md` as an artifact. Airport / proxy / bypass repos are
   filtered by `scripts/blocked-repositories.ts`.
3. **Production health** — probes external links and runs
   `npm run audit:lighthouse:production`. Failures upload reports; the job does not edit code.

## Human / agent checklist

### 1. Snapshot PR

- [ ] Review the monthly metadata PR diff (stars, forks, releases, licenses only).
- [ ] Merge after CI is green.
- [ ] Confirm `validate:github` reports a fresh sync age.

### 2. Candidate report

- [ ] Download the candidate artifact or run `npm run discover:candidates` locally.
- [ ] Decide for each candidate: whitelist + MDX, external link only, watch, or ignore.
- [ ] Never add blocked repositories (`hy2`, airport lists, Clash subscription guides, etc.).

### 3. Editorial content refresh

For every approved project:

- [ ] Compare GitHub description / homepage / latest release with MDX frontmatter and body.
- [ ] Keep VPS Scripts focused on ops, diagnostics, and automation — not proxy deployment.
- [ ] Keep Nezha Cleaner and DistroLift risk notices; keep NodeLoc Bench Credits.
- [ ] Update About, Coffee payment addresses, and command-palette labels only when facts change.

### 4. SEO / GEO

- [ ] Keep `public/llms.txt` summaries identical to MDX `summary` fields.
- [ ] After add/rename/remove: sitemap, robots (`OAI-SearchBot`), JSON-LD, internal links,
      `validate:site`.
- [ ] Do not invent FAQ, ratings, user counts, or launch dates for generative search.

### 5. UI / accessibility

- [ ] Prefer real local screenshots when a verifiable source exists; never fabricate UI.
- [ ] Spot-check mobile overflow, visible focus, Escape-to-close, 44×44 touch targets.
- [ ] No emoji in UI copy; respect `prefers-reduced-motion`.

### 6. Dependencies

- [ ] `npm outdated` and `npm audit` — patch high-severity issues only in this cadence.
- [ ] Astro major upgrades are a separate task with official integration version checks.

### 7. Acceptance

```bash
npm run validate:static
npm run typecheck
npm run test
npm run build
```

After merge to `main`:

- [ ] Wait for GitHub Actions PR Validation on `main`.
- [ ] Wait for Cloudflare Builds production deploy.
- [ ] Confirm homepage, a project detail page, robots, sitemap, 404, and security headers.
- [ ] Production Lighthouse Performance / Accessibility / Best Practices / SEO ≥ 0.95.

## Local commands

| Command | Purpose |
| --- | --- |
| `npm run sync:github` | Refresh committed GitHub snapshot + sync meta (`GITHUB_TOKEN` required) |
| `npm run discover:candidates` | Write a filtered candidate report under `.codex/reports/` |
| `npm run validate:links:external` | Probe external URLs |
| `npm run audit:lighthouse:production` | Audit the live HTTPS site |

Optional age overrides for local work:

- `GITHUB_SNAPSHOT_WARN_AGE_DAYS` (default `45`)
- `GITHUB_SNAPSHOT_MAX_AGE_DAYS` (default `90`)
