---
title: AI Transformation Starts With Your Data, Not the Model
description: Why most AI transformation programmes stall, what the research
  says, and a practical data-readiness checklist analysts can run first.
pubDate: 2026-10-04T11:08:00.000+02:00
tags:
  - ai for analysts
  - ai transformation
  - data quality
  - data strategy
draft: false
---
> **Short answer:** AI transformation usually stalls on data, not models. Gartner expects organisations to abandon 60% of AI projects that lack AI-ready data through 2026, and RAND notes estimates that more than 80% of AI projects fail. Before choosing a model, check that your key metrics have one definition, your data has an owner, and you can measure whether the AI actually helped.

Every company I read about has an AI transformation story in progress. Many of them have the same plot: an impressive pilot, a lot of excitement, then a slow fade when it meets real data. The model was rarely the problem.

This post covers why that happens, what the research says, and a readiness checklist you can run before the next pilot. It's written from an analyst's seat, because analysts are usually the first to see the cracks.

## What is AI transformation, really?

Strip the buzzword and AI transformation means changing how work gets done because AI now does part of it. Not "we bought a licence". Not "we ran a pilot". Work changes: a process is faster, a decision is better informed, a team spends its time differently.

That definition matters, because it tells you how to measure it. If nothing about the work changed, nothing was transformed, however good the demo looked.

## Why do so many AI projects fail?

The research points in the same direction.

* **Gartner** predicts that through 2026, organisations will abandon 60% of AI projects that aren't supported by AI-ready data.
* **RAND Corporation** notes that, by some estimates, more than 80% of AI projects fail, about twice the rate of IT projects without AI. Its own interviews with 65 data scientists and engineers found that the most common root cause is misunderstanding the problem to be solved, with missing or poor data close behind. Most of the causes have nothing to do with which model was chosen.

A caveat on both: "fail" is defined differently across studies, and survey figures vary a lot. I'd treat them as "most", not as precise percentages. The direction is consistent, though, and it matches what analysts see every day.

In plain terms, AI projects tend to fail for four reasons:

1. **The problem isn't defined.** "Use AI for customer insights" isn't a problem. "Cut the time to answer a regional sales question from two days to two hours" is.
2. **The data isn't ready.** Duplicates, gaps, stale tables, and three versions of the same metric.
3. **Nobody owns the data.** When the AI gives a wrong answer, there's no one whose job it is to fix the source.
4. **Nobody measures the outcome.** The pilot is judged on how impressive it looks, not on whether the work improved.

Creating a semantinc model with currated and well-defined definitions around the metrics totally makes a difference. For instance, defining "active users": what time definition? Should all segments of customers be included and follow the same rules? Which source data table should be considered as the truth, the one coming from the CRM or any other system like the billing engine?

## What does "AI-ready data" mean?

It sounds vague, so here's the analyst's version. Data is AI-ready when an assistant could answer a business question with it and you would trust the answer without redoing it yourself.

That needs four things:

| Property       | What it means                                  | Quick test                                                                                 |
| -------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Defined**    | Each key metric has one written definition     | Ask three teams for "active customers". Same number?                                       |
| **Clean**      | Duplicates, nulls and test records are handled | Run a [duplicate-row check](/blog/find-and-fix-duplicate-rows-in-sql/) on your main tables |
| **Owned**      | Someone fixes the source when it's wrong       | Can you name the owner of your revenue table?                                              |
| **Documented** | Tables and columns are described in words      | Could a new hire find the right table in a day?                                            |

The first row is the one that bites hardest. An AI can write perfectly valid SQL against the wrong definition of revenue, and nothing in the output will warn you. That's the subject of [why AI analysts fail on bad metric definitions](/blog/why-ai-analysts-fail-on-bad-metric-definitions/), and it's why a [semantic layer](/blog/semantic-layer-for-ai-what-it-is-and-why-analytics-needs-one/) is becoming part of the AI conversation.

## A readiness checklist to run before the next pilot

You can do this in an afternoon, before anyone signs a contract.

1. **Name the decision or task.** One sentence. "Answer ad-hoc revenue questions for regional managers without an analyst in the loop."
2. **List the five metrics it depends on.** For each: is there one written definition? If not, write it first. A [metric definition doc](/blog/metric-definition-doc-with-a-template/) is the cheapest AI investment you'll ever make.
3. **Check the source tables.** Duplicates, missing dates, test data, time zones. Most of the issues will be boring. Boring is good: boring is fixable.
4. **Name an owner per table.** If a table has no owner, the AI's mistakes on it have no owner either.
5. **Define the baseline.** How long does the task take today, and how accurate is it? Without a baseline you can't prove the AI helped.
6. **Decide the validation step.** Who checks the AI's output, how, and how often? My [validation checklist](/blog/how-to-validate-ai-generated-analysis-before-it-reaches-your-boss/) is a starting point.
7. **Pick a small, real scope.** One team, one task, real data. Not a demo on a clean sample.

If you can't get through steps 2 to 4, that's your answer: the next project isn't an AI project. It's a data project, and it'll make every later AI project cheaper.

## Where should analysts fit in?

Closer to the middle than most org charts suggest. Analysts know which tables lie, which metrics have three definitions, and which dashboards nobody trusts. That's exactly the knowledge an AI programme needs, and it rarely sits with the people buying the tools.

Practically, that means analysts can:

* write the metric definitions the AI will rely on,
* build the evaluation set (questions with known correct answers) to test any assistant before rollout,
* and decide [which tasks to hand to AI and which to keep](/blog/which-analyst-tasks-to-hand-to-ai-and-which-to-keep/).

The evaluation set is the one I'd push hardest. Twenty real questions with answers you've checked by hand will tell you more about an AI tool than any vendor demo.

## What AI transformation is not

It's not a model choice. Models improve every few months, and the gap between the leading ones is often smaller than the gap between clean and messy data.

It's also not a one-off project. Data gets messy again the moment you stop looking after it. The organisations that do well treat data quality like hygiene: boring, constant, and noticed only when it stops.

My take: if you have one budget line for AI this year, spend the first part of it on definitions and data ownership. It's the least exciting slide in the deck. It's also the one that decides whether the rest of the deck comes true. If you think your data is already in good shape, the checklist above will confirm it in an afternoon, and I'd be happy to be wrong.

*Sources: [Gartner, "Lack of AI-Ready Data Puts AI Projects at Risk" (February 2025)](https://www.gartner.com/en/newsroom/press-releases/2025-02-26-lack-of-ai-ready-data-puts-ai-projects-at-risk); [RAND Corporation, "The Root Causes of Failure for Artificial Intelligence Projects and How They Can Succeed" (2024)](https://www.rand.org/pubs/research_reports/RRA2680-1.html). The checklist is my own.*
