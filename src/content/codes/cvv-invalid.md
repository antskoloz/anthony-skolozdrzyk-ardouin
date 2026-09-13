---
slug: cvv-invalid
title: Invalid CVV/CVC
category: fraud
summary: >-
  An "Invalid CVV/CVC" decline means the security code submitted with the
  transaction doesn't match the issuer's record for that card. Because the
  CVV/CVC is printed only on the physical card and not stored in magnetic
  stripe or chip data, a mismatch is a strong signal that the card details
  were guessed, scraped, or entered from memory rather than read directly
  off a genuine card.
schemeCodes:
  - scheme: visa
    code: "82"
    label: Invalid CVV
  - scheme: mastercard
    code: "82"
    label: Invalid CVC2
commonCauses:
  - The customer mistyped the security code at checkout.
  - The card details being used were obtained through a data breach, phishing, or card-testing attack and the fraudster is guessing or lacks the correct CVV.
  - The customer is using outdated or incorrectly saved card details from a prior purchase.
merchantActions:
  - Ask legitimate customers to double-check the 3- or 4-digit code on their card and re-enter it carefully.
  - Do not allow unlimited retries of the CVV field on the same order, since this can enable card-testing or CVV-guessing attacks.
  - Flag orders with repeated CVV failures, especially across multiple cards from the same session or IP, for manual fraud review.
preventionTips:
  - Always require CVV entry for card-not-present transactions rather than relying on stored card numbers alone.
  - Rate-limit checkout attempts per session or IP address to blunt automated CVV-guessing and card-testing attacks.
  - Combine CVV checks with AVS and 3-D Secure for a stronger layered defense against card-testing fraud.
relatedSlugs:
  - avs-mismatch
  - suspected-fraud-general
  - 3ds-authentication-failed
  - invalid-card-number
faq:
  - question: Does an invalid CVV decline always mean fraud?
    answer: >-
      Not always — a legitimate customer can simply mistype the code.
      However, because CVV isn't stored in card data used for skimming or
      breaches, a wrong CVV is a meaningful fraud indicator, especially when
      paired with other risk signals.
  - question: Should merchants let customers retry the CVV field repeatedly?
    answer: >-
      No. Unlimited retries on the same order can be exploited by
      fraudsters running automated card-testing or CVV-guessing scripts.
      Limit attempts and flag repeated failures for review.
lastUpdated: 2026-09-13
---

Because CVV values aren't transmitted in chip, contactless, or magnetic stripe data, a mismatch on a card-not-present transaction carries more weight than a comparable mismatch might in other contexts, making it a key input to most e-commerce fraud-scoring models.
