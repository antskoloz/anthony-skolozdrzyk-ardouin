---
slug: do-not-honor
title: Do Not Honor
category: other
summary: >-
  A "Do Not Honor" decline is a catch-all response from the card issuer
  meaning it chose not to approve the transaction, without specifying the
  exact reason. It can stem from risk rules, account restrictions, or
  discretionary fraud checks the issuer does not disclose to the merchant.
schemeCodes:
  - scheme: visa
    code: "05"
    label: Do Not Honor
  - scheme: mastercard
    code: "05"
    label: Do Not Honor
  - scheme: amex
    code: R00
    label: Do Not Honor / Refer to Card Issuer
commonCauses:
  - The issuer's internal risk model flagged the transaction without a more specific reason code.
  - The transaction pattern (amount, merchant category, location) differs from the cardholder's typical spending.
  - The card has an account-level restriction that the issuer doesn't expose in the decline reason.
merchantActions:
  - Ask the customer to contact their card issuer directly — only the issuer can explain the specific reason and clear it.
  - Offer an alternative payment method so the sale isn't lost while the customer resolves it with their bank.
  - Avoid immediately retrying the same transaction, since a generic decline like this rarely succeeds on retry without the cardholder taking action.
preventionTips:
  - Pass complete transaction data (AVS, CVV, 3-D Secure results) to reduce the chance of triggering issuer risk models.
  - For higher-risk transactions, consider enabling 3-D Secure, which shifts liability and often improves approval rates.
  - Monitor decline patterns by issuer and amount to identify if certain transaction types are disproportionately triggering this response.
relatedSlugs:
  - suspected-fraud-pickup-card
  - insufficient-funds
faq:
  - question: Why won't the issuer say exactly why the transaction was declined?
    answer: >-
      Card issuers intentionally keep some decline reasons generic to avoid
      revealing details of their fraud-detection logic, which could
      otherwise help fraudsters work around it.
  - question: Can the merchant do anything to get this transaction approved?
    answer: >-
      Not directly. Only the cardholder can resolve this by contacting
      their card issuer. The merchant's best move is to offer an
      alternative payment method.
lastUpdated: 2026-09-13
---

"Do Not Honor" is one of the most frequent generic decline codes and is often frustrating precisely because it gives no actionable detail to the merchant or the cardholder.
