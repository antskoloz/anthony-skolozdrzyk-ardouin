---
title: "How to Value an Early-Stage SaaS Company: Methods Compared"
description: Revenue multiples vs discounted cash flow for early-stage SaaS
  valuation. What each method assumes, when each breaks down, and how they
  relate.
pubDate: 2026-09-26T17:00:00.000+02:00
tags:
  - saas
  - valuation
  - finance
  - data analytics
draft: false
---
> **Short answer:** Early-stage SaaS companies are usually valued with revenue multiples (ARR × a multiple drawn from comparable deals) because a discounted cash flow (DCF) model needs cash flow projections that are unreliable this early. Understanding DCF mechanics still matters, though, because a revenue multiple is really a shortcut for what a full DCF would otherwise calculate explicitly.

Ask an investor how they value an early-stage SaaS company and you'll almost always hear "a multiple of ARR." Ask them what that multiple is actually standing in for, and the answer traces back to discounted cash flow.

## What is the revenue multiple method, and why does it dominate early-stage valuation?

```
Valuation ≈ ARR × Multiple
```

The multiple itself comes from comparable transactions or public company valuations for similar businesses, adjusted for growth rate, net revenue retention, gross margin, and market conditions. A faster-growing company with strong NRR (see [SaaS metrics that matter](/blog/saas-metrics-that-matter-mrr-churn-ltv-nrr/)) commands a higher multiple than a slower-growing one with weak retention, even at the same ARR.

It dominates early-stage valuation for a practical reason: a DCF needs multi-year free cash flow projections, and an early-stage company's actual future cash flows are highly uncertain — a small change in an assumed growth rate compounds into a wildly different valuation years out. A multiple sidesteps that by anchoring to what the market is actually paying for similar businesses right now, rather than projecting the company's own cash flows years into the future.

## What is the DCF method, mechanically?

A discounted cash flow values a company as the present value of all its future free cash flow. The building blocks:

**Cost of capital (WACC)**, via CAPM for the equity portion:
```
Cost of equity = Risk-free rate + Beta × Equity risk premium
WACC = Equity weight × Cost of equity + Debt weight × Cost of debt × (1 − Tax rate)
```

**Free cash flow to the firm (FCFF)**:
```
FCFF = EBIT × (1 − Tax rate) + Depreciation & amortization − CapEx − Increase in net working capital
```

**Projected cash flow and terminal value**:
```
Projected FCF at year t = Base-year FCF × (1 + growth rate)^t
Terminal value = Final-year FCF × (1 + terminal growth) ÷ (WACC − terminal growth)
```

**Enterprise and equity value**:
```
Enterprise value = Sum of present values of projected FCF + Present value of terminal value
Equity value = Enterprise value − Total debt + Cash
Value per share = Equity value ÷ Shares outstanding
```

The terminal value formula requires the terminal growth rate to be lower than WACC — otherwise the perpetuity math is undefined, which is a real constraint, not just a technicality, when modeling a company still growing fast.

## When is a DCF more reliable than a multiple?

Once a company has stable, positive, reasonably predictable free cash flow — typically well past the early stage — a DCF's projections carry less uncertainty, and it can reveal whether the market's multiple-based price is actually justified by the underlying cash generation. For an early-stage company still burning cash with an uncertain growth trajectory, a DCF's output is extremely sensitive to assumptions that are little better than guesses, which is exactly why the market defaults to multiples instead at that stage.

## How do the two methods relate to each other?

A revenue multiple is, implicitly, a compressed DCF: the market is pricing in an expectation of the company's future growth, margins, and eventual cash flow, and expressing all of that as a single number you multiply by current revenue. When a multiple looks unusually high or low compared to peers, working through what growth rate and margin trajectory would justify that multiple in a DCF is a useful reality check — it turns "the market says 10x ARR" into "10x ARR implies roughly this growth and margin path," which is either plausible for the company or it isn't.

## How do I sanity-check a valuation using both?

1. Get the revenue multiple from comparable companies or recent transactions at a similar stage and growth profile.
2. Apply it to get a first valuation estimate.
3. Build a simplified DCF using the company's actual (or reasonably projected) growth rate, margins and cost of capital.
4. Compare the two. A DCF that implies a much lower value than the multiple suggests the multiple is pricing in growth or margin improvement that isn't yet visible in the numbers — which may be justified by the company's trajectory, or may be optimism.

## What are the common mistakes?

1. **Treating a DCF as precise because it produces a specific number.** A DCF's output is only as reliable as its growth and discount-rate assumptions, and small changes to either move the result substantially — especially the terminal value, which is often the majority of an early-stage DCF's total value.
2. **Using a multiple from a different growth or margin profile.** A multiple from a company growing 100% a year doesn't transfer cleanly to one growing 20%, even in the same sector.
3. **Ignoring NRR when comparing multiples.** Two companies at the same ARR and growth rate can deserve very different multiples if one is retaining and expanding existing customers and the other is replacing churned ones with new sales — see [SaaS metrics that matter](/blog/saas-metrics-that-matter-mrr-churn-ltv-nrr/) for why that distinction matters.

This is educational, not investment guidance: real valuations involve qualitative factors, negotiation dynamics and market conditions no formula fully captures. A [free company valuation calculator](https://anthonysko.com/projects/company-valuation-calculator/) walks through the WACC, FCF, DCF and EPS mechanics above with a worked example, built for learning how the pieces fit together rather than for pricing a real deal.
