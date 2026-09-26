---
title: "SQL Joins Explained: Inner, Left, Right and Full"
description: What INNER, LEFT, RIGHT and FULL joins actually do, why rows
  duplicate or disappear, and how to pick the right one for a report.
pubDate: 2026-09-26T10:00:00.000+02:00
tags:
  - sql
  - joins
  - data analytics
  - sql cheat sheet
draft: false
---
> **Short answer:** A join combines rows from two tables based on a matching condition. `INNER JOIN` keeps only rows that match on both sides. `LEFT JOIN` keeps every row from the left table and fills in `NULL` where there's no match. `RIGHT JOIN` is the mirror of `LEFT`. `FULL JOIN` keeps every row from both sides. Most reporting queries need `INNER` or `LEFT`; the other two are rarer than tutorials suggest.

Joins are the first thing every SQL course teaches and the thing that still causes the most confusion months later, usually in the form of "why does my row count keep changing?" This post walks through what each join type does, where rows go missing or multiply, and a simple way to decide which one you need.

## What does each join type actually do?

Take two small tables.

```sql
-- customers
id | name
1  | Alice
2  | Bob
3  | Carla

-- orders
id | customer_id | amount
1  | 1           | 50
2  | 1           | 30
3  | 2           | 20
```

**INNER JOIN** keeps a row only if it has a match on both sides.

```sql
SELECT c.name, o.amount
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;
```

This returns Alice twice (she has two orders) and Bob once. Carla, who has no orders, disappears entirely.

**LEFT JOIN** keeps every row from the table on the left (`customers`), even without a match. Unmatched rows get `NULL` for every column from the right table.

```sql
SELECT c.name, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

Now Carla appears once, with `amount` as `NULL`.

**RIGHT JOIN** is the same idea, reversed: every row from the right table, `NULL` where the left has no match. It's rarely used in practice, because you can always rewrite a `RIGHT JOIN` as a `LEFT JOIN` by swapping which table you list first, and most style guides prefer that for readability.

**FULL JOIN** (or `FULL OUTER JOIN`) keeps every row from both tables, matched where possible and `NULL`-padded where not. It's the right tool when you're reconciling two lists and need to see what's missing on either side, such as comparing a CRM's customer list against a billing system's.

## What happens to unmatched rows?

This is the part that trips people up. An `INNER JOIN` silently drops non-matching rows, which is exactly what you want for "show me paid orders with their customer names" and exactly what you don't want for "show me every customer, including ones with no orders yet."

If you need the second one, `LEFT JOIN` plus a `WHERE` clause on the right table's key is the standard pattern for "customers with no orders":

```sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

The `LEFT JOIN` keeps Carla with `NULL` values, and the `WHERE o.id IS NULL` filters down to exactly the rows where nothing matched. Note that filtering on `o.id IS NULL` in the `WHERE` clause (rather than a condition in the join itself) only works because the join already happened as a `LEFT JOIN` — putting this filter in an `INNER JOIN` query would never find any rows, since `INNER JOIN` already removed the unmatched ones.

## Why did my row count multiply?

The most common join bug isn't a wrong join type, it's a one-to-many relationship you didn't account for. If a customer has three orders and you join `customers` to `orders`, each customer row becomes three rows, one per order. That's correct if you wanted order-level detail, and a serious bug if you then try to sum a customer-level column like a loyalty tier bonus, because it gets counted three times.

The fix isn't a different join, it's deciding your grain before you join. If you want customer-level totals, aggregate the orders first:

```sql
SELECT c.name, COALESCE(SUM(o.amount), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.name;
```

`COALESCE` turns the `NULL` from unmatched customers into `0`, which is usually what you want for a "total spent" column.

## How do I pick the right join for a report?

Ask one question: should rows with no match disappear, or should they show up as zero/blank?

| Situation | Join |
| --- | --- |
| Only paid, matched transactions matter | `INNER JOIN` |
| Every customer must appear, even with zero orders | `LEFT JOIN` |
| Reconciling two lists, need to see gaps on both sides | `FULL JOIN` |
| You wrote `RIGHT JOIN` | Swap the table order and use `LEFT JOIN` instead, for readability |

## What are the common mistakes?

1. **Joining on the wrong column and getting a cartesian product.** If your `ON` condition matches many rows on both sides (or you forget the `ON` clause entirely), every row on one side pairs with every row on the other. Row counts that explode into the millions on a small table are the classic symptom.
2. **Filtering a `LEFT JOIN`'s right-side columns in `WHERE` and accidentally turning it into an `INNER JOIN`.** `WHERE o.amount > 10` on a left-joined table drops the `NULL` rows you were trying to keep, because `NULL > 10` is never true. Put that condition in the `ON` clause instead if you want to keep unmatched rows.
3. **Forgetting `NULL` handling downstream.** Aggregates like `SUM` ignore `NULL`, but a plain arithmetic expression with a `NULL` in it returns `NULL` for the whole row. `COALESCE` is the usual fix.
4. **Not checking row counts before and after a join.** A quick `SELECT COUNT(*)` before and after tells you immediately whether a join fanned out unexpectedly.

My take: default to `LEFT JOIN` when you're not sure, because it's easier to spot a `NULL` you didn't expect than to notice a row that silently vanished. Switch to `INNER JOIN` once you've confirmed that's genuinely what the report needs.

For the aggregation patterns that usually follow a join, see the [SQL cheat sheet](/blog/sql-cheat-sheet-for-data-analysts-15-queries-you-will-reuse/), and for ranking or running totals across joined rows, [SQL window functions](/blog/sql-window-functions/) is the natural next step.
