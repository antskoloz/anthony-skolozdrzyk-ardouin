---
slug: suspected-fraud-pickup-card
title: Suspected Fraud / Pick Up Card
category: fraud
summary: >-
  This decline means the card issuer believes the card may be lost, stolen,
  or used fraudulently, and in some cases is instructing the merchant to
  physically retain the card if presented in person. It is a strong fraud
  signal and should be treated with caution.
schemeCodes:
  - scheme: visa
    code: "41"
    label: Lost Card, Pick Up
  - scheme: visa
    code: "43"
    label: Stolen Card, Pick Up
  - scheme: mastercard
    code: "43"
    label: Stolen Card, Pick Up
  - scheme: amex
    code: R03
    label: Suspected Fraud
commonCauses:
  - The card has been reported lost or stolen by the cardholder.
  - The issuer's fraud model flagged the specific transaction as highly likely to be fraudulent.
  - The card details may have been compromised in a prior data breach and are now blocklisted.
merchantActions:
  - For in-person transactions, follow your payment processor's guidance on this decline code — some card network rules do call for retaining the card, but this must be handled carefully and never confrontationally.
  - For online transactions, do not attempt to retry or split the charge — treat it as a hard decline and do not ship goods or provide services against this transaction.
  - Document the transaction details and consider flagging the order for manual fraud review before any further contact with the customer.
preventionTips:
  - Use address verification (AVS), CVV checks, and 3-D Secure to catch likely-fraudulent transactions before they reach this decline stage.
  - Monitor for velocity patterns (multiple attempts, multiple cards, same device/IP) that often precede a suspected-fraud decline.
  - Work with your payment processor's fraud tools and network-provided fraud scores to flag high-risk orders automatically.
relatedSlugs:
  - do-not-honor
  - invalid-card-number
faq:
  - question: Should a merchant confront a customer whose card was declined for suspected fraud?
    answer: >-
      No. Merchants should never confront or accuse a customer directly.
      Follow your processor's documented procedure and, for in-person
      transactions, prioritize staff safety over any card-retention
      instruction.
  - question: Is it safe to retry this transaction with a different amount?
    answer: >-
      No. Retrying or modifying a transaction after a suspected-fraud
      decline can violate card network rules and increase chargeback and
      liability risk for the merchant.
lastUpdated: 2026-09-13
---

Suspected fraud declines carry real risk for both the cardholder and the merchant, and card network rules around handling them (especially in card-present environments) are stricter than for routine declines like insufficient funds.
