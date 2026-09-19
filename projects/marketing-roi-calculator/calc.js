// Pure marketing-economics formulas for the Marketing ROI Calculator. No DOM access.

// Ad-spend efficiency. `margin` is a fraction (0.4 for 40 %).
export function adEfficiency({ spend, revenue, margin, customers }) {
  if (!(spend > 0)) throw new RangeError('spend must be greater than 0');
  if (!(margin > 0 && margin <= 1)) throw new RangeError('margin must be above 0 and at most 100 %');
  if (!(revenue >= 0)) throw new RangeError('revenue must be 0 or more');
  if (!(customers >= 1)) throw new RangeError('customers must be at least 1');
  const roas = revenue / spend;
  const breakEvenRoas = 1 / margin;
  return {
    roas,
    breakEvenRoas,
    grossProfit: revenue * margin,
    profit: revenue * margin - spend,
    cac: spend / customers,
    roasVsBreakEven: roas / breakEvenRoas,
  };
}

// Customer lifetime value on a gross-margin basis, with no discounting and constant retention.
// Lifespan is given in years, or derived from an annual churn rate (fraction) as 1 / churn.
export function customerValue({ aov, ordersPerYear, margin, lifespanYears, annualChurn, cac }) {
  if (!(aov > 0)) throw new RangeError('average order value must be greater than 0');
  if (!(ordersPerYear > 0)) throw new RangeError('orders per year must be greater than 0');
  if (!(margin > 0 && margin <= 1)) throw new RangeError('margin must be above 0 and at most 100 %');
  let years = lifespanYears;
  if (years === undefined) {
    if (!(annualChurn > 0 && annualChurn <= 1)) throw new RangeError('annual churn must be above 0 and at most 100 %');
    years = 1 / annualChurn;
  }
  if (!(years > 0)) throw new RangeError('lifespan must be greater than 0');
  const annualGrossProfit = aov * ordersPerYear * margin;
  const ltv = annualGrossProfit * years;
  return {
    lifespanYears: years,
    ltv,
    ltvToCac: cac > 0 ? ltv / cac : null,
    paybackMonths: cac > 0 ? cac / (annualGrossProfit / 12) : null,
  };
}

// Traffic-light rules of thumb (widely quoted, not guarantees).
export function roasLight(ratioToBreakEven) {
  if (ratioToBreakEven < 1) return 'bad';
  if (ratioToBreakEven < 1.25) return 'warn';
  return 'good';
}

export function ltvCacLight(ratio) {
  if (ratio < 1) return 'bad';
  if (ratio < 3) return 'warn';
  return 'good';
}

export function paybackLight(months) {
  if (months <= 12) return 'good';
  if (months <= 18) return 'warn';
  return 'bad';
}
