# Spec: Free marketing tools

## Scope

A family of free, no-sign-up calculators for marketers, product managers and finance teams, each published as its own project under `projects/<tool>/` (folder contract in [projects.md](projects.md)). The purpose is to build Anthony's personal brand: each tool is useful on its own, ranks for its own search intent, and is showcased on the homepage. Decision record: [decisions.md](../decisions.md) ADR-004.

## Shared contract (every tool)

- **Static vanilla HTML/CSS/JS**, no `package.json`, no build step. Published by copying the folder to `dist/projects/<tool>/`. Files: `index.html`, `tool.css`, `tool.js`, `share.js`, optional pure-function module with its test (`stats.js` + `stats.test.mjs` for the statistical tools, `calc.js` + `calc.test.mjs` for the others; no DOM), `favicon.svg`, `README.md`.
- **No code shared between tools** (see projects.md rules): each folder carries its own copy of `tool.css` and of any `stats.js` it needs.
- **English-only UI.** The homepage card for each tool is translated in EN/FR/DE.
- **Computation runs in the browser.** No inputs are sent to or stored on a server. No `localStorage` of user data.
- **Analytics:** the existing GA4 gtag `G-QXP44186J4` (same snippet as `public/index.html`). Nothing else is loaded from third parties.
- **Header:** brand logo + primary nav linking back to the homepage (Free tools highlighted), then a slim bar with the tool name, same pattern as `projects/decline-code-lookup/src/components/Header.astro`.
- **Free-tool label:** every tool page shows a "Free tool" badge and the line "Free for everyone to use, no sign-up." near the top; the homepage card carries the same badge.
- **Disclaimer:** every tool page ends with the full disclaimer below; homepage cards and the "Free tools" block carry the short form.
- **SEO:** canonical URL, OG/Twitter tags, JSON-LD `WebApplication` + `FAQPage`, a methodology section with formulas and assumptions, and the tool's URL listed in `public/sitemap.xml`.
- **Accessibility/UX:** labelled inputs, results in an `aria-live` region, works at mobile width, inputs validated with inline messages (never a silent `NaN`).
- **Share & favorites bar (mandatory on every tool, ADR-006):** a `share-bar` block near the end of the page, just above the related-tools links and the disclaimer, headed "Found this tool useful? Share it or save it." It holds plain-text links styled as buttons, with the tool's canonical URL and title baked into each `href` so they work without JavaScript: Share on LinkedIn, Share on X, Share on Facebook, Share on WhatsApp, Share by email (`mailto:`). Two buttons are revealed by the tool's own `share.js` (a copy per folder, loaded with `defer`): **Copy link** and **Add to favorites**. Browsers do not allow a page to create a bookmark, so the favorites button shows a platform-specific hint (Ctrl + D, ⌘ + D, or the browser-menu steps on iOS and Android). No third-party script, SDK, icon font or tracking pixel is loaded; the third-party site is only opened when the visitor clicks. Clicks are reported to the existing GA4 tag as a `share` event (`method`, `content_type`, `item_id`). New tools start from a copy of an existing tool's bar; do not ship a tool without it.
- **Not on cards:** no "View code" button; user-facing copy avoids the word "projects" (use "tools"). Card button is "Open".

### Disclaimer (full form, English, on every tool page)

> This tool is provided free of charge for general informational and educational purposes only. It is offered "as is", without warranty of any kind, and does not constitute professional, statistical, financial, legal or marketing advice. Results depend on the accuracy of your inputs and on the statistical assumptions stated on this page; you are solely responsible for decisions taken on the basis of the results. To the fullest extent permitted by law, the author accepts no liability for any loss or damage arising from use of this tool. This is an independent personal initiative by Anthony Skolozdrzyk-Ardouin; it is not affiliated with, endorsed by, or representative of any current or former employer. Calculations run entirely in your browser: the data you enter is not sent to or stored on any server. Anonymous usage analytics (Google Analytics) are collected on this site.

Short form (cards / "Free tools" block): "Free tool for free use. Provided as is, for information only — not professional advice. See the disclaimer on each tool."

## Homepage integration

