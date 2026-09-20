// Pure SaaS-metrics formulas for the SaaS Metrics & Runway Calculator. No DOM access.

// Revenue movements over one period. All MRR values are non-negative amounts in the same currency.
// `periodMonths` is 1 (month), 3 (quarter) or 12 (year); it only affects annualisation and burn.
export function saasMetrics({ startMrr, newMrr, expansionMrr, contractionMrr, churnedMrr, periodMonths = 1 }) {
  if (!(startMrr > 0)) throw new RangeError('starting MRR must be greater than 0');
  for (const [name, v] of [['new MRR', newMrr], ['expansion MRR', expansionMrr], ['contraction MRR', contractionMrr], ['churned MRR', churnedMrr]]) {
    if (!(v >= 0)) throw new RangeError(`${name} must be 0 or more`);
  }
  if (contractionMrr + churnedMrr > startMrr) throw new RangeError('churned plus contraction MRR cannot exceed starting MRR');
  if (!(periodMonths > 0)) throw new RangeError('period must be greater than 0 months');

  const endMrr = startMrr + newMrr + expansionMrr - contractionMrr - churnedMrr;
  const netNewMrr = endMrr - startMrr;
  const nrr = (startMrr + expansionMrr - contractionMrr - churnedMrr) / startMrr;
  const grr = (startMrr - contractionMrr - churnedMrr) / startMrr;
  const losses = contractionMrr + churnedMrr;
  const annualise = (rate) => Math.pow(rate, 12 / periodMonths);
  return {
    endMrr,
    arr: endMrr * 12,
    netNewMrr,
    growth: netNewMrr / startMrr,
    grossChurn: losses / startMrr,
    nrr,
    grr,
    nrrAnnualised: annualise(nrr),
    grrAnnualised: annualise(grr),
    quickRatio: losses > 0 ? (newMrr + expansionMrr) / losses : null,
  };
}

// Share of customers lost in the period.
export function logoChurn({ customersStart, customersLost }) {
  if (!(customersStart > 0)) throw new RangeError('customers at start must be greater than 0');
  if (!(customersLost >= 0)) throw new RangeError('customers lost must be 0 or more');
  if (customersLost > customersStart) throw new RangeError('customers lost cannot exceed customers at start');
  return customersLost / customersStart;
}

// Rule of 40: growth % plus profit margin %, both in percentage points (either may be negative).
export function ruleOf40({ growthPct, marginPct }) {
  if (!Number.isFinite(growthPct) || !Number.isFinite(marginPct)) throw new RangeError('growth and margin must be numbers');
  return growthPct + marginPct;
}

// Months of cash left at the current net burn. Null when the company is not burning cash.
export function runwayMonths({ cash, monthlyBurn }) {
  if (!(cash >= 0)) throw new RangeError('cash must be 0 or more');
  if (!(monthlyBurn >= 0)) throw new RangeError('burn must be 0 or more');
  return monthlyBurn > 0 ? cash / monthlyBurn : null;
}

// Net burn over the period divided by net new ARR (net new MRR x 12) of the same period.
// Null when there is no burn or no net new ARR to compare with.
export function burnMultiple({ monthlyBurn, periodMonths = 1, netNewMrr }) {
  if (!(monthlyBurn >= 0)) throw new RangeError('burn must be 0 or more');
  if (!(periodMonths > 0)) throw new RangeError('period must be greater than 0 months');
  if (!(monthlyBurn > 0) || !(netNewMrr > 0)) return null;
  return (monthlyBurn * periodMonths) / (netNewMrr * 12);
}

// Traffic-light rules of thumb (widely quoted, not guarantees).
export function nrrLight(annualisedNrr) {
  if (annualisedNrr >= 1) return 'good';
  if (annualisedNrr >= 0.9) return 'warn';
  return 'bad';
}

export function quickRatioLight(ratio) {
  if (ratio >= 4) return 'good';
  if (ratio >= 1) return 'warn';
  return 'bad';
}

export function ruleOf40Light(score) {
  if (score >= 40) return 'good';
  if (score >= 20) return 'warn';
  return 'bad';
}

export function burnMultipleLight(multiple) {
  if (multiple <= 1.5) return 'good';
  if (multiple <= 3) return 'warn';
  return 'bad';
}

export function runwayLight(months) {
  if (months >= 18) return 'good';
  if (months >= 12) return 'warn';
  return 'bad';
}
