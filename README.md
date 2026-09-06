# Anthony Skolozdrzyk-Ardouin — Personal Site

Static, trilingual (EN/FR/DE) personal brand site. Plain HTML/CSS/JS, no build step, built for GitHub Pages.

Live at: https://skoloz.github.io/anthony-skolozdrzyk-ardouin/

## Structure

```
index.html             English homepage (default)
fr/index.html          French homepage
de/index.html           German homepage
assets/css/style.css    Styles
assets/js/main.js       Nav toggle, email obfuscation
assets/img/             Images (headshot, full, favicon)
sitemap.xml
robots.txt
```

## Deploying changes

```bash
git add -A
git commit -m "Describe the change"
git push
```

GitHub Pages redeploys automatically from `main` within a minute or two.

## After it's live (SEO/GEO follow-ups)

- Submit the site (and `sitemap.xml`) to Google Search Console and Bing Webmaster Tools — this is the single biggest lever for showing up in search and AI-assistant answers.
- Once you have a custom domain, add a `CNAME` file at the repo root with the domain name, update DNS, and update every absolute URL in the HTML/sitemap/robots files to match.
- If you want more content over time (repurposed LinkedIn posts, case studies), it's easiest to add an `/insights/` folder with one static HTML page per post, linked from the nav — good for both SEO (more indexed pages) and GEO (more citable text for AI answers).
- Optional: a dedicated 1200×630 OG share image (currently `og:image`/`twitter:image` reuse the headshot) gives cleaner link previews on LinkedIn/Slack.
