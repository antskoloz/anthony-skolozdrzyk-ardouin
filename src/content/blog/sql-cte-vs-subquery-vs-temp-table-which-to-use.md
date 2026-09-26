---
title: "SQL CTE vs Subquery vs Temp Table: Which to Use"
description: CTE, subquery or temp table? A plain-English comparison for analysts, with examples, the performance trade-offs, and a simple rule for choosing.
pubDate: 2026-09-26T09:10:00.000+02:00
tags:
  - sql
  - data analytics
  - cte
  - query performance
draft: true
---

> **Short answer:** Use a CTE to make a query readable, a subquery for a small one-off lookup, and a temp table when a big intermediate result is used several times or needs an index. None of them is always faster, so read the query plan before assuming.

Every analyst hits this moment: the query has grown to sixty lines, three levels of brackets, and nobody, including you, can say what the middle part does. You have three tools to fix it, and they look similar enough to cause arguments.

<!-- ANTHONY: add a real story here (a query you had to untangle, or a temp table that saved or hurt you) -->

Here is how I think about them, what the documentation and the community say about performance, and a rule of thumb that has served me well.

## What is the difference between a CTE, a subquery and a temp table?

**A subquery** is a query inside another query. It lives for the length of that one statement.

```sql
SELECT customer_id, revenue
FROM (
  SELECT customer_id, SUM(amount) AS revenue
  FROM orders
  GROUP BY customer_id
) t
WHERE revenue > 1000;
```

**A CTE** (common table expression) gives that inner query a name at the top, using `WITH`. It also lives for one statement.

```sql
WITH revenue_by_customer AS (
  SELECT customer_id, SUM(amount) AS revenue
  FROM orders
  GROUP BY customer_id
)
SELECT customer_id, revenue
FROM revenue_by_customer
WHERE revenue > 1000;
```

**A temp table** is a real, temporary table stored for your session. You create it once and can use it many times.

```sql
CREATE TEMP TABLE revenue_by_customer AS
SELECT customer_id, SUM(amount) AS revenue
FROM orders
GROUP BY customer_id;
```

The first two are about how you write the query. The third is about storing an intermediate result.

## Which one is faster?

It depends, and anyone who tells you otherwise is selling something. The sources I checked agree on the general shape:

- Temp tables can be indexed, and they get their own statistics. [LearnSQL](https://learnsql.com/blog/cte-vs-temp-table-in-sql/) notes that an index on a temp table can speed up later joins and filters on large data. Subqueries and CTEs don't have that.
- Creating a temp table has a cost, because the database has to write the result. A CTE avoids that, which is why [Maven Analytics](https://mavenanalytics.io/blog/sql-subqueries-temporary-tables-ctes) and others suggest CTEs for small or one-off work.
- A [Microsoft Q&A thread](https://learn.microsoft.com/en-au/answers/questions/2200373/performance-between-cte-vs-temp-table) makes the trade-off explicit: a temp table has overhead, but its statistics can help the optimizer with the rest of the query, while a CTE lets the optimizer reorder work freely.

One detail that surprises people: whether a CTE is computed once or re-computed each time you reference it depends on the database. In PostgreSQL 12 and later, a simple CTE referenced once is usually inlined like a subquery, and you can force either behaviour with `MATERIALIZED` or `NOT MATERIALIZED`. In SQL Server, a CTE is not stored; each reference is expanded into the query. So a CTE used three times may do the work three times.

The honest advice is to look at the query plan (`EXPLAIN` in most databases) before deciding.

## When should I use each?

Here is the rule of thumb I use.

| Situation | Use |
| --- | --- |
| The query is hard to read and each step is used once | **CTE** |
| A tiny lookup, such as "customers above the average" | **Subquery** |
| The same big intermediate result is used several times | **Temp table** |
| You need an index on the intermediate result | **Temp table** |
| You need to inspect the middle step while debugging | **Temp table** or a CTE you can run on its own |
| The database is a read-only warehouse and you can't create tables | **CTE** |

## What does a good CTE chain look like?

Give each CTE a name that says what one row is, and let each step do one thing.

```sql
WITH paid_orders AS (
  SELECT * FROM orders WHERE status = 'paid'
),
customer_revenue AS (
  SELECT customer_id, SUM(amount) AS revenue
  FROM paid_orders
  GROUP BY customer_id
),
ranked AS (
  SELECT *, RANK() OVER (ORDER BY revenue DESC) AS rnk
  FROM customer_revenue
)
SELECT * FROM ranked WHERE rnk <= 10;
```

You can read that top to bottom like a recipe. Someone else can too.

## What are the common mistakes?

1. **Nesting subqueries four deep.** Convert them to a CTE chain. The database won't care, but your colleagues will.
2. **Assuming a CTE caches its result.** In many databases it doesn't. If the step is expensive and used twice, test a temp table.
3. **Leaving temp tables behind.** In shared environments, clean up, or use a session-scoped one.
4. **Optimizing before measuring.** If the query runs in two seconds, readability wins.

My take: default to CTEs, and reach for a temp table only when the plan tells you to. That is an opinion, not a law. If you work on a huge table where every step is expensive, the balance shifts toward temp tables with indexes.

If you want to go further with CTEs, a good next step is [SQL window functions](/blog/sql-window-functions/), which pair with them constantly.

*Sources: [LearnSQL: CTE vs Temp Table](https://learnsql.com/blog/cte-vs-temp-table-in-sql/), [Maven Analytics: Subqueries vs Temporary Tables vs CTEs](https://mavenanalytics.io/blog/sql-subqueries-temporary-tables-ctes), [Microsoft Q&A: CTE vs temp table performance](https://learn.microsoft.com/en-au/answers/questions/2200373/performance-between-cte-vs-temp-table). The PostgreSQL 12 inlining behaviour is documented in the PostgreSQL manual (WITH queries). Table and column names are illustrative.*
