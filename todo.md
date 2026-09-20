# Todo

## Custom domain migration to anthonysko.com (2026-09-21, ADR-007)

Code and docs are migrated locally and `npm run build:all` is green (no old host or base path left in `dist/`). Nothing is committed or pushed yet.

- [ ] Anthony: review the diff, then commit
- [ ] Namecheap → Advanced DNS: four `A` records for `@` (185.199.108/109/110/111.153), `CNAME www` → `antskoloz.github.io`, optional TXT `_github-pages-challenge-antskoloz` from github.com/settings/pages; remove parking records
- [ ] Repo Settings → Pages: custom domain `anthonysko.com`, wait for the certificate, tick **Enforce HTTPS**
- [ ] Push (only when Anthony says so) and confirm the Actions deploy is green
- [ ] Redeploy the OAuth Worker (`cd oauth-worker && npx wrangler deploy`) so `anthonysko.com` is allowed; test login at https://anthonysko.com/admin/
- [ ] Add `https://anthonysko.com/` as a new Google Search Console + Bing property, resubmit `sitemap.xml`, `sitemap-index.xml` and the Decline Code Lookup sitemap
- [ ] Check the GA4/GTM data-stream URL and any other place that lists the old address (LinkedIn profile, email signature)
- [ ] Later, drop `antskoloz.github.io` from `ALLOWED_DOMAINS` in `oauth-worker/wrangler.toml`

## Free marketing tools sprint (weekend 2026-09-19/20)

Spec: [specs/free-tools.md](specs/free-tools.md). One commit per tool, including its homepage cards (EN/FR/DE) and sitemap entry.

## Saturday
- [x] Tool 1: `projects/ab-test-calculator/` — stats.js + tests, UI, disclaimer/badge, GA4
- [x] Homepage: "Free tools" sub-block + card styles + Tool 1 card (EN/FR/DE)
- [x] Tool 2: `projects/chi-square-calculator/` + card (EN/FR/DE)

## Sunday
- [x] Tool 3: `projects/marketing-roi-calculator/` + card (EN/FR/DE)
- [x] Tool 4: `projects/utm-builder/` + card (EN/FR/DE)
- [ ] Full check: `npm run build:all`, browser pass on each tool and all 3 homepages
- [ ] Push (only when Anthony says so) and confirm the Actions deploy is green

## Rework (requested after review)
- [x] Tool 1 (`ab-test-calculator`) business-friendly rework: simplified inputs, headline verdicts, range bar, glossary
- [x] Tool 2 (`chi-square-calculator`) business-friendly rework: group rows, bars, "who stands out", glossary
- [x] Update homepage cards (EN/FR/DE) to the new plain wording

## Next tools (chosen 2026-09-20; one commit each, including cards EN/FR/DE + sitemap)
- [x] Tool 5: `projects/saas-metrics-calculator/` — calc.js + tests, UI, disclaimer/badge, GA4, cards, sitemap, projects.md list
- [x] Tool 6: `projects/rice-prioritizer/` — same checklist
- [x] Retitle the homepage tools block "Free tools for marketers, product managers and finance teams" and add a bold disclaimer sentence (EN/FR/DE)
- [x] Share & favorites bar on all 6 tools and every blog post (ADR-006); required for every new tool from now on
- [x] Tool 7: `projects/break-even-pricing-calculator/` — calc.js + tests, UI incl. share bar, card EN/FR/DE, sitemap, projects.md list
- [x] Homepage: retitle section to "Free tools" and move Decline Code Lookup to the last card (EN/FR/DE)
- [x] Rename the "Work" nav label (and the hero "See my work" button) to "Free tools" everywhere (homepages EN/FR/DE, tool pages, blog and Decline layouts)
- [ ] Decide whether Decline Code Lookup (Astro app, own layout) should get the share bar too
- [ ] Bench for later: Funnel What-If, Approval-Rate Uplift Value, attribution comparison, VAT (FR/DE)

## Admin: import a pre-written Markdown post (2026-09-20)
- [x] `public/admin/import.html` — reads a local `.md` file, opens GitHub's own "create file" screen with the `src/content/blog/` path (and, for shorter posts, the body) pre-filled, clipboard-copy fallback for longer posts; linked from inside Decap CMS via `registerAdditionalLink` in `public/admin/index.html`; documented in specs/blog.md
- [ ] Anthony to test end-to-end (pick a real `.md` file, confirm the GitHub tab opens correctly pre-filled or with content on the clipboard, commit, confirm it shows up in Decap's Blog list and on the live site) — could not be tested live from this session (no browser/GitHub-login access here)

## Tool 8 (chosen 2026-09-20 — finance/educational)
- [x] Tool 8: `projects/company-valuation-calculator/` — WACC + free cash flow + DCF + EPS combined into one worked-example tool (calc.js + tests, UI incl. share bar, prominent educational/not-investment-advice notice, disclaimer/badge, GA4), cards EN/FR/DE, sitemap, specs/free-tools.md + specs/projects.md updated
- [ ] Anthony to spot-check the tool in a browser (no headless-browser tool was available to verify visually while building it — logic was verified via calc.test.mjs and a manual pipeline simulation instead)

## Carried over
- [ ] Verify https://anthonysko.com/projects/decline-code-lookup/ is live after the deploy
- [ ] Delete the standalone `antskoloz/decline-code-lookup` repo (its old URLs will 404 — no redirect is possible from a deleted Pages site)
- [ ] Submit `projects/decline-code-lookup/sitemap-index.xml` to Google Search Console / Bing Webmaster Tools
- [ ] Anthony to review the disclaimer wording
