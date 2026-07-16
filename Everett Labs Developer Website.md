下面是更新后的 **Everett Labs 官网开发文档 v1.0**。这版已经把 8 个 GitHub 项目和 `seedloc.com` 纳入首发范围，同时区分原创项目、基础设施工具和社区维护项目，避免自动混入机场相关仓库。

# Everett Labs Developer Website

## Product & Development Specification

**Project:** Everett Labs Official Website  
**Domain:** `everettlabs.dev`  
**Repository:** `everett7623/everettlabs.dev`  
**Website language:** English  
**Document version:** 1.0  
**Deployment target:** Cloudflare Workers Static Assets  
**Owner:** Everett Labs / Frank  
**GitHub identity:** `everett7623`  
**Primary contact:** Telegram `@jensfrank`

---

# 1. Project Overview

Everett Labs is an independent software studio and experimental engineering lab focused on practical open-source software, browser tools, WordPress plugins, Linux utilities, edge-native applications, and developer automation.

The website must not look like a conventional personal résumé, corporate agency template, or generic portfolio.

It should feel like a high-end developer laboratory:

- Precise
    
- Technical
    
- Experimental
    
- Dark and immersive
    
- Code-oriented
    
- Fast and restrained
    
- Clearly maintained by a real independent developer
    

The website will act as the central identity layer connecting:

- Everett Labs
    
- GitHub projects
    
- Product websites
    
- Open-source releases
    
- Technical writing on Seedloc
    
- Telegram contact
    
- Coffee and open-source support
    

---

# 2. Brand Positioning

## 2.1 Brand Name

**Everett Labs**

Do not use `Jensfrank Labs`, `Frank Labs`, or `Everett7623` as the primary website brand.

The personal identity may appear in the About section:

> Everett Labs is an independent software lab built by Frank.

## 2.2 Primary Positioning

> Independent software lab for useful tools, open systems, and edge-native experiments.

## 2.3 Supporting Description

> I build practical open-source software for the web, browsers, WordPress, and Linux — with an unreasonable attention to reliability, privacy, and detail.

## 2.4 Brand Principles

### Useful before impressive

Projects should solve real problems rather than exist only as technical demonstrations.

### Reliability over unnecessary complexity

Critical paths must remain understandable, testable, and difficult to break.

### Open by default

Projects should support inspection, self-hosting, modification, and long-term ownership whenever appropriate.

### Privacy-aware

Avoid unnecessary telemetry, tracking, remote processing, and data collection.

### Details matter

Good developer tools are often defined by small interactions, clear error handling, safe defaults, and thorough documentation.

---

# 3. Project Scope

## 3.1 Version 1.0 Includes

The initial release must include:

- English homepage
    
- Projects index
    
- Eight GitHub project pages
    
- Seedloc writing section
    
- About page
    
- Coffee support page
    
- GitHub profile integration
    
- Telegram contact
    
- Responsive desktop and mobile layouts
    
- Dark developer-focused design
    
- Command palette
    
- Build-time GitHub metadata synchronization
    
- SEO metadata
    
- Open Graph images
    
- Sitemap and robots configuration
    
- Cloudflare deployment
    
- Accessibility and reduced-motion support
    

## 3.2 Version 1.0 Does Not Include

The initial version must not include:

- User accounts
    
- Comments
    
- Database
    
- Admin dashboard
    
- Runtime GitHub API calls
    
- Newsletter system
    
- Embedded Telegram chat
    
- AI chatbot
    
- Full blog migration
    
- Airport recommendations
    
- Proxy subscription listings
    
- VPS affiliate rankings
    
- Automatic display of every public GitHub repository
    
- Heavy WebGL backgrounds
    
- Continuous matrix code rain
    
- Background audio
    

---

# 4. Content Inclusion Rules

The website must use a manual repository whitelist.

It must never automatically display all public repositories from the GitHub account.

## 4.1 Included Repository Whitelist

```ts
export const approvedRepositories = [
  "everett7623/Linketry",
  "everett7623/Globokit",
  "everett7623/FavGrove",
  "everett7623/Citeoryx",
  "everett7623/LinkVitals",
  "everett7623/Nezha-cleaner",
  "everett7623/debian-auto-upgrade",
  "everett7623/vps_scripts",
  "everett7623/nodeloc_vps_test",
] as const;
```

## 4.2 Excluded Content

Do not display repositories or content primarily related to:

- Airport recommendations
    
- Proxy subscriptions
    
- Proxy providers
    
- Clash subscription rules
    
- Traffic resale
    
- Bypass services
    
- Airport rankings
    
