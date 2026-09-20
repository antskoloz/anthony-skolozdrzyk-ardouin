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

## ADR-003: `projects/` folder with one self-contained app per subfolder

**Date:** 2026-09-19
**Status:** Accepted

**Context:** Decline Code Lookup lived in its own repository with its own GitHub Pages site, and Anthony wants future projects to live in this repo instead, one subfolder each, with the standalone repo deleted.

**Options considered:**
1. Merge project code into the root Astro app (shared `src/`, one build).
2. npm workspaces with a shared lockfile.
3. Independent subfolders, each built on its own by a small script, all published under `/projects/<name>/`.

**Decision:** Option 3. Projects keep their own dependencies and tooling (they may not all be Astro), the root site is untouched by them, and one script (`scripts/build-projects.mjs`) plus one workflow step publish them. The project's Astro `base` moves to `/anthony-skolozdrzyk-ardouin/projects/decline-code-lookup`, and it was imported with `git subtree` so its history survives the old repo's deletion. Contract in [specs/projects.md](specs/projects.md).

**Consequences:** Project URLs change, and the old `antskoloz.github.io/decline-code-lookup/` URLs stop working once the standalone repo is deleted (GitHub Pages cannot redirect from a deleted repo), so existing inbound links and search rankings for the old URLs are lost. CI build time grows with each project. Projects share nothing with the root site, so a design or tracking change to the root does not propagate to them.

---

## ADR-004: Free marketing tools as static vanilla projects, English-only, homepage cards trilingual

**Date:** 2026-09-19
**Status:** Accepted

**Context:** Anthony wants to build his personal brand with free calculators for marketing people (A/B test sample size and confidence, chi-square, ROAS/CAC/LTV, UTM builder), each in its own `projects/` subfolder and highlighted on the homepage when it ships, always labelled free and carrying a legal disclaimer.

**Options considered:**
1. One Astro app per tool (like Decline Code Lookup).
2. One combined "tools" app with a page per tool.
3. One static vanilla HTML/CSS/JS folder per tool, no build step.

**Decision:** Option 3. Each tool is independent (as [specs/projects.md](specs/projects.md) requires), a calculator needs no framework, and static folders are copied without `npm ci`/`npm run build`, so CI time does not grow (the consequence flagged in ADR-003). Each tool carries its own copy of the small shared CSS and stats code rather than importing across projects. Further decisions: tool UIs are English-only while homepage cards are translated in EN/FR/DE; tool pages load the existing GA4 gtag (`G-QXP44186J4`) and state in the disclaimer that inputs never leave the browser; the homepage gets a "Free tools" grid inside the Work section; every tool and card carries a "Free tool" badge and the disclaimer. Details in [specs/free-tools.md](specs/free-tools.md).

**Consequences:** Stats code is duplicated across Tools 1 and 2, so a bug fix must be applied to both copies (mitigated by the same reference-value test in each). Tool pages are English while the FR/DE homepages link to them. Analytics on the tools means the disclaimer must keep mentioning it. The legal disclaimer wording is a sensible default, not legal advice, and is for Anthony to confirm.

---

## ADR-005: Plain language first for the free statistical tools

**Date:** 2026-09-19
**Status:** Accepted

