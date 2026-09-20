// Run with: node calc.test.mjs
import assert from 'node:assert/strict';
import { riceScore, iceScore, rankItems, parseImpact, parseNumber, parsePasted, csvCell, toCsv } from './calc.js';

const close = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-9, `${label}: got ${a}, expected ${b}`);

// RICE: 4000 people x impact 2 x 80 % / 3 person-months
close(riceScore({ reach: 4000, impact: 2, confidence: 80, effort: 3 }), 2133.3333333333335, 'RICE');
close(riceScore({ reach: 300, impact: 3, confidence: 70, effort: 6 }), 105, 'RICE 2');
close(riceScore({ reach: 0, impact: 1, confidence: 100, effort: 1 }), 0, 'zero reach');
close(riceScore({ reach: 100, impact: 0.25, confidence: 0, effort: 1 }), 0, 'zero confidence');
// Doubling effort halves the score
close(riceScore({ reach: 100, impact: 1, confidence: 100, effort: 2 }) * 2, riceScore({ reach: 100, impact: 1, confidence: 100, effort: 1 }), 'effort halves');

// ICE
close(iceScore({ impact: 8, confidence: 7, ease: 6 }), 336, 'ICE');
close(iceScore({ impact: 10, confidence: 10, ease: 10 }), 1000, 'ICE max');
close(iceScore({ impact: 1, confidence: 1, ease: 1 }), 1, 'ICE min');

// Invalid inputs
assert.throws(() => riceScore({ reach: -1, impact: 1, confidence: 50, effort: 1 }), RangeError);
assert.throws(() => riceScore({ reach: NaN, impact: 1, confidence: 50, effort: 1 }), RangeError);
assert.throws(() => riceScore({ reach: 1, impact: 1.5, confidence: 50, effort: 1 }), RangeError);
assert.throws(() => riceScore({ reach: 1, impact: 1, confidence: 101, effort: 1 }), RangeError);
assert.throws(() => riceScore({ reach: 1, impact: 1, confidence: -1, effort: 1 }), RangeError);
assert.throws(() => riceScore({ reach: 1, impact: 1, confidence: 50, effort: 0 }), RangeError);
assert.throws(() => riceScore({ reach: 1, impact: 1, confidence: 50, effort: -2 }), RangeError);
assert.throws(() => iceScore({ impact: 0, confidence: 5, ease: 5 }), RangeError);
assert.throws(() => iceScore({ impact: 5, confidence: 11, ease: 5 }), RangeError);
assert.throws(() => iceScore({ impact: 5, confidence: 5, ease: NaN }), RangeError);

// Ranking: highest first, ties share a rank and keep their input order
const ranked = rankItems([
  { name: 'A', score: 10 },
  { name: 'B', score: 30 },
  { name: 'C', score: 30 },
  { name: 'D', score: 20 },
  { name: 'E', score: 0 },
]);
assert.deepEqual(ranked.map((r) => r.name), ['B', 'C', 'D', 'A', 'E']);
assert.deepEqual(ranked.map((r) => r.rank), [1, 1, 3, 4, 5]);
assert.deepEqual(rankItems([]), []);
// Floating-point noise does not break a tie
assert.deepEqual(rankItems([{ name: 'x', score: 0.1 + 0.2 }, { name: 'y', score: 0.3 }]).map((r) => r.rank), [1, 1]);

// Parsing helpers
assert.equal(parseImpact('High'), 2);
assert.equal(parseImpact(' massive '), 3);
assert.equal(parseImpact('0.5'), 0.5);
assert.ok(Number.isNaN(parseImpact('huge')));
assert.equal(parseNumber('80%'), 80);
assert.equal(parseNumber('0,5'), 0.5);
assert.equal(parseNumber('1.5'), 1.5);
assert.ok(Number.isNaN(parseNumber('')));
assert.ok(Number.isNaN(parseNumber('abc')));

// Pasting from a spreadsheet: tab-separated with a header row, an impact word and a % sign
let p = parsePasted('Idea\tReach\tImpact\tConfidence\tEffort\nDark mode\t5000\t0.5\t90%\t1\nSSO\t300\thigh\t70\t6\n', 'rice');
assert.deepEqual(p.errors, []);
assert.deepEqual(p.rows, [
  { name: 'Dark mode', reach: 5000, impact: 0.5, confidence: 90, effort: 1 },
  { name: 'SSO', reach: 300, impact: 2, confidence: 70, effort: 6 },
]);
// CSV without a header, a quoted name containing a comma, and an empty name
p = parsePasted('"Search, faster",1000,1,50,2\n,10,1,100,1', 'rice');
assert.deepEqual(p.rows.map((r) => r.name), ['Search, faster', 'Untitled']);
// Bad lines are reported with their line number and do not stop the good ones
p = parsePasted('Idea\tReach\tImpact\tConfidence\tEffort\nGood\t100\t1\t50\t2\nNo effort\t100\t1\t50\t0\nToo short\t5\nBad impact\t100\t7\t50\t1', 'rice');
assert.equal(p.rows.length, 1);
assert.equal(p.errors.length, 3);
assert.match(p.errors[0], /^Line 3 \(No effort\): Effort must be greater than 0/);
assert.match(p.errors[1], /^Line 4: expected 5 columns/);
assert.match(p.errors[2], /^Line 5 \(Bad impact\): Impact must be/);
// ICE paste
p = parsePasted('Onboarding,8,7,6', 'ice');
assert.deepEqual(p.rows, [{ name: 'Onboarding', impact: 8, confidence: 7, ease: 6 }]);
// Empty paste
assert.deepEqual(parsePasted('  \n\n', 'rice'), { rows: [], errors: [] });

// CSV escaping and formula-injection guard
assert.equal(csvCell('plain'), 'plain');
assert.equal(csvCell('a,b'), '"a,b"');
assert.equal(csvCell('say "hi"'), '"say ""hi"""');
assert.equal(csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
assert.equal(csvCell('+1'), "'+1");
assert.equal(csvCell('-2 days'), "'-2 days");
assert.equal(csvCell('@user'), "'@user");
assert.equal(csvCell(42), '42');
assert.equal(csvCell(-3), '-3'); // numbers are not text, no prefix

const csv = toCsv(rankItems([
  { name: 'Dark mode', reach: 5000, impact: 0.5, confidence: 90, effort: 1, score: 2250 },
  { name: '=cmd', reach: 10, impact: 1, confidence: 100, effort: 3, score: 10 / 3 },
]), 'rice');
assert.equal(csv, 'Rank,Name,Reach,Impact,Confidence (%),Effort (person-months),RICE score\r\n1,Dark mode,5000,0.5,90,1,2250\r\n2,\'=cmd,10,1,100,3,3.33');
assert.equal(toCsv([{ name: 'X', impact: 8, confidence: 7, ease: 6, score: 336, rank: 1 }], 'ice'), 'Rank,Name,Impact,Confidence,Ease,ICE score\r\n1,X,8,7,6,336');

console.log('rice-prioritizer calc: all assertions passed');
