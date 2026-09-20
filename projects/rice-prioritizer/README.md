# RICE / ICE Prioritizer

Free tool for free use, published at `/anthony-skolozdrzyk-ardouin/projects/rice-prioritizer/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md) (Tool 6).

Static vanilla HTML/CSS/JS, no build step: `index.html`, `tool.css` (brand styles copied from Tool 3, plus table and ranking styles), `tool.js` (UI), `calc.js` (scoring, ranking, paste parsing, CSV; no DOM), `calc.test.mjs`.

- RICE = Reach × Impact × Confidence ÷ Effort; ICE = Impact × Confidence × Ease (1–10 each).
- Editable table with live scores, ranked list (ties share a rank), paste from a spreadsheet, CSV download / copy.
- Rows live in memory only: nothing is stored or sent anywhere. CSV cells starting with `=`, `+`, `-` or `@` are prefixed with an apostrophe.

## Develop

```
python -m http.server 8768      # from this folder, then open http://localhost:8768/
node calc.test.mjs              # scoring / parsing / CSV tests
```
