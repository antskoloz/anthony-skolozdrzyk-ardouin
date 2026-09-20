---
title: "Power BI Copilot: what it can and can't do today"
description: "What Copilot in Power BI can do for authors and business users, what it needs to work, and where it fails, based on Microsoft's own documentation."
pubDate: 2026-09-20
tags: ["power bi", "copilot", "business intelligence", "ai analytics"]
draft: true
---

> **Short answer:** Copilot in Power BI can draft DAX queries, create report pages, summarize reports and answer questions about a semantic model in plain language. Its answers are only as reliable as the model underneath it, and Microsoft's own documentation says the output is nondeterministic, so treat it as an assistant to check, not an analyst to trust.

AI features in BI tools are moving fast, and the marketing usually runs ahead of the documentation. This post sticks to what Microsoft Learn says at the time of writing, adds a cross-check from an independent benchmark, and finishes with a simple way to test Copilot on your own model before anyone relies on it.

## What can Copilot in Power BI do today?

Microsoft's overview groups the features by who is using them.

| Audience | What Copilot can do |
| --- | --- |
| **Business users** | Answer ad-hoc questions across semantic models, summarize reports, create and analyze visuals, search for reports and models, add AI summaries to report subscription emails |
| **Report authors** | Create and edit report pages from a prompt, write DAX queries, create narrative visuals, summarize a semantic model, generate measure descriptions |
| **Semantic model authors** | Analyze a model for problems such as unclear structure or inconsistent naming, suggest best-practice improvements, and help edit DAX measures, tables, columns and relationships through Copilot in web modeling |

The documentation also says DAX query generation uses postprocessing with a DAX parser to reduce hallucinations. That helps with invalid syntax, but a query can be valid and still answer the wrong question.

## What does Copilot need before it works?

According to Microsoft Learn, you need paid Fabric capacity (F2 or higher) or Power BI Premium capacity (P1 or higher). Trial capacities and free SKUs are not supported. A tenant admin must also enable the setting that allows features powered by Azure OpenAI, and the capacity must be in a supported region.

Some points matter for governance:

- **Data residency.** If your tenant or capacity sits outside the US or EU boundary, an admin setting must allow data sent to Azure OpenAI to be processed outside your geographic or compliance boundary.
- **Language.** Prompts in languages other than English may sometimes return relevant answers, but multilingual use is not officially supported.
- **Prompt size and caching.** Prompts are limited to 10,000 characters, and an identical prompt on an unchanged model within 24 hours is answered from cache.
- **Maturity.** At the time of review, the Copilot pane on reports was generally available, while the standalone Power BI agent, app-scoped Copilot and Copilot in web modeling were in preview. Check the current status before you plan a rollout, because it changes.

## Where does Copilot fall short?

Microsoft is direct about the limits. In the semantic-model documentation, it warns that without proper preparation Copilot mainly produces low-quality and inaccurate outputs that might be incorrect or even misleading, and that even with good prompts you can get inaccurate results because the model is nondeterministic and not guaranteed to be correct.

Specific issues the documentation lists:

- **Ambiguous language.** Asking for "profit %" might return profit values instead of a percentage.
- **Naming problems.** Poor naming conventions confuse Copilot, and identical field names across tables create ambiguity.
- **Complex patterns.** Currency conversion, field parameters and disconnected tables can cause failures. Microsoft suggests documenting recommended and discouraged usage for them.
- **DAX weaknesses.** Copilot can struggle with variables that are declared and then reused, and has limited training on newer DAX functions.
- **Live connections.** When connected live to a shared model, Copilot cannot see measure DAX expressions or hidden and private objects.
- **Hidden content.** Hidden fields, hidden report pages, tables marked private and DAX comments are excluded from what Copilot reads.
- **Long chats.** A long conversation history can produce unexpected results, and closing and reopening the pane is the suggested fix.

## How do you prepare a model for Copilot?

Microsoft's own list is essentially good data-modeling hygiene:

1. **Use a star schema** with consistent, human-readable names, and hide columns and measures that users should not query.
2. **Fill in descriptions** for tables, columns and measures. Copilot reads the first 200 characters, so put the essential definition first.
3. **Set data types, format strings and data categories** correctly.
4. **Add synonyms** through the Q&A linguistic model so business terms map to the right fields.
5. **Simplify** overly complex models and test them with realistic questions.
6. **Label readiness.** Microsoft suggests tagging models as ready for Copilot, or making readiness a criterion for endorsed or certified status.

This ties directly to two of my earlier posts: [why AI analysts fail on bad metric definitions](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/why-ai-analysts-fail-on-bad-metric-definitions/) explains why unclear definitions produce confident wrong answers, and [a Git, GitHub and LLM workflow for Power BI DAX and M](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/git-github-llm-power-bi-dax-m-workflow/) covers keeping model changes reviewable.

## Is this only a Power BI problem?

No. A benchmark from dbt Labs, published in April 2026, compared an LLM writing raw SQL against a modeled semantic layer on the same questions. With the modeled semantic layer, accuracy was 98.2% for one model and 100% for another, against 90.0% and 84.1% for text-to-SQL on the same data.

Read that with care. It was run by a vendor that sells semantic-layer tooling, on one insurance-themed dataset with 11 questions, and the authors note that loading the entire schema as context is impractical for larger datasets. The useful takeaway is the failure mode they describe: text-to-SQL fails with a plausible but wrong answer, while a semantic layer tends to fail with an error. For BI, that suggests investing in well-defined, governed measures before investing in a chat interface on top of them.

## A simple test before you roll it out

This is my suggestion, not a Microsoft recommendation. Before enabling Copilot for business users on a model:

1. Write 20 to 30 real questions users would ask, with the correct answer worked out by hand or from a trusted report.
2. Ask each question in Copilot, in a fresh chat, and record whether the answer is right, wrong, or refused.
3. Repeat the test after any model change, and again on a different day, since the output is nondeterministic.
4. Fix the wrong answers by improving names, descriptions and measures, not by coaching users to phrase things around the problem.

If you cannot get acceptable results on your most important questions, that is a finding about your model, and worth knowing before users find it for you.

## Frequently asked questions

**Do I need Fabric or Premium capacity to use Copilot in Power BI?**
Yes. Microsoft's documentation requires F2 or higher, or P1 or higher, and says trial capacities and free SKUs are not supported.

**Can Copilot replace a BI developer?**
Not on the evidence in the documentation. It speeds up drafting and description writing, but Microsoft itself says outputs can be incorrect and should be critically appraised.

**Does Copilot see my hidden measures?**
No. Hidden fields, hidden report pages and private tables are excluded from Copilot's context.

**Will it write correct DAX?**
Sometimes. Review every generated query. Newer functions, reused variables and complex patterns are the documented weak spots.

## Sources

- [Microsoft Learn: Copilot for Power BI overview and requirements](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction)
- [Microsoft Learn: Use Copilot with semantic models in Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-semantic-models)
- [dbt Developer Blog: Semantic layer vs. text-to-SQL, 2026 benchmark update](https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026)

*Last reviewed: 20 September 2026.*
