// Run with: node calc.test.mjs
import assert from 'node:assert/strict';
import { adEfficiency, customerValue, roasLight, ltvCacLight, paybackLight } from './calc.js';

const close = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-9, `${label}: got ${a}, expected ${b}`);

// €10,000 spend → €40,000 revenue, 40 % margin, 200 customers
let r = adEfficiency({ spend: 10000, revenue: 40000, margin: 0.4, customers: 200 });
close(r.roas, 4, 'ROAS');
close(r.breakEvenRoas, 2.5, 'break-even ROAS');
close(r.grossProfit, 16000, 'gross profit');
close(r.profit, 6000, 'profit on ad spend');
close(r.cac, 50, 'CAC');
close(r.roasVsBreakEven, 1.6, 'ROAS / break-even');
// At exactly the break-even ROAS, profit on ad spend is zero
r = adEfficiency({ spend: 1000, revenue: 2500, margin: 0.4, customers: 10 });
close(r.roas, r.breakEvenRoas, 'ROAS equals break-even');
close(r.profit, 0, 'zero profit at break-even');
// 100 % margin → break-even ROAS of 1
close(adEfficiency({ spend: 1, revenue: 1, margin: 1, customers: 1 }).breakEvenRoas, 1, 'margin 100 %');
// Zero revenue is valid (ROAS 0, loss equals spend)
r = adEfficiency({ spend: 500, revenue: 0, margin: 0.5, customers: 1 });
close(r.roas, 0, 'zero revenue ROAS');
close(r.profit, -500, 'zero revenue loss');

// AOV €80, 2 orders/year, 40 % margin, 3 years → annual GP 64, LTV 192; CAC 50 → LTV:CAC 3.84, payback 50 / (64/12) = 9.375 months
let v = customerValue({ aov: 80, ordersPerYear: 2, margin: 0.4, lifespanYears: 3, cac: 50 });
close(v.ltv, 192, 'LTV');
close(v.ltvToCac, 3.84, 'LTV:CAC');
close(v.paybackMonths, 9.375, 'payback months');
// Churn 25 % → lifespan 4 years
v = customerValue({ aov: 80, ordersPerYear: 2, margin: 0.4, annualChurn: 0.25, cac: 50 });
close(v.lifespanYears, 4, 'lifespan from churn');
close(v.ltv, 256, 'LTV from churn');
// Churn 100 % → lifespan 1 year
close(customerValue({ aov: 10, ordersPerYear: 1, margin: 1, annualChurn: 1, cac: 5 }).lifespanYears, 1, 'churn 100 %');
// No CAC → no ratios
v = customerValue({ aov: 80, ordersPerYear: 2, margin: 0.4, lifespanYears: 3, cac: 0 });
assert.equal(v.ltvToCac, null);
assert.equal(v.paybackMonths, null);

// Invalid inputs
assert.throws(() => adEfficiency({ spend: 0, revenue: 1, margin: 0.4, customers: 1 }), RangeError);
assert.throws(() => adEfficiency({ spend: 1, revenue: -1, margin: 0.4, customers: 1 }), RangeError);
assert.throws(() => adEfficiency({ spend: 1, revenue: 1, margin: 0, customers: 1 }), RangeError);
assert.throws(() => adEfficiency({ spend: 1, revenue: 1, margin: 1.2, customers: 1 }), RangeError);
assert.throws(() => adEfficiency({ spend: 1, revenue: 1, margin: 0.4, customers: 0 }), RangeError);
assert.throws(() => customerValue({ aov: 0, ordersPerYear: 1, margin: 0.4, lifespanYears: 1, cac: 1 }), RangeError);
assert.throws(() => customerValue({ aov: 1, ordersPerYear: 1, margin: 0.4, annualChurn: 0, cac: 1 }), RangeError);
assert.throws(() => customerValue({ aov: 1, ordersPerYear: 1, margin: 0.4, annualChurn: 1.5, cac: 1 }), RangeError);

// Traffic lights (boundaries)
assert.deepEqual([0.99, 1, 1.24, 1.25, 2].map(roasLight), ['bad', 'warn', 'warn', 'good', 'good']);
assert.deepEqual([0.5, 1, 2.99, 3, 5].map(ltvCacLight), ['bad', 'warn', 'warn', 'good', 'good']);
assert.deepEqual([6, 12, 12.1, 18, 19].map(paybackLight), ['good', 'good', 'warn', 'warn', 'bad']);

console.log('marketing-roi-calculator calc: all assertions passed');
