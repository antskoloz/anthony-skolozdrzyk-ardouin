# Anthony Skolozdrzyk-Ardouin — Personal Site

Static, bilingual (EN/FR) personal brand site. Plain HTML/CSS/JS, no build step, built for GitHub Pages.

## Structure

```
index.html          English homepage (default)
fr/index.html        French homepage
assets/css/style.css  Styles
assets/js/main.js     Nav toggle, email obfuscation, scroll reveal
assets/img/           Images (headshot, favicon)
sitemap.xml
robots.txt
```

## Before you publish

1. **Add your headshot.** Save a square-ish photo as `assets/img/headshot.jpg` (the black-polo photo you sent reads as the more "director-level" of the two — recommended). Recommended size: at least 800×800px. If the file is missing, the site falls back to an "AS" monogram automatically, so nothing breaks in the meantime.
2. **Optional: dedicated OG share image.** For the cleanest link previews on LinkedIn/Slack, create a 1200×630 image at `assets/img/og-image.jpg` and update the four `og:image` / `twitter:image` tags in both HTML files to point to it (currently they reuse the headshot).
3. **Confirm the GitHub repo name.** This site assumes the repo is created under your `skoloz` GitHub account, named `anthony-skolozdrzyk-ardouin`, so the live URL becomes:
   `https://skoloz.github.io/anthony-skolozdrzyk-ardouin/`
   If you use a different repo name, update the canonical/hreflang/OG URLs in both HTML files and in `sitemap.xml`.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/skoloz/anthony-skolozdrzyk-ardouin.git
git push -u origin main
```

Then in the repo on GitHub: **Settings → Pages → Source → Deploy from branch → `main` / root**. The site will be live at `https://skoloz.github.io/anthony-skolozdrzyk-ardouin/` within a couple of minutes.

## After it's live (SEO/GEO follow-ups)

- Submit the site (and `sitemap.xml`) to Google Search Console and Bing Webmaster Tools — this is the single biggest lever for showing up in search and AI-assistant answers.
- Once you have a custom domain, add a `CNAME` file at the repo root with the domain name, update DNS, and update every absolute URL in the HTML/sitemap/robots files to match.
- If you want more content over time (repurposed LinkedIn posts, case studies), it's easiest to add an `/insights/` folder with one static HTML page per post, linked from the nav — good for both SEO (more indexed pages) and GEO (more citable text for AI answers).
