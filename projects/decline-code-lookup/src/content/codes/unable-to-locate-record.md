---
slug: unable-to-locate-record
title: Unable to Locate Record
category: technical-processing
summary: >-
  An "Unable to Locate Record" decline occurs when the issuer can't find the
  original transaction a follow-up message refers to, such as a capture,
  void, or reversal. It typically results from a timing mismatch, an
  expired authorization, or a reference number error rather than any issue
  with the cardholder's account.
schemeCodes:
  - scheme: visa
    code: "25"
    label: Unable to Locate Record
  - scheme: mastercard
    code: "25"
    label: Unable to Locate Record
commonCauses:
  - The original authorization has already expired before the capture, void, or reversal was submitted.
  - A reference number, retrieval reference number (RRN), or transaction ID in the follow-up message doesn't match the original transaction on file.
  - The original transaction was processed by a different acquirer or settled through a different batch than the one referenced.
merchantActions:
  - Verify the reference number or transaction ID being used for the capture, void, or reversal matches the original authorization exactly.
  - Check whether the original authorization has expired; if so, a new authorization may be required instead of a capture.
  - Contact your processor with both transaction IDs, original and follow-up, if the mismatch can't be resolved from your own records.
preventionTips:
  - Capture or settle authorizations promptly, well within the card network's authorization validity window, to avoid expiration-related mismatches.
  - Ensure your system reliably stores and reuses the exact reference numbers returned in the original authorization response.
  - Reconcile pending authorizations regularly so stale or orphaned transactions are identified before a follow-up action is attempted.
relatedSlugs:
  - duplicate-transaction
  - re-enter-transaction
  - format-error
  - error-transaction
faq:
  - question: Does this decline mean the original sale failed?
    answer: >-
      No. It usually means a follow-up message, like a capture or void,
      referenced a transaction the issuer can no longer find — often
      because too much time passed or the reference number doesn't match,
      not because the original sale itself failed.
  - question: How can I fix a transaction stuck with this error?
    answer: >-
      Confirm the exact reference number from the original authorization
      and resubmit the follow-up action; if the original authorization has
      expired, you may need to run a new transaction instead.
lastUpdated: 2026-09-13
---

This code most commonly surfaces in settlement and reconciliation workflows rather than at the point of sale, since it applies to messages that reference a prior transaction. Prompt, accurate capture and reversal processing significantly reduces how often it appears.
