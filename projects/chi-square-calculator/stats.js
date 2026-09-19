// Pure statistics helpers for the Chi-Square Test Calculator. No DOM access.
// The gamma core is duplicated in ab-test-calculator/stats.js (projects share no code —
// see specs/projects.md), so fix bugs in both copies.

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

function gammaSeries(a, x) {
  let sum = 1 / a;
  let term = sum;
  for (let n = 1; n < 1000; n++) {
    term *= x / (a + n);
    sum += term;
    if (Math.abs(term) < Math.abs(sum) * 1e-16) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
}

function gammaContinuedFraction(a, x) {
  const tiny = 1e-300;
  let b = x + 1 - a;
  let c = 1 / tiny;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 1000; i++) {
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

// Regularized upper incomplete gamma Q(a, x) = 1 − P(a, x), accurate in the far tail.
export function gammaQ(a, x) {
  if (x <= 0) return 1;
  return x < a + 1 ? 1 - gammaSeries(a, x) : gammaContinuedFraction(a, x);
}

// Survival function of the chi-square distribution: P(X > x) with `df` degrees of freedom.
export function chi2Sf(x, df) {
  if (!(df >= 1)) throw new RangeError('df must be at least 1');
  return Math.min(1, Math.max(0, gammaQ(df / 2, x / 2)));
}

// Chi-square test of independence on a contingency table of counts (array of equal-length rows).
// Returns null for the parts that are undefined; throws RangeError on invalid tables.
export function chiSquareTest(table, { yates = false } = {}) {
  const r = table.length;
  const c = r ? table[0].length : 0;
  if (r < 2 || c < 2) throw new RangeError('table needs at least 2 rows and 2 columns');
  if (table.some((row) => row.length !== c)) throw new RangeError('rows must have equal length');
  if (table.some((row) => row.some((v) => !Number.isFinite(v) || v < 0))) throw new RangeError('counts must be non-negative numbers');

  const rowTotals = table.map((row) => row.reduce((a, b) => a + b, 0));
  const colTotals = Array.from({ length: c }, (_, j) => table.reduce((a, row) => a + row[j], 0));
  const n = rowTotals.reduce((a, b) => a + b, 0);
  if (rowTotals.some((t) => t === 0) || colTotals.some((t) => t === 0)) throw new RangeError('a row or column total is zero');

  const useYates = yates && r === 2 && c === 2;
  const expected = table.map((_, i) => colTotals.map((ct) => (rowTotals[i] * ct) / n));
  let chi2 = 0;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      let dev = Math.abs(table[i][j] - expected[i][j]);
      if (useYates) dev = Math.max(dev - 0.5, 0);
      chi2 += (dev * dev) / expected[i][j];
    }
  }
  const df = (r - 1) * (c - 1);
  const k = Math.min(r - 1, c - 1);
  const cramersV = Math.sqrt(chi2 / (n * k));
  const flat = expected.flat();
  // Adjusted (standardised) residuals: how many standard deviations each cell is from what luck predicts.
  const adjResiduals = table.map((row, i) =>
    row.map((v, j) => (v - expected[i][j]) / Math.sqrt(expected[i][j] * (1 - rowTotals[i] / n) * (1 - colTotals[j] / n))));
  return {
    chi2, df, pValue: chi2Sf(chi2, df), n, rowTotals, colTotals, expected, adjResiduals,
    cramersV, effectLabel: effectSize(cramersV, k),
    minExpected: Math.min(...flat),
    cellsBelow5: flat.filter((e) => e < 5).length,
    cells: flat.length,
    yatesApplied: useYates,
  };
}

// Cohen's benchmarks for Cramér's V scale with √(min(r−1, c−1)).
export function effectSize(v, k) {
  const s = Math.sqrt(k);
  if (v < 0.1 / s) return 'negligible';
  if (v < 0.3 / s) return 'small';
  if (v < 0.5 / s) return 'medium';
  return 'large';
}
