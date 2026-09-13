# Plan

## Phase 1 — Homepage (done)

- [x] Trilingual (EN/FR/DE) static homepage, SEO/GEO-tuned (JSON-LD Person + FAQPage, hreflang, OG/Twitter tags, sitemap, robots.txt)
- [x] GTM analytics, Google Search Console verification

## Phase 2 — Blog + Decap CMS admin (in progress)

- [x] Scaffold Astro, scoped to `/blog` only — homepage moved into `public/` unchanged (see [decisions.md](decisions.md) ADR-001)
- [x] `blog` content collection, listing + post pages, RSS feed, blog-only sitemap
- [x] Decap CMS admin at `/admin` (GitHub backend, English-only `blog` collection)
- [x] GitHub Actions build+deploy workflow
- [x] Deploy Cloudflare Worker OAuth proxy + create GitHub OAuth App (see [decisions.md](decisions.md) ADR-002)
- [x] Fill in the real `base_url` in `public/admin/config.yml`
- [x] Flip repo Pages source to "GitHub Actions" in GitHub Settings → Pages
- [x] Push and confirm the Actions workflow deploys successfully — live at https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/
- [ ] Log into `/admin`, publish a first real post

## Phase 3 — Follow-ups (not started)

- [ ] Custom domain + `CNAME` (would require updating all absolute URLs across HTML/sitemap/robots/Astro config)
- [ ] Dedicated 1200×630 OG share image (currently reuses the headshot)
- [ ] Submit sitemap(s) to Google Search Console / Bing Webmaster Tools
