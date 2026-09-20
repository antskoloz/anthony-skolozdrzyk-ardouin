---
title: "Git and an LLM for Power BI: a new way to build DAX and M"
description: Save Power BI as text, version it in GitHub and connect an LLM to
  write DAX and M. Why this workflow changes how analysts build, review and
  trust their models.
pubDate: 2026-09-20T09:32:00.000+02:00
tags:
  - power bi
  - git
  - dax
  - power query
  - ai analytics
draft: false
---

> **Short answer:** Save your Power BI work as a Power BI Project (PBIP), so the semantic model becomes plain text files. Put those files in a Git repository on GitHub, and connect an LLM to them. You get version history, reviewable changes and an AI assistant that can draft DAX and M inside a safety net. Every change is a diff you can read, test and undo, which is what turns AI help from a risk into a routine.

For years, Power BI development meant one person, one `.pbix` file and a folder full of files called `Sales_v7_FINAL_fixed.pbix`. There was no diff, no code review and no way to see who changed a measure. Two changes in the last few years remove that limit: Power BI can now save models as text, and AI assistants can read and edit text. Put them together and analysts get a workflow that software engineers have used for a long time.

This post explains how the pieces fit, shows the day-to-day workflow, and covers the risks.

## Why has Power BI development been hard to version?

A `.pbix` file is a single binary package. Git can store it, but it cannot show you what changed inside it. Two analysts working on the same model cannot merge their work, and nobody can answer "who changed this measure and why?" without opening old copies.

## What changes with PBIP and TMDL?

Microsoft's Power BI Project format solves the storage problem. According to Microsoft's documentation, when you save as a Power BI Project, "report and semantic model *item* definitions are saved as individual plain text files in a simple, intuitive folder structure." The semantic model folder holds the model definition, the report folder holds the report, and a `.gitignore` excludes local cache files.

The model itself is written in Tabular Model Definition Language (TMDL), a readable text format. Power BI Desktop also includes a TMDL view, which Microsoft describes as a way to "script, modify, and apply changes to semantic model objects by using a modern code editor," with a side-by-side diff before you apply changes. Microsoft lists TMDL view in Power BI Desktop as generally available. At the time of writing, the documentation describes Power BI Desktop projects as being in preview, so check the current status before adopting this for critical work.

A measure in a TMDL file looks like this (illustrative example):

```tmdl
table Sales

	measure 'Net Revenue' = SUM(Sales[NetAmount])
		formatString: #,0
```

That is ordinary text, which is exactly what Git and an LLM both handle well.

*Sources: [Power BI Desktop projects (PBIP)](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview) and [TMDL view in Power BI](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-tmdl-view), Microsoft Learn.*

## How does GitHub fit in?

There are two routes, and they can be combined.

| Route | How it works | Good for |
| --- | --- | --- |
| **Local PBIP + GitHub repo** | Save the project to a local folder, initialise a Git repository, push to GitHub | Individual analysts and small teams starting out |
| **Fabric workspace Git integration** | Connect a Fabric workspace to a Git repo, so items sync between the workspace and a branch | Teams already publishing to the Fabric or Power BI service |

Microsoft's Fabric documentation says Git integration lets developers "backup and version their work," "revert to previous stages as needed," and "collaborate with others or work alone using Git branches." It supports GitHub, GitHub Enterprise and Azure DevOps (cloud-based only). Semantic models and reports are among the supported items, though the documentation marks several Power BI item types as preview.

