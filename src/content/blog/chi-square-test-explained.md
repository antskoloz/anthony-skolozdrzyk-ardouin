---
title: "Chi-Square Test Explained: When to Use It and How to Read It"
description: What the chi-square test measures, how to read observed vs
  expected counts, and when it's more useful than a simple two-proportion
  test.
pubDate: 2026-09-26T15:00:00.000+02:00
tags:
  - statistics
  - chi-square
  - data analytics
  - ab testing
draft: false
---
> **Short answer:** A chi-square test checks whether the differences you see between two or more groups' categorical outcomes are bigger than random chance would produce. It compares the counts you actually observed against the counts you'd expect if every group behaved identically, using χ² = Σ(O − E)²/E. It generalizes a simple two-group comparison to any number of groups or outcome categories.

If an A/B test compares exactly two versions on a yes/no outcome, a two-proportion test and a chi-square test on a 2×2 table give you the same answer — in fact they're mathematically equivalent there. Chi-square earns its keep once you go beyond two groups, or beyond a simple yes/no outcome.

## What does "observed vs expected" mean?

Say you're comparing conversion across three marketing channels:

| Channel | Visitors | Conversions |
| --- | --- | --- |
| Email | 1,000 | 120 |
| Social | 1,000 | 95 |
| Search | 1,000 | 140 |

The overall conversion rate across all three is (120+95+140)/3,000 ≈ 11.8%. If channel made no difference at all, each channel's *expected* conversions would be its visitor count times that overall rate: about 118 for each. The chi-square test measures how far the *observed* counts (120, 95, 140) are from that expected baseline (118, 118, 118), and asks whether a gap that size is more than luck would typically produce.

## What's the formula, worked through?

```
χ² = Σ (O − E)² / E
```

For each cell (each channel's conversions and non-conversions), take the observed count, subtract the expected count, square it, divide by the expected count, then sum across every cell. A larger χ² means the observed pattern deviates more from "no difference between groups." Degrees of freedom for a table with r rows and c columns is `(r−1)(c−1)` — for the 3-channel example above (3 groups × 2 outcomes), that's `(3−1)(2−1) = 2`.

## How do I read the p-value and degrees of freedom?

The p-value answers: if channel truly made no difference, how often would a χ² this large happen by chance alone? A small p-value (typically under 0.05) means the pattern is unlikely to be pure noise. Degrees of freedom matter because the same χ² value means different things depending on how many groups and categories you're comparing — a table with more cells naturally allows more room for random variation, so the threshold for "surprising" shifts accordingly. This is exactly why you compare the p-value, not the raw χ² number, across tests with different table sizes.

## When is a chi-square table not reliable?

The standard caveat: if any cell's *expected* count is below 5, the test's approximation becomes unreliable, and the result shouldn't be trusted at face value. This happens most often with small groups or rare outcomes. The usual alternative for a small 2×2 table is Fisher's exact test, which computes an exact probability instead of relying on the chi-square approximation.

## Once I know the groups differ, how do I find which one stands out?

The overall test tells you *some* group differs, not which one. Adjusted residuals answer that: for each cell, `(O − E) / √(E · (1 − row total/N) · (1 − column total/N))`. A cell with an adjusted residual beyond roughly ±1.96 stands out more than chance would typically produce, in that specific cell. In the channel example, if Search's adjusted residual comes out at +2.3, that's the channel converting meaningfully above the average; if Social's comes out at −2.1, that's the one underperforming. This is descriptive, not a second confirmed hypothesis test — treat it as "where to look," not "another significant result," especially if you're checking several cells at once.

## How do I measure the size of the difference, not just whether one exists?

A large sample can make even a tiny, practically meaningless difference statistically significant. Cramér's V gives you an effect-size number, scaled between 0 and 1, using `√(χ² / (N · min(r−1, c−1)))`. As a rough guide: values near 0.1 indicate a small effect, around 0.3 a moderate one, and 0.5 or above a strong one — though these bands are a general guide, not a hard rule, and what counts as "big enough to matter" still depends on your specific decision. For a simple two-group comparison, it's often more intuitive to look directly at the gap in conversion rates and how many times larger the best group is than the weakest, rather than Cramér's V alone, since V tends to look small whenever most people don't convert, even when the business gap is real.

## What should I actually do with this?

1. Build the observed-counts table for your groups and outcomes.
2. Check that no expected count falls below 5 before trusting the result.
3. Read the p-value against your chosen confidence level (95% is standard).
4. If significant, use adjusted residuals to see which group(s) actually drive the difference.
5. Report an effect size alongside significance, not instead of it — statistical significance alone doesn't tell a stakeholder whether the difference is big enough to act on.

A [free chi-square calculator](https://anthonysko.com/projects/chi-square-calculator/) runs all of this — observed/expected tables, p-value, adjusted residuals and Cramér's V — without the manual arithmetic. For the two-group, single-outcome case specifically, [A/B test sample size and significance](/blog/ab-test-sample-size-and-significance-explained/) covers the same ground from the test-planning side.
