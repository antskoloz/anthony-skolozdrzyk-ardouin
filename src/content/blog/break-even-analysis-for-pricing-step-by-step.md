---
title: "Break-Even Analysis for Pricing, Step by Step"
description: Calculate break-even units, margin of safety, and the extra
  volume a discount actually requires to stay profit-neutral, with worked
  examples.
pubDate: 2026-09-26T16:30:00.000+02:00
tags:
  - pricing
  - break-even analysis
  - finance
  - data analytics
draft: false
---
> **Short answer:** Break-even units = fixed costs ÷ contribution per unit, where contribution is the selling price minus the variable cost of making one more unit. Below that number of units you lose money for the period; above it, every additional unit is pure profit before those fixed costs return next period. A discount changes this math in a way that's easy to underestimate — a 10% price cut at a 40% margin needs about 33% more volume just to break even on profit, not revenue.

Break-even analysis answers a specific, useful question: at this price and this cost structure, how many units do you need to sell before you stop losing money?

## What is contribution, and why does it matter more than the price itself?

Contribution per unit is what's left from each sale after covering the cost that scales with volume (materials, per-unit fulfillment, payment processing) — but before fixed costs like rent, salaries, or software licenses that don't change with sales volume.

```
Contribution per unit = Price − Variable cost per unit
Contribution margin = Contribution ÷ Price
```

Fixed costs get paid out of contribution, unit by unit, until they're covered. After that point, contribution per unit is pure profit for the period.

## How do I calculate break-even units?

```
Break-even units = ceil(Fixed costs ÷ Contribution per unit)
Break-even sales value = Break-even units × Price
```

**Worked example:** fixed costs $10,000/month, price $50, variable cost $30. Contribution = 50 − 30 = $20. Break-even units = 10,000 / 20 = **500 units**, or $25,000 in sales, before this month turns a profit.

## How do I find the units needed for a target profit, not just break-even?

```
Units for target profit = ceil((Fixed costs + Target profit) ÷ Contribution per unit)
```

Same example, targeting $4,000 profit: (10,000 + 4,000) / 20 = **700 units**.

## What is margin of safety, and what does it tell me?

```
Margin of safety = (Units sold − Break-even units) ÷ Units sold
```

It's how far current or expected sales sit above the break-even point, as a percentage — effectively how much sales could drop before you're back to losing money. As a rough guide: 30% or higher is generally comfortable, 10-30% warrants attention, and below 10% means a small dip in sales could put you back at a loss. These are rules of thumb, not fixed thresholds — what counts as "safe" depends on how predictable your sales actually are.

**Worked example continued:** selling 650 units against a break-even of 500 gives a margin of safety of (650−500)/650 ≈ **23%** — in the "worth watching" range rather than clearly safe.

## What happens if contribution is zero or negative?

If variable cost is equal to or above price, you lose money on every single unit sold, and no volume gets you to break-even — more sales just mean bigger losses. The only fixes are raising price, cutting the per-unit cost, or accepting the product isn't viable at this price point.

## How much does a discount actually cost, in extra volume?

This is the part that surprises people, because a percentage discount doesn't cost a proportional amount of profit — it costs disproportionately more as your margin gets thinner.

```
Margin = (Price − Cost) ÷ Price
Extra volume needed to keep the same total profit = Discount % ÷ (Margin − Discount %)
```

**Worked example:** price $100, cost $60, so margin = 40%. Offer a 10% discount (new price $90). Extra volume needed = 10% / (40% − 10%) = 10/30 ≈ **33.3% more units sold**, just to end up with the same total profit as before the discount — not more profit, the same amount.

Push the discount to 20%: extra volume needed = 20 / (40 − 20) = **100% more units** — you'd need to literally double your sales volume for a 20% discount to be profit-neutral at this margin.

If the discount percentage equals or exceeds your margin percentage, the discounted price falls at or below your cost, and no volume at all can make up for it — you lose money on every unit sold at that price, regardless of quantity.

## What should I actually do with this?

1. Calculate your real contribution margin before setting or changing a price — not gross margin on paper, the actual price-minus-variable-cost number.
2. Know your break-even units at the current price, and your margin of safety at current sales.
3. Before running a discount or promotion, calculate the extra volume it actually requires to be profit-neutral, and ask honestly whether the promotion is likely to drive that much extra volume — or whether it's mostly the same customers paying less.
4. Treat a margin of safety under 10-15% as a signal to either grow sales or revisit fixed costs, not just watch it happen.

A [free break-even and pricing calculator](https://anthonysko.com/projects/break-even-pricing-calculator/) covers all three of these — margin/markup conversion, break-even and target-profit units, and the discount-volume trade-off — in one tool. For the acquisition-cost side of pricing decisions, see [CAC payback period](/blog/cac-payback-period-explained/).
