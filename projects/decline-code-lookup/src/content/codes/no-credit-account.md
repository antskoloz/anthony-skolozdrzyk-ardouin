---
slug: no-credit-account
title: No Credit Account
category: card-issuer-restriction
summary: >-
  A "No Credit Account" decline means the transaction was submitted as a
  credit-account charge, but the card presented isn't linked to a credit
  account on the issuer's system — for example, a debit-only card run in
  credit mode. The customer needs to use the correct account type or a
  different card.
schemeCodes:
  - scheme: visa
    code: "39"
    label: No Credit Account
  - scheme: mastercard
    code: "39"
    label: No Credit Account
commonCauses:
  - The card is a debit or prepaid card without an associated credit line, but was processed as a credit transaction.
  - The transaction's account-type field was set incorrectly by the terminal or payment application.
  - The cardholder selected "credit" at a PIN pad when their card only supports debit processing.
merchantActions:
  - At a PIN pad or terminal, ask the customer to select "debit" instead of "credit," or vice versa, and re-run the transaction.
  - If the terminal doesn't offer an account-type choice, ask the customer whether they have a different card that supports credit transactions.
  - For online transactions, ask the customer to confirm the card type or try an alternative payment method.
preventionTips:
  - Ensure point-of-sale terminals are configured to prompt for the correct account type rather than defaulting to credit for all cards.
  - Train staff to recognize this decline and immediately suggest the customer try the debit option rather than assuming the card is invalid.
  - Keep terminal software and card-type detection logic up to date so account-type routing matches each card's actual capabilities.
relatedSlugs:
  - no-checking-account
  - no-savings-account
  - do-not-honor
  - restricted-card
faq:
  - question: Does this decline mean the customer's card is invalid?
    answer: >-
      No. The card itself is typically fine — it simply isn't linked to a
      credit account, so a transaction routed as "credit" can't be
      completed. Running it as debit, if supported, usually resolves it.
  - question: Why does this happen more often at gas stations or PIN pads?
    answer: >-
      Terminals that ask the customer to choose between "credit" and
      "debit" are the most common place this decline appears, since an
      incorrect selection routes the transaction to an account type the
      card doesn't have.
lastUpdated: 2026-09-13
---

This decline is almost always resolved by re-running the transaction under the correct account type, making it one of the easier technical-restriction declines for front-line staff to handle in real time.
