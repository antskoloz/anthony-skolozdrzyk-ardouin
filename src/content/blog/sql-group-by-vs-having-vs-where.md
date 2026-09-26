---
title: "GROUP BY vs HAVING vs WHERE: The Order That Actually Matters"
description: WHERE filters rows, GROUP BY collapses them into groups, HAVING
  filters the groups. See SQL's real execution order and where each clause
  belongs.
pubDate: 2026-09-26T10:30:00.000+02:00
tags:
  - sql
  - group by
  - data analytics
  - sql cheat sheet
draft: false
---
> **Short answer:** `WHERE` filters individual rows before any grouping happens. `GROUP BY` collapses the remaining rows into groups. `HAVING` filters those groups after aggregation. You can't use `WHERE` to filter on an aggregate like `SUM()`, because at the point `WHERE` runs, no aggregate has been computed yet.

If you've ever gotten `column "total" must appear in the GROUP BY clause` or wondered why `WHERE SUM(amount) > 100` throws an error, the cause is the same: SQL doesn't execute in the order you write it.

## What order does SQL actually run in?

You write a query as `SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY`, but the database evaluates it in a different sequence:

1. `FROM` (and any joins) — build the working set of rows
2. `WHERE` — filter individual rows
3. `GROUP BY` — collapse the remaining rows into groups
4. `HAVING` — filter the groups
5. `SELECT` — compute the output columns
6. `ORDER BY` — sort the result

This is why `WHERE` can't reference a column alias defined in `SELECT`, and why it can't filter on an aggregate: `WHERE` runs before `SELECT` computes anything and before `GROUP BY` has produced any groups to aggregate over.

## Why can't I filter an aggregate in WHERE?

Say you want customers with total spend over $1,000.

```sql
-- This fails
SELECT customer_id, SUM(amount) AS total
FROM orders
WHERE SUM(amount) > 1000
GROUP BY customer_id;
```

At the moment `WHERE` runs, rows haven't been grouped yet, so there's no per-customer sum to compare against. The database has no idea what `SUM(amount)` means at that stage. The fix is `HAVING`, which runs after grouping:

```sql
SELECT customer_id, SUM(amount) AS total
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 1000;
```

## What's the difference in plain English?

- **`WHERE`** answers "which rows do I even want to look at?" — applied before anything is summarized.
- **`GROUP BY`** answers "how do I want to bucket the rows that survived?"
- **`HAVING`** answers "which of those buckets meet a condition on the summary?"

A useful way to remember it: if the condition mentions a raw column (`status = 'paid'`, `order_date >= '2026-01-01'`), it belongs in `WHERE`. If it mentions an aggregate function (`SUM`, `COUNT`, `AVG`, `MAX`), it belongs in `HAVING`.

## Does it matter if I put a row filter in HAVING instead of WHERE?

It can run, but it's slower and often confusing. `HAVING` filters after grouping, so if you filter something that could have been filtered before grouping, you've made the database group rows it was going to throw away anyway.

```sql
-- Works, but wasteful: filters after grouping every row, including ones we don't want
SELECT customer_id, SUM(amount) AS total
FROM orders
GROUP BY customer_id
HAVING customer_id != 0;

-- Better: filter before grouping
SELECT customer_id, SUM(amount) AS total
FROM orders
WHERE customer_id != 0
GROUP BY customer_id;
```

On a small table you won't notice. On a large fact table, filtering early with `WHERE` reduces how much data ever reaches the grouping step, which usually reduces both compute and memory.

## What about combining both?

This is the normal case, not an edge case: filter the rows you care about, group them, then filter the resulting groups.

```sql
SELECT
  customer_id,
  COUNT(*) AS order_count,
  SUM(amount) AS total_spent
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING COUNT(*) >= 3;
```

Read it as: only look at paid orders, group what's left by customer, then keep only customers with three or more paid orders.

## What are the common mistakes?

1. **Trying to filter an aggregate in `WHERE`.** The database will simply reject the query. Move the condition to `HAVING`.
2. **Using `HAVING` for something `WHERE` could have done.** It still returns the right answer, just slower on large tables.
3. **Selecting a column that's neither aggregated nor in the `GROUP BY` list.** Most databases require every non-aggregated column in `SELECT` to also appear in `GROUP BY`, because otherwise it's ambiguous which row's value to show for that group.
4. **Forgetting that `GROUP BY` changes the grain of the result.** A query with `GROUP BY customer_id` returns one row per customer, no matter how many order rows fed into it. If you also need the order-level detail, that's a separate query, or a window function instead of `GROUP BY` — see [SQL window functions](/blog/sql-window-functions/), which keep every row while still calculating across them.

My take: write `WHERE` first, always, even for conditions that technically could live in `HAVING`. It's a habit that keeps queries fast by default and makes the two clauses' jobs obvious to whoever reads it after you.

For more patterns like this one, see the [SQL cheat sheet](/blog/sql-cheat-sheet-for-data-analysts-15-queries-you-will-reuse/), and for a deeper look at how row-by-row calculations differ from grouping, [CTE vs subquery vs temp table](/blog/sql-cte-vs-subquery-vs-temp-table-which-to-use/) covers the next layer of query structure.
