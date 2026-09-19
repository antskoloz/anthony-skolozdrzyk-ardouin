// Run with: node stats.test.mjs
import assert from 'node:assert/strict';
import { chi2Sf, chiSquareTest, effectSize, gammaQ } from './stats.js';

const close = (actual, expected, relTol, label) =>
  assert.ok(Math.abs(actual - expected) <= relTol * Math.max(Math.abs(expected), 1e-300), `${label}: got ${actual}, expected ${expected}`);

// Standard chi-square critical values: P(X > critical) = alpha
close(chi2Sf(3.841458820694124, 1), 0.05, 1e-9, 'df1 5 %');
close(chi2Sf(6.634896601021213, 1), 0.01, 1e-9, 'df1 1 %');
close(chi2Sf(2.705543454095404, 1), 0.10, 1e-9, 'df1 10 %');
close(chi2Sf(5.991464547107979, 2), 0.05, 1e-9, 'df2 5 %');
close(chi2Sf(9.487729036781154, 4), 0.05, 1e-9, 'df4 5 %');
close(chi2Sf(26.29622760486423, 16), 0.05, 1e-9, 'df16 5 %');
// Closed forms: df=2 → exp(−x/2); df=1 → erfc(√(x/2)); far tail stays accurate
close(chi2Sf(20, 2), Math.exp(-10), 1e-12, 'df2 closed form');
close(chi2Sf(100, 1), 1.523970604832105e-23, 1e-8, 'df1 far tail (2·Φ(−10))');
assert.equal(chi2Sf(0, 3), 1);
close(gammaQ(0.5, 0.5) + 1 - gammaQ(0.5, 0.5), 1, 1e-15, 'identity');

// 2×2 with equal expected counts: [[20,30],[30,20]] → E = 25, χ² = 4, p = 2·Φ(−2) = 0.0455002639
let t = chiSquareTest([[20, 30], [30, 20]]);
close(t.chi2, 4, 1e-12, 'chi2');
assert.equal(t.df, 1);
close(t.pValue, 0.0455002638963584, 1e-9, 'p');
close(t.cramersV, Math.sqrt(4 / 100), 1e-12, "Cramér's V");
assert.equal(t.effectLabel, 'small');
assert.equal(t.minExpected, 25);
assert.equal(t.cellsBelow5, 0);
// Yates: (|5| − 0.5)² · 4 / 25 = 3.24, p = 2·Φ(−1.8) = 0.0718605
t = chiSquareTest([[20, 30], [30, 20]], { yates: true });
close(t.chi2, 3.24, 1e-12, 'yates chi2');
close(t.pValue, 0.07185, 5e-4, 'yates p');
assert.equal(t.yatesApplied, true);

// z² equals uncorrected χ² on the A/B example from ab-test-calculator (z = 1.89375298 → p = 0.0582578)
t = chiSquareTest([[500, 9500], [560, 9440]]);
close(t.chi2, 1.8937529756356755 ** 2, 1e-9, 'chi2 = z²');
close(t.pValue, 0.05825780603351616, 1e-7, 'p matches two-proportion z-test');

// 3×2, all expected 20: χ² = 20, df = 2, p = e^−10; V = √(20/120)
t = chiSquareTest([[10, 30], [20, 20], [30, 10]]);
close(t.chi2, 20, 1e-12, '3×2 chi2');
assert.equal(t.df, 2);
close(t.pValue, Math.exp(-10), 1e-12, '3×2 p');
close(t.cramersV, Math.sqrt(20 / 120), 1e-12, '3×2 V');
assert.equal(t.effectLabel, 'medium'); // V = 0.408; 3×2 has k = 1

// Yates is ignored outside 2×2
assert.equal(chiSquareTest([[10, 30], [20, 20], [30, 10]], { yates: true }).yatesApplied, false);

// Independence → χ² = 0, p = 1
t = chiSquareTest([[10, 20], [20, 40]]);
close(t.chi2, 0, 1, 'independent chi2 ≈ 0');
assert.ok(Math.abs(t.chi2) < 1e-12);
assert.equal(t.pValue, 1);

// Small expected counts are reported
t = chiSquareTest([[2, 8], [3, 7]]);
assert.equal(t.cellsBelow5, 2);
assert.equal(t.cells, 4);
assert.ok(t.minExpected < 5);

// 4×3 table has df = 6 and matches the row/col-total expectation formula
t = chiSquareTest([[12, 8, 10], [9, 14, 7], [20, 15, 11], [5, 6, 13]]);
assert.equal(t.df, 6);
close(t.expected[0][0], (30 * 46) / 130, 1e-12, 'expected cell');
close(t.expected.flat().reduce((a, b) => a + b, 0), t.n, 1e-12, 'expected sums to N');

// Invalid tables
assert.throws(() => chiSquareTest([[1, 2]]), RangeError);
assert.throws(() => chiSquareTest([[1, 2], [3]]), RangeError);
assert.throws(() => chiSquareTest([[1, -2], [3, 4]]), RangeError);
assert.throws(() => chiSquareTest([[0, 0], [3, 4]]), RangeError); // empty row
assert.throws(() => chiSquareTest([[0, 5], [0, 4]]), RangeError); // empty column
assert.throws(() => chiSquareTest([[NaN, 1], [1, 1]]), RangeError);

// Effect-size labels scale with min(r−1, c−1)
assert.equal(effectSize(0.05, 1), 'negligible');
assert.equal(effectSize(0.2, 1), 'small');
assert.equal(effectSize(0.35, 1), 'medium');
assert.equal(effectSize(0.6, 1), 'large');
assert.equal(effectSize(0.2, 4), 'medium'); // 0.2 ≥ 0.15 but < 0.25

console.log('chi-square-calculator stats: all assertions passed');
