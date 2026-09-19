---
title: Why AI analysts fail on bad metric definitions
description: AI can write valid SQL in seconds, but it can't know which
  definition of revenue your CFO approved. Why a governed metrics layer matters,
  with benchmark data.
pubDate: 2026-09-19T20:11:00.000+02:00
tags:
  - text-to-sql
  - ai analytics
  - semantic layer
  - business intelligence
  - data governance
draft: false
---

> **Short answer:** Modern AI can write SQL that runs. It cannot know which definition of "revenue" or "active customer" your business has agreed on. Give it raw tables and it will return fast, confident, inconsistent numbers. Give it a governed metrics layer, with one definition per metric, and accuracy improves sharply. The bottleneck is your definitions, not the model.

If you have worked in analytics for a while, you have seen this: the same question, "how many customers did we have last quarter?", gets three different answers depending on who runs the query. An AI analyst does not fix that problem. It scales it, because it can produce a wrong answer in seconds, in perfect formatting, for anyone who asks.

This post explains where AI text-to-SQL breaks on real data, what a metrics layer contains, and how to let AI use it safely.

## Why does text-to-SQL look better in demos than in production?

Demos use a clean schema and an unambiguous question. Real warehouses have duplicate tables, legacy columns, soft-deleted rows, and a column called `amount` that means different things in different places.

The academic evidence points the same way. The Spider 2.0 benchmark contains 632 problems drawn from real enterprise database use cases, often with more than 1,000 columns per database. In the paper's abstract, the authors report that the o1-preview model "successfully solves only 21.3% of the tasks", compared with 91.2% on the earlier Spider 1.0 and 73.0% on BIRD.