- Affiliate airport listings
    
- `jichang.gg`
    
- `mofa-guide`
    
- `airport-recommendations-2026`
    
- `hy2`
    
- Similar future repositories
    

Infrastructure, Linux administration, server benchmarking, system maintenance, and network diagnostics are allowed.

## 4.3 Special Handling for VPS Scripts

The `vps_scripts` repository contains a broad collection of Linux and server tools. The Everett Labs website must describe it as a Linux operations, diagnostics, benchmarking, and automation toolkit.

Do not highlight proxy deployment modules on `everettlabs.dev`.

## 4.4 Special Handling for NodeLoc Bench

`nodeloc_vps_test` is an aggregation of several community scripts and references the original NodeLoc project and multiple upstream authors. It must not be presented as a completely original Everett Labs product.

The project page must show:

```text
Project Type: Community-maintained aggregation
Ownership: Maintained fork / integration
Original ecosystem: NodeLoc
```

Upstream credits must remain visible.

---

# 5. Project Information Architecture

The projects should be divided into three groups.

## 5.1 Products

These are the main Everett Labs product-style projects:

1. Linketry
    
2. LinkVitals
    
3. FavGrove
    
4. GloboKit
    

## 5.2 Infrastructure Utilities

These are Linux, automation, maintenance, and server-related tools:

1. VPS Scripts
    
2. Nezha Cleaner
    
3. DistroLift
    
4. NodeLoc Bench
    

## 5.3 Writing

Technical writing remains hosted externally:

1. Seedloc
    

`seedloc.com` should be presented as the writing and technical notes channel, not as another software product.

---

# 6. Initial Project Catalog

## 6.1 Linketry

**Role:** Flagship project  
**Category:** Edge-native application  
**Status:** Active  
**Ownership:** Original  
**Repository:** `everett7623/Linketry`

### Short Description

> Self-hosted link management, analytics, and monitoring — built for stable redirects, data ownership, and long-term operation.

### Extended Description

> Linketry is an open-source link management platform for creating, organizing, monitoring, and analyzing short links across multiple domains. It combines a Cloudflare Workers backend with D1, KV, React, and TypeScript while keeping redirect reliability as the highest priority.

Linketry currently includes multi-domain link management, analytics, smart redirect rules, scheduled health checks, imports, backups, notification integrations, scoped API tokens, and audit logs.

Its core stack uses Cloudflare Workers, D1, KV, React, Vite, Tailwind CSS, and a shared TypeScript monorepo.

### Tags

```text
Cloudflare Workers
TypeScript
React
D1
KV
Self-hosted
Open Source
```

### Home Badge

```text
FLAGSHIP
```

---

## 6.2 LinkVitals

**Role:** Featured project  
**Category:** WordPress plugin  
**Status:** Active  
**Ownership:** Original  
**Repository:** `everett7623/LinkVitals`

### Short Description

> A privacy-friendly WordPress link health and SEO auditor for broken links, redirects, orphaned content, and external-link risks.

### Extended Description

> LinkVitals scans WordPress content for broken links, redirects, timeouts, SSL and DNS failures, invalid anchors, orphaned pages, and external-link SEO risks without adding a front-end tracking footprint.

The plugin supports scheduled scans, exports, repair history, rollback safeguards, and optional AI-assisted replacement suggestions.

### Tags

```text
WordPress
PHP
SEO
Link Health
Privacy
Open Source
```

---

## 6.3 FavGrove

**Role:** Featured project  
**Category:** Browser extension  
**Status:** Beta  
**Ownership:** Original  
**Repository:** `everett7623/FavGrove`

### Short Description

> A local-first bookmark workspace for Chrome and Edge, designed for large collections, fast search, link scanning, and safe cleanup.

### Extended Description

> FavGrove turns the browser bookmark manager into a full-screen workspace. It supports large bookmark collections, duplicate detection, link review, folder management, local backups, import and export, tags, and virtualized lists.

FavGrove keeps bookmark processing on the user's device and does not include developer-controlled analytics, cloud sync, or bookmark uploads.

Its stack includes React, TypeScript, Vite, Manifest V3, CRXJS, Zustand, Tailwind CSS, Vitest, and Playwright.

### Tags

```text
Browser Extension
Chrome
Edge
React
TypeScript
Local First
Privacy
```

### Status Badge

```text
BETA
```

---

## 6.4 GloboKit

**Role:** Featured project  
**Category:** Web application  
**Status:** Active  
**Ownership:** Original  
**Repository:** `everett7623/Globokit`

### Short Description

> A practical browser-based toolkit for international operations, logistics, calculations, barcodes, and everyday productivity.

