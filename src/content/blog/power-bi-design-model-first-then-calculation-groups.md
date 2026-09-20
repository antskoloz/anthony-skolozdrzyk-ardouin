---
title: "Power BI design: model first, then calculation groups"
description: "A practical guide to Power BI design: star schema, calculation groups, field parameters and dashboard layout habits that keep reports fast and easy to maintain."
pubDate: 2026-09-20
tags: ["power bi", "data modeling", "dax", "dashboard design", "business intelligence"]
draft: true
---

> **Short answer:** A great Power BI dashboard is mostly decided before you draw a single chart. Get the star schema right, put your logic in a small set of explicit measures, and use calculation groups and field parameters to stop yourself from building the same thing forty times. Then keep the report page simple: the most important number top left, few visuals, consistent colors.

I've spent a lot of years looking at other people's reports, and the pattern is boring but reliable. The reports people love to use sit on a clean model. The ones people quietly stop opening are usually pretty on the surface and a mess underneath. So this post goes in that order: model, then the two features I think are under-used, then the page itself, then a way to check your work.

## Start with the model, not the canvas

Every visual in a report sends a query that filters, groups and summarizes. Microsoft's guidance on star schema is built on exactly that idea: dimension tables do the filtering and grouping, fact tables do the summarizing. Dimensions hold the things you describe (products, customers, dates) and are usually small. Facts hold the events (orders, balances, transactions) and grow over time.

In practice that gives you a few habits worth defending:

- Relationships run one-to-many, from dimension to fact, and filters flow in a single direction. Bidirectional filtering is something you turn on when you have a reason, not by default.
- Fact tables carry keys and numbers, not descriptive text. If a product name is repeated on ten million rows, it belongs in a Product table.
- Load every fact table at one consistent grain. A table that mixes daily and monthly rows will give you wrong totals that look perfectly fine.
- If you need two dates on the same fact table (order date and ship date, say), keep one active relationship and use inactive ones with `USERELATIONSHIP()` for the rest.

Microsoft is honest that this is "part science and part art" and that sometimes you break the rules on purpose. Fine. But break them knowingly, and write down why. That note will save the next person a lot of time, and that next person is often you in six months.

One more thing I do that isn't from the docs, just from experience: I keep the measures in their own clearly named place and give them readable names without abbreviations. It sounds cosmetic. It stops mattering the day someone new opens the model, or the day you point an AI assistant at it, which I wrote about in [why AI analysts fail on bad metric definitions](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/why-ai-analysts-fail-on-bad-metric-definitions/).

## Calculation groups: the hidden tip that removes half your measures

If you've ever built `Revenue`, `Revenue PY`, `Revenue YTD`, `Revenue YoY %`, and then done the same for margin, orders and average basket, you've met measure explosion. Ten base measures and five time variants is already sixty measures, and every one of them is a place for a bug.

Calculation groups fix this. Instead of writing the time logic into each measure, you write it once as a calculation item and let it wrap whatever measure the visual is using. The placeholder that makes it work is `SELECTEDMEASURE()`.

Here is the time intelligence example from Microsoft's documentation, slightly shortened. It lives in a calculation group table called "Time Intelligence" with a column "Time Calculation":

```dax
Current:
SELECTEDMEASURE()

YTD:
CALCULATE(SELECTEDMEASURE(), DATESYTD('Date'[Date]))

PY:
CALCULATE(SELECTEDMEASURE(), SAMEPERIODLASTYEAR('Date'[Date]))

YOY:
SELECTEDMEASURE()
    - CALCULATE(SELECTEDMEASURE(), 'Time Intelligence'[Time Calculation] = "PY")

YOY%:
DIVIDE(
    CALCULATE(SELECTEDMEASURE(), 'Time Intelligence'[Time Calculation] = "YOY"),
    CALCULATE(SELECTEDMEASURE(), 'Time Intelligence'[Time Calculation] = "PY")
)
```

Put "Time Calculation" on the columns of a matrix, your base measures on the rows, and you get every combination without writing a single extra measure. Add a new base measure tomorrow and it already has a prior year, a YTD and a growth rate.

You can create one directly in Power BI Desktop: open Model view and use the Calculation group button, or script it in TMDL view. Tabular Editor and Visual Studio also work if you prefer them.

### The details that catch people out

Calculation groups come with rules, and most of the frustration I hear about them comes from not knowing these up front.

**They only work on explicit measures.** The moment you add a calculation group, Power BI asks you to discourage implicit measures. The summation symbol disappears from the fields pane and you can't drop a raw column into a visual as a value anymore. Anything you want to use has to be a measure you wrote.

**Measures become variant.** With a calculation group in the model, Power BI treats all measures as the variant data type. That's mostly invisible, but text measures used for dynamic titles or dynamic format strings can throw the error "Cannot convert value of type Text to type Numeric". Microsoft's suggested guard is to check `ISNUMERIC(SELECTEDMEASURE())` before doing any math inside a calculation item.

**Precedence decides the order.** If you have more than one calculation group, say time intelligence and currency conversion, the precedence property sets which one wraps which. The documentation's example makes it clear: a measure of 10 with a "plus 2" group at precedence 100 and a "times 2" group at precedence 200 gives (10 + 2) × 2 = 24, not 22. Test this before you trust it.

