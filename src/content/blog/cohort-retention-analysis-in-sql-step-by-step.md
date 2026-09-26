---
title: "Cohort Retention Analysis in SQL, Step by Step"
description: Build a cohort retention table in SQL in three steps. Includes a full PostgreSQL query, how to read the triangle, and the mistakes that skew retention.
pubDate: 2026-09-26T09:30:00.000+02:00
tags:
  - sql
  - cohort analysis
  - retention
  - data analytics
draft: true
---

> **Short answer:** Assign every user to the month they first showed up, measure how many months later each activity happened, then count distinct users per cohort and month and divide by the cohort's starting size. The result is the familiar retention triangle.

"Are we keeping our customers?" sounds like one question. It is really many, because customers who joined in January behave differently from those who joined in June. A single retention percentage blends them all together and hides the story.

<!-- ANTHONY: add a real story here (a case where an overall average hid what cohorts showed) -->

Cohort analysis fixes that. The pattern is short once you see it. The [dev.to walkthrough](https://dev.to/michaelnocito/cohort-retention-analysis-in-sql-step-by-step-3e03) and [Holistics](https://www.holistics.io/blog/calculate-cohort-retention-analysis-with-sql/) describe it the same way, and it is the same three steps I use.

## What is a retention cohort?

A cohort is a group of users who share a starting point, usually the month of their first order or signup. Retention asks what share of that group is still active N periods later.

The rule that makes it fair: compare cohorts at the **same age**, not on the same calendar date. January's cohort in month 3 is comparable with March's cohort in month 3. Putting them side by side on a May dashboard is not.

## What data do I need?

One table of activity events with a user and a date. I'll call it `orders`, with `customer_id` and `order_date`. The names and numbers here are illustrative.

## How do I build it in SQL?

The query below is PostgreSQL syntax. It works in DuckDB too.

**Step 1: give each customer a cohort month.**

```sql
WITH first_order AS (
  SELECT customer_id,
         DATE_TRUNC('month', MIN(order_date)) AS cohort_month
  FROM orders
  GROUP BY customer_id
),
```

**Step 2: compute how many months after the cohort each activity happened.**

```sql
activity AS (
  SELECT DISTINCT
         o.customer_id,
         f.cohort_month,
         (DATE_PART('year', DATE_TRUNC('month', o.order_date)) - DATE_PART('year', f.cohort_month)) * 12
       + (DATE_PART('month', DATE_TRUNC('month', o.order_date)) - DATE_PART('month', f.cohort_month))
           AS months_since
  FROM orders o
  JOIN first_order f USING (customer_id)
),
```

`DISTINCT` matters. A customer with three orders in the same month should count once.

**Step 3: count users per cohort and age, then turn the counts into percentages.**

```sql
cohort_counts AS (
  SELECT cohort_month, months_since, COUNT(DISTINCT customer_id) AS active_customers
  FROM activity
  GROUP BY cohort_month, months_since
)
SELECT
  cohort_month,
  months_since,
  active_customers,
  ROUND(
    100.0 * active_customers
    / FIRST_VALUE(active_customers) OVER (PARTITION BY cohort_month ORDER BY months_since),
    1
  ) AS retention_pct
FROM cohort_counts
ORDER BY cohort_month, months_since;
```

`FIRST_VALUE` grabs the month-0 size for each cohort, so every row is divided by the number of customers who started. This window-function trick is covered in more detail in [SQL window functions](/blog/sql-window-functions/).

## How do I read the result?

Pivot it in your BI tool, or in SQL with `CASE WHEN`, and you get a triangle. One row per cohort, one column per month since joining:

| Cohort | Month 0 | Month 1 | Month 2 | Month 3 |
| --- | --- | --- | --- | --- |
| Jan | 100% | 42% | 33% | 29% |
| Feb | 100% | 45% | 35% | |
| Mar | 100% | 39% | | |

*Illustrative numbers, not real data.*

Look at it in two directions:

- **Down a column:** are newer cohorts retaining better or worse at the same age? That tells you whether the product, pricing or acquisition mix is improving.
- **Across a row:** where does the curve flatten? A curve that flattens above zero means you have a loyal core. One that keeps falling means people never find a reason to stay.

## What mistakes skew retention?

- **Counting orders instead of customers.** Use `COUNT(DISTINCT customer_id)`.
- **Mixing time zones.** A midnight order can land in the wrong month if timestamps are in UTC. I cover this in [SQL dates, fiscal calendars and time zones](/blog/sql-date-functions-fiscal-calendars-week-starts-time-zones/).
- **Including the incomplete current month.** It always looks like a drop because the month isn't over. Cut it off.
- **Defining "active" too loosely.** A login and a purchase are different things. Pick one and say so.
- **Tiny cohorts.** A cohort of 12 customers swings wildly. Show the count next to the percentage.

## What can I do with it?

Retention curves feed straight into forecasting. If you know how each cohort decays, you can project revenue from customers you already have, which is the idea behind [cohort-based revenue forecasting for e-commerce](/blog/cohort-based-revenue-forecasting-for-ecommerce/).

My view: build the cohort table before you build any fancier churn model. It is a few dozen lines of SQL, and it usually shows you the problem faster than a model will.

*Sources: [DEV Community: Cohort Retention Analysis in SQL, Step by Step](https://dev.to/michaelnocito/cohort-retention-analysis-in-sql-step-by-step-3e03), [Holistics: Calculate Cohort Retention Analysis with SQL](https://www.holistics.io/blog/calculate-cohort-retention-analysis-with-sql/). All tables and numbers are illustrative.*