### Extended Description

> GloboKit brings together practical calculation, logistics, text-processing, barcode, country-information, and international operations tools in one modern web interface.

Its existing tools cover quotation and profit calculations, landed costs, shipping calculations, pallet and container planning, barcode generation, text utilities, global country data, time zones, and holidays.

The application is built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, and Lucide.

### Tags

```text
Next.js
TypeScript
Web Tools
Logistics
Productivity
International Operations
```

---

## 6.5 VPS Scripts

**Role:** Infrastructure utility  
**Category:** Linux toolkit  
**Status:** Active  
**Ownership:** Original and integrated tools  
**Repository:** `everett7623/vps_scripts`

### Display Name

```text
VPS Scripts
```

### Short Description

> A modular Linux operations toolkit for system maintenance, diagnostics, benchmarking, environment setup, and server administration.

### Extended Description

> VPS Scripts provides a modular terminal interface for common Linux server tasks, including system inspection, updates, cleanup, conservative optimization, health checks, security checks, network diagnostics, performance benchmarks, and development environment setup.

The current project uses `vps.sh` as its primary launcher and maintains a legacy compatibility entry. The repository documents 34 validation scripts covering menu paths, safety, release metadata, privacy boundaries, and core installers.

### Website Content Restriction

Do not mention or visually promote proxy deployment functionality on Everett Labs.

### Tags

```text
Linux
Bash
DevOps
Diagnostics
Benchmarking
Automation
```

---

## 6.6 Nezha Cleaner

**Role:** Infrastructure utility  
**Category:** Linux maintenance  
**Status:** Stable  
**Ownership:** Original  
**Repository:** `everett7623/Nezha-cleaner`

### Display Name

```text
Nezha Cleaner
```

### Short Description

> A safety-focused removal utility for Nezha Agent and Dashboard installations across native and Docker environments.

### Extended Description

> Nezha Cleaner provides guided cleanup workflows for Nezha Agent, Nezha Dashboard, or both. It detects processes, services, cron jobs, installation paths, Docker containers, images, and residual files while applying explicit safety checks and confirmation steps.

The current version includes separate Agent and Dashboard flows, path tracing, Docker ownership verification, media-file protection, and final post-removal validation.

### Risk Notice

> Review destructive operations carefully. Create a backup or server snapshot before running system cleanup tools.

### Tags

```text
Linux
Bash
System Cleanup
Docker
Safety
Automation
```

---

## 6.7 DistroLift

**Role:** Infrastructure utility  
**Category:** Operating system maintenance  
**Status:** Stable  
**Ownership:** Original  
**Repository:** `everett7623/debian-auto-upgrade`

### Display Name

```text
DistroLift
```

Do not use `debian-auto-upgrade` as the primary visual title.

### Short Description

> A cautious, step-by-step upgrade tool for Debian and Ubuntu LTS servers.

### Extended Description

> DistroLift automates supported Debian and Ubuntu LTS upgrade paths with preflight checks, source backups, APT lock handling, low-memory protection, container detection, conservative GRUB handling, failure diagnostics, and staged upgrade controls.

The project supports adjacent Debian and Ubuntu LTS upgrades and includes stable-only safeguards, mirror selection, preflight checks, repair modes, cleanup, and controlled reboot behavior.

### Risk Notice

> Operating system upgrades can make a server inaccessible. Always prepare a full snapshot, application backup, and console access before proceeding.

### Tags

```text
Debian
Ubuntu
Bash
System Upgrade
VPS
Automation
```

---

## 6.8 NodeLoc Bench

**Role:** Community utility  
**Category:** Server benchmarking  
**Status:** Maintained  
**Ownership:** Community-maintained aggregation  
**Repository:** `everett7623/nodeloc_vps_test`

### Display Name

```text
NodeLoc Bench
```

### Short Description

> A community-maintained server benchmarking launcher that combines performance, IP, connectivity, routing, and network diagnostic tests.

### Extended Description

> NodeLoc Bench provides a single launcher for multiple server testing tools and produces a shareable result file after the benchmark completes.

Because the repository aggregates external tools, the website must include a visible Credits section and link to the upstream projects.

### Tags

```text
Linux
Benchmarking
Diagnostics
Community
Bash
VPS
```

### Required Badge

```text
COMMUNITY
```

---

## 6.9 Seedloc

**Role:** Writing platform  
**Category:** External blog  
**Status:** Active  
**Ownership:** Original editorial content  
**Website:** `seedloc.com`

### Short Description

> Technical notes, deployment guides, software experiments, and practical lessons from building and maintaining internet projects.

