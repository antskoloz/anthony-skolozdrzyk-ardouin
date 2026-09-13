---
slug: cannot-verify-pin
title: Cannot Verify PIN
category: technical-processing
summary: >-
  A "Cannot Verify PIN" decline means a technical failure prevented the
  issuer from validating the PIN entered, such as encryption key mismatches
  or a system outage — it is distinct from an incorrect PIN entry. The
  cardholder's PIN may be entirely correct; the issue lies in the
  verification process itself rather than the credential.
schemeCodes:
  - scheme: visa
    code: "86"
    label: Cannot Verify PIN
  - scheme: mastercard
    code: "86"
    label: Cannot Verify PIN
commonCauses:
  - A PIN encryption key mismatch or configuration issue exists between the terminal, acquirer, and issuer's PIN verification system.
  - The issuer's PIN verification system is temporarily down or experiencing a technical outage.
  - The terminal's PIN pad hardware or software has a fault preventing proper encryption of the entered PIN.
merchantActions:
  - Offer the customer a signature-based or chip-and-signature transaction if your terminal and card support a fallback method.
  - Ask the customer to try again, since a temporary issuer-side outage can resolve within minutes.
  - If the issue persists across multiple cards, contact your processor to check for a terminal or encryption key configuration problem.
preventionTips:
  - Keep PIN pad terminal software, firmware, and encryption keys current and properly provisioned by your acquirer.
  - Ensure your terminal fleet is regularly tested and certified for PIN verification after any hardware or software updates.
  - Monitor for spikes in this specific code, which often indicate a terminal fault or issuer outage rather than isolated cardholder errors.
relatedSlugs:
  - incorrect-pin
  - allowable-pin-tries-exceeded
  - system-malfunction
  - error-transaction
faq:
  - question: Does "Cannot Verify PIN" mean the customer typed the wrong PIN?
    answer: >-
      No — that would be a separate "Incorrect PIN" decline. "Cannot Verify
      PIN" means a technical problem prevented the verification process
      from completing at all, regardless of whether the PIN entered was
      correct.
  - question: What should we do if this happens repeatedly at one terminal?
    answer: >-
      Repeated occurrences at the same terminal usually point to a
      hardware, software, or encryption key problem, so it's worth having
      your processor inspect or re-provision that specific terminal.
lastUpdated: 2026-09-13
---

Because this decline reflects a breakdown in the verification process rather than a wrong PIN, offering a non-PIN fallback transaction method is often the fastest way to complete the sale. Persistent occurrences at a specific terminal warrant a hardware or configuration check.
