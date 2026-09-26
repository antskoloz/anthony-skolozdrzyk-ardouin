---
title: "A/B Test Sample Size and Significance: A Plain-English Guide"
description: How to calculate the sample size an A/B test needs and how to
  read the result once it's done, with a worked example and a free
  calculator.
pubDate: 2026-09-26T14:30:00.000+02:00
tags:
  - ab testing
  - statistics
  - data analytics
  - marketing analytics
draft: false
---
> **Short answer:** Before a test, sample size depends on your baseline rate, the smallest improvement worth detecting, and how sure you want to be. Smaller improvements need dramatically more traffic to detect reliably. After a test, a "significant" result means the gap you observed would be unlikely to happen by luck alone if the two versions were really identical — it doesn't by itself tell you the size of the true improvement, only that one probably exists.

Two separate questions get lumped under "A/B testing," and mixing them up causes most of the confusion: *how much traffic do I need before I start*, and *did the result I got actually mean anything*.

## What does "how sure do you want to be" actually mean?

This is your confidence level, commonly set at 95%. It means: if there were truly no difference between the two versions, a result as extreme as the one you'd accept as "significant" would happen by chance only 5% of the time. It is not a statement about how likely your specific result is to be correct — it's a statement about how often this decision rule would falsely flag "there's a difference" when there isn't one.

## What is statistical power, and why does it matter for sample size?

Power is the flip side of confidence: it's the chance your test actually detects a real improvement, if one truly exists, of the size you specified. A test with 80% power means that if the true improvement is exactly the size you're testing for, you'll correctly detect it 80% of the time. Set power too low, and a real improvement can slip through as "no significant difference" simply because the sample wasn't large enough to see it clearly.

## How is sample size actually calculated?

The formula behind it (per variant):

```
n = (z_α · √(2·p̄·(1−p̄)) + z_β · √(p₁(1−p₁) + p₂(1−p₂)))² / (p₂ − p₁)²
```

Where `p₁` is your baseline conversion rate, `p₂` is the rate you'd get if the improvement you're testing for is real, `p̄` is their average, and `z_α`/`z_β` come from your chosen confidence and power levels. You don't need to compute this by hand — a [free A/B test calculator](https://anthonysko.com/projects/ab-test-calculator/) does it for you — but understanding what's inside it explains why the answer behaves the way it does.

## Why do small improvements need so much more traffic?

Because `(p₂ − p₁)²` is in the denominator, halving the improvement you're trying to detect roughly quadruples the sample size needed. A baseline of 5% conversion with a target improvement to 5.5% (a 10% relative lift) needs a lot more visitors to detect reliably than the same baseline moving to 6% (a 20% relative lift), because the smaller absolute gap is easier for random noise to hide.

**Worked example:** baseline 5%, testing for a 10% relative improvement (5% → 5.5%), at 95% confidence and 80% power, needs roughly 30,000 visitors per variant. Test for a 20% relative improvement instead (5% → 6%) at the same confidence and power, and the requirement drops to around 8,000 per variant — a quarter of the traffic, for detecting a change twice as large. This is the single most useful intuition in test planning: don't set your minimum detectable effect smaller than you actually need to act on, because the traffic cost scales steeply.

## How do I read a result once the test has run?

A significant result at 95% confidence tells you: if A and B were truly identical, a gap this large would show up by luck about 5 times in 100. It does not tell you the exact size of the true improvement — for that, look at the confidence interval around the observed lift, not just the pass/fail verdict. A result can be statistically significant and still be a small effect, or it can narrowly miss significance while still suggesting a real (if unconfirmed) improvement worth another look.

## Why does "peeking" early break the test?

Checking a test every day and stopping the moment it looks significant inflates your false-positive rate well above the 5% you signed up for, because you're effectively running many small tests (one per check) and taking the best-looking one. Each look gives random noise another chance to cross the significance threshold, even with no real effect present. The fix is deciding your sample size and stop date before the test starts, and holding to it, or using a testing method specifically designed for repeated looks (sequential testing), rather than checking a fixed-horizon test daily and stopping on your own judgment.

## What should I actually do with this?

1. Decide the smallest improvement that would be worth acting on — not the smallest improvement you'd be happy to see, but the smallest one that would actually change a decision.
2. Calculate the required sample size before launch, and check the estimated duration against your actual traffic. If it's more than a few weeks, either the effect you're testing for is too small to be worth chasing right now, or the test isn't the right tool for this decision.
3. Run for the full planned sample, without stopping early.
4. Read the result as a confidence interval, not just a pass/fail label.

For test designs beyond a simple two-version split — comparing more than two groups at once, or categorical outcomes beyond yes/no — the [chi-square test](/blog/chi-square-test-explained/) is the natural next tool, and [common A/B testing mistakes](/blog/common-ab-testing-mistakes-that-invalidate-results/) covers the ways a well-planned test still goes wrong in practice.