The homepage section `#work` is titled **"Free tools"** (FR "Outils gratuits", DE "Kostenlose Tools") on `public/index.html`, `public/fr/index.html`, `public/de/index.html`. It holds a single sub-block: heading "Free tools for marketers, product managers and finance teams" (translated in FR/DE), a short "free, no sign-up" note that carries a bold **Disclaimer** sentence (as is, information only, not professional, financial, legal or marketing advice, the author accepts no liability, not affiliated with any employer, full disclaimer on each tool), and a grid of compact cards (badge, name, one-line benefit, tags, **Open** → `projects/<tool>/`). New tools are appended to the grid **before Decline Code Lookup, which is always the last card**: it is listed like any other tool (same card, same badge, no featured panel or metrics). Shipping a tool means adding its card to all three homepages and its URL to `public/sitemap.xml`, in the same change. Card styles live in `public/assets/css/style.css`.

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

## Tool 7 — Break-even & Pricing Calculator

Path `projects/break-even-pricing-calculator/`. Question answered: *how many units must I sell to cover my costs, what price gives me the margin I want, and what does a discount really cost me?* For finance people, founders, marketers and PMs. Plain-language principles above apply (headline verdict first, no jargon without a gloss, worked example, glossary, FAQ). Optional fields are marked optional; a currency symbol (display only) is shared by the tabs.

**Tab "Margin & markup".** Inputs: cost per unit; "what do you know?" (selling price, margin % or markup %) and its value. Outputs: selling price, profit per unit, margin = profit / price, markup = profit / cost. Headline explains that margin (share of the price) and markup (share of the cost) are different numbers, e.g. a 25 % markup is a 20 % margin. Reference table: margins 10–60 % with the markup that gives the same result. Formulas: price = cost / (1 − margin) = cost × (1 + markup); markup = margin / (1 − margin); margin = markup / (1 + markup). Margin must be 0 % or more and under 100 %; markup 0 % or more; price and cost above 0. A price below cost is allowed and shows a loss (negative margin and markup).

**Tab "Break-even".** Inputs: fixed costs per period (costs that do not change with sales), price per unit, variable cost per unit (what each extra sale costs), optional target profit, optional units sold or expected in the period. Outputs: contribution per unit = price − variable cost; contribution margin = contribution / price; break-even units = ceil(fixed / contribution) and the sales at that point (units × price); units for the target profit = ceil((fixed + target) / contribution); with units given: profit = units × contribution − fixed and margin of safety = (units − fixed / contribution) / units. Rule-of-thumb light on the margin of safety (30 % or more good, 10 % or more warn, otherwise bad), labelled as a rule of thumb. Edge cases: contribution 0 or negative → "you never break even at this price" with what to change; fixed costs 0 → break-even 0 units; negative inputs rejected.

**Tab "Discount".** Inputs: current price, cost per unit, discount %, optional units sold today. Outputs: new price, profit per unit before and after, **extra volume needed to keep the same total profit** = discount / (margin − discount) where margin = (price − cost) / price, and with units given, the units needed. A table for discounts of 5, 10, 15, 20 and 25 % at the same price and cost. If the discounted price is at or below cost, no extra volume can make up for it (shown as "impossible: you would lose money on every sale"). Light: impossible bad, extra volume of 50 % or more warn (rule of thumb), otherwise good. Edge cases: price at or below cost rejected with a message; discount 0 % to under 100 %.

## Tool 8 — Company Valuation Calculator (WACC, Free Cash Flow, DCF & EPS)

Path `projects/company-valuation-calculator/`. Question answered: *how do WACC, free cash flow, a DCF valuation and EPS fit together?* An explicitly **educational** tool (aimed at students and curious people learning the mechanics), not an investor tool — see the tone and disclaimer rules below, which apply only to this tool.

**Design choice:** an earlier draft proposed four separate calculators (WACC, FCF, EPS, DCF); they were combined into this one tool because WACC and FCF are only useful once discounted together in a DCF, and EPS is the natural companion figure shown alongside the result. Combining them also lets shared numbers (shares outstanding, tax rate, total debt) be entered once and reused, instead of asked for repeatedly.

**Inputs, in one form, four grouped sections, sensible example values prefilled:** shares outstanding and a currency symbol (entered once, reused throughout).
1. *Cost of capital (WACC):* risk-free rate (%), beta, equity risk premium (%) — combined via CAPM into cost of equity; cost of debt pre-tax (%); tax rate (%, reused in section 2); market value of equity; market value of debt (reused in section 3 as total debt).
2. *Free cash flow (base year):* EBIT, depreciation & amortisation, CapEx, increase in net working capital (negative allowed if it freed up cash).
3. *Growth & DCF valuation:* expected annual FCF growth (%), projection period (3/5/7/10 years, default 5), long-term/terminal growth (%, must be lower than the calculated WACC), cash & equivalents.
4. *Earnings per share (EPS):* net income, preferred dividends, additional diluted shares (from options/convertibles), and an optional current share price.

