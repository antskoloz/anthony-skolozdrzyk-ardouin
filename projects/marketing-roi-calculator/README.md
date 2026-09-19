# Marketing ROI Calculator

Free tool for free use, published at `/anthony-skolozdrzyk-ardouin/projects/marketing-roi-calculator/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md) (Tool 3).

Static vanilla HTML/CSS/JS, no build step: `index.html`, `tool.css` (brand styles copied from Tool 1), `tool.js` (UI), `calc.js` (pure formulas, no DOM), `calc.test.mjs`.

- ROAS, break-even ROAS (1 / margin), profit on ad spend, CAC.
- Optional customer value: LTV (AOV × orders/year × lifespan × margin; lifespan = 1 / churn when churn is given), LTV:CAC, CAC payback in months.
- Traffic-light signals use widely quoted rules of thumb (ROAS vs break-even, LTV:CAC 3:1, payback 12 months) and are labelled as such.

## Develop

```
python -m http.server 8768      # from this folder, then open http://localhost:8768/
node calc.test.mjs              # formula tests
```
