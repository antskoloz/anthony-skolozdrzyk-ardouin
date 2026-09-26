---
title: "SQL Date Functions: Fiscal Calendars, Week Starts and Time Zones"
description: Handle dates in SQL without wrong totals. DATE_TRUNC, week starts,
  fiscal years and time zones explained for analysts, with queries and a
  calendar table.
pubDate: 2026-09-26T07:26:00.000+02:00
tags:
  - sql
  - dates
  - data analytics
  - reporting
draft: false
---

> **Short answer:** Most date bugs come from three decisions nobody wrote down: which time zone a day is measured in, which day a week starts on, and when the fiscal year begins. Convert the time zone first, truncate second, and put fiscal logic in a calendar table instead of scattering it through queries.

Two analysts run "revenue last week" and get different numbers. Neither is wrong. One counts weeks from Monday, the other from Sunday, and an order at 23:30 in Munich landed on a different day in UTC.

<!-- ANTHONY: add a real story here (a report where two teams got different numbers because of dates, weeks or time zones) -->

Dates look simple and cause more silent errors than almost anything else in reporting. Here are the decisions to make and the SQL to match. Examples use PostgreSQL and DuckDB syntax, and I point out where other databases differ. The tables are illustrative.

## How do I group by day, week or month?

`DATE_TRUNC` rounds a timestamp down to the start of a period. [Data Driven](https://datadriven.io/sql/date-functions) describes it as the function that powers time-series grouping, alongside `EXTRACT`, which pulls out a single part such as the year or hour.

```sql
SELECT DATE_TRUNC('month', order_ts) AS month, SUM(amount) AS revenue
FROM orders
GROUP BY 1
ORDER BY 1;
```

Swap `'month'` for `'day'`, `'week'` or `'quarter'`. SQL Server has no `DATE_TRUNC` before SQL Server 2022, which added `DATETRUNC`, so older versions use `DATEADD`/`DATEDIFF` tricks or a calendar table.

## Which day does a week start on?

This is the classic silent disagreement. Conventions differ by country: the ISO standard and much of Europe start on Monday, while the US often starts on Sunday. Databases differ too.

- PostgreSQL's `DATE_TRUNC('week', ...)` starts on **Monday**, following ISO 8601.
- MySQL's `WEEK()` takes a *mode* argument that controls the first day and how week 1 is defined.

If your report needs Sunday-based weeks in PostgreSQL, shift the date, truncate, and shift back:

```sql
SELECT DATE_TRUNC('week', order_date + INTERVAL '1 day') - INTERVAL '1 day' AS week_start,
       SUM(amount) AS revenue
FROM orders
GROUP BY 1;
```

Whatever you choose, **label the chart**: "Weeks start Monday". It costs five words and saves a meeting.

## How do I handle time zones?

The most common time-zone bug is grouping by UTC day when the business reports in local time. A late-evening order in Munich falls on the next UTC day, so your "daily revenue" shifts.

The order of operations matters: **convert the time zone first, then truncate.**

```sql
SELECT DATE_TRUNC('day', order_ts AT TIME ZONE 'Europe/Berlin') AS local_day,
       SUM(amount) AS revenue
FROM orders
GROUP BY 1;
```

Two details worth knowing in PostgreSQL. `AT TIME ZONE` on a `timestamptz` returns a local timestamp without a zone, which is what you want for grouping. And use named zones such as `Europe/Berlin`, not fixed offsets like `+01:00`, so daylight-saving changes are handled for you.

A few habits keep this sane:

1. Store timestamps in UTC.
2. Convert to the business time zone at reporting time.
3. Pick one reporting zone for the company and document it.

## How do I do fiscal years?

Many companies start the fiscal year in April, July or October. The [SQLServerCentral](https://www.sqlservercentral.com/articles/how-to-handle-calculations-related-to-fiscal-year-and-quarter) and [Microsoft Q&A](https://learn.microsoft.com/answers/questions/682880/sql-query-to-load-date-time-fiscal-year-and-normal.html) discussions of this problem converge on the same answer: use a date dimension, meaning a calendar table with one row per day.

A simple version, for a fiscal year starting in April:

```sql
SELECT d AS date,
       EXTRACT(YEAR FROM d) AS calendar_year,
       CASE WHEN EXTRACT(MONTH FROM d) >= 4
            THEN EXTRACT(YEAR FROM d) + 1
            ELSE EXTRACT(YEAR FROM d) END AS fiscal_year,
       FLOOR(((EXTRACT(MONTH FROM d) + 8) % 12) / 3) + 1 AS fiscal_quarter
FROM generate_series(DATE '2024-01-01', DATE '2028-12-31', INTERVAL '1 day') AS g(d);
```

Naming the fiscal year by the calendar year it *ends* in is one convention, and some companies use the year it starts in. Confirm which one your finance team uses before you publish anything.

Save it as a table (`dim_date`) and join to it. Then "fiscal Q3" is one column, not a `CASE WHEN` copied into twenty queries.

## What else goes in a calendar table?

Everything you would otherwise recompute:

- ISO year and ISO week
- Fiscal year, quarter and period
- Is weekend, is public holiday
- Week start date

Public holidays and working days are especially useful, because comparing "March" with "February" without adjusting for working days is a common way to misread a trend.

## What are the quick checks before I publish?

- Does the first and last period cover a full period, or is it a partial month pretending to be a drop?
- Are timestamps converted to the reporting zone before grouping?
- Does the chart say which day the week starts on?
- Does the fiscal year match finance's definition?

My opinion: build the calendar table early, even for a small project. It feels like ceremony until the first time someone asks for fiscal weeks, and then it saves a day. If your data is tiny and only you use it, a plain `DATE_TRUNC` is fine.

This pairs naturally with [cohort retention in SQL](/blog/cohort-retention-analysis-in-sql-step-by-step/), where month boundaries decide who counts as retained.

*Sources: [Data Driven: SQL Date Functions](https://datadriven.io/sql/date-functions), [SQLServerCentral: fiscal year and quarter calculations](https://www.sqlservercentral.com/articles/how-to-handle-calculations-related-to-fiscal-year-and-quarter), [Microsoft Q&A: fiscal year and calendar year in SQL](https://learn.microsoft.com/answers/questions/682880/sql-query-to-load-date-time-fiscal-year-and-normal.html). PostgreSQL behaviour is documented in its manual (date/time functions). Table names and figures are illustrative.*
