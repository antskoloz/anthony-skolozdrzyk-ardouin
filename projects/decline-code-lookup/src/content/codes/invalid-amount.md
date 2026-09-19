---
slug: invalid-amount
title: Invalid Amount
category: technical-processing
summary: >-
  An "Invalid Amount" decline means the transaction amount field failed
  validation — for example it was zero, negative, exceeded a formatting
  limit, or contained a currency mismatch. This is a technical or
  processing issue rather than a funds or fraud problem, and it typically
  requires the merchant or their gateway to correct how the amount is
  submitted.
schemeCodes:
  - scheme: visa
    code: "13"
    label: Invalid Amount
  - scheme: mastercard
    code: "13"
    label: Invalid Amount
commonCauses:
  - The amount field was submitted as zero, negative, or with incorrect decimal formatting.
  - The transaction currency isn't supported for the card or corridor, causing the amount to fail validation.
  - A rounding, tax, or tip adjustment pushed the final amount into a format the issuer's system couldn't parse.
merchantActions:
  - Check the exact amount and currency submitted for the failed transaction to confirm it's correctly formatted, with no stray characters or wrong decimal places.
  - Contact your gateway or processor if the amount field appears correct on your end but the decline persists.
  - Reprocess the transaction with a corrected amount once the formatting or currency issue is identified.
preventionTips:
  - Validate amount fields client-side (positive, correctly rounded, within expected ranges) before submitting transactions to your processor.
  - Ensure your integration explicitly sets the correct currency code for every transaction, especially for multi-currency or cross-border sales.
  - Test edge cases, such as zero-dollar authorizations and unusual tip or tax combinations, during integration to catch formatting bugs early.
relatedSlugs:
  - currency-not-supported
  - invalid-transaction
  - format-error
  - error-transaction
faq:
  - question: Does "Invalid Amount" mean the customer doesn't have enough money?
    answer: >-
      No — that would be an insufficient funds decline. "Invalid Amount"
      means the amount field itself failed technical validation, regardless
      of the customer's actual balance.
  - question: Why would a correct-looking amount trigger this decline?
    answer: >-
      Often the issue is formatting, such as extra decimal places or the
      wrong currency code, rather than the visible number being wrong.
      Reviewing the raw transaction message your gateway sent is the best
      way to spot the discrepancy.
lastUpdated: 2026-09-13
---

Invalid Amount declines are almost always a merchant- or gateway-side formatting issue rather than anything related to the cardholder's balance or creditworthiness. They're particularly common after integration changes, tax or tip logic updates, or when processing in a currency the setup wasn't tested for.
