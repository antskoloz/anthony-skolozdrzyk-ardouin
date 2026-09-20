# Chi-Square Calculator

Free tool for free use, published at `/projects/chi-square-calculator/`. Behavior spec: [../../specs/free-tools.md](../../specs/free-tools.md) (Tool 2, plain-language principles per ADR-005).

Static vanilla HTML/CSS/JS, no build step: `index.html` (page copy, worked example, glossary, FAQ), `tool.css` (brand styles copied from Tool 1, plus UI additions), `tool.js` (UI), `stats.js` (pure statistics, no DOM), `stats.test.mjs`.

- **Compare groups (yes / no result):** 2–8 rows (name, people, converted). Verdict, luck sentence, conversion-rate bars, groups that stand out, size of the gap (best vs weakest group), what to do next.
- **Advanced: several outcomes:** table up to 5×5 with editable labels; cells that stand out are highlighted.
- Statistics underneath (kept in "Technical details"): χ² = Σ (O − E)² / E, df = (r − 1)(c − 1), p-value from the chi-square survival function, Cramér's V, adjusted residuals for "which groups stand out", optional Yates correction (2×2 only), expected-count warning.
- For an uncorrected 2×2 table χ² equals the square of the pooled two-proportion z statistic, so it agrees with the [A/B Test Calculator](../ab-test-calculator/) (asserted in `stats.test.mjs`).

## Develop

```
python -m http.server 8767      # from this folder, then open http://localhost:8767/
node stats.test.mjs             # reference-value tests for stats.js
```

The gamma core in `stats.js` is duplicated in `ab-test-calculator/stats.js`; fix bugs in both.
