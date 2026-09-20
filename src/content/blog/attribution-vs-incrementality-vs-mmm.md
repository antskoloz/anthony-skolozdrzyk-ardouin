---
title: "Attribution vs. Incrementality vs. MMM: Which to Use When"
description: Attribution, incrementality tests and marketing mix modeling answer
  different questions. Learn when to use each, with evidence from field
  experiments.
pubDate: 2026-09-19T10:01:00.000+02:00
tags:
  - marketing analytics
  - attribution
  - incrementality
  - marketing mix modeling
draft: false
---
> **Short answer:** Use attribution to see which touchpoints customers interacted with, incrementality tests to learn what a channel truly caused, and marketing mix modeling (MMM) to plan budgets across all channels over time. They are not rivals. Each answers a different question, and the strongest measurement setups use experiments to check the other two.

If you have ever seen a dashboard where every channel claims credit for the same sale, you have met the limits of attribution. This guide explains the three main methods, what each is good for, and how to combine them without a large team.

## What questions do these methods answer?

| Method                           | Question it answers                                                       | Data it needs                          | Main limit                                                 |
| -------------------------------- | ------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| **Attribution**                  | Which touchpoints did converting customers interact with?                 | User-level tracking data               | Shows association, not cause                               |
| **Incrementality testing**       | What extra sales did this activity cause?                                 | A test group and a control group       | Tests take time and planning; one test covers one question |
| **Marketing mix modeling (MMM)** | How do all channels, promotions and outside factors move sales over time? | Aggregated weekly data across channels | Needs enough history and variation                         |

## What is attribution, and where does it fall short?

Attribution assigns credit for a conversion to the marketing touchpoints a customer interacted with. It is quick to set up and works at the level of individual campaigns.

Its weakness is that being present is not the same as causing. A customer who was already about to buy may still click a retargeting ad, and the ad takes credit. Measurement consultancy Deducive also lists practical data problems: consent banners removing tracking signals, users switching devices, and cross-domain checkouts breaking cookies. It adds that ad platforms use generous attribution windows, which can double-count conversions.

*Source: [Deducive: Our Guide to Marketing Attribution, Incrementality and MMM for 2026](https://www.deducive.com/blog/2025/12/12/our-guide-to-marketing-attribution-incrementality-and-mmm-for-2026).*

## What is incrementality testing?

Incrementality asks a causal question: if I change this activity, how many sales change because of it? Deducive gives a simple illustration: a platform might report 500 conversions, while switching the campaign off would lose only 140 of them. In that illustration, the extra 360 conversions would have happened anyway.

There are three common ways to measure it:

1. **True experiments**, such as a randomized holdout, are the most accurate but can be disruptive.
2. **Natural experiments** use historical variation. They are cheaper but depend on your data.
3. **Platform-assisted lift tests** are easy to run but rely on the platform's own setup.

For a step-by-step walkthrough, see [Why Platform Conversions Overstate Impact (and How to Test)](https://anthonysko.com/blog/why-platform-reported-conversions-overstate-impact/).

## What is marketing mix modeling?

Meta's Robyn documentation describes MMM as "a privacy-friendly, highly resilient, data-driven statistical analysis that quantifies the incremental sales impact and ROI of marketing and non-marketing activities." It uses aggregated data, so it does not need to track individual users.

Two ideas sit at the core of most MMMs, according to the same guide:

* **Adstock**, which reflects how the effect of advertising persists over time.
* **Saturation**, the principle that each additional unit of exposure increases the response at a declining rate.

Google's open-source MMM, Meridian, uses Bayesian causal inference to estimate the incremental outcome of each marketing input. Its documentation says it helps answer three questions: historical ROI by channel, response curves that show how impact varies with spend, and optimal future budget allocation.

Robyn's guidance on data is specific: at least two years of weekly historical data, with enough variation in the inputs, and a ratio of about one independent variable per ten observations.

*Sources: [Robyn: An Analyst's Guide to MMM](https://facebookexperimental.github.io/Robyn/docs/analysts-guide-to-MMM/), [Google Meridian: Introduction](https://developers.google.com/meridian/docs/basics/meridian-introduction).*

## How do the three methods work together?

The connection is calibration. Robyn's guide "strongly" recommends using experimental results to calibrate an MMM, naming people-based studies like Meta Conversion Lift and geography-based approaches like GeoLift as sources of ground truth. Meridian similarly lets you feed domain knowledge into the model through priors.

A workable pattern, and it is my suggestion rather than a published standard:

| Step | Method               | Purpose                                                       |
| ---- | -------------------- | ------------------------------------------------------------- |
| 1    | Attribution          | Daily and campaign-level optimization, treated as directional |
| 2    | Incrementality tests | Check your biggest or least certain channels                  |
| 3    | MMM                  | Plan budgets across channels, calibrated with test results    |

## Which should I start with?

* **Small team, limited history:** Start with clean attribution plus one incrementality test on your largest paid channel.
* **Two or more years of weekly data and several channels:** Add an MMM, and calibrate it with your test results.
* **Heavy retargeting or brand search spend:** Test these first. They are the channels where attribution tends to claim the most credit.

## Frequently asked questions

**Is attribution useless?**
No. It is a fast, granular view of which touchpoints customers saw. Just do not read it as proof of cause.

**Can I run an MMM without user-level data?**
Yes. MMM uses aggregated data, which is why Robyn describes it as privacy-friendly.

**How much data does an MMM need?**
Robyn recommends at least two years of weekly data, with enough variation in spend and enough observations per input.

**What is the difference between a lift test and a geo test?**
A lift test typically compares randomized groups of people. A geo test compares regions. GeoLift, Meta's open-source tool, uses synthetic control methods to estimate what would have happened in the test regions without the campaign.

## Sources

* [Gordon et al., "A Comparison of Approaches to Advertising Measurement" (Marketing Science, 2019)](https://www.kellogg.northwestern.edu/faculty/gordon_b/files/fb_comparison.pdf)
* [Deducive: Marketing Attribution, Incrementality and MMM for 2026](https://www.deducive.com/blog/2025/12/12/our-guide-to-marketing-attribution-incrementality-and-mmm-for-2026)
* [Robyn: An Analyst's Guide to MMM](https://facebookexperimental.github.io/Robyn/docs/analysts-guide-to-MMM/)
* [Google Meridian: Introduction](https://developers.google.com/meridian/docs/basics/meridian-introduction)
* [GeoLift: Methodology](https://facebookincubator.github.io//GeoLift/docs/Methodology/)

*Last reviewed: 19 September 2026.*
