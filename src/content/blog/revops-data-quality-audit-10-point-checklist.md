---
title: "The RevOps Data Quality Audit: A 10-Point Checklist"
description: "Bad CRM data quietly breaks forecasts and reports. Use this 10-point revenue data audit with ready-to-run SQL checks to find and fix the biggest gaps."
pubDate: 2026-10-24
tags: ["revops", "data quality", "crm", "sql", "revenue operations"]
draft: true
---

> **Short answer:** Start with a quick manual test: pull 100 recent records, mark the ones with an obvious error, and count the clean ones. A Harvard Business Review study using this method found that on average 47% of newly created records had at least one critical error. Then work through ten checks, from missing owners to orphaned records, with SQL where it helps.

Every RevOps report rests on the same thing: records that are complete, unique and current. When they are not, forecasts drift and teams argue about whose numbers are right. This checklist gives you a practical way to find the biggest problems in an afternoon.

## Why does data quality matter?

Two published figures set the scene:

- **Cost.** Gartner research from 2020 puts the average cost of poor data quality to organizations at at least $12.9 million a year. That is an all-industry average, so read it as a signal of scale, not a prediction for your company. *Source: [Gartner: Data quality](https://www.gartner.com/en/data-analytics/topics/data-quality).*
- **Prevalence.** In a study by Nagle, Redman and Sammon, 75 executives each reviewed 100 recently created data records from their own departments and marked obvious errors. On average, 47% of newly created records had at least one critical error, and only 3% of the data quality scores could be rated acceptable using the loosest possible standard. *Source: [Harvard Business Review, "Only 3% of Companies' Data Meets Basic Quality Standards," 2017](https://hbr.org/2017/09/only-3-of-companies-data-meets-basic-quality-standards).*

The study sample was 75 executives, so it is a striking illustration rather than a census. It is also a useful method, and it is the first item on the checklist.

## The 10-point checklist

### 1. Run the 100-record test

Take 100 recently created records, for example opportunities from the last month. For each, mark whether it has an obvious error. The share with none is your starting score. This is the exercise the HBR authors recommend, and it costs one hour.

### 2. Check required-field completeness

List the fields your reports depend on: owner, amount, close date, stage, source. Measure how many records have valid values.

```sql
SELECT
  COUNT(*) AS total_opps,
  100.0 * SUM(CASE WHEN owner_id IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*) AS pct_with_owner,
  100.0 * SUM(CASE WHEN amount IS NOT NULL AND amount > 0 THEN 1 ELSE 0 END) / COUNT(*) AS pct_valid_amount,
  100.0 * SUM(CASE WHEN source IS NOT NULL AND source NOT IN ('Other', 'Unknown') THEN 1 ELSE 0 END) / COUNT(*) AS pct_known_source
FROM opportunities;
```

### 3. Find duplicates

Duplicate contacts and accounts split history and inflate counts. A simple starting point is to group by a normalized key such as email.

```sql
SELECT LOWER(email) AS email_key, COUNT(*) AS records
FROM contacts
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;
```

### 4. Hunt for stale open opportunities

Open opportunities whose close date is in the past distort pipeline and coverage.

```sql
SELECT id, close_date
FROM opportunities
WHERE is_closed = FALSE
  AND close_date < CURRENT_DATE;
```

### 5. Check stage and date logic

Closed deals should have a close date and a sensible amount. Look for closed-won records with no close date or a zero amount.

```sql
SELECT id
FROM opportunities
WHERE is_closed = TRUE
  AND close_date IS NULL;
```

### 6. Verify ownership

Records with no owner, or an owner who has left, fall out of reports and follow-up. Compare owner IDs against your active user list.

### 7. Check consistency across systems

Compare a customer's status in the CRM, the billing system and the marketing platform. Agree which system is the source of truth for each field, and flag mismatches.

### 8. Review source and channel fields

If "Other" or "Unknown" is a large share of lead sources, marketing reports cannot tell you what works. Track the share over time.

### 9. Validate amounts and currencies

Look for negative amounts, extreme outliers, and records with a missing or mismatched currency. Convert to a common currency before totaling.

### 10. Test cross-system matching

Measure how many records in one system have a matching ID in another. Orphaned records, such as invoices with no customer, are a sign that joins in your reports may silently drop data.

## How do I score the results?

Track a simple scorecard and repeat it each quarter. The targets below are mine. Set your own, based on how much error your reports can tolerate.

| Check | Metric | Example target |
| --- | --- | --- |
| 1 | Share of sampled records with no obvious error | Improve every quarter |
| 2 | Required-field completeness | Above 95% for fields used in forecasts |
| 3 | Duplicate rate | Falling trend |
| 4 | Stale open opportunities | Zero older than one quarter |
| 5 | Closed deals missing date or amount | Zero |
| 6 | Records without an active owner | Zero |
| 7 | Cross-system mismatches | Falling trend |
| 8 | Unknown lead source | Falling trend |
| 9 | Invalid amounts or currencies | Zero |
| 10 | Cross-system match rate | Rising trend |

## How do I keep quality from slipping back?

- **Fix it at entry.** Make critical fields required in the form or workflow, so bad records never get created.
- **Give each field an owner.** Someone should be accountable for each important field's accuracy.
- **Automate the checks.** Schedule the queries above and alert when a metric crosses your threshold.
- **Review the rules with sales and marketing.** People fill in what they understand. Short, agreed definitions beat long policies.

For where clean data pays off, see [Cohort-Based Revenue Forecasting for E-commerce](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/cohort-based-revenue-forecasting-for-ecommerce/) and [RevOps Benchmarks 2026](https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/blog/revops-benchmarks-2026-what-gartner-says/).

## Frequently asked questions

**How long does a first audit take?**
The 100-record test takes about an hour. Running the SQL checks depends on how quickly you can access your data, but most teams can review the results in an afternoon.

**Which check matters most?**
Start with the fields your forecast uses. A missing close date or amount on open opportunities hits the forecast directly.

**Do the SQL examples work in my database?**
I ran the four queries above on a small test table in SQLite. Boolean and date functions vary slightly by database, so adapt them if needed.

**Should I clean everything at once?**
No. Fix the highest-impact errors first, then prevent them at entry, and automate the checks.

## Sources

- [Harvard Business Review: Only 3% of Companies' Data Meets Basic Quality Standards (2017)](https://hbr.org/2017/09/only-3-of-companies-data-meets-basic-quality-standards)
- [Gartner: Data quality](https://www.gartner.com/en/data-analytics/topics/data-quality)

*Last reviewed: 19 September 2026.*
