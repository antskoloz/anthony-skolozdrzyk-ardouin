---
title: "KPI Dashboard Best Practices: Build One People Actually Open"
description: "Most dashboards get built, launched and forgotten. Design for decisions, keep the metric count low, define every number, keep data fresh and review usage."
pubDate: 2026-09-26T12:30:00.000+02:00
tags:
  - dashboards
  - kpi
  - power bi
  - data visualization
draft: true
---

> **Short answer:** Start from the decisions the dashboard should support, not from the data you happen to have. Show a handful of KPIs, define each one, make the most important number obvious in a few seconds, keep the data fresh automatically, and check who really uses it. A dashboard nobody opens is just an expensive hobby.

Every company has a graveyard of dashboards. Built with enthusiasm, presented once, opened by three people, then quietly abandoned. The cause is rarely the tool. It is almost always that nobody decided what the dashboard was for.

<!-- ANTHONY: add a real story here (a dashboard that was widely used, or one that nobody opened, and why) -->

Here are the practices I come back to. They match what most dashboard guides say, and where I add my own opinion, I flag it. The examples are illustrative.

## What question does the dashboard answer?

Guides such as [ClearPoint's KPI dashboard best practices](https://www.clearpointstrategy.com/blog/kpi-dashboard-best-practices) make the same point: the most common mistake is starting with "what should we track?" The better question is "what decisions does this dashboard need to support?"

Write one sentence before you open any tool:

> "This dashboard helps the e-commerce team decide, each Monday, where to spend the week's optimisation effort."

If you can't write that sentence, you aren't ready to build.

## How many KPIs should it have?

Fewer than you think. Several guides suggest keeping each dashboard to somewhere around five to fifteen KPIs, and some recommend a stricter five to seven that connect to actions someone can take. The exact number is less important than the test: for each KPI, ask "if this moved, what would someone do?" If nobody would do anything, remove it.

Put the most important number where the eye lands first. A viewer should grasp the headline in a few seconds.

## Who is it for?

Different roles need different views. An executive wants a few numbers and a trend. A marketing analyst wants campaign detail. Building one dashboard for everyone tends to serve nobody. Make separate pages or separate reports, and name them by audience.

## How do I design it?

- **Consistency.** Use one visual language for colour, scale and layout, so viewers don't have to relearn how to read each chart.
- **Context on every number.** Compare with a target, last period or last year. A bare "1,240 orders" tells you little. For the DAX behind this, see [time intelligence](/blog/power-bi-time-intelligence-ytd-yoy-rolling-12-months/).
- **Colour with meaning.** Use red and green sparingly and check they are readable for colour-blind viewers. Grey for the rest.
- **Headline titles.** Say what the chart shows, and label units and time periods.
- **Whitespace.** Crowding is not thoroughness.
- **Tell the story.** Put the summary at the top and the detail underneath. See [data storytelling](/blog/data-storytelling-for-non-technical-stakeholders/).

## How do I keep the numbers trusted?

Trust is what keeps people coming back, and it is fragile.

1. **Define every KPI** in a [metric definition doc](/blog/metric-definition-doc-with-a-template/), and link to it from the dashboard.
2. **Show "last refreshed".** A timestamp answers half of all support questions.
3. **Automate the refresh.** Guides consistently warn that manual updates lapse within months, the data goes stale, and leadership stops trusting the view. Automate it or the dashboard will die.
4. **Reconcile.** Check a headline number against a trusted source regularly.
5. **Watch data quality.** [Duplicates](/blog/find-and-fix-duplicate-rows-in-sql/) and wrong joins are quiet dashboard killers.

## Should it be built in Power BI?

Power BI is a strong option if your data is modelled well. A clean [star schema](/blog/power-bi-star-schema-for-beginners/) makes measures simple and the report faster. If the report is slow, people stop opening it, so see [7 fixes in order of payoff](/blog/slow-power-bi-report-7-fixes-in-order-of-payoff/). For choosing between tools, see [Excel vs SQL vs Power BI](/blog/excel-vs-sql-vs-power-bi-how-to-choose/).

## How do I know whether anyone uses it?

Measure it. Power BI and most other tools can show view counts and users. Set a review every quarter:

- Who opened it? How often?
- Which pages are never viewed? Remove them.
- Which questions still come to you by email? Add or fix those.
- Is any KPI unchanged for months? It may not be a useful KPI.

Retire dashboards that nobody uses. Deleting is part of the job.

## What are the common mistakes?

1. **Building for the data, not the decision.**
2. **Thirty KPIs on one page.**
3. **No definitions,** so two people read the same number differently.
4. **No owner.** Somebody must be responsible for the numbers and the refresh.
5. **Launch and leave.** Then it is stale within a quarter.
6. **Chart junk.** Decoration is not insight.

My opinion: the best dashboard is often smaller than the one requested. Ask for the one decision it must support, and build for that first. If you only need a weekly number for yourself, a table in a spreadsheet is a perfectly good dashboard.

*Sources: [ClearPoint Strategy: KPI Dashboard Best Practices](https://www.clearpointstrategy.com/blog/kpi-dashboard-best-practices), [insightsoftware: Best practices for designing and building a great KPI dashboard](https://insightsoftware.com/blog/best-practices-for-designing-and-building-a-great-kpi-dashboard/), [Domo: KPI Dashboard Guide](https://www.domo.com/learn/article/kpi-dashboards). The KPI count range is a common rule of thumb in these guides, not a proven threshold. Examples are illustrative.*
