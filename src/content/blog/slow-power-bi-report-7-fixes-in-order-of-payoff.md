---
title: "Slow Power BI Report? 7 Fixes in Order of Payoff"
description: A slow Power BI report usually has a few clear causes. Measure with Performance Analyzer first, then apply these seven fixes, biggest payoff first.
pubDate: 2026-09-26T10:30:00.000+02:00
tags:
  - power bi
  - performance
  - optimization
  - data modeling
draft: true
---

> **Short answer:** Measure first with Performance Analyzer, so you know whether the problem is the visuals, the DAX or the data model. Then fix in this order: cut unused data, get to a star schema, simplify the visuals on the page, tidy your measures, and only after that consider heavier options like aggregations.

Nobody complains about a report that is fast. The complaints start when a slicer takes ten seconds to respond and the sales director says the word "unusable" in a meeting.

<!-- ANTHONY: add a real story here (a slow report you sped up, and what turned out to be the cause) -->

Before you rewrite a single measure, find out what is actually slow. The order below is my own experience-based ranking, not an official one. Where Microsoft documents the approach, I link to it.

## How do I find out what is slow?

Use **Performance Analyzer**. In Power BI Desktop, open the Optimize ribbon and select Performance Analyzer, then start recording and click around the report. [Microsoft's documentation](https://learn.microsoft.com/en-us/power-bi/create-reports/performance-analyzer) explains that it shows the load duration of each visual, including when visuals reload after an interaction such as a slicer change.

For each visual it breaks time into three parts:

- **DAX query:** how long the calculation took. Slow here means look at the measure or the model.
- **Visual display:** how long it took to draw. Slow here means too many marks, too many visuals, or a heavy custom visual.
- **Other:** waiting for other visuals or work to finish.

Microsoft's [monitoring guidance](https://learn.microsoft.com/en-us/power-bi/guidance/monitor-report-performance) also points out that the data model and refresh can be the issue, so it is worth knowing which of those you are dealing with. Copy the DAX query out of Performance Analyzer and run it in DAX Studio or a query view if a specific visual stands out.

## What are the seven fixes, in order?

### 1. Remove what you don't use

Unused columns and rows cost memory and refresh time. Delete columns nobody references, especially long text and high-cardinality ones such as free-text comments, unique IDs you never filter on, and timestamps down to the second when a date would do. Filter out history you never report on.

This is the cheapest fix and often the biggest.

### 2. Reshape into a star schema

A wide, flat table or a tangle of relationships slows everything down and complicates DAX. If you haven't already, follow [the star schema walkthrough](/blog/power-bi-star-schema-for-beginners/). Microsoft's [star schema guidance](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema) notes that this shape suits the VertiPaq engine and keeps memory low.

### 3. Do the work upstream

Aggregating, joining and cleaning in the source or in Power Query means the model does less at query time. See [Power Query vs DAX](/blog/power-query-vs-dax-where-each-step-belongs/), and keep query folding intact so the database does the heavy lifting.

### 4. Put fewer things on the page

Every visual sends its own queries. A page with twenty visuals fires twenty queries whenever a slicer moves. Try:

- Fewer visuals per page, and split the story across pages.
- Fewer slicers, or a slicer panel that applies changes on demand.
- Removing detail tables with thousands of rows from the landing page.

Performance Analyzer will show the guilty visual by name.

### 5. Simplify measures

Look for measures that repeat the same expression, wrap everything in nested iterators, or scan a huge table when a filter on a dimension would do. Store repeated pieces in variables:

```dax
Sales vs LY =
VAR CurrentValue = [Total Sales]
VAR LastYear = CALCULATE( [Total Sales], SAMEPERIODLASTYEAR( 'Date'[Date] ) )
RETURN DIVIDE( CurrentValue - LastYear, LastYear )
```

Variables are evaluated once and reused, which is both faster and easier to read. If your DAX feels confusing at this point, revisit [filter context and CALCULATE](/blog/dax-calculate-explained-filter-context-in-plain-english/).

### 6. Watch out for auto date/time and high-cardinality columns

Power BI can create hidden date tables for every date column when the auto date/time option is on. In larger models this adds size for no benefit once you have a proper date table. Turn it off, and use one shared `Date` table.

### 7. Consider aggregations and incremental refresh

If you have handled everything above and the model is still large, then look at aggregation tables, incremental refresh, or Import versus DirectQuery choices. These are powerful and also add complexity, which is why they come last.

## What if the DAX query is fast and the visual is slow?

Then the problem is rendering. Reduce the number of data points, replace a custom visual with a built-in one, or turn off animation and effects. A table with 50,000 rows is not a report.

## How do I keep it from getting slow again?

- Re-run Performance Analyzer before publishing a change, and after.
- Keep a short list of the slowest visuals and what they cost.
- Review the model when a new source is added, not when users complain.

My opinion: most slow reports are slow because of the model, not the DAX. People often spend a week tuning a measure when deleting three columns would have done more. If your report only has a few thousand rows and one user, none of this matters yet.

*Sources: [Microsoft Learn: Use Performance Analyzer to examine report performance](https://learn.microsoft.com/en-us/power-bi/create-reports/performance-analyzer), [Microsoft Learn: Monitor report performance in Power BI](https://learn.microsoft.com/en-us/power-bi/guidance/monitor-report-performance), [Microsoft Learn: Optimization guide for Power BI](https://learn.microsoft.com/en-us/power-bi/guidance/power-bi-optimization), [Microsoft Learn: Star schema guidance](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema). The ranking of fixes is my own judgement, not an official order.*
