import { adEfficiency, customerValue, roasLight, ltvCacLight, paybackLight } from './calc.js';

const $ = (id) => document.getElementById(id);

function parseDecimal(raw) {
  const s = raw.trim().replace(/[\s_]/g, '').replace(/,(?=\d{3}(\D|$))/g, '').replace(',', '.');
  return s !== '' && /^\d*\.?\d+$|^\d+\.$/.test(s) ? Number(s) : NaN;
}

function parseInteger(raw) {
  const s = raw.trim().replace(/[\s,_]/g, '');
  return /^\d+$/.test(s) ? Number(s) : NaN;
}

function setError(id, message) {
  $(`${id}-error`).textContent = message || '';
  $(id).setAttribute('aria-invalid', message ? 'true' : 'false');
  return Boolean(message);
}

const cur = () => $('currency').value;
const num = (n, d) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const money = (n) => `${n < 0 ? '−' : ''}${cur()}${num(Math.abs(n), Math.abs(n) >= 100 ? 0 : 2)}`;
const times = (n) => `${num(n, 2)}x`;
const metric = (value, label) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
const verdict = (kind, title, text) => `<div class="verdict is-${kind}"><strong class="title">${title}</strong><p>${text}</p></div>`;

let tracked = false;
function track() {
  if (tracked || typeof window.gtag !== 'function') return;
  tracked = true;
  window.gtag('event', 'tool_used', { tool: 'marketing-roi-calculator' });
}

