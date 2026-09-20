---
title: "Why Platform Conversions Overstate Impact (and How to Test)"
description: "Ad platforms report conversions they may not have caused. Learn how incrementality tests work, with a worked cost example and a step-by-step plan."
pubDate: 2026-10-17T09:00:00.000+02:00
tags: ["marketing analytics", "incrementality", "geo testing", "advertising measurement"]
draft: true
---

> **Short answer:** Platform reports count conversions that happened after an ad was shown or clicked, whether or not the ad caused them. An incrementality test compares a group exposed to the campaign with a comparable group that was not, and the gap is the extra sales the campaign actually created. In an illustrative case, a campaign reporting 500 conversions produced only 140 incremental ones, which changes cost per conversion from $20 to about $71.

If your ad dashboard says a campaign earned 500 conversions and your finance team sees no matching lift in sales, both can be right. They are answering different questions. This post explains why platform numbers run high and how to run a test that measures what the campaign truly added.

## Why do platform-reported conversions run high?

Ad platforms report **attributed** conversions: purchases by people who saw or clicked an ad within some time window. That is association, not cause. Some of those customers were already on their way to buying.

The measurement firm Deducive points to a few reasons the numbers mislead: platforms use generous attribution windows that can double-count conversions across channels, and tracking gaps such as consent banners, device switching and cross-domain checkouts weaken the data.

*Source: [Deducive: Our Guide to Marketing Attribution, Incrementality and MMM for 2026](https://www.deducive.com/blog/2025/12/12/our-guide-to-marketing-attribution-incrementality-and-mmm-for-2026).*

Academic evidence points the same way. In a study of 15 large Facebook advertising campaigns in 2015, Gordon, Zettelmeyer, Bhargava and Chapsky found that in half of the studies, the estimated percentage increase in purchases from non-experimental methods was off by a factor of three. Observational methods often overestimated the effect, although some significantly underestimated it.

*Source: [Gordon et al., Marketing Science, 2019](https://www.kellogg.northwestern.edu/faculty/gordon_b/files/fb_comparison.pdf).*

## What is incrementality?

Incrementality is the difference between what happened with the campaign and what would have happened without it. GeoLift's documentation frames it as the difference "between what we observed as the results of that campaign and what would have happened in a world where it didn't take place (counterfactual)."

## What does this change in practice?

Here is a worked example. The conversion counts follow Deducive's illustrative case, and the $10,000 spend is my own assumption to show the arithmetic.

| Metric | Platform-reported view | Incrementality view |
| --- | --- | --- |
| Spend | $10,000 | $10,000 |
| Conversions | 500 (attributed) | 140 (would be lost if the campaign stopped) |
| Cost per conversion | **$20.00** | **$71.43** |
| Share of reported conversions that were incremental | n/a | 28% |

The same campaign looks more than three times more expensive once you count only the sales it caused. A campaign can still be worth running at $71 per incremental customer if margins and lifetime value support it. The point is to make the decision on the right number.

## What are the ways to test incrementality?

Deducive outlines three approaches:

1. **True experiments** with randomized groups are the most accurate but can be disruptive.
2. **Natural experiments** use historical variation. They are cheaper and depend on the data you already have.
3. **Platform-assisted lift tests** are accessible but rely on the platform's own set-up.

For advertisers, a geography-based test is a common practical choice. GeoLift, Meta's open-source framework, uses synthetic control methods: it finds the combination of untreated regions that most closely replicates the treated ones, then measures how far actual results diverge. It was designed for advertisers without access to online tracking pixels or APIs as an alternative to randomized controlled trials.

*Source: [GeoLift: Methodology](https://facebookincubator.github.io//GeoLift/docs/Methodology/).*

## How do I run an incrementality test, step by step?

The steps below are my recommended process, built on the methods above.

1. **Write the question.** For example: "Does our paid social prospecting campaign increase new-customer orders in a region?"
2. **Choose one primary metric.** Pick an outcome you can measure reliably outside the ad platform, such as orders or revenue in your own store data.
3. **Pick the design.** Use a platform lift study if available, or a geo test if you cannot randomize people.
4. **Run a power analysis first.** GeoLift notes that geo experiments often produce small effects and carry a significant chance to fail, so it provides power calculators to set test duration, investment and number of markets before launch. Skipping this is a common reason tests end inconclusive.
5. **Keep everything else steady.** Avoid launching promotions, changing prices or shifting other channels in test regions during the test.
6. **Set the decision rule in advance.** For example: "We will scale the campaign if incremental cost per order is below $X."
7. **Run for the planned period, then analyze.** Do not stop early because a result looks good.
8. **Record and reuse the result.** Feed test results into your broader measurement. Meta's Robyn guide strongly recommends using experimental results to calibrate marketing mix models. See [Attribution vs. Incrementality vs. MMM](https://anthonysko.com/blog/attribution-vs-incrementality-vs-mmm/).

## Which campaigns should I test first?

Start where attribution is most likely to take undeserved credit. My suggestion is retargeting, brand search and any campaign aimed at people already close to buying, because those audiences often buy anyway. Test your largest budget lines next, since a small error there costs the most.

## Frequently asked questions

**Does incrementality testing mean my platform data is useless?**
No. Platform data is fast and granular, which suits daily optimization. Use tests to check its overall accuracy.

**How long should a test run?**
It depends on your volume and the size of the effect you expect. A power analysis, like the one GeoLift provides, estimates the duration and budget needed.

**What if the test shows the campaign was not incremental?**
That is a useful result. Reduce or restructure the spend and re-test. One test is a single data point, so confirm surprising results before making large cuts.

**Can small stores do this?**
Yes, though small volumes make it harder to detect modest effects. A longer test or a larger change in spend can compensate.

## Sources

- [Deducive: Marketing Attribution, Incrementality and MMM for 2026](https://www.deducive.com/blog/2025/12/12/our-guide-to-marketing-attribution-incrementality-and-mmm-for-2026)
- [Gordon et al., "A Comparison of Approaches to Advertising Measurement" (Marketing Science, 2019)](https://www.kellogg.northwestern.edu/faculty/gordon_b/files/fb_comparison.pdf)
- [GeoLift: Methodology](https://facebookincubator.github.io//GeoLift/docs/Methodology/)
- [Robyn: An Analyst's Guide to MMM](https://facebookexperimental.github.io/Robyn/docs/analysts-guide-to-MMM/)

*Last reviewed: 19 September 2026.*
