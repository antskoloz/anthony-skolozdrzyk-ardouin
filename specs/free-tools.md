# Spec: Free marketing tools

## Scope

A family of free, no-sign-up calculators for marketers, each published as its own project under `projects/<tool>/` (folder contract in [projects.md](projects.md)). The purpose is to build Anthony's personal brand: each tool is useful on its own, ranks for its own search intent, and is showcased on the homepage. Decision record: [decisions.md](../decisions.md) ADR-004.

## Shared contract (every tool)

- **Static vanilla HTML/CSS/JS**, no `package.json`, no build step. Published by copying the folder to `dist/projects/<tool>/`. Files: `index.html`, `tool.css`, `tool.js`, optional `stats.js` (pure functions, no DOM) and `stats.test.mjs`, `README.md`.
- **No code shared between tools** (see projects.md rules): each folder carries its own copy of `tool.css` and of any `stats.js` it needs.
- **English-only UI.** The homepage card for each tool is translated in EN/FR/DE.
- **Computation runs in the browser.** No inputs are sent to or stored on a server. No `localStorage` of user data.
- **Analytics:** the existing GA4 gtag `G-QXP44186J4` (same snippet as `public/index.html`). Nothing else is loaded from third parties.
- **Header:** brand logo + primary nav linking back to the homepage (Work highlighted), then a slim bar with the tool name, same pattern as `projects/decline-code-lookup/src/components/Header.astro`.
- **Free-tool label:** every tool page shows a "Free tool" badge and the line "Free for everyone to use, no sign-up." near the top; the homepage card carries the same badge.
- **Disclaimer:** every tool page ends with the full disclaimer below; homepage cards and the "Free tools" block carry the short form.
- **SEO:** canonical URL, OG/Twitter tags, JSON-LD `WebApplication` + `FAQPage`, a methodology section with formulas and assumptions, and the tool's URL listed in `public/sitemap.xml`.
- **Accessibility/UX:** labelled inputs, results in an `aria-live` region, works at mobile width, inputs validated with inline messages (never a silent `NaN`).
- **Not on cards:** no "View code" button; user-facing copy avoids the word "projects" (use "tools"/"work"). Card button is "Open".

### Disclaimer (full form, English, on every tool page)

> This tool is provided free of charge for general informational and educational purposes only. It is offered "as is", without warranty of any kind, and does not constitute professional, statistical, financial, legal or marketing advice. Results depend on the accuracy of your inputs and on the statistical assumptions stated on this page; you are solely responsible for decisions taken on the basis of the results. To the fullest extent permitted by law, the author accepts no liability for any loss or damage arising from use of this tool. This is an independent personal initiative by Anthony Skolozdrzyk-Ardouin; it is not affiliated with, endorsed by, or representative of any current or former employer. Calculations run entirely in your browser: the data you enter is not sent to or stored on any server. Anonymous usage analytics (Google Analytics) are collected on this site.

Short form (cards / "Free tools" block): "Free tool for free use. Provided as is, for information only — not professional advice. See the disclaimer on each tool."

## Homepage integration

Inside `#work` on `public/index.html`, `public/fr/index.html`, `public/de/index.html`: a "Free tools" sub-block after the Decline Code Lookup card — heading, a one-line "free, no sign-up" note with the short disclaimer, and a grid of compact cards (badge, name, one-line benefit, tags, **Open** → `projects/<tool>/`). Shipping a tool means adding its card to all three homepages and its URL to `public/sitemap.xml`, in the same change. Card styles live in `public/assets/css/style.css`.

## Tool 1 — A/B Test Sample Size & Confidence Calculator

Path `projects/ab-test-calculator/`. Question answered: *was my test big enough, and how sure can I be?*

**Plan mode** — inputs: baseline conversion rate p₁ (%), minimum detectable effect (relative % or absolute pp), confidence level (90/95/99 %), power (80/90 %), sides (two-sided default), optional daily visitors and number of variants. Output: required sample size per variant and total, estimated duration in days when traffic is given.

n per variant = (z_α·√(2·p̄·(1−p̄)) + z_β·√(p₁(1−p₁) + p₂(1−p₂)))² / (p₂ − p₁)², with p₂ = p₁ + effect, p̄ = (p₁+p₂)/2, z_α = z(1−α/2) two-sided or z(1−α) one-sided, z_β = z(power). Rounded up. Duration = ceil(n × variants / daily visitors).