*Source: [Fabric Git integration overview](https://learn.microsoft.com/en-us/fabric/cicd/git-integration/intro-to-git-integration), Microsoft Learn.*

## How do I connect an LLM?

There are three levels, from simplest to most automated.

1. **Use the repo as context.** Open the PBIP folder in an editor with an AI assistant, such as GitHub Copilot in VS Code. The assistant can read your TMDL files, so it sees your table names, relationships and existing measures before it suggests any DAX. This alone removes the most common failure of chat-based help, which is that the model guesses your schema.
2. **Use TMDL view for a tight loop.** Draft a change with the assistant, paste the script into TMDL view in Power BI Desktop, review the diff and apply it.
3. **Use an MCP server.** Microsoft publishes a Power BI Modeling MCP server that lets an AI agent read and change semantic models. Microsoft's overview says it can create, update and delete tables, columns, measures and relationships, run bulk operations such as renames and refactors, evaluate a model against best practices, and "run and validate DAX queries while you build." It can also work with TMDL and PBIP files, "so changes flow through your normal source control and review process." The local server is described as in public preview, so expect changes.

*Sources: [Overview of the Power BI MCP servers](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview), [microsoft/powerbi-modeling-mcp](https://github.com/microsoft/powerbi-modeling-mcp/blob/main/README.md).*

## What does the day-to-day workflow look like?

This is my suggested workflow, not an official Microsoft procedure:

1. **Create a branch** for the change, for example `feature/net-revenue-measure`.
2. **Ask the LLM for the change**, naming the business rule: "Add a Net Revenue measure: sales after discounts and refunds, excluding tax, using the existing Sales table."
3. **Read the diff.** The change appears as a few added lines instead of a black box:

```diff
+	measure 'Net Revenue' = SUM(Sales[NetAmount]) - SUM(Sales[RefundAmount])
+		formatString: #,0
```

4. **Open the project in Power BI Desktop and test.** Compare the result with a number you already trust. Check totals at different filter levels, since that is where subtle DAX errors appear.
5. **Commit with a clear message** explaining the business reason.
6. **Open a pull request.** A colleague reviews the diff and the test evidence before it merges.

The same loop works for Power Query M. Ask the assistant to refactor a slow query, for example by moving a filter step earlier, and review the changed lines instead of scrolling through the Advanced Editor.

## Why is this a game changer for analysts and BI?

The evidence here is my own view from years of BI work, not a measured study. I see five shifts.

- **Every change becomes visible.** A measure edit is a line in a diff, with an author, a date and a reason.
- **Mistakes become reversible.** Reverting a bad change is a Git operation, not a hunt for the last good file.
- **AI help becomes safer.** The LLM proposes, you review the diff, and nothing reaches the shared model without a check. That is a very different risk profile from pasting AI-written DAX straight into a production model.
- **Definitions get owners.** A pull request is a natural place to agree what "net revenue" means, which supports the governed metrics approach in [Why AI analysts fail on bad metric definitions](https://anthonysko.com/blog/why-ai-analysts-fail-on-bad-metric-definitions/).
- **The analyst's job moves up a level.** Less time typing boilerplate, more time on modelling decisions, testing and review.

## What are the risks and guardrails?

Microsoft is direct about the risks, and they are worth taking seriously.

- **External edits can break projects.** Microsoft warns that "changes to files or properties outside of Power BI Desktop can cause unexpected errors, or even prevent Power BI Desktop from opening." Some report files use schemas Microsoft does not document, so keep AI edits to the semantic model files and let Power BI Desktop manage the rest.
- **LLMs make mistakes.** The Modeling MCP server documentation says the model "may produce unexpected or inaccurate results, which could lead to unintended changes," and advises creating a backup before operations. Git gives you that backup, but only if you commit first.
- **Data and metadata leave your environment.** Microsoft notes that an MCP server "doesn't expand data access, but it does move data," and that schemas, metadata and query results can reach the LLM provider as context. Check your organisation's policy on AI tools and data before connecting anything, and use sample or development models when in doubt.
- **Do not use the authoring server for business questions.** Microsoft states it is not designed to answer business questions for end users. It is for building models.
- **Start small.** Keep the first pilot on a non-critical model, and keep human review on every merge.

## How can I start this week?

- Save one existing report as a Power BI Project and open the folder in your editor.
- Create a private GitHub repository and make a first commit.
- Ask an AI assistant to document your five most important measures, and review the output.
- Make one small change on a branch, read the diff, test it in Power BI Desktop and merge it.

That single cycle teaches you most of the workflow.

## Frequently asked questions

**Do I need Fabric to use Git with Power BI?**
No. The PBIP format works locally with any Git repository. Fabric Git integration is an extra route for workspaces.

**Will the LLM know my data model?**
Only what it can read. Pointing it at your TMDL files gives it the schema and existing measures, which improves suggestions considerably compared with a blank chat.

**Is it safe to let an AI edit my model?**
It is safer with Git, branches and review, but not risk-free. Follow the guardrails above and check your organisation's rules on AI tools and data.

**Does this work for Power Query M as well as DAX?**
Yes. M queries are stored as text in the model files, so an assistant can propose changes you review as diffs.

## Sources

- [Microsoft Learn: Power BI Desktop projects (PBIP)](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview)
- [Microsoft Learn: Use TMDL view in Power BI](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-tmdl-view)
- [Microsoft Learn: Fabric Git integration overview](https://learn.microsoft.com/en-us/fabric/cicd/git-integration/intro-to-git-integration)
- [Microsoft Learn: Overview of the Power BI MCP servers](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview)
- [GitHub: microsoft/powerbi-modeling-mcp](https://github.com/microsoft/powerbi-modeling-mcp/blob/main/README.md)

*Last reviewed: 20 September 2026.*
