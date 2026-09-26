---
title: "Power BI Row-Level Security: A Practical Setup"
description: Set up Power BI row-level security step by step, static and
  dynamic, plus the pitfalls that let data leak past a security role.
pubDate: 2026-09-26T11:30:00.000+02:00
tags:
  - power bi
  - row level security
  - data analytics
  - security
draft: false
---
> **Short answer:** Row-level security (RLS) filters what data each user sees by applying a DAX filter expression to a "role," then mapping users or groups to that role in the Power BI service. Static RLS hardcodes a value per role (fine for a handful of regions); dynamic RLS looks up the signed-in user with `USERPRINCIPALNAME()` against a table, so one role covers everyone.

RLS is one of those Power BI features that looks simple in the tutorial and gets complicated the moment your model has more than one fact table, a bidirectional relationship, or a manager who needs to see their whole team's data instead of just their own row.

## What's the difference between static and dynamic RLS?

**Static RLS** defines a role with a fixed filter, written once per role:

```dax
[Region] = "EMEA"
```

You create one role per region, assign the right users to each role in the Power BI service, and you're done. It works well for a small, stable list of segments.

**Dynamic RLS** looks up who's logged in and filters based on a table that maps users to what they're allowed to see:

```dax
[Region] = LOOKUPVALUE(
    UserRegionMapping[Region],
    UserRegionMapping[Email],
    USERPRINCIPALNAME()
)
```

One role, one filter expression, and the actual restriction comes from a table you maintain (`UserRegionMapping`), not from creating a new role every time someone joins. This scales far better once you're past a handful of segments.

## How do I set up static RLS, step by step?

1. In Power BI Desktop, go to **Modeling → Manage roles**.
2. Create a role, e.g. `EMEA Sales`.
3. Pick the table to filter (usually a dimension table like `Region` or `Customer`, not the fact table directly — filters on a dimension propagate to the fact table through the relationship).
4. Write the DAX filter expression, e.g. `[Region] = "EMEA"`.
5. Use **Modeling → View as** to test the role before publishing. This is the step people skip, and it's the one that catches a filter that doesn't actually restrict what you expect.
6. Publish the report to the Power BI service.
7. In the service, open the dataset's **Security** settings and assign users or Azure AD groups to the role.

## How do I set up dynamic RLS?

1. Build a mapping table (`UserRegionMapping`) with at least an email/UPN column and the value to filter by.
2. Load it into the model and relate it to the table you want to filter, or reference it directly in the filter expression with `LOOKUPVALUE` if a direct relationship doesn't fit your model shape.
3. Create a single role, with a filter like the `LOOKUPVALUE` example above.
4. Test with **View as** using a specific user's email, not just the role in general — dynamic RLS behaves differently per user, so testing the role alone doesn't prove the mapping table is correct.
5. Assign every relevant user to this one role in the service. The table, not the role list, controls who sees what from here on, so maintaining that table becomes part of your ongoing data governance, not a one-time setup task.

## What if a manager needs to see their whole team, not just their own row?

This is where dynamic RLS gets more interesting than the tutorials show. Instead of matching on an exact value, build the mapping table with a manager hierarchy and use `PATH` functions or a filter that returns multiple allowed values (e.g. every region a manager's team covers), rather than a single lookup value. The mechanics are the same `USERPRINCIPALNAME()` pattern, just with a filter expression that can return a set instead of one value.

## What are the common pitfalls?

1. **Filtering the fact table directly instead of a dimension.** It usually still works, but filtering through a well-designed star schema's dimension tables is more maintainable and performs better, because the filter propagates along relationships the model was already designed around. See [Power BI star schema for beginners](/blog/power-bi-star-schema-for-beginners/) if your model isn't shaped that way yet.
2. **Bidirectional relationships changing what RLS actually restricts.** A filter that looks correct on one table can leak through an unexpected bidirectional path to a table you didn't intend to restrict. Check relationship directions whenever RLS results look wrong.
3. **RLS doesn't protect data accessed outside the visual layer.** Anyone with build permission on the dataset can potentially query it directly through Analyze in Excel or the XMLA endpoint, and depending on permissions, RLS may not apply the way you expect. If this matters for your data, review workspace and dataset permissions alongside RLS, not instead of it.
4. **Complex RLS filters slow down every visual.** A `LOOKUPVALUE` or nested filter runs for every query the affected user makes. On a large model, test performance with RLS active, not just correctness — a role that works can still make the report noticeably slower.
5. **Forgetting to test as a specific user.** Testing "as the role" checks the filter logic in isolation. Testing "as a user" (in dynamic RLS) checks that the mapping table actually resolves to the right value for that person. Both matter, and they can pass or fail independently.
6. **Assuming RLS is set-and-forget.** When a new region, product line or team is added, the mapping table (dynamic) or the roles list (static) needs updating. Build that into your data refresh or governance process, not just your memory.

My take: start static if you have five or fewer segments and they rarely change. Move to dynamic the moment you're creating a new role more than once a quarter, because the maintenance cost of one role plus a well-kept mapping table is lower than the cost of a growing list of near-identical roles.

Once RLS is in place, the next thing worth checking is whether it's slowing your reports down — see [Slow Power BI report? 7 fixes in order of payoff](/blog/slow-power-bi-report-7-fixes-in-order-of-payoff/).
