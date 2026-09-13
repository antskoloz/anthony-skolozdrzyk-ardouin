---
slug: duplicate-transaction
title: Duplicate Transaction
category: technical-processing
summary: >-
  A "Duplicate Transaction" decline means the card network or issuer detected
  that this transaction matches another one already processed for the same
  card, amount, and time window, and is blocking it to prevent an accidental
  double charge. It is a protective control, not a fraud or funding issue.
schemeCodes:
  - scheme: visa
    code: "94"
    label: Duplicate Transmission
  - scheme: mastercard
    code: "94"
    label: Duplicate Transmission
commonCauses:
  - A customer or cashier accidentally submitted the same payment twice, such as double-clicking a checkout button.
  - A network timeout caused the merchant's system to automatically resend a transaction that had actually already gone through.
  - A point-of-sale or e-commerce integration retried a request without proper idempotency handling after a slow response.
merchantActions:
  - Check your transaction records before resubmitting to confirm whether the original charge actually succeeded.
  - If the original transaction did go through, do not attempt to force the duplicate through — inform the customer their payment was already accepted.
  - If the original transaction did not go through, wait a short period and submit as a new, distinct transaction rather than an automatic retry.
preventionTips:
  - Implement idempotency keys or unique transaction identifiers in your payment integration to prevent accidental double submission.
  - Disable checkout buttons after the first click and add clear loading states to discourage customers from clicking multiple times.
  - Review timeout and retry logic in your payment gateway integration to ensure retries don't resend an already-successful request.
relatedSlugs:
  - system-malfunction
  - re-enter-transaction
  - error-transaction
  - invalid-transaction
faq:
  - question: Does a duplicate transaction decline mean the customer was charged twice?
    answer: >-
      No — the opposite. This decline means the network blocked the second,
      duplicate attempt specifically to prevent the customer from being
      charged twice for the same purchase.
  - question: How can merchants avoid triggering duplicate transaction declines?
    answer: >-
      Use idempotency keys in your payment integration, disable submit
      buttons after the first click, and make sure automatic retry logic
      only fires when a transaction genuinely failed rather than merely
      timing out.
lastUpdated: 2026-09-13
---

This decline exists specifically to protect both cardholders and merchants from accidental double billing, so it should be treated as a signal to verify transaction status rather than as a payment failure to immediately retry.