**Outputs:** cost of equity, after-tax cost of debt, WACC, base-year free cash flow, enterprise value, equity value, basic EPS, diluted EPS, and (if a share price is entered) the P/E ratio. Headline result: value per share from the DCF, framed as "this worked example's DCF estimate," not a valuation of a real company. A collapsible "year-by-year workings" table shows each projected year's cash flow and present value, plus the terminal value line, for transparency. If a share price is entered, the tool states a **plain numeric comparison only** ("the price you entered is about N% above/below this worked example's DCF estimate") — it never renders a verdict, signal, or judgment (no "cheap/expensive," "undervalued/overvalued," "buy/hold/sell," anywhere in the UI, results or FAQ).

**Tone and disclaimer (specific to this tool, in addition to the standard site-wide disclaimer above):** copy reads like a textbook walkthrough for students and curious people, not investor guidance. A prominent notice near the top of the page (not only at the bottom) states explicitly: educational purposes only; not a recommendation to buy, hold or sell any security; no real market data is used; ignores real-world complexity (multiple valuation methods, qualitative factors, market conditions, risk not captured by a single discount rate); not financial, investment, legal, accounting or tax advice; the author accepts no liability and denies responsibility for decisions made using it; consult a qualified professional for real decisions.

Formulas: cost of equity = risk-free rate + beta × equity risk premium; WACC = equity-weight × cost of equity + debt-weight × cost of debt × (1 − tax rate); FCFF = EBIT × (1 − tax rate) + D&A − CapEx − increase in NWC; projected FCF at year t = base FCF × (1 + growth)^t; terminal value = final-year FCF × (1 + terminal growth) / (WACC − terminal growth); enterprise value = Σ present values of projected FCF + present value of terminal value; equity value = enterprise value − total debt + cash; value per share = equity value ÷ shares outstanding; basic EPS = (net income − preferred dividends) ÷ shares outstanding; diluted EPS = (net income − preferred dividends) ÷ (shares outstanding + additional diluted shares) (simplified: no treasury-stock-method offset, stated as such in Methodology); P/E = price ÷ basic EPS (shown as n/a when EPS ≤ 0).

**Edge cases:** tax rate must be 0% up to (not including) 100%; market value of equity and debt cannot both be 0; calculated WACC must be greater than 0 or the DCF cannot run; terminal growth must be lower than the calculated WACC (otherwise the perpetuity formula is undefined) — checked after WACC is computed, with an inline error naming the calculated WACC; shares outstanding must be greater than 0; EBIT, change in NWC and net income may be negative (loss-making inputs allowed); D&A, CapEx, cash, preferred dividends and additional diluted shares must be 0 or more; share price is optional (blank skips the P/E and comparison) but must be greater than 0 if entered.

## Tests

Tools 1–2 ship `stats.test.mjs` (run with `node`), asserting reference values: z(0.975) = 1.95996; χ² p-value = 0.05 at df=1 x=3.841 and df=2 x=5.991; z² equals uncorrected χ² on the same 2×2; hand-computed sample-size and CI examples. Tool 3's formulas and Tool 4's URL builder are pure functions covered by the same style of test file. Tool 7's `calc.test.mjs` asserts hand-computed values (cost 80 / price 100 gives margin 20 % and markup 25 %; fixed 10,000, price 50, variable 30 breaks even at 500 units; a 10 % discount at a 40 % margin needs 33.3 % more volume; a discount equal to the margin is impossible). Tool 5's `calc.test.mjs` asserts hand-computed values (ending MRR, NRR and its annualisation, quick ratio boundary at exactly 4, burn multiple, runway) and the light boundaries; Tool 6's asserts RICE/ICE scores, ranking with ties, paste parsing (header, tabs vs commas, impact words, bad lines) and CSV escaping including the formula-injection prefix. Tool 8's `calc.test.mjs` asserts hand-computed values (CAPM cost of equity, WACC with mixed and all-equity capital structures, FCFF including a negative-EBIT case, a multi-year FCF projection, a DCF present-value/terminal-value case computed the same way as the implementation, the enterprise-to-equity bridge, basic/diluted EPS and P/E including the null case at zero or negative EPS) plus the invalid-input errors (100% tax rate, zero equity and debt, terminal growth at or above the discount rate, zero shares). Every tool is also checked in a browser under the deployed base path.
