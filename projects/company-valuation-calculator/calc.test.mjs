// Run with: node calc.test.mjs
import assert from 'node:assert/strict';
import {
  capmCostOfEquity, wacc, freeCashFlow, projectFreeCashFlows, discountedCashFlowValue,
  equityValueFromEnterprise, perShareValue, basicEps, dilutedEps, priceToEarnings,
} from './calc.js';

const close = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-6, `${label}: got ${a}, expected ${b}`);

// CAPM: 4% risk-free + 1.2 beta x 5% equity risk premium = 10%
close(capmCostOfEquity({ riskFreeRate: 0.04, beta: 1.2, equityRiskPremium: 0.05 }), 0.10, 'cost of equity');
close(capmCostOfEquity({ riskFreeRate: 0.03, beta: 0, equityRiskPremium: 0.05 }), 0.03, 'beta 0 collapses to risk-free rate');

// WACC: 80% equity at 10%, 20% debt at 6% pre-tax, 25% tax => 0.8x0.10 + 0.2x0.06x0.75 = 0.089
close(wacc({ costOfEquity: 0.10, costOfDebtPreTax: 0.06, taxRate: 0.25, marketValueEquity: 800, marketValueDebt: 200 }), 0.089, 'WACC');
// All-equity firm: WACC equals cost of equity regardless of cost of debt
close(wacc({ costOfEquity: 0.11, costOfDebtPreTax: 0.5, taxRate: 0.25, marketValueEquity: 500, marketValueDebt: 0 }), 0.11, 'all-equity WACC');

// Free cash flow: 150 EBIT x 75% (25% tax) + 40 D&A - 45 CapEx - 5 NWC increase = 102.5
close(freeCashFlow({ ebit: 150, taxRate: 0.25, depreciationAmortization: 40, capex: 45, changeInNWC: 5 }), 102.5, 'FCFF');
// A loss-making company (negative EBIT) still produces a (lower) FCF number
close(freeCashFlow({ ebit: -20, taxRate: 0.25, depreciationAmortization: 40, capex: 10, changeInNWC: 0 }), -20 * 0.75 + 40 - 10, 'FCFF with negative EBIT');

// Projection at 6% for 3 years from a base of 100
const flows = projectFreeCashFlows({ baseFcf: 100, growthRate: 0.06, years: 3 });
close(flows[0], 106, 'year 1');
close(flows[1], 112.36, 'year 2');
close(flows[2], 119.1016, 'year 3');
// Flat (0%) growth just repeats the base value
assert.deepEqual(projectFreeCashFlows({ baseFcf: 50, growthRate: 0, years: 2 }), [50, 50]);

// DCF with flat 100/yr for 3 years, 10% discount rate, 2% terminal growth — computed the same way as the implementation
{
  const projected = [100, 100, 100];
  let pvProjection = 0;
  for (let t = 1; t <= 3; t++) pvProjection += 100 / Math.pow(1.1, t);
  const terminalValue = (100 * 1.02) / (0.10 - 0.02);
  const pvTerminal = terminalValue / Math.pow(1.1, 3);
  const dcf = discountedCashFlowValue({ projectedFcfs: projected, discountRate: 0.10, terminalGrowth: 0.02 });
  close(dcf.presentValueOfProjection, pvProjection, 'PV of projection');
  close(dcf.terminalValue, terminalValue, 'terminal value');
  close(dcf.presentValueOfTerminal, pvTerminal, 'PV of terminal value');
  close(dcf.enterpriseValue, pvProjection + pvTerminal, 'enterprise value');
}
assert.throws(() => discountedCashFlowValue({ projectedFcfs: [100], discountRate: 0.05, terminalGrowth: 0.05 }), RangeError, 'terminal growth equal to discount rate must throw');
assert.throws(() => discountedCashFlowValue({ projectedFcfs: [100], discountRate: 0.05, terminalGrowth: 0.06 }), RangeError, 'terminal growth above discount rate must throw');

// Enterprise value to equity value bridge, and per-share value
close(equityValueFromEnterprise({ enterpriseValue: 1000, totalDebt: 200, cash: 50 }), 850, 'equity value');
close(equityValueFromEnterprise({ enterpriseValue: 1000, totalDebt: 0, cash: 0 }), 1000, 'equity value, no debt or cash');
close(perShareValue({ totalValue: 850, sharesOutstanding: 100 }), 8.5, 'per-share value');

// EPS
close(basicEps({ netIncome: 90, preferredDividends: 0, sharesOutstanding: 100 }), 0.9, 'basic EPS');
close(basicEps({ netIncome: 90, preferredDividends: 10, sharesOutstanding: 100 }), 0.8, 'basic EPS after preferred dividends');
close(dilutedEps({ netIncome: 90, preferredDividends: 0, sharesOutstanding: 100, additionalDilutedShares: 10 }), 90 / 110, 'diluted EPS');
close(dilutedEps({ netIncome: 90, preferredDividends: 0, sharesOutstanding: 100, additionalDilutedShares: 0 }), 0.9, 'diluted EPS with no dilution equals basic EPS');

// P/E
close(priceToEarnings({ price: 9, eps: 0.9 }), 10, 'P/E');
assert.equal(priceToEarnings({ price: 9, eps: 0 }), null, 'P/E is null at zero EPS');
assert.equal(priceToEarnings({ price: 9, eps: -0.5 }), null, 'P/E is null for a loss (negative EPS)');

// Invalid inputs
assert.throws(() => wacc({ costOfEquity: 0.1, costOfDebtPreTax: 0.06, taxRate: 1, marketValueEquity: 1, marketValueDebt: 0 }), RangeError, 'tax rate of 100% must throw');
assert.throws(() => wacc({ costOfEquity: 0.1, costOfDebtPreTax: 0.06, taxRate: 0.25, marketValueEquity: 0, marketValueDebt: 0 }), RangeError, 'zero equity and debt must throw');
assert.throws(() => freeCashFlow({ ebit: 100, taxRate: 0.25, depreciationAmortization: -1, capex: 0, changeInNWC: 0 }), RangeError, 'negative D&A must throw');
assert.throws(() => projectFreeCashFlows({ baseFcf: 100, growthRate: 0.05, years: 0 }), RangeError, 'zero years must throw');
assert.throws(() => equityValueFromEnterprise({ enterpriseValue: 100, totalDebt: -1, cash: 0 }), RangeError, 'negative debt must throw');
assert.throws(() => perShareValue({ totalValue: 100, sharesOutstanding: 0 }), RangeError, 'zero shares must throw');
assert.throws(() => basicEps({ netIncome: 10, preferredDividends: 0, sharesOutstanding: 0 }), RangeError, 'zero shares must throw for EPS');
assert.throws(() => priceToEarnings({ price: 0, eps: 1 }), RangeError, 'zero price must throw');

console.log('company-valuation-calculator calc: all assertions passed');
