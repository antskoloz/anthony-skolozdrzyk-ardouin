---
title: "Why LLMs Hallucinate Numbers in Analytics (and How to Catch It)"
description: LLMs predict plausible text, not computed results. See why they
  invent numbers in analytics work, the patterns to watch for, and how to
  catch it before it reaches a report.
pubDate: 2026-09-26T13:00:00.000+02:00
tags:
  - ai
  - data analytics
  - llm
  - data quality
draft: false
---
> **Short answer:** An LLM without a tool connected to your actual data is predicting the most plausible next words, not computing an answer from your numbers. It can state a wrong figure with exactly the same confident tone as a correct one. Treat any specific number an LLM states without showing you the query or calculation behind it as unverified until you check it.

The uncomfortable part of using an LLM for analytics isn't that it's sometimes wrong. It's that being wrong looks identical to being right, because the model isn't distinguishing between the two while it writes.

## Why does this happen?

A language model generates text by predicting what's likely to come next, based on patterns learned from training data. When you ask "what's a typical conversion rate for e-commerce checkout?", it isn't looking up your data or even a specific source by default — it's producing a number that's statistically plausible given everything it's seen phrased like that question. That can be a genuinely reasonable estimate, or it can be an average blurred across a hundred different contexts that doesn't apply to your case at all, and there's no internal signal distinguishing the two for the model itself.

This is different from an LLM that's connected to a tool: an assistant that can run SQL against your warehouse, execute Python, or read an actual file is computing a real answer from real data. The hallucination risk is specifically about numbers stated from the model's own generation, without a tool call backing them.

## What patterns should I watch for?

- **Suspiciously round or "clean" numbers.** A model asked for a percentage will often produce something like 23% or 67% — plausible-looking, specific-sounding, but not tied to any actual calculation.
- **Confident citations of benchmarks it can't have looked up.** "Industry average churn is 5%" stated with no source and no tool call is a guess dressed as a fact.
- **Correct-sounding logic with a wrong final number.** The reasoning steps can be sound while the arithmetic or a remembered constant partway through is subtly wrong, especially in longer calculations done without a code execution tool.
- **Confusing similarly named metrics.** Gross margin vs net margin, MRR vs ARR, median vs average — the model can use the wrong one interchangeably while sounding equally sure either way.
- **Numbers that don't change when you change the input.** If you alter a key detail in your question and the "answer" stays suspiciously similar, that's a sign it was never actually derived from your specifics in the first place.

## How do I catch it before it reaches a report?

1. **Ask for the query or the calculation, not just the number.** "Show me the SQL you used" or "show your work" turns an unverifiable claim into a checkable one. If the model can't produce the steps, that's itself informative.
2. **Re-run it yourself.** For anything that will go in front of a stakeholder, re-execute the query or recompute the figure independently rather than trusting the stated result.
3. **Cross-check with a second method.** If a number can be derived two different ways (a ratio and its inverse, a total and a sum of parts), check that both agree.
4. **Be more suspicious of numbers with no source than numbers with a wrong-looking source.** A model that cites nothing gives you no way to verify; at least a stated (even if outdated) source gives you something to check against.
5. **Watch for confidence, not correctness, as the tell.** The model's tone doesn't correlate with accuracy. Don't let a well-written, assured answer substitute for verification.

## How do I reduce hallucination in the first place?

- **Give it your actual data through a tool**, rather than asking it to recall or estimate. An assistant with SQL or code execution access is answering from your numbers, not its training data.
- **Ask it to compute step by step, and check the intermediate steps**, not just the final answer. Errors often show up earlier in the chain than the final line.
- **Provide the definitions it needs.** A lot of "hallucination" in analytics is really the model guessing at a metric definition you never gave it. See [Why AI analysts fail on bad metric definitions](/blog/why-ai-analysts-fail-on-bad-metric-definitions/) — the model isn't inventing numbers out of nowhere so much as filling a gap you left open.
- **Use retrieval over memory for anything that must be current or organization-specific.** A model's training data has a cutoff and no visibility into your systems by default; anything it "knows" about your business specifically is either from context you gave it or an educated guess.

My take: the fix isn't distrusting every number an LLM produces equally — it's knowing which numbers came from a tool call against real data and which came from generation, and holding only the second category to a higher bar of verification. For a fuller checklist on validating AI output before it reaches a stakeholder, see [How to validate AI-generated analysis before it reaches your boss](/blog/how-to-validate-ai-generated-analysis-before-it-reaches-your-boss/), and for getting SQL specifically right the first time, [Prompting an LLM for SQL you can trust](/blog/prompting-an-llm-for-sql-you-can-trust/).
