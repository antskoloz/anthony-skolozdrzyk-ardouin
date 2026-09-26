---
title: "How to Find and Fix Duplicate Rows in SQL"
description: Find duplicate rows in SQL with GROUP BY and ROW_NUMBER, then remove them safely. Copy-paste queries, the traps to avoid, and how to stop duplicates coming back.
pubDate: 2026-09-26T09:20:00.000+02:00
tags:
  - sql
  - data quality
  - data cleaning
  - data analytics
draft: true
---

> **Short answer:** Find duplicates by grouping on the columns that should be unique and keeping groups with a count above one. Remove them by numbering the rows in each group with `ROW_NUMBER()` and deleting everything after the first. Always look before you delete.

If a revenue number looks too good to be true, check for duplicates before you celebrate. Doubled rows quietly inflate sums, counts and averages, and they rarely announce themselves.

<!-- ANTHONY: add a real story here (a duplicate that inflated a number, and how you noticed) -->

This post shows the three steps I follow: decide what "duplicate" means, find them, and only then fix them.

## What counts as a duplicate?

Start here, because it decides everything else. Two rows can be:

- **Fully identical**, every column the same. Usually a double load.
- **Duplicates by key**, for example the same `email` or `order_id` but a different `updated_at`. This is more common and harder to spot.

Write down the columns that *should* be unique. In this post I use `email` on a `customers` table. The names are illustrative.

## How do I find duplicate rows?

The classic pattern groups by the columns that should be unique and keeps groups with more than one row. [LearnSQL](https://learnsql.com/cookbook/how-to-find-duplicate-rows-in-sql/) and [Oracle's SQL blog](https://blogs.oracle.com/sql/how-to-find-and-delete-duplicate-rows-with-sql) both describe it this way.

```sql
SELECT email, COUNT(*) AS copies
FROM customers
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY copies DESC;
```

To see the actual rows and not just the counts, number them:

```sql
SELECT *
FROM (
  SELECT c.*,
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) AS rn
  FROM customers c
) t
WHERE rn > 1;
```

Every row with `rn > 1` is an extra copy. The row with `rn = 1` is the one you would keep, here the oldest. Change the `ORDER BY` to decide which copy survives, for example `ORDER BY updated_at DESC` to keep the freshest.

## How do I measure how bad it is?

Before touching anything, size the problem.

```sql
SELECT
  COUNT(*) AS total_rows,
  COUNT(DISTINCT email) AS distinct_emails,
  COUNT(*) - COUNT(DISTINCT email) AS extra_rows
FROM customers;
```

If `extra_rows` is a fraction of a percent, you may have a small import glitch. If it is 20%, something upstream is broken and deleting rows treats the symptom.

## How do I remove duplicates safely?

Removing them in a SELECT, without deleting anything, is the safest option for reporting:

```sql
SELECT *
FROM (
  SELECT c.*,
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) AS rn
  FROM customers c
) t
WHERE rn = 1;
```

Wrap that in a CTE or a view and every report gets a clean table without a destructive change.

If you truly need to delete, the `ROW_NUMBER()` approach is the one most sources, including [DataCamp](https://www.datacamp.com/tutorial/sql-remove-duplicates), recommend for modern databases. The syntax varies. In SQL Server you can delete through a CTE:

```sql
WITH numbered AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) AS rn
  FROM customers
)
DELETE FROM numbered WHERE rn > 1;
```

In PostgreSQL, use the row's physical id:

```sql
DELETE FROM customers
WHERE ctid IN (
  SELECT ctid FROM (
    SELECT ctid,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) AS rn
    FROM customers
  ) t
  WHERE rn > 1
);
```

Two safety rules I follow every time:

1. **Copy first.** `CREATE TABLE customers_backup AS SELECT * FROM customers;`
2. **Run the SELECT version, check the count, then run the DELETE.** If the counts differ, stop.

## What traps should I watch for?

- **Different spellings.** `Anna@x.com` and `anna@x.com ` (trailing space) are not equal to the database. Compare on `LOWER(TRIM(email))` when that is what you mean.
- **NULLs.** In `GROUP BY`, all NULLs form one group, so a column full of NULLs looks like one giant duplicate.
- **Many-to-many joins.** Sometimes there are no duplicates in the table at all. A join multiplied the rows. Check the row count before and after every join.
- **Deleting the wrong copy.** The `ORDER BY` inside `ROW_NUMBER()` is a business decision, not a technicality. Ask which record is the source of truth.

## How do I stop duplicates coming back?

Deleting is a cleanup, not a fix. Add a constraint so the database refuses duplicates:

```sql
ALTER TABLE customers ADD CONSTRAINT customers_email_unique UNIQUE (email);
```

If you can't change the source, add a scheduled duplicate check that alerts you when the count is above zero. I cover a wider set of checks in [the RevOps data quality audit](/blog/revops-data-quality-audit-10-point-checklist/).

My opinion: prefer the non-destructive SELECT version wherever you can. Deleting data is a one-way door, and the person who asks "where did that customer go?" is usually a week away.

*Sources: [LearnSQL: How to Find Duplicate Rows in SQL](https://learnsql.com/cookbook/how-to-find-duplicate-rows-in-sql/), [Oracle: How to Find and Delete Duplicate Rows with SQL](https://blogs.oracle.com/sql/how-to-find-and-delete-duplicate-rows-with-sql), [DataCamp: SQL Remove Duplicates](https://www.datacamp.com/tutorial/sql-remove-duplicates). Table and column names are illustrative.*
