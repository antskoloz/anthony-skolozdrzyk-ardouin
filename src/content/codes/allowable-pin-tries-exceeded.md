---
slug: allowable-pin-tries-exceeded
title: PIN Tries Exceeded
category: fraud
summary: >-
  A "PIN Tries Exceeded" decline means the cardholder has entered an
  incorrect PIN too many times, and the issuer has temporarily locked
  PIN-based transactions on the card as a security precaution. It can
  reflect genuine cardholder forgetfulness or an attempted unauthorized use
  of the card, so it should be treated as a moderate risk signal.
schemeCodes:
  - scheme: visa
    code: "75"
    label: Allowable Number of PIN Tries Exceeded
  - scheme: mastercard
    code: "75"
    label: Allowable Number of PIN Tries Exceeded
commonCauses:
  - The cardholder genuinely forgot their PIN and made several unsuccessful attempts.
  - Someone other than the cardholder is attempting to guess the PIN on a lost, stolen, or found card.
  - A recently reissued card's PIN differs from what the cardholder expected, leading to repeated failed attempts.
merchantActions:
  - Do not allow further PIN attempts on this card at your terminal — the lock is enforced by the issuer and additional tries will not succeed.
  - Advise the customer to contact their card issuer directly to reset their PIN or verify their identity.
  - Offer the customer an alternative payment method, such as a signature-based transaction if supported, or a different card.
preventionTips:
  - Train staff to recognize this decline and immediately stop further PIN entry attempts rather than encouraging repeated retries.
  - Encourage customers to store PIN reset contact information from their issuer for quick resolution if this occurs.
  - Use fraud-monitoring tools to flag cards with repeated PIN-tries-exceeded events across multiple merchants as a potential compromise indicator.
relatedSlugs:
  - incorrect-pin
  - pickup-card-no-reason
  - suspected-fraud-pickup-card
  - restricted-card
faq:
  - question: Can the merchant unlock the card or reset the PIN?
    answer: >-
      No. Only the card issuer can reset the PIN or lift the lock. The
      merchant's role is simply to stop further attempts and direct the
      customer to contact their issuer.
  - question: Does this decline always mean fraud is happening?
    answer: >-
      Not always — many cases are simply a cardholder forgetting their PIN.
      However, because it can also indicate someone other than the
      cardholder attempting to guess it, it warrants more caution than a
      single incorrect-PIN entry.
lastUpdated: 2026-09-13
---

Because the lockout is enforced entirely on the issuer's side, merchants have no ability to override it locally, making prompt redirection to an alternate payment method or the issuer's support line the most effective response.
