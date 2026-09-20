# Spec: Free marketing tools

## Scope

A family of free, no-sign-up calculators for marketers, each published as its own project under `projects/<tool>/` (folder contract in [projects.md](projects.md)). The purpose is to build Anthony's personal brand: each tool is useful on its own, ranks for its own search intent, and is showcased on the homepage. Decision record: [decisions.md](../decisions.md) ADR-004.

## Shared contract (every tool)

- **Static vanilla HTML/CSS/JS**, no `package.json`, no build step. Published by copying the folder to `dist/projects/<tool>/`. Files: `index.html`, `tool.css`, `tool.js`, optional pure-function module with its test (`stats.js` + `stats.test.mjs` for the statistical tools, `calc.js` + `calc.test.mjs` for the others; no DOM), `favicon.svg`, `README.md`.
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

## Plain-language principles (Tools 1 and 2, and any future statistical tool)

Added after review: the first version was too "geeky" for a typical marketer. Decision record: [decisions.md](../decisions.md) ADR-005.

- **Plain language first.** Inputs and headings use business words (visitors, conversions, "how sure do you want to be"), not statistical ones. Any technical term that must appear is glossed in the same sentence.
- **Few inputs, sensible defaults.** Only what a marketer knows is asked. Expert options (power, one-/two-sided, number of variants, Yates correction) live in a collapsed "Advanced settings" block.
- **One clear answer.** Every result opens with a headline verdict in a coloured box, then "what this means" in one or two sentences, then a visual, then "what to do next".
- **Technical details are collapsed.** p-value, z, χ², degrees of freedom, expected counts, standard errors live in a collapsed "Technical details" block for analysts.
- **Guidance on the page.** Each tool page has a "how to use it" strip, a worked example, a plain-English glossary ("Key ideas explained") with everyday analogies, a "before you trust the result" checklist, and FAQs written for business readers. The statistical method and assumptions stay in the Methodology section.
- **No misleading shortcuts.** The tools never present 1 − p as "the probability the variant is better". The p-value is phrased as "if the versions were really identical, a gap this big would happen by luck about N times in 100".

## Tool 1 — A/B Test Calculator

Path `projects/ab-test-calculator/`. Question answered: *how many visitors do I need, and did version B really win?* Formulas are unchanged from the first version.

**Intro strip:** three steps: 1 Plan (how many visitors), 2 Run the test, 3 Check (did B win).

**Tab "Before the test: how many visitors do I need?"** Inputs: current conversion rate (%) with an example and a typical-range hint; **smallest improvement worth detecting** as a relative % with presets (small +5 %, medium +10 %, large +20 %, or custom) and a live translation ("5.0 % → 5.5 %"); **how sure do you want to be** (Standard 95 % default, Extra careful 99 %, Quicker 90 %); optional daily visitors. Advanced settings (collapsed): power 80/90 %, one-/two-sided, number of versions including control (default 2).
Output: headline (visitors per version and in total), duration when traffic is given, a realism signal (≤ 4 weeks good, ≤ 8 weeks warn, > 8 weeks bad) with what to do if it is too long, a "how the answer changes" table (improvements of +5, +10, +20, +50 % at the same confidence), and a checklist.
n per variant = (z_α·√(2·p̄·(1−p̄)) + z_β·√(p₁(1−p₁) + p₂(1−p₂)))² / (p₂ − p₁)², p₂ = p₁ × (1 + relative improvement), rounded up; duration = ceil(n × versions / daily visitors).

**Tab "After the test: did B really win?"** Inputs: for A (current) and B (new) the number of people who saw it and the number who took the action, plus "how sure do you want to be". Output: headline verdict (B is better / B is worse / no clear winner yet); the luck sentence ("if A and B were really identical, a gap this big would happen by luck about N times in 100"); the **likely real improvement** as a range with a horizontal range bar around zero (Worse ← 0 → Better); "what to do next" per verdict (roll out and keep monitoring / keep A / keep running until about N visitors per version, or decide on other grounds); "before you trust this result" checklist. Collapsed Technical details: conversion rates, absolute lift, p-value (pooled two-proportion z-test, two-sided), z, Wald interval on the absolute difference (relative interval = bounds / control rate), smallest lift the sample could detect at 80 % power. Warnings: fewer than 100 conversions per version, fewer than 10 conversions or non-conversions in a group, zero conversions in both.

