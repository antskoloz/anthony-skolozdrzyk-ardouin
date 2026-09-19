---
title: "Stablecoins in Cross-Border Payments: Hype vs. Reality"
description: "Are stablecoins ready for cross-border payments? See what the BIS and the GENIUS Act say, and a practical checklist for merchants weighing them."
pubDate: 2026-10-25
tags: ["payments", "stablecoins", "cross-border payments", "regulation"]
draft: true
---

> **Short answer:** Stablecoins are moving from crypto niche to regulated payments product, but the case for a typical merchant is narrower than the headlines suggest. The Bank for International Settlements (BIS) argues they fall short as money, while the US GENIUS Act, signed in July 2025, sets reserve and disclosure rules for payment stablecoins. For most merchants, the realistic starting points are supplier payouts and treasury, not consumer checkout.

Stablecoins are tokens designed to hold a stable value, usually pegged to a currency such as the US dollar. J.P. Morgan describes them as "blockchain-based tokens designed to maintain a stable value, typically by pegging to fiat currencies like the U.S. dollar." Supporters see faster, cheaper cross-border payments. Critics see risks to financial stability and monetary sovereignty. This post sets out what the primary sources say and what it means for merchants.

## What is the case for stablecoins in cross-border payments?

Cross-border payments are large and growing. J.P. Morgan projects that they will grow from $194 trillion in 2024 to $320 trillion by 2032, and it notes that speed is "no longer a differentiator: it's a baseline expectation." That expectation is what stablecoin advocates aim at: settlement that runs around the clock rather than on banking hours.

*Source: [J.P. Morgan: 2026 trends for financial institutions](https://www.jpmorgan.com/insights/payments/fx-cross-border/2026-trends-for-financial-institutions).*

The J.P. Morgan page I reviewed did not give figures for stablecoin adoption, cost or speed, so I do not quote any here. The BIS chapter discussed below also does not give a figure for stablecoins' share of cross-border payments. If you see a precise share quoted elsewhere, look for its original source before relying on it.

## What is the case against?

In its 2025 Annual Economic Report, the BIS assessed stablecoins against three tests it says a sound monetary system needs. In its assessment they fall short on each:

| Test | BIS argument, in brief |
| --- | --- |
| **Singleness** | Stablecoins "often trade at varying exchange rates," like private banknotes of the 19th century, because they lack central bank settlement. |
| **Elasticity** | The issuer's balance sheet "cannot be expanded at will," since holders must pay in full up front, a strict cash-in-advance setup. |
| **Integrity** | Stablecoins are "prone to KYC compliance weaknesses" and attractive to criminal and terrorist organisations, as pseudonymous bearer instruments on public blockchains. |

The BIS also notes that over 99% of stablecoins are US dollar-denominated and warns of "stealth dollarisation" in some economies, of potential "fire sales" of safe assets if issuers' Treasury holdings had to be sold, and of new channels for risks to spill over from bank-issued stablecoins to the traditional financial system.

*Source: [BIS Annual Economic Report 2025, Chapter III](https://www.bis.org/publ/arpdf/ar2025e3.htm).*

These are the BIS's arguments about monetary systems. They do not say a merchant cannot use stablecoins, but they explain why regulators are cautious.

## What does the GENIUS Act change?

The US Guiding and Establishing National Innovation for U.S. Stablecoins (GENIUS) Act became law in July 2025. According to the Federal Reserve Bank of Richmond's overview:

- Permitted issuers include subsidiaries of banks, and non-bank entities approved to issue payment stablecoins under supervision by the Office of the Comptroller of the Currency (OCC) or an appropriate state regulator.
- Issuers must hold high-quality, liquid reserve assets backed at least 1:1, meaning 100% reserves.
- Issuers must disclose their redemption policy.
- Issuers cannot pay interest or yield to holders of payment stablecoins.
- Issuers must publish monthly attestations of reserve composition, with monthly CEO and CFO certifications.
- Issuers must comply with Bank Secrecy Act requirements.
- The Richmond Fed's overview points to an October 2026 deadline for rulemaking, which is close as I write this in September 2026. Check for the final rules before you plan around them.

*Source: [Federal Reserve Bank of Richmond: Stablecoins and the GENIUS Act](https://www.richmondfed.org/banking/banker_resources/news_flash/2025/20251118_genius_act).*

The Act covers the United States. If you operate in other regions, check local rules separately.

## Where might stablecoins make sense for a merchant?

These are my own assessments, not findings from the sources above. Match each use case against your situation.

| Use case | Possible upside | Questions to answer first |
| --- | --- | --- |
| Paying suppliers or contractors in another country | Faster settlement outside banking hours | Can the recipient convert to local currency easily, and at what cost? |
| Moving treasury between your own entities | Fewer intermediaries | How do you account for it, and what are the tax rules? |
| Accepting payments from customers | New customer segment | How do refunds, disputes and consumer protections work? |
| Holding balances | Convenience | What are the reserve, redemption and custody terms? |

## A short checklist before you try

1. **Define the problem.** Is it cost, speed, or reach? Compare against your current rails, including instant bank transfers and local payment methods.
2. **Count the full cost.** Include conversion in and out, network fees, provider fees and accounting time, not just the transfer fee.
3. **Check the issuer.** Look at the reserve disclosures, redemption terms and the regulator overseeing the issuer.
4. **Check your provider.** Confirm how they handle compliance, sanctions screening and customer verification.
5. **Plan for disputes and refunds.** Decide how you will handle a refund if a customer paid in a stablecoin.
6. **Start small.** Pilot one corridor or one supplier, and measure cost and time against your baseline.

Related reading: [Agentic Commerce: What AI Agents Buying Means for Payments](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/agentic-commerce-what-ai-agents-buying-means-for-payments/) covers how stablecoins fit into new agent payment protocols.

## Frequently asked questions

**Are stablecoins legal for merchants to use?**
In the US, the GENIUS Act creates a framework for regulated payment stablecoin issuers. Rules vary by country, so check local law and your provider's policies.

**Do stablecoins pay interest?**
Under the GENIUS Act, issuers of payment stablecoins cannot pay interest or yield to holders, according to the Richmond Fed's overview. Tokenized deposits are different and may pay yield.

**Are stablecoins safer than other crypto assets?**
They aim for a stable value, but the BIS notes they can trade at varying exchange rates and depend on the issuer's reserves and redemption. Review the issuer's disclosures.

**Will stablecoins replace card payments?**
Nothing in the sources reviewed here suggests that. Google's Agent Payments Protocol supports cards, stablecoins and real-time bank transfers side by side.

## Sources

- [BIS Annual Economic Report 2025, Chapter III: The next-generation monetary and financial system](https://www.bis.org/publ/arpdf/ar2025e3.htm)
- [Federal Reserve Bank of Richmond: Stablecoins and the GENIUS Act](https://www.richmondfed.org/banking/banker_resources/news_flash/2025/20251118_genius_act)
- [J.P. Morgan: 2026 trends for financial institutions](https://www.jpmorgan.com/insights/payments/fx-cross-border/2026-trends-for-financial-institutions)
- [Google Cloud: Announcing Agents to Payments (AP2)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)

*Last reviewed: 19 September 2026. This post is general information, not legal or financial advice.*
