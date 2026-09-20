---
title: "Power BI Copilot: what it can and can't do today"
description: What Copilot in Power BI does well, where it breaks, and how to
  test it on your own semantic model before business users start trusting its
  answers.
pubDate: 2026-09-20T14:29:00.000+02:00
tags:
  - power bi
  - copilot
  - business intelligence
  - ai analytics
draft: false
---

> **Short answer:** Copilot in Power BI can draft DAX, build report pages, summarize a report and answer questions about a semantic model. It's only as good as the model underneath it, and Microsoft's own documentation says the output isn't guaranteed to be correct. Treat it as a quick first draft that you check, not as an analyst you trust.

Every BI vendor has an AI story right now, and most of them run a little ahead of what the documentation actually promises. So this post sticks to what Microsoft Learn says today, adds one outside data point, and ends with a test you can run on your own model.

## What Copilot does today

Microsoft splits the features by who is using them.

If you consume reports, you can ask questions across semantic models, get a summary of a whole report or just one topic, create visuals, and search for reports and models across the organization. You can even put an AI summary into a report subscription email.

If you build reports, you can create and edit pages from a prompt, have Copilot write DAX queries, add narrative visuals, and generate descriptions for measures. If you look after the semantic model itself, Copilot in web modeling can flag problems like unclear structure or inconsistent naming and suggest fixes.

One detail I like: the DAX that Copilot generates goes through a DAX parser before you see it, which Microsoft says reduces hallucinations. That catches broken syntax. It can't catch a query that runs fine and answers the wrong question, and that second kind of mistake is the one that does damage.

## What you need before it runs

You need paid capacity: Fabric F2 or higher, or Power BI Premium P1 or higher. Trial capacities and free SKUs aren't supported. An admin has to switch on the setting for features powered by Azure OpenAI, and the capacity has to sit in a supported region.

If your tenant is outside the US or EU boundary, there's a second setting that lets data sent to Azure OpenAI be processed outside your geographic or compliance boundary. That one is a conversation for your security team.

A few smaller things are worth knowing. Prompts in languages other than English sometimes work, but multilingual use isn't officially supported. A prompt is capped at 10,000 characters. And if you send the same prompt against an unchanged model within 24 hours, Copilot answers from cache, even if you clear the chat. That matters when you're testing, because asking twice doesn't give you a second opinion.

Also check the maturity of the feature you want. At the time of writing, the Copilot pane in reports is generally available, while the standalone Power BI agent, app-scoped Copilot and Copilot in web modeling are still in preview. That list will change, so look at the docs again before you plan anything.

## Where it breaks

Microsoft is refreshingly blunt here. Its semantic model page says that without proper preparation, Copilot mainly produces low-quality and inaccurate outputs that might be incorrect or even misleading. And even with good prep, the underlying model is nondeterministic and isn't guaranteed to give a correct answer.

The documented failure modes are very ordinary ones. Ask for "profit %" and you might get profit values, because the wording was ambiguous. Two fields with the same name in different tables confuse it. Currency conversion, field parameters and disconnected tables can cause outright failures. It struggles when a DAX variable is declared and then reused, and it has limited training on newer DAX functions. On a live connection to a shared model, it can't see your measure expressions at all.

There's also a list of things Copilot never reads: hidden fields, hidden report pages, tables marked private, and comments inside DAX. That last one is easy to miss. If you've been explaining a tricky measure in a comment, Copilot doesn't benefit from it. A description on the measure does, and Copilot only reads the first 200 characters of it, so put the important part first.

Long chats are the last trap. A big conversation history can send Copilot in odd directions, and Microsoft's advice is to close and reopen the pane before retrying.

## Get the model ready first

Microsoft's preparation advice is basically good modeling, nothing exotic. Use a star schema. Give tables, columns and measures readable names, without abbreviations or punctuation. Write descriptions. Set data types, format strings and data categories properly. Add synonyms through the Q&A linguistic model so the words your users actually say map to the right fields. Hide what users shouldn't query, and simplify anything overly complicated.

My take is that Copilot doesn't create new requirements, it raises the price of ignoring old ones. A badly named measure used to confuse a colleague. Now it produces a confident, well-formatted wrong answer for a manager who never sees the model. Microsoft even suggests tagging models as ready for Copilot, or making that readiness a condition for certified status. I'd do that.

This connects to two earlier posts. [Why AI analysts fail on bad metric definitions](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/why-ai-analysts-fail-on-bad-metric-definitions/) is the reason unclear definitions turn into confident wrong answers, and [my Git, GitHub and LLM workflow for Power BI DAX and M](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/git-github-llm-power-bi-dax-m-workflow/) is about keeping model changes reviewable.

## It isn't only a Power BI problem

dbt Labs published a benchmark in April 2026 comparing an LLM writing raw SQL against a modeled semantic layer, on the same questions. With the semantic layer, one model scored 98.2% and another 100%. With text-to-SQL on the same data, they scored 90.0% and 84.1%.

Take that with some salt. It comes from a vendor that sells semantic layer tooling, it used a single insurance-themed dataset, and it had only 11 questions. The authors also admit that loading the whole schema as context doesn't scale to bigger datasets. What I find useful is how the two approaches fail. Text-to-SQL gives you a plausible answer that's wrong. The semantic layer tends to give you an error. In a BI setting I'd take the error every time, which is an argument for defining your measures properly before putting a chat box on top of them.

## A simple test before you roll it out

This is my own suggestion, not Microsoft's.

1. Write 20 to 30 questions your users really ask, and work out the correct answers by hand or from a report you trust.
2. Ask Copilot each one in a fresh chat and mark the result right, wrong or refused.
3. Run it again after any model change, and again on another day, since the output isn't deterministic.
4. When an answer is wrong, fix the model (names, descriptions, measures) instead of teaching users to phrase questions around the problem.

If Copilot can't handle your ten most important questions, that tells you something about the model. Better you find out than your users.

## Frequently asked questions

**Do I need Fabric or Premium to use Copilot in Power BI?**
Yes. The documentation asks for F2 or higher, or P1 or higher, and says trials and free SKUs aren't supported.

**Will it write correct DAX?**
Sometimes. Read every query it gives you. Reused variables, newer functions and complex patterns are the documented weak spots.

**Can it see my hidden measures?**
No. Hidden fields, hidden pages and private tables are left out of what Copilot reads.

**Does it replace a BI developer?**
Nothing in the documentation suggests that. It speeds up drafting and description writing, and Microsoft itself tells users to check the outputs critically.

## Sources

- [Microsoft Learn: Copilot for Power BI overview and requirements](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction)
- [Microsoft Learn: Use Copilot with semantic models in Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-semantic-models)
- [dbt Developer Blog: Semantic layer vs. text-to-SQL, 2026 benchmark update](https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026)

*Last reviewed: 20 September 2026.*