**Formatting can be dynamic too.** A YoY % item should show as a percentage even if the base measure is a currency amount. Calculation items support dynamic format strings, and `SELECTEDMEASUREFORMATSTRING()` lets an item fall back to whatever format the underlying measure already has.

**Know the unsupported list.** Microsoft's Analysis Services documentation lists object-level security, row-level security, detail rows expressions and Smart Narrative visuals as not supported with calculation groups. Check that against your setup before you refactor a model that depends on any of them.

There's also a pair of optional properties, `noSelectionExpression` and `multipleOrEmptySelectionExpression`, that control what a calculation group returns when nothing is selected or the user selects several items. Setting a sensible default here is what stops a matrix from silently showing a total nobody understands.

## Field parameters: let readers switch, so you build less

The second under-used feature is field parameters. They let a report reader swap the measure or the dimension shown in a visual from a slicer. One chart can show revenue, orders or margin, and be split by region, product or channel, without you building nine near-identical charts.

You create one from the Modeling tab: New parameter, then Fields, and choose what to include. You can mix measures and dimensions in the same parameter, which is handy for dynamic tables.

The limits are worth knowing before you design a page around them. There's no "none" option, so a reader can't clear the selection. They can't be used as linked fields for drill-through or tooltip pages. They aren't supported with AI visuals or Q&A. And like calculation groups, they need explicit measures rather than implicit ones.

A rule I follow: use calculation groups for changing *how* a measure is calculated (period, currency, scenario), and field parameters for changing *which* measure or attribute is on screen. They complement each other well, and mixing the two jobs into one feature is usually where things get confusing.

## Design the page for one reader

Microsoft's own guidance on dashboard design is short and I think it's right. Most of it fits in a few sentences.

Start with your audience. Ask what decisions they make and which few numbers they need for it. Put the highest-level information top left and add more detail as the eye moves left to right and top to bottom. Try to keep everything on one screen without scrolling. Remove anything the reader doesn't need to monitor. Make the important number big, with a card visual, and give every chart some context.

On chart choice, the documentation recommends bar and column charts for comparing values, pie charts only for part-to-whole with fewer than eight categories, and gauges for status against a goal. It advises avoiding 3D charts and donut charts because they're hard to read.

Consistency does more work than people expect. Use the same color for the same dimension value everywhere, keep axis scales and ordering consistent, keep time frames clearly separated, and don't mix precision levels on one page. Show "3.4 million" rather than "3,400,000". And sort by the measure when you want people to see the biggest and smallest, by the axis when they need to find a specific category.

I'd add one thing from my own habit: write the question the page answers as a sentence, and if you can't, split the page. A page that answers three questions usually answers none of them well.

## Check your work with Performance Analyzer

A design that takes twelve seconds to load isn't a good design. Power BI has a built-in tool for this that a lot of report builders never open. In Desktop, go to the Optimize ribbon and select Performance Analyzer, start recording, and click around the report the way a user would.

For every visual, it breaks the time into DAX query, visual display, and other, all in milliseconds. It also shows a DirectQuery time if you use that storage mode, and there's a preview category for evaluating field parameters. If the DAX query is the slow part, look at the measure and the model. If the visual display is the slow part, you probably have too many visuals or too much detail on the page. You can export the results as a JSON file to compare before and after a change.

Do this after every meaningful change, and especially after adding a calculation group, since a poorly written item gets applied to every measure it touches.

## A short checklist

1. Is the model a star schema with one-to-many relationships and single-direction filters?
2. Are all the numbers people use written as explicit, well-named measures?
3. Have you replaced repeated time or scenario logic with a calculation group, and tested precedence?
4. Could a field parameter replace a set of duplicate visuals?
5. Can a new reader say in one sentence what each page is for?
6. Have you run Performance Analyzer and looked at the slowest visual?

For keeping changes to a model like this reviewable over time, my [Git, GitHub and LLM workflow for Power BI DAX and M](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/git-github-llm-power-bi-dax-m-workflow/) goes into the version control side.

## Frequently asked questions

**Do calculation groups work in Power BI Desktop, or do I need Tabular Editor?**
Both work. Desktop has a Calculation group button in Model view and a TMDL view for scripting. Tabular Editor and Visual Studio are alternatives.

**Why did my visuals break after I added a calculation group?**
Most often because you were using implicit measures, which calculation groups block, or because a text measure hit the variant data type issue. Convert to explicit measures and guard numeric logic with `ISNUMERIC()`.

**What's the difference between a calculation group and a field parameter?**
A calculation group changes how a measure is calculated. A field parameter changes which measure or field is displayed. Use them together, but for different jobs.

**Should I always use a star schema?**
It's the right default, and Microsoft recommends it. Microsoft also says you can break from it when there's a good reason. Just know why you did.

## Sources

- [Microsoft Learn: Calculation groups in Power BI](https://learn.microsoft.com/en-us/power-bi/transform-model/calculation-groups)
- [Microsoft Learn: Calculation groups in Analysis Services tabular models](https://learn.microsoft.com/en-us/analysis-services/tabular-models/calculation-groups?view=asallproducts-allversions)
- [Microsoft Learn: Understand star schema and the importance for Power BI](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema)
- [Microsoft Learn: Use field parameters to change visuals in Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/power-bi-field-parameters)
- [Microsoft Learn: Tips for designing a great Power BI dashboard](https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips)
- [Microsoft Learn: Use Performance Analyzer to examine report element performance](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-performance-analyzer)

*Last reviewed: 20 September 2026.*
