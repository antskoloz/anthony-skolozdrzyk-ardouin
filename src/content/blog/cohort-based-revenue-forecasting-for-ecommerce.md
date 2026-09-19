---
title: "Cohort-Based Revenue Forecasting for E-commerce, Step by Step"
description: "Learn to forecast e-commerce revenue from customer cohorts. Includes SQL, a worked backtest, and the common mistake that cost 9% forecast accuracy."
pubDate: 2026-10-11
tags: ["revops", "forecasting", "cohort analysis", "e-commerce", "sql"]
draft: true
---

> **Short answer:** Group customers by the month they first bought, measure how many come back and how much they spend at each age, then project those curves forward. In my worked example on synthetic data, a forecast that ignored repeat orders from customers not yet acquired was off by up to 14.6%. Adding them cut the average error from 9.1% to 1.6%.

Most e-commerce revenue forecasts start from last month's total and add a growth rate. That hides the mechanics: some revenue comes from new customers, and some from customers you already have. Cohort-based forecasting separates the two, so you can see where a forecast is coming from and where it might break.

## What is a cohort?

A cohort is a group of customers who share a starting point, most often the month of their first order. Shopify's Customer Cohort Analysis report works this way: by default, customers are grouped into cohorts based on the date they placed their first order, and the report can show measures such as number of customers, customer retention rate, net sales and average order value across time periods after the first purchase.

*Source: [Shopify Help Center: Customers reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/customers-reports).*

## What data do I need?

One table with four fields is enough:

| Field | Meaning |
| --- | --- |
| `order_id` | Unique order identifier |
| `customer_id` | Stable customer identifier |
| `order_date` | Date of the order |
| `net_amount` | Order value after discounts and refunds |

## How do I build the cohort table in SQL?

This query assigns each customer to a cohort and counts how many of them ordered, and how much they spent, in each month after acquisition. The month arithmetic uses `EXTRACT`, which works in PostgreSQL, Snowflake and BigQuery, though `DATE_TRUNC` argument order differs slightly by warehouse. I validated the same logic, with SQLite date functions, on the synthetic dataset below.

```sql
WITH first_orders AS (
  SELECT customer_id, MIN(order_date) AS first_order_date
  FROM orders
  GROUP BY customer_id
),
activity AS (
  SELECT
    DATE_TRUNC('month', f.first_order_date) AS cohort_month,
    (EXTRACT(YEAR FROM o.order_date) - EXTRACT(YEAR FROM f.first_order_date)) * 12
      + EXTRACT(MONTH FROM o.order_date) - EXTRACT(MONTH FROM f.first_order_date) AS month_index,
    o.customer_id,
    o.net_amount
  FROM orders o
  JOIN first_orders f USING (customer_id)
)
SELECT
  cohort_month,
  month_index,
  COUNT(DISTINCT customer_id) AS active_customers,
  SUM(net_amount)             AS revenue
FROM activity
GROUP BY cohort_month, month_index
ORDER BY cohort_month, month_index;
```

Month index 0 is the acquisition month. Divide `active_customers` at each month index by the cohort's month-0 count to get the retention rate.

## What does the result look like?

To keep the example reproducible I generated a synthetic store: 18 monthly cohorts from January 2025 to June 2026, about 1,200 customers per cohort (range 1,050 to 1,408), roughly 21,800 customers and 38,000 orders in total. It is not real merchant data, so use it to learn the method, not to benchmark your own retention.

Share of each cohort ordering again, in months after the first order (first six cohorts shown):

| Cohort | M0 | M1 | M2 | M3 | M4 | M5 | M6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Jan 2025 | 100% | 17.3% | 13.0% | 10.3% | 8.1% | 7.0% | 6.5% |
| Feb 2025 | 100% | 15.5% | 11.6% | 9.5% | 8.8% | 7.0% | 5.8% |
| Mar 2025 | 100% | 19.6% | 14.6% | 10.6% | 8.2% | 7.7% | 6.9% |
| Apr 2025 | 100% | 17.6% | 11.4% | 11.3% | 8.5% | 7.2% | 7.1% |
| May 2025 | 100% | 15.4% | 12.9% | 9.2% | 8.7% | 7.5% | 6.2% |
| Jun 2025 | 100% | 16.8% | 13.7% | 10.1% | 9.8% | 7.6% | 6.2% |

