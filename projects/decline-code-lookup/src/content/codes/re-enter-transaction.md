---
slug: re-enter-transaction
title: Re-enter Transaction
category: technical-processing
summary: >-
  A "Re-enter Transaction" decline is a request from the issuer to resubmit
  the transaction after a transient error, such as a brief communication
  glitch, prevented normal processing the first time. It is not a true
  decline of the sale — most re-entered transactions succeed on the next
  attempt with no changes needed.
schemeCodes:
  - scheme: visa
    code: "19"
    label: Re-enter Transaction
  - scheme: mastercard
    code: "19"
    label: Re-enter Transaction
commonCauses:
  - A brief communication or network glitch interrupted processing between the acquirer, network, and issuer.
  - The issuer's system was momentarily busy or restarting when the request arrived.
  - A timing mismatch or dropped packet occurred during message routing.
merchantActions:
  - Simply resubmit the transaction — this code is explicitly an instruction to retry, not a decline of the sale itself.
  - If repeated retries all return the same code, wait a short period before trying again, since it may indicate a broader temporary outage.
  - Avoid charging the customer's card multiple times if a retry succeeds after an initial response; check for duplicate authorizations.
preventionTips:
  - Build automatic single-retry logic into your payment integration for this specific response code, since a resubmission usually succeeds.
  - Monitor for spikes in this code, which can indicate a broader network or issuer outage worth escalating to your processor.
  - Ensure your terminal or gateway has reliable, low-latency connectivity to reduce transient communication failures.
relatedSlugs:
  - error-transaction
  - response-received-too-late
  - system-malfunction
  - issuer-unavailable
faq:
  - question: Should I tell the customer their card was declined?
    answer: >-
      No — "Re-enter Transaction" isn't a real decline. It's the issuer
      asking for the transaction to be resubmitted after a brief technical
      hiccup, and it typically succeeds on the next attempt.
  - question: Why does this code appear repeatedly for the same customer?
    answer: >-
      Repeated occurrences usually point to a connectivity or system issue
      at the network or issuer level rather than anything wrong with the
      card, and may warrant contacting your processor if it persists.
lastUpdated: 2026-09-13
---

Because this response is explicitly a retry instruction rather than a refusal, it should be treated differently from most other decline codes in reporting and reconciliation. A single automatic resubmission resolves the vast majority of these cases without any customer-facing friction.
