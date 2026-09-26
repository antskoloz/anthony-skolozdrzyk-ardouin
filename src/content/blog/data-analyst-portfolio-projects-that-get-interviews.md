---
title: "Data Analyst Portfolio Projects That Get Interviews"
description: "What hiring managers look for in a data analyst portfolio, how to choose three strong projects, and how to present each one around a business problem."
pubDate: 2026-09-26T12:40:00.000+02:00
tags:
  - data analyst portfolio
  - career
  - hiring
  - data analytics
draft: true
---

> **Short answer:** Build a few projects, not many. Each one should start from a business problem, show how you cleaned the data, state the insight and a recommendation, and admit its limits. Publish it with a clear write-up, because a hiring manager will skim it in under a minute.

A portfolio is not a museum of every tutorial you completed. It is a small set of proofs that you can take a messy question, work through the data and communicate something a business could act on. Here is how I would build one, and how I look at them when the shoe is on the other foot.

<!-- ANTHONY: add a real story here (a portfolio or project that impressed you, or a common mistake you see when reviewing candidates) -->

The advice below combines what hiring-focused guides say with my own view of what makes analysis credible. Where it is my opinion, I say so.

## What do hiring managers actually look for?

Articles aimed at job seekers, such as [Noetify's guide](https://www.noetify.app/blog/data-analyst-portfolio-projects-that-get-interviews) and [Careery's](https://careery.pro/blog/data-analyst-careers/data-analyst-portfolio-projects), converge on a few points:

- They want to see that you can **think analytically, communicate clearly and add value.** The number of projects and the complexity of the code matter less.
- Recruiters commonly look for four things: **data wrangling, visualisation, modelling and communication.**
- **Lead with the business problem, not the dataset.** Recruiters skim, so the impact must be visible before the code.
- **Quality beats quantity.** Three well-done projects outperform eight rushed ones.
- Many hiring managers check **GitHub** before an interview, and a repository with no documentation makes a poor impression.

I agree with all of this, and I would add one thing: show your judgement. Where did you choose not to do something, and why?

## Which three projects should I build?

Cover different skills so the set is balanced, and tailor them to the jobs you want. Read a few job postings and note the tools they mention. SQL and Python appear in most, with Excel and a BI tool such as Power BI or Tableau completing the toolkit, according to those same guides.

A balanced trio:

1. **A SQL-heavy analysis.** Take a public dataset and answer a business question, such as retention, funnel drop-off or revenue drivers. Show your queries. The [SQL cheat sheet](/blog/sql-cheat-sheet-for-data-analysts-15-queries-you-will-reuse/) and [cohort retention in SQL](/blog/cohort-retention-analysis-in-sql-step-by-step/) cover useful patterns.
2. **A dashboard.** Build a report with a real audience in mind, on a clean model. See [building a KPI dashboard people actually open](/blog/kpi-dashboard-best-practices-people-actually-open/) and the [star schema walkthrough](/blog/power-bi-star-schema-for-beginners/).
3. **A messy-data project.** Start with dirty data, and document what you found and fixed: [duplicates](/blog/find-and-fix-duplicate-rows-in-sql/), missing values, odd dates. Cleaning is most of the job, and showing it is a strength.

If you want a fourth, a small experiment or statistics analysis, such as an A/B test read-out, shows rigour.

## How should I structure each project?

Use the same template every time so a reviewer knows where to look:

1. **The business question** in one sentence.
2. **The data:** source, size, and any caveats.
3. **The approach:** the main steps, briefly.
4. **The findings:** two or three, each with one chart.
5. **The recommendation:** what the business should do.
6. **Limitations:** what you couldn't tell, and what you'd do next.
7. **Links:** code, dashboard and a one-page summary.

Guides list the same components: business objective, cleaning process, insights, recommendations, limitations and accessible files. Writing it like a short case study, using the approach in [data storytelling](/blog/data-storytelling-for-non-technical-stakeholders/), is more impressive than a notebook full of code cells.

## What makes a project stand out?

- **A real question,** ideally one you care about. "What drives late deliveries?" beats "Analysis of dataset X".
- **A clear recommendation,** not just a chart.
- **Honest limits.** Saying what your analysis can't prove signals maturity.
- **Definitions.** State how you defined each metric. A [metric definition](/blog/metric-definition-doc-with-a-template/) in miniature shows you understand why numbers get disputed.
- **A readable README.** Make the first screen of your repository count.
- **Something tested.** If you used AI to help, say so and show that you checked the output, as in [validating AI-generated analysis](/blog/how-to-validate-ai-generated-analysis-before-it-reaches-your-boss/).

## What should I avoid?

- **The same tutorial datasets** as every other applicant, presented without a new angle. Titanic and Iris are fine for learning and dull in a portfolio.
- **Code dumps** with no explanation.
- **Too many projects,** many unfinished.
- **Vague claims** such as "improved sales by 30%" on invented data. Don't fabricate impact. Say clearly what is real and what is illustrative.
- **Copying** someone's project. Interviewers will ask you to explain your choices.

## How do I present it?

Put a short summary of each project on a single page, a personal site or a LinkedIn Featured section, with links to the detail. Lead with one sentence about the business problem and the result. Keep the list to three projects, so the reviewer sees quality at a glance.

My opinion: the best portfolio question to answer is "what would this person be like to work with?" Clear writing, sensible scope and honesty about limits tell a hiring manager more than an impressive model does. If you already have solid professional experience, a smaller portfolio backed by concrete stories from work may serve you better.

*Sources: [Noetify: Data analyst portfolio projects that get interviews](https://www.noetify.app/blog/data-analyst-portfolio-projects-that-get-interviews), [Careery: Data Analyst Portfolio Projects That Actually Get You Hired](https://careery.pro/blog/data-analyst-careers/data-analyst-portfolio-projects), [Dataquest: 20 Data Analyst Projects to Build Your Portfolio](https://www.dataquest.io/blog/data-analyst-projects-for-beginners/). The project trio and the template are my own suggestions.*