The curves share a shape: a sharp drop after the first month and a slower tail. That stable shape is what makes forecasting possible.

## How do I turn the curves into a forecast?

1. **Average the curves.** Using data through March 2026, I averaged retention across cohorts by month index, weighted by cohort size. Months 1 to 6 came out at 17.4%, 13.5%, 10.8%, 8.8%, 7.9% and 6.7%.
2. **Average revenue per returning customer.** In the synthetic data this stayed near $64 to $65 per active customer in each repeat month.
3. **Project each existing cohort.** For a forecast month, take each cohort's size, its age in that month, and multiply by average retention and revenue per returning customer at that age.
4. **Add new customers.** Assume a number of new customers, for example the average of the last six cohorts, and multiply by first-order value.
5. **Add repeat orders from customers you have not acquired yet.** Customers acquired during the forecast window will also reorder inside that window.

Step 5 is the one most spreadsheets miss.

## How accurate was it? A backtest

I trained on data through March 2026 and forecast April to June 2026, then compared to what the synthetic store actually recorded.

| Month | Version 1: existing + new first orders | Version 2: adds repeats from future cohorts | Actual | Error v1 | Error v2 |
| --- | --- | --- | --- | --- | --- |
| Apr 2026 | $155,571 | $155,571 | $156,011 | -0.3% | -0.3% |
| May 2026 | $145,518 | $159,083 | $166,270 | -12.5% | -4.3% |
| Jun 2026 | $138,195 | $162,388 | $161,853 | -14.6% | +0.3% |
| **Mean absolute error** | | | | **9.1%** | **1.6%** |

Version 1 fell further behind each month because it treated April's and May's new customers as one-time buyers. Version 2 included their repeat orders in the following months. The lesson: a forecast that only counts current customers will drift low as the horizon grows.

**Important caveat:** the synthetic data was generated with stable retention, so it flatters the method. Real stores add seasonality, promotions, price changes, and shifts in acquisition quality. Expect larger errors, and test on your own history.

## What are the limits of this approach?

- **Cohort quality changes.** A paid-social push can bring lower-retention customers than organic search. Segment cohorts by channel when you can.
- **Seasonality.** Holiday cohorts behave differently. Compare cohorts from the same season.
- **Small cohorts are noisy.** Use ranges rather than a single number.
- **Payment failures hide inside retention.** A customer whose stored card is declined may look like churn. Reviewing declines, as in [Why False Declines Cost E-commerce More Than You Think](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/why-false-declines-cost-ecommerce-more-than-you-think/), helps separate the two. This is my interpretation, not a measured result from the example above.

## Is there a more advanced option?

Yes. Peter Fader, Bruce Hardie and Ka Lok Lee's 2005 paper in *Marketing Science* introduced the beta-geometric/NBD (BG/NBD) model for predicting customers' future purchasing. The authors note its parameters can be obtained quite easily in Microsoft Excel and that it performs comparably to the more complex Pareto/NBD model. It works at the level of individual customers, so it is a natural next step once the cohort approach feels limiting.

*Source: Fader, Hardie and Lee, ["Counting Your Customers the Easy Way: An Alternative to the Pareto/NBD Model," Marketing Science, 2005](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=578087).*

## Frequently asked questions

**How much history do I need?**
Enough for each cohort age you want to forecast. In my example, 15 months of data supported forecasts up to 14 months of customer age. More cohorts make averages steadier.

**Should I forecast customers or revenue?**
Both. Forecast active customers by age, then multiply by revenue per active customer. Separating them shows whether a miss came from fewer customers or smaller orders.

**Can I do this in a spreadsheet?**
Yes. Export the SQL result, build a retention table, and use lookup formulas to apply the curves. Start with monthly cohorts.

**How do I measure forecast accuracy?**
Compare forecast and actual for months the model has not seen, and report the mean absolute percentage error, as in the backtest above.

## Sources

- [Shopify Help Center: Customers reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/customers-reports)
- [Fader, Hardie and Lee (2005), "Counting Your Customers the Easy Way"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=578087)

*Last reviewed: 19 September 2026. The dataset in this post is synthetic and was generated for illustration.*