### Behavior

Seedloc must appear in:

- Homepage Writing section
    
- Main navigation as `Writing`
    
- Footer
    
- Command palette
    
- About page
    

The link should open in a new tab and display an external-link indicator.

Do not fetch and reproduce all Seedloc articles in Version 1.0.

A later version may display a small build-time RSS feed containing the three latest articles.

---

# 7. Website Structure

```text
/
├── Hero
├── Featured Projects
├── Infrastructure Utilities
├── Engineering Principles
├── Writing / Seedloc
├── About Preview
└── Coffee CTA

/projects
├── Product projects
├── Infrastructure utilities
└── Community projects

/projects/linketry
/projects/linkvitals
/projects/favgrove
/projects/globokit
/projects/vps-scripts
/projects/nezha-cleaner
/projects/distrolift
/projects/nodeloc-bench

/about
/coffee
/404
```

The `Writing` navigation item should link externally to Seedloc rather than creating an empty local blog.

---

# 8. Homepage Specification

## 8.1 Header

Left:

```text
EVERETT LABS
```

Right navigation:

```text
Projects
Writing ↗
About
GitHub ↗
```

Additional icon actions:

- Command palette
    
- Telegram
    
- Theme control only if a light mode is implemented
    

The initial version may remain dark-only.

## 8.2 Hero

### Eyebrow

```text
INDEPENDENT SOFTWARE LAB
```

### Heading

```text
Useful software for people
who would rather automate it.
```

### Supporting Copy

```text
I build open-source systems, browser tools, WordPress plugins,
and Linux utilities — engineered with privacy, reliability,
and long-term ownership in mind.
```

### Primary Actions

```text
Explore Projects
View on GitHub
```

### Secondary Action

```text
Follow on Telegram
```

## 8.3 Interactive Terminal

Desktop layouts should include a visual terminal panel:

```text
$ whoami
frank@everettlabs

$ current_focus
shipping useful software

$ stack
typescript / react / cloudflare / wordpress / linux

$ status
online · building in public
```

The terminal should be a controlled interface element, not a full terminal emulator.

Do not allow arbitrary command execution.

Suggested supported commands:

```text
help
projects
writing
github
telegram
coffee
clear
```

## 8.4 Featured Projects

Show four large cards:

1. Linketry
    
2. FavGrove
    
3. LinkVitals
    
4. GloboKit
    

Linketry should occupy the strongest visual position and receive the `FLAGSHIP` badge.

## 8.5 Infrastructure Utilities

Show four compact technical cards:

1. VPS Scripts
    
2. Nezha Cleaner
    
3. DistroLift
    
4. NodeLoc Bench
    

NodeLoc Bench must display the `COMMUNITY` badge.

## 8.6 Engineering Principles

Display four short principles:

```text
LOCAL WHEN POSSIBLE
RELIABILITY BEFORE COMPLEXITY
OPEN BY DEFAULT
DETAILS ARE THE PRODUCT
```

## 8.7 Writing Section

Heading:

```text
NOTES FROM THE LAB
```

Copy:

```text
Deployment notes, technical guides, experiments,
and lessons learned while building and maintaining software.
```

Action:

```text
Read Seedloc ↗
```

## 8.8 Coffee CTA

Heading:

```text
SUPPORT THE LAB
```

Copy:

```text
Open-source software runs on curiosity, late nights, and coffee.

If something here saved you time or solved a real problem,
you can help fund the next release.
```

Buttons:

```text
Buy Me a Coffee
Message Me
```

---

# 9. Project Detail Page

Every project page must follow a consistent structure.

## 9.1 Hero Area

Include:

- Project icon or wordmark
    
- Project name
    
- Short description
    
- Status badge
    
- Ownership badge where relevant
    
- GitHub link
    
- Live website link when available
    
- Release version when available
    

## 9.2 Project Overview

Explain:

- What problem it solves
    
- Who it is for
    
- Why it exists
    
- What makes it different
    

## 9.3 Key Capabilities

Use a maximum of six clear capabilities.

Do not copy the entire GitHub README into the website.

## 9.4 Engineering Notes

Show:

- Architecture
    
- Main technology stack
    
- Privacy model
    
- Deployment model
    
- Important engineering decisions
    

## 9.5 Screenshots

Use locally optimized WebP or AVIF images.

Do not hotlink screenshots from GitHub, image hosts, or project websites.

## 9.6 Current Status

Example:

```text
Status: Active
Release: v0.2.0
License: GPL-3.0
Primary language: TypeScript
```

## 9.7 Safety Notices

Linux scripts that modify systems must include a clearly visible warning.

