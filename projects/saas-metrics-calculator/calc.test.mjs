// Run with: node calc.test.mjs
import assert from 'node:assert/strict';
import { saasMetrics, logoChurn, ruleOf40, runwayMonths, burnMultiple, nrrLight, quickRatioLight, ruleOf40Light, burnMultipleLight, runwayLight } from './calc.js';

const close = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-9, `${label}: got ${a}, expected ${b}`);

// Start 100,000; new 8,000; expansion 4,000; contraction 1,000; churned 2,000 (one month)
let m = saasMetrics({ startMrr: 100000, newMrr: 8000, expansionMrr: 4000, contractionMrr: 1000, churnedMrr: 2000 });
close(m.endMrr, 109000, 'ending MRR');
close(m.arr, 1308000, 'ARR');
close(m.netNewMrr, 9000, 'net new MRR');
close(m.growth, 0.09, 'growth');
close(m.grossChurn, 0.03, 'gross churn');
close(m.nrr, 1.01, 'NRR');
close(m.grr, 0.97, 'GRR');
close(m.nrrAnnualised, Math.pow(1.01, 12), 'NRR annualised (month)');
close(m.grrAnnualised, Math.pow(0.97, 12), 'GRR annualised (month)');
close(m.quickRatio, 4, 'quick ratio');

// The same movements over a quarter annualise with the power 4, and over a year not at all
close(saasMetrics({ startMrr: 100000, newMrr: 8000, expansionMrr: 4000, contractionMrr: 1000, churnedMrr: 2000, periodMonths: 3 }).nrrAnnualised, Math.pow(1.01, 4), 'NRR annualised (quarter)');
close(saasMetrics({ startMrr: 100000, newMrr: 8000, expansionMrr: 4000, contractionMrr: 1000, churnedMrr: 2000, periodMonths: 12 }).nrrAnnualised, 1.01, 'NRR annualised (year)');

// No losses: quick ratio is null, retention is exactly 100 % plus expansion
m = saasMetrics({ startMrr: 50000, newMrr: 5000, expansionMrr: 1000, contractionMrr: 0, churnedMrr: 0 });
assert.equal(m.quickRatio, null);
close(m.grr, 1, 'GRR without losses');
close(m.nrr, 1.02, 'NRR with expansion only');

// Shrinking business: everything churns
m = saasMetrics({ startMrr: 10000, newMrr: 0, expansionMrr: 0, contractionMrr: 2000, churnedMrr: 8000 });
close(m.endMrr, 0, 'everything churned');
close(m.grr, 0, 'GRR zero');
close(m.quickRatio, 0, 'quick ratio zero');

// Logo churn
close(logoChurn({ customersStart: 200, customersLost: 5 }), 0.025, 'logo churn');
close(logoChurn({ customersStart: 10, customersLost: 0 }), 0, 'no logos lost');

// Rule of 40, runway, burn multiple
close(ruleOf40({ growthPct: 35, marginPct: 10 }), 45, 'Rule of 40');
close(ruleOf40({ growthPct: 60, marginPct: -30 }), 30, 'Rule of 40 with negative margin');
close(runwayMonths({ cash: 900000, monthlyBurn: 150000 }), 6, 'runway');
assert.equal(runwayMonths({ cash: 900000, monthlyBurn: 0 }), null);
close(burnMultiple({ monthlyBurn: 150000, netNewMrr: 9000 }), 150000 / 108000, 'burn multiple (month)');
close(burnMultiple({ monthlyBurn: 150000, periodMonths: 3, netNewMrr: 27000 }), 450000 / 324000, 'burn multiple (quarter)');
assert.equal(burnMultiple({ monthlyBurn: 0, netNewMrr: 9000 }), null);
assert.equal(burnMultiple({ monthlyBurn: 1000, netNewMrr: 0 }), null);
assert.equal(burnMultiple({ monthlyBurn: 1000, netNewMrr: -5 }), null);

// Invalid inputs
const base = { startMrr: 100, newMrr: 0, expansionMrr: 0, contractionMrr: 0, churnedMrr: 0 };
assert.throws(() => saasMetrics({ ...base, startMrr: 0 }), RangeError);
assert.throws(() => saasMetrics({ ...base, newMrr: -1 }), RangeError);
assert.throws(() => saasMetrics({ ...base, churnedMrr: 60, contractionMrr: 50 }), RangeError);
assert.throws(() => saasMetrics({ ...base, periodMonths: 0 }), RangeError);
assert.throws(() => saasMetrics({ ...base, expansionMrr: NaN }), RangeError);
assert.throws(() => logoChurn({ customersStart: 0, customersLost: 0 }), RangeError);
assert.throws(() => logoChurn({ customersStart: 5, customersLost: 6 }), RangeError);
assert.throws(() => ruleOf40({ growthPct: NaN, marginPct: 1 }), RangeError);
assert.throws(() => runwayMonths({ cash: -1, monthlyBurn: 1 }), RangeError);
assert.throws(() => burnMultiple({ monthlyBurn: -1, netNewMrr: 1 }), RangeError);

// Traffic lights (boundaries)
assert.deepEqual([0.89, 0.9, 0.99, 1, 1.2].map(nrrLight), ['bad', 'warn', 'warn', 'good', 'good']);
assert.deepEqual([0.5, 1, 3.99, 4, 6].map(quickRatioLight), ['bad', 'warn', 'warn', 'good', 'good']);
assert.deepEqual([10, 20, 39.9, 40, 55].map(ruleOf40Light), ['bad', 'warn', 'warn', 'good', 'good']);
assert.deepEqual([0.5, 1.5, 1.6, 3, 3.1].map(burnMultipleLight), ['good', 'good', 'warn', 'warn', 'bad']);
assert.deepEqual([6, 11.9, 12, 17.9, 18].map(runwayLight), ['bad', 'bad', 'warn', 'warn', 'good']);

console.log('saas-metrics-calculator calc: all assertions passed');
