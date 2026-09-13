---
slug: financial-institution-not-found
title: Financial Institution Not Found
category: technical-processing
summary: >-
  This decline means the routing information attached to the transaction
  couldn't be matched to a valid financial institution, often due to a
  BIN (bank identification number) table issue or a routing configuration
  error. It is a technical failure, not an indication of fraud or account
  problems.
schemeCodes:
  - scheme: visa
    code: "92"
    label: Financial Institution Not Found
  - scheme: mastercard
    code: "92"
    label: Financial Institution Not Found
commonCauses:
  - The card's BIN range is missing, outdated, or misconfigured in a routing table used by the acquirer or network.
  - The card number was mistyped or corrupted in transit, producing a BIN that doesn't map to any known issuer.
  - A recently issued card range hasn't yet been fully propagated across all processors' routing tables.
merchantActions:
  - Ask the customer to re-verify and re-enter their card number carefully, since a single mistyped digit can cause this decline.
  - If the decline persists on a card that previously worked, contact your payment processor to check whether their BIN table needs updating.
  - Offer the customer an alternative payment method if the issue can't be resolved quickly at checkout.
preventionTips:
  - Use a card-validation step (such as a Luhn check) on the checkout form to catch obviously mistyped card numbers before submission.
  - Keep your payment processor informed of any patterns of this decline tied to specific card ranges so their routing tables can be updated.
  - Monitor for clusters of this decline around new card product launches, which can indicate routing tables lagging behind newly issued BIN ranges.
relatedSlugs:
  - issuer-unavailable
  - no-such-issuer
  - invalid-card-number
  - format-error
faq:
  - question: Does this decline mean the customer's bank doesn't exist?
    answer: >-
      No. It means the transaction's routing data couldn't be matched to a
      known financial institution in the network or processor's tables —
      usually a technical or data issue rather than anything about the
      customer's actual bank.
  - question: Is this the customer's fault?
    answer: >-
      Rarely. Aside from a simple card-number typo, this decline is almost
      always caused by routing or BIN table issues upstream of the customer,
      and is best resolved by checking with your payment processor.
lastUpdated: 2026-09-13
---

This code is most common with cards from newly launched BIN ranges or smaller, regional issuing banks whose routing details may not yet be fully synchronized across every processor and network node.
