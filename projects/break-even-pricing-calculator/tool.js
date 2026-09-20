import { markupFromMargin, marginFromMarkup, priceFromCost, breakEven, discountImpact, safetyLight, discountLight } from './calc.js';

const $ = (id) => document.getElementById(id);

function parseDecimal(raw) {
  const s = raw.trim().replace(/[\s_]/g, '').replace(/,(?=\d{3}(\D|$))/g, '').replace(',', '.');
  return s !== '' && /^\d*\.?\d+$|^\d+\.$/.test(s) ? Number(s) : NaN;
}

function setError(id, message) {
  $(`${id}-error`).textContent = message || '';
  $(id).setAttribute('aria-invalid', message ? 'true' : 'false');
  return Boolean(message);
}

const cur = () => $('currency').value;
const num = (n, d) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const money = (n) => `${n < 0 ? '−' : ''}${cur()}${num(Math.abs(n), Math.abs(n) >= 1000 ? 0 : 2).replace(/\.00$/, '')}`;
const whole = (n) => num(n, 0);
const pct = (n, d = 1) => `${n < 0 ? '−' : ''}${num(Math.abs(n) * 100, d)}%`.replace(/\.0%$/, '%');
const metric = (value, label, kind) => `<div class="metric${kind ? ` is-${kind}` : ''}"><strong>${value}</strong><span>${label}</span></div>`;
const verdict = (kind, title, text) => `<div class="verdict${kind ? ` is-${kind}` : ''}"><strong class="title">${title}</strong><p>${text}</p></div>`;
const notes = (items) => `<ul class="notes">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const table = (head, rows) =>
  `<div class="table-wrap"><table class="ref-table"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

let tracked = false;
function track() {
  if (tracked || typeof window.gtag !== 'function') return;
  tracked = true;
  window.gtag('event', 'tool_used', { tool: 'break-even-pricing-calculator' });
}

// Optional number field: returns undefined when empty, NaN when invalid (after reporting the error).
function optional(id, message, valid = (v) => v >= 0) {
  const raw = $(id).value.trim();
  if (raw === '') { setError(id, ''); return { value: undefined, bad: false }; }
  const v = parseDecimal(raw);
  const bad = setError(id, Number.isNaN(v) || !valid(v) ? message : '');
  return { value: v, bad };
}

/* ---------- Tab 1: margin and markup ---------- */
function renderMargin() {
  const out = $('mm-results');
  const known = $('mm-known').value;
  $('mm-value-label').textContent = known === 'price' ? 'Selling price per unit' : known === 'margin' ? 'Margin you want (%)' : 'Markup you want (%)';

  const cost = parseDecimal($('mm-cost').value);
  const value = parseDecimal($('mm-value').value);
  let bad = setError('mm-cost', !(cost > 0) ? 'Enter your cost per unit (above 0).' : '');
  const valueOk = known === 'price' ? value > 0 : known === 'margin' ? value >= 0 && value < 100 : value >= 0;
  bad = setError('mm-value', !valueOk ? (known === 'price' ? 'Enter a selling price above 0.' : known === 'margin' ? 'Enter a margin from 0 up to (but not including) 100.' : 'Enter a markup of 0 or more.') : '') || bad;
  if (bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the results.</p>';
    return;
  }

  const r = priceFromCost({ cost, ...(known === 'price' ? { price: value } : known === 'margin' ? { margin: value / 100 } : { markup: value / 100 }) });
  const loss = r.profit < 0;
  const metrics = [
    metric(money(r.price), 'selling price per unit'),
    metric(money(r.profit), loss ? 'loss per unit' : 'profit per unit', loss ? 'bad' : ''),
    metric(pct(r.margin), 'margin (profit as a share of the price)', loss ? 'bad' : ''),
    metric(pct(r.markup), 'markup (profit as a share of your cost)', loss ? 'bad' : ''),
  ];
  let head;
  if (loss) {
    head = verdict('bad', `You sell below cost: ${money(-r.profit)} lost on every unit`, `At ${money(r.price)} a unit that costs you ${money(cost)}, every sale loses money before any other expense.`);
  } else {
    head = verdict('',
      `${pct(r.margin)} margin is the same as a ${pct(r.markup)} markup`,
      `You earn ${money(r.profit)} on every unit. That is ${pct(r.margin)} of the selling price (your <strong>margin</strong>) and ${pct(r.markup)} of what it cost you (your <strong>markup</strong>). ` +
      (r.margin > 0 ? `To reach a ${pct(r.margin, 0)} margin you need a ${pct(markupFromMargin(r.margin), 1)} markup: adding ${pct(r.margin, 0)} on top of the cost would only give a margin of ${pct(marginFromMarkup(r.margin), 1)}.` : ''));
  }
  const ref = table(['Margin you want', 'Markup on cost you need', `Price if your cost is ${money(cost)}`],
    [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6].map((m) => [pct(m, 0), pct(markupFromMargin(m), 1), money(cost / (1 - m))]));
  out.innerHTML = `<h2>Results</h2><div class="metrics">${metrics.join('')}</div>${head}<h3 class="sub">Margin and markup side by side</h3>${ref}` +
    notes(['Margin and markup describe the same profit against different bases, so never compare one with the other. Check which one a supplier, a competitor or a spreadsheet is quoting.', 'Cost here should be the full cost of one unit (product, delivery, payment fees); overheads are covered on the Break-even tab.']);
}

