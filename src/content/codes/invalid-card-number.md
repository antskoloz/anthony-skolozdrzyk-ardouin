---
slug: invalid-card-number
title: Invalid Card Number
category: card-issuer-restriction
summary: >-
  This decline means the card number entered doesn't match any real,
  active account — often due to a typo, an outdated saved card, or a
  card number that was never issued. It's usually a data-entry or
  stored-data problem rather than fraud or funds availability.
schemeCodes:
  - scheme: visa
    code: "14"
    label: Invalid Card Number
  - scheme: mastercard
    code: "14"
    label: Invalid Account Number
  - scheme: amex
    code: R14
    label: Invalid Card Number
commonCauses:
  - The customer mistyped one or more digits of the card number at checkout.
  - A saved card on file is outdated because the customer's card was reissued with a new number (e.g. after a breach or reissue).
  - The card number was entered in the wrong field format (e.g. spaces or dashes not stripped before submission).
merchantActions:
  - Ask the customer to double-check and re-enter their card number carefully, ideally without copy-pasting from another source.
  - For saved/stored cards, prompt the customer to re-add their card since it may have been reissued with new details.
  - Ensure your checkout form validates card number length and the Luhn checksum client-side before submission, to catch typos before they reach the processor.
preventionTips:
  - Use a card network account updater service to automatically refresh stored card numbers when cards are reissued.
  - Add real-time card number format validation (length, prefix, Luhn check) in your checkout form.
  - Avoid manual card-number entry where possible — support digital wallets or saved-card autofill to reduce typos.
relatedSlugs:
  - suspected-fraud-pickup-card
  - insufficient-funds
faq:
  - question: Does this decline mean the customer is using a fake card?
    answer: >-
      Not usually. It most often reflects a simple typo or an out-of-date
      saved card rather than an attempt at fraud, though a pattern of many
      invalid-number attempts from the same source can be a fraud signal.
  - question: How can merchants reduce this decline type?
    answer: >-
      Client-side validation (length and Luhn checksum checks) before
      submitting the transaction catches most typos immediately, without
      needing a round trip to the processor.
lastUpdated: 2026-09-13
---

Invalid card number declines are usually the easiest for merchants to help resolve on the spot, since the fix is almost always a simple re-entry or an updated saved card.
