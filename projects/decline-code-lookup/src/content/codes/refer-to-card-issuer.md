---
slug: refer-to-card-issuer
title: Refer to Card Issuer
category: other
summary: >-
  "Refer to Card Issuer" is a generic response instructing the merchant that
  only the cardholder's bank can explain or resolve the decline. It's one of
  the most common catch-all decline codes merchants encounter, alongside "Do
  Not Honor," and gives no specific reason for the refusal.
schemeCodes:
  - scheme: visa
    code: "01"
    label: Refer to Card Issuer
  - scheme: visa
    code: "02"
    label: Refer to Card Issuer — Special Condition
  - scheme: mastercard
    code: "01"
    label: Refer to Card Issuer
  - scheme: mastercard
    code: "02"
    label: Refer to Card Issuer — Special Condition
commonCauses:
  - The issuer wants to speak directly with the cardholder before allowing the transaction, often for identity verification.
  - The account has a special condition or hold that the issuer doesn't disclose in the decline response itself.
  - The issuer's system routed the decision to manual review rather than an automatic approval or denial.
merchantActions:
  - Direct the customer to call the number on the back of their card, since only the issuer can explain the specific condition.
  - Offer an alternative payment method to keep the sale moving while the customer resolves the issue with their bank.
  - Avoid immediately retrying the same transaction, as it typically requires the cardholder to take action with their issuer first.
preventionTips:
  - Provide clear, friendly guidance in your checkout error messaging pointing customers to contact their card issuer.
  - Support multiple payment methods so a single generic decline doesn't stall the entire checkout.
  - Track this decline rate by issuer to spot patterns, though because it's inherently non-specific, resolution mostly falls to the cardholder rather than the merchant.
relatedSlugs:
  - do-not-honor
  - suspected-fraud-general
  - restricted-card
  - insufficient-funds
faq:
  - question: What's the difference between "Refer to Card Issuer" and "Do Not Honor"?
    answer: >-
      Both are generic, non-specific declines from the issuer. "Refer to
      Card Issuer" more explicitly signals the issuer wants the cardholder
      to contact them directly, while "Do Not Honor" is simply a refusal
      without that specific instruction. In practice, merchants should treat
      both the same way operationally.
  - question: Can the merchant find out the real reason for the decline?
    answer: >-
      No. The specific reason is known only to the issuer and is
      intentionally not shared with the merchant. The cardholder must
      contact their bank directly to learn more.
lastUpdated: 2026-09-13
---

The "02" variant, flagged as a special condition, often indicates the issuer has a more specific internal reason than the standard "01" response, but merchants cannot distinguish the two operationally since both simply require the cardholder to contact their bank.
