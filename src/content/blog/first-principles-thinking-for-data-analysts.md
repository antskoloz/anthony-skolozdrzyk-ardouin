---
title: First-Principles Thinking for Data Analysts
description: "What first-principles thinking means for a data analyst, with
  worked examples: questioning a metric, a benchmark and a dashboard request."
pubDate: 2026-10-04T11:08:00.000+02:00
tags:
  - analyst craft
  - problem solving
  - data analytics
draft: false
---
> **Short answer:** First-principles thinking means breaking a problem down to what you know is true, separating it from what you're assuming, and rebuilding the answer from there. For an analyst, it usually starts with three questions: what decision is this for, what is this number actually counting, and what would have to be true for this conclusion to hold?

Most analysis goes wrong before the first query runs. Someone asks for a number, we reach for the usual approach, and we answer the question as asked rather than the question that matters. First-principles thinking is the habit that catches this early.

This post explains the idea without the mythology, then walks through three situations every analyst meets: a metric that looks wrong, a benchmark everyone quotes, and a dashboard request.

## What is first-principles thinking?

The idea is old (Aristotle wrote about "first principles" as the basic truths you can't deduce from anything else), but the practical version is simple. When you face a problem, you:

1. **List what you're assuming.** Including the things that feel too obvious to write down.
2. **Separate facts from assumptions.** A fact is something you can check. An assumption is something you're taking on trust.
3. **Rebuild from the facts.** Work out the answer from what's left, instead of copying what's usually done.

The opposite is reasoning by analogy: "we did it this way last time", "everyone uses this benchmark", "the industry standard is X". Analogy is fast and often right. The problem is that you can't tell when it's wrong, because you never checked the foundations.

A good illustration is the Wright brothers. When their gliders didn't perform the way the published lift tables predicted, they didn't assume they'd built them badly. They built a small wind tunnel and tested more than 200 wing shapes themselves. The tables everyone relied on turned out to be off. Analysts meet smaller versions of this every week.

## Why does it matter more for analysts now?

Because answers got cheap. An AI assistant will write a plausible query and a confident summary in seconds. What it can't do is know which assumptions your business is quietly making. I've written about [why LLMs hallucinate numbers](/blog/why-llms-hallucinate-numbers-in-analytics/); most of those failures are assumption failures, not arithmetic ones.

The skill that keeps its value is the one that asks "what is this actually measuring?" before anyone builds on the answer.

## Example 1: the metric that looks wrong

Say conversion rate dropped from 3.1% to 2.4% overnight. Reasoning by analogy says: something broke in checkout, open a ticket.

From first principles, start with what the number is: **conversions divided by sessions**. Two numbers, so two places it can move.

| Question                   | What you check                                                            |
| -------------------------- | ------------------------------------------------------------------------- |
| Did conversions fall?      | Orders in the order system, not the analytics tool                        |
| Did sessions rise?         | Traffic by source: a bot spike or a new campaign inflates the denominator |
| Did the definition change? | A tracking release, a consent banner change, a new filter                 |
| Is it real at all?         | Was yesterday a normal day? Compare with the same weekday                 |

Illustrative numbers: if orders are flat and sessions jumped 30% from one referral source, checkout is fine. The denominator moved. That's a very different ticket, sent to a very different team.



## Example 2: the benchmark everyone quotes

"A good SaaS churn rate is under 5%." You'll see numbers like this in every deck. First-principles questions:

* **Who measured it, and on whom?** A benchmark from enterprise contracts says little about a monthly self-serve product.
* **What's the definition?** Logo churn or revenue churn? Monthly or annual? Gross or net?
* **What decision does it support?** A benchmark tells you whether you're unusual. It doesn't tell you what to do.

I went through this in more detail for [RevOps benchmarks](/blog/revops-benchmarks-2026-what-gartner-says/). The short version: a benchmark is a hypothesis about your business, not a fact about it. Your own trend over time is usually the better yardstick, and the [SaaS metrics post](/blog/saas-metrics-that-matter-mrr-churn-ltv-nrr/) covers which definitions to pin down first.

## Example 3: the dashboard request

"Can you build a dashboard with revenue by region, by product, by channel, by week?"

Reasoning by analogy: build it. First principles: what decision will someone make differently after seeing it?

Ask that, and the request often shrinks. Maybe the real question is "which region is behind target this quarter?" That's one number per region and a target line, not a 40-visual dashboard. It also tells you what to put at the top, which is most of what makes a [dashboard people actually open](/blog/kpi-dashboard-best-practices-people-actually-open/).

A question I like: **"If this number went up 10% tomorrow, what would you do?"** If the answer is "nothing", the number doesn't belong on the front page.

## How do I practise it without slowing everything down?

You don't apply it to everything. First-principles thinking is expensive, and most days the usual approach is fine. Use it when:

* the stakes are high (a number going to leadership, a decision with real money behind it),
* something surprises you,
* or "that's how it's always done" is the only justification on offer.

A lightweight routine I'd suggest:

1. **Write the decision in one sentence** before you start. "We'll use this to decide whether to cut channel X."
2. **Write the formula of every key number.** Numerator, denominator, filters, time window. This alone catches most problems. A [metric definition doc](/blog/metric-definition-doc-with-a-template/) makes it a habit.
3. **List three assumptions** the conclusion depends on, and check the cheapest one.
4. **Ask what would change your mind.** If nothing could, you're not analysing, you're defending.

## What first-principles thinking is not

It's not "ignore all prior knowledge". Frameworks, benchmarks and best practices exist because they're usually right, and they're fast. The aim is to know which foundations you're standing on, not to rebuild the house every morning.

My take: the formula-writing step is the one to start with. It takes two minutes, it feels slightly silly, and it has saved me from more wrong answers than any tool.

*Sources: the Wright brothers' wind-tunnel work is documented by the [Smithsonian National Air and Space Museum](https://airandspace.si.edu/exhibitions/wright-brothers). The examples use illustrative numbers. The routine is my own.*
