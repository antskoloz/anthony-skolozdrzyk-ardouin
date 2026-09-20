// Pure valuation formulas for the Company Valuation Calculator (WACC, free cash flow, DCF, EPS).
// Educational worked-example tool: no DOM access, no real market data. Rates are decimals (0.04, not 4).

// Cost of equity via the Capital Asset Pricing Model (CAPM).
export function capmCostOfEquity({ riskFreeRate, beta, equityRiskPremium }) {
  for (const [name, v] of [['risk-free rate', riskFreeRate], ['beta', beta], ['equity risk premium', equityRiskPremium]]) {
    if (!Number.isFinite(v)) throw new RangeError(`${name} must be a number`);
  }
  return riskFreeRate + beta * equityRiskPremium;
}

// Weighted average cost of capital, using the market values of equity and debt as weights.
export function wacc({ costOfEquity, costOfDebtPreTax, taxRate, marketValueEquity, marketValueDebt }) {
  for (const [name, v] of [['cost of equity', costOfEquity], ['cost of debt', costOfDebtPreTax]]) {
    if (!Number.isFinite(v)) throw new RangeError(`${name} must be a number`);
  }
  if (!(taxRate >= 0 && taxRate < 1)) throw new RangeError('tax rate must be between 0% and 100%');
  if (!(marketValueEquity >= 0) || !(marketValueDebt >= 0)) throw new RangeError('market value of equity and market value of debt must be 0 or more');
  const total = marketValueEquity + marketValueDebt;
  if (!(total > 0)) throw new RangeError('market value of equity and debt cannot both be 0');
  const equityWeight = marketValueEquity / total;
  const debtWeight = marketValueDebt / total;
  return equityWeight * costOfEquity + debtWeight * costOfDebtPreTax * (1 - taxRate);
}

// Free cash flow to the firm (FCFF) for one period, built up from operating profit (EBIT).
export function freeCashFlow({ ebit, taxRate, depreciationAmortization, capex, changeInNWC }) {
  if (!Number.isFinite(ebit)) throw new RangeError('operating profit (EBIT) must be a number');
  if (!(taxRate >= 0 && taxRate < 1)) throw new RangeError('tax rate must be between 0% and 100%');
  if (!(depreciationAmortization >= 0)) throw new RangeError('depreciation & amortisation must be 0 or more');
  if (!(capex >= 0)) throw new RangeError('capital expenditure must be 0 or more');
  if (!Number.isFinite(changeInNWC)) throw new RangeError('change in working capital must be a number');
  return ebit * (1 - taxRate) + depreciationAmortization - capex - changeInNWC;
}

// Projects a base free cash flow forward at a single constant growth rate.
export function projectFreeCashFlows({ baseFcf, growthRate, years }) {
  if (!Number.isFinite(baseFcf)) throw new RangeError('base free cash flow must be a number');
  if (!Number.isFinite(growthRate)) throw new RangeError('growth rate must be a number');
  if (!Number.isInteger(years) || years < 1) throw new RangeError('projection years must be a whole number of 1 or more');
  const flows = [];
  for (let t = 1; t <= years; t++) flows.push(baseFcf * Math.pow(1 + growthRate, t));
  return flows;
}

// Discounted cash flow: present value of the projected years plus a Gordon-growth terminal value
// for everything after the projection. `discountRate` is normally the WACC.
export function discountedCashFlowValue({ projectedFcfs, discountRate, terminalGrowth }) {
  if (!Array.isArray(projectedFcfs) || projectedFcfs.length === 0) throw new RangeError('at least one projected cash flow is required');
  if (!Number.isFinite(discountRate) || !(discountRate > 0)) throw new RangeError('discount rate (WACC) must be greater than 0');
  if (!Number.isFinite(terminalGrowth)) throw new RangeError('long-term growth rate must be a number');
  if (!(terminalGrowth < discountRate)) throw new RangeError('long-term growth rate must be lower than the discount rate (WACC), otherwise the maths never settles on a value');
  const years = projectedFcfs.length;
  let presentValueOfProjection = 0;
  projectedFcfs.forEach((fcf, i) => { presentValueOfProjection += fcf / Math.pow(1 + discountRate, i + 1); });
  const terminalValue = (projectedFcfs[years - 1] * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
  const presentValueOfTerminal = terminalValue / Math.pow(1 + discountRate, years);
  return { presentValueOfProjection, terminalValue, presentValueOfTerminal, enterpriseValue: presentValueOfProjection + presentValueOfTerminal };
}

// Bridges enterprise value (the value of the whole business) to equity value (what's left for shareholders).
export function equityValueFromEnterprise({ enterpriseValue, totalDebt, cash }) {
  if (!Number.isFinite(enterpriseValue)) throw new RangeError('enterprise value must be a number');
  if (!(totalDebt >= 0)) throw new RangeError('total debt must be 0 or more');
  if (!(cash >= 0)) throw new RangeError('cash & equivalents must be 0 or more');
  return enterpriseValue - totalDebt + cash;
}

// Divides a total value by shares outstanding to get a per-share figure.
export function perShareValue({ totalValue, sharesOutstanding }) {
  if (!Number.isFinite(totalValue)) throw new RangeError('value must be a number');
  if (!(sharesOutstanding > 0)) throw new RangeError('shares outstanding must be greater than 0');
  return totalValue / sharesOutstanding;
}

// Basic earnings per share.
export function basicEps({ netIncome, preferredDividends, sharesOutstanding }) {
  if (!Number.isFinite(netIncome)) throw new RangeError('net income must be a number');
  if (!(preferredDividends >= 0)) throw new RangeError('preferred dividends must be 0 or more');
  if (!(sharesOutstanding > 0)) throw new RangeError('shares outstanding must be greater than 0');
  return (netIncome - preferredDividends) / sharesOutstanding;
}

// Diluted earnings per share: adds the extra shares that options/convertibles could create.
// Simplified (no treasury-stock-method offset) — a teaching approximation, stated as such on the page.
export function dilutedEps({ netIncome, preferredDividends, sharesOutstanding, additionalDilutedShares }) {
  if (!(additionalDilutedShares >= 0)) throw new RangeError('additional diluted shares must be 0 or more');
  return basicEps({ netIncome, preferredDividends, sharesOutstanding: sharesOutstanding + additionalDilutedShares });
}

// Price-to-earnings ratio. Null when EPS is 0 or negative, where P/E is not a meaningful number.
export function priceToEarnings({ price, eps }) {
  if (!(price > 0)) throw new RangeError('share price must be greater than 0');
  if (!Number.isFinite(eps)) throw new RangeError('EPS must be a number');
  return eps > 0 ? price / eps : null;
}
