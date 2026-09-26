---
title: Data Storytelling for Non-Technical Stakeholders
description: How to present analysis so busy, non-technical people act on it. A
  simple structure, slide habits, and the mistakes that make good analysis get
  ignored.
pubDate: 2026-09-26T09:47:00.000+02:00
tags:
  - data storytelling
  - communication
  - stakeholders
  - data analytics
draft: false
---

> **Short answer:** Lead with the answer, not the method. Say what happened, why it matters and what you recommend, in that order, in the words your audience uses. Put the detail in an appendix. A good analysis that nobody acts on has not done its job.

You spent two days on the analysis. You present it in five minutes. The first slide is the data source, the second is the methodology, and by the third slide the sales director is checking their phone. Sound familiar? I have been the person presenting that deck.

<!-- ANTHONY: add a real story here (a presentation that landed, or one that fell flat, and what you changed) -->

Data storytelling sounds fluffy, but it is the practical skill of getting a decision out of your findings. Databricks' [overview of data storytelling](https://www.databricks.com/blog/what-is-data-storytelling) describes it as the structured combination of data, visuals and narrative. Here is how I make it work in practice.

## What is a story structure that works?

Frameworks come in many names. A [Statsig piece on communicating with non-technical teams](https://www.statsig.com/perspectives/from-data-to-decisions-how-to-communicate-findings-to-non-technical-teams) and others describe similar shapes: a beginning that sets the context, a middle with the insight and a close that calls for action. A simple three-step version is sometimes called "so what?": what happened, why it matters, and what should happen next.

I use this skeleton:

1. **The answer first.** "Conversion dropped 12% in Germany last month, and almost all of it comes from mobile checkout."
2. **The evidence.** One or two visuals that prove the claim. No more.
3. **The reason it matters.** In money, customers or time, not in statistics.
4. **The recommendation.** One clear ask, with an owner and a date.
5. **What we don't know.** Honest caveats, in one line.

Then the appendix holds the method, the queries and the extra charts. The [validation checklist](/blog/how-to-validate-ai-generated-analysis-before-it-reaches-your-boss/) belongs in your prep, not in your slides.

## How do I match the audience?

The same finding needs different stories for different people.

| Audience | What they want | How to tell it |
| --- | --- | --- |
| Executive | The decision and the money at stake | One slide, one number, one ask |
| Manager | What to do differently | Three findings and the actions that follow |
| Peer analyst | How you got there | Method, assumptions, a look at the query |
| Customer-facing team | What to say to customers | Plain language and examples |

Adjust depth, vocabulary and focus for each. The same message lands better when the audience can act on it with confidence.

## What slide habits make a difference?

- **Write the headline as the conclusion.** Not "Monthly conversion by country", but "German mobile conversion fell 12% in August". The title should be the takeaway.
- **One message per chart.** If you need to explain what the chart shows, simplify it.
- **Highlight the point.** Grey out everything else and colour the one line or bar you want people to see.
- **Cut the decoration.** Gridlines, 3D effects and rainbow palettes cost attention and add nothing.
- **Use their words.** If the business says "orders", don't say "transactions". Skip jargon such as "p-value" or "cohort" unless you explain it in a sentence.
- **Show scale and context.** A 12% drop means little without knowing whether normal noise is 2% or 10%. For help, see [six statistical functions every analyst should know](/blog/statistical-functions-every-data-analyst-should-know/).

## How do I explain uncertainty without losing them?

Say the range in plain language: "We think the effect is between 3% and 9%, and our best guess is 6%." Then say what would change your mind. Being straightforward about limits builds trust. People remember the analyst who said "I'm not sure yet, and here is how we will find out".

## What if they disagree with the numbers?

- Ask which number they expected, and why. It often reveals a different definition. That is a job for a [metric definition doc](/blog/metric-definition-doc-with-a-template/).
- Don't defend. Ask "what would you need to see to be convinced?"
- Offer to follow up with the detail. Don't derail the meeting to check a query.

## What are the common mistakes?

1. **Starting with the method.** Nobody asked how you built it yet.
2. **Too many charts.** Each extra visual dilutes the one that matters.
3. **No recommendation.** "Here are the findings" leaves the work to the audience.
4. **Burying the caveat** or leaving it out. If it changes the decision, say it early.
5. **Presenting unchecked AI output.** It costs you credibility fast.

My opinion: the analyst who can explain a modest finding clearly beats the one with a brilliant finding nobody understood. If your audience is a peer who wants to see the SQL, skip the story and show the query.

A dashboard is a story that people have to read without you in the room, which is a harder job. I cover that in [building a KPI dashboard people actually open](/blog/kpi-dashboard-best-practices-people-actually-open/).

*Sources: [Databricks: What is Data Storytelling?](https://www.databricks.com/blog/what-is-data-storytelling), [Statsig: From data to decisions, how to communicate findings to non-technical teams](https://www.statsig.com/perspectives/from-data-to-decisions-how-to-communicate-findings-to-non-technical-teams). The audience table, slide habits and example headlines are my own and illustrative.*
