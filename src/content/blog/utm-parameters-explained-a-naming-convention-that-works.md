---
title: "UTM Parameters Explained: A Naming Convention That Won't Break Your Reports"
description: What each UTM parameter does, the case-consistency trap that
  splits your reports, and a simple naming convention that keeps tracking
  usable.
pubDate: 2026-09-26T18:00:00.000+02:00
tags:
  - marketing analytics
  - utm
  - tracking
  - data analytics
draft: false
---
> **Short answer:** UTM parameters are query-string tags — `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` — appended to a URL so your analytics tool knows where a visit came from. They only work if everyone tags links the same way, so a consistent naming convention matters more than the tool used to add them.

Bad UTM tagging doesn't cause an error. It causes a report where "Facebook" and "facebook" show up as two separate rows, and nobody notices until someone tries to add the numbers together and they don't match what they expected.

## What does each parameter mean?

- **`utm_source`** — where the traffic came from: `newsletter`, `facebook`, `google`. Effectively required; without it, the traffic source is ambiguous to your analytics tool.
- **`utm_medium`** — the marketing channel: `email`, `cpc`, `social`, `referral`. Also effectively required — `utm_source=google` alone doesn't tell you whether that's organic search, a paid ad, or a referral link on a Google-owned property.
- **`utm_campaign`** — the specific campaign name: `spring_sale_2026`, `q3_webinar`. Required if you want to compare campaigns against each other, which is usually the whole point of tagging in the first place.
- **`utm_term`** — optional, historically used for paid search keywords.
- **`utm_content`** — optional, used to distinguish between two links pointing to the same place from the same campaign, such as two different ad creatives or two links in the same email.

## Why does case consistency matter so much?

Most analytics tools treat UTM values as exact text strings, not case-insensitively. `utm_source=Facebook`, `utm_source=facebook` and `utm_source=FACEBOOK` can appear as three separate rows in your reports, silently splitting what should be one channel's traffic into fragments. This is one of the most common causes of "our numbers don't add up" complaints in marketing reporting, and it's entirely preventable with one rule: lowercase everything, always.

The same applies to spaces — `utm_campaign=spring sale` becomes `spring%20sale` once URL-encoded, which is functional but inconsistent-looking across tools and easy to mistype. Using underscores (`spring_sale`) instead avoids the encoding entirely and stays readable in raw URLs and reports alike.

## What's a naming convention that actually holds up?

A simple, consistent pattern:

```
utm_source={platform, lowercase}
utm_medium={channel_type, lowercase}
utm_campaign={campaign_name_with_underscores}_{year_or_date}
```

Example: `?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch_2026`

Write the convention down once, share it with everyone who creates campaign links, and treat deviations as a bug to fix, not a style preference. A convention that exists only in one person's head stops working the moment someone else builds a link.

## What are the common mistakes?

1. **Missing `utm_medium`.** `utm_source` alone leaves the channel ambiguous — is this organic, paid, or referral traffic from that source? Always pair source and medium.
2. **Tagging a URL that already has UTM parameters, and overwriting them without realizing it.** If a link already carries UTM tags (for instance, forwarded from another campaign) and you add new ones, most tools will overwrite the existing values rather than merge them — check before tagging a link you didn't originate.
3. **Inconsistent casing across team members or tools.** Covered above — this is the single biggest cause of fragmented reporting.
4. **Using UTM tags on internal links.** A UTM-tagged link from your homepage to your own blog post will overwrite the visitor's original attribution data when they click it, making it look like they arrived from wherever that internal link's tag says, not from wherever they actually came from. Never UTM-tag a link within your own site.
5. **No campaign naming standard, so campaigns can't be compared over time.** If one person names a campaign `spring_sale` and another names a similar campaign next quarter `SpringSale2`, comparing performance across the two requires manual cleanup that a shared convention would have avoided entirely.

## What should I actually do?

1. Write down source, medium and campaign naming rules once, and share them with everyone who builds campaign links.
2. Always lowercase, always use underscores instead of spaces.
3. Never tag internal links.
4. Check any link you didn't build yourself for existing UTM parameters before adding new ones.

A [free UTM link builder](https://anthonysko.com/projects/utm-builder/) applies the lowercase-and-underscore convention automatically and flags existing UTM parameters on a URL before you overwrite them, so the convention gets followed by default rather than relying on everyone remembering it.
