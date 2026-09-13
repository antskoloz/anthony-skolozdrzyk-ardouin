---
slug: exceeds-activity-count
title: Exceeds Withdrawal Frequency
category: insufficient-funds
summary: >-
  This decline means the issuer has capped the number of transactions
  allowed on the account within a given period, and that limit has been
  reached — regardless of the dollar amount involved. It's distinct from a
  dollar-amount withdrawal limit, since even small transactions will be
  declined once the count threshold is hit.
schemeCodes:
  - scheme: visa
    code: "65"
    label: Exceeds Withdrawal Frequency Limit
  - scheme: mastercard
    code: "65"
    label: Exceeds Withdrawal Frequency Limit
commonCauses:
  - The cardholder has already made the maximum number of transactions or withdrawals permitted for the day, week, or billing cycle.
  - Prepaid, debit, or benefits cards often carry lower default transaction-count limits than standard credit cards.
  - The issuer's fraud controls temporarily cap transaction frequency after detecting unusual activity, even if each transaction is small.
merchantActions:
  - Advise the customer to wait until the issuer's limit period resets (often daily) or contact their issuer to request a temporary increase.
  - Suggest an alternative payment method for the current purchase, since retrying won't bypass a count-based limit.
  - For subscription or recurring-billing merchants, consider consolidating multiple small charges into fewer transactions where possible.
preventionTips:
  - For recurring billing models, minimize the number of separate authorization attempts per billing cycle to avoid tripping frequency caps.
  - Communicate expected charge frequency clearly to customers with prepaid or limited-use cards.
  - Support multiple payment methods so a frequency cap on one card doesn't block repeat purchases.
relatedSlugs:
  - exceeds-withdrawal-limit
  - insufficient-funds
  - do-not-honor
  - allowable-pin-tries-exceeded
faq:
  - question: Is this the same as exceeding a spending limit?
    answer: >-
      No. A spending limit caps the total dollar amount over a period. This
      decline caps the number of transactions, so it can trigger even when
      each individual transaction is small and well within any dollar limit.
  - question: Will this resolve itself, or does the customer need to call their bank?
    answer: >-
      It usually resolves automatically once the issuer's limit period
      resets, such as at the start of the next day. If the customer needs to
      transact sooner, they should contact their issuer directly.
lastUpdated: 2026-09-13
---

Merchants running frequent small-amount charges, such as usage-based billing or repeated retry logic, are especially prone to triggering this limit even when total spend is modest.
