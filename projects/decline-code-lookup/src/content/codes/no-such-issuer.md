---
slug: no-such-issuer
title: No Such Issuer
category: technical-processing
summary: >-
  A "No Such Issuer" decline means the card number's issuer identification
  number (the first six-to-eight digits, or BIN/IIN) doesn't match any
  recognized financial institution in the routing network. It usually
  results from a mistyped or mis-keyed card number rather than fraud, and
  the transaction cannot succeed until the correct card number is entered.
schemeCodes:
  - scheme: visa
    code: "15"
    label: No Such Issuer
  - scheme: mastercard
    code: "15"
    label: No Such Issuer
commonCauses:
  - The card number was mistyped or mis-keyed during manual entry.
  - The card was misread by a chip, swipe, or contactless reader, corrupting the account number.
  - The card is very old, foreign, or from a niche or defunct issuer whose BIN is no longer active in the routing tables.
merchantActions:
  - Ask the customer to double-check and re-enter their card number, or try dipping or tapping the card again if it was manually keyed.
  - Try an alternate entry method, such as chip, tap, or swipe, if the number was originally hand-keyed.
  - If the error persists on a card that should be valid, ask the customer to contact their issuer to confirm the card is active and correctly issued.
preventionTips:
  - Encourage chip, tap, or swipe entry over manual key-entry wherever possible to reduce transcription errors.
  - Use real-time card number format and length (Luhn) validation at the point of entry to catch mistyped numbers before submission.
  - Keep card reader hardware maintained and calibrated to reduce misreads that corrupt the account number.
relatedSlugs:
  - invalid-card-number
  - format-error
  - error-transaction
  - unable-to-locate-record
faq:
  - question: Does "No Such Issuer" mean the card is fraudulent?
    answer: >-
      Not necessarily. It most often means the card number was mistyped,
      mis-keyed, or misread by a card reader, rather than being tied to
      fraud.
  - question: What should the customer do if their card number is definitely correct?
    answer: >-
      They should contact their card issuer directly to confirm the card is
      active and properly registered in the network's routing tables, since
      a persistent error despite a correct number can indicate an issue on
      the issuer's side.
lastUpdated: 2026-09-13
---

This decline occurs at the network-routing stage, before the transaction ever reaches an issuer, because the BIN doesn't map to any institution. It's most often a simple data-entry or card-read error rather than a sign of a fake or compromised card.
