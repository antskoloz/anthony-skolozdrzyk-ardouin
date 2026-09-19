---
slug: response-received-too-late
title: Response Received Too Late (Timeout)
category: technical-processing
summary: >-
  A "Response Received Too Late" (timeout) decline occurs when the issuer's
  authorization response didn't arrive within the card network's required
  timeframe, so the transaction was automatically declined. It usually
  reflects a temporary network, connectivity, or system performance issue
  rather than any problem with the cardholder's account, and often succeeds
  on retry.
schemeCodes:
  - scheme: visa
    code: "68"
    label: Response Received Too Late
  - scheme: mastercard
    code: "68"
    label: Response Received Too Late
commonCauses:
  - The issuer's authorization system was experiencing high load or a temporary outage, delaying its response.
  - Network congestion or a routing issue between the acquirer, network, and issuer delayed message delivery.
  - The issuer's system was undergoing maintenance or a batch process that slowed real-time responses.
merchantActions:
  - Retry the transaction shortly after the timeout, since most timeouts are transient and resolve on a second attempt.
  - Avoid submitting multiple duplicate authorizations in rapid succession while waiting, as this can cause duplicate holds if the original request eventually completes.
  - If timeouts are frequent, check with your processor whether there's a known network or issuer-side performance issue.
preventionTips:
  - Configure your gateway or terminal to use appropriate timeout thresholds and automatic single retries for this specific response.
  - Monitor timeout rates by issuer to spot systemic issuer-side performance problems.
  - Maintain reliable, redundant network connectivity for your POS or e-commerce checkout to minimize merchant-side contributions to timeouts.
relatedSlugs:
  - re-enter-transaction
  - issuer-unavailable
  - system-malfunction
  - error-transaction
faq:
  - question: Was the customer's card actually declined?
    answer: >-
      Not necessarily — a timeout means the issuer's response simply didn't
      arrive in time, not that the issuer refused the transaction. Retrying
      often succeeds because the underlying account may be perfectly fine.
  - question: Could retrying cause the customer to be charged twice?
    answer: >-
      It's possible if the original, slow-to-respond authorization
      eventually completes after you've already submitted a new one, so
      it's good practice to check for duplicate authorizations before
      retrying multiple times.
lastUpdated: 2026-09-13
---

Timeouts sit at the intersection of network performance and issuer system health, and a sudden increase across many transactions often indicates a broader, temporary outage rather than an issue specific to any one merchant or card. Reconciling pending authorizations after a wave of timeouts helps catch any duplicate charges.
