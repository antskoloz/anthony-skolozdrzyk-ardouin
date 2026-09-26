---
title: "AI for Data Analysts: Which Tasks to Hand Over, Which to Keep"
description: A practical split of analyst work into tasks AI does well, tasks it can help with under supervision, and tasks that should stay yours, with examples.
pubDate: 2026-09-26T11:40:00.000+02:00
tags:
  - ai for analysts
  - career
  - workflow
  - data analytics
draft: true
---

> **Short answer:** Hand AI the repetitive, checkable work: boilerplate code, first drafts, summaries, cleaning routines, and explaining other people's queries. Keep the judgment work: framing the question, defining metrics, choosing what matters, and deciding what the business should do. When in doubt, ask whether you could check the output faster than you could produce it.

"Will AI replace data analysts?" gets asked at every meetup, usually with more heat than light. A more useful question for your Monday morning is smaller: which of my tasks should I hand over this week, and which should I not?

<!-- ANTHONY: add a real story here (a task you handed to AI that went well, or one you took back) -->

Here is the split I use. It reflects my own experience and what surveys of the field say, and I mark the difference.

## What does the research say AI can do?

Summaries of the topic, such as [Databricks' overview of AI in analytics](https://www.databricks.com/blog/how-ai-transforming-data-analytics), describe AI as good at automating repetitive analytical work: cleaning data, building routine reports, writing repetitive queries, preparing datasets, generating summaries and spotting patterns. The same sources describe the human side as framing problems, applying organisational context, questioning findings and translating insight into decisions.

That matches my experience, with one addition: the dividing line is less about the task and more about **how easily you can check the result**.

## Which tasks should I hand over?

These are low-risk and easy to verify.

- **Boilerplate SQL and code.** Standard joins, date bucketing, pivots. See the [SQL cheat sheet](/blog/sql-cheat-sheet-for-data-analysts-15-queries-you-will-reuse/) for patterns worth reviewing in AI output.
- **Translating between dialects or tools.** From T-SQL to PostgreSQL, from Excel formulas to SQL.
- **Explaining code.** "What does this 200-line query do?" is a great job for a model, and you can verify it by reading.
- **First drafts of documentation,** data dictionaries and commit messages.
- **Cleaning routines.** Standardising formats, spotting obvious anomalies, proposing regexes.
- **Summarising long text.** Meeting notes, survey comments, tickets, as a draft to review.
- **Formatting and chart scaffolding.** Then you refine the message.

## Which tasks can it help with under supervision?

These are useful, but you must check the output every time.

- **Writing analysis queries** against your real schema. Give it context, and use the checklist in [prompting an LLM for SQL](/blog/prompting-an-llm-for-sql-you-can-trust/).
- **Writing DAX or Power Query.** It speeds things up, though it can miss filter context. See [DAX CALCULATE explained](/blog/dax-calculate-explained-filter-context-in-plain-english/) and [Copilot's limits](/blog/power-bi-copilot-what-it-can-and-cant-do_1/).
- **Exploratory analysis.** Good for suggesting angles, and you decide which are real.
- **Statistical tests.** It can pick and run one, but you need to know whether the assumptions hold. Start from [six statistical functions](/blog/statistical-functions-every-data-analyst-should-know/).
- **Drafting the narrative** of a report, from your findings, in your voice.

Always run [the validation checklist](/blog/how-to-validate-ai-generated-analysis-before-it-reaches-your-boss/) on anything in this group.

## Which tasks should I keep?

These depend on context that a model does not have, or carry consequences that you own.

- **Framing the question.** What is the stakeholder actually trying to decide? Helping people articulate the right question before anyone touches data is human work.
- **Defining metrics.** "Active customer" is a business decision. Write it down and own it.
- **Judging plausibility.** You know the business and what a normal week looks like.
- **Choosing what not to show.** Editing is the analyst's craft.
- **Recommendations and trade-offs.** The AI can list options. You weigh them, with politics, cost and timing in mind.
- **Sensitive or regulated data.** Follow your company's rules and don't paste confidential data into public tools.
- **Accountability.** If a number is wrong, "the AI said so" won't hold up in a meeting.

## How do I decide in the moment?

Ask three questions:

1. **Can I check the output faster than I could produce it?** If yes, hand it over.
2. **What is the cost of a silent error?** The higher it is, the more you supervise.
3. **Does the task depend on context only I have?** If yes, keep the thinking and delegate the typing.

## Is my job at risk?

I don't know, and neither does anyone else. What I see is that the mix of work is shifting: less time typing queries, more time framing, checking and explaining. Analysts who can direct AI and vouch for its output are more valuable, not less. That is an opinion, not a forecast.

If you want to try a workflow, start with [Claude Code for data analysis](/blog/claude-code-for-data-analysis-a-beginner-setup/), and get the foundations right first with [a semantic layer](/blog/semantic-layer-for-ai-what-it-is-and-why-analytics-needs-one/).

*Sources: [Databricks: AI for Data Analytics](https://www.databricks.com/blog/how-ai-transforming-data-analytics), [Databricks: The Future of Data Analytics, Why AI Is Rewriting the Analyst's Job Description](https://www.databricks.com/blog/future-data-analytics-why-ai-rewriting-analysts-job-description). The three-way split and the decision questions are my own judgement.*