**Edge cases:** conversions > visitors, non-numeric or negative input, baseline 0 % or 100 %, improvement that pushes the rate to 100 % or more, identical versions (p = 1), zero conversions in both versions.

## Tool 2 — Chi-Square Calculator

Path `projects/chi-square-calculator/` (folder and URL kept for search intent). Question answered: *do these groups really behave differently, or is it just luck?* Distinct from Tool 1: Tool 1 plans a test and measures the size of a lift between two versions; Tool 2 compares **two or more groups** at once (channels, segments, ad variants, countries).

**Tabs:** "Compare groups (yes / no result)" (2–8 groups, one row per group: name, people, conversions, add/remove rows; comparing two groups means keeping two rows); "Advanced: several outcomes" (table up to 5×5 of counts with editable labels, e.g. survey answers by segment).
Common inputs: "how sure do you want to be" (Standard 95 % / Extra careful 99 % / Quicker 90 %). Advanced settings (collapsed): Yates continuity correction (2×2 only, off by default).

**Output:** headline verdict ("the groups behave differently" / "no clear difference"); the luck sentence; a bar chart of the conversion rate of each group (yes/no tabs); "which groups stand out" (only with three or more groups): groups whose count differs from what luck would predict (|adjusted residual| > 1.96), stated as "converts more/less than the average", with a caveat that this is descriptive and not corrected for multiple looks; **size of the difference**: in the groups tab, the best group's conversion rate as a multiple of the weakest group's and the gap in percentage points, with a rule-of-thumb qualifier (≥ 1.5× big, ≥ 1.2× noticeable, otherwise modest); in the advanced tab, a plain label (very small / small / moderate / strong) from Cramér's V scaled by min(r−1, c−1). Cramér's V is not used as the headline size in the groups tab because it is always tiny when most people do not convert, which understates a real business gap. "What to do next". Collapsed Technical details: χ², degrees of freedom, p-value, Cramér's V, N, expected-counts table.
χ² = Σ (O − E)²/E, E = row total × column total / N, df = (r−1)(c−1); adjusted residual = (O − E) / √(E·(1 − row total/N)·(1 − column total/N)); for an uncorrected 2×2 table |adjusted residual| = √χ² = |z| of the pooled two-proportion test.

