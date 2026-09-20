---
title: "Sales forecast accuracy: measure it, stop sandbagging"
description: Learn how to measure sales forecast accuracy with WAPE and bias,
  why a perfect team total can hide rep-level errors, and how to spot
  sandbagging in your data.
pubDate: 2026-09-20T14:24:00.000+02:00
tags:
  - forecasting
  - revenue operations
  - sales pipeline
  - sql
draft: false
---
> **Short answer:** Measure forecast accuracy with two numbers, not one. Use WAPE (weighted absolute percentage error) to see how far off you are, and bias to see which direction you miss. Sandbagging, meaning under-forecasting and then over-delivering, only shows up in bias, and it is invisible if you look at team totals alone.

Most revenue teams can tell you their number for the quarter. Far fewer can tell you how good their forecast was last quarter, or whether it is always wrong in the same direction. This guide covers the metrics worth tracking, a worked example with invented numbers, and a SQL query you can adapt to your own CRM export.

## Why is forecast accuracy hard to measure?

Sales-forecasting guides tend to blame the same three problems. The Avoma guide to sales forecasting names governance gaps ("Commit" means something different to every rep), incentive problems (rewarding teams for beating low bars), and no tracking at all: if you are not measuring MAPE, WAPE or bias, there is no feedback loop.

That last one is the cheapest to fix. You need a forecast that was frozen at a known date, the actual result, and a few lines of SQL.

## Which metrics should you use?

| Metric   | Formula (per group of rows)                       | What it tells you                                                      | Main weakness                                            |
| -------- | ------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| **MAPE** | Average of |actual − forecast| ÷ actual           | Average percentage miss, each row weighted equally                     | Inflated by small actuals; undefined when actual is zero |
| **WAPE** | Sum of |actual − forecast| ÷ sum of actual        | Percentage miss weighted by size, so big deals and big reps count more | Ignores direction                                        |
| **Bias** | (Sum of forecast − sum of actual) ÷ sum of actual | Whether you over- or under-forecast, and by how much                   | Errors in opposite directions cancel out                 |



## A worked example: a perfect team total that hides the errors

Here are five reps in one quarter. The numbers are invented, in thousands of any currency.

| Rep      | Forecast | Actual closed-won | Error (forecast − actual) | Rep bias | Rep WAPE  |
| -------- | -------- | ----------------- | ------------------------- | -------- | --------- |
| A        | 100      | 90                | +10                       | +11.1%   | 11.1%     |
| B        | 60       | 80                | −20                       | −25.0%   | 25.0%     |
| C        | 200      | 150               | +50                       | +33.3%   | 33.3%     |
| D        | 40       | 60                | −20                       | −33.3%   | 33.3%     |
| E        | 100      | 120               | −20                       | −16.7%   | 16.7%     |
| **Team** | **500**  | **500**           | **0**                     | **0.0%** | **24.0%** |

The team forecast of 500 landed exactly on the actual of 500, so team bias is zero. A leader reading only the roll-up would call it a perfect quarter. But the team WAPE is 24%, because the reps' errors offset each other. Rep C over-called by a third, while reps B, D and E all under-called.

A single quarter proves nothing about intent, since deals slip and wins land early. The signal is persistence: a rep whose bias is negative quarter after quarter is either sandbagging or forecasting badly, and either way the number cannot be trusted as given.

## What is sandbagging, and how do you spot it?

Avoma describes sandbagging as under-forecasting and then over-delivering, and pairs it with "hero commits", which are overconfident predictions without evidence. They are opposite failures with the same fix: compare the call to the outcome, by person, over several periods.

Signs in the data:

* **Persistent negative bias** for the same rep or segment across three or more quarters.
* **Deals that jump into closed-won late** without having been in commit at the start of the period.
* **Best-case pipeline that closes far more often than its stage probability suggests.**

None of these prove sandbagging on their own. They tell you where to look and which questions to ask in the next forecast review.

## How do you measure it in SQL?

Assume one row per rep per quarter, with the forecast taken from a snapshot frozen at a fixed point in the period. The table name and columns below are placeholders for your own CRM export.

```sql
SELECT
  rep,
  SUM(forecast_amount)                          AS forecast,
  SUM(closed_won_amount)                        AS actual,
  SUM(ABS(forecast_amount - closed_won_amount))
    / NULLIF(SUM(closed_won_amount), 0)         AS wape,
  (SUM(forecast_amount) - SUM(closed_won_amount))
    / NULLIF(SUM(closed_won_amount), 0)         AS bias
FROM forecast_vs_actual
GROUP BY rep
ORDER BY bias;
```

Two practical notes. First, in some databases dividing two integer columns returns an integer, so cast one side to a decimal type. Second, run the same query with `GROUP BY quarter` for the team and with `GROUP BY rep, quarter` to see whether a rep's bias is stable or one-off.

## Five habits for a forecast you can trust

1. **Freeze the forecast.** Store a dated snapshot at a fixed point in each period, for example the first week of the quarter. Without a frozen snapshot you are grading a forecast that keeps changing. This is my recommendation rather than a published standard.
2. **Define your categories in writing.** Avoma's guide defines Commit as roughly 90% or higher probability, with a buyer-confirmed close date, a documented mutual action plan, an engaged economic buyer and a mapped procurement path, and Best Case as 60 to 89%. Use whatever definitions fit your business, but write them down.
3. **Report WAPE and bias together, at the rep and the team level.** One tells you how far off you are, the other tells you which way.
4. **Compare to a naive baseline.** A simple benchmark, such as last quarter's actual, tells you whether human judgment is adding anything. This is my suggestion; the RELEX guide does not cover it.
5. **Be careful about tying accuracy to pay.** Avoma recommends publishing accuracy and tying it to manager compensation. Visibility is a good idea; whether to link it to pay is a judgment call, because a heavy penalty for missing a high call can push people toward lower calls, which is exactly the sandbagging you want to remove.

## Frequently asked questions

**What is a good forecast accuracy?**
It depends on your sales cycle and deal sizes. The Avoma guide says mature teams should aim to call quarters within 5%, but it gives no industry benchmark. Start by tracking your own trend.

**Should I use MAPE or WAPE?**
For rep-level comparison on small numbers, MAPE can mislead. WAPE is generally the safer choice for team roll-ups because it weights by size.

**Why does bias matter if WAPE is low?**
WAPE hides direction. A team can have a moderate WAPE with a consistent negative bias, which means the number is reliably too low and can be corrected.

**Can I do this in Excel or Power BI instead of SQL?**
Yes. The formulas are the same. The important part is keeping a frozen snapshot of each forecast.

## Sources

* [Avoma: Sales forecasting, a guide to methods, accuracy and AI (2026)](https://www.avoma.com/blog/sales-forecasting)
* [Baeldung: Understanding forecast accuracy, MAPE, WAPE, WMAPE](https://www.baeldung.com/cs/mape-vs-wape-vs-wmape)
* [RELEX Solutions: Measuring forecast accuracy, the complete guide](https://www.relexsolutions.com/resources/measuring-forecast-accuracy/)

*Last reviewed: 20 September 2026.*