/* ---------- Tab 2: break-even ---------- */
function renderBreakEven() {
  const out = $('be-results');
  const fixed = parseDecimal($('be-fixed').value);
  const price = parseDecimal($('be-price').value);
  const variable = parseDecimal($('be-var').value);
  let bad = setError('be-fixed', Number.isNaN(fixed) ? 'Enter your fixed costs (0 if none).' : '');
  bad = setError('be-price', !(price > 0) ? 'Enter a price above 0.' : '') || bad;
  bad = setError('be-var', Number.isNaN(variable) ? 'Enter the variable cost per unit (0 if none).' : '') || bad;
  const target = optional('be-target', 'Enter a profit of 0 or more, or clear the field.');
  const units = optional('be-units', 'Enter a number of units (0 or more), or clear the field.');
  if (bad || target.bad || units.bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the results.</p>';
    return;
  }

  const b = breakEven({ fixedCosts: fixed, price, variableCost: variable, targetProfit: target.value || 0, units: units.value });
  if (b.breakEvenUnits === null) {
    out.innerHTML = '<h2>Results</h2>' +
      verdict('bad', 'You never break even at this price',
        `Each sale brings in ${money(price)} but costs ${money(variable)} to deliver, leaving ${money(b.contribution)} to pay the fixed costs. Raise the price or cut the variable cost per unit until each sale leaves something over.`) +
      notes(['Variable costs are the ones that grow with every sale: materials, delivery, payment fees, sales commission.']);
    return;
  }

  const metrics = [
    metric(money(b.contribution), 'left from each sale after variable costs'),
    metric(pct(b.contributionMargin), 'of each sale left to cover fixed costs'),
    metric(whole(b.breakEvenUnits), 'units to sell to break even'),
    metric(money(b.breakEvenSales), 'sales needed to break even'),
  ];
  if (target.value > 0) metrics.push(metric(whole(b.targetUnits), `units to reach a profit of ${money(target.value)}`));
  const verdicts = [verdict('',
    `You break even at ${whole(b.breakEvenUnits)} units (${money(b.breakEvenSales)} in sales)`,
    `Every unit sold leaves ${money(b.contribution)} after its own costs. You need ${whole(b.breakEvenUnits)} of them to pay the ${money(fixed)} of fixed costs; every unit after that is profit.` +
      (target.value > 0 ? ` To also earn ${money(target.value)}, sell ${whole(b.targetUnits)} units.` : ''))];
  if (units.value !== undefined) {
    metrics.push(metric(money(b.profitAtUnits), `${b.profitAtUnits < 0 ? 'loss' : 'profit'} at ${whole(units.value)} units`, b.profitAtUnits < 0 ? 'bad' : ''));
    if (b.marginOfSafety !== null) {
      const k = safetyLight(b.marginOfSafety);
      metrics.push(metric(pct(b.marginOfSafety), 'margin of safety', k));
      verdicts.push(verdict(k,
        k === 'good' ? `Comfortable: sales could fall ${pct(b.marginOfSafety)} before you lose money` : k === 'warn' ? `Thin cushion: sales could fall only ${pct(b.marginOfSafety)} before you lose money` : b.marginOfSafety < 0 ? `Below break-even: you are ${whole(b.breakEvenUnits - units.value)} units short` : `Very thin cushion: a ${pct(b.marginOfSafety)} drop in sales puts you in the red`,
        b.marginOfSafety < 0
          ? `At ${whole(units.value)} units you lose ${money(-b.profitAtUnits)}. Options: raise the price, reduce variable or fixed costs, or sell more.`
          : `The margin of safety is how far sales can fall before profit reaches zero. 30% or more is a common comfort level, under 10% is fragile. These are rules of thumb, not guarantees.`));
    }
  }
  out.innerHTML = `<h2>Results</h2><div class="metrics">${metrics.join('')}</div>${verdicts.join('')}` +
    notes(['Use the same period for fixed costs, the profit target and units: all per month, or all per year.', 'Assumes the price and the variable cost per unit stay constant and that everything you make is sold. Real costs often step up as you grow (a new hire, a bigger warehouse).']);
}

