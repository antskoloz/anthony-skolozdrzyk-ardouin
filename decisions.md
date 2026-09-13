# Decisions

ADR log. Superseded decisions are marked as such, not deleted or edited in place.

---

## ADR-001: Astro scoped to `/blog` only, rest of the site untouched

**Date:** 2026-09-13
**Status:** Accepted

**Context:** The site needs a databaseless blog editable through a browser admin UI (Decap CMS), which commits Markdown files to the repo. Something has to render those Markdown files into HTML — the site currently has no templating system at all (plain static HTML/CSS/JS, no build step).

**Options considered:**
1. Full Astro rewrite of the whole site (homepage + blog).
2. Astro scoped only to `/blog`; existing `index.html`/`fr/`/`de/`/`assets/` moved byte-for-byte into Astro's `public/` folder.
3. A hand-rolled Node build script instead of Astro, keeping the "no framework" philosophy.

**Decision:** Option 2. The homepage pages already work and are SEO/GEO-tuned (JSON-LD, hreflang, OG tags) — rewriting them into Astro components for no functional gain carries real regression risk for zero benefit right now. Astro is also the officially-documented integration path for Decap CMS.

**Consequences:** The repo now has two coexisting page-generation mechanisms (plain files in `public/`, Astro-rendered files in `src/pages/blog/`). Anyone touching the homepage still just edits HTML directly; anyone touching the blog works through Astro/content collections. This asymmetry is intentional — see [architecture.md](architecture.md).

---

## ADR-002: Cloudflare Worker OAuth proxy + GitHub Actions Pages deploy

**Date:** 2026-09-13
**Status:** Accepted

**Context:** Two new pieces of infrastructure are needed:
1. Decap CMS's `github` backend needs an OAuth proxy — GitHub Pages can't run server code to complete the OAuth handshake itself.
2. Introducing an Astro build step means GitHub Pages can no longer serve `main` directly — something has to run `npm run build` and publish `dist/`.

**Decision:**
1. Deploy the open-source `decap-cms-oauth-provider` script as a **Cloudflare Worker** (free tier, no other infra needed). Requires a manually-created GitHub OAuth App (Settings → Developer settings → OAuth Apps — no API for this) with its callback URL pointing at the Worker, and the OAuth App's client ID/secret set as Worker secrets.
2. Add `.github/workflows/deploy.yml` to build with `npm ci && npm run build` and deploy `dist/` via `actions/upload-pages-artifact` + `actions/deploy-pages`. This requires flipping the repo's Pages source from "Deploy from branch (main)" to "GitHub Actions" in Settings → Pages.

**Consequences:** Publishing a blog post now depends on the GitHub Actions workflow succeeding, not just a raw git push. `README.md`'s former "no build step" description no longer applies to the blog (it still applies to editing the homepage files directly). The Pages-source flip is a one-time manual/confirmed change, not something to redo per-deploy.
