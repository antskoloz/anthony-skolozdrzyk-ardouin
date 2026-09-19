---
slug: merchant-category-blocked
title: Merchant Category Restricted by Issuer
category: risk-compliance
summary: >-
  This decline occurs when a cardholder's issuer or card program blocks
  entire categories of merchants — such as gambling, cryptocurrency, adult
  content, or cannabis — at the account level. It shares the same underlying
  network code as a general "transaction not permitted to cardholder"
  decline, but merchants in these verticals encounter it often enough that
  it deserves its own explanation.
schemeCodes:
  - scheme: visa
    code: "57"
    label: Transaction Not Permitted — Merchant Category
  - scheme: mastercard
    code: "57"
    label: Transaction Not Permitted — Merchant Category
commonCauses:
  - The issuer blocks specific merchant category codes (MCCs) by default for certain card products, such as prepaid or student cards excluding gambling.
  - The cardholder has opted into a spending-control feature that blocks categories like gambling, adult content, or cryptocurrency.
  - Regulatory or corporate card policies restrict purchases in the merchant's specific vertical (e.g. a corporate card blocking cannabis purchases even where locally legal).
merchantActions:
  - Advise the customer that their issuer has blocked this category and that only the issuer can lift or adjust the restriction.
  - Offer alternative payment options common in your vertical, such as ACH, digital wallets, or crypto-native payment rails, which may not route through the same restriction.
  - Avoid repeatedly retrying the same card, since the block is category-wide and will not clear on retry.
preventionTips:
  - Set expectations at checkout that some card issuers restrict purchases in your industry, and surface alternative payment methods proactively.
  - Work with a payment processor experienced in high-risk or restricted verticals, since routing and approval rates vary significantly by acquirer.
  - Track decline rates by issuer and BIN to identify which card programs most frequently block your merchant category.
relatedSlugs:
  - transaction-not-permitted-cardholder
  - transaction-not-permitted-terminal
  - restricted-card
  - violation-of-law
faq:
  - question: Why does my gambling or crypto business see this decline so often?
    answer: >-
      Many issuers proactively block entire merchant categories they
      consider higher-risk, including gambling, adult content, cannabis, and
      cryptocurrency, regardless of whether the specific transaction is
      legitimate.
  - question: Can I get my business reclassified to avoid this?
    answer: >-
      Your merchant category code (MCC) should accurately reflect your
      actual business activity — misclassifying it to dodge restrictions can
      violate your merchant agreement. Instead, focus on offering
      alternative payment methods for customers whose issuers block your
      category.
lastUpdated: 2026-09-13
---

Because this restriction is applied by the issuer to entire categories rather than individual merchants, even a well-established business with a clean processing history will see it consistently from certain card programs.
