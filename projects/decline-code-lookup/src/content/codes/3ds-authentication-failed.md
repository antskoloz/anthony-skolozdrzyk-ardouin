---
slug: 3ds-authentication-failed
title: 3-D Secure / Strong Customer Authentication Failed
category: risk-compliance
summary: >-
  This decline happens when 3-D Secure or Strong Customer Authentication
  (SCA) fails or isn't completed during checkout — increasingly required
  under regulations like PSD2 in Europe. There's no distinct network code
  for this scenario; the issuer typically declines the underlying
  authorization with a generic response such as "05 Do Not Honor."
schemeCodes:
  - scheme: visa
    code: "05"
    label: Do Not Honor — Authentication Failed
  - scheme: mastercard
    code: "05"
    label: Do Not Honor — Authentication Failed
commonCauses:
  - The cardholder abandoned or failed to complete the 3-D Secure challenge (e.g. an OTP or banking app approval step).
  - The merchant's checkout flow doesn't support 3-D Secure correctly, causing the authentication step to fail silently.
  - The transaction was subject to mandatory Strong Customer Authentication (e.g. under PSD2 in the EU/UK) and was submitted without completing it.
merchantActions:
  - Ensure your checkout properly redirects the customer through the full 3-D Secure challenge flow and handles the response correctly.
  - Advise the customer to complete the authentication step promptly (e.g. approving a push notification or entering an OTP) if the session timed out.
  - Offer to retry the transaction once the customer confirms they can complete the authentication step, rather than resubmitting unchanged.
preventionTips:
  - For merchants selling into the EU/UK or other SCA-mandated markets, implement 3-D Secure v2 (EMV 3DS) to meet regulatory requirements and reduce friction.
  - Use exemptions where permitted (e.g. low-value or trusted-beneficiary exemptions) to reduce unnecessary authentication steps and abandonment.
  - Monitor 3-D Secure completion rates separately from authorization rates to pinpoint where customers are dropping off in the challenge flow.
relatedSlugs:
  - avs-mismatch
  - do-not-honor
  - suspected-fraud-general
  - cvv-invalid
faq:
  - question: Is "3-D Secure failed" its own official decline code?
    answer: >-
      No. Card networks don't issue a distinct code for failed 3-D Secure
      authentication. The issuer simply declines the subsequent
      authorization request, most often with a generic code like "05 Do Not
      Honor," so merchants need their own 3DS-specific logging to identify
      this cause.
  - question: Why is this decline more common for European customers?
    answer: >-
      Regulations such as PSD2 mandate Strong Customer Authentication for
      most online card transactions in the EU/UK, so transactions that skip
      or fail this step are declined far more frequently there than in
      markets without an SCA mandate.
lastUpdated: 2026-09-13
---

Because the underlying authorization decline looks identical to other "05" responses, merchants operating in SCA-mandated markets should log 3-D Secure outcomes separately at the gateway level to distinguish authentication failures from other causes.
