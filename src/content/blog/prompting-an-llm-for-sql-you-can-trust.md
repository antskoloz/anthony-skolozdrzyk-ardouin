---
title: "Prompting an LLM for SQL You Can Trust"
description: How to get reliable SQL from ChatGPT, Claude or Copilot. What context to give, how to use examples, and the checks that catch wrong joins and made-up columns.
pubDate: 2026-09-26T11:10:00.000+02:00
tags:
  - llm
  - sql
  - prompt engineering
  - ai for analysts
draft: true
---

> **Short answer:** Give the model your real schema, your metric definitions and two or three worked examples, ask it to explain its joins, and then check the result against a number you already know. The most common failures are queries that run fine but answer a different question, so testing matters more than clever wording.

AI can write a query in seconds, and it will look right almost every time. That is the problem. A wrong query and a right one look identical until you check, and the model will present both with the same calm confidence. The fix is not a magic prompt. It is a better brief, plus a few checks you run every time.

<!-- ANTHONY: add a real story here (an AI-written query that looked right and was wrong, or one that saved you time) -->

## Why does AI-generated SQL go wrong?

The research and practitioner write-ups agree on the pattern. Without context, a model tends to produce SQL that is syntactically correct but semantically wrong: wrong joins, hallucinated columns, and mismatched aggregations. A [practical guide from PuppyGraph](https://www.puppygraph.com/blog/text-to-sql-llm) notes that a single prompt with the question and schema tends to be brittle on ambiguous questions and large schemas, and offers no way to recover when the first query is wrong.

So the goal of prompting is to remove ambiguity before the model writes anything.

## What context should I give it?

Think of it as briefing a smart new colleague who has never seen your database.

**1. The schema, trimmed to what matters.** Table names, column names and types, and the keys that join them. Don't paste 300 tables. Include the three that matter. For large schemas, retrieval approaches narrow the prompt to the relevant tables and columns, as covered in [Arize's guide](https://arize.com/blog/how-to-prompt-llms-for-text-to-sql/).

**2. Business definitions.** Say what "active customer" or "revenue" means, in words and, ideally, as a formula. This is the semantic-layer idea in miniature; see [what a semantic layer is](/blog/semantic-layer-for-ai-what-it-is-and-why-analytics-needs-one/).

**3. The dialect.** "PostgreSQL 16", "BigQuery", "DuckDB". Date functions and quoting differ, as I showed in [SQL date functions](/blog/sql-date-functions-fiscal-calendars-week-starts-time-zones/).

**4. Two or three examples.** Show a question with the correct SQL. Guides on prompting for text-to-SQL, including [this one](https://theneuralbase.com/sql-generation/learn/beginner/example-queries-few-shot/), recommend a handful of question-and-answer pairs so the model learns your schema's patterns. Treat claims of a specific percentage improvement as rough, since they depend on the setup.

**5. Constraints.** "Read-only. Use CTEs, not subqueries. Return no more than 100 rows. Never use `SELECT *`."

## What does a good prompt look like?

Here is a template I reuse. The names are illustrative.

```text
You are helping me write PostgreSQL 16 SQL.

Schema:
- orders(order_id, customer_id, order_date, amount_eur, status)
- customers(customer_id, country, is_test)

Definitions:
- Revenue = SUM(amount_eur) where status = 'paid' and customers.is_test = false.
- "Last month" = the previous calendar month in Europe/Berlin time.

Example:
Q: Revenue by country in January 2026.
SQL: <your verified query>

Task: Revenue by country for last month, top 10.

Rules: read-only, use a CTE, explain each join in one sentence before the query,
and list any assumption you had to make.
```

The last line is the important one. Asking for assumptions makes the model show you where it guessed, which is exactly where mistakes hide.

## How do I check the answer?

Never run generated SQL on the trust of how it looks. My checklist:

1. **Read the joins.** Does each one match on a real key? An unexpected many-to-many join inflates sums, and it is the most common error I see.
2. **Check the row count** before and after each join.
3. **Reconcile a known total.** Compare the grand total with a number you already trust, such as a finance figure or an existing dashboard.
4. **Check the edges.** Does the date range include the right first and last day? Are NULLs handled?
5. **Look for invented columns.** A column that doesn't exist will fail loudly, but a wrongly-named real column will quietly answer something else.
6. **Run it with `LIMIT` first**, and on a copy or read-only connection when the data is sensitive.

I go deeper on this in [how to validate AI-generated analysis](/blog/how-to-validate-ai-generated-analysis-before-it-reaches-your-boss/).

## What should I avoid?

- **Pasting confidential data into a public chatbot.** Check your company's rules. Share schema and made-up sample rows, not customer data.
- **Long, one-shot mega-prompts** for a hard question. Break it into steps: first the base table, then the join, then the aggregation. Decomposition helps with joins and nested queries in particular, according to the [DIN-SQL paper](https://arxiv.org/pdf/2304.11015).
- **Trusting fluent explanations.** A confident paragraph proves nothing about the query.
- **Accepting a DELETE or UPDATE** without reading every word.

## When is it worth it?

AI is good at the boring parts: boilerplate, translating between dialects, writing a first draft of a window function, explaining a query someone else wrote. It is weaker on ambiguity and on knowing your business. That is why the context above matters.

My take: treat the model like a fast junior analyst who never gets tired and never says "I'm not sure". Give it good briefs, and check its work every time. If a query is a one-off on data you know well, you may be faster writing it yourself.

For a wider view of the tasks that suit AI, see [which analyst tasks to hand to AI](/blog/which-analyst-tasks-to-hand-to-ai-and-which-to-keep/).

*Sources: [PuppyGraph: Text-to-SQL LLM, A Practical Guide](https://www.puppygraph.com/blog/text-to-sql-llm), [Arize: How to Prompt LLMs for Text-to-SQL](https://arize.com/blog/how-to-prompt-llms-for-text-to-sql/), [The Neural Base: few-shot example queries](https://theneuralbase.com/sql-generation/learn/beginner/example-queries-few-shot/), [DIN-SQL (arXiv)](https://arxiv.org/pdf/2304.11015). The prompt template and table names are illustrative.*
