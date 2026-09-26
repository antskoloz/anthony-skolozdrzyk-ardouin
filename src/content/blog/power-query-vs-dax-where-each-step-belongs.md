---
title: "Power Query vs DAX: Where Each Step Belongs"
description: Not sure whether to clean data in Power Query or calculate in DAX? Use this simple rule, with examples for calculated columns, measures and the M language.
pubDate: 2026-09-26T10:20:00.000+02:00
tags:
  - power bi
  - power query
  - dax
  - data modeling
draft: true
---

> **Short answer:** Shape and clean the data in Power Query, as far upstream as you can. Calculate business numbers in DAX measures, because they respond to what the user selects. Use a DAX calculated column only when the value is fixed per row and you need to filter or group by it.

Every Power BI beginner asks the same thing sooner or later: "I can do this in Power Query *and* in DAX. Which one should I use?" The honest answer is that they do different jobs, and the confusion comes from the small overlap between them.

<!-- ANTHONY: add a real story here (a step you put in the wrong layer, and the cost) -->

Here is how I decide. The examples are illustrative.

## What is the difference between Power Query and DAX?

**Power Query** (the M language) runs when the data is refreshed. It fetches, cleans and reshapes data before it reaches the model. Think of it as the kitchen where ingredients get prepared.

**DAX** runs when someone looks at the report. It calculates values in response to filters, slicers and clicks. Think of it as the calculator on the table that answers "how much, right now, for this selection?".

One popular way to remember it: M is for *mashup*, DAX is for *data analysis*. The [Towards Data Science article on M vs DAX](https://towardsdatascience.com/power-bi-m-vs-dax-vs-measures-4c77ae270790-2/) describes beginners who use DAX to clean data, like a calculated column to fix a typo, or M for complex maths such as a year-over-year percentage, and end up with slow, brittle reports.

## What is Roche's Maxim?

Matthew Roche coined a rule that is widely repeated in the Power BI world: **transform your data as far upstream as possible, and as far downstream as necessary.**

Read it as a ladder:

1. Fix it in the **source** (database or file) if you can.
2. Otherwise fix it in **Power Query**.
3. Only calculate in **DAX** what genuinely depends on the report selection.

The reason is simple. Work done upstream is done once, at refresh, and every report benefits. Work done in DAX is repeated every time a visual renders.

## Which tool for which task?

| Task | Best place | Why |
| --- | --- | --- |
| Remove duplicates, fix types, rename columns | Power Query | Cleaning, done once at refresh |
| Split "First Last" into two columns | Power Query | Row-level reshaping |
| Merge two tables or append files | Power Query | Data shaping |
| Unpivot a wide table into a tall one | Power Query | Only M does this well |
| Total sales, average order value, margin % | DAX measure | Must respond to filters |
| Year-over-year, running total, % of total | DAX measure | Depends on filter context |
| A "size band" per customer used on an axis | Calculated column (or Power Query) | Fixed per row, used to group |

## What is the difference between a measure and a calculated column?

This is the part that trips people up inside DAX itself.

- A **calculated column** is computed row by row when you refresh, and its values are stored in the model. That increases model size and memory use.
- A **measure** is stored as a formula and computed only when it is used in a report, in the context of the visual.

So if the answer changes when someone clicks a slicer, it must be a measure. If it never changes for a given row, a column can work, but ask whether Power Query could produce it instead. A column made upstream compresses better than one made in DAX. SQLBI's [comparison of calculated columns and measures](https://www.sqlbi.com/articles/calculated-columns-and-measures-in-dax/) covers the mechanics in depth, and [endjin's article](https://endjin.com/blog/measures-vs-calculated-columns-in-dax) is a good plain-English second read.

Here is the classic mistake:

```dax
-- Calculated column (wrong tool): a profit margin per row, then averaged
Margin % = DIVIDE(Sales[Profit], Sales[Amount])
```

Averaging row-level percentages gives a different answer from dividing total profit by total amount. The correct number is a measure:

```dax
Margin % = DIVIDE( SUM(Sales[Profit]), SUM(Sales[Amount]) )
```

## What is query folding and why should I care?

When Power Query can translate your steps into SQL and let the source database do the work, that is called query folding. It is fast because the database filters and aggregates before sending data. Certain steps break folding, and everything after them runs slowly on your machine.

The practical rule: put the steps that fold (filtering, removing columns, simple joins) first, and check in Power Query whether "View Native Query" is still available after each step. If it greys out, that step broke folding.

## What should I do when I'm unsure?

A quick three-question test:

1. **Does the answer depend on what the user selects?** Yes: DAX measure.
2. **Is it cleaning or reshaping the raw data?** Yes: Power Query.
3. **Is it a fixed per-row label used for slicing?** Prefer Power Query. Use a calculated column only if the logic needs the model.

My opinion: default to Power Query for anything that isn't a measure. It is easier to audit, and it keeps the model lean. That said, if you don't own the query and can't change the source, a calculated column is an acceptable compromise.

This division of labour is also a good way to work with an LLM. Power Query and DAX both live as text, which is what makes the [Git and LLM workflow](/blog/git-github-llm-power-bi-dax-m-workflow/) possible. And once your model is a clean star, as in [Power BI star schema for beginners](/blog/power-bi-star-schema-for-beginners/), the split between M and DAX gets much easier to see.

*Sources: [Towards Data Science: Power BI, M vs. DAX and Measures vs. Calculated Columns](https://towardsdatascience.com/power-bi-m-vs-dax-vs-measures-4c77ae270790-2/), [SQLBI: Calculated columns and measures in DAX](https://www.sqlbi.com/articles/calculated-columns-and-measures-in-dax/), [endjin: Measures vs calculated columns in DAX](https://endjin.com/blog/measures-vs-calculated-columns-in-dax). Roche's Maxim is attributed to Matthew Roche. Table and column names are illustrative.*
