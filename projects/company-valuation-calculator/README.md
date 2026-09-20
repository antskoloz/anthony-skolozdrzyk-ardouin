# Company Valuation Calculator (WACC, Free Cash Flow, DCF & EPS)

Free, educational tool published at `/projects/company-valuation-calculator/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md).

Static vanilla HTML/CSS/JS, no build step: `index.html`, `tool.css`, `tool.js` (UI), `calc.js` (pure formulas, no DOM), `calc.test.mjs`.

Chains four classic corporate-finance building blocks into one worked example, so shares outstanding, tax rate and other shared numbers are entered once and reused:

1. **WACC** — cost of equity via CAPM, blended with the after-tax cost of debt.
2. **Free cash flow (FCFF)** — built up from EBIT.
3. **DCF valuation** — projects FCF forward, adds a Gordon-growth terminal value, discounts both back with the WACC, then bridges enterprise value to a value per share.
4. **EPS** — basic and diluted, shown alongside an optional P/E ratio and a neutral numeric comparison against a market price if one is entered.

This is explicitly framed as an educational worked example, not investment advice: a prominent notice near the top states this in addition to the standard site-wide disclaimer at the bottom, and the results never use "cheap/expensive" or "undervalued/overvalued" language — only neutral, factual comparisons.

## Develop

```
python -m http.server 8769      # from this folder, then open http://localhost:8769/
node calc.test.mjs              # formula tests
```
