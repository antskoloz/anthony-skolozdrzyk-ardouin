---
title: "Power BI Time Intelligence: YTD, YoY and Rolling 12 Months"
description: Build year-to-date, year-over-year and rolling 12-month measures in
  DAX. Includes the date table rules that make time intelligence work, with
  copy-paste measures.
pubDate: 2026-09-26T09:07:00.000+02:00
tags:
  - power bi
  - dax
  - time intelligence
  - reporting
draft: false
---

> **Short answer:** Time intelligence only works with a proper date table: one row per day, no gaps, marked as the date table. With that in place, `TOTALYTD` gives year-to-date, `SAMEPERIODLASTYEAR` gives the prior year, and `DATESINPERIOD` gives a rolling window. Each is a `CALCULATE` that swaps the time filter.

"How are we doing versus last year?" is probably the most common question a report gets asked. It is also where many beginners meet DAX errors that read like riddles.

<!-- ANTHONY: add a real story here (a year-over-year or YTD number that was wrong, and why) -->

The good news is that the patterns are short. The catch is the date table. Names below are illustrative.

## Why do I need a date table?

Time intelligence functions shift across a sequence of dates, so they need that sequence to be complete. The rules, as summarised in several guides, are:

- One row per day, with unique values and no blanks.
- The table covers whole calendar years, with no gaps between the first and last day.
- It is marked as a date table in Power BI Desktop, and related to your fact table on the date column.

If your date column comes from the sales table, it only has dates that had sales, so weekends or holiday gaps can quietly break the calculations. Build a separate `Date` table instead. I show how to generate one, including fiscal columns, in [SQL date functions and fiscal calendars](/blog/sql-date-functions-fiscal-calendars-week-starts-time-zones/), and the same idea works in Power Query or DAX:

```dax
Date =
ADDCOLUMNS(
    CALENDAR( DATE(2022,1,1), DATE(2027,12,31) ),
    "Year", YEAR([Date]),
    "Month Number", MONTH([Date]),
    "Month", FORMAT([Date], "MMM")
)
```

Then mark it as the date table and create a one-to-many relationship from `Date[Date]` to your fact table. This is a standard part of a [star schema](/blog/power-bi-star-schema-for-beginners/).

## How do I calculate year-to-date?

`TOTALYTD` evaluates an expression over the dates from the start of the year up to the current point. Here is the measure:

```dax
Sales YTD = TOTALYTD( [Total Sales], 'Date'[Date] )
```

If your fiscal year doesn't end on 31 December, pass the year-end date as the last argument. The [DAX Guide](https://dax.guide/totalytd/) documents the optional year-end parameter, for example a June year end:

```dax
Sales Fiscal YTD = TOTALYTD( [Total Sales], 'Date'[Date], "6/30" )
```

The equivalent using `CALCULATE`, which is worth learning because it shows what is happening underneath:

```dax
Sales YTD (long form) =
CALCULATE( [Total Sales], DATESYTD( 'Date'[Date] ) )
```

If `CALCULATE` still feels fuzzy, read [DAX CALCULATE explained](/blog/dax-calculate-explained-filter-context-in-plain-english/) first.

## How do I calculate year-over-year?

Two steps: get last year's value, then compare.

```dax
Sales LY = CALCULATE( [Total Sales], SAMEPERIODLASTYEAR( 'Date'[Date] ) )

Sales YoY % =
VAR CurrentValue = [Total Sales]
VAR LastYear = [Sales LY]
RETURN DIVIDE( CurrentValue - LastYear, LastYear )
```

According to the [DAX Guide](https://dax.guide/sameperiodlastyear/), `SAMEPERIODLASTYEAR` is equivalent to `DATEADD( dates, -1, YEAR )`. That is useful, because `DATEADD` is the flexible version: change the number and the interval to compare with last quarter or two years ago.

`DIVIDE` is worth using instead of `/`, because it returns blank instead of an error when last year is zero.

## How do I calculate a rolling 12 months?

A rolling window moves with the latest date in the current filter. `DATESINPERIOD` returns a run of dates starting at a given point and continuing for a number of intervals:

```dax
Sales Rolling 12M =
CALCULATE(
    [Total Sales],
    DATESINPERIOD( 'Date'[Date], MAX( 'Date'[Date] ), -12, MONTH )
)
```

Read it aloud: "take the last date in view, go back 12 months, and sum the sales in that window." On a monthly chart, each point becomes the trailing twelve months, which smooths out seasonality nicely.

## Which mistakes come up most often?

1. **No date table, or an unmarked one.** Errors and odd totals follow. Fix this before anything else.
2. **The relationship uses a date-time column.** A time part makes dates fail to match. Use a date-only key.
3. **Comparing an unfinished period with a full one.** The current month always looks like a drop. Either cut it off or compare like with like.
4. **Forgetting fiscal year-ends.** Confirm the definition with finance, as with any dates question.
5. **Auto date/time still on.** It creates hidden tables and confuses which "date" you are using. Turn it off and use your own table.

## Which visual works best?

For YoY, a line chart with two lines (this year and last year) or a column chart with a variance number beside it. Put the YoY percentage in a card, and put the rolling 12-month line on the same axis as the monthly values for context.

My take: write the measure with variables and readable names, then never touch it again. Time intelligence is boring in the best way when it is set up once. If your report only ever looks at a single month, you can skip all of this.

If a report using these measures becomes slow, see [7 fixes in order of payoff](/blog/slow-power-bi-report-7-fixes-in-order-of-payoff/).

*Sources: [DAX Guide: TOTALYTD](https://dax.guide/totalytd/), [DAX Guide: SAMEPERIODLASTYEAR](https://dax.guide/sameperiodlastyear/), [Microsoft Learn: Use DAX time intelligence functions](https://learn.microsoft.com/en-us/training/modules/dax-power-bi-time-intelligence/2-functions). Date-table requirements are summarised from these and other guides. Table names and figures are illustrative.*
