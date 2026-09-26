---
title: "SQL Interview Questions Analysts Are Actually Asked"
description: The recurring SQL interview patterns behind most data analyst
  interviews, how to approach each, and how interviewers actually grade the
  answers.
pubDate: 2026-09-26T19:30:00.000+02:00
tags:
  - sql
  - career
  - data analyst
  - interview
draft: false
---
> **Short answer:** Most SQL interviews for analyst roles rotate through the same handful of patterns: joins and why rows duplicate, filtering vs aggregating with `GROUP BY`/`HAVING`, window functions for ranking or running totals, finding duplicate rows, and one open-ended query where the interviewer cares more about your reasoning out loud than the exact syntax. Knowing the pattern behind a question matters more than memorizing a specific query.

Interviewers reuse the same underlying patterns across companies because they're testing the same underlying skills, not because they've run out of ideas. Here's what those patterns actually are.

## "Write a query that returns customers with no orders"

This tests whether you understand `LEFT JOIN` versus `INNER JOIN`, and specifically whether you know that filtering a left-joined table's column in `WHERE` (`WHERE orders.id IS NULL`) only works because the join already preserved the unmatched rows. See [SQL joins explained](/blog/sql-joins-explained-inner-left-right-full/) for the mechanics if this pattern isn't automatic yet.

## "Find the second-highest salary per department"

This is a window function question wearing a plain-English disguise. The interviewer wants to see whether you reach for `RANK()` or `DENSE_RANK()` with `PARTITION BY department` rather than a nested subquery with `MAX()` that only works for the *first*-highest and gets awkward fast for "second." See [SQL window functions](/blog/sql-window-functions/) for the pattern this question is really testing.

## "Write a query for a running total" or "month-over-month growth"

Another window function question, this time testing `SUM() OVER (ORDER BY ... ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` for a running total, or `LAG()` for comparing a row to the previous period. Interviewers use this to check whether you can keep every row while still calculating across them, instead of collapsing everything with `GROUP BY` when the question actually needed row-level detail preserved.

## "Find duplicate rows in this table"

Tests `GROUP BY` with `HAVING COUNT(*) > 1` for finding which values are duplicated, or `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` for identifying and removing specific duplicate *rows* rather than just duplicate values. The distinction between "which values appear more than once" and "which exact rows should I delete, keeping one" is exactly the kind of clarifying detail a strong candidate confirms before writing the query. See [how to find and fix duplicate rows in SQL](/blog/find-and-fix-duplicate-rows-in-sql/) for the full pattern.

## "What's the difference between WHERE and HAVING?"

A conceptual question, not a coding one, but it's asked constantly because it reveals whether you understand SQL's actual execution order — `WHERE` filters rows before grouping, `HAVING` filters groups after aggregation. See [GROUP BY vs HAVING vs WHERE](/blog/sql-group-by-vs-having-vs-where/) for the full execution order and why it matters.

## "Calculate a funnel conversion rate between three steps"

This tests whether you can combine conditional aggregation (`COUNT(CASE WHEN step = 'X' THEN 1 END)`) or self-joins to compare counts at different funnel stages, and whether you think to check for the trap of double-counting a user who repeated a step, or the reverse — dropping a legitimate user because the join didn't handle a missing step gracefully.

## How do interviewers actually grade these?

The exact syntax matters less than most candidates assume. What interviewers are actually watching for:

- **Do you clarify ambiguous requirements before writing anything?** "Second-highest salary — do ties count as the same rank, or should ties push the next distinct salary down?" is exactly the kind of question a strong candidate asks before typing.
- **Do you talk through your reasoning, not just produce a final query silently?** An interviewer forming an opinion from a five-minute silence followed by a correct query has much less to go on than one who watched you eliminate a wrong approach out loud.
- **Do you consider edge cases unprompted?** `NULL` values, ties, empty groups, and duplicate join keys are the recurring edge cases across almost every pattern above — mentioning them before being asked is a strong signal.
- **Can you explain a trade-off, not just produce an answer?** "I used a window function here instead of a self-join because it avoids scanning the table twice" shows understanding beyond pattern-matching a memorized solution.

## What should I actually do to prepare?

1. Practice the patterns above until the *shape* of each question is recognizable, not specific memorized queries.
2. Say your assumptions out loud before writing code, even in a take-home or written format — annotate them.
3. Mention `NULL` handling and ties explicitly, even when the interviewer doesn't ask.
4. Have a real project to point to that used these patterns for an actual purpose, not just an exercise — see [data analyst portfolio projects that get interviews](/blog/data-analyst-portfolio-projects-that-get-interviews/) for what makes a project credible in this context.

For the reference patterns themselves, the [SQL cheat sheet](/blog/sql-cheat-sheet-for-data-analysts-15-queries-you-will-reuse/) and [CTE vs subquery vs temp table](/blog/sql-cte-vs-subquery-vs-temp-table-which-to-use/) cover the building blocks most of these interview questions are assembled from.
