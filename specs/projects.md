# Spec: Projects

## Scope

A `projects/` folder in this repo holds one subfolder per project. Each project is self-contained and is published on the same GitHub Pages site under `/projects/<name>/` of `https://anthonysko.com`. Projects are surfaced on the homepage only through the hand-written "Work" section (`public/index.html`, `fr/`, `de/`); adding a folder does not add a card automatically.

## Folder contract

`projects/<name>/` must be one of:

| Kind | Detected by | How it is published |
| --- | --- | --- |
| Built app | has a `package.json` | `npm ci` (or `npm install` if there is no lockfile), then `npm run build`; the resulting `dist/` is copied to `dist/projects/<name>/` |
| Static files | no `package.json` | the folder is copied as-is to `dist/projects/<name>/` |

Rules:
- A built app's `build` script must output to `dist/` inside its own folder.
- The app must be configured for its published base path, `/projects/<name>/`. For Astro: `site: 'https://anthonysko.com'` and `base: '/projects/<name>'`.
- A project folder does not contain its own `.github/workflows/` (only the root workflow deploys) and does not import from the root site or from other projects.
- Dependencies live in the project's own `node_modules/` (already git-ignored); the root `package.json` is not a workspace.

## Build and deploy

`npm run build:all` = root `astro build` followed by `scripts/build-projects.mjs`, which must run after the root build because that build empties `dist/`. `.github/workflows/deploy.yml` runs `build:all` and deploys `dist/`. The root `tsconfig.json` excludes `projects/` so the projects' own TypeScript is not type-checked as part of the root site.

## SEO

Each project keeps its own sitemap, `robots.txt` and canonical URLs, all generated for the base path above. Crawlers only honour `robots.txt` at the domain root, so each project's sitemap is also listed in `public/robots.txt`. Single-page static tools (see [free-tools.md](free-tools.md)) have no sitemap of their own: their URL is listed directly in `public/sitemap.xml`.

## Current projects

- `decline-code-lookup` — Astro glossary of card decline codes (40 codes, ~50 pages, JSON-LD, `llms.txt`). Imported from the former standalone repo `antskoloz/decline-code-lookup` with its git history; previously served at `antskoloz.github.io/decline-code-lookup/`. Its header reuses the brand site's logo and navigation (linking back to the homepage sections, with "Work" highlighted) above a slim bar with the tool's own Glossary/About links; see `src/components/Header.astro`.
- Free marketing tools (static vanilla, one folder each): `ab-test-calculator`, `chi-square-calculator`, `marketing-roi-calculator`, `utm-builder`, `saas-metrics-calculator`, `rice-prioritizer`, `break-even-pricing-calculator`, `company-valuation-calculator` — behavior in [free-tools.md](free-tools.md), decision in [decisions.md](../decisions.md) ADR-004. Listed here as they ship.
