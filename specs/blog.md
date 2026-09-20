# Spec: Blog

## Scope

English-only. No FR/DE post translation (the rest of the site is trilingual; the blog deliberately is not — decided 2026-09-13).

## Content model

`src/content.config.ts` defines the `blog` collection (Content Layer API, `glob` loader over `src/content/blog/*.md`):

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `description` | string | yes | Used for meta description, OG/Twitter description, and the blog card excerpt |
| `pubDate` | date | yes | Coerced from any parseable date string |
| `updatedDate` | date | no | Rendered into `dateModified` in the `BlogPosting` JSON-LD when present |
| `heroImage` | string | no | Path under `/blog/uploads/` (see media config below) — plain string, not `astro:assets`, since Decap uploads directly to `public/` |
| `tags` | string[] | no, default `[]` | Rendered as pills, reused as JSON-LD `keywords` |
| `draft` | boolean | no, default `false` | Draft posts are filtered out of the listing, `[slug]` routes, sitemap, and RSS feed |

Post body is Markdown, rendered via Astro's `render()` into the `.prose` styled container in `src/pages/blog/[slug].astro`.

## Routes

- `/blog/` — listing, newest first, drafts excluded (`src/pages/blog/index.astro`)
- `/blog/<id>/` — individual post, `<id>` = Markdown filename without extension (`src/pages/blog/[slug].astro`)
- `/rss.xml` — full-content-free RSS feed (title/description/link/pubDate per item), drafts excluded
- Blog-only sitemap at `sitemap-index.xml` → `sitemap-0.xml` (via `@astrojs/sitemap`, filtered to `/blog/` paths) — kept separate from the hand-maintained `public/sitemap.xml` (homepage-only), both listed in `robots.txt`

## SEO/GEO per post

Every blog page (via `BlogLayout.astro`) gets: canonical URL, OG + Twitter tags, RSS `<link rel="alternate">`, and — for posts specifically — a `BlogPosting` JSON-LD block with `headline`, `datePublished`, `dateModified` (if set), `keywords`, and `author`/`publisher` referencing the existing site-wide `Person` `@id` (`https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/#person`) so posts are attributed to the same entity as the homepage's existing `Person` schema.

## Share & favorites bar

Every post ends with a share bar (`src/components/ShareBar.astro`, styles in `public/assets/css/style.css`, behavior in `public/assets/js/share.js`, loaded by `BlogLayout.astro`). It is the same as on the free tools ([free-tools.md](free-tools.md), ADR-006 in [decisions.md](../decisions.md)): plain links styled as buttons for LinkedIn, X, Facebook, WhatsApp and email with the post's canonical URL and title, plus Copy link and Add to favorites (a keyboard-shortcut hint, since browsers cannot bookmark on a page's behalf). No third-party script or widget; clicks are sent to the existing GA4 tag as a `share` event. It is part of the layout, so new posts get it without any editor action.

## Decap CMS configuration

`public/admin/config.yml`:
- **Backend:** `github`, repo `antskoloz/anthony-skolozdrzyk-ardouin`, branch `main`, `base_url` pointing at the Cloudflare Worker OAuth proxy (`https://anthony-site-cms-auth.anthony-skolozdrzyk.workers.dev` — see [decisions.md](../decisions.md) ADR-002).
- **Media:** `media_folder: "public/blog/uploads"`, `public_folder: "/blog/uploads"` — Decap uploads land directly in `public/`, matching the `heroImage` field's plain-string schema.
- **Collection:** single `blog` collection mapped to `src/content/blog/*.md`, fields matching the schema table above (`title` string, `description` text, `pubDate`/`updatedDate` datetime, `heroImage` image, `tags` list, `draft` boolean default `true`, `body` markdown).
- `public/admin/index.html` loads Decap CMS from the `unpkg` CDN — no npm dependency, no bundling.
- `robots.txt` disallows `/admin/` so the editor UI itself doesn't get indexed.

## Known placeholder

`src/content/blog/hello-world.md` ships with `draft: true` — a template example showing field usage, intentionally excluded from the live site, listing, sitemap, and RSS. Safe to edit or delete once real posts exist.
