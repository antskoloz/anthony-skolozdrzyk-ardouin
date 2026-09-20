# Break-even & Pricing Calculator

Free tool for free use, published at `/projects/break-even-pricing-calculator/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md) (Tool 7).

Static vanilla HTML/CSS/JS, no build step: `index.html`, `tool.css` (brand styles copied from Tool 5, plus tab and table styles), `tool.js` (UI), `calc.js` (pure formulas, no DOM), `calc.test.mjs`, `share.js` (share and favorites bar, ADR-006).

- Break-even units and sales, units for a target profit, margin of safety.
- Margin ↔ markup conversion, price from a target margin or markup, reference table.
- Discount impact: the extra volume needed to keep the same total profit (discount / (margin − discount)).

## Develop

```
python -m http.server 8768      # from this folder, then open http://localhost:8768/
node calc.test.mjs              # formula tests
```
