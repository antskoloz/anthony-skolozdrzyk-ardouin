---
slug: function-not-supported
title: Requested Function Not Supported
category: technical-processing
summary: >-
  A "Requested Function Not Supported" decline means the specific
  transaction type or feature requested — such as a particular refund
  method, cash advance, or account inquiry — isn't supported by the
  cardholder's issuer for that card. It reflects a capability mismatch
  rather than a funds or fraud issue and usually requires a different
  transaction approach.
schemeCodes:
  - scheme: visa
    code: "40"
    label: Requested Function Not Supported
  - scheme: mastercard
    code: "40"
    label: Requested Function Not Supported
commonCauses:
  - The card product, such as prepaid, debit, or a specific co-branded card, doesn't support the requested transaction type.
  - The issuer hasn't enabled a particular feature, such as cash advances or certain refund types, for that card or account.
  - The transaction was attempted through a channel, such as card-not-present, that the issuer doesn't support for that specific function.
merchantActions:
  - Confirm whether the transaction type attempted, such as a cash advance or specific refund method, is one commonly supported across card products before retrying.
  - Offer an alternative transaction method, such as a standard sale or refund, instead of the unsupported function.
  - If this occurs frequently for a specific transaction type, review your processing setup with your acquirer to confirm which functions are enabled for your account.
preventionTips:
  - Confirm with your processor which transaction types and features are supported for the card products your customers commonly use.
  - Avoid relying on niche transaction types, like cash advances, in consumer-facing flows unless you've confirmed broad issuer support.
  - Provide fallback transaction flows, such as a standard refund, for cases where a specialized function isn't supported.
relatedSlugs:
  - invalid-transaction
  - format-error
  - transaction-not-permitted-cardholder
  - transaction-not-permitted-terminal
faq:
  - question: Does this decline mean something is wrong with the customer's card?
    answer: >-
      Not exactly — it means the specific transaction type or feature
      requested isn't supported by the issuer for that card, not that the
      card itself is invalid or restricted in general.
  - question: Can we retry with the same card using a different transaction type?
    answer: >-
      Often yes. Since the issue is with the specific function requested, a
      standard sale or refund frequently succeeds even when a more
      specialized transaction type doesn't.
lastUpdated: 2026-09-13
---

This decline is most often seen with specialized transaction types rather than everyday purchases, since issuers selectively enable advanced functions by card product. Identifying exactly which function triggered the decline usually points directly to a workable alternative.
