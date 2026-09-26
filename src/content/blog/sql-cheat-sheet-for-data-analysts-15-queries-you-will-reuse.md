---
title: "SQL Cheat Sheet for Data Analysts: 15 Queries You'll Reuse"
description: A practical SQL cheat sheet for data analysts. Fifteen copy-paste queries for filtering, joins, aggregates, CTEs, windows and dates, with plain-English notes.
pubDate: 2026-09-26T09:00:00.000+02:00
tags:
  - sql
  - data analytics
  - cheat sheet
  - beginners
draft: true
---

> **Short answer:** Most analyst work comes down to a small set of patterns: filter, join, aggregate, rank, compare to the previous row, and clean up. Learn the fifteen below and you can answer the majority of everyday business questions without searching for syntax.

If you've ever run a query, stared at the result, and thought "that number can't be right", you're in good company. I've done it more times than I'd like to admit. The good news is that most of these moments come from the same handful of causes, and once you can spot them, they take minutes to fix instead of hours.

<!-- ANTHONY: add a real story here (a query that returned a wrong number and what caused it) -->

This cheat sheet is the short list I would hand to a colleague on their first day. The table names (`orders`, `customers`) are made up for illustration, and the syntax is standard SQL that works in PostgreSQL, DuckDB and most warehouses. Where a database differs, I say so.

Lists like this one are common. Sites such as [LearnSQL](https://learnsql.com/blog/sql-for-data-analysis-cheat-sheet/) and [Pangaea X](https://www.pangaeax.com/blogs/sql-cheat-sheet-for-data-analysts/) put the same building blocks at the top for analysts: `SELECT` with `WHERE`, `GROUP BY` with aggregates, joins, window functions, CTEs and `CASE WHEN`. That matches what I use every week.

## Which queries does an analyst use most?

### 1. Filter rows

```sql
SELECT order_id, customer_id, amount
FROM orders
WHERE order_date >= '2026-01-01'
  AND status = 'paid';
```

Always filter by date early. It is the cheapest way to make a query faster.

### 2. Count and sum

```sql
SELECT COUNT(*) AS orders, SUM(amount) AS revenue
FROM orders
WHERE status = 'paid';
```

### 3. Group by

```sql
SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS revenue
FROM orders
GROUP BY customer_id;
```

Every column in `SELECT` must either be aggregated or appear in `GROUP BY`. If the database complains, that is usually why.

### 4. Filter after grouping

```sql
SELECT customer_id, SUM(amount) AS revenue
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 1000;
```

`WHERE` filters rows before grouping. `HAVING` filters groups after. I mix these up more often than I admit.

### 5. Left join (keep everyone on the left)

```sql
SELECT c.customer_id, c.name, COUNT(o.order_id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.name;
```

Use a left join when you want customers with zero orders to stay in the result. An inner join would silently drop them.

### 6. Find rows with no match

```sql
SELECT c.customer_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;
```

"Customers who never bought" is one of the most common business questions there is.

### 7. Conditional logic with CASE WHEN

```sql
SELECT
  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid_revenue,
  SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END) AS refunded
FROM orders;
```

This is how you build several metrics in one pass, without running the query twice.

### 8. Handle NULLs

```sql
SELECT customer_id, COALESCE(discount, 0) AS discount
FROM orders;
```

`NULL` is not zero, and `NULL = NULL` is not true. `COALESCE` gives you a default.

### 9. A CTE to keep things readable

```sql
WITH paid AS (
  SELECT * FROM orders WHERE status = 'paid'
)
SELECT customer_id, SUM(amount) AS revenue
FROM paid
GROUP BY customer_id;
```

A CTE (common table expression) is a named, temporary result you can read top to bottom. I compare it with subqueries and temp tables in [a separate post](/blog/sql-cte-vs-subquery-vs-temp-table-which-to-use/).

### 10. Rank within a group

```sql
SELECT *
FROM (
  SELECT customer_id, order_id, amount,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rn
  FROM orders
) t
WHERE rn = 1;
```

This returns each customer's largest order. Window functions keep every row while calculating across them. I go through ten patterns in [SQL window functions](/blog/sql-window-functions/).

### 11. Compare to the previous row

```sql
SELECT order_date, amount,
       LAG(amount) OVER (ORDER BY order_date) AS previous_amount
FROM orders;
```

### 12. Running total

```sql
SELECT order_date,
       SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

### 13. Group by month

```sql
SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
FROM orders
GROUP BY 1
ORDER BY 1;
```

`DATE_TRUNC` exists in PostgreSQL, DuckDB and Snowflake. SQL Server uses `DATETRUNC` (from 2022) or `EOMONTH` tricks. Dates deserve their own post, which is [here](/blog/sql-date-functions-fiscal-calendars-week-starts-time-zones/).

### 14. Find duplicates

```sql
SELECT email, COUNT(*) AS copies
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;
```

Duplicates are one of the top causes of a number that "can't be right". There is a full walkthrough in [how to find and fix duplicate rows](/blog/find-and-fix-duplicate-rows-in-sql/).

### 15. Percent of total

```sql
SELECT customer_id,
       SUM(amount) AS revenue,
       SUM(amount) * 100.0 / SUM(SUM(amount)) OVER () AS pct_of_total
FROM orders
GROUP BY customer_id;
```

Note the `100.0`. Dividing two integers in some databases gives you an integer, and your percentages become zeros.

## How do I avoid wrong numbers?

Three habits catch most problems before they reach a slide.

1. **Check the row count after every join.** If it grows unexpectedly, you have a many-to-many join and your sums are inflated.
2. **Reconcile one total.** Compare your query's grand total with a number you already trust.
3. **Read the query out loud.** If you can't say what one row represents, the query doesn't know either.

## What should I learn next?

Once these fifteen feel natural, learn window functions properly and get comfortable with dates. Those two areas separate a query that works from one you can trust. If you want a place to practise without setting up a server, [DuckDB](/blog/duckdb-for-analysts-local-analytics-without-a-warehouse/) runs SQL on your own CSV files.

*Sources: [LearnSQL: SQL for Data Analysis Cheat Sheet](https://learnsql.com/blog/sql-for-data-analysis-cheat-sheet/), [Pangaea X: SQL Cheat Sheet for Data Analysts](https://www.pangaeax.com/blogs/sql-cheat-sheet-for-data-analysts/). The tables and figures in the examples are illustrative.*