Do not describe a destructive script as completely safe or risk-free.

---

# 10. Visual Design System

## 10.1 Design Direction

Use a restrained “precision cyberpunk” style.

The design should resemble:

- Developer infrastructure tooling
    
- Advanced code editors
    
- Technical control panels
    
- Experimental software laboratories
    
- Modern command-line interfaces
    

It should not resemble:

- Gaming websites
    
- Cryptocurrency landing pages
    
- Cheap hacker templates
    
- Neon nightclub posters
    
- Generic SaaS templates
    

## 10.2 Color System

```css
--background: #07080a;
--surface: #0d1014;
--surface-raised: #12161c;
--border: rgba(255, 255, 255, 0.09);
--text-primary: #f2f5f7;
--text-secondary: #9aa4af;
--text-muted: #65707c;
--accent-violet: #8b5cf6;
--accent-cyan: #22d3ee;
--status-green: #7ee787;
--warning: #fbbf24;
--danger: #fb7185;
```

Avoid using every accent color in the same component.

## 10.3 Typography

Recommended:

```text
Interface: Geist Sans
Code: Geist Mono
Optional display accent: Space Grotesk
```

Typography should carry most of the visual hierarchy.

Do not rely on excessive borders, gradients, or glow effects.

## 10.4 Grid and Background

Use:

- Subtle technical grid
    
- Very low-opacity noise
    
- Soft radial cursor light on desktop
    
- Section coordinate labels
    
- Small status indicators
    
- Minimal animated scan line where appropriate
    

Disable or simplify these effects on mobile and reduced-motion devices.

## 10.5 Motion

Use motion only for:

- Hero entrance
    
- Card hover response
    
- Command palette
    
- Terminal text
    
- Route transitions
    
- Small status indicators
    

Animation duration should generally remain between 150 and 400 milliseconds.

No continuous large-scale animation.

## 10.6 Project Cards

Cards should contain:

- Project number
    
- Name
    
- Description
    
- Status
    
- Stack tags
    
- GitHub star count when available
    
- Last meaningful release
    
- Arrow interaction
    

Hover behavior may reveal:

- Small code diff
    
- Architecture fragment
    
- Terminal command
    
- Project status line
    

---

# 11. Command Palette

Keyboard shortcuts:

```text
Ctrl + K
Cmd + K
```

Supported destinations:

```text
Go to Home
Browse Projects
Open Linketry
Open LinkVitals
Open FavGrove
Open GloboKit
Open VPS Scripts
Open Nezha Cleaner
Open DistroLift
Open NodeLoc Bench
Read Seedloc
Open GitHub
Open Telegram
Buy Me a Coffee
```

Requirements:

- Keyboard navigable
    
- Focus trapped while open
    
- Escape closes palette
    
- Search filters commands
    
- Screen-reader labels
    
- Mobile-accessible trigger
    

---

# 12. Technical Architecture

## 12.1 Recommended Stack

```text
Framework: Astro
Language: TypeScript
Styling: Tailwind CSS
Interactive islands: React
Animation: Motion
Content: Astro Content Collections + MDX
Syntax highlighting: Shiki
Icons: Lucide
Testing: Vitest + Playwright
Linting: ESLint
Formatting: Prettier
Deployment: Cloudflare Workers Static Assets
Analytics: Cloudflare Web Analytics
Package manager: npm
```

Astro should generate static HTML for all public pages.

React should only be used for interactive islands such as:

- Command palette
    
- Terminal interaction
    
- Project filters
    
- Cursor effects
    
- Small animated controls
    

Do not turn the entire site into a React single-page application.

## 12.2 Hosting Architecture

```text
GitHub repository
        │
        ├── GitHub Actions: validation
        │
        └── Cloudflare Builds: build and deployment
                    │
                    ├── Preview version
                    └── Production deployment
                              │
                              └── everettlabs.dev
```

