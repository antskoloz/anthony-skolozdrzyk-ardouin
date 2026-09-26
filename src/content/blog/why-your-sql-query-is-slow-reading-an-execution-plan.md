---
title: "Why Your SQL Query Is Slow: Reading an Execution Plan"
description: Learn to read EXPLAIN output, spot the difference between a scan
  and an index, and fix the handful of causes behind most slow SQL queries.
pubDate: 2026-09-26T11:00:00.000+02:00
tags:
  - sql
  - query performance
  - data analytics
  - sql cheat sheet
draft: false
---
> **Short answer:** Most slow queries come from one of a few causes: a full table scan where an index could help, a function wrapped around an indexed column that prevents the index from being used, or a huge join happening before a filter narrows things down. `EXPLAIN` (or `EXPLAIN ANALYZE`) shows you the plan the database actually chose, and the fix is usually visible once you know what to look for.

A query that took two seconds last month and takes twenty seconds today almost never has a mysterious cause. The data grew, an index went missing, or a filter that used to be selective stopped being selective. The execution plan tells you which.

## What is an execution plan?

Before running a query, the database's optimizer decides *how* to run it: which indexes to use, in what order to join tables, whether to scan a whole table or jump to specific rows. `EXPLAIN` shows you that plan without running the query; `EXPLAIN ANALYZE` runs it and shows you the actual time and row counts alongside the plan's estimates.

```sql
EXPLAIN ANALYZE
SELECT customer_id, SUM(amount)
FROM orders
WHERE order_date >= '2026-01-01'
GROUP BY customer_id;
```

The output is a tree, read from the innermost (most indented) step outward. Each line names an operation — a scan, a join, a sort, an aggregate — along with an estimated cost and, with `ANALYZE`, the actual time and row count.

## What's the difference between a scan and an index?

- **Sequential scan (a.k.a. table scan or full scan)** reads every row in the table and checks each one against the filter. Fine for small tables, expensive for large ones.
- **Index scan** uses an index — a separate, sorted structure — to jump directly to the rows that match, instead of reading everything.
- **Index-only scan** answers the query entirely from the index, without touching the table at all, when every column the query needs is already in the index.

If `EXPLAIN` shows a sequential scan on a large table where you expected an index scan, that's usually your answer. Common reasons an index isn't used even though one exists:

- No index exists on the filtered or joined column.
- The filter wraps the column in a function (`WHERE YEAR(order_date) = 2026`), which prevents most databases from using a plain index on `order_date`. Rewriting it as a range (`WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`) restores index use.
- The column's data type doesn't match what you're comparing it to, forcing an implicit cast that also blocks the index.
- The filter isn't selective enough. If a condition matches 80% of the table, the optimizer often decides a full scan is cheaper than jumping around with an index, and it's usually right.

## Why are estimated and actual row counts so different?

`EXPLAIN ANALYZE` shows both. When they're close, the optimizer had good statistics and likely chose a sensible plan. When they're far apart — say, an estimate of 100 rows and an actual of 2 million — the optimizer was working from stale statistics and probably picked the wrong join order or join type as a result. The fix is usually to update statistics (`ANALYZE` the table, or your database's equivalent), not to rewrite the query.

## What are the most common causes of a slow query?

1. **Missing index on a filtered or joined column.** The single most common fix. Add an index on the columns in your `WHERE` and `JOIN ... ON` clauses, especially on large tables.
2. **A function around an indexed column.** Covered above — rewrite the condition so the column itself is bare.
3. **Filtering after a big join instead of before.** If you join two large tables and only then filter down to a small date range, the database may still have to process the full join first. A `WHERE` clause on a cleanly indexed column, applied as early as possible, gives the optimizer more room to filter before joining.
4. **`SELECT *` on a wide table.** Pulling every column, including large text or blob fields you don't need, adds I/O for no benefit. Select only the columns you use.
5. **Implicit type mismatches.** Comparing a text column to a number, or a `varchar` to an `int`, forces a conversion on every row and often disables an index in the process.
6. **A correlated subquery that re-runs for every outer row.** If a subquery references a column from the outer query, it may execute once per row instead of once total. Rewriting it as a join or a window function often fixes this — see [CTE vs subquery vs temp table](/blog/sql-cte-vs-subquery-vs-temp-table-which-to-use/) for when each structure performs differently.

## How do I actually diagnose one?

1. Run `EXPLAIN ANALYZE` on the slow query.
2. Find the step with the largest actual time, usually near the top of the highest-cost branch.
3. Check whether that step is a sequential scan on a large table. If yes, look for a missing or unusable index.
4. Compare estimated vs actual row counts at each step. A big gap points to stale statistics.
5. Fix one thing at a time, and re-run `EXPLAIN ANALYZE` after each change to confirm it actually helped. A plan can look better and still run about the same if you fixed the wrong step.

## What mistakes should I watch for?

- **Adding an index and never checking if it's used.** Some queries won't benefit from a new index if the optimizer still prefers a scan for other reasons. Verify with `EXPLAIN` after adding it.
- **Over-indexing.** Every index speeds up reads on that column but slows down every write to the table, and takes storage. Index what you actually filter and join on, not every column.
- **Optimizing a query that runs once a month.** Time spent tuning a report that runs in 30 seconds, once, isn't worth it. Save the effort for queries that run often or block someone waiting on a dashboard.

My take: learn to read one execution plan properly before you learn a dozen performance tricks. Most "SQL is slow" problems trace back to the same three or four root causes above, and the plan tells you which one you're looking at instead of leaving you to guess.

If your slowness shows up specifically inside Power BI rather than raw SQL, the causes overlap but the fixes differ — see [Slow Power BI report? 7 fixes in order of payoff](/blog/slow-power-bi-report-7-fixes-in-order-of-payoff/).
