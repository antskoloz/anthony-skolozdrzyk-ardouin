---
title: "Metric Definition Doc: What to Write Down (With a Template)"
description: "Stop dashboard debates with a one-page metric definition. Includes a copy-paste template, a filled-in example and the owner, grain and exclusion rules that matter."
pubDate: 2026-09-26T12:00:00.000+02:00
tags:
  - metrics
  - kpi
  - data governance
  - data analytics
draft: true
---

> **Short answer:** A metric definition is a one-page record of what a number means: its plain-language definition, formula, grain, inclusions and exclusions, source, owner and how you check it. Write one for every metric that appears in a report, and the "why doesn't your number match mine?" meetings mostly disappear.

Two dashboards, one metric name, two different numbers. Everyone in the room has been there. Nobody is lying, and nobody is wrong in their own definition. The problem is that the definition lived in someone's head.

<!-- ANTHONY: add a real story here (a meeting or report where the same metric had two values, and how it was resolved) -->

This is the human side of the semantic-layer idea in [what a semantic layer is](/blog/semantic-layer-for-ai-what-it-is-and-why-analytics-needs-one/). Whether or not you ever buy a tool, you can write the definitions down this week. The examples are illustrative.

## What belongs in a metric definition?

KPI-definition guides differ in detail, but they converge on the same core. The [ProsperSpark KPI definition guide](https://www.prosperspark.com/kpi-definition-template-guide/), for example, describes a definition as including the KPI name, business meaning, formula, source systems, inclusions, exclusions, ownership, refresh timing and validation steps. Other sources add grain, cutoff rules and approval status.

My version keeps it to what people actually fill in:

| Field | What to write |
| --- | --- |
| **Name** | The one name everyone uses. List aliases too. |
| **Plain-language definition** | One or two sentences a non-analyst can understand. |
| **Formula** | The exact calculation, with numerator and denominator. |
| **Grain** | What one row represents, and the time period (day, week, month). |
| **Includes / excludes** | Refunds? Test accounts? Internal orders? Cancelled items? |
| **Source** | Which table or system is the source of truth. |
| **Time rules** | Time zone, week start, fiscal calendar, cutoff time. |
| **Owner** | A named person, not a team. |
| **Refresh** | How often the number updates. |
| **How to check it** | A reconciliation: "should equal finance's monthly report within 0.5%". |
| **Known gotchas** | Where people trip up. |
| **Status and date** | Draft, approved, deprecated, and when it was last reviewed. |

Some guides separate two owners: a business owner who owns the meaning and a technical owner who maintains the logic. I like that split, because arguments about meaning and arguments about a bug are different arguments.

## What does a filled-in example look like?

Here is "Active customers", written the way I would want to read it:

```markdown
# Active customers

**Definition:** Customers who placed at least one paid order in the last 90 days.

**Formula:** COUNT(DISTINCT customer_id)
  WHERE status = 'paid' AND order_date >= (report_date - 90 days)

**Grain:** One value per reporting date (daily snapshot).
**Includes:** Paid orders, all channels.
**Excludes:** Test accounts (is_test = true), fully refunded orders,
  employee orders.
**Source:** warehouse.orders joined to warehouse.customers.
**Time rules:** Europe/Berlin day boundaries. Weeks start Monday.
**Owner:** Head of Growth (meaning), Data Analyst on duty (logic).
**Refresh:** Daily at 06:00.
**Check:** Matches the CRM "active" segment within 1%.
**Gotchas:** Customers with only a refunded order do not count.
  Not the same as "logged in" users.
**Status:** Approved 2026-09-01. Review every 6 months.
```

That took ten minutes to write and would have settled at least one meeting I remember.

## How do I get people to agree?

The template is easy. Agreement is the hard part. What has worked for me:

1. **Start with disagreements.** Find the two dashboards with different numbers for the same name. Those are the most valuable definitions to write first.
2. **Draft it, then ask.** A concrete draft is easier to correct than a blank page.
3. **Get the business owner to sign off in writing,** even by email.
4. **Give the two versions different names** if both are legitimate. "Active customers (90d)" and "Monthly buyers" can both exist. Two things sharing one name is the real problem.
5. **Put the definition where people look:** in the report itself, as a tooltip or a footnote, not only in a wiki.

## Where do I keep the definitions?

Somewhere with history and one obvious address: a shared document, a repo, or a data catalogue. A Git repository is a good fit if your team is comfortable with it, since every change has an author and a date. I make that argument for Power BI in [Git and an LLM for Power BI](/blog/git-github-llm-power-bi-dax-m-workflow/).

Then make the logic match. In Power BI that means one measure per definition, following the [model-first approach](/blog/power-bi-design-model-first-then-calculation-groups/). In SQL it means one view or CTE, not twenty copies. Check that the docs and the code still agree, whenever either one changes.

## What are the common mistakes?

- **Writing definitions nobody reads.** Link them from the dashboard.
- **No owner.** Definitions drift when nobody is responsible.
- **Too many fields.** If the template takes an hour, it won't get filled in. Start with definition, formula, exclusions, owner.
- **Never reviewing.** Business rules change. Put a review date on every entry.
- **Ignoring AI.** If you use an assistant to write queries, these documents are exactly the context it needs, as I describe in [prompting an LLM for SQL you can trust](/blog/prompting-an-llm-for-sql-you-can-trust/).

My opinion: a mediocre definition that is written down and owned beats a perfect one that lives in a head. If you have only three metrics and one reader, a comment at the top of the query is fine.

*Sources: [ProsperSpark: KPI Definition Guide](https://www.prosperspark.com/kpi-definition-template-guide/), [PowerMetrics: KPI vs Metrics vs Measures](https://www.powermetrics.app/guides/metrics-measures-kpis-goals). The template and the example metric are illustrative.*
