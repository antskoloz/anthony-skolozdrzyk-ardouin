---
slug: expired-card
title: Expired Card
category: card-issuer-restriction
summary: >-
  An "Expired Card" decline means the card's expiration date has already
  passed, or the expiration date submitted with the transaction doesn't
  match the issuer's records. The customer needs to use a current, valid
  card — this decline carries no fraud implication on its own.
schemeCodes:
  - scheme: visa
    code: "54"
    label: Expired Card
  - scheme: visa
    code: "33"
    label: Pick Up Card — Expired
  - scheme: mastercard
    code: "54"
    label: Expired Card
  - scheme: mastercard
    code: "33"
    label: Pick Up Card — Expired
commonCauses:
  - The physical card has genuinely passed its printed expiration date.
  - The customer or a saved-card-on-file system has an outdated expiration date stored, even though a renewed card with the same number has since been issued.
  - The expiration date was mistyped at checkout.
merchantActions:
  - Ask the customer to double-check the expiration date printed on their card and re-enter it carefully.
  - Ask the customer whether they've received a renewed or replacement card, since the account may still be active under a new expiration date.
  - For stored/recurring payment methods, prompt the customer to update their card details rather than continuing to bill the expired one.
preventionTips:
  - Enroll in a card network account updater service so stored card expiration dates and numbers stay current automatically for recurring billing.
  - Send proactive email or SMS reminders to customers with subscriptions when a stored card is approaching its on-file expiration date.
  - Validate expiration date format and plausibility at checkout to catch obvious entry errors before submission.
relatedSlugs:
  - restricted-card
  - pickup-card-no-reason
  - do-not-honor
  - suspected-fraud-pickup-card
faq:
  - question: Does an expired card decline mean the account is closed?
    answer: >-
      Not necessarily. The underlying account is often still active; the
      customer typically just needs a renewed card with an updated
      expiration date, which many issuers send automatically before the
      old one expires.
  - question: Why would a card decline as expired if the customer says it's still valid?
    answer: >-
      This can happen when a stored payment method or card-on-file record
      hasn't been updated to reflect a renewed card, or when the
      expiration date was entered incorrectly at checkout.
lastUpdated: 2026-09-13
---

Some issuers route this decline as a straightforward "Expired Card" response, while others use the "Pick Up Card — Expired" variant, which may prompt card-retention guidance in card-present settings even though the underlying cause is purely administrative.