**Context:** After review, Anthony found the first versions of the A/B Test Calculator and the Chi-Square Calculator too "geeky" for ordinary marketers: statistical vocabulary (confidence level, power, minimum detectable effect, one-sided test, χ², degrees of freedom, expected counts, Cramér's V) was in the main inputs and results.

**Options considered:**
1. Keep the tools as analyst tools and add glossary text only.
2. Rework inputs, results and page copy to business language, keep the exact same statistics underneath, and move technical output into collapsed details.
3. Remove the statistics that are hard to explain.

**Decision:** Option 2. The maths and the tested `stats.js` modules do not change (a small adjusted-residuals function is added for "which group stands out"). What changes is the interface: fewer required inputs with defaults and presets, expert options collapsed, a headline verdict, plain-English explanations with the luck framing rather than "1 − p", a range visual, "what to do next", and a concept glossary on the page. The principles are in [specs/free-tools.md](specs/free-tools.md) and apply to any future statistical tool. The Chi-Square tool keeps its folder and URL (people search for "chi-square calculator") but its headline speaks about groups.

**Consequences:** More page copy to maintain and translate on the homepage cards. Some expert controls are one click further away. Presets (small / medium / large improvement) are a judgement call and are labelled as such. The "stands out" list is descriptive and is not corrected for multiple comparisons; the page says so.

---

## ADR-006: Share and favorites bar on every free tool and blog post

**Date:** 2026-09-20
**Status:** Accepted

**Context:** Anthony wants visitors to be able to pass each tool and post on to their network or save it, and wants this on every tool and post by default from now on, without third-party scripts.

**Options considered:**
1. Third-party share widgets (AddToAny, ShareThis, platform SDKs).
2. Plain links styled as buttons pointing at each network's public share URL, plus a small first-party script for copy-link and a bookmark hint.
3. Only the browser's native share sheet (Web Share API).

**Decision:** Option 2. The share links carry the canonical URL and title in their `href`, so they work with JavaScript disabled and add no tracking or page weight. The Web Share API is not used because it is missing on many desktop browsers. A page cannot create a bookmark, so "Add to favorites" shows the right keyboard shortcut or menu steps for the visitor's platform. Share clicks are sent to the existing GA4 tag. The block lives in every free tool's `index.html` with its own `share.js` (tools share no code, ADR-003/004) and in the blog layout as `ShareBar.astro`. Details in [specs/free-tools.md](specs/free-tools.md) and [specs/blog.md](specs/blog.md).

**Consequences:** Each tool carries its own copy of the bar and script, so a change must be applied to every copy (a rollout script or search-and-replace does it). The share URLs of LinkedIn, X, Facebook and WhatsApp can change on their side and are not under our control. Decline Code Lookup, which is an Astro app with its own layout, is not covered yet.

---

## ADR-002: Cloudflare Worker OAuth proxy + GitHub Actions Pages deploy

**Date:** 2026-09-13
**Status:** Accepted

**Context:** Two new pieces of infrastructure are needed:
1. Decap CMS's `github` backend needs an OAuth proxy — GitHub Pages can't run server code to complete the OAuth handshake itself.
2. Introducing an Astro build step means GitHub Pages can no longer serve `main` directly — something has to run `npm run build` and publish `dist/`.

**Decision:**
1. Deploy the open-source [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) Worker script (MIT, vendored into `oauth-worker/src/index.js`) as a **Cloudflare Worker** (free tier, no other infra needed). It implements the same OAuth handshake protocol Decap/Netlify CMS expect, plus CSRF protection and a `site_id` domain allowlist (`ALLOWED_DOMAINS`, set to `antskoloz.github.io` in `oauth-worker/wrangler.toml`). Requires a manually-created GitHub OAuth App (Settings → Developer settings → OAuth Apps — no API for this) with its callback URL pointing at the Worker, and the OAuth App's client ID/secret set as Worker secrets via `wrangler secret put`.
2. Add `.github/workflows/deploy.yml` to build with `npm ci && npm run build` and deploy `dist/` via `actions/upload-pages-artifact` + `actions/deploy-pages`. This requires flipping the repo's Pages source from "Deploy from branch (main)" to "GitHub Actions" in Settings → Pages.

**Status:** Deployed 2026-09-13 at `https://anthony-site-cms-auth.anthony-skolozdrzyk.workers.dev`, referenced from `public/admin/config.yml`'s `backend.base_url`. The Pages-source flip (part 2) is confirmed done: pushes to `main` trigger the "Deploy to GitHub Pages" Actions workflow, which completes successfully and the live site reflects its output within minutes (last verified 2026-09-20 against commit `f99ddb3`).

**Consequences:** Publishing a blog post now depends on the GitHub Actions workflow succeeding, not just a raw git push. `README.md`'s former "no build step" description no longer applies to the blog (it still applies to editing the homepage files directly). The Pages-source flip is a one-time manual/confirmed change, not something to redo per-deploy. The OAuth Worker is a separate deployable (`oauth-worker/`, its own `wrangler.toml`) — it is not part of the Astro build and is only redeployed when its own code changes.
