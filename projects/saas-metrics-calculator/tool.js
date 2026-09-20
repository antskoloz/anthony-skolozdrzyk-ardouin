import { saasMetrics, logoChurn, ruleOf40, runwayMonths, burnMultiple, nrrLight, quickRatioLight, ruleOf40Light, burnMultipleLight, runwayLight } from './calc.js';

const $ = (id) => document.getElementById(id);

function parseDecimal(raw) {
  const s = raw.trim().replace(/[\s_]/g, '').replace(/,(?=\d{3}(\D|$))/g, '').replace(',', '.');
  return s !== '' && /^\d*\.?\d+$|^\d+\.$/.test(s) ? Number(s) : NaN;
}

function parseSigned(raw) {
  const s = raw.trim().replace(/^[−–]/, '-');
  return s.startsWith('-') ? -parseDecimal(s.slice(1)) : parseDecimal(s);
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
const pct = (n, d = 1) => `${n < 0 ? '−' : ''}${num(Math.abs(n) * 100, d)}%`;
const metric = (value, label, kind) => `<div class="metric${kind ? ` is-${kind}` : ''}"><strong>${value}</strong><span>${label}</span></div>`;
const verdict = (kind, title, text) => `<div class="verdict is-${kind}"><strong class="title">${title}</strong><p>${text}</p></div>`;
const PERIODS = { 1: 'month', 3: 'quarter', 12: 'year' };

let tracked = false;
function track() {
  if (tracked || typeof window.gtag !== 'function') return;
  tracked = true;
  window.gtag('event', 'tool_used', { tool: 'saas-metrics-calculator' });
}

// Optional groups are all-or-none: returns { any, ok }.
function optionalGroup(ids, validate) {
  const any = ids.some((id) => $(id).value.trim() !== '');
  if (!any) {
    ids.forEach((id) => setError(id, ''));
    return { any: false, ok: true };
  }
  let ok = true;
  ids.forEach((id) => { ok = !setError(id, validate(id)) && ok; });
  return { any: true, ok };
}

function render() {
  const out = $('results');
  const months = Number($('period').value);
  const period = PERIODS[months];

  const amounts = { start: parseDecimal($('start').value), newmrr: parseDecimal($('newmrr').value), expansion: parseDecimal($('expansion').value), contraction: parseDecimal($('contraction').value), churned: parseDecimal($('churned').value) };
  let bad = false;
  bad = setError('start', !(amounts.start > 0) ? 'Enter your MRR at the start of the period (above 0).' : '') || bad;
  for (const id of ['newmrr', 'expansion', 'contraction', 'churned']) {
    bad = setError(id, Number.isNaN(amounts[id]) ? 'Enter an amount (0 if none).' : '') || bad;
  }
  if (!bad && amounts.contraction + amounts.churned > amounts.start) {
    bad = setError('churned', 'Churned plus downgrades cannot be more than your starting MRR.') || bad;
  }

  const customers = optionalGroup(['cust-start', 'cust-lost'], (id) => {
    const v = parseInteger($(id).value);
    if (id === 'cust-start') return v >= 1 ? '' : 'Enter a whole number of customers (1 or more), or clear both fields.';
    if (Number.isNaN(v)) return 'Enter a whole number (0 or more), or clear both fields.';
    return v > parseInteger($('cust-start').value) ? 'You cannot lose more customers than you started with.' : '';
  });
  const cash = optionalGroup(['cash', 'burn'], (id) => (Number.isNaN(parseDecimal($(id).value)) ? 'Enter an amount (0 or more), or clear both fields.' : ''));
  const rule = optionalGroup(['growth', 'margin'], (id) => (Number.isNaN(parseSigned($(id).value)) ? 'Enter a percentage (negative allowed), or clear both fields.' : ''));

  if (bad || !customers.ok || !cash.ok || !rule.ok) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the results.</p>';
    return;
  }

  const m = saasMetrics({ startMrr: amounts.start, newMrr: amounts.newmrr, expansionMrr: amounts.expansion, contractionMrr: amounts.contraction, churnedMrr: amounts.churned, periodMonths: months });
  const nrrKind = nrrLight(m.nrrAnnualised);
  const metrics = [
    metric(money(m.endMrr), `MRR at the end of the ${period}`),
    metric(money(m.arr), 'ARR (ending MRR × 12)'),
    metric(`${m.netNewMrr < 0 ? '−' : '+'}${money(Math.abs(m.netNewMrr))}`, `net new MRR (${pct(m.growth)} growth)`, m.netNewMrr < 0 ? 'bad' : ''),
    metric(pct(m.grossChurn), `MRR lost to cancellations and downgrades`),
    metric(pct(m.nrr), `net revenue retention (NRR) this ${period}`, nrrKind),
    metric(pct(m.grr), `gross revenue retention (GRR) this ${period}`),
  ];
  const verdicts = [];
  const items = [
    'The green / amber / red signals are widely quoted rules of thumb for SaaS companies, not guarantees: healthy targets depend on your segment (SMB or enterprise), stage and pricing model.',
  ];

  const annualNote = months === 12 ? '' : ` If this ${period} repeated for a full year, that would be ${pct(m.nrrAnnualised)}.`;
  verdicts.push(verdict(nrrKind,
    nrrKind === 'good' ? `Retention: your existing customers are growing your revenue (NRR ${pct(m.nrr)})` : nrrKind === 'warn' ? `Retention: existing customers are shrinking a little (NRR ${pct(m.nrr)})` : `Retention: you are losing revenue from existing customers fast (NRR ${pct(m.nrr)})`,
    `Before counting any new customer, the customers you started the ${period} with now pay you ${pct(m.nrr)} of what they paid at the start.${annualNote} ${nrrKind === 'good' ? 'Above 100% (on an annual basis) means growth continues even without new sales.' : 'Below 100% means you must win new customers just to stand still.'}`));

  if (m.quickRatio === null) {
    items.push('No churn or downgrades this period, so the quick ratio is not defined (n/a: no losses).');
  } else {
    const qk = quickRatioLight(m.quickRatio);
    metrics.push(metric(`${num(m.quickRatio, 1)} : 1`, 'SaaS quick ratio', qk));
    verdicts.push(verdict(qk,
      qk === 'good' ? `Quick ratio ${num(m.quickRatio, 1)}: growth clearly outpaces losses` : qk === 'warn' ? `Quick ratio ${num(m.quickRatio, 1)}: growing, but losses eat into it` : `Quick ratio ${num(m.quickRatio, 1)}: you are shrinking`,
      `You added ${money(amounts.newmrr + amounts.expansion)} of MRR (new customers plus upsells) against ${money(amounts.contraction + amounts.churned)} lost. A ratio of 4 or more is the usual target; below 1 means the business is shrinking.`));
  }

  if (customers.any) {
    const cs = parseInteger($('cust-start').value);
    const lost = logoChurn({ customersStart: cs, customersLost: parseInteger($('cust-lost').value) });
    metrics.push(metric(pct(lost), `customer (logo) churn this ${period}`));
  }

  const netBurn = cash.any ? parseDecimal($('burn').value) : null;
  if (cash.any) {
    const runway = runwayMonths({ cash: parseDecimal($('cash').value), monthlyBurn: netBurn });
    if (runway === null) {
      metrics.push(metric('n/a', 'runway (cash-flow positive or break-even)', 'good'));
      verdicts.push(verdict('good', 'Runway: you are not burning cash', 'With a net burn of zero, your cash is not running down, so runway does not apply.'));
    } else {
      const rk = runwayLight(runway);
      metrics.push(metric(`${num(runway, 1)} months`, 'cash runway at current burn', rk));
      verdicts.push(verdict(rk,
        rk === 'good' ? `Runway: about ${num(runway, 1)} months of cash` : rk === 'warn' ? `Runway: about ${num(runway, 1)} months, start planning the next step` : `Runway: only about ${num(runway, 1)} months of cash`,
        `At ${money(netBurn)} of net burn per month, ${money(parseDecimal($('cash').value))} lasts about ${num(runway, 1)} months. Fundraising or turning profitable usually takes 6 to 9 months, so 12 to 18 months of runway is the common comfort zone.`));
    }
    const bm = burnMultiple({ monthlyBurn: netBurn, periodMonths: months, netNewMrr: m.netNewMrr });
    if (bm === null && netBurn > 0) {
      verdicts.push(verdict('bad', 'Burn multiple: n/a, no net new ARR', `You are burning ${money(netBurn)} a month while net new MRR this ${period} is ${money(m.netNewMrr)}, so there is no growth to compare the burn with.`));
    } else if (bm !== null) {
      const bk = burnMultipleLight(bm);
      metrics.push(metric(num(bm, 2), 'burn multiple (burn per 1 of net new ARR)', bk));
      verdicts.push(verdict(bk,
        bk === 'good' ? `Burn multiple ${num(bm, 2)}: efficient growth` : bk === 'warn' ? `Burn multiple ${num(bm, 2)}: acceptable, watch it` : `Burn multiple ${num(bm, 2)}: growth is expensive`,
        `You spent ${money(netBurn * months)} net over the ${period} to add ${money(m.netNewMrr * 12)} of annual recurring revenue. Lower is better: about 1.5 or less is efficient, above 3 is usually a warning sign.`));
    }
  } else {
    items.push('Add your cash and net monthly burn to see runway and the burn multiple.');
  }

  if (rule.any) {
    const score = ruleOf40({ growthPct: parseSigned($('growth').value), marginPct: parseSigned($('margin').value) });
    const fk = ruleOf40Light(score);
    metrics.push(metric(num(score, 1), 'Rule of 40 score (growth % + margin %)', fk));
    verdicts.push(verdict(fk,
      fk === 'good' ? `Rule of 40: ${num(score, 1)}, balanced growth and profit` : fk === 'warn' ? `Rule of 40: ${num(score, 1)}, below the usual 40 mark` : `Rule of 40: ${num(score, 1)}, growth and profitability are both weak`,
      `Year-over-year growth plus profit margin. Scoring 40 or more is the usual benchmark for a healthy SaaS business: fast growth can offset thin margins, and the reverse.`));
  } else {
    items.push('Add year-over-year growth and profit margin to see the Rule of 40 score.');
  }

  out.innerHTML =
    '<h2>Results</h2>' +
    `<div class="metrics">${metrics.join('')}</div>` +
    verdicts.join('') +
    `<ul class="notes">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}

$('saas-form').addEventListener('input', () => { track(); render(); });
$('saas-form').addEventListener('change', render);
$('saas-form').addEventListener('submit', (e) => e.preventDefault());

$('year').textContent = new Date().getFullYear();
const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

render();
