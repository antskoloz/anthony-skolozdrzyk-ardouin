// Pure statistics helpers for the A/B Test Sample Size & Confidence Calculator.
// No DOM access. The regularized-gamma core is duplicated in chi-square-calculator/stats.js
// (projects share no code — see specs/projects.md), so fix bugs in both copies.

const LANCZOS = [
  676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012,
  9.9843695780195716e-6, 1.5056327351493116e-7,
];

function logGamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = 0.99999999999980993;
  const t = x + 7.5;
  for (let i = 0; i < LANCZOS.length; i++) a += LANCZOS[i] / (x + i + 1);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

// Regularized lower incomplete gamma P(a, x).
export function gammaP(a, x) {
  if (x <= 0) return 0;
  if (x < a + 1) {
    let sum = 1 / a;
    let term = sum;
    for (let n = 1; n < 500; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-16) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  }
  return 1 - gammaQContinuedFraction(a, x);
}

function gammaQContinuedFraction(a, x) {
  const tiny = 1e-300;
  let b = x + 1 - a;
  let c = 1 / tiny;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-16) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

// Standard normal CDF, via P(1/2, z²/2).
export function normalCdf(z) {
  const p = 0.5 * gammaP(0.5, (z * z) / 2);
  return z >= 0 ? 0.5 + p : 0.5 - p;
}

// Upper tail 1 - Φ(z), accurate for large z.
export function normalSf(z) {
  return normalCdf(-z);
}

// Inverse standard normal CDF: Acklam's approximation refined with two Halley steps.
export function normalInv(p) {
  if (!(p > 0 && p < 1)) throw new RangeError('normalInv needs 0 < p < 1');
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const low = 0.02425;
  let x;
  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p > 1 - low) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else {
    const q = p - 0.5;
    const r = q * q;
    x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  for (let i = 0; i < 2; i++) {
    const e = normalCdf(x) - p;
    const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
    x -= u / (1 + (x * u) / 2);
  }
  return x;
}

// Critical z for a confidence level (0.95 → 1.96), two-sided or one-sided.
export function zForConfidence(confidence, sides = 2) {
  const alpha = 1 - confidence;
  return normalInv(sides === 2 ? 1 - alpha / 2 : 1 - alpha);
}

// Required visitors per variant to detect p1 → p2 (absolute rates in 0–1).
export function sampleSizePerVariant({ p1, p2, confidence = 0.95, power = 0.8, sides = 2 }) {
  if (!(p1 > 0 && p1 < 1) || !(p2 > 0 && p2 < 1)) throw new RangeError('rates must be between 0 and 1 (exclusive)');
  if (p1 === p2) throw new RangeError('the two rates must differ');
  const zA = zForConfidence(confidence, sides);
  const zB = normalInv(power);
  const pBar = (p1 + p2) / 2;
  const top = zA * Math.sqrt(2 * pBar * (1 - pBar)) + zB * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  return Math.ceil((top * top) / ((p2 - p1) * (p2 - p1)));
}

// Two-proportion comparison of a variant against control (always two-sided).
// p-value uses the pooled standard error; the interval uses the unpooled (Wald) one.
export function compareProportions({ n1, x1, n2, x2, confidence = 0.95 }) {
  const p1 = x1 / n1;
  const p2 = x2 / n2;
  const diff = p2 - p1;
  const pooled = (x1 + x2) / (n1 + n2);
  const sePooled = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));
  let z = 0;
  let pValue = 1;
  if (sePooled > 0) {
    z = diff / sePooled;
    pValue = Math.min(1, 2 * normalSf(Math.abs(z)));
  }
  const seUnpooled = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2);
  const zC = zForConfidence(confidence, 2);
  const diffLow = diff - zC * seUnpooled;
  const diffHigh = diff + zC * seUnpooled;
  return {
    p1, p2, diff, z, pValue,
    diffLow, diffHigh,
    relLift: p1 > 0 ? diff / p1 : null,
    relLow: p1 > 0 ? diffLow / p1 : null,
    relHigh: p1 > 0 ? diffHigh / p1 : null,
    significant: pValue < 1 - confidence,
  };
}

// Smallest absolute lift the given sample sizes could detect (two-sided, at the given power),
// assuming the control rate p1 for the variance.
export function minDetectableEffect({ n1, n2, p1, confidence = 0.95, power = 0.8 }) {
  const zA = zForConfidence(confidence, 2);
  const zB = normalInv(power);
  return (zA + zB) * Math.sqrt(p1 * (1 - p1) * (1 / n1 + 1 / n2));
}
