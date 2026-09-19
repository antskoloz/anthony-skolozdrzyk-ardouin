# Decline Code Lookup

A free, independent educational tool for merchants that explains card payment decline codes (Visa, Mastercard, American Express) in plain English — what each one means, why it happens, and what to do about it.

Live at: `https://antskoloz.github.io/decline-code-lookup/` (once deployed).

## Project structure

```text
/
├── src/
│   ├── content.config.ts       # Zod schema for decline-code entries
│   ├── content/codes/*.md      # one Markdown file per decline reason
│   ├── data/categories.ts      # the 6 fixed decline categories
│   ├── layouts/                # BaseLayout
│   ├── components/              # Header, Footer, SearchBox, cards, tables, FAQ, CTA
│   └── pages/
│       ├── index.astro          # homepage: search + category grid
│       ├── codes/[slug].astro   # individual decline-code page
│       ├── category/[category].astro
│       ├── glossary.astro       # full A-Z index of every code
│       ├── about.astro
│       ├── search-index.json.ts # build-time JSON index for client-side search
│       └── llms.txt.ts          # build-time llms.txt generator (GEO)
└── .github/workflows/deploy.yml # GitHub Pages deployment
```

## Adding a new decline code

Create a new Markdown file under `src/content/codes/<slug>.md`. The frontmatter is validated against the schema in `src/content.config.ts` at build time — Astro will fail the build with a clear error if a field is missing or malformed. Use any existing file in that folder as a template.

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npx astro check` | Type-check the project and validate content schemas |

Requires Node.js >= 22.12.0.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. In the repo's Settings → Pages, "Source" must be set to **GitHub Actions**.
