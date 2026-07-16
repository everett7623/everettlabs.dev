# everettlabs.dev

The official Everett Labs website — a dark, developer-focused, static site built with Astro, React, Tailwind CSS, and TypeScript.

## Overview

- **Framework:** Astro 7
- **Styling:** Tailwind CSS 4
- **Interactive islands:** React 19
- **Deployment target:** Cloudflare Workers Static Assets
- **Language:** English

## Scripts

```bash
# Node.js 22.12 or newer is required.
npm install
npm run dev          # Start the Astro dev server
npm run build        # Sync GitHub metadata (if GITHUB_TOKEN is set) and build
npm run preview      # Preview the production build
npm run typecheck    # Run astro check
npm run test         # Run Vitest
npm run test:e2e     # Run Playwright against a production preview
npm run sync:github  # Update src/generated/github-projects.json
npm run generate:og  # Generate local project Open Graph SVGs
npm run audit:lighthouse  # Audit the local production build at the 95+ target
npm run audit:lighthouse:production  # Audit the deployed HTTPS site, including Best Practices
npm run validate:static    # Run every non-build contract check and unit test
npm run validate:size      # Enforce project source-file line limits
npm run validate:projects  # Validate project MDX against approved whitelist
npm run validate:links     # Validate internal routes and external link contracts
npm run validate:links:external  # Also warn about temporarily unavailable external URLs
npm run validate:a11y     # Validate static accessibility contracts
npm run validate:github   # Validate cached GitHub metadata fields and whitelist
npm run validate:security  # Validate Cloudflare headers and CSP-compatible scripts
npm run validate:site     # Validate canonical URL, sitemap, manifest, and 404 contracts
```

## Project structure

- `src/content/projects/*.mdx` — project entries with frontmatter and descriptions
- `src/generated/github-projects.json` — build-time GitHub metadata snapshot
- `src/components` — Astro and React UI components
- `src/pages` — Astro pages (home, projects, about, coffee, 404)
- `public` — static assets, headers, manifest, favicon
- `public/projects` — locally hosted, optimized project screenshots
- `scripts` — build-time sync and validation scripts

## Configuration

Set `GITHUB_TOKEN` in the Cloudflare build environment to enable live GitHub metadata synchronization. The build will fall back to the committed snapshot if the token is missing or GitHub is unavailable.

## Deployment

```bash
npx wrangler deploy
```

See `wrangler.jsonc` for Cloudflare Workers Static Assets settings.
