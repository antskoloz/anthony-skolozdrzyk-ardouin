---
slug: invalid-transaction
title: Invalid Transaction
category: technical-processing
summary: >-
  An "Invalid Transaction" decline means the transaction type, format, or
  combination of details submitted isn't supported for this card, terminal,
  or account type. It's typically a technical or configuration mismatch —
  such as attempting a transaction type the card doesn't support — rather
  than a fraud or funds issue, and often requires a corrected resubmission.
schemeCodes:
  - scheme: visa
    code: "12"
    label: Invalid Transaction
  - scheme: mastercard
    code: "12"
    label: Invalid Transaction
commonCauses:
  - The transaction type requested (e.g. cash advance, refund, or a specific card-not-present flow) isn't supported for this card product.
  - The card type doesn't match the transaction being attempted, such as using a debit-only card for a transaction requiring credit capability.
  - Required fields in the transaction message contain an invalid combination of values, such as an incompatible entry mode and transaction type.
merchantActions:
  - Verify the transaction type being submitted matches what the card and terminal actually support before retrying.
  - Check your POS or gateway configuration for the specific transaction, such as a refund or pre-authorization, that triggered the decline.
  - If the issue persists across multiple cards, contact your processor to confirm your integration is sending correctly formatted, supported transaction types.
preventionTips:
  - Test all transaction types your business uses, such as sale, refund, void, and pre-auth, in a sandbox environment during integration.
  - Keep POS and gateway software updated so new card products and transaction rules are supported correctly.
  - Train staff to recognize which transaction types, such as manual key-entry or cash advance, require special handling or aren't universally supported.
relatedSlugs:
  - invalid-amount
  - format-error
  - function-not-supported
  - error-transaction
faq:
  - question: What's the difference between "Invalid Transaction" and "Invalid Amount"?
    answer: >-
      "Invalid Transaction" flags a problem with the transaction type or its
      combination of details, while "Invalid Amount" specifically flags a
      problem with the amount field itself. Both are technical or format
      issues rather than fraud or funds problems.
  - question: Can the customer do anything to fix this?
    answer: >-
      Usually not — this decline points to a mismatch between the
      transaction type and what the card or terminal supports, so it's the
      merchant's payment setup that needs correcting, not the customer's
      card or account.
lastUpdated: 2026-09-13
---

Invalid Transaction declines are most common with less frequently used transaction types, such as cash advances, certain refund flows, or manual key-entry on terminals not configured for them. Reviewing exactly which transaction type triggered the decline is usually the fastest path to a fix.
