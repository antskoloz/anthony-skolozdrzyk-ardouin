---
slug: restricted-card
title: Restricted Card
category: risk-compliance
summary: >-
  A Restricted Card decline means the issuer has placed a specific
  limitation on this card — such as a geographic usage restriction, sanctions
  screening flag, or card-program limitation — unrelated to available funds
  or general fraud suspicion. Some variants instruct the merchant to retain
  the physical card.
schemeCodes:
  - scheme: visa
    code: "62"
    label: Restricted Card
  - scheme: visa
    code: "36"
    label: Restricted Card — Pick Up
  - scheme: mastercard
    code: "62"
    label: Restricted Card
  - scheme: mastercard
    code: "36"
    label: Restricted Card — Pick Up
commonCauses:
  - The card is restricted to use within a specific country or region and the transaction originated outside it.
  - The card is subject to sanctions or watch-list screening tied to the cardholder, merchant, or transaction location.
  - The card belongs to a limited-use program (e.g. a corporate, government, or gift card product) that restricts certain merchant types or transaction channels.
merchantActions:
  - If the response includes a pickup instruction, follow your acquirer's documented procedure for card retention rather than improvising.
  - Advise the customer to contact their issuer directly, since only the issuer can explain and lift the specific restriction.
  - Offer an alternative payment method so the sale isn't lost while the restriction is investigated.
preventionTips:
  - For cross-border merchants, clearly disclose accepted card types and regions at checkout to set expectations.
  - Avoid retrying the same restricted card repeatedly, as retries won't override an issuer-level restriction.
  - Monitor restricted-card decline rates by geography to identify markets where cardholder restrictions are common.
relatedSlugs:
  - suspected-fraud-pickup-card
  - transaction-not-permitted-cardholder
  - violation-of-law
  - do-not-honor
faq:
  - question: Does a Restricted Card decline always mean the card was reported stolen?
    answer: >-
      No. It can reflect a routine program limitation, such as a card that
      only works domestically or a corporate card restricted from certain
      merchant categories, not necessarily theft or fraud.
  - question: What should I do if the response tells me to pick up the card?
    answer: >-
      Follow your acquirer's card-retention procedure exactly. Never
      physically confront or detain a customer — most processors advise
      against attempting to retain a card in person for staff safety reasons.
lastUpdated: 2026-09-13
---

Because the "pick up" variant carries real operational and legal implications for in-person merchants, staff should be trained in advance on their processor's specific retention policy rather than relying on judgment in the moment.
