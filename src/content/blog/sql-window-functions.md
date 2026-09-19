---
title: "SQL window functions: 10 patterns for real analysis"
description: "Window functions keep your rows while you calculate across them.
  Learn ten patterns: ranking, deduplication, running totals, LAG, cohorts and
  streaks."
pubDate: 2026-09-19
tags:
  - sql
  - window functions
  - data analysis
  - payments analytics
draft: false
---

> **Short answer:** Window functions calculate across rows related to the current row *without collapsing them* the way `GROUP BY` does. A handful of patterns (ranking, deduplication, running totals, `LAG`, percent of total, bucketing and gaps-and-islands) cover most everyday analytical work in a single readable query.

If you only learn one "advanced" SQL feature, make it window functions. After years of writing SQL for marketing, sales and payments teams, I find that a small set of window patterns comes up again and again. This guide walks through ten of them, plus a payments example, with code you can adapt.

## How does window function syntax work?

```sql
function_name(expression) OVER (
  PARTITION BY column_a      -- restart the calculation for each group
  ORDER BY column_b          -- define the row order inside the group
  ROWS BETWEEN ... AND ...   -- optional: define the frame
)
```

- **`PARTITION BY`** splits rows into groups (like `GROUP BY`, but the rows are kept).
- **`ORDER BY`** sets the order inside each partition.
- **The frame clause** (`ROWS BETWEEN`) limits which rows the function sees, for example "the last 7 rows".

The examples use PostgreSQL syntax. Most work unchanged, or with small tweaks, in BigQuery, Snowflake, SQL Server and MySQL 8+. Where a feature is not portable, I say so.

