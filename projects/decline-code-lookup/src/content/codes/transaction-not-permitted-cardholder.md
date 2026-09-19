---
slug: transaction-not-permitted-cardholder
title: Transaction Not Permitted to Cardholder
category: risk-compliance
summary: >-
  This decline means the issuer does not allow this specific cardholder's
  card to be used for the type of transaction attempted — for example, a
  debit card blocked from card-not-present purchases, or a card restricted
  from certain merchant categories such as gambling. The restriction is set
  by the issuer on the cardholder's account, not by the merchant.
schemeCodes:
  - scheme: visa
    code: "57"
    label: Transaction Not Permitted to Cardholder
  - scheme: mastercard
    code: "57"
    label: Transaction Not Permitted to Cardholder
commonCauses:
  - The card is configured for card-present use only and was used in an online or phone transaction.
  - The cardholder's account has opted into or been placed under merchant-category restrictions (e.g. blocking gambling or adult-content purchases).
  - The card is a limited-use product (student, prepaid, or benefits card) that restricts certain transaction types by design.
merchantActions:
  - Advise the customer to contact their issuer to confirm what transaction types their card permits and whether the restriction can be lifted.
  - Offer an alternative payment method, since this restriction cannot be resolved from the merchant side.
  - Avoid retrying the same transaction unchanged, as the issuer-level restriction will apply consistently until the cardholder acts.
preventionTips:
  - Clearly communicate at checkout which payment methods and card types are accepted for your transaction type.
  - For merchants in restricted verticals, offer alternative payment rails (bank transfer, digital wallets) alongside card payments.
  - Track this decline by transaction channel (online vs. in-person) to identify if a disproportionate share of customers have channel-restricted cards.
relatedSlugs:
  - transaction-not-permitted-terminal
  - merchant-category-blocked
  - restricted-card
  - do-not-honor
faq:
  - question: Can the merchant remove this restriction?
    answer: >-
      No. The restriction lives on the cardholder's account with their
      issuer. The merchant can only suggest the customer contact their bank
      or try a different payment method.
  - question: Is this the same as a merchant category being blocked?
    answer: >-
      They share the same underlying network code, but this page covers the
      general case of any cardholder-level transaction-type restriction.
      Merchant-category blocking is a specific, common scenario worth its
      own explanation — see the related "Merchant Category Restricted by
      Issuer" entry.
lastUpdated: 2026-09-13
---

Because this response code is shared across many different underlying restrictions, merchants often cannot tell from the code alone whether the issue is channel-based, category-based, or product-based — only the issuer has that detail.