Cloudflare Workers supports deploying static assets together with Worker configuration and serves matching static files without invoking Worker code by default. ([Cloudflare Docs](https://developers.cloudflare.com/workers/static-assets/ "Static Assets · Cloudflare Workers docs"))

Cloudflare Builds can connect directly to GitHub, build on pushes, create preview versions, and expose preview URLs before production promotion. ([Cloudflare Docs](https://developers.cloudflare.com/workers/ci-cd/builds/ "Builds · Cloudflare Workers docs")) ([Cloudflare Docs](https://developers.cloudflare.com/workers/ci-cd/builds/ "Builds · Cloudflare Workers docs"))

## 12.3 Vercel Position

Do not deploy the production Everett Labs website to both platforms.

Production:

```text
Cloudflare
```

Vercel Pro remains available for:

- GloboKit
    
- Existing VPSKnow deployment
    
- Next.js projects
    
- Temporary demos
    
- Other project previews
    

Everett Labs should not maintain a duplicate Vercel production deployment unless Cloudflare has a sustained operational issue.

---

# 13. Content Data Model

Each project should be stored as an MDX content entry.

Example frontmatter:

```yaml
name: Linketry
slug: linketry
repository: everett7623/Linketry
category: product
projectType: edge-application
status: active
ownership: original
featured: true
homeOrder: 1
website: https://linketry.com
license: open-source
tags:
  - Cloudflare Workers
  - TypeScript
  - React
  - D1
  - KV
accent: violet
```

Required TypeScript model:

```ts
export type ProjectStatus =
  | "active"
  | "stable"
  | "beta"
  | "experimental"
  | "maintained"
  | "archived";

export type ProjectOwnership =
  | "original"
  | "maintained"
  | "community";

export type ProjectCategory =
  | "product"
  | "infrastructure"
  | "community";

export interface ProjectEntry {
  name: string;
  slug: string;
  repository: string;
  category: ProjectCategory;
  status: ProjectStatus;
  ownership: ProjectOwnership;
  featured: boolean;
  homeOrder: number;
  website?: string;
  tags: string[];
  accent?: "violet" | "cyan" | "green";
}
```

Editorial MDX content is the source of truth.

GitHub metadata must only supplement the editorial content.

---

# 14. GitHub Metadata Synchronization

## 14.1 Build-Time Fields

Fetch these fields during builds:

- Stars
    
- Fork count
    
- Primary language
    
- Latest release
    
- Repository update time
    
- License
    
- Archived status
    

## 14.2 Runtime Restriction

Do not call the GitHub API from the visitor's browser.

## 14.3 Fallback Strategy

Generate:

```text
src/generated/github-projects.json
```

The synchronization script should:

1. Read the approved repository whitelist.
    
2. Fetch repository metadata.
    
3. Validate the response.
    
4. Merge only approved fields.
    
5. Write a generated snapshot.
    
6. Fall back to the committed snapshot if GitHub is unavailable.
    
7. Never remove project pages because of an API failure.
    

## 14.4 Build Secret

Use:

```text
GITHUB_TOKEN
```

This token must only be available in the Cloudflare build environment.

Do not expose it through client-side environment variables.

---

# 15. Suggested Project Structure

```text
everettlabs.dev/
├── .github/
│   └── workflows/
│       └── validate.yml
├── public/
│   ├── _headers
│   ├── _redirects
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── projects/
│       ├── linketry/
│       ├── linkvitals/
│       ├── favgrove/
│       ├── globokit/
│       ├── vps-scripts/
│       ├── nezha-cleaner/
│       ├── distrolift/
│       └── nodeloc-bench/
├── scripts/
│   ├── sync-github.ts
│   ├── validate-projects.ts
│   └── generate-og.ts
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── hero/
│   │   ├── projects/
│   │   ├── terminal/
│   │   ├── command-palette/
│   │   └── ui/
│   ├── content/
│   │   ├── config.ts
│   │   └── projects/
│   ├── generated/
│   │   └── github-projects.json
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── projects/
│   │   ├── about.astro
│   │   ├── coffee.astro
│   │   └── 404.astro
│   ├── styles/
│   └── utils/
├── astro.config.mjs
├── eslint.config.js
├── package.json
├── tsconfig.json
├── wrangler.jsonc
└── README.md
```

---

# 16. Cloudflare Configuration

Suggested configuration:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "everettlabs-dev",
  "compatibility_date": "2026-07-16",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

The Worker name in Cloudflare must match the `name` configured in Wrangler when using Cloudflare Builds. ([Cloudflare Docs](https://developers.cloudflare.com/workers/ci-cd/builds/ "Builds · Cloudflare Workers docs"))

## 16.1 Build Settings

```text
Build command:
npm ci && npm run build

Deploy command:
npx wrangler deploy

Output directory:
dist
```

## 16.2 Branch Rules

```text
main
└── Production deployment

Pull requests and non-main branches
└── Preview versions
```

---

# 17. Security Headers

Use a `public/_headers` file.

Cloudflare Workers Static Assets supports custom response headers through an `_headers` file located in the static asset directory. ([Cloudflare Docs](https://developers.cloudflare.com/workers/static-assets/headers/ "Headers · Cloudflare Workers docs"))

Initial configuration:

```text
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self' https://api.github.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

The final Content Security Policy must be tested against:

- Analytics
    
- Fonts
    
- GitHub metadata behavior
    
- External images
    
- Coffee payment assets
    

Prefer self-hosted fonts and images.

---

# 18. Coffee Support System

## 18.1 Footer Placement

Every page footer should contain:

```text
Support the lab · Buy me a coffee
```

## 18.2 Coffee Page

Route:

```text
/coffee
```

The page may support:

- Buy Me a Coffee external link
    
- GitHub Sponsors when available
    
- WeChat Pay QR code
    
- Alipay QR code
    

Payment QR codes must be stored as local static assets.

Do not expose unnecessary personal payment information.

## 18.3 Configuration

```ts
export const supportLinks = {
  buyMeACoffee: "",
  githubSponsors: "",
  telegram: "https://t.me/jensfrank",
  wechatQr: "/support/wechat.webp",
  alipayQr: "/support/alipay.webp",
};
```

Empty payment methods must not render buttons.

## 18.4 Coffee Copy

```text
Open-source software takes time, testing, documentation,
infrastructure, and a questionable amount of coffee.

If a project saved you time or helped you solve a problem,
your support helps keep future releases moving.
```

---

# 19. SEO Requirements

## 19.1 Page Titles

```text
Home:
Everett Labs — Independent Software Lab

Projects:
Projects — Everett Labs

About:
About Everett Labs

Coffee:
Buy Me a Coffee — Everett Labs

Project:
{Project Name} — Everett Labs
```

## 19.2 Metadata

Every page requires:

- Canonical URL
    
- Meta description
    
- Open Graph title
    
- Open Graph description
    
- Open Graph image
    
- Twitter card
    
- Structured data where appropriate
    

## 19.3 Open Graph

Generate project-specific images at:

```text
1200 × 630
```

Each image should contain:

- Everett Labs mark
    
- Project name
    
- One-line description
    
- Project category
    
- Technical grid background
    

## 19.4 Structured Data

Use:

- `Organization` or `Person` for Everett Labs
    
- `SoftwareApplication` for product pages
    
- `WebSite` for the homepage
    
- `ProfilePage` for About
    

Do not use review ratings or fabricated user counts.

---

# 20. Performance Requirements

Target production results:

```text
Lighthouse Performance: 95+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

Recommended limits:

```text
Initial JavaScript: below 100 KB compressed
Homepage images: below 800 KB total
Individual image: below 250 KB when practical
Cumulative Layout Shift: below 0.1
Largest Contentful Paint: below 2.5 seconds
```

Implementation rules:

- Static HTML by default
    
- React islands only where necessary
    
- Lazy-load below-the-fold media
    
- Self-host fonts
    
- Use AVIF/WebP
    
- Preload only critical fonts
    
- Avoid large client-side animation libraries where CSS is sufficient
    
- Disable cursor effects on touch devices
    
- Respect `prefers-reduced-motion`
    

---

# 21. Accessibility Requirements

The website must support:

- Full keyboard navigation
    
- Visible focus states
    
- Semantic headings
    
- Descriptive alt text
    
- Sufficient contrast
    
- Reduced-motion preference
    
- Screen-reader command palette labels
    
- Escape-to-close behavior
    
- No hover-only information
    
- Minimum touch target size of 44 × 44 pixels
    

Decorative terminal text must not create repetitive screen-reader noise.

---

# 22. Analytics and Privacy

Use Cloudflare Web Analytics only.

Do not add:

- Meta Pixel
    
- TikTok Pixel
    
- Advertising scripts
    
- Session replay
    
- Fingerprinting
    
- Unnecessary cookies
    

Track only:

- Page views
    
- Project link clicks
    
- GitHub outbound clicks
    
- Seedloc outbound clicks
    
- Telegram outbound clicks
    
- Coffee CTA clicks
    

Do not transmit payment QR interactions or sensitive visitor data.

---

# 23. Validation and Testing

## 23.1 Required Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "npm run sync:github && astro build",
    "preview": "astro preview",
    "lint": "eslint .",
    "typecheck": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "sync:github": "tsx scripts/sync-github.ts",
    "validate:projects": "tsx scripts/validate-projects.ts"
  }
}
```

## 23.2 Pull Request Validation

Every pull request must run:

```text
npm ci
npm run lint
npm run typecheck
npm run validate:projects
npm run test
npm run build
npm run test:e2e
```

## 23.3 Link Validation

Validate:

- Internal routes
    
- Approved GitHub repositories
    
- Product websites
    
- Seedloc
    
- Telegram
    
- Coffee links
    

A temporary GitHub or external-site failure should warn rather than automatically delete content.

---

# 24. Launch Acceptance Criteria

Version 1.0 is complete when:

- The site is entirely English.
    
- All eight approved projects have individual pages.
    
- Seedloc appears as the official writing channel.
    
- No airport recommendation project appears anywhere.
    
- VPS Scripts does not promote proxy modules.
    
- NodeLoc Bench is labeled as a community-maintained aggregation.
    
- Project metadata comes from a whitelist.
    
- GitHub API is not called from visitors' browsers.
    
- The site builds successfully without live GitHub access by using cached metadata.
    
- Command palette works with keyboard and mobile controls.
    
- Coffee CTA appears in every footer.
    
- Empty payment methods remain hidden.
    
- Telegram points to `@jensfrank`.
    
- All project screenshots are locally hosted.
    
- Mobile layout does not overflow.
    
- Reduced-motion mode is respected.
    
- Security headers are enabled.
    
- Sitemap, canonical URLs, and Open Graph metadata are generated.
    
- Cloudflare preview and production deployments work.
    
- No database or runtime API is required.
    

---

# 25. Development Phases

## Phase 1 — Foundation

- Create repository
    
- Initialize Astro and TypeScript
    
- Add Tailwind
    
- Add linting and formatting
    
- Configure Cloudflare
    
- Establish color and typography tokens
    
- Build core layout
    

## Phase 2 — Content System

- Define project schema
    
- Create eight MDX project entries
    
- Add project whitelist
    
- Add GitHub synchronization
    
- Add cached fallback
    
- Add Seedloc configuration
    

## Phase 3 — Main Interface

- Build header
    
- Build hero
    
- Build controlled terminal
    
- Build featured project cards
    
- Build infrastructure cards
    
- Build writing section
    
- Build footer and coffee CTA
    

## Phase 4 — Detail Pages

- Build reusable project layout
    
- Add screenshots
    
- Add engineering notes
    
- Add ownership and status badges
    
- Add safety notices
    
- Add project-specific SEO
    

## Phase 5 — Interaction

- Add command palette
    
- Add project filters
    
- Add restrained transitions
    
- Add reduced-motion behavior
    
- Add responsive terminal behavior
    

## Phase 6 — Quality

- Add unit tests
    
- Add Playwright flows
    
- Add accessibility checks
    
- Add link validation
    
- Optimize images
    
- Review bundle size
    
- Validate security headers
    

## Phase 7 — Deployment

- Connect GitHub repository to Cloudflare Builds
    
- Configure preview branches
    
- Configure production branch
    
- Add custom domain
    
- Test DNS and HTTPS
    
- Enable analytics
    
- Run final launch audit
    

---

# 26. Future Roadmap

Possible post-launch additions:

- Latest Seedloc articles from RSS
    
- Project release timeline
    
- Build log
    
- `/uses` page
    
- Public roadmap
    
- GitHub contribution visualization
    
- Project changelog feed
    
- Release notification subscription
    
- Status page
    
- Small experimental demos
    
- Project search
    
- Signed project release manifest
    

These features should not delay Version 1.0.

---

# 27. Final Homepage Footer

```text
© 2026 Everett Labs.

Built in public.
Deployed at the edge.

GitHub · Seedloc · Telegram · Buy Me a Coffee
```

Alternative technical footer line:

```text
ASTRO / TYPESCRIPT / CLOUDFLARE
SYSTEM STATUS: OPERATIONAL
```

---

# 28. Final Product Direction

Everett Labs should feel like a coherent software studio rather than a directory of unrelated repositories.

The website must prioritize:

1. Linketry as the flagship system.
    
2. FavGrove, LinkVitals, and GloboKit as developed products.
    
3. Linux utilities as a separate infrastructure collection.
    
4. Transparent attribution for community projects.
    
5. Seedloc as the long-form writing channel.
    
6. GitHub as the source-code destination.
    
7. Telegram as the direct contact channel.
    
8. Coffee support as a subtle, persistent footer action.
    

The final experience should communicate:

> This is not a template portfolio.  
> This is an active software laboratory.

这版最重要的调整是：**不再把所有项目混成同一种卡片**。Linketry 等 4 个项目负责建立产品品牌，4 个 Linux 工具负责体现技术深度，Seedloc 单独承担内容与写作入口。Cloudflare 原生 Git 集成已经能提供推送构建、版本和预览 URL，所以 Everett Labs 不需要为了 Preview 再维护一套 Vercel 部署。([Cloudflare Docs](https://developers.cloudflare.com/workers/ci-cd/builds/ "Builds · Cloudflare Workers docs"))