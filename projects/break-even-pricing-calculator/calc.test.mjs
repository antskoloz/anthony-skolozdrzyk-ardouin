// Run with: node calc.test.mjs
import assert from 'node:assert/strict';
import { markupFromMargin, marginFromMarkup, priceFromCost, breakEven, discountImpact, safetyLight, discountLight } from './calc.js';

const close = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-9, `${label}: got ${a}, expected ${b}`);

// Margin and markup are different numbers: cost 80, price 100 -> margin 20 %, markup 25 %
let r = priceFromCost({ cost: 80, price: 100 });
close(r.profit, 20, 'profit');
close(r.margin, 0.2, 'margin');
close(r.markup, 0.25, 'markup');
// The same result from a target margin or a target markup
r = priceFromCost({ cost: 80, margin: 0.2 });
close(r.price, 100, 'price from margin');
close(r.markup, 0.25, 'markup from margin');
r = priceFromCost({ cost: 80, markup: 0.25 });
close(r.price, 100, 'price from markup');
close(r.margin, 0.2, 'margin from markup');
// 50 % margin = 100 % markup; a 100 % markup = 50 % margin
close(markupFromMargin(0.5), 1, 'markup of 50 % margin');
close(marginFromMarkup(1), 0.5, 'margin of 100 % markup');
// Round trip
close(marginFromMarkup(markupFromMargin(0.35)), 0.35, 'round trip');
// Zero margin sells at cost; a price below cost is a loss
close(priceFromCost({ cost: 50, margin: 0 }).price, 50, 'zero margin');
r = priceFromCost({ cost: 100, price: 80 });
close(r.margin, -0.25, 'loss margin');
close(r.markup, -0.2, 'loss markup');

// Break-even: fixed 10,000, price 50, variable 30 -> contribution 20 (40 %), 500 units, 25,000 in sales
let b = breakEven({ fixedCosts: 10000, price: 50, variableCost: 30 });
close(b.contribution, 20, 'contribution');
close(b.contributionMargin, 0.4, 'contribution margin');
assert.equal(b.breakEvenUnits, 500);
close(b.breakEvenSales, 25000, 'break-even sales');
assert.equal(b.profitAtUnits, null);
assert.equal(b.marginOfSafety, null);
// Target profit 5,000 -> 750 units
assert.equal(breakEven({ fixedCosts: 10000, price: 50, variableCost: 30, targetProfit: 5000 }).targetUnits, 750);
// With 800 units: profit 6,000, margin of safety 37.5 %
b = breakEven({ fixedCosts: 10000, price: 50, variableCost: 30, units: 800 });
close(b.profitAtUnits, 6000, 'profit at 800 units');
close(b.marginOfSafety, 0.375, 'margin of safety');
// Below break-even: negative safety and a loss
b = breakEven({ fixedCosts: 10000, price: 50, variableCost: 30, units: 400 });
close(b.profitAtUnits, -2000, 'loss at 400 units');
close(b.marginOfSafety, -0.25, 'negative margin of safety');
// Rounds up to whole units: 10,000 / 15 = 666.67
assert.equal(breakEven({ fixedCosts: 10000, price: 45, variableCost: 30 }).breakEvenUnits, 667);
// No fixed costs: nothing to recover
assert.equal(breakEven({ fixedCosts: 0, price: 10, variableCost: 4 }).breakEvenUnits, 0);
// Zero units: no margin of safety ratio
assert.equal(breakEven({ fixedCosts: 100, price: 10, variableCost: 4, units: 0 }).marginOfSafety, null);
// Never breaks even when the price does not cover the variable cost
b = breakEven({ fixedCosts: 1000, price: 30, variableCost: 30 });
assert.equal(b.breakEvenUnits, null);
assert.equal(b.targetUnits, null);
b = breakEven({ fixedCosts: 1000, price: 30, variableCost: 35 });
close(b.contribution, -5, 'negative contribution');
assert.equal(b.breakEvenUnits, null);

// Discount: price 100, cost 60 (40 % margin), 10 % off -> price 90, profit 40 -> 30, needs 33.3 % more volume
let d = discountImpact({ price: 100, cost: 60, discount: 0.1 });
close(d.newPrice, 90, 'new price');
close(d.profitBefore, 40, 'profit before');
close(d.profitAfter, 30, 'profit after');
close(d.margin, 0.4, 'margin');
close(d.extraVolume, 1 / 3, 'extra volume');
close(d.extraVolume, 0.1 / (0.4 - 0.1), 'extra volume = d / (m - d)');
assert.equal(d.unitsNeeded, null);
// With 1,000 units sold today: 1,334 needed (1,333.3 rounded up)
assert.equal(discountImpact({ price: 100, cost: 60, discount: 0.1, units: 1000 }).unitsNeeded, 1334);
// No discount: nothing extra
close(discountImpact({ price: 100, cost: 60, discount: 0 }).extraVolume, 0, 'no discount');
// A discount equal to the margin (or larger) can never be made up
assert.equal(discountImpact({ price: 100, cost: 60, discount: 0.4 }).extraVolume, null);
assert.equal(discountImpact({ price: 100, cost: 60, discount: 0.5 }).extraVolume, null);
assert.equal(discountImpact({ price: 100, cost: 60, discount: 0.5, units: 10 }).unitsNeeded, null);
// Free-to-make item: a 20 % discount needs 25 % more volume
close(discountImpact({ price: 100, cost: 0, discount: 0.2 }).extraVolume, 0.25, 'zero cost');

// Invalid inputs
assert.throws(() => priceFromCost({ cost: 0, price: 10 }), RangeError);
assert.throws(() => priceFromCost({ cost: 10, price: 0 }), RangeError);
assert.throws(() => priceFromCost({ cost: 10, margin: 1 }), RangeError);
assert.throws(() => priceFromCost({ cost: 10, margin: -0.1 }), RangeError);
assert.throws(() => priceFromCost({ cost: 10, markup: -0.1 }), RangeError);
assert.throws(() => priceFromCost({ cost: 10 }), RangeError);
assert.throws(() => breakEven({ fixedCosts: -1, price: 10, variableCost: 1 }), RangeError);
assert.throws(() => breakEven({ fixedCosts: 1, price: 0, variableCost: 1 }), RangeError);
assert.throws(() => breakEven({ fixedCosts: 1, price: 10, variableCost: -1 }), RangeError);
assert.throws(() => breakEven({ fixedCosts: 1, price: 10, variableCost: 1, targetProfit: -5 }), RangeError);
assert.throws(() => breakEven({ fixedCosts: 1, price: 10, variableCost: 1, units: -1 }), RangeError);
assert.throws(() => breakEven({ fixedCosts: NaN, price: 10, variableCost: 1 }), RangeError);
assert.throws(() => discountImpact({ price: 50, cost: 50, discount: 0.1 }), RangeError);
assert.throws(() => discountImpact({ price: 50, cost: 60, discount: 0.1 }), RangeError);
assert.throws(() => discountImpact({ price: 50, cost: 10, discount: 1 }), RangeError);
assert.throws(() => discountImpact({ price: 50, cost: 10, discount: -0.1 }), RangeError);

// Traffic lights (boundaries)
assert.deepEqual([-0.2, 0.09, 0.1, 0.29, 0.3, 0.6].map(safetyLight), ['bad', 'bad', 'warn', 'warn', 'good', 'good']);
assert.deepEqual([null, 0, 0.49, 0.5, 2].map(discountLight), ['bad', 'good', 'good', 'warn', 'warn']);

console.log('break-even-pricing-calculator calc: all assertions passed');