*Source: Lei et al., [Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows](https://arxiv.org/abs/2411.07763). The paper dates from late 2024 and newer models score higher, so read it as evidence of the gap between clean benchmarks and messy enterprise data, not as today's leaderboard.*

Even the answer keys are disputed. A 2026 CIDR paper re-examined two popular benchmarks and reported annotation error rates of 52.8% for BIRD Mini-Dev and 66.1% for a Spider 2.0-Snow subset. When five leading agents were re-scored on corrected answers, rankings moved by up to three positions. The authors group the errors into categories that include schema misunderstandings, missing domain knowledge, and ambiguous questions. Those are the same problems your analysts face when a business term is not defined.

*Source: Jin et al., [Text-to-SQL Benchmarks are Broken: An In-Depth Analysis of Annotation Errors](https://www.vldb.org/cidrdb/papers/2026/p5-jin.pdf) (CIDR 2026).*

## How does an AI analyst get the SQL right and the answer wrong?

Here are five common ways. Each one produces a query that runs without error.

| Failure | What happens | Example |
| --- | --- | --- |
| **Grain mismatch** | A join repeats rows, so totals are inflated | Joining orders to line items and summing the order total once per item |
| **Time logic** | The wrong date drives the period | Order date vs. shipped date vs. recognised date |
| **Status filters** | Cancelled or refunded rows are included or excluded inconsistently | Is a refunded order still "revenue"? |
| **Entity definition** | The same word points to different things | A "customer" as a person, an account, or a paying account |
| **Money treatment** | Gross and net are mixed | Tax, discounts, shipping and currency handled differently per table |

The first one is the easiest to see in code:

```sql
-- Runs fine. Overstates revenue for any order with more than one item.
SELECT SUM(o.order_total) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id;
```

An experienced analyst spots the fan-out because they know the order total lives at order level. A model working from column names alone may not, and nothing in the result looks wrong.

## What does the evidence say about a metrics layer?

A metrics layer, often called a semantic layer, defines each metric once and lets tools query the definition instead of writing their own logic. dbt Labs published a benchmark in April 2026 comparing direct text-to-SQL with querying through its semantic layer, using an insurance dataset with 15 tables, 11 questions and 20 runs each.

| Model | Text-to-SQL | Semantic layer |
| --- | --- | --- |
| Claude Sonnet 4.6 | 90.0% | 98.2% |
| GPT-5.3 Codex | 84.1% | 100.0% |

The write-up puts the difference this way: "With text-to-SQL, failure looks like a plausible but incorrect answer. With the Semantic Layer, failure looks like an error message."

*Source: [Semantic Layer vs. Text-to-SQL: 2026 Benchmark Update](https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026), dbt Developer Blog.*

Two caveats matter. First, dbt Labs sells a semantic layer, so treat this as vendor evidence from one dataset, not an independent study. Second, the text-to-SQL runs loaded the whole schema as context, which the authors note is not practical for larger datasets. Still, the direction fits what analysts see in practice: constraining the model to approved definitions turns silent errors into visible ones.

## What should a metrics layer contain?

The tool matters less than the discipline. A semantic model in your BI tool, a dbt project, or even well-maintained views plus a shared document can work. What matters is that each metric has a definition card like this one (my suggested template, not a standard):

| Field | Example for "Net revenue" |
| --- | --- |
| **Name and plain-language definition** | Revenue from completed orders, after discounts and refunds, excluding tax and shipping |
| **Exact calculation** | The agreed formula and source tables |
| **Grain** | Order line |
| **Allowed dimensions** | Date, channel, product, country |
| **Filters and exclusions** | Test orders and internal accounts excluded |
| **Date logic** | Recognised on shipment date |
| **Owner** | A named person or team who approves changes |
| **Version history** | What changed, when, and why |

## How can I let AI use it safely?

This is a starting pattern based on my own experience, not a published standard:

1. **Point the AI at governed objects, not raw tables.** Expose the metrics layer and a small set of curated views.
2. **Build a set of golden questions.** Keep 20 to 50 questions with known, signed-off answers. Re-run them whenever you change the model, the prompt or the schema.
3. **Show the definition next to every answer.** If the answer says "Net revenue: 1.2m", the user should see what "net revenue" means and which filters applied.
4. **Log the generated SQL.** Someone should be able to audit any number back to its query.
5. **Fail loudly.** If a question falls outside the defined metrics, the system should say so instead of improvising. Route those cases to an analyst.

## Where is AI genuinely useful for analysts?

Plenty of places, as long as the output is reviewed. Exploration on unfamiliar data, drafting a first-pass query, explaining inherited SQL, documenting tables, and suggesting checks. dbt's own recommendation is similar: use a semantic layer when accuracy matters, such as board reporting, KPIs and OKRs, and fall back to text-to-SQL for ad hoc exploration.

The analyst's role shifts. Less time goes to writing every query, and more goes to owning definitions, reviewing outputs and deciding what "correct" means. That is the harder skill, and the one no model supplies for you.

## A 30-minute checklist for your own stack

- Pick your three most-used metrics. Can you find one written definition for each?
- Ask three colleagues to compute each metric. Do the numbers match?
- Do you know which date field drives each metric's period?
- Does each metric have a named owner?
- If an AI tool answered a question about them today, could you see the query it ran?

If the answers are "no", fix that before buying another AI analytics tool. For a marketing example of the same principle, where one number needs a clear definition and a way to test it, see [Attribution vs. Incrementality vs. MMM: Which to Use When](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/attribution-vs-incrementality-vs-mmm/).

## Frequently asked questions

**Does a better model fix this?**
Better models help. In dbt's 2026 benchmark, text-to-SQL accuracy was far higher than in its 2023 version. But a model cannot infer a business rule that is not written down anywhere.

**Do I need a special tool to build a metrics layer?**
No. A dbt project or a BI semantic model is the usual route, but the essential part is agreed definitions with owners, however you store them.

**Is text-to-SQL useless, then?**
No. It is useful for exploration and drafting, especially with a human reviewing. It is a poor fit for numbers that go to executives or auditors without a governed layer underneath.

**Where do I start?**
With your five most-quoted metrics. Write them down, agree them with the owners, and test AI answers against them.

## Sources

- [Lei et al., "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows"](https://arxiv.org/abs/2411.07763)
- [Jin et al., "Text-to-SQL Benchmarks are Broken: An In-Depth Analysis of Annotation Errors" (CIDR 2026)](https://www.vldb.org/cidrdb/papers/2026/p5-jin.pdf)
- [dbt Developer Blog: Semantic Layer vs. Text-to-SQL, 2026 Benchmark Update](https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026)

*Last reviewed: 19 September 2026.*
