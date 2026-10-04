---
title: "Spec-Driven Development with Claude Code: My Setup"
description: "How I use spec-driven development with Claude Code to build a real site: the six docs, the rules that keep chat out of them, and a real session."
pubDate: 2026-10-10T09:00:00.000+02:00
tags:
  - claude code
  - ai for analysts
  - workflow
  - spec-driven development
draft: true
---
> **Short answer:** Spec-driven development means you write down what you want built (the spec) and how you will build it (the plan) before the AI writes any code, and you keep those documents as the source of truth. With Claude Code, that is a handful of Markdown files in the project, plus one rule: nothing said in a chat counts until it is written into one of them.

If you've used an AI coding assistant for more than an afternoon, you've probably had this moment: three sessions in, the assistant confidently rebuilds something you decided against on day one. It isn't being stubborn. It just never knew. The decision lived in a chat that is long gone.

This post is how I avoid that. It's the actual setup behind this website, which I build with [Claude Code](/blog/claude-code-for-data-analysis-a-beginner-setup/): the documents, the rules, and what a working session looks like.

<!-- ANTHONY: add a real story here, e.g. the moment you decided you needed this, or a time the AI undid a decision -->

## What is spec-driven development?

Spec-driven development is an old idea with a new reason to exist. You describe the behaviour you want in writing, agree on it, then build against it. Engineers have done versions of this for decades with requirements documents and design reviews.

What changed is who reads the documents. An AI assistant starts every session with no memory of the last one, unless something tells it. A spec is that something. Think of it as the handover note you'd leave a colleague covering your desk for a week, except the colleague arrives every morning.

The popular write-ups describe the same loop: spec, then plan, then code, with a human review between each step. Open-source kits such as GitHub's Spec Kit package it up. You don't need a kit to start, though. Six Markdown files did it for me.

## Which documents do I keep?

Each file has one job. Mixing jobs is how documents rot.

| File | Job | Changes how often |
|---|---|---|
| `CLAUDE.md` | Scope and non-goals: what this project is and is not | Rarely |
| `plan.md` | Phased roadmap with checkboxes | Every few weeks |
| `architecture.md` | How the system fits together | When the design changes |
| `specs/*.md` | One file per feature: behaviour, data shape, edge cases | When a feature changes |
| `decisions.md` | Decision log: what we chose, what we rejected, why | Append-only |
| `todo.md` | This week's checklist | Every session |

`CLAUDE.md` is special because Claude Code reads it automatically at the start of every session. Mine is short. It says what the site is, lists the non-goals ("no database, no server-side runtime", "no blog translation"), and points to the other files.

The non-goals do more work than you'd expect. Without them, a helpful assistant will happily suggest a database "for scalability" on a static site that gets a few hundred visits a day.

`decisions.md` is the one most people skip, and the one I'd keep if I could only keep one. Each entry records the context, the options, the choice and the consequences. When an idea comes back three weeks later, the answer is already written: we considered that, here's why we said no, here's what would change our mind.

## What is the rule that makes it work?

The rule: **chat is exploration, documents are truth.**

A conversation contains brainstorming, half-ideas, questions and things we explicitly rejected. None of that should become canon just because it was said. So the layers stay separate:

- **Chat** is where we think out loud.
- **Requirements** (`plan.md`, `CLAUDE.md`) hold approved intent.
- **Specs** (`architecture.md`, `specs/`) hold approved behaviour.
- **Code** implements the spec.

I put this rule in my global Claude Code instructions, so it applies to every project, not just this one. It tells the assistant to read the relevant docs before proposing anything, to flag when a request changes scope or contradicts a recorded decision, and to ask before editing a canonical doc.

That last part matters. If the assistant silently edits the spec to match whatever it just built, you have a spec that documents bugs.

## What does a session look like?

Here's a real, unglamorous example: adding dates to the blog's sitemap so search engines know which posts changed.

1. **Start from the docs.** The assistant reads `todo.md` and `plan.md` and tells me where we are. No re-explaining.
2. **Bring the input.** In this case, a Search Console export. The assistant analyses it and proposes fixes, with the docs they touch.
3. **Approve or reject.** I say yes to some, no to others. Rejected ideas stay in the chat. They never reach a doc.
4. **Build in small commits.** One change per commit, each with a message that says why, not just what.
5. **Verify for real.** Build the site, check the output, and after deploy, fetch the live page. "The build passed" is not the same as "it works".
6. **Close the loop.** Tick the item in `todo.md`, and if behaviour changed, update the spec in the same change. If it was a real design choice, add an entry to `decisions.md`.

Step 6 is where the method earns its keep. In the session I'm describing, ranking related posts by relevance instead of date changed documented behaviour. So the spec line that said "newest first" changed with it. Next session, nobody (human or AI) has to guess which is right.

## What does a good spec look like?

Shorter than you think. A spec is not a novel; it's the answers to the questions someone would otherwise ask you. Mine usually have four parts:

```markdown
# Feature: Free tool share bar

## Behaviour
- Every tool page and blog post shows: share (LinkedIn, X, email),
  copy link, add to favourites.
- No third-party widgets or tracking scripts.

## Data / inputs
- Page URL and title only.

## Edge cases
- Clipboard API blocked: fall back to a selectable text field.

## Out of scope
- Share counts.
```

"Out of scope" is the line that saves the most time. It stops the assistant from building the clever extra you didn't ask for.

## Where does this go wrong?

It's not free, and it's not magic. The honest limits:

- **It's overhead for tiny jobs.** A one-off script doesn't need five documents. I use judgement: anything with more than one session of work gets the docs; a throwaway doesn't.
- **Docs drift if you let them.** The method only works if updating the doc is part of "done". The day you skip it is the day the doc starts lying.
- **The assistant still makes mistakes.** A spec reduces wrong guesses; it doesn't remove them. You still review every change. I've written separately about [how to validate AI output before it reaches anyone important](/blog/how-to-validate-ai-generated-analysis-before-it-reaches-your-boss/), and the same habits apply to code.
- **A spec can be wrong.** Writing it down makes a bad idea easier to spot, but it doesn't make it a good idea.

<!-- ANTHONY: add a real "I got this wrong once" moment here, e.g. a session where you skipped the docs and paid for it -->

## Is this only for developers?

No, and this is the part I find most interesting for analysts. A metric definition document is a spec. A dashboard requirements page is a spec. "Out of scope" is the sentence every analyst wishes stakeholders had written before asking for "one more cut of the data".

If you already keep a [metric definition doc](/blog/metric-definition-doc-with-a-template/), you're halfway there. The same discipline that stops an AI from rebuilding the wrong feature also stops it from using [the wrong definition of revenue](/blog/why-ai-analysts-fail-on-bad-metric-definitions/).

My take: start with just `CLAUDE.md` and a `decisions.md`. Add the rest when you feel the pain they solve. If your project lasts a weekend, skip all of it and enjoy the weekend.

*Sources: [Claude Code documentation](https://code.claude.com/docs/en/overview) for how `CLAUDE.md` is loaded; [DataCamp: Spec-Driven Development with Claude Code](https://www.datacamp.com/tutorial/spec-driven-development-with-claude-code) for the spec, plan, code loop. The document set and the rules are my own setup.*
