# A/B Test Calculator

Free tool for free use, published at `/projects/ab-test-calculator/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md) (Tool 1, plain-language principles per ADR-005).

Static vanilla HTML/CSS/JS, no build step: `index.html` (page, SEO, FAQ, disclaimer), `tool.css` (brand styles, copied per tool), `tool.js` (UI), `stats.js` (pure statistics, no DOM), `stats.test.mjs`.

- **Before the test (plan):** sample size per variant for a two-proportion test, `n = (z_α·√(2·p̄·(1−p̄)) + z_β·√(p₁(1−p₁) + p₂(1−p₂)))² / (p₂ − p₁)²`, plus estimated duration.
- **After the test (check):** pooled two-proportion z-test p-value, Wald confidence interval on the absolute difference (relative interval = bounds / control rate), smallest detectable lift at 80 % power, plain-English verdict.

## Develop

```
python -m http.server 8765      # from this folder, then open http://localhost:8765/
node stats.test.mjs             # reference-value tests for stats.js
```

`tool.js` is an ES module, so open it over HTTP (not `file://`).

The regularized-gamma core in `stats.js` is duplicated in `chi-square-calculator/stats.js`; fix bugs in both.