function render() {
  const out = $('results');
  const churnMode = $('life-mode').value === 'churn';
  $('life-label').textContent = churnMode ? 'Annual churn rate (%)' : 'Lifespan (years)';

  const spend = parseDecimal($('spend').value);
  const revenue = parseDecimal($('revenue').value);
  const margin = parseDecimal($('margin').value);
  const customers = parseInteger($('customers').value);

  let bad = false;
  bad = setError('spend', !(spend > 0) ? 'Enter an ad spend above 0.' : '') || bad;
  bad = setError('revenue', Number.isNaN(revenue) ? 'Enter the revenue (0 or more).' : '') || bad;
  bad = setError('margin', !(margin > 0 && margin <= 100) ? 'Enter a margin above 0 and up to 100.' : '') || bad;
  bad = setError('customers', !(customers >= 1) ? 'Enter a whole number of customers (1 or more).' : '') || bad;

  // Customer-value group: optional, but all three or none.
  const aovRaw = $('aov').value.trim();
  const ordersRaw = $('orders').value.trim();
  const lifeRaw = $('life').value.trim();
  const anyValue = Boolean(aovRaw || ordersRaw || lifeRaw);
  let aov;
  let orders;
  let life;
  let valueError = false;
  if (anyValue) {
    aov = parseDecimal(aovRaw);
    orders = parseDecimal(ordersRaw);
    life = parseDecimal(lifeRaw);
    valueError = setError('aov', !(aov > 0) ? 'Enter an order value above 0, or clear all three fields.' : '') || valueError;
    valueError = setError('orders', !(orders > 0) ? 'Enter orders per year above 0, or clear all three fields.' : '') || valueError;
    valueError = setError('life', churnMode
      ? (!(life > 0 && life <= 100) ? 'Enter a churn rate above 0 and up to 100, or clear all three fields.' : '')
      : (!(life > 0) ? 'Enter a lifespan above 0, or clear all three fields.' : '')) || valueError;
  } else {
    ['aov', 'orders', 'life'].forEach((id) => setError(id, ''));
  }

  if (bad || valueError) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the results.</p>';
    return;
  }

  const m = margin / 100;
  const a = adEfficiency({ spend, revenue, margin: m, customers });
  const metrics = [
    metric(times(a.roas), 'ROAS (revenue per 1 of ad spend)'),
    metric(times(a.breakEvenRoas), 'break-even ROAS at this margin'),
    metric(money(a.profit), 'gross profit on ad spend'),
    metric(money(a.cac), 'customer acquisition cost (CAC)'),
  ];
  const verdicts = [];
  const items = [
    'ROAS depends on your attribution model and counts only the costs you include in ad spend. Returns, overheads and taxes are not modelled.',
    'The green / amber / red signals are widely quoted rules of thumb, not guarantees: sensible targets depend on your margins, sector, cash position and growth stage.',
  ];

  const roasKind = roasLight(a.roasVsBreakEven);
  const perUnit = a.roas * m;
  verdicts.push(verdict(roasKind === 'good' ? 'good' : roasKind === 'warn' ? 'warn' : 'bad',
    roasKind === 'good' ? 'ROAS: comfortably above break-even' : roasKind === 'warn' ? 'ROAS: barely above break-even' : 'ROAS: below break-even, the ads are losing money',
    `Your ROAS of ${times(a.roas)} compares with a break-even of ${times(a.breakEvenRoas)}. Each ${cur()}1 of ad spend returns ${money(perUnit).replace(/\.00$/, '')} of gross profit` +
      (roasKind === 'bad' ? ', so you lose money on the advertising itself before any other cost.' : roasKind === 'warn' ? ', a thin cushion that other costs (returns, overheads) could erase.' : ', leaving room for other costs.')));

  if (anyValue) {
    const v = customerValue({ aov, ordersPerYear: orders, margin: m, ...(churnMode ? { annualChurn: life / 100 } : { lifespanYears: life }), cac: a.cac });
    metrics.push(
      metric(money(v.ltv), `customer lifetime value (${num(v.lifespanYears, 1)} yr lifespan)`),
      metric(`${num(v.ltvToCac, 1)} : 1`, 'LTV : CAC'),
      metric(`${num(v.paybackMonths, 1)} months`, 'CAC payback period'),
    );
    const lk = ltvCacLight(v.ltvToCac);
    verdicts.push(verdict(lk,
      lk === 'good' ? `LTV:CAC of ${num(v.ltvToCac, 1)}: healthy by the usual rule of thumb` : lk === 'warn' ? `LTV:CAC of ${num(v.ltvToCac, 1)}: positive but thin` : `LTV:CAC of ${num(v.ltvToCac, 1)}: each customer costs more than they return`,
      lk === 'good'
        ? `A customer is worth ${num(v.ltvToCac, 1)} times what it costs to acquire them (3:1 or better is the common target).` + (v.ltvToCac > 5 ? ' Above 5:1 can also mean you are under-investing in growth.' : '')
        : lk === 'warn'
          ? `You recover the acquisition cost, but the common target is 3:1 or better. Improving margin, order frequency, retention or CAC would strengthen it.`
          : `Expected lifetime gross profit (${money(v.ltv)}) is below the ${money(a.cac)} it costs to acquire a customer.`));
    const pk = paybackLight(v.paybackMonths);
    verdicts.push(verdict(pk,
      pk === 'good' ? `CAC payback in ${num(v.paybackMonths, 1)} months: within the usual 12-month target` : pk === 'warn' ? `CAC payback in ${num(v.paybackMonths, 1)} months: slower than the usual 12-month target` : `CAC payback in ${num(v.paybackMonths, 1)} months: cash is tied up for a long time`,
      pk === 'good' ? 'You earn back the acquisition cost quickly, which supports reinvesting in growth.' : 'A longer payback means more cash is needed to fund growth, and more risk if customers leave earlier than expected.'));
    items.push('LTV is a simple gross-margin estimate: it assumes constant order value, frequency and churn, and applies no discounting.');
  } else {
    items.push('Add average order value, orders per year and customer lifetime above to see LTV, LTV:CAC and CAC payback.');
  }

  out.innerHTML =
    '<h2>Results</h2>' +
    `<div class="metrics">${metrics.join('')}</div>` +
    verdicts.join('') +
    `<ul class="notes">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}

$('roi-form').addEventListener('input', () => { track(); render(); });
$('roi-form').addEventListener('change', render);
$('roi-form').addEventListener('submit', (e) => e.preventDefault());

$('year').textContent = new Date().getFullYear();
const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

render();