*Source: [PostgreSQL documentation: Window Functions tutorial](https://www.postgresql.org/docs/current/tutorial-window.html).*

## 1. How do I rank rows and get the top N per group?

**Use cases:** top N per group, best product per category, latest record per customer.

```sql
SELECT *
FROM (
  SELECT
    customer_id,
    order_id,
    order_date,
    amount,
    ROW_NUMBER() OVER (
      PARTITION BY customer_id
      ORDER BY order_date DESC
    ) AS rn
  FROM orders
) t
WHERE rn = 1;   -- most recent order per customer
```

The three ranking functions differ when there are ties:

| Function | Ties | Example output |
| --- | --- | --- |
| `ROW_NUMBER()` | Always unique | 1, 2, 3, 4 |
| `RANK()` | Same rank, gaps after | 1, 2, 2, 4 |
| `DENSE_RANK()` | Same rank, no gaps | 1, 2, 2, 3 |

> **Tip:** Snowflake, BigQuery and Databricks support `QUALIFY`, so you can skip the subquery: `QUALIFY ROW_NUMBER() OVER (...) = 1`.

*Source: [Snowflake documentation: QUALIFY](https://docs.snowflake.com/en/sql-reference/constructs/qualify).*

## 2. How do I remove duplicates?

**Use cases:** duplicate webhook events, repeated payment attempts, double-loaded ETL rows.

```sql
WITH ranked AS (
  SELECT
    *,
    ROW_NUMBER() OVER (
      PARTITION BY transaction_id
      ORDER BY received_at DESC
    ) AS rn
  FROM payment_events
)
SELECT * FROM ranked WHERE rn = 1;
```

This keeps the latest version of each transaction. It is the cleanest deduplication pattern I know, and it lets you choose which duplicate survives through the `ORDER BY`.

## 3. How do I calculate running totals?

**Use cases:** cumulative revenue, month-to-date sales, budget burn-down.

```sql
SELECT
  order_date,
  daily_revenue,
  SUM(daily_revenue) OVER (
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_revenue
FROM daily_sales;
```

Add `PARTITION BY DATE_TRUNC('month', order_date)` to reset the total each month and get month-to-date revenue.

## 4. How do I smooth a noisy metric with a moving average?

**Use cases:** smoothing daily metrics, trend detection, forecasting baselines.

```sql
SELECT
  order_date,
  daily_revenue,
  AVG(daily_revenue) OVER (
    ORDER BY order_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS revenue_7d_avg
FROM daily_sales;
```

A 7-day average removes the weekday and weekend pattern that makes daily charts hard to read. This frame counts *rows*, so it assumes one row per day. If days can be missing, fill the gaps first.

## 5. How do I compare to the previous period with LAG and LEAD?

**Use cases:** month-over-month growth, time between purchases, churn signals.

```sql
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month,
  ROUND(
    100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
    / NULLIF(LAG(revenue) OVER (ORDER BY month), 0),
    2
  ) AS mom_growth_pct
FROM monthly_revenue;
```

`LAG` looks backward and `LEAD` looks forward. Both accept an offset and a default value: `LAG(revenue, 12, 0)` returns the same month last year, or `0` when there is no such row.

To measure the time between orders per customer:

```sql
SELECT
  customer_id,
  order_date,
  order_date - LAG(order_date) OVER (
    PARTITION BY customer_id ORDER BY order_date
  ) AS days_since_last_order
FROM orders;
```

## 6. How do I calculate percent of total?

**Use cases:** revenue share by channel, payment method mix, market share.

```sql
SELECT
  payment_method,
  SUM(amount) AS revenue,
  ROUND(100.0 * SUM(amount) / SUM(SUM(amount)) OVER (), 2) AS pct_of_total
FROM transactions
GROUP BY payment_method
ORDER BY revenue DESC;
```

Note `SUM(SUM(amount)) OVER ()`. Window functions run after `GROUP BY`, so you can wrap an aggregate inside a window function to get the grand total on every row.

## 7. How do I split customers into segments with NTILE?

**Use cases:** customer segmentation, RFM scoring, decile analysis.

```sql
SELECT
  customer_id,
  lifetime_value,
  NTILE(10) OVER (ORDER BY lifetime_value DESC) AS decile
FROM customer_ltv;
```

Decile 1 holds your top 10% of customers by lifetime value. From there you can check how much of your revenue the top decile drives.

## 8. How do I get the first or last value in a group?

**Use cases:** first-touch attribution, cohort assignment, comparing every row to a baseline.

```sql
SELECT
  customer_id,
  order_date,
  amount,
  FIRST_VALUE(acquisition_channel) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
  ) AS first_touch_channel
FROM orders;
```

> **Gotcha:** with an `ORDER BY`, the default frame ends at the *current row*, so `LAST_VALUE` often just returns the current row's value. Specify `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` when you want the true last value.

*Source: [PostgreSQL documentation: Window Function Processing](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS).*

## 9. How do I build a cohort retention table?

**Use cases:** SaaS and e-commerce retention, repeat purchase rate.

```sql
WITH first_orders AS (
  SELECT
    customer_id,
    DATE_TRUNC('month', order_date) AS order_month,
    MIN(DATE_TRUNC('month', order_date)) OVER (
      PARTITION BY customer_id
    ) AS cohort_month
  FROM orders
)
SELECT
  cohort_month,
  (DATE_PART('year', order_month) - DATE_PART('year', cohort_month)) * 12
    + DATE_PART('month', order_month) - DATE_PART('month', cohort_month)
    AS months_since_first_order,
  COUNT(DISTINCT customer_id) AS active_customers
FROM first_orders
GROUP BY 1, 2
ORDER BY 1, 2;
```

`MIN() OVER (PARTITION BY customer_id)` assigns each customer to a cohort without a separate self-join.

## 10. How do I find streaks and sessions (gaps and islands)?

**Use cases:** user sessions, consecutive login streaks, uninterrupted subscription periods, outage windows.

The classic trick: subtract a row number from the date. Rows in the same consecutive streak end up with the same result.

```sql
WITH days AS (
  SELECT DISTINCT
    user_id,
    activity_date::date AS d
  FROM user_activity
),
grouped AS (
  SELECT
    user_id,
    d,
    d - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d))::int AS grp
  FROM days
)
SELECT
  user_id,
  MIN(d) AS streak_start,
  MAX(d) AS streak_end,
  COUNT(*) AS streak_length
FROM grouped
GROUP BY user_id, grp
ORDER BY user_id, streak_start;
```

The `date - integer` arithmetic is PostgreSQL syntax. Other databases need a date function such as `DATEADD` or `DATE_SUB`.

For sessions based on inactivity, use `LAG` to flag gaps longer than 30 minutes, then take a running `SUM` of those flags to build a session ID.

## How can I use window functions for payment decline analysis?

If you work in e-commerce payments, window functions are well suited to decline analysis. This query calculates the **7-day rolling decline rate per payment provider**:

```sql
WITH daily AS (
  SELECT
    provider,
    DATE(created_at) AS day,
    COUNT(*) AS attempts,
    COUNT(*) FILTER (WHERE status = 'declined') AS declines
  FROM payment_attempts
  GROUP BY 1, 2
)
SELECT
  provider,
  day,
  ROUND(
    100.0 * SUM(declines) OVER w / NULLIF(SUM(attempts) OVER w, 0),
    2
  ) AS decline_rate_7d
FROM daily
WINDOW w AS (
  PARTITION BY provider
  ORDER BY day
  ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
)
ORDER BY provider, day;
```

Two details are worth noting. First, the **named window** (`WINDOW w AS ...`) avoids repeating the same `OVER (...)` clause and keeps the query readable. Second, `FILTER (WHERE ...)` is PostgreSQL syntax; elsewhere, use `SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END)`. Also make sure each provider has a row for every day, or the 7-row frame will span more than 7 days.

## What are the performance tips for window functions?

1. **Filter early.** Window functions run after `WHERE` and `GROUP BY`, so reduce your row count first, for example with a CTE.
2. **Reuse windows.** Queries that share the same `PARTITION BY` and `ORDER BY` can often share one sort in the query plan. Named windows keep those definitions consistent.
3. **Be explicit about the frame.** When you add an `ORDER BY`, the default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which treats tied rows differently from `ROWS`. Write the frame out.
4. **Consider indexes on partition and order columns** for large tables in a transactional database. Check the query plan to confirm it helps.
5. **You cannot filter on a window result in `WHERE`.** Wrap the query in a CTE or subquery, or use `QUALIFY` where supported.

## Cheat sheet

| Goal | Function |
| --- | --- |
| Top N per group | `ROW_NUMBER`, `RANK`, `DENSE_RANK` |
| Remove duplicates | `ROW_NUMBER() ... WHERE rn = 1` |
| Running total | `SUM() OVER (ORDER BY ...)` |
| Moving average | `AVG() OVER (ROWS BETWEEN n PRECEDING ...)` |
| Compare to previous row | `LAG`, `LEAD` |
| Share of total | `SUM(x) / SUM(SUM(x)) OVER ()` |
| Segments and deciles | `NTILE` |
| First or last in group | `FIRST_VALUE`, `LAST_VALUE` |
| Streaks and sessions | `ROW_NUMBER` difference trick |

## Frequently asked questions

**What is the difference between `GROUP BY` and a window function?**
`GROUP BY` collapses rows into one row per group. A window function calculates across a group of rows but keeps every row in the result.

**Can I use a window function in a `WHERE` clause?**
No. Window functions are evaluated after `WHERE`. Put the calculation in a CTE or subquery and filter in the outer query, or use `QUALIFY` in databases that support it.

**What is the difference between `ROWS` and `RANGE` frames?**
`ROWS` counts physical rows. `RANGE` groups rows with equal `ORDER BY` values (peers) together, so ties are treated as one unit. Use `ROWS` when you want predictable results.

**Do window functions work in MySQL?**
Yes, from MySQL 8.0. Older versions do not support them.

## Sources

- [PostgreSQL documentation: Window Functions tutorial](https://www.postgresql.org/docs/current/tutorial-window.html)
- [PostgreSQL documentation: Window Function Processing](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS)
- [PostgreSQL documentation: Window Functions reference](https://www.postgresql.org/docs/current/functions-window.html)
- [Snowflake documentation: QUALIFY](https://docs.snowflake.com/en/sql-reference/constructs/qualify)
- [MySQL 8.0 Reference Manual: Window Functions](https://dev.mysql.com/doc/refman/8.0/en/window-functions.html)

*Last reviewed: 19 September 2026.*
