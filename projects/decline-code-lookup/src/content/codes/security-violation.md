---
slug: security-violation
title: Security Violation
category: risk-compliance
summary: >-
  A Security Violation decline means the issuer detected a security-related
  problem with the transaction, such as a failed cryptographic check or a
  violation of a required security protocol, rather than a general suspicion
  of fraud. It typically points to a technical integrity issue in how the
  transaction was submitted.
schemeCodes:
  - scheme: visa
    code: "63"
    label: Security Violation
  - scheme: mastercard
    code: "63"
    label: Security Violation
commonCauses:
  - A cryptogram or chip/contactless security check failed during processing.
  - The transaction was submitted with an invalid or mismatched security element, such as a corrupted EMV data field.
  - The terminal or payment application used an outdated or non-compliant security protocol version.
merchantActions:
  - Retry the transaction, since some occurrences stem from a transient terminal or network communication issue rather than a persistent problem.
  - If the issue recurs, contact your payment processor or terminal vendor to check for outdated firmware or software that may be generating invalid security data.
  - Escalate to your acquirer if the pattern persists across multiple customers or cards, since it may indicate a terminal-level compliance issue.
preventionTips:
  - Keep POS terminals, payment SDKs, and EMV kernels updated to current security specifications.
  - Work with your processor to validate your integration passes required certification and security testing.
  - Monitor for clusters of this decline tied to a specific terminal or software version, which usually points to the root cause.
relatedSlugs:
  - suspected-fraud-general
  - violation-of-law
  - format-error
  - system-malfunction
faq:
  - question: Is this decline the customer's fault?
    answer: >-
      Rarely. It usually reflects a technical security-check failure in how
      the transaction was processed, often related to terminal or software
      configuration, rather than anything the cardholder did.
  - question: Should I keep retrying if I see this repeatedly?
    answer: >-
      A single retry is reasonable, but if the decline recurs across
      multiple transactions, stop retrying and involve your payment
      processor or terminal vendor to investigate the underlying security
      protocol issue.
lastUpdated: 2026-09-13
---

Because this code points to a security-protocol or cryptographic failure rather than a business decision by the issuer, recurring instances are best treated as a technical support case with your processor rather than a customer-facing payment problem.
