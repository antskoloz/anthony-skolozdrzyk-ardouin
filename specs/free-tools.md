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

**Tabs:** "2 groups" (people and conversions for each); "Several groups" (2–8 groups, one row per group: name, people, conversions, add/remove rows); "Advanced: several outcomes" (table up to 5×5 of counts with editable labels, e.g. survey answers by segment).
Common inputs: "how sure do you want to be" (Standard 95 % / Extra careful 99 % / Quicker 90 %). Advanced settings (collapsed): Yates continuity correction (2×2 only, off by default).

**Output:** headline verdict ("the groups behave differently" / "no clear difference"); the luck sentence; a bar chart of the conversion rate of each group (yes/no tabs); "which groups stand out": groups whose count differs from what luck would predict (|adjusted residual| > 1.96), stated as "converts more/less than expected", with a caveat that this is descriptive and not corrected for multiple looks; "strength of the difference" as a plain label (very small / small / moderate / strong, from Cramér's V scaled by min(r−1, c−1)); "what to do next". Collapsed Technical details: χ², degrees of freedom, p-value, Cramér's V, N, expected-counts table.
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

## Tests

Tools 1–2 ship `stats.test.mjs` (run with `node`), asserting reference values: z(0.975) = 1.95996; χ² p-value = 0.05 at df=1 x=3.841 and df=2 x=5.991; z² equals uncorrected χ² on the same 2×2; hand-computed sample-size and CI examples. Tool 3's formulas and Tool 4's URL builder are pure functions covered by the same style of test file. Every tool is also checked in a browser under the deployed base path.
