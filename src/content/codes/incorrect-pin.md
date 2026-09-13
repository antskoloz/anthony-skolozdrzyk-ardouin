---
slug: incorrect-pin
title: Incorrect PIN
category: card-issuer-restriction
summary: >-
  An "Incorrect PIN" decline means the cardholder entered a PIN that doesn't
  match the issuer's record for this card. It's distinct from a
  cannot-verify-PIN technical failure and from PIN-tries-exceeded lockouts —
  it simply signals a mismatched entry that the cardholder can usually
  correct on the next attempt.
schemeCodes:
  - scheme: visa
    code: "55"
    label: Incorrect PIN
  - scheme: mastercard
    code: "55"
    label: Incorrect PIN
commonCauses:
  - The cardholder simply mistyped or misremembered their PIN.
  - The card was recently reissued or reset, and the cardholder is using an old PIN.
  - Keypad input error at the terminal, such as a stuck key or accidental extra digit.
merchantActions:
  - Ask the customer to carefully re-enter their PIN, double-checking each digit before confirming.
  - If the decline repeats, suggest the customer try a different card or payment method to avoid triggering a PIN lockout.
  - Never ask the customer to say their PIN aloud or write it down — direct them to re-enter it privately on the pad.
preventionTips:
  - Ensure PIN pads have clear, responsive keypads and visible entry feedback to reduce accidental mis-entry.
  - Post signage or verbal reminders encouraging customers to enter PINs carefully rather than rushing.
  - Educate staff to recognize this decline and calmly guide the customer to retry, rather than assuming card failure.
relatedSlugs:
  - allowable-pin-tries-exceeded
  - cannot-verify-pin
  - no-checking-account
  - do-not-honor
faq:
  - question: How is this different from "PIN Tries Exceeded"?
    answer: >-
      "Incorrect PIN" reflects a single mismatched entry that can typically
      be retried right away. "PIN Tries Exceeded" means the cardholder has
      already failed too many attempts and the issuer has temporarily
      locked PIN transactions on the card.
  - question: How many times can a customer retry after an incorrect PIN decline?
    answer: >-
      This is set by the issuer, not the merchant, and is usually a small
      number of attempts (often three) before the card locks. Merchants
      should encourage careful entry rather than repeated quick retries.
lastUpdated: 2026-09-13
---

Merchants and staff should treat repeated incorrect-PIN declines as a cue to slow down and suggest an alternate payment method, since continuing to retry risks triggering a full PIN lockout on the customer's card.
