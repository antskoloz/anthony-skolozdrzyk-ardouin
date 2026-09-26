---
title: "Power BI Star Schema for Beginners: A Practical Walkthrough"
description: What a star schema is, why Microsoft recommends it for Power BI,
  and how to reshape a flat table into facts and dimensions step by step.
pubDate: 2026-09-26T08:54:00.000+02:00
tags:
  - power bi
  - star schema
  - data modeling
  - beginners
draft: false
---
> **Short answer:** A star schema splits your data into one central *fact* table (the events you count, such as sales) surrounded by *dimension* tables (the things you slice by, such as product, customer and date). Microsoft recommends it for Power BI because it gives simpler DAX, faster reports and smaller files.

Most Power BI reports start life as one giant table exported from somewhere. It works for a week. Then someone asks for a filter that spans two sources, a measure returns nonsense, and the file takes a minute to open.

I've experienced it first-hand when the granularity of table changed and that the business partners wanted to introduce a second-level of dimension aggregation. 

The fix is almost always the same: reshape the data before you build anything fancy. Here is what that means in practice. The tables and columns are illustrative.

## What is a star schema?

Draw it and you see the name. In the middle sits a **fact table**. Around it are **dimension tables**, each connected by a single line:

```
            Product
               |
Customer --- Sales --- Date
               |
             Store
```

* **Fact tables** hold events: one row per order line, click or payment. They contain numbers you summarise (`Amount`, `Quantity`) and keys pointing to the dimensions.
* **Dimension tables** hold descriptions: one row per product, customer, day or store. They contain the columns you filter and group by (`Category`, `Country`, `Month`).

[Microsoft's guidance on star schema](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema) puts the roles simply: dimension tables handle filtering and grouping, and fact tables handle summarisation.

## Why does Power BI care?

Three reasons show up in Microsoft's documentation and in day-to-day work.

1. **It matches the engine.** The data structures in a star schema suit the column-store approach of the VertiPaq engine behind Power BI, which compresses data well and keeps memory use low.
2. **Filters flow one way, predictably.** A filter on a dimension travels down the relationship to the fact table. There is no ambiguity about which path a filter takes.
3. **DAX gets simpler.** Measures sum a fact column, and filters come from dimensions. Many "why is my measure wrong?" problems disappear.

I make the same argument from the design side in [Power BI design: model first, then calculation groups](/blog/power-bi-design-model-first-then-calculation-groups/).

## How do I turn a flat table into a star?

Say you have one table, `SalesFlat`, with columns like `OrderID`, `OrderDate`, `CustomerName`, `Country`, `ProductName`, `Category`, `Amount`. Here is the process I follow.

**Step 1: Decide the grain of the fact table.** What does one row represent? "One order line" is a good answer. If you can't say it in one sentence, stop and find out.

**Step 2: Pull out each dimension.** In Power Query, duplicate `SalesFlat` and keep only the descriptive columns for one entity, for example `ProductName` and `Category`. Remove duplicates. Add an integer key if the source has none.

**Step 3: Slim the fact table.** Keep the keys (`ProductKey`, `CustomerKey`, `DateKey`) and the numeric columns. Remove the descriptive text columns you moved out.

**Step 4: Add a proper date table.** A dedicated `Date` table with one row per day, marked as the date table, is required for time intelligence. I show why in [the time intelligence post](/blog/power-bi-time-intelligence-ytd-yoy-rolling-12-months/).

**Step 5: Create relationships.** Each should be one-to-many, from the dimension (one side) to the fact (many side), with single-direction filtering. Hide the keys in the report view so nobody drags them into a visual.

## What are the common beginner mistakes?

* **Keeping everything in one wide table.** It is tempting and it is the root of most slow models.
* **Linking dimensions to each other.** That turns the star into a snowflake and makes filters harder to trace. Flatten it where you can.
* **Many-to-many relationships everywhere.** Microsoft's [many-to-many guidance](https://learn.microsoft.com/en-us/power-bi/guidance/relationships-many-to-many) exists because these relationships are easy to misuse. Reach for a bridge table or a proper dimension first.
* **Bidirectional filtering as a fix.** It often hides a modelling problem and can cause ambiguity. Turn it on deliberately, not by reflex.
* **Duplicated keys in a dimension.** A "unique" product list with two rows for one key breaks the one-to-many relationship. Check it.

## Is a star schema always the right answer?

No. For a quick one-off with a few thousand rows and one user, a single table is fine, and building a model for it is ceremony. The trouble starts when the report grows, more people use it, or a second source arrives. Then the cost of not having a model shows up all at once.

That is my opinion, and some teams get away with wide tables for a long time. If yours does, keep it.

## What should I build next?

Once the model is clean, calculations become the interesting part. A good next step is [filter context and CALCULATE](/blog/dax-calculate-explained-filter-context-in-plain-english/), because in a star schema they behave exactly as you would hope.

*Sources: [Microsoft Learn: Understand star schema and the importance for Power BI](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema), [Microsoft Learn: Many-to-many relationship guidance](https://learn.microsoft.com/en-us/power-bi/guidance/relationships-many-to-many). Table and column names are illustrative.*
