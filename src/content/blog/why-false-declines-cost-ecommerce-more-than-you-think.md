---
title: Why False Declines Cost E-commerce More Than You Think
description: False declines turn good customers away. See what the data says
  about their cost, why they happen, and how to measure and reduce them in
  e-commerce.
pubDate: 2026-09-19T10:02:00.000+02:00
tags:
  - payments
  - false declines
  - authorization rate
  - e-commerce
draft: false
---

> **Short answer:** A false decline is a legitimate purchase that gets refused. PYMNTS reports that 47% of merchants say false declines cost them sales and puts the industry-wide loss at an estimated $50 billion. Because most issuer declines carry a vague code, the fix starts with measuring declines by reason, not just by total.

Most payment teams watch fraud losses closely. Fewer watch the customers who were never allowed to pay in the first place. In this post I walk through what a false decline is, what the numbers say, and a simple way to size the problem for your own store.

## What is a false decline?

A false decline happens when a genuine customer with a valid payment method is refused. The refusal can come from the issuing bank, from the card network, or from your own fraud tooling.

It differs from a *true* decline, such as a card with insufficient funds or one reported stolen. In those cases the system did its job. In a false decline, the customer wanted to pay, could have paid, and left without buying.

## How big is the problem?

Three figures give a sense of scale. They come from a PYMNTS report published in March 2026, which draws on its December 2025 study *Orchestrating Trust*:

| Finding | Figure |
| --- | --- |
| Merchants who say false declines cost them sales | 47% |
| Legitimate orders estimated to be wrongly declined as fraudulent | about 5% |
| Estimated revenue lost industry-wide to false declines | $50 billion |
| Merchants who cite stopping fraud without hurting customer experience as their top challenge | 85% |

*Source: [PYMNTS, March 2026](https://www.pymnts.com/cybersecurity/fraud-prevention/2026/47-percent-of-merchants-report-false-declines-cost-them-sales/).*

Treat the $50 billion as an estimate. Industry-wide loss figures depend heavily on assumptions, so use them to show direction rather than as a precise measure.

## Why do good customers get declined?

Issuers decide in milliseconds. According to Stripe's documentation, the issuer's automated systems and models analyze signals such as spending habits, account balance, and card data including expiration date, address information and the CVC.

When something looks off, the issuer often says no without saying why. Stripe notes that card issuers categorize most declines as generic, which leaves the exact reason unclear, and that issuers discuss specifics only with their cardholders. Its authorization guide adds that many transactions are categorized as generic declines with the code "05: Do not honor."

Common triggers include:

- Incorrect card details, such as a mistyped CVC or an outdated expiry date.
- A purchase that looks unusual, for example a large amount or many transactions in a short time.
- A card issued in one country used from a network location in another. Stripe points out this can be a legitimate decline, but travelers create exceptions.
- Missing authentication, such as a required 3D Secure step.

*Sources: [Stripe: Card declines](https://docs.stripe.com/declines/card), [Stripe: Optimizing authorization rates](https://stripe.com/guides/optimizing-authorization-rates).*

## What does a false decline cost?

The direct cost is the lost order. The indirect costs are harder to see: a customer who goes to a competitor, a subscription that lapses, or a support ticket.

Here is a simple worked example. The numbers are illustrative, so replace them with yours.

| Input | Value |
| --- | --- |
| Payment attempts per month | 100,000 |
| Average order value | $60 |
| Revenue at risk per 1 percentage point of approval rate | 1,000 orders × $60 = **$60,000 per month** |

If your approval rate moves from 90% to 92%, that is about $120,000 of monthly revenue recovered, before margin. Stripe's guide makes the same point at scale, noting that some large businesses have raised their authorization rate by just 0.5% and captured millions of dollars in additional revenue each year.

## How can merchants reduce false declines?

There is no single switch. These are the levers with public evidence behind them:

1. **Use network tokens.** Visa reports a 4.8% increase in authorization rates for tokenized transactions compared with card numbers (VisaNet, January to December 2025) and a 39.4% lower fraud rate versus non-tokenized credentials. I go deeper in [Network Tokens and Authorization Rates](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/network-tokens-authorization-rates-what-the-data-says/).
2. **Keep stored cards fresh.** Stripe cites Postmates seeing a 1.72% uplift from a card account updater, worth $60 million in revenue.
3. **Add authentication where it helps.** Stripe says 3D Secure can lower decline rates in countries that support it.
4. **Collect the right data at checkout.** Stripe recommends asking for CVC and postal code to avoid declines that stem from suspected fraud.
5. **Retry with care.** Card networks limit reattempts, and Stripe recommends a maximum of eight retries for charges that permit them, because issuers may read extra retries as fraud.
6. **Review your own fraud rules.** Your fraud tool can decline good orders too. Review its block rate the same way you review issuer declines.

## How do I measure it?

Start with one question: *of the payments we attempted, how many were declined, and why?* Then split the answer three ways:

- **By decline code.** A jump in "do not honor" tells a different story from a jump in "insufficient funds." See [Credit Card Decline Codes Explained](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/credit-card-decline-codes-explained/) for how to read them.
- **By issuer or card type.** One issuer with a high decline rate points to a specific fix.
- **By customer type.** New customers and returning customers behave differently.

## Frequently asked questions

**What is the difference between a false decline and a false positive?**
In practice the terms overlap. A false positive is a legitimate transaction that a fraud system flags as fraud. A false decline is broader: any legitimate purchase that is refused, whether by a fraud tool or by the issuer.

**Is a lower fraud rate always good?**
Not by itself. Tight rules can cut fraud while also declining more good orders. Track fraud losses and false declines together.

**Can I see the exact reason a bank declined a card?**
Rarely. Issuers typically discuss specifics only with their cardholders, so you often see a generic code.

**How often should I review decline data?**
Weekly is a sensible default for a store with steady volume, and daily after a checkout or fraud-rule change. This is my working rule, not a published standard.

## Sources

- [PYMNTS: 47% of Merchants Report False Declines Cost Them Sales (March 2026)](https://www.pymnts.com/cybersecurity/fraud-prevention/2026/47-percent-of-merchants-report-false-declines-cost-them-sales/)
- [Stripe: Card declines](https://docs.stripe.com/declines/card)
- [Stripe: Optimizing authorization rates](https://stripe.com/guides/optimizing-authorization-rates)
- [Visa: Tokenization](https://www.visa.com/en-us/solutions/tokenization)

*Last reviewed: 19 September 2026.*
