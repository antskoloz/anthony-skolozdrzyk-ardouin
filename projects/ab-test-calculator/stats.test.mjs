// Run with: node stats.test.mjs
import assert from 'node:assert/strict';
import {
  normalCdf, normalInv, zForConfidence, gammaP,
  sampleSizePerVariant, compareProportions, minDetectableEffect,
} from './stats.js';

const close = (actual, expected, tol, label) =>
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: got ${actual}, expected ${expected} ± ${tol}`);

// Normal distribution reference values
close(normalCdf(0), 0.5, 1e-12, 'Φ(0)');
close(normalCdf(1.96), 0.9750021048517795, 1e-10, 'Φ(1.96)');
close(normalCdf(-1.5), 0.06680720126885807, 1e-10, 'Φ(-1.5)');
close(normalInv(0.975), 1.959963984540054, 1e-9, 'z(0.975)');
close(normalInv(0.95), 1.6448536269514722, 1e-9, 'z(0.95)');
close(normalInv(0.995), 2.5758293035489004, 1e-9, 'z(0.995)');
close(normalInv(0.8), 0.8416212335729143, 1e-9, 'z(0.80)');
close(normalInv(1e-6), -4.753424308822899, 1e-8, 'z(1e-6)');
close(zForConfidence(0.9), 1.6448536269514722, 1e-9, 'two-sided 90 %');
close(zForConfidence(0.99), 2.5758293035489004, 1e-9, 'two-sided 99 %');
close(zForConfidence(0.95, 1), 1.6448536269514722, 1e-9, 'one-sided 95 %');
for (const p of [0.001, 0.02, 0.3, 0.5, 0.77, 0.999]) close(normalCdf(normalInv(p)), p, 1e-12, `round trip ${p}`);

// Chi-square(1) survival function from the same core: P(χ² > 3.841459) = 0.05
close(1 - gammaP(0.5, 3.841458820694124 / 2), 0.05, 1e-9, 'χ²(1) 5 % point');

// Sample size: baseline 10 %, +20 % relative (12 %), 95 % confidence, 80 % power.
// Independent check (Python statistics.NormalDist): 3840.85 → 3841.
assert.equal(sampleSizePerVariant({ p1: 0.1, p2: 0.12 }), 3841);
// 5 % → 6 %, 95 %/80 %: 8157.73 → 8158 (same independent check).
assert.equal(sampleSizePerVariant({ p1: 0.05, p2: 0.06 }), 8158);
// Higher confidence / power and two-sided vs one-sided all move n the right way.
assert.ok(sampleSizePerVariant({ p1: 0.1, p2: 0.12, confidence: 0.99 }) > 3841);
assert.ok(sampleSizePerVariant({ p1: 0.1, p2: 0.12, power: 0.9 }) > 3841);
assert.ok(sampleSizePerVariant({ p1: 0.1, p2: 0.12, sides: 1 }) < 3841);
// Symmetry: detecting a drop needs a similar (not identical) sample.
assert.ok(sampleSizePerVariant({ p1: 0.12, p2: 0.1 }) > 0);
assert.throws(() => sampleSizePerVariant({ p1: 0, p2: 0.1 }), RangeError);
assert.throws(() => sampleSizePerVariant({ p1: 0.1, p2: 0.1 }), RangeError);

// Comparison: 10,000 visitors each, 500 vs 560 conversions.
const r = compareProportions({ n1: 10000, x1: 500, n2: 10000, x2: 560 });
close(r.p1, 0.05, 1e-12, 'p1');
close(r.p2, 0.056, 1e-12, 'p2');
close(r.diff, 0.006, 1e-12, 'diff');
close(r.relLift, 0.12, 1e-12, 'relative lift');
// pooled p = 0.053, se = √(0.053·0.947·2/10000) = 0.0031685, z = 1.89375, two-sided p = 0.058258
close(r.z, 1.89375, 1e-4, 'z');
close(r.pValue, 0.058258, 1e-5, 'p-value');
assert.equal(r.significant, false);
assert.equal(compareProportions({ n1: 10000, x1: 500, n2: 10000, x2: 560, confidence: 0.9 }).significant, true);
// Wald interval: se = √(0.05·0.95/10000 + 0.056·0.944/10000) = 0.0031...; 95 % → 0.006 ± 1.96·se
const se = Math.sqrt((0.05 * 0.95) / 10000 + (0.056 * 0.944) / 10000);
close(r.diffLow, 0.006 - 1.959964 * se, 1e-6, 'diff CI low');
close(r.diffHigh, 0.006 + 1.959964 * se, 1e-6, 'diff CI high');
close(r.relLow, r.diffLow / 0.05, 1e-12, 'relative CI low');

// Control equals variant → p = 1, zero lift.
const same = compareProportions({ n1: 1000, x1: 50, n2: 1000, x2: 50 });
assert.equal(same.pValue, 1);
assert.equal(same.diff, 0);
// Zero conversions in both arms must not produce NaN.
const zeros = compareProportions({ n1: 1000, x1: 0, n2: 1000, x2: 0 });
assert.equal(zeros.pValue, 1);
assert.equal(zeros.relLift, null);
assert.ok(!Number.isNaN(zeros.diffLow));

// Consistency: the sample size found for the observed rates gives an MDE close to the true effect.
const n = sampleSizePerVariant({ p1: 0.05, p2: 0.056 });
close(minDetectableEffect({ n1: n, n2: n, p1: 0.05 }), 0.006, 6e-4, 'MDE ≈ effect at planned n');

console.log('ab-test-calculator stats: all assertions passed');
