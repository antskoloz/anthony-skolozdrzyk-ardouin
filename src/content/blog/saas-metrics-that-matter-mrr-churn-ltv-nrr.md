---
title: "SaaS Metrics That Matter: MRR, Churn, LTV and NRR Explained"
description: MRR, churn, NRR, quick ratio and Rule of 40 explained in plain
  English, with a worked example showing why revenue growth alone can hide
  trouble.
pubDate: 2026-09-26T16:00:00.000+02:00
tags:
  - saas
  - saas metrics
  - data analytics
  - finance
draft: false
---
> **Short answer:** MRR growth alone can hide a shrinking core business if it's being propped up by new sales. Net revenue retention (NRR) — whether your *existing* customers alone grew or shrank your revenue, before counting any new sales — is the metric that tells you the truth underneath the topline number. Combine it with the SaaS quick ratio and the Rule of 40 to see health from three different angles at once.

A SaaS business can report MRR growing every month and still be in real trouble, if that growth is entirely new logos covering for existing customers quietly leaving. Here's how to see past the topline.

## What is MRR, and how do I calculate ending MRR for a period?

Monthly recurring revenue is the predictable revenue you'd expect this month from active subscriptions. Ending MRR for a period is:

```
Ending MRR = Starting MRR + New MRR + Expansion MRR − Contraction MRR − Churned MRR
```

- **New MRR** — revenue from brand-new customers.
- **Expansion MRR** — extra revenue from existing customers upgrading or buying more.
- **Contraction MRR** — revenue lost from existing customers downgrading.
- **Churned MRR** — revenue lost from customers cancelling entirely.

Annualized, `ARR = Ending MRR × 12`.

## What's the difference between gross churn, logo churn, and net revenue retention?

- **Gross MRR churn %** = `(Churned MRR + Contraction MRR) / Starting MRR` — the share of revenue lost to cancellations and downgrades, ignoring any expansion.
- **Logo churn %** = `Customers lost / Customers at start` — the share of *customers* (not revenue) who left, regardless of how much they were paying.
- **Net revenue retention (NRR)** = `(Starting MRR + Expansion − Contraction − Churned) / Starting MRR` — what happened to your *existing* customer base's revenue alone, with no new sales counted at all.
- **Gross revenue retention (GRR)** = `(Starting MRR − Contraction − Churned) / Starting MRR` — the same idea as NRR, but excluding expansion, so it can't go above 100%.

The distinction matters because a business can have a scary-looking logo churn rate (lots of small customers leaving) while NRR still looks fine, if the customers who stayed are expanding enough to offset it. It can also happen in reverse: low logo churn with weak NRR, if a few large accounts are quietly downgrading.

## Worked example

Starting MRR $100,000. During the month: $15,000 new, $8,000 expansion, $3,000 contraction, $7,000 churned.

- Ending MRR = 100,000 + 15,000 + 8,000 − 3,000 − 7,000 = **$113,000**
- Gross MRR churn = (7,000 + 3,000) / 100,000 = **10%**
- NRR = (100,000 + 8,000 − 3,000 − 7,000) / 100,000 = **98%**
- GRR = (100,000 − 3,000 − 7,000) / 100,000 = **90%**

MRR grew 13% this month. But NRR at 98% says the existing customer base alone actually *shrank* slightly before any new logos were counted — the growth is coming entirely from new sales. Annualized (raising the monthly rate to the 12th power, "if this month repeated all year"), an NRR of 98% compounds to roughly 78% a year, which is the kind of number that looks fine in a single month and alarming stated annually.

## What is the SaaS quick ratio?

```
Quick ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR)
```

It's a simple growth-efficiency number: how much MRR you're adding for every dollar you're losing. A ratio of 4 or higher is commonly treated as healthy, above 1 means you're still growing overall, and below 1 means you're shrinking even while adding new customers, because losses now outweigh everything coming in.

## What is the Rule of 40, and does it apply here?

```
Rule of 40 = Revenue growth % + Profit margin %
```

The idea: a fast-growing but unprofitable company and a slower-growing, profitable one can both be considered healthy if the two numbers sum to 40 or more. A company growing 60% with a −25% margin (35 combined) is judged similarly to one growing 15% at a 25% margin (40 combined). It's a widely quoted rule of thumb, not a guarantee — used more as a quick health signal for comparing SaaS businesses at a glance than as a precise threshold.

## What is the burn multiple, and what's runway?

```
Burn multiple = Net burn over the period / Net new ARR (Net new MRR × 12)
Runway (months) = Cash in bank / Monthly net burn
```

Burn multiple answers "how much am I spending to generate each dollar of new annual recurring revenue?" — lower is more efficient, with 1.5 or below often considered strong and above 3 a warning sign. Runway is the simpler, blunter number: how many months until the cash runs out at the current burn rate, with 18 months or more generally considered comfortable and under 12 a signal to act.

## How do these fit together?

No single metric tells the whole story. MRR growth shows momentum but hides composition. NRR shows whether existing customers alone are healthy. Quick ratio shows growth efficiency. Rule of 40 balances growth against profitability. Burn multiple and runway bring in the cash reality. Look at all of them together, and specifically watch for a gap between a strong topline MRR number and a weak NRR — that gap is exactly the "new sales covering for churn" pattern that a single growth number can't show you on its own.

A [free SaaS metrics calculator](https://anthonysko.com/projects/saas-metrics-calculator/) computes all of these — ending MRR, both churn measures, NRR/GRR (including annualized), quick ratio, Rule of 40, burn multiple and runway — from one set of inputs. For the acquisition side of the same picture, see [CAC payback period](/blog/cac-payback-period-explained/).
