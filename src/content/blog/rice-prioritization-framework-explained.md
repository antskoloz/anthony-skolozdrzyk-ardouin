---
title: "RICE Prioritization: Scoring a Roadmap Without Bias"
description: How the RICE scoring framework works, a worked example ranking
  three features, and where it breaks down as a decision tool.
pubDate: 2026-09-26T18:30:00.000+02:00
tags:
  - product management
  - prioritization
  - rice framework
  - data analytics
draft: false
---
> **Short answer:** RICE scores each roadmap idea as `Reach × Impact × Confidence ÷ Effort`, forcing you to write down explicit assumptions about how many people it affects, how much it helps, how sure you are, and how much work it takes — instead of arguing from whoever's opinion is loudest in the room. It's a structuring tool for the debate, not a replacement for judgment.

Every roadmap meeting has the same underlying problem: everyone has an opinion about what to build next, and opinions don't have units you can compare. RICE gives the comparison units, even if the numbers going in are still someone's estimate.

## What does each factor mean?

- **Reach** — how many people or events this affects in a period, typically per quarter. A concrete count (customers affected, sessions impacted), not a vague sense of scale.
- **Impact** — how much it helps each person it reaches, scored on a fixed scale: 3 (massive), 2 (high), 1 (medium), 0.5 (low), 0.25 (minimal).
- **Confidence** — how sure you are about the Reach and Impact estimates, as a percentage. Lower confidence should pull the score down, reflecting genuine uncertainty rather than just optimism.
- **Effort** — the cost to build it, in person-months. Larger effort divides the score down, so a huge Reach/Impact idea that also takes a huge amount of work doesn't automatically win.

```
RICE score = (Reach × Impact × Confidence) ÷ Effort
```

## Worked example

Three feature ideas, one quarter:

| Feature | Reach | Impact | Confidence | Effort | Score |
| --- | --- | --- | --- | --- | --- |
| Onboarding redesign | 5,000 | 2 | 80% | 3 | (5,000 × 2 × 0.8) / 3 ≈ **2,667** |
| New integration | 800 | 3 | 50% | 2 | (800 × 3 × 0.5) / 2 = **600** |
| Small UI polish | 10,000 | 0.5 | 100% | 0.5 | (10,000 × 0.5 × 1.0) / 0.5 = **10,000** |

The UI polish scores highest, purely because it reaches almost everyone, costs almost nothing, and the team is fully confident it works — even though its per-person impact is small. This is exactly what RICE is supposed to surface: a low-effort, high-reach, high-confidence idea can rank above a flashier one that's expensive and uncertain, and that's often the right call for a given quarter, even if it doesn't feel as exciting in a roadmap review.

## Where does RICE break down?

1. **Confidence can hide bias instead of correcting for it.** A team excited about an idea can rate their own confidence at 100% without much basis for it, which defeats the purpose of the factor entirely. Confidence should reflect actual evidence (user research, a small test, prior data), not enthusiasm.
2. **Effort estimates are frequently wrong**, and RICE has no mechanism for catching that in advance — it only tells you the ranking implied by the estimate you gave it, not whether the estimate itself was realistic.
3. **It doesn't capture strategic or must-do work.** A compliance requirement or a fix for a deal-breaking bug may score low on RICE while being non-negotiable. RICE ranks discretionary work; it isn't designed to override a genuine must-do.
4. **It compares ideas that were scored by the same process, at the same rigor.** If one idea's Reach was carefully researched and another's was guessed in five minutes, the resulting comparison is comparing different qualities of estimate, not different ideas fairly.

## How does RICE differ from ICE?

ICE simplifies it further: `Impact × Confidence × Ease`, each scored on a fixed 1-10 scale, with no separate Reach factor. It's faster to fill in and useful for a quick gut-check pass, but it folds "how many people" into "impact" implicitly, which can undercount a low-per-person-impact idea that reaches everyone, the exact case the UI polish example above illustrates. RICE is worth the extra input when the decision matters enough to justify the extra ten minutes of estimation.

## What should I actually do with this?

1. Use RICE to structure the debate, not to end it silently — a low score is a reason to ask "why do we still think this matters?", not an automatic veto.
2. Push back on confidence ratings that aren't backed by anything concrete.
3. Track roadmap items that were done despite a low RICE score (strategic, compliance, urgent fixes) separately, so the framework isn't quietly discredited by exceptions nobody wrote down.
4. Revisit scores when a real assumption changes — a Reach or Effort estimate that turns out to be wrong should update the score, not just get forgotten once the ranking is set.

A [free RICE/ICE prioritizer](https://anthonysko.com/projects/rice-prioritizer/) scores and ranks a list of ideas with either method, including a paste-from-spreadsheet option and a downloadable ranked CSV, so the scoring itself takes minutes rather than a spreadsheet built from scratch each quarter.
