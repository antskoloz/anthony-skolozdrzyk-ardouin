---
title: "DuckDB for analysts: local analytics without a warehouse"
description: "Query CSV, Parquet and Excel files with plain SQL on your own machine using DuckDB. Practical examples, plus honest limits on concurrency and shared use."
pubDate: 2026-09-20
tags: ["duckdb", "sql", "data analytics", "analytics tools"]
draft: true
---

> **Short answer:** DuckDB lets you run SQL directly on CSV, Parquet and Excel files on your own computer, with no server to set up and no warehouse to wait for. It is excellent for exploration, prototyping and one-off analysis. It is not a replacement for a shared, multi-user warehouse.

Every analyst knows the situation: someone sends a 400 MB export, Excel struggles, and getting the data into the warehouse would take a ticket and a week. DuckDB is a good answer to that gap. This post shows the everyday commands, in the order you are likely to need them, and is clear about where the tool stops being the right choice.

## When does DuckDB fit?

It fits when the data is in files, the analysis is yours alone, and speed of iteration matters more than sharing. Typical cases include a large CSV export from a CRM or billing system, a folder of monthly files, a Parquet dataset, or a spreadsheet you want to query with joins and window functions instead of formulas.

It fits less well when several people need to write to the same database at once, or when the data already lives in a governed warehouse that everyone queries.

## How do you query a CSV file?

Point a `SELECT` at the file. DuckDB's documentation shows two equivalent forms: an explicit `read_csv` call, or just the file name, in which case DuckDB picks the reader from the file extension.

```sql
SELECT * FROM read_csv('orders.csv');

-- same thing, reader inferred from the extension
SELECT * FROM 'orders.csv';
```

To keep the data around for repeated queries, create a table from it:

```sql
CREATE TABLE orders AS
    SELECT * FROM read_csv('orders.csv');
```

A realistic first analysis is monthly revenue. The column names below are examples, so adapt them to your file.

```sql
SELECT
    date_trunc('month', order_date) AS month,
    SUM(amount)                     AS revenue,
    COUNT(DISTINCT customer_id)     AS customers
FROM read_csv('orders.csv')
GROUP BY month
ORDER BY month;
```

## How do you query a whole folder of files?

Use a glob pattern. The DuckDB documentation supports `*` for any characters and `**` for any depth of subfolders, and you can also pass an explicit list of files.

```sql
-- every CSV in a folder, at any depth
SELECT * FROM 'exports/**/*.csv';

-- an explicit list, tracking which file each row came from
SELECT *
FROM read_csv(['jan.csv', 'feb.csv'],
              union_by_name = true,
              filename = true);
```

Two options are worth knowing. `union_by_name = true` matches columns by name across files, which helps when the layout changed between months. `filename = true` adds a column with the source file, which is useful for tracing odd rows back to their origin.

## How do you work with Parquet?

Parquet is a compressed, columnar file format that analysts increasingly receive from data teams. Reading it looks the same as reading a CSV. DuckDB's documentation notes that filters are pushed down into the scan and only the columns you use are read.

```sql
SELECT * FROM read_parquet('orders.parquet');
```

Writing Parquet is one statement, which makes it a handy way to turn a heavy CSV into a smaller, faster file:

```sql
COPY (SELECT * FROM read_csv('orders.csv'))
TO 'orders.parquet'
(FORMAT parquet);
```

The documentation lists Snappy as the default compression and also supports options such as zstd.

## Can DuckDB read and write Excel?

Yes, through its Excel extension, which loads automatically the first time you use it. Manual installation is `INSTALL excel; LOAD excel;`.

```sql
SELECT * FROM read_xlsx('budget.xlsx', header = true);

COPY orders TO 'orders_summary.xlsx'
WITH (FORMAT xlsx, HEADER true);
```

Read options include `sheet`, `range` and `all_varchar`, which reads every cell as text and is useful when a column mixes numbers and text. According to the documentation, only `.xlsx` is supported, so older `.xls` files need converting first. Writing is capped at 1,048,576 rows per sheet by default.

## Can you reuse work from other analyses?

Yes. Because the syntax is standard SQL plus a few file helpers, queries carry over well. For example, the WAPE and bias query from my post on [sales forecast accuracy](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/sales-forecast-accuracy-wape-bias-sandbagging/) runs unchanged on a CSV export if you replace the table name with `'forecast_vs_actual.csv'`.

My own workflow, offered as a suggestion rather than a rule: prototype the logic locally in DuckDB, confirm the numbers on a sample, then port the SQL to your warehouse and check for dialect differences such as date functions.

## What are the limits?

Be realistic about these before you rely on it.

- **One machine.** Everything runs on your computer, so file size is limited by your memory and disk.
- **Concurrent writers.** DuckDB's documentation says multiple threads within one process can write, using optimistic concurrency, and that a conflict on the same row raises an error you must retry. Writing to the native database file from multiple processes is supported through the Quack remote protocol, which the documentation describes as beta at the time of writing. For production use it recommends the DuckLake format with PostgreSQL as the catalog.
- **Shared drives.** The documentation advises extra caution when placing a DuckDB database file in a shared directory or on network-attached storage.
- **Governance.** Copying company data onto a laptop may not be allowed. Check your organization's data-handling policy first, and use synthetic or public data for experiments and demos.

## Frequently asked questions

**Do I need to install a server?**
No. DuckDB runs inside your own process, for example from its command-line tool or from Python.

**Is it a replacement for a data warehouse?**
No. It is a fast, personal analysis tool. Shared, governed data still belongs in a warehouse.

**Can I use it with Power BI?**
That depends on your setup and connectors. A safer starting point is to use DuckDB to prepare and validate data, then export a clean Parquet or Excel file.

**What if my CSV has messy headers or types?**
Start with `read_csv` and its options, and use `all_varchar` style settings when types are inconsistent. Then cast columns explicitly in your query.

## Sources

- [DuckDB documentation: CSV import](https://duckdb.org/docs/current/guides/file_formats/csv_import)
- [DuckDB documentation: Querying Parquet files](https://duckdb.org/docs/current/guides/file_formats/query_parquet)
- [DuckDB documentation: Reading and writing Parquet files](https://duckdb.org/docs/current/data/parquet/overview)
- [DuckDB documentation: Reading multiple files](https://duckdb.org/docs/current/data/multiple_files/overview)
- [DuckDB documentation: Excel extension](https://duckdb.org/docs/lts/core_extensions/excel)
- [DuckDB documentation: Concurrency](https://duckdb.org/docs/current/connect/concurrency)

*Last reviewed: 20 September 2026.*