/* ---------- Tab 3: discount ---------- */
function renderDiscount() {
  const out = $('di-results');
  const price = parseDecimal($('di-price').value);
  const cost = parseDecimal($('di-cost').value);
  const disc = parseDecimal($('di-disc').value);
  let bad = setError('di-price', !(price > 0) ? 'Enter a price above 0.' : '');
  bad = setError('di-cost', Number.isNaN(cost) ? 'Enter your cost per unit (0 if none).' : cost >= price ? 'Your cost must be below the price, otherwise there is no profit to protect.' : '') || bad;
  bad = setError('di-disc', !(disc > 0 && disc < 100) ? 'Enter a discount above 0 and below 100.' : '') || bad;
  const units = optional('di-units', 'Enter a number of units (0 or more), or clear the field.');
  if (bad || units.bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the results.</p>';
    return;
  }

  const d = discountImpact({ price, cost, discount: disc / 100, units: units.value });
  const k = discountLight(d.extraVolume);
  const metrics = [
    metric(money(d.newPrice), 'price after the discount'),
    metric(`${money(d.profitBefore)} → ${money(d.profitAfter)}`, 'profit per unit, before → after', d.profitAfter <= 0 ? 'bad' : ''),
    metric(d.extraVolume === null ? 'impossible' : `+${pct(d.extraVolume, 0)}`, 'more sales needed to earn the same profit', k),
  ];
  if (d.unitsNeeded !== null) metrics.push(metric(whole(d.unitsNeeded), `units needed instead of ${whole(units.value)}`));
  const head = d.extraVolume === null
    ? verdict('bad', `A ${pct(disc / 100, 0)} discount wipes out your whole margin`, `Your margin is ${pct(d.margin, 0)}, so at ${money(d.newPrice)} you would sell at or below cost. No amount of extra sales makes up for that: you would lose money on every unit.`)
    : verdict(k, `A ${pct(disc / 100, 0)} discount means selling ${pct(d.extraVolume, 0)} more just to earn the same profit`,
      `Your profit per unit falls from ${money(d.profitBefore)} to ${money(d.profitAfter)}, so you need ${pct(d.extraVolume, 0)} more units to end up where you are today. ` +
      (k === 'warn' ? 'That is a big jump in sales (50% or more is a rule-of-thumb warning level): check that the promotion can realistically deliver it.' : 'Whether the promotion can deliver that extra volume is the question to answer before you run it.'));
  const rows = [0.05, 0.1, 0.15, 0.2, 0.25].map((x) => {
    const r = discountImpact({ price, cost, discount: x });
    return [pct(x, 0), money(r.newPrice), r.extraVolume === null ? 'impossible' : `+${pct(r.extraVolume, 0)}`];
  });
  out.innerHTML = `<h2>Results</h2><div class="metrics">${metrics.join('')}</div>${head}<h3 class="sub">Same price and cost, other discounts</h3>${table(['Discount', 'New price', 'Extra sales needed'], rows)}` +
    notes(['Assumes your cost per unit stays the same and that the discount applies to every sale, including customers who would have paid full price anyway.', 'The thinner your margin, the more expensive every discount point becomes.']);
}

/* ---------- Wiring ---------- */
const RENDERERS = { mm: renderMargin, be: renderBreakEven, di: renderDiscount };
const renderAll = () => Object.values(RENDERERS).forEach((fn) => fn());

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      $(`panel-${t.dataset.tab}`).hidden = !on;
    });
    track();
  });
});

for (const key of Object.keys(RENDERERS)) {
  const form = $(`${key}-form`);
  form.addEventListener('input', () => { track(); RENDERERS[key](); });
  form.addEventListener('change', RENDERERS[key]);
  form.addEventListener('submit', (e) => e.preventDefault());
}
$('currency').addEventListener('change', renderAll);

$('year').textContent = new Date().getFullYear();
const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

renderAll();
