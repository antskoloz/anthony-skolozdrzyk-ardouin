---
title: "How to Validate AI-Generated Analysis Before It Reaches Your Boss"
description: A practical checklist for checking AI-generated analysis: reconcile totals, trace every number, test edge cases and label what is still an assumption.
pubDate: 2026-09-26T11:30:00.000+02:00
tags:
  - ai for analysts
  - data quality
  - validation
  - data analytics
draft: true
---

> **Short answer:** Treat every AI-generated number as unverified until you have traced it to the data, reconciled the total against something you trust, and tested the edges. Break the answer into individual claims and check each one. Speed is the gift AI gives you, and checking is the price.

An AI tool can produce a tidy summary with a chart and three confident bullet points in under a minute. Nothing about the tidiness tells you whether the numbers are right. If a wrong figure reaches your boss, it will not matter that a model produced it. It will be your name on the slide.

<!-- ANTHONY: add a real story here (an AI-produced number you caught before it was shared, or one you didn't) -->

Here is the checklist I would use before sharing anything an AI helped me produce. The example numbers are illustrative.

## Why does AI analysis need extra checking?

Two reasons. First, language models are built to produce fluent answers, and fluency is not accuracy. Guides on hallucination detection, such as [Softude's](https://www.softude.com/blog/llm-hallucination-detection), stress a simple principle: the most reliable way to validate an answer is to break it into individual factual claims and check each against trustworthy evidence.

Second, in analytics the errors are quiet. A wrong join or a missing filter doesn't crash. It returns a number. I explain the typical causes in [prompting an LLM for SQL you can trust](/blog/prompting-an-llm-for-sql-you-can-trust/), and [why AI analysts fail on bad metric definitions](/blog/why-ai-analysts-fail-on-bad-metric-definitions/) covers the definitional side.

## What is the validation checklist?

### 1. Trace every number to its source

For each figure in the output, ask: which table, which filter, which date range? If the tool can't show you, or you can't reconstruct it, the number does not go in the deck. Make the tool say exactly where each finding came from, then check it yourself.

### 2. Reconcile one total

Pick a total you already trust, such as finance's monthly revenue, the count in the source system, or last week's dashboard, and compare. If revenue from the AI's query differs from finance by 3%, find out why before you go on. A small mismatch is usually a filter or a definition, not noise.

### 3. Check the row counts

Count rows before and after each join and filter. If a join makes the table bigger, it is many-to-many and sums are inflated. This single check catches a large share of wrong AI SQL, and of wrong human SQL.

### 4. Test the edges

- Does the date range include the first and last day?
- What happens with NULLs, refunds and test accounts?
- Are time zones consistent? See [SQL dates and time zones](/blog/sql-date-functions-fiscal-calendars-week-starts-time-zones/).
- Are there [duplicates](/blog/find-and-fix-duplicate-rows-in-sql/) in the source?

### 5. Ask the tool to argue against itself

Prompt: "List three ways this analysis could be wrong, and how I would check each." It is not proof, but it often surfaces assumptions you can test.

### 6. Run it twice

Consistency checking is a common detection method: run the same question more than once, and if the answers vary, you have a reliability problem. Different phrasing that gives a different number is a warning sign.

### 7. Sanity-check the size and direction

Does the number pass the smell test? If revenue is up 400% overnight, or a conversion rate is 97%, the answer is probably a bug. Compare with last period and with the range you expect.

### 8. Label what is still an assumption

Anything you could not verify goes into the deliverable as an assumption, in words. "Revenue excludes refunds, per the finance definition. Test accounts excluded. Not yet reconciled to the ledger." That sentence protects you and helps the reader.

## What does a human still have to do?

The AI can draft. You have to decide. That includes framing the question, applying business context, judging whether a result is plausible, and deciding what to recommend. Surveys of the field, such as the [Databricks discussion of AI and analysts](https://www.databricks.com/blog/future-data-analytics-why-ai-rewriting-analysts-job-description), place the human value in questioning findings, adding context and deciding what happens next, and I agree with that split. I take it further in [which analyst tasks to hand to AI](/blog/which-analyst-tasks-to-hand-to-ai-and-which-to-keep/).

## How much checking is enough?

Match the effort to the stakes. A quick exploration for your own eyes needs a light check. A number going to the board needs everything above, plus a second person.

| Use | Minimum checks |
| --- | --- |
| Personal exploration | Sanity check, row counts |
| Internal team report | Reconcile a total, edge cases, assumptions listed |
| Executive or external | All of the above, source trace for every number, a second reviewer |

My opinion: the analysts who benefit most from AI are the ones with the strongest checking habits, because they can move fast and still trust the output. If the analysis is disposable and low stakes, you can relax the process, but keep the sanity check.

*Sources: [Softude: LLM Hallucination Detection](https://www.softude.com/blog/llm-hallucination-detection), [Databricks: The Future of Data Analytics](https://www.databricks.com/blog/future-data-analytics-why-ai-rewriting-analysts-job-description), [ThoughtSpot: AI-Generated Insights, A 2026 Guide to Data Validation](https://www.thoughtspot.com/data-trends/artificial-intelligence/ai-generated-insights). The checklist and the examples are my own and illustrative.*
