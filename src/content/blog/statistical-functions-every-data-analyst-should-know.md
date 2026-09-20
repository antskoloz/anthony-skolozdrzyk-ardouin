---
title: "Six statistical functions every data analyst should know"
description: "Z-score, percentiles, MAD, coefficient of variation, correlation and confidence intervals: what each does, where it breaks, and the SQL to run it yourself."
pubDate: 2026-09-20
tags: ["statistics", "data analytics", "sql", "outlier detection"]
draft: true
---

> **Short answer:** If you only learn six, learn the z-score, percentiles with the IQR, the median absolute deviation (MAD), the coefficient of variation, correlation and the confidence interval. Together they tell you what is unusual, how spread out things are, whether two metrics move together, and how much to trust an average. The catch is that the famous one, the z-score, is the easiest to fool.

I have spent a lot of years writing SQL for people who want to know whether a number is "weird". Almost every time, the answer comes from the same small toolbox. None of it is advanced. What separates a decent analysis from a misleading one is knowing when each tool stops working.

So here are six, with one tiny dataset threaded through the first three so you can see how they disagree. All numbers are invented.

## The example dataset

Ten days of daily revenue, in thousands. Nine ordinary days and one day where something clearly went wrong (or right):

`102, 98, 105, 99, 101, 97, 103, 100, 96, 299`

The mean is 120 and the sample standard deviation is about 63. Keep those two numbers in mind, because they are about to cause trouble.

## 1. Z-score: how far from normal is this value?

The z-score converts a value into "how many standard deviations away from the mean is it?"

```
z = (x − mean) / standard deviation
```

It is the first thing most analysts reach for, and for good reason. It puts different metrics on the same scale, so you can compare a revenue spike with a conversion-rate dip. A common rule of thumb flags anything beyond ±3, and some teams use ±2 for a looser net.

Now run it on the example. The 299 day gets a z-score of about **2.84**. That is under 3, so the rule of thumb says it is not an outlier. The reason is that the outlier itself inflated the mean and the standard deviation, which shrinks its own z-score. This is called masking, and it is the main weakness of the method: the statistics you use to detect outliers are themselves damaged by outliers.

The z-score works best when the data is roughly bell-shaped, the sample is reasonably large, and you already cleaned the worst extremes. It is much less reliable on small samples, skewed data (order values, session lengths) or anything with heavy tails.

```sql
SELECT
  order_day,
  revenue,
  (revenue - AVG(revenue) OVER ())
    / NULLIF(STDDEV_SAMP(revenue) OVER (), 0) AS z_score
FROM daily_revenue
ORDER BY z_score DESC;
```

Window functions keep every row, so you can filter on `ABS(z_score) > 3` in an outer query.

## 2. Percentiles and the IQR: no assumptions about shape

Percentiles say "x% of values fall below this". The 25th percentile (Q1) and the 75th (Q3) bound the middle half of your data, and the distance between them is the interquartile range (IQR). The classic Tukey rule flags values below `Q1 − 1.5 × IQR` or above `Q3 + 1.5 × IQR`.

On the example, Q1 is 98.25 and Q3 is 102.75, so the IQR is 4.5 and the upper fence is 109.5. The 299 day is flagged immediately, where the z-score missed it. Percentiles do not care about the shape of the distribution and are barely moved by a single extreme value.

Percentiles are also what you want for anything skewed. Reporting "median and 90th percentile delivery time" is far more honest than an average that a handful of slow cases drag upwards.

```sql
WITH q AS (
  SELECT
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY revenue) AS q1,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY revenue) AS q3
  FROM daily_revenue
)
SELECT d.*
FROM daily_revenue d
CROSS JOIN q
WHERE d.revenue < q.q1 - 1.5 * (q.q3 - q.q1)
   OR d.revenue > q.q3 + 1.5 * (q.q3 - q.q1);
```

`PERCENTILE_CONT` is PostgreSQL syntax. Snowflake, BigQuery and SQL Server have equivalents with slightly different spelling.

