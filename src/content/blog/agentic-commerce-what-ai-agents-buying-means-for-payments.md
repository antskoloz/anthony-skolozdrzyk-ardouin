---
title: "Agentic Commerce: What AI Agents Buying Means for Payments"
description: "AI agents that shop and pay for customers are coming to checkout. See the forecasts, the protocols, early results, and what payment teams should prepare."
pubDate: 2026-10-18
tags: ["payments", "agentic commerce", "ai", "e-commerce"]
draft: true
---

> **Short answer:** Agentic commerce means AI agents that search, choose and pay on a customer's behalf. McKinsey sees a $3 trillion to $5 trillion global opportunity by 2030, and new protocols from OpenAI with Stripe and from Google now define how agents get permission to pay. Early results are mixed: Forrester reports one flagship in-chat checkout converted three times worse than sending shoppers to merchant sites. Payment teams should prepare now, and keep expectations realistic.

Payments were built around a human clicking "Pay." When an AI agent does the clicking, a few basic questions change: who gave permission, who is liable if something goes wrong, and how a merchant knows the request is genuine. This post lays out what has been published, what early data shows, and what to ask your payment provider.

## What is agentic commerce?

McKinsey defines it as "shopping powered by intelligent AI agents capable of anticipating, personalizing, and automating every step of the process to create frictionless, proactive experiences." More fully, AI anticipates consumer needs, navigates shopping options, negotiates deals, and executes transactions, in alignment with human intent yet acting independently.

*Source: [McKinsey: The agentic commerce opportunity](https://mckinsey.com/capabilities/quantumblack/our-insights/the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants), Schumacher, Roberts and Giebel, 17 October 2025.*

## How big could it get?

McKinsey's forecast, for 2030:

| Scope | Estimated opportunity to orchestrate revenue |
| --- | --- |
| US B2C retail | $900 billion to $1 trillion |
| Global | $3 trillion to $5 trillion |

McKinsey adds that the figures reflect goods only, so they exclude services and the large B2B marketplace. Note the wording: this is an opportunity to orchestrate revenue, not a forecast of payments volume already committed.

The same report cites McKinsey survey findings that half of all consumers now use AI when searching the internet, and that 44% of users who have tried AI-powered search say it has become their primary and preferred source, compared with 31% who prefer traditional search.

## How do agents get permission to pay?

Two protocols launched in September 2025:

- **Agent Payments Protocol (AP2), Google, 16 September 2025.** An open protocol for agent-led payments across platforms. It uses "Mandates," which Google describes as tamper-proof, cryptographically signed digital contracts. An **Intent Mandate** captures the user's request, a **Cart Mandate** records the exact items and price the user approved, and a **Payment Mandate** links the payment method to that verified cart. Google says AP2 addresses authorization, authenticity and accountability, works with cards, stablecoins and real-time bank transfers, and launched with more than 60 collaborating organizations.
- **Agentic Commerce Protocol (ACP), OpenAI with Stripe, 29 September 2025.** An open standard behind ChatGPT's Instant Checkout. OpenAI says merchants remain the merchant of record across the purchase journey, users explicitly confirm each step, and only the information required to complete the order is shared with the merchant. At launch it supported US Etsy sellers and more than one million Shopify merchants.

*Sources: [Google Cloud: Announcing Agents to Payments (AP2)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol), [OpenAI: Buy it in ChatGPT](https://openai.com/index/buy-it-in-chatgpt/).*

## What have early results shown?

Forrester's analysis of agentic payments in B2C commerce gives a more cautious picture than the forecasts:

- It reports "three times lower conversion rates" for products sold directly inside the ChatGPT chatbot than for those that required clicking out.
- It reports that OpenAI is shutting down Instant Checkout in favor of its ChatGPT Apps strategy.
- It cites Walmart pilot data, as reported by The Tech Buzz, in which users of Walmart's Sparky assistant convert at roughly 70% of the rate of users on Walmart.com directly.
- It notes Mastercard and Santander completed what they described as Europe's first live end-to-end transaction executed by an AI agent, using the bank's live payment infrastructure and Mastercard Agent Pay in a controlled environment. That was not a commercial rollout.

*Source: [Forrester: Agentic Payments In B2C Commerce: Where We Are Now](https://www.forrester.com/blogs/agentic-payments-in-b2c-commerce-where-we-are-now).*

The takeaway: the infrastructure is arriving faster than proven consumer demand. Some of this is secondhand, such as the Walmart figure, so re-check figures at the source before quoting them.

## What does this change for payment teams?

These are my views on where to look first, not findings from the sources above.

1. **Authorization and consent.** With human checkout, consent is a click. With agents, it is a chain: the user's instruction, the agent's action, the merchant's acceptance. Protocols like AP2 aim to make that chain verifiable. Ask your provider which protocols they support.
2. **Fraud models.** A legitimate agent may not look like a typical shopper: no mouse movement, unusual device, fast execution. Fraud rules tuned on human behavior could produce false declines. Review your rules with this in mind, and see [Why False Declines Cost E-commerce More Than You Think](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/why-false-declines-cost-ecommerce-more-than-you-think/).
3. **Credentials.** Agents should not handle raw card numbers. Tokenized credentials are a natural fit. See [Network Tokens and Authorization Rates](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/network-tokens-authorization-rates-what-the-data-says/).
4. **Liability and disputes.** AP2 explicitly raises the question of accountability when a transaction is fraudulent or wrong. Ask how chargebacks and disputes will work for agent-initiated orders.
5. **Measurement.** Tag agent-originated traffic so you can measure its conversion, approval rate and refund rate separately from human checkouts.

## A simple readiness checklist

| Question | Why it matters |
| --- | --- |
| Does my payment provider support an agent protocol? | Determines whether you can accept agent purchases at all |
| Can I identify agent-originated orders? | Needed to measure performance and tune fraud rules |
| Are stored credentials tokenized? | Reduces exposure when agents transact on a customer's behalf |
| Is my product data structured and accurate? | Agents choose from the data you provide |
| Do my terms and dispute process cover agent purchases? | Avoids surprises on liability |

## Frequently asked questions

**Is agentic commerce live today?**
Partly. Protocols and pilots exist, and there have been live transactions, but Forrester's review suggests consumer adoption is still early and results are mixed.

**Do I need to change my checkout now?**
Probably not urgently. Track the protocols your provider supports and start measuring agent traffic before making larger changes.

**Who is liable if an agent buys the wrong thing?**
This is unsettled. AP2 highlights accountability as an open problem and uses signed mandates to create an audit trail. Ask your provider and card acquirer how disputes are handled.

**Does agentic commerce replace cards?**
Not by itself. AP2 supports cards, stablecoins and real-time bank transfers. Which methods agents prefer will depend on cost, speed and consumer protections.

## Sources

- [McKinsey: The agentic commerce opportunity (October 2025)](https://mckinsey.com/capabilities/quantumblack/our-insights/the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants)
- [Google Cloud: Announcing Agents to Payments (AP2)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)
- [OpenAI: Buy it in ChatGPT](https://openai.com/index/buy-it-in-chatgpt/)
- [Forrester: Agentic Payments In B2C Commerce: Where We Are Now](https://www.forrester.com/blogs/agentic-payments-in-b2c-commerce-where-we-are-now)

*Last reviewed: 19 September 2026. This field is moving quickly, so check for newer protocol and pilot announcements.*
