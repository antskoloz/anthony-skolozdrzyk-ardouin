---
slug: violation-of-law
title: Transaction Violates Law
category: risk-compliance
summary: >-
  This decline means the issuer or card network determined that completing
  the transaction would violate a law or regulation, such as sanctions or
  OFAC screening, or restrictions on goods and services in the cardholder's
  or merchant's jurisdiction. It is a compliance-driven block rather than a
  fraud or funds-related decline.
schemeCodes:
  - scheme: visa
    code: "93"
    label: Transaction Violates Law
  - scheme: mastercard
    code: "93"
    label: Transaction Violates Law
commonCauses:
  - The transaction involves a party, country, or entity on a sanctions or watch list (e.g. OFAC).
  - The goods or services being purchased are restricted or illegal in the cardholder's or merchant's jurisdiction.
  - The issuer's compliance systems flagged the transaction under anti-money-laundering or regulatory screening rules.
merchantActions:
  - Do not attempt to reprocess or resubmit the transaction, since retrying a legally blocked transaction can create additional compliance exposure.
  - Review whether your business is properly registered and compliant for the jurisdictions and product categories you sell into.
  - Consult your acquirer or a compliance advisor if this decline occurs repeatedly, as it may indicate a jurisdictional or product-classification issue rather than a one-off event.
preventionTips:
  - Screen transactions against sanctions and restricted-party lists before submitting for authorization, especially for cross-border sales.
  - Ensure your product and service listings are accurately classified and legally permitted in every market you serve.
  - Work with legal counsel to review compliance obligations if you operate in regulated categories or high-risk countries.
relatedSlugs:
  - restricted-card
  - security-violation
  - merchant-category-blocked
  - do-not-honor
faq:
  - question: Can this decline be appealed or retried?
    answer: >-
      Generally no. This is a compliance-based block, and repeatedly
      retrying the same transaction is not appropriate. If you believe the
      decline is in error, contact your acquirer or the cardholder's issuer.
  - question: Does this decline mean my business is under investigation?
    answer: >-
      Not necessarily for a single occurrence, but a pattern of these
      declines is a strong signal to review your compliance program,
      transaction screening, and jurisdictional coverage.
lastUpdated: 2026-09-13
---

Because this response is tied to legal and regulatory obligations rather than commercial risk, merchants should treat repeated occurrences as a compliance signal warranting review rather than a payments-processing glitch to troubleshoot.
