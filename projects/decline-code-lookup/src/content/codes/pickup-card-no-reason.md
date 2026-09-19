---
slug: pickup-card-no-reason
title: Pick Up Card (No Reason Given)
category: fraud
summary: >-
  This decline instructs the merchant to retain the physical card if
  presented in person, without the issuer disclosing a specific reason. It
  differs from explicit lost-or-stolen pickup instructions in that the cause
  is undisclosed, but it should still be treated as a meaningful risk signal
  and handled per your processor's card-retention guidance.
schemeCodes:
  - scheme: visa
    code: "04"
    label: Pick Up Card
  - scheme: mastercard
    code: "04"
    label: Pick Up Card
commonCauses:
  - The issuer has flagged the card for an internal reason it does not disclose over the authorization network, such as suspected compromise.
  - The account may be closed, restricted, or under review, but the issuer has chosen not to specify why.
  - The card may have been reported lost or stolen, with the issuer withholding the specific reason code.
merchantActions:
  - For in-person transactions, follow your payment processor's documented card-retention procedure carefully and without confronting the customer.
  - Prioritize staff safety at all times — no card-retention instruction should be followed if it risks a confrontation or unsafe situation.
  - For card-not-present transactions, treat this as a hard decline — do not retry, split, or fulfill the order, and consider manual review.
preventionTips:
  - Train staff in advance on how to handle a pickup-card instruction calmly and safely, so they aren't improvising in the moment.
  - Use fraud-scoring and velocity-monitoring tools to catch high-risk transactions before they escalate to a pickup-card response.
  - Document every occurrence of this decline for your own risk records, even when the issuer provides no further detail.
relatedSlugs:
  - suspected-fraud-pickup-card
  - restricted-card
  - do-not-honor
  - security-violation
faq:
  - question: How is this different from a lost or stolen card pickup decline?
    answer: >-
      Explicit lost-or-stolen pickup codes tell the merchant the specific
      reason the issuer wants the card retained. This code carries the same
      pickup instruction but without disclosing why, which is why it should
      still be treated as a genuine risk signal.
  - question: Should staff ever put themselves at risk to retain a card?
    answer: >-
      No. Card network rules acknowledge that merchant and staff safety
      comes first — the pickup instruction should be followed only when it
      can be done safely and without confrontation.
lastUpdated: 2026-09-13
---

Because no reason accompanies this decline, merchants often have less certainty about the underlying cause than with a labeled lost-or-stolen instruction, which makes calm, procedure-driven handling especially important.
