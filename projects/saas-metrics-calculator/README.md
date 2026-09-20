# SaaS Metrics & Runway Calculator

Free tool for free use, published at `/projects/saas-metrics-calculator/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md) (Tool 5).

Static vanilla HTML/CSS/JS, no build step: `index.html`, `tool.css` (brand styles copied from Tool 3, plus coloured metric cards), `tool.js` (UI), `calc.js` (pure formulas, no DOM), `calc.test.mjs`.

- Ending MRR, ARR, net new MRR, growth, gross MRR churn, NRR and GRR (also annualised), SaaS quick ratio, logo churn.
- Optional: cash runway, burn multiple, Rule of 40.
- Traffic-light signals use widely quoted SaaS rules of thumb and are labelled as such.

## Develop

```
python -m http.server 8768      # from this folder, then open http://localhost:8768/
node calc.test.mjs              # formula tests
```