**Warnings/edge cases:** any expected count < 5 → "some groups have too few people for this test to be reliable" (Fisher's exact test suggested for 2×2, not implemented); a row or column total of zero; non-integer or negative counts; conversions greater than people; a significant result says *some* group differs, and the standouts show where.

## Tool 3 — Marketing ROI Calculator (ROAS · CAC · LTV)

Path `projects/marketing-roi-calculator/`.

**Inputs:** ad spend, attributed revenue, gross margin %, customers acquired, average order value, orders per customer per year, customer lifespan in years (or annual churn %, lifespan = 1/churn), currency symbol (cosmetic).

**Outputs:** ROAS = revenue / spend; break-even ROAS = 1 / gross margin; profit on ad spend = revenue × margin − spend; CAC = spend / customers; LTV = AOV × orders/year × lifespan × margin (gross-margin LTV); LTV:CAC; CAC payback (months) = CAC / (AOV × orders/year / 12 × margin). Traffic-light labels against widely quoted rules of thumb (LTV:CAC ≥ 3 healthy, < 1 losing money; ROAS vs break-even) explicitly labelled as rules of thumb, not guarantees.

**Edge cases:** division by zero (no customers, zero margin, zero spend) shows "n/a" with an explanation; margin outside 0–100 % rejected; churn 0 % rejected for lifespan.

## Tool 4 — UTM Link Builder

Path `projects/utm-builder/`.

**Inputs:** destination URL (http/https required, existing query string and `#fragment` preserved), `utm_source`, `utm_medium`, `utm_campaign` (required), `utm_term`, `utm_content` (optional). **Outputs:** the tagged URL with live preview and a copy button. Options: lowercase everything and replace spaces with underscores (on by default), values URL-encoded. Warnings: missing required fields, existing `utm_*` params in the URL (overwritten, said so), inconsistent-case hint, short naming-convention guide. **Optional (cut first if time is short):** bulk mode — paste one URL per line, apply the same campaign fields, copy all.

## Tool 5 — SaaS Metrics & Runway Calculator

Path `projects/saas-metrics-calculator/`. Question answered: *how healthy is my recurring revenue, and how long does my cash last?* For finance people, founders and PMs.

**Inputs (all in one form, sensible example values prefilled):** period the numbers cover (month default, quarter, year); starting MRR; new MRR; expansion MRR (upsells); contraction MRR (downgrades); churned MRR (cancellations); optional customers at start and customers lost; optional cash in the bank and net monthly burn (0 = break-even or better); optional year-over-year revenue growth % and profit margin % (negative allowed) for the Rule of 40. Optional groups are all-or-none within their group, like Tool 3's customer-value group.

**Outputs:** ending MRR = start + new + expansion − contraction − churned; ARR = ending MRR × 12; net new MRR; MRR growth % over the period; gross MRR churn % = (churned + contraction) / start; logo churn % = customers lost / customers at start; net revenue retention (NRR) = (start + expansion − contraction − churned) / start; gross revenue retention (GRR) = (start − contraction − churned) / start; both also shown annualised as rate^(12 / months in period) ("if this period repeated for a year"); SaaS quick ratio = (new + expansion) / (contraction + churned); Rule of 40 = growth % + margin %; burn multiple = net burn over the period / net new ARR (net new MRR × 12); runway (months) = cash / monthly burn.
Traffic-light signals against widely quoted rules of thumb, labelled as such and not guarantees: annualised NRR ≥ 100 % good, ≥ 90 % warn, below bad; quick ratio ≥ 4 good, ≥ 1 warn, below 1 bad (shrinking); Rule of 40 ≥ 40 good, ≥ 20 warn, below bad; burn multiple ≤ 1.5 good, ≤ 3 warn, above bad; runway ≥ 18 months good, ≥ 12 warn, below bad.

**Edge cases:** starting MRR must be above 0; negative inputs rejected; churned + contraction greater than starting MRR rejected (existing customers cannot lose more than they paid); quick ratio with no losses shows "n/a, no losses this period"; zero burn shows runway "n/a, cash-flow positive or break-even"; burn multiple with zero or negative net new MRR while burning cash shows "n/a, no net new ARR" and a warning; customers lost above customers at start rejected. Same disclaimer wording as every tool, with "financial" advice explicitly excluded.

## Tool 6 — RICE / ICE Prioritizer

Path `projects/rice-prioritizer/`. Question answered: *which of these ideas should we do first?* For product managers.

**Method toggle:** RICE (default) or ICE; each keeps its own rows in the page (in memory only).
**RICE row:** name, Reach (people or events per quarter, ≥ 0), Impact (0.25 minimal, 0.5 low, 1 medium, 2 high, 3 massive), Confidence (%, 0–100), Effort (person-months, > 0). Score = Reach × Impact × (Confidence / 100) / Effort.
**ICE row:** name, Impact, Confidence, Ease, each 1–10. Score = Impact × Confidence × Ease (max 1000).
**UI:** editable table (add / remove rows, live score per row) with example rows prefilled; a ranked list below (rank, name, score, bar scaled to the top score); ties share a rank; "Paste from a spreadsheet" box (tab- or comma-separated, header row detected and skipped, impact words such as "high" accepted, per-line error messages for skipped lines); **Download CSV** (and copy) of the ranked list. A short "how to read this" glossary, a worked example, FAQs.
**Edge cases:** effort 0 or negative, confidence outside 0–100, non-numeric cells, blank rows (ignored), a row with numbers but no name (labelled "Untitled"), fewer than two valid rows (rank shown, with a hint to add more), CSV cells beginning with `=`, `+`, `-` or `@` are prefixed with an apostrophe so spreadsheets do not run them as formulas.

## Tests

Tools 1–2 ship `stats.test.mjs` (run with `node`), asserting reference values: z(0.975) = 1.95996; χ² p-value = 0.05 at df=1 x=3.841 and df=2 x=5.991; z² equals uncorrected χ² on the same 2×2; hand-computed sample-size and CI examples. Tool 3's formulas and Tool 4's URL builder are pure functions covered by the same style of test file. Tool 5's `calc.test.mjs` asserts hand-computed values (ending MRR, NRR and its annualisation, quick ratio boundary at exactly 4, burn multiple, runway) and the light boundaries; Tool 6's asserts RICE/ICE scores, ranking with ties, paste parsing (header, tabs vs commas, impact words, bad lines) and CSV escaping including the formula-injection prefix. Every tool is also checked in a browser under the deployed base path.
