# Chi-Square Test Calculator

Free tool for free use, published at `/anthony-skolozdrzyk-ardouin/projects/chi-square-calculator/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md) (Tool 2).

Static vanilla HTML/CSS/JS, no build step: `index.html`, `tool.css` (brand styles copied from Tool 1, plus contingency-table styles), `tool.js` (UI), `stats.js` (pure statistics, no DOM), `stats.test.mjs`.

- **Control vs variant (2×2)** and **advanced table (up to 5×5)**, with editable labels.
- χ² = Σ (O − E)² / E, df = (r − 1)(c − 1), p-value from the chi-square survival function, Cramér's V with Cohen-scaled labels, optional Yates correction (2×2 only), warning when expected counts are below 5.
- For an uncorrected 2×2 table χ² equals the square of the pooled two-proportion z statistic, so it agrees with the [A/B Test Calculator](../ab-test-calculator/) (asserted in `stats.test.mjs`).

## Develop

```
python -m http.server 8767      # from this folder, then open http://localhost:8767/
node stats.test.mjs             # reference-value tests for stats.js
```

The gamma core in `stats.js` is duplicated in `ab-test-calculator/stats.js`; fix bugs in both.
