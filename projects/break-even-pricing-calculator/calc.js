// Pure break-even, margin/markup and discount formulas for the Break-even & Pricing Calculator. No DOM access.
// Percentages are fractions here (0.2 for 20 %).

export const markupFromMargin = (margin) => margin / (1 - margin);
export const marginFromMarkup = (markup) => markup / (1 + markup);

// Price, profit, margin (share of the price) and markup (share of the cost) from the cost and ONE known value:
// `price`, `margin` (0 or more, below 1) or `markup` (0 or more). A price below cost is allowed and shows a loss.
export function priceFromCost({ cost, price, margin, markup }) {
  if (!(cost > 0)) throw new RangeError('cost must be greater than 0');
  let p;
  if (price !== undefined) {
    if (!(price > 0)) throw new RangeError('price must be greater than 0');
    p = price;
  } else if (margin !== undefined) {
    if (!(margin >= 0 && margin < 1)) throw new RangeError('margin must be 0 % or more and below 100 %');
    p = cost / (1 - margin);
  } else if (markup !== undefined) {
    if (!(markup >= 0)) throw new RangeError('markup must be 0 % or more');
    p = cost * (1 + markup);
  } else {
    throw new RangeError('give a price, a margin or a markup');
  }
  const profit = p - cost;
  return { price: p, profit, margin: profit / p, markup: profit / cost };
}

// Break-even point. Fixed costs and target profit are per period; price and variable cost are per unit.
// `units` (units sold or expected in the period) is optional and adds profit and margin of safety.
export function breakEven({ fixedCosts, price, variableCost, targetProfit = 0, units }) {
  if (!(fixedCosts >= 0)) throw new RangeError('fixed costs must be 0 or more');
  if (!(price > 0)) throw new RangeError('price must be greater than 0');
  if (!(variableCost >= 0)) throw new RangeError('variable cost must be 0 or more');
  if (!(targetProfit >= 0)) throw new RangeError('target profit must be 0 or more');
  if (units !== undefined && !(units >= 0)) throw new RangeError('units must be 0 or more');

  const contribution = price - variableCost;
  const out = { contribution, contributionMargin: contribution / price };
  if (!(contribution > 0)) {
    return { ...out, breakEvenUnits: null, breakEvenSales: null, targetUnits: null, targetSales: null, profitAtUnits: null, marginOfSafety: null };
  }
  const exact = fixedCosts / contribution;
  const breakEvenUnits = Math.max(0, Math.ceil(exact - 1e-9));
  const targetUnits = Math.max(0, Math.ceil((fixedCosts + targetProfit) / contribution - 1e-9));
  return {
    ...out,
    breakEvenUnits,
    breakEvenSales: breakEvenUnits * price,
    targetUnits,
    targetSales: targetUnits * price,
    profitAtUnits: units === undefined ? null : units * contribution - fixedCosts,
    marginOfSafety: units === undefined || !(units > 0) ? null : (units - exact) / units,
  };
}

// What a discount costs: the extra volume needed to earn the same total profit as before.
// = discount / (margin - discount), where margin = (price - cost) / price. Null when it can never be made up.
export function discountImpact({ price, cost, discount, units }) {
  if (!(price > 0)) throw new RangeError('price must be greater than 0');
  if (!(cost >= 0)) throw new RangeError('cost must be 0 or more');
  if (!(price > cost)) throw new RangeError('price must be above cost');
  if (!(discount >= 0 && discount < 1)) throw new RangeError('discount must be 0 % or more and below 100 %');
  if (units !== undefined && !(units >= 0)) throw new RangeError('units must be 0 or more');

  const newPrice = price * (1 - discount);
  const profitBefore = price - cost;
  const profitAfter = newPrice - cost;
  const extraVolume = profitAfter > 0 ? profitBefore / profitAfter - 1 : null;
  return {
    newPrice,
    profitBefore,
    profitAfter,
    margin: profitBefore / price,
    extraVolume,
    unitsNeeded: units === undefined || extraVolume === null ? null : Math.ceil(units * (1 + extraVolume) - 1e-9),
  };
}

// Rules of thumb (not guarantees).
export function safetyLight(marginOfSafety) {
  if (marginOfSafety >= 0.3) return 'good';
  if (marginOfSafety >= 0.1) return 'warn';
  return 'bad';
}

export function discountLight(extraVolume) {
  if (extraVolume === null) return 'bad';
  return extraVolume >= 0.5 ? 'warn' : 'good';
}
