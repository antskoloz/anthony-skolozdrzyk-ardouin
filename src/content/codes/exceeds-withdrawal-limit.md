---
slug: exceeds-withdrawal-limit
title: Exceeds Withdrawal/Activity Limit
category: insufficient-funds
summary: >-
  This decline means the transaction amount, or the cumulative amount of
  recent transactions, exceeds a limit the card issuer has set on the
  account — separate from whether the account has enough total funds or
  credit available.
schemeCodes:
  - scheme: visa
    code: "61"
    label: Exceeds Withdrawal Limit
  - scheme: mastercard
    code: "61"
    label: Exceeds Withdrawal Amount Limit
  - scheme: amex
    code: R06
    label: Exceeds Approval Amount Limit
commonCauses:
  - The card has a daily, weekly, or per-transaction spending cap set by the issuer.
  - Prepaid or teen/family cards often carry lower default limits than standard credit or debit cards.
  - Multiple transactions in a short window have already used up the account's activity limit for the period.
merchantActions:
  - Suggest the customer split the purchase into a smaller transaction if your systems support partial payment, or use a different card.
  - Recommend the customer contact their issuer to request a temporary limit increase if they expect to make a large purchase.
  - Avoid retrying the exact same amount immediately, since the limit is typically time-based and won't reset within minutes.
preventionTips:
  - For high-ticket purchases, offer installment or split-payment options at checkout.
  - Clearly communicate expected charge amounts in advance (e.g. for deposits or holds) so customers can raise limits beforehand.
  - Support multiple payment methods so a limit on one card doesn't block the entire sale.
relatedSlugs:
  - insufficient-funds
  - do-not-honor
faq:
  - question: Is this the same as an insufficient funds decline?
    answer: >-
      No. Insufficient funds means the account doesn't have enough balance
      or credit at all. This decline means a specific limit set by the
      issuer — often unrelated to total balance — has been reached.
  - question: Can the merchant increase this limit?
    answer: >-
      No, only the card issuer can adjust a cardholder's limits. The
      merchant can only offer alternative payment approaches.
lastUpdated: 2026-09-13
---

Withdrawal and activity limits exist for consumer protection and risk management, and are especially common on prepaid, debit, and business cards with issuer-configured spending caps.
