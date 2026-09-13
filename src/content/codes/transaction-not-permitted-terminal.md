---
slug: transaction-not-permitted-terminal
title: Transaction Not Permitted to Terminal/Merchant
category: risk-compliance
summary: >-
  This decline means the merchant's terminal or merchant category is not
  permitted to accept this type of transaction under network or issuer
  rules. Unlike a cardholder-side restriction, the limitation sits on the
  merchant or terminal configuration itself, such as a terminal not
  provisioned for a certain card product or transaction type.
schemeCodes:
  - scheme: visa
    code: "58"
    label: Transaction Not Permitted to Terminal
  - scheme: mastercard
    code: "58"
    label: Transaction Not Permitted to Terminal
commonCauses:
  - The merchant's terminal or merchant account isn't configured or licensed to accept a specific card product (e.g. commercial or EBT cards).
  - The merchant category code (MCC) registered for the business isn't authorized for the transaction type attempted, such as cash-equivalent transactions.
  - The terminal is attempting a transaction type (e.g. cash advance) that its merchant agreement doesn't cover.
merchantActions:
  - Confirm with your acquirer or payment processor that your merchant account and terminal are provisioned for the card types and transaction types you intend to accept.
  - Check that your registered merchant category code (MCC) matches your actual business activity.
  - If the issue is isolated to one terminal or channel, route the transaction through a correctly configured terminal or gateway instead.
preventionTips:
  - Work with your acquirer during onboarding to ensure your MCC and terminal configuration match every transaction type you plan to process.
  - Periodically audit terminal configurations after any processor migration or hardware change.
  - If you expand into new transaction types (e.g. adding recurring billing or cash-equivalent sales), confirm merchant account support before launch.
relatedSlugs:
  - transaction-not-permitted-cardholder
  - merchant-category-blocked
  - invalid-merchant
  - do-not-honor
faq:
  - question: Is this decline caused by the customer's card?
    answer: >-
      No. This restriction originates from the merchant's terminal
      configuration or merchant category, not from the cardholder's account,
      so the customer typically cannot resolve it themselves.
  - question: How do I fix this on an ongoing basis?
    answer: >-
      Contact your acquirer or payment processor to review your merchant
      account setup. They can confirm whether your terminal or MCC needs to
      be updated to support the transaction type you're attempting.
lastUpdated: 2026-09-13
---

Because this is a merchant-side configuration issue, it typically affects every transaction of the same type rather than a single customer, so a sudden spike in this decline is a strong signal to check with your acquirer.
