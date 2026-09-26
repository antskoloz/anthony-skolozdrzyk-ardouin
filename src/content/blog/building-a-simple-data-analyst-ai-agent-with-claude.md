---
title: "Building a Simple Data Analyst AI Agent With Claude"
description: What separates an AI agent from a chatbot for analyst work, a
  minimal worked example, and the guardrails to put around it before it
  touches real data.
pubDate: 2026-09-26T14:00:00.000+02:00
tags:
  - ai
  - claude code
  - data analytics
  - automation
draft: false
---
> **Short answer:** An "agent" for analyst work is a loop that gives an LLM tools — read a file, run SQL, run a script — and lets it plan across several steps toward a goal, instead of answering in a single reply. You can build a genuinely useful one with Claude Code and a couple of scripts; you don't need a framework to get started.

"AI agent" gets used loosely enough that it's worth being precise about what actually makes something one, before building it.

## What makes it an agent instead of a chatbot?

A chatbot answers a question in one shot: you ask, it replies, done. An agent does something closer to what a junior analyst does with a task: it breaks the goal into steps, uses tools along the way (read a file, run a query, check a result), and decides what to do next based on what it finds, without you specifying every step in advance.

The mechanical difference is tool use plus a loop: the model is given a set of tools it can call, it calls one, sees the result, and decides whether to call another tool or give a final answer. Claude Code is built exactly around this loop already — it's a general-purpose agent with file, search and shell tools, which is why it's a reasonable starting point rather than something you need to build from scratch.

## What's a minimal, useful example?

Take a recurring task: a weekly sales summary. Manually, this means opening last week's export, comparing it to the prior week, noting anything unusual, and writing a short summary for a Monday message.

As an agent task, you'd give it:
- **A tool to read the data** — access to the folder where the weekly CSV export lands.
- **A goal, not a script** — "read this week's file, compare it to last week's, flag any metric that moved more than 15%, and write a three-paragraph summary."
- **A defined output format** — where the summary should go and roughly how long it should be, so you're not surprised by the shape of what comes back.

The agent reads the file, computes the comparison itself (ideally by running actual code rather than eyeballing numbers — see [why LLMs hallucinate numbers](/blog/why-llms-hallucinate-numbers-in-analytics/) for why that distinction matters), and produces a draft. You review it before it goes anywhere.

## What should I actually give it access to?

Least privilege, same as you'd apply to a new hire's system access on day one:

- **Read-only access** to source data, unless the task genuinely requires writing somewhere.
- **A scratch folder** for intermediate files, kept separate from anything that matters, so a bad intermediate step can't corrupt a real file.
- **A clearly defined output location and format**, so you know exactly where to look for its work and what "done" is supposed to look like.

Resist the urge to give it broad access "just in case it needs it later." Add access when a specific task genuinely requires it, not preemptively.

## What guardrails matter before this touches anything real?

1. **Human review before anything is sent or acted on.** A weekly summary that drafts a message is useful. A weekly summary that automatically posts to a channel unreviewed is a different risk profile entirely, and should be treated as one.
2. **Checked outputs, not just checked once.** The first ten runs looking correct doesn't guarantee the eleventh will. Spot-check periodically, especially after the underlying data format changes.
3. **A way to see what it actually did.** If the agent ran a query or executed code, keep that visible — the query it ran, the file it read — so a wrong number is traceable to its cause instead of a black box.
4. **A clear boundary on what it's allowed to decide vs report.** "Flag anything unusual" is a reasonable agent task. "Decide whether to change the marketing budget" is not, even if the agent is technically capable of producing an opinion on it.

This is really the same split as the broader question of what to delegate — see [Which analyst tasks to hand to AI, which to keep](/blog/which-analyst-tasks-to-hand-to-ai-and-which-to-keep/) for the fuller framework this fits into.

## When is it not worth building?

If the task happens once, or rarely, building an agent around it costs more setup time than it saves. Agents pay off for recurring, well-defined tasks where the format of the input is stable enough that "read this week's file" reliably means the same thing each week. A one-off analysis is usually faster done directly, with the LLM as a assistant in the conversation rather than as a standing agent with its own tools and loop.

My take: start with the smallest possible version — one tool, one clearly bounded task, human review on every run — before adding more tools or more autonomy. The temptation is to build something impressive; the useful version is usually something boring that reliably saves twenty minutes every Monday.

If you haven't set up an environment for this kind of work yet, [Claude Code for data analysis: a beginner setup](/blog/claude-code-for-data-analysis-a-beginner-setup/) covers the starting point.
