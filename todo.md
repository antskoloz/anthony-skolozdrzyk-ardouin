# Todo (current sprint — weekend 2026-09-19/20, free marketing tools)

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
- [ ] Bench for later: Break-even & Pricing, Funnel What-If, Approval-Rate Uplift Value, attribution comparison, VAT (FR/DE)

## Carried over
- [ ] Verify https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/projects/decline-code-lookup/ is live after the deploy
- [ ] Delete the standalone `antskoloz/decline-code-lookup` repo (its old URLs will 404 — no redirect is possible from a deleted Pages site)
- [ ] Submit `projects/decline-code-lookup/sitemap-index.xml` to Google Search Console / Bing Webmaster Tools
- [ ] Anthony to review the disclaimer wording
