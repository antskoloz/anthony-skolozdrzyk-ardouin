---
title: "DAX CALCULATE Explained: Filter Context in Plain English"
description: CALCULATE is the most important DAX function and the most confusing. Learn filter context, row context and context transition with simple examples.
pubDate: 2026-09-26T10:00:00.000+02:00
tags:
  - power bi
  - dax
  - calculate
  - data analytics
draft: true
---

> **Short answer:** Every number in a Power BI visual is calculated inside a *filter context*, the set of filters coming from slicers, rows, columns and other visuals. `CALCULATE` lets you change that context for one calculation: add a filter, replace one, or remove one. Understand that, and most of DAX stops feeling like magic.

If you've ever written a measure, dropped it in a table, and watched it return the same number on every row, you have met filter context without knowing its name. It is the single idea that separates "I can copy DAX from the internet" from "I can write it".

<!-- ANTHONY: add a real story here (a measure that returned the wrong number until you understood context) -->

This post explains it with one small model and four measures. The table and column names are illustrative.

## What is filter context?

Imagine a `Sales` table with `Amount`, `Product[Category]` and `Date[Year]`, and this measure:

```dax
Total Sales = SUM(Sales[Amount])
```

Put it in a table with `Category` on the rows. The measure is the same formula on every row, yet each row shows a different number. Why? Because before the formula runs, Power BI applies a filter for that row, for example `Category = "Bikes"`. The formula only sees the sales rows that survive.

That set of active filters is the filter context. [Microsoft's DAX documentation](https://support.microsoft.com/en-us/excel/context-in-dax-formulas) describes it as the set of values allowed in each column, based on the filters applied to the row or defined by filter expressions within the formula. Slicers, page filters, other visuals and row or column headings all feed into it.

The [SQLBI article on filter context](https://www.sqlbi.com/articles/filter-context-in-dax/) is the classic reference if you want to go deeper.

## What does CALCULATE do?

`CALCULATE` evaluates an expression in a context that you modify. The [Microsoft Learn reference](https://learn.microsoft.com/en-us/dax/calculate-function-dax) puts it in one line: it evaluates an expression in a context modified by filters.

The syntax is:

```dax
CALCULATE( <expression>, <filter1>, <filter2>, ... )
```

Here is a measure that always shows bike sales, no matter which category a row belongs to:

```dax
Bike Sales = CALCULATE( [Total Sales], Product[Category] = "Bikes" )
```

On the "Accessories" row, the outer filter says Accessories, but `CALCULATE` replaces it with Bikes for this measure. So every row shows the bike total. That looks odd until you realise it is how you build comparisons.

## How do I remove a filter?

The most common use is "ignore what the user selected". Say you want each category's share of the grand total:

```dax
Share of Total =
DIVIDE(
    [Total Sales],
    CALCULATE( [Total Sales], REMOVEFILTERS( Product[Category] ) )
)
```

The numerator respects the row's category. The denominator removes the category filter, so it returns the total across all categories. `REMOVEFILTERS` is the readable modern spelling of `ALL` when used as a filter modifier.

## What is row context, and why does it matter?

Row context is the *current row* when a formula is evaluated one row at a time. It exists in calculated columns and inside iterator functions such as `SUMX`. As SQLBI's [row and filter context article](https://www.sqlbi.com/articles/row-context-and-filter-context-in-dax/) notes, row context exists only in calculated columns or during an iteration, while filter context is set for the whole formula and restricts the rows visible in the model.

The trap: a row context does not filter anything by itself. If you write this in a calculated column on `Product`:

```dax
Category Sales = SUM(Sales[Amount])
```

every product gets the same grand total. The row context on `Product` doesn't reach the `Sales` table.

## What is context transition?

Wrap the same expression in `CALCULATE` and the problem disappears:

```dax
Category Sales = CALCULATE( SUM(Sales[Amount]) )
```

This is *context transition*. According to Microsoft's documentation, `CALCULATE` transitions row context into filter context, using the current row's column values as filters. The current product becomes a filter, so only that product's sales are summed.

It is also why measures behave differently from plain expressions inside an iterator. A measure reference has an implicit `CALCULATE` around it, so it triggers context transition automatically.

## What does a typical CALCULATE pattern look like?

Three patterns cover a large share of real reports:

```dax
-- 1. Add a filter
Paid Sales = CALCULATE( [Total Sales], Sales[Status] = "Paid" )

-- 2. Remove a filter (percent of total)
Share = DIVIDE( [Total Sales], CALCULATE( [Total Sales], REMOVEFILTERS( Product ) ) )

-- 3. Swap the time period
Sales Last Year = CALCULATE( [Total Sales], SAMEPERIODLASTYEAR( 'Date'[Date] ) )
```

The third pattern is how time intelligence works, which I cover in [YTD, YoY and rolling 12 months](/blog/power-bi-time-intelligence-ytd-yoy-rolling-12-months/).

## What mistakes should I watch for?

1. **Filtering a column when you meant a table.** A boolean filter like `Product[Category] = "Bikes"` replaces the filter on that column only. Other filters on the same table stay active.
2. **Forgetting the model matters.** Filters travel along relationships. If a filter doesn't reach your fact table, the relationship or the model shape is the problem, not your DAX. This is why I say [model first, calculations second](/blog/power-bi-design-model-first-then-calculation-groups/).
3. **Overusing calculated columns.** If the value depends on what the user selects, it must be a measure.
4. **Debugging by staring.** Put the measure in a table with the column you filter by, and add a second column showing the pieces.

My take: spend an afternoon on filter context before you learn a single new DAX function. It is the highest-return hour in the language. If you only build simple sums, you can skip `CALCULATE` for a while, but the day you need a percentage of total, you will wish you hadn't.

If you use an AI assistant to write DAX, checking that it respects filter context is part of the job. I wrote about where [Copilot helps and where it breaks](/blog/power-bi-copilot-what-it-can-and-cant-do_1/).

*Sources: [Microsoft Learn: CALCULATE](https://learn.microsoft.com/en-us/dax/calculate-function-dax), [Microsoft Support: Context in DAX formulas](https://support.microsoft.com/en-us/excel/context-in-dax-formulas), [SQLBI: Row context and filter context in DAX](https://www.sqlbi.com/articles/row-context-and-filter-context-in-dax/), [SQLBI: Filter context in DAX](https://www.sqlbi.com/articles/filter-context-in-dax/). Table names and figures are illustrative.*
