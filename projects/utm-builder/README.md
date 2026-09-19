# UTM Link Builder

Free tool for free use, published at `/anthony-skolozdrzyk-ardouin/projects/utm-builder/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md) (Tool 4).

Static vanilla HTML/CSS/JS, no build step: `index.html`, `tool.css` (brand styles copied from Tool 1), `tool.js` (UI), `calc.js` (pure URL building, no DOM), `calc.test.mjs`.

- Single link and bulk mode (one URL per line, same campaign fields).
- Keeps existing query parameters and `#fragment`; replaces existing `utm_source/medium/campaign/term/content` that it sets, and says so.
- Optional normalisation (lowercase, spaces to underscores); values are percent-encoded.

## Develop

```
python -m http.server 8769      # from this folder, then open http://localhost:8769/
node calc.test.mjs              # URL-building tests
```
