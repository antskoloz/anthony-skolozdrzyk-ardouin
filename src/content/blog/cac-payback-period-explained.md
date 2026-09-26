---
title: "CAC Payback Period: How to Calculate It, What's a Good Number"
description: How to calculate CAC payback period from gross margin, why it
  differs from LTV:CAC, and what counts as healthy at different SaaS stages.
pubDate: 2026-09-26T17:30:00.000+02:00
tags:
  - saas
  - cac
  - metrics
  - marketing analytics
draft: false
---
> **Short answer:** CAC payback period is how many months of gross margin from a new customer it takes to recover what you spent acquiring them. `CAC payback (months) = CAC ÷ (Average order value × Orders per year ÷ 12 × Gross margin)`. Under 12 months is commonly treated as healthy for SaaS, but the right target depends on your growth stage and how much cash you have to fund the gap.

LTV:CAC tells you whether a customer is worth more than they cost, over their whole lifetime. CAC payback answers a different, more immediate question: how long until that spend stops being a cash outflow and starts being recovered.

## What's the formula, and why gross margin instead of revenue?

```
Monthly gross margin per customer = Average order value × Orders per year ÷ 12 × Gross margin %
CAC payback (months) = CAC ÷ Monthly gross margin per customer
```

Gross margin, not revenue, is what actually funds the next round of customer acquisition and covers fixed costs — using raw revenue would overstate how quickly you're actually recovering cash, because it ignores the cost of serving that customer.

## Worked example

A customer costs $600 to acquire (CAC). They generate $100/month in revenue at a 70% gross margin.

```
Monthly gross margin per customer = $100 × 0.70 = $70
CAC payback = $600 ÷ $70 ≈ 8.6 months
```

It takes about 8-9 months of that customer's margin to recover the acquisition spend. Every month after that is when the customer relationship starts contributing net cash, before accounting for ongoing service costs or churn risk.

## How does this relate to LTV:CAC?

They answer different questions and can point in different directions. LTV:CAC asks "is this customer worth acquiring at all, over their whole relationship with us?" CAC payback asks "how long is the cash tied up before I see it back?" A business can have an excellent LTV:CAC (say, 5:1) built on customers who stay for years, while still having a long, cash-straining payback period if most of that value arrives slowly. Conversely, a shorter payback period with a weaker LTV:CAC ratio might mean you're recovering cash fast but not generating much total value per customer once churn is factored in.

Both numbers matter, for different reasons: LTV:CAC is about whether the unit economics work in principle; payback is about whether you have the cash to fund growth while waiting for them to play out.

## What counts as a good payback period?

As a widely quoted rule of thumb, under 12 months is generally considered healthy for a SaaS business, with under 6 months considered excellent and over 18-24 months a signal that acquisition spend is straining cash flow more than the growth rate may justify. These are general benchmarks, not fixed rules — a well-funded company with strong retention can sustain a longer payback than one growing without much cash cushion, because the risk being managed here is a cash-timing risk, not a profitability one.

## What actually shortens a long payback period?

- **Raise average order value or expansion revenue**, so each customer contributes more margin per month without changing acquisition cost.
- **Reduce CAC** by focusing spend on channels with a demonstrated lower cost per acquired customer — see [why platform-reported conversions overstate impact](/blog/why-platform-reported-conversions-overstate-impact/) before trusting a channel's reported CAC at face value, since attribution can make some channels look cheaper than they really are.
- **Improve gross margin**, for instance by reducing the cost of serving a customer (support, infrastructure, onboarding), which increases the monthly margin the payback formula is dividing into.
- **Shorten time to value**, so customers are more likely to stay long enough for the payback period to actually play out rather than churning before recovering the acquisition cost — a fast payback calculation is only useful if the customer actually sticks around that long.

## What should I actually track?

1. Calculate CAC payback per channel, not just as a blended company-wide number — a channel with a long payback can be hidden by a shorter one elsewhere, and you'd want to know which is which before allocating more budget.
2. Watch it alongside NRR and gross churn (see [SaaS metrics that matter](/blog/saas-metrics-that-matter-mrr-churn-ltv-nrr/)) — a fast payback on customers who churn before it completes isn't actually a fast payback in practice.
3. Treat the 12-month benchmark as a starting reference, not a target to hit blindly — a well-capitalized, fast-growing company can rationally tolerate a longer payback than the rule of thumb suggests, as long as the cash to fund it is genuinely there.

A [free marketing ROI calculator](https://anthonysko.com/projects/marketing-roi-calculator/) computes CAC, LTV, LTV:CAC and CAC payback together from the same inputs, so you can see all three side by side rather than calculating them separately.
