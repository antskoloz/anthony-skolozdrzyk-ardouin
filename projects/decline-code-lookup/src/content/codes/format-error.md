---
slug: format-error
title: Format Error
category: technical-processing
summary: >-
  A "Format Error" decline means the transaction message sent to the
  network was malformed — missing a required field, containing an invalid
  value, or structured incorrectly. It is almost always caused by a bug or
  misconfiguration in the merchant's payment gateway, POS, or integration
  rather than anything related to the cardholder.
schemeCodes:
  - scheme: visa
    code: "30"
    label: Format Error
  - scheme: mastercard
    code: "30"
    label: Format Error
commonCauses:
  - A required field, such as expiration date, merchant category code, or currency, is missing from the transaction message.
  - A field contains data in the wrong format or length, such as an incorrectly padded account number.
  - A recent software update to the POS, gateway, or terminal introduced a bug in how transaction messages are constructed.
merchantActions:
  - Escalate to your payment gateway or processor immediately — this is a technical integration issue, not something the customer or merchant can fix at checkout.
  - Avoid repeatedly retrying the same transaction, since a malformed message will fail identically every time until corrected.
  - Check for recent updates to your POS software, terminal firmware, or gateway integration that coincide with when the errors began.
preventionTips:
  - Thoroughly test all required and optional fields against your processor's message specification before deploying integration changes.
  - Use a certified payment gateway or SDK that handles message formatting automatically, reducing the risk of manual formatting bugs.
  - Set up alerting for a spike in format errors so integration bugs are caught quickly after any software deployment.
relatedSlugs:
  - invalid-transaction
  - invalid-amount
  - error-transaction
  - function-not-supported
faq:
  - question: Is a "Format Error" decline something the customer can fix?
    answer: >-
      No. This decline is caused by a malformed transaction message from
      the merchant's payment system, not anything about the customer's card
      or account, so the customer can't resolve it by retrying or using a
      different card.
  - question: How urgently should we address a Format Error decline?
    answer: >-
      Very — since the underlying message format is broken, every
      transaction using that same code path will likely fail the same way,
      so it should be escalated to your gateway or processor as soon as
      it's noticed.
lastUpdated: 2026-09-13
---

Format Error declines are a strong signal to check your integration rather than any individual transaction, since the issue lies in how the message itself was constructed. They often appear suddenly after a software update, new terminal deployment, or processor migration.