## 3. Median and MAD: the robust z-score

If you like the z-score idea but want it to survive outliers, swap the mean for the median and the standard deviation for the MAD, the median absolute deviation (the median of each value's distance from the median).

```
modified z = 0.6745 × (x − median) / MAD
```

The 0.6745 constant makes the result comparable to a regular z-score on normal data. A common cutoff is 3.5.

On the example, the median is 100.5 and the MAD is 2.5. The 299 day gets a modified z of about **53.6**. That is the same anomaly the ordinary z-score rated 2.84, which shows how much the choice of statistic matters. For anything you are going to automate as an alert, I would default to this one.

One caution: if more than half your values are identical, the MAD is zero and the formula breaks, so guard the division.

```sql
WITH m AS (
  SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY revenue) AS med
  FROM daily_revenue
),
dev AS (
  SELECT r.order_day, r.revenue, m.med,
         ABS(r.revenue - m.med) AS abs_dev
  FROM daily_revenue r
  CROSS JOIN m
),
mad AS (
  SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY abs_dev) AS mad
  FROM dev
)
SELECT dev.order_day, dev.revenue,
       0.6745 * (dev.revenue - dev.med) / NULLIF(mad.mad, 0) AS modified_z
FROM dev
CROSS JOIN mad
ORDER BY modified_z DESC;
```

The NIST report on statistical outlier detection (linked in the sources) is a good reference if you want the full picture of these methods and their trade-offs.

## 4. Coefficient of variation: is this spread big or small?

A standard deviation of 5 means nothing until you know the average. The coefficient of variation (CV) fixes that by dividing the standard deviation by the mean, giving a unit-free measure of relative variability.

```
CV = standard deviation / mean
```

This is handy when you compare things on different scales: is revenue more volatile for your small segment or your large one? Is the weekly order count steadier than the weekly refund count? A CV of 0.05 is very stable, 0.50 is jumpy.

Two limits. It only makes sense for values that are always positive, and it blows up when the mean is close to zero. And like the z-score, it uses the mean and standard deviation, so one outlier moves it a lot. On our example the CV is about 0.52, driven almost entirely by that one day. Without it, the CV is roughly 0.03.

```sql
SELECT
  segment,
  AVG(revenue)                                   AS mean_revenue,
  STDDEV_SAMP(revenue)                           AS sd_revenue,
  STDDEV_SAMP(revenue) / NULLIF(AVG(revenue), 0) AS cv
FROM daily_revenue_by_segment
GROUP BY segment
ORDER BY cv DESC;
```

## 5. Correlation: do two metrics move together?

Correlation gives a number between −1 and 1 describing how closely two variables move together. The Pearson coefficient measures linear association; Spearman works on ranks and captures any consistently rising or falling relationship, even a curved one.

The difference is easy to see with a small case. Take `a = 1..10` and `b = 2, 3, 5, 8, 13, 21, 34, 55, 89, 400`. The second series always rises when the first does, but it explodes at the end. Pearson comes out around **0.68**, dragged around by the last value. Spearman is exactly **1.0**, because the ordering never breaks.

So: use Pearson when the relationship should be roughly a straight line and there are no wild values, and Spearman when the data is skewed, has outliers, or you only care about the direction of the relationship. And always remember the old warning that correlation is not causation. A high correlation between marketing spend and revenue may just mean both go up in December.

```sql
-- Pearson
SELECT CORR(ad_spend, revenue) AS pearson_r
FROM weekly_metrics;

-- Spearman: Pearson on the ranks
WITH ranked AS (
  SELECT
    RANK() OVER (ORDER BY ad_spend) AS r_spend,
    RANK() OVER (ORDER BY revenue)  AS r_rev
  FROM weekly_metrics
)
SELECT CORR(r_spend, r_rev) AS spearman_rho
FROM ranked;
```

With many tied values, `RANK()` is not exactly the average-rank method that statistics packages use, so the result can differ slightly from what Python or R report.

## 6. Confidence interval: how much should you trust this average?

An average from a sample is an estimate. A confidence interval puts a range around it. For a mean, the recipe is:

```
mean ± t × (standard deviation / √n)
```

where `standard deviation / √n` is the standard error and `t` comes from the t-distribution (about 1.96 for a 95% interval when the sample is large, larger when it is small).

Take the same ten days but replace the odd 299 with 104. The mean is 100.5, the standard error is about 0.96 and, for 9 degrees of freedom, t is about 2.26. The 95% interval is roughly **98.3 to 102.7**. Read that as "given this data, the true average plausibly sits in that band", not as "95% of days fall in that band". Mixing the two up is one of the most common mistakes I see in dashboards.

The practical use is comparison. If two segments have averages of 100 and 103 but their intervals overlap heavily, you should not tell anyone one segment is better. It also forces the useful question of sample size, since intervals shrink as `n` grows.

```sql
SELECT
  AVG(revenue) AS mean_revenue,
  AVG(revenue) - 2.262 * STDDEV_SAMP(revenue) / SQRT(COUNT(*)) AS ci_low,
  AVG(revenue) + 2.262 * STDDEV_SAMP(revenue) / SQRT(COUNT(*)) AS ci_high
FROM daily_revenue
WHERE revenue < 200;  -- example only: excluding the outlier day
```

The 2.262 is the 95% t-value for 9 degrees of freedom. For other sample sizes, look up the right value or compute it in Python or R, and keep in mind that this method assumes the sample is reasonably close to normal or large enough for the averages to behave.

## How to choose between them

- **Looking for unusual values in clean, bell-shaped data:** z-score.
- **Looking for unusual values in messy or skewed data, or building an alert:** IQR or modified z-score (MAD).
- **Comparing variability across groups with different scales:** coefficient of variation.
- **Checking whether two metrics move together:** Pearson if linear and clean, Spearman otherwise.
- **Reporting an average to someone who will act on it:** add a confidence interval.

My habit is to run more than one on anything important. When the z-score and the MAD-based score agree, I relax. When they disagree, like they did on our ten days, that disagreement is usually the most interesting finding in the dataset.

If you are also tracking forecasts, the same discipline applies there: one number is never enough. I wrote about that in [Sales forecast accuracy: measure it, stop sandbagging](https://anthonysko.com/blog/sales-forecast-accuracy-wape-bias-sandbagging/).

## Frequently asked questions

**Is a z-score above 3 always an outlier?**
No. It is a rule of thumb that assumes roughly normal data. As the example shows, a real outlier can score below 3 because it inflates the standard deviation, and on skewed data plenty of legitimate values will exceed 3.

**Should I delete outliers?**
Not automatically. First find out why they happened. A data-entry error should be fixed, a one-off event can be flagged and analysed separately, and a genuine extreme value may be exactly what the business needs to know about.

**Population or sample standard deviation?**
If your data is a sample of a bigger group, which is the usual case, use the sample version (`STDDEV_SAMP`). The population version (`STDDEV_POP`) divides by `n` instead of `n − 1` and gives a slightly smaller number.

**Do I need Python or R for this?**
Not for any of the six. Everything above runs in SQL, and the same formulas work in Excel or Power BI. Python and R are more convenient for the t-values and for tests beyond these basics.

## Sources

- [NIST Internal Report 8526: Statistical detection of outliers](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957454)
- [Scribbr: Understanding confidence intervals](https://www.scribbr.com/statistics/confidence-interval/)
- [Wikipedia: Standard error](https://en.wikipedia.org/wiki/Standard_error)
- [The American Statistician: Myths about linear and monotonic associations, Pearson's r, Spearman's ρ and Kendall's τ](https://www.tandfonline.com/doi/full/10.1080/00031305.2021.2004922)
- [PostgreSQL documentation: Aggregate functions](https://www.postgresql.org/docs/current/functions-aggregate.html)

*Last reviewed: 20 September 2026.*
