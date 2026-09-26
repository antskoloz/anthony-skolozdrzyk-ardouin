---
title: "Claude Code for Data Analysis: A Beginner Setup"
description: How an analyst can set up Claude Code to work with CSV files, SQL
  and Python safely. Project folder, context file, permissions, Git and a first
  session.
pubDate: 2026-09-26T15:26:00.000+02:00
tags:
  - claude code
  - ai for analysts
  - workflow
  - data analytics
draft: false
---
> **Short answer:** Claude Code is a coding assistant that runs in your terminal, reads files in a project folder, and can write and run scripts with your permission. For analysis, put your data and scripts in one folder, add a short context file describing your data and metrics, keep everything in Git, and review every change before you accept it.

Most analysts meet AI through a chat window, where the workflow is copy the question, paste the answer, hope. A coding assistant works differently: it sits inside your project, sees your files, and can run the query it just wrote. That makes it more useful and easier to overtrust, so a little setup goes a long way.

Claude code is really different versus a more common widespread AI chat. Claude code litterally blew my mind when I first used it.

This is a tool guide, not an endorsement of one product. There are other assistants, and I have written about [Copilot in Power BI](/blog/power-bi-copilot-what-it-can-and-cant-do_1/) too. Names and examples are illustrative.

## What is Claude Code?

According to the [official documentation](https://code.claude.com/docs/en/overview), Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands and integrates with your development tools. It is available in the terminal, in IDEs such as VS Code and JetBrains, as a desktop app and on the web.

"Agentic" means it can take steps, such as opening a file, running a script and reading the error, rather than only suggesting text. For an analyst that translates to: point it at a folder of CSVs and SQL files and ask it to build or fix something in there.

## How do I install it?

Follow the official [quickstart](https://code.claude.com/docs/en/quickstart) and [setup guide](https://code.claude.com/docs/en/setup), because the installation method differs by operating system and changes over time. In short, you install it, open a terminal in your project folder, run `claude`, and log in on first use. It needs an account.

## How should I organise the project folder?

Structure is what makes an assistant reliable. A simple layout:

```text
sales-analysis/
├── CLAUDE.md          # context: what this project is, definitions, rules
├── data/
│   ├── raw/           # original files, never edited
│   └── clean/         # outputs of your cleaning scripts
├── sql/               # queries
├── notebooks/         # or scripts/
└── outputs/           # charts and tables you share
```

Two rules I follow. **Raw data is read-only:** the assistant may read `data/raw/`, and everything it produces goes elsewhere. **Everything goes in Git**, so any change it makes is visible and reversible. I describe that habit for Power BI in [Git and an LLM for Power BI](/blog/git-github-llm-power-bi-dax-m-workflow/), and it applies equally here.

## What goes in the context file?

Claude Code reads a file called `CLAUDE.md` in your project as standing instructions. Use it to say what a new colleague would need to know:

```markdown
# Project: Sales analysis

## Data
- data/raw/orders.csv: one row per order line. Columns: order_id, customer_id,
  order_date (UTC), amount_eur, status.
- data/raw/customers.csv: one row per customer. is_test = true rows must be excluded.

## Definitions
- Revenue = sum of amount_eur where status = 'paid'.
- Active customer = at least one paid order in the last 90 days.

## Rules
- Never modify files in data/raw/.
- Use DuckDB SQL for queries. Show the query before running it.
- State assumptions and row counts with every result.
```

This is the same idea as a [semantic layer](/blog/semantic-layer-for-ai-what-it-is-and-why-analytics-needs-one/) in a smaller form. It also stops you repeating yourself at the start of each session.

## Which tools pair well with it?

For local data without a warehouse, [DuckDB](/blog/duckdb-for-analysts-local-analytics-without-a-warehouse/) lets it query CSV and Parquet files with plain SQL. Python with pandas is the other common choice. Either way the assistant writes the code, and you read it.

## What does a first session look like?

Start small and specific:

1. "Read `CLAUDE.md` and the head of `orders.csv`. Summarise what you see and list any data quality issues. Don't change anything."
2. "Write a DuckDB query for monthly revenue and show me the SQL before running it."
3. "Run it. Now check the total against the row count and tell me what you'd double-check."
4. "Save the query to `sql/monthly_revenue.sql` and commit it with a clear message."

Note the pattern: read first, propose second, run third, save fourth. It keeps you in control.

## How do permissions work?

By default the tool asks before it edits files or runs commands, and you approve or decline. The documentation describes configurable permission modes, so read that page and start on the cautious setting. I would only relax it inside a folder where everything is in Git and nothing sensitive is reachable.

## What are the risks?

* **Sensitive data.** Anything the assistant can read may be sent to the model provider. Check your company's policy first, and use sample or masked data when unsure.
* **Confident mistakes.** It can write a plausible analysis that is wrong. See [how to validate AI-generated analysis](/blog/how-to-validate-ai-generated-analysis-before-it-reaches-your-boss/).
* **Scope creep.** It may change more than you asked. Small, reviewed commits catch this.
* **Skill atrophy.** If you never read the code, you stop being able to. Keep reading it.

My take: the setup is what separates a helpful assistant from a risky one. Ten minutes on a folder structure and a context file pays back within the first week. If your analysis is a single pivot table, you probably don't need any of this.

*Sources: [Claude Code Docs: Overview](https://code.claude.com/docs/en/overview), [Claude Code Docs: Quickstart](https://code.claude.com/docs/en/quickstart), [Claude Code Docs: Advanced setup](https://code.claude.com/docs/en/setup). Check the documentation for current installation steps and permission options. The folder layout and context file are illustrative.*
