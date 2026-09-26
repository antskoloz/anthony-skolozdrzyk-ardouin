---
title: "Common A/B Testing Mistakes That Invalidate Results"
description: The mistakes that quietly invalidate an A/B test even when the
  math is done correctly — peeking early, underpowered samples, and more.
pubDate: 2026-09-26T15:30:00.000+02:00
tags:
  - ab testing
  - statistics
  - data analytics
  - experimentation
draft: false
---
> **Short answer:** Most invalid A/B tests aren't caused by wrong math — the significance formula is usually applied correctly. They're caused by how the test was run: stopping early when it looks good, testing so many metrics that one hits significance by chance, running with too little traffic for the effect you're trying to detect, or letting something outside the test contaminate the result. Each of these breaks the test's assumptions before the statistics ever get a chance to be wrong.

A test can produce a clean, correctly calculated p-value and still be telling you the wrong thing, because the error happened before the calculation, in how the test was designed or run.

## Stopping early because it "looks significant"

This is the single most common mistake. Checking a test daily and stopping the moment the result crosses your significance threshold inflates the real false-positive rate well past the 5% you think you're accepting, because each daily check is another chance for random noise alone to cross the line. A test that would have settled back down to "no difference" by its planned end date can look significant halfway through purely by chance.

**Fix:** decide sample size and stop date before launch, and hold to it. If you genuinely need to check results continuously, use a testing method built for that (sequential testing), not a fixed-horizon significance test checked daily.

## Testing many metrics and reporting the one that "won"

Run a test on ten different metrics, and at 95% confidence you'd expect roughly one of them to look "significant" purely by chance, even if nothing about the test actually changed anything. Reporting only the metric that crossed the line, after the fact, is a form of this mistake even when it isn't intentional — it's easy to unconsciously treat the metric that moved as "the" result.

**Fix:** decide your one primary metric before the test runs. Track secondary metrics for context, but don't treat a secondary metric crossing significance as equivalent evidence to the pre-declared primary one.

## Underpowered samples for the effect size you're testing

A test that ends "inconclusive" is often not evidence of no effect — it's evidence the sample was too small to detect the effect size you were actually looking for. See [A/B test sample size and significance](/blog/ab-test-sample-size-and-significance-explained/) for why smaller effects need dramatically more traffic; a common failure mode is setting the minimum detectable effect unrealistically small, running out of patience, and concluding "no difference" when the honest conclusion is "this test couldn't have told us either way."

**Fix:** calculate the required sample size before launch, and check the estimated test duration against your actual traffic before committing to the test.

## Seasonal or external effects contaminating the window

A test that happens to run across a holiday, a pricing change, a major site outage, or a marketing campaign launch is measuring the combined effect of your test and whatever else happened, not the test alone. This is especially easy to miss when the confound affects both variants equally in total volume but differently in composition — for instance, a holiday driving a different mix of new vs returning visitors into the test.

**Fix:** avoid launching other changes during a live test, and note anything unusual that happened during the window when interpreting results. If a confound is unavoidable, consider extending the test to average it out, or excluding the affected days if that can be decided in advance rather than after seeing the results.

## Novelty effects skewing early results

A new design or feature can get a temporary lift (or dip) simply because it's new and different, independent of whether it's actually better. This is common with visual redesigns and can fade within days or weeks as users acclimate.

**Fix:** for changes where a novelty effect is plausible, run the test long enough to see whether the lift persists, and consider segmenting by new vs returning users to see if the effect is concentrated among people seeing the change for the first time.

## Mixing new and returning users incorrectly

If your test randomizes at the session level rather than the user level, a returning visitor can see both versions across different sessions, which contaminates the comparison — they're not a clean data point for either variant. Similarly, comparing metrics that only make sense for new users (like first-purchase conversion) without separating the population can dilute a real effect.

**Fix:** randomize and analyze at the user level when the metric is about user behavior over time, and check your test tool's assignment method rather than assuming it does this correctly by default.

## Sample ratio mismatch

If your test is meant to split traffic 50/50 but the actual observed split comes out meaningfully skewed (say 55/45 with a large sample), something is wrong with the assignment mechanism itself — a bug, a caching issue, or a bot filter behaving asymmetrically. A skewed ratio can bias the result in ways that aren't obvious from the topline numbers alone.

**Fix:** check the actual traffic split against the intended one before trusting any result from the test. A significant sample ratio mismatch is a reason to discard the test, not just a footnote.

## What should I actually do?

1. Write down the primary metric, sample size, and stop date before the test starts.
2. Check for sample ratio mismatch once the test is running.
3. Avoid launching other changes into the test window.
4. Resist reading daily results as a decision point; treat them as a progress check only.
5. If the test ends inconclusive, check whether it was underpowered before concluding "no effect."

For the mechanics of the test itself, see [A/B test sample size and significance](/blog/ab-test-sample-size-and-significance-explained/) and, for comparisons across more than two groups, [chi-square test explained](/blog/chi-square-test-explained/). The [free A/B test calculator](https://anthonysko.com/projects/ab-test-calculator/) handles the sample-size and result-reading math for a clean, well-run test — it can't fix a test that was contaminated by one of the mistakes above.
