---
slug: currency-not-supported
title: Unsupported Currency
category: technical-processing
summary: >-
  An "Unsupported Currency" decline happens when the transaction currency
  isn't accepted for the cardholder's account, card product, or
  cross-border corridor, and is returned to merchants as an Invalid Amount
  response. It's most relevant to merchants processing multi-currency or
  international transactions and typically requires charging in a
  supported currency instead.
schemeCodes:
  - scheme: visa
    code: "13"
    label: Invalid Amount — Unsupported Currency
  - scheme: mastercard
    code: "13"
    label: Invalid Amount — Unsupported Currency
commonCauses:
  - The card was issued for domestic use only and doesn't support the foreign currency the merchant attempted to charge in.
  - The merchant's multi-currency pricing, such as dynamic currency conversion, selected a currency not supported by the cardholder's issuer.
  - A cross-border corridor restriction limits which currencies can be processed for that specific card and issuer combination.
merchantActions:
  - Offer to charge the transaction in the merchant's default settlement currency instead of the customer's local currency, if the option is available.
  - Ask the customer whether their card supports international or multi-currency transactions before retrying.
  - Contact your payment gateway to confirm which currencies are enabled and supported for your merchant account and customer base.
preventionTips:
  - Confirm with your acquirer which currencies are fully supported for your merchant account before enabling multi-currency checkout options.
  - If offering dynamic currency conversion, provide a fallback to the merchant's home currency when a selected currency fails.
  - For international or cross-border businesses, work with a payment provider experienced in multi-currency acquiring to reduce currency-related declines.
relatedSlugs:
  - invalid-amount
  - format-error
  - error-transaction
  - invalid-transaction
faq:
  - question: Why does this show up as an "Invalid Amount" error?
    answer: >-
      Currency-related failures share the same underlying network code as
      generic amount validation errors, since currency is part of the
      amount field's data. The practical cause here is specifically an
      unsupported currency rather than a malformed number.
  - question: How can we avoid this for international customers?
    answer: >-
      Confirm with your acquirer which currencies are supported for your
      account, and offer to settle in your default currency as a fallback
      when a customer's preferred currency isn't accepted.
lastUpdated: 2026-09-13
---

Although this decline is transmitted using the same network code as a generic Invalid Amount error, the underlying scenario is distinct enough to warrant separate attention for merchants operating internationally. Multi-currency and cross-border merchants should treat a cluster of these declines as a currency-support issue rather than a general formatting bug.
