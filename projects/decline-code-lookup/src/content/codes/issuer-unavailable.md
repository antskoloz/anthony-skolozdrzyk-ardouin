---
slug: issuer-unavailable
title: Issuer or Switch Inoperative
category: technical-processing
summary: >-
  This decline means the card issuer's system, or the network switch routing
  the transaction to it, was temporarily unreachable or down when the
  authorization request was sent. It is not a reflection of the cardholder's
  account status and typically resolves once the issuer's systems come back
  online.
schemeCodes:
  - scheme: visa
    code: "91"
    label: Issuer or Switch Inoperative
  - scheme: mastercard
    code: "91"
    label: Issuer or Switch Inoperative
commonCauses:
  - The issuing bank's authorization system is experiencing an outage or scheduled maintenance window.
  - A network switch or intermediary routing node between the acquirer and issuer is temporarily down.
  - Regional connectivity issues are preventing the authorization request from reaching the issuer in time.
merchantActions:
  - Ask the customer to wait a few minutes and retry the transaction, since these outages are usually short-lived.
  - Offer an alternative payment method if the issue persists, rather than repeatedly resubmitting the same card.
  - Check your payment processor's status page or contact support if this decline spikes across many different cards at once.
preventionTips:
  - Monitor decline code distributions so a sudden spike in "91" declines is flagged as a potential issuer or network outage rather than mistaken for a fraud or funding problem.
  - Configure smart routing or retry logic with your acquirer to automatically re-attempt authorization through an alternate path after a brief delay.
  - Communicate clearly at checkout that the issue is temporary and technical, reducing cart abandonment and support tickets.
relatedSlugs:
  - system-malfunction
  - financial-institution-not-found
  - re-enter-transaction
  - no-such-issuer
faq:
  - question: Does an "Issuer or Switch Inoperative" decline mean something is wrong with the customer's card?
    answer: >-
      No. This decline indicates a temporary system outage on the issuer's
      or network's side, not a problem with the cardholder's account,
      balance, or card status.
  - question: Should the merchant retry the transaction immediately?
    answer: >-
      A single retry after a short delay is usually reasonable, since these
      outages tend to be brief. Repeated immediate retries are unlikely to
      succeed if the underlying system is still down and may be better
      spaced a few minutes apart.
lastUpdated: 2026-09-13
---

Because this decline originates outside the cardholder's control, merchants should avoid treating it as a risk signal; if it affects a large share of transactions simultaneously, it is worth checking whether a specific issuer or regional switch is experiencing a broader outage.
