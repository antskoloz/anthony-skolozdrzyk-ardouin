---
slug: suspected-fraud-general
title: Suspected Fraud (No Pickup)
category: fraud
summary: >-
  This decline means the card issuer's fraud-detection system flagged the
  transaction as likely fraudulent and blocked it outright, without asking
  the merchant to retain the physical card. It differs from a pickup-card
  fraud response, which is reserved for cases where the issuer believes the
  card itself is lost, stolen, or counterfeit.
schemeCodes:
  - scheme: visa
    code: "59"
    label: Suspected Fraud
  - scheme: mastercard
    code: "59"
    label: Suspected Fraud
commonCauses:
  - The issuer's automated fraud-scoring model rated the transaction as high-risk based on amount, velocity, or merchant category.
  - The purchase pattern doesn't match the cardholder's typical spending behavior (unusual location, device, or time of day).
  - The transaction was flagged by a shared industry fraud database or network-level risk signal, even though the physical card is not believed to be compromised.
merchantActions:
  - Do not attempt to retain the card or treat the customer as a confirmed fraudster — this code does not instruct pickup and the cardholder may be entirely legitimate.
  - Advise the customer to contact their card issuer to clear the flag, since only the issuer can release the hold.
  - Offer an alternative payment method to avoid losing the sale while the issuer's fraud review is pending.
preventionTips:
  - Submit rich transaction data (AVS, CVV, 3-D Secure, device fingerprinting) so issuer fraud models have more context to score the transaction accurately.
  - Enable 3-D Secure for higher-risk transactions, which shifts fraud liability and can reduce false-positive declines.
  - Monitor decline patterns by BIN or issuer to identify if legitimate customer segments are being disproportionately flagged.
relatedSlugs:
  - suspected-fraud-pickup-card
  - do-not-honor
  - security-violation
  - 3ds-authentication-failed
faq:
  - question: Does this mean the customer is committing fraud?
    answer: >-
      Not necessarily. This code reflects the issuer's automated risk model
      flagging the transaction as suspicious — it is frequently a false
      positive triggered by unusual but legitimate spending behavior.
  - question: How is this different from a "pickup card" fraud decline?
    answer: >-
      A pickup card response instructs the merchant to physically retain the
      card because the issuer believes it is lost, stolen, or counterfeit.
      This code simply blocks the transaction without any pickup instruction.
lastUpdated: 2026-09-13
---

Because this response carries no pickup instruction, merchants should treat it as a risk-model decision rather than evidence of wrongdoing, and should never confront or detain a customer based on it alone.
