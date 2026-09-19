---
title: "Credit Card Decline Codes Explained in Plain English"
description: "What do Visa, Mastercard and Amex decline codes mean? A plain-English guide to the most common codes and what merchants should do next."
pubDate: 2026-09-27
tags: ["payments", "decline codes", "authorization", "e-commerce"]
draft: true
---

> **Short answer:** A decline code is a short message from the card issuer or network explaining why a payment was refused. The same number can mean different things on different networks, and many declines arrive as a vague "do not honor." Group codes by the action they call for: retry, fix the data, authenticate, or use another payment method.

When a payment fails, your payment provider often shows a code such as 05, 51 or 1A. This guide translates the most common ones for Visa, Mastercard and American Express, and shows how to turn them into a sensible next step.

## What is a decline code?

Whenever a card payment is declined, the issuer provides codes that your provider passes on to you. Stripe's documentation describes two kinds of network codes:

- A **network decline code**, a 2 to 4 character code that says why the payment was declined.
- A **network advice code**, which offers guidance on how to handle the decline. Mastercard calls these Merchant Advice Codes (MAC).

Stripe stresses that the meaning of a code differs by card network, so always read a code together with the card brand.

Providers also map network codes into their own labels. Stripe, for example, has its own decline codes, such as `insufficient_funds` and `authentication_required`, which cover many of the same reasons in more detail.

*Sources: [Stripe: Card declines](https://docs.stripe.com/declines/card), [Stripe: Decline codes](https://docs.stripe.com/declines/codes).*

## What do the most common Visa codes mean?

The meanings follow the network-code reference in Stripe's documentation. The "usual next step" column is my own suggestion, not part of that reference.

| Code | Meaning | Usual next step |
| --- | --- | --- |
| 05 | Do not honor | The issuer refused without a specific reason. Ask the customer to try another card or contact their bank. |
| 51 | Not sufficient funds | Offer another payment method. |
| 14 | Invalid account number | Ask the customer to re-enter the card number. |
| 54 | Expired card or expiration date missing | Ask for a new card or corrected expiry. |
| 57 | Transaction not permitted to cardholder | The customer needs to contact their issuer. |
| 59 | Suspected fraud | Do not reveal the reason. Show a generic message. |
| 61 | Exceeds approval amount limit | The amount is above the card's limit. Customer contacts the issuer or uses another card. |
| 62 | Restricted card (invalid in this region or country) | Offer another payment method. |
| 65 | Exceeds withdrawal frequency limit | Try again later or use another card. |
| 91 | Issuer or switch inoperative | Technical. Retrying later may work. |
| 96 | System malfunction | Technical. Retrying later may work. |
| 1A | Additional customer authentication required | Trigger 3D Secure or strong customer authentication. |
| N7 | Decline for CVV2 failure | Ask the customer to re-enter the CVC. |

## What do Mastercard codes mean?

Mastercard uses many of the same numbers but adds Merchant Advice Codes (MAC) in parentheses, which change the advice.

| Code | Meaning (per Stripe's reference) |
| --- | --- |
| 05 | Do not honor |
| 51 (MAC 01, 02 or 03) | Insufficient funds or over credit limit |
| 14 | Invalid card number |
| 54 | Expired card |
| 57 | Transaction not permitted to issuer or cardholder |
| 65 | Exceeds withdrawal count limit, or an Identity Check soft decline of EMV 3DS authentication |
| 79 (MAC 01) | Expired card, a lifecycle decline where updated card data is available |
| 79 (MAC 02) | Invalid credentials, a lifecycle decline that may be retried later |
| 79 (MAC 03) | Account credentials not found, do not retry |
| 82 (MAC 03) | Invalid transaction or merchant, do not retry |
| 83 (MAC 02) | Retry the transaction later |
| 91 / 96 | Issuer system inoperative / system error |

Notice how the MAC changes the advice: code 79 can mean "updated card data is available," "try later" or "never retry," depending on the advice code attached.

## What do American Express codes mean?

Amex uses three-digit codes:

| Code | Meaning (per Stripe's reference) |
| --- | --- |
| 100 | Deny |
| 101 | Expired card or invalid expiry |
| 107 | Call issuer |
| 116 | Not sufficient funds |
| 121 | Limit exceeded |
| 122 | Invalid CVC |
| 130 | Additional customer authentication required |
| 912 | Issuer not available |

## How should I group codes into actions?

Instead of memorizing hundreds of codes, sort them by the response they need. This grouping is my own suggestion, built on the advice codes Stripe documents (`try_again_later`, `do_not_try_again` and `confirm_card_data`).

| Group | Examples | What to do |
| --- | --- | --- |
| **Fix the data** | 14, 54, N7, Amex 122 | Ask the customer to correct card number, expiry or CVC. |
| **Authenticate** | 1A, Amex 130, `authentication_required` | Run 3D Secure or strong customer authentication. |
| **Retry later** | 91, 96, Mastercard 83 (MAC 02) | Retry, within network and provider limits. |
| **Use another method** | 51, 61, 62, 65 | Offer a different card or payment method. |
| **Do not retry** | Mastercard 79 (MAC 03), 82 (MAC 03) | Stop retrying this credential. |
| **Do not explain** | 59, lost or stolen card codes | Show a generic decline message. |

Stripe's guidance backs the last row: for fraudulent, lost or stolen cards, do not report detailed information to the customer and present the decline the same way as a generic decline.

## How many times can I retry a payment?

Card networks limit the number of times you can reattempt a single charge. Stripe recommends a maximum of eight retries for charges that permit retries, and warns that issuers may treat extra retries as possible fraud, which can increase declines for legitimate charges. Check your own provider's retry rules, because they differ.

## Why are so many declines "do not honor"?

Issuers often categorize declines as generic. Stripe's guide says many transactions are categorized as generic declines with the code "05: Do not honor," and that the issuer shares specifics only with the cardholder. When you see one, look at the surrounding data: did the CVC or address check fail, is the card issued in a different country than the customer's IP address, or is this an off-session payment that needed authentication?

## Want a faster lookup?

I built a free tool, the [Decline Code Lookup](https://antskoloz.github.io/decline-code-lookup/), which translates Visa, Mastercard and Amex decline codes into plain English with practical guidance for merchants. To see how decline reasons translate into lost revenue, read [Why False Declines Cost E-commerce More Than You Think](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/why-false-declines-cost-ecommerce-more-than-you-think/).

## Frequently asked questions

**Does the same code mean the same thing on every network?**
No. Stripe notes the meaning differs by card network, so read the code together with the card brand.

**What is a soft decline?**
A soft decline is one that may succeed on retry or after an extra step, such as 3D Secure. Mastercard's code 65 can represent an Identity Check soft decline, and Visa's 1A asks for additional authentication.

**What is a hard decline?**
A hard decline means the issuer will not approve the payment with that credential, for example an account that no longer exists. Retrying usually does not help.

**Should I tell the customer the exact decline reason?**
For most reasons, a clear, friendly prompt helps. For suspected fraud or lost and stolen cards, use a generic message.

## Sources

- [Stripe: Network decline codes](https://docs.stripe.com/declines/network-codes)
- [Stripe: Decline codes](https://docs.stripe.com/declines/codes)
- [Stripe: Card declines](https://docs.stripe.com/declines/card)
- [Stripe: Optimizing authorization rates](https://stripe.com/guides/optimizing-authorization-rates)

*Last reviewed: 19 September 2026. Codes and their handling can change, so confirm against your own provider's current documentation.*