**Check mode** — inputs: visitors and conversions for control and variant, confidence level (check mode is always two-sided). Outputs: both conversion rates, absolute lift (pp) and relative lift (%), confidence interval on the absolute difference (Wald, unpooled SE) with the relative interval derived by dividing by the control rate, two-proportion z-test p-value (pooled SE), the smallest effect the sample could reliably detect (MDE at 80 % power for the observed sample sizes), and a plain-English verdict. Observed/post-hoc power is deliberately not shown: it is a function of the p-value and misleads.

**Verdicts:** significant and interval excludes 0 → "significant at X %"; not significant → "not enough evidence yet" plus how many more visitors the plan-mode formula suggests; significant but interval wide (upper/lower bound ratio > 4 or lower bound < 20 % of the point estimate) → warning that the true lift could be much smaller/larger.

**Warnings:** peeking/stopping early, testing many variants or metrics (multiple comparisons), sample fewer than ~100 conversions per variant, running less than a full business cycle.

**Edge cases:** conversions > visitors, negative or non-numeric input, zero visitors, baseline 0 % or 100 % (sample-size undefined → message), effect that pushes p₂ outside 0–100 %, control equals variant (p = 1, lift 0).

## Tool 2 — Chi-Square Test Calculator

Path `projects/chi-square-calculator/`. Question answered: *is the difference between control and variant real, or noise?*

**Simple mode:** 2×2 — control vs variant, converted vs not converted (inputs: visitors and conversions per group; non-converted derived). **Advanced mode:** contingency table up to 5×5 with editable row/column labels (e.g. 3 variants, or channel × converted).

**Outputs:** χ² = Σ (O − E)²/E with E = row total × column total / grand total; degrees of freedom (r−1)(c−1); p-value (upper tail of the χ² distribution); result at 90/95/99 % (reject / do not reject independence); expected-counts table; Cramér's V = √(χ² / (N·min(r−1, c−1))) with a small/medium/large label; optional Yates continuity correction (2×2 only, off by default; when on, |O−E| reduced by 0.5); plain-English interpretation. Relative to Tool 1: Tool 1 plans and estimates the lift; Tool 2 tests observed counts and generalises to multiple groups.

**Warnings/edge cases:** any expected count < 5 (χ² approximation unreliable, suggest Fisher's exact test — not implemented); zero row/column total (undefined → message); non-integer or negative counts rejected; only a whole table with at least 2×2 accepted; significant χ² on a multi-group table says *some* group differs, not which one.

## Tool 3 — Marketing ROI Calculator (ROAS · CAC · LTV)

Path `projects/marketing-roi-calculator/`.

**Inputs:** ad spend, attributed revenue, gross margin %, customers acquired, average order value, orders per customer per year, customer lifespan in years (or annual churn %, lifespan = 1/churn), currency symbol (cosmetic).

**Outputs:** ROAS = revenue / spend; break-even ROAS = 1 / gross margin; profit on ad spend = revenue × margin − spend; CAC = spend / customers; LTV = AOV × orders/year × lifespan × margin (gross-margin LTV); LTV:CAC; CAC payback (months) = CAC / (AOV × orders/year / 12 × margin). Traffic-light labels against widely quoted rules of thumb (LTV:CAC ≥ 3 healthy, < 1 losing money; ROAS vs break-even) explicitly labelled as rules of thumb, not guarantees.

**Edge cases:** division by zero (no customers, zero margin, zero spend) shows "n/a" with an explanation; margin outside 0–100 % rejected; churn 0 % rejected for lifespan.

## Tool 4 — UTM Link Builder

Path `projects/utm-builder/`.

**Inputs:** destination URL (http/https required, existing query string and `#fragment` preserved), `utm_source`, `utm_medium`, `utm_campaign` (required), `utm_term`, `utm_content` (optional). **Outputs:** the tagged URL with live preview and a copy button. Options: lowercase everything and replace spaces with underscores (on by default), values URL-encoded. Warnings: missing required fields, existing `utm_*` params in the URL (overwritten, said so), inconsistent-case hint, short naming-convention guide. **Optional (cut first if time is short):** bulk mode — paste one URL per line, apply the same campaign fields, copy all.

## Tests

Tools 1–2 ship `stats.test.mjs` (run with `node`), asserting reference values: z(0.975) = 1.95996; χ² p-value = 0.05 at df=1 x=3.841 and df=2 x=5.991; z² equals uncorrected χ² on the same 2×2; hand-computed sample-size and CI examples. Tool 3's formulas and Tool 4's URL builder are pure functions covered by the same style of test file. Every tool is also checked in a browser under the deployed base path.
