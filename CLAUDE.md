# Project scope

Anthony Skolozdrzyk-Ardouin's personal brand site — trilingual (EN/FR/DE) homepage plus an English-only blog, deployed to GitHub Pages at `https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/`.

## Non-goals

- No database, no server-side runtime. The blog is databaseless: Decap CMS commits Markdown to this repo; Astro renders it at build time; GitHub Pages serves static files.
- No FR/DE blog translation (homepage stays trilingual; blog posts are English-only — see [specs/blog.md](specs/blog.md)).
- No full rewrite of the homepage into Astro — it stays plain HTML/CSS/JS on purpose (see [decisions.md](decisions.md) ADR-001).

## Doc set

Following the spec-driven-development methodology: [plan.md](plan.md) (phased roadmap), [architecture.md](architecture.md) (system design), [specs/blog.md](specs/blog.md) (blog behavior spec), [specs/projects.md](specs/projects.md) (`projects/` folder contract), [decisions.md](decisions.md) (ADR log), [todo.md](todo.md) (current sprint). Treat these as the source of truth; a conversation is not canonical until something is promoted into one of these files.
