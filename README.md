# everettlabs.dev

The official Everett Labs developer website. It is a static Astro site deployed to Cloudflare Workers Static Assets.

## Stack

- Astro 7 with TypeScript strict mode
- Tailwind CSS 4
- React 19 islands for stateful interactions only
- Astro Content Collections and MDX
- Cloudflare Workers Static Assets

## Requirements

- Node.js 22.12 or newer
- npm and the committed `package-lock.json`

## Local development

```bash
npm ci
npm run dev
```

Build and preview the production output:

```bash
npm run build
npm run preview
```

The build succeeds without `GITHUB_TOKEN` by using the committed GitHub metadata snapshot.

## Validation

Run the normal pre-commit checks:

```bash
npm run validate:static
npm run typecheck
npm run build
```

Additional checks:

| Command | Purpose |
| --- | --- |
| `npm run lint` | Run ESLint |
| `npm run format:check` | Check Prettier formatting |
| `npm run test` | Run Vitest unit and contract tests |
| `npm run test:e2e` | Run Playwright against a production preview |
| `npm run audit:lighthouse` | Audit the local production build |
| `npm run audit:lighthouse:production` | Audit the deployed HTTPS site |
| `npm run validate:links:external` | Probe external links without hiding transient failures |
| `npm run sync:github` | Refresh the committed GitHub metadata snapshot |
| `npm run generate:og` | Regenerate project Open Graph images |

`validate:static` includes linting, formatting, source-size limits, project contracts, internal links, accessibility, GitHub metadata, security, site deployment contracts, and unit tests.

## Project structure

| Path | Responsibility |
| --- | --- |
| `src/content/projects/` | Editorial MDX entries for approved projects |
| `src/generated/github-projects.json` | Validated build-time GitHub metadata snapshot |
| `src/components/` | Astro and React UI components |
| `src/pages/` | Static routes, including Coffee and the real 404 page |
| `src/utils/approved-repositories.ts` | Explicit public repository whitelist |
| `public/llms.txt` | Curated machine-readable index for generative search discovery |
| `public/` | Static assets, optimized screenshots, security headers, and site metadata |
| `scripts/` | Build-time generators and validation entry points |
| `tests/` | Vitest unit and contract tests |
| `e2e/` | Playwright browser coverage |
| `.codex/tasks/` | Active development task records |
| `.codex/tasks/archive/` | Completed task records grouped by month |

## GitHub metadata

`GITHUB_TOKEN` is optional and is used only by the build-time metadata sync. Never expose it through a public client environment variable. If the token is missing or GitHub is temporarily unavailable, the build preserves and validates `src/generated/github-projects.json`.

## Search discovery

Public routes use static HTML, canonical URLs, sitemap discovery, Open Graph metadata and JSON-LD.
`public/robots.txt` explicitly allows `OAI-SearchBot` and ordinary search crawlers, while
`public/llms.txt` provides a curated index of the studio, core pages and all approved projects.

The `llms.txt` file is a supplemental community format, not a ranking guarantee or a replacement
for visible page content. `npm run validate:site` verifies the crawler rules, the canonical project
links in `llms.txt`, sitemap configuration and index controls. See
[Google Search AI guidance](https://developers.google.com/search/docs/appearance/ai-features) and
[OpenAI's publisher guidance](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq).

## Deployment

Cloudflare Builds is connected to `everett7623/everettlabs.dev`:

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Non-production branch builds: enabled

Every push to `main` runs GitHub Actions and Cloudflare Builds. Pull request branches receive non-production builds. The Worker name and Account ID are pinned in `wrangler.jsonc`.

For an authorized manual fallback, verify the target account before deploying:

```bash
npx wrangler whoami
npx wrangler deploy
```

Production is served from `https://everettlabs.dev`; Cloudflare redirects HTTP requests to HTTPS.

## Generated local files

The following paths are ignored by Git and can be removed when cleaning the workspace:

- `.astro/`
- `.lighthouseci/`
- `.wrangler/`
- `dist/`
- `lighthouse-reports/`
- `playwright-report/`
- `test-results/`

They are recreated by Astro, Wrangler, Lighthouse, or Playwright. Keep `node_modules/` for normal local work; use `npm ci` to recreate it only when a clean dependency install is needed.

## Documentation

- `Everett Labs Developer Website.md` is the product and architecture specification.
- `AGENTS.md` contains the project development and safety rules.
- `.codex/tasks/website-v1-quality-2026-07-16.md` tracks the remaining v1 quality work.
