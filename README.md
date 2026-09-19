# Anthony Skolozdrzyk-Ardouin — Personal Site

Trilingual (EN/FR/DE) personal brand homepage, an English-only blog with a Decap CMS admin UI, and a `projects/` folder for self-contained project sites. No database — the blog is Markdown files committed to this repo, built by Astro, served as static files on GitHub Pages.

Live at: https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/

See [architecture.md](architecture.md), [plan.md](plan.md), [specs/blog.md](specs/blog.md), [specs/projects.md](specs/projects.md) and [decisions.md](decisions.md) for the full design and rationale.

## Structure

```
public/                 Legacy homepage — plain HTML/CSS/JS, copied as-is into the build
  index.html              English homepage (default)
  fr/index.html            French homepage
  de/index.html            German homepage
  assets/                  Styles, scripts, images (shared with the blog)
  admin/                   Decap CMS (index.html + config.yml)
  robots.txt, sitemap.xml  Hand-maintained, homepage URLs only

src/                    Astro-rendered blog
  content.config.ts        `blog` collection schema
  content/blog/*.md        Posts — this is what Decap CMS commits to
  layouts/, pages/blog/    Blog templates and routes
  pages/rss.xml.js         RSS feed

projects/               One subfolder per project, each a self-contained app
  decline-code-lookup/     Astro site, published at /projects/decline-code-lookup/
scripts/build-projects.mjs  Builds each projects/* folder into dist/projects/<name>/
```

## Local development

```bash
npm install
npm run dev       # http://localhost:4321/anthony-skolozdrzyk-ardouin/
npm run build     # blog + homepage only, outputs to dist/
npm run build:all # also builds every projects/* folder into dist/projects/ (what CI runs)
npm run preview   # serve the production build locally
```

Editing the homepage (`public/index.html`, `public/fr/`, `public/de/`) needs no build step — those files are copied verbatim. Editing the blog (`src/`) needs `npm run build` to regenerate `dist/`. To work on a project, `cd projects/<name>` and use its own scripts (`npm install`, `npm run dev`); its dev server runs under its configured base path.

## Deploying

Push to `main` — a GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site and every project (`npm run build:all`) and deploys `dist/` to GitHub Pages automatically.

## Adding a project

Create `projects/<name>/` containing a self-contained app (or plain static files). Give it a build script that outputs to `dist/` and configure it for the base path `/anthony-skolozdrzyk-ardouin/projects/<name>/`. It is picked up automatically on the next `build:all` / deploy. Details in [specs/projects.md](specs/projects.md).

## Publishing a blog post

- **Via the CMS:** go to `/admin`, log in with GitHub, write the post through the form. It commits a Markdown file to `src/content/blog/` on `main`, which triggers the deploy workflow above.
- **By hand:** add a `.md` file to `src/content/blog/` with the required frontmatter (see [specs/blog.md](specs/blog.md)), then `git push`.

## After it's live (SEO/GEO follow-ups)

- Submit the site and its sitemaps (`sitemap.xml`, `sitemap-index.xml`, and each project's `projects/<name>/sitemap-index.xml`) to Google Search Console and Bing Webmaster Tools.
- Once there's a custom domain, add a `CNAME` file at the repo root and update every absolute URL across the homepage HTML, `astro.config.mjs`, `src/consts.ts`, `sitemap.xml` and `robots.txt` to match.
- Optional: a dedicated 1200×630 OG share image (currently `og:image`/`twitter:image` reuse the headshot).
