import {
  capmCostOfEquity, wacc, freeCashFlow, projectFreeCashFlows, discountedCashFlowValue,
  equityValueFromEnterprise, perShareValue, basicEps, dilutedEps, priceToEarnings,
} from './calc.js';

const $ = (id) => document.getElementById(id);

function parseDecimal(raw) {
  const s = raw.trim().replace(/[\s_]/g, '').replace(/,(?=\d{3}(\D|$))/g, '').replace(',', '.');
  return s !== '' && /^\d*\.?\d+$|^\d+\.$/.test(s) ? Number(s) : NaN;
}

function parseSigned(raw) {
  const s = raw.trim().replace(/^[−–]/, '-');
  return s.startsWith('-') ? -parseDecimal(s.slice(1)) : parseDecimal(s);
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
const metric = (value, label) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
const info = (title, text) => `<div class="verdict is-info"><strong class="title">${title}</strong><p>${text}</p></div>`;

let tracked = false;
function track() {
  if (tracked || typeof window.gtag !== 'function') return;
  tracked = true;
  window.gtag('event', 'tool_used', { tool: 'company-valuation-calculator' });
}

function render() {
  const out = $('results');
  let bad = false;

  const shares = parseDecimal($('shares').value);
  bad = setError('shares', !(shares > 0) ? 'Enter the number of shares outstanding (above 0).' : '') || bad;

  const rf = parseSigned($('rf').value);
  bad = setError('rf', Number.isNaN(rf) ? 'Enter a percentage.' : '') || bad;
  const beta = parseSigned($('beta').value);
  bad = setError('beta', Number.isNaN(beta) ? 'Enter a number.' : '') || bad;
  const erp = parseSigned($('erp').value);
  bad = setError('erp', Number.isNaN(erp) ? 'Enter a percentage.' : '') || bad;
  const cod = parseDecimal($('cod').value);
  bad = setError('cod', Number.isNaN(cod) ? 'Enter a percentage (0 or more).' : '') || bad;
  const tax = parseDecimal($('tax').value);
  bad = setError('tax', !(tax >= 0 && tax < 100) ? 'Enter a tax rate from 0% up to (but not including) 100%.' : '') || bad;
  const mve = parseDecimal($('mve').value);
  bad = setError('mve', !(mve >= 0) ? 'Enter an amount (0 or more).' : '') || bad;
  const mvd = parseDecimal($('mvd').value);
  bad = setError('mvd', !(mvd >= 0) ? 'Enter an amount (0 or more).' : '') || bad;
  if (!bad && mve + mvd <= 0) {
    bad = setError('mve', 'Market value of equity and debt cannot both be 0.') || bad;
  }

  const ebit = parseSigned($('ebit').value);
  bad = setError('ebit', Number.isNaN(ebit) ? 'Enter an amount (negative allowed for a loss).' : '') || bad;
  const da = parseDecimal($('da').value);
  bad = setError('da', !(da >= 0) ? 'Enter an amount (0 or more).' : '') || bad;
  const capex = parseDecimal($('capex').value);
  bad = setError('capex', !(capex >= 0) ? 'Enter an amount (0 or more).' : '') || bad;
  const nwc = parseSigned($('nwc').value);
  bad = setError('nwc', Number.isNaN(nwc) ? 'Enter an amount (negative allowed).' : '') || bad;

  const growth = parseSigned($('growth').value);
  bad = setError('growth', Number.isNaN(growth) ? 'Enter a percentage (negative allowed).' : '') || bad;
  const years = Number($('years').value);
  const terminal = parseSigned($('terminal').value);
  bad = setError('terminal', Number.isNaN(terminal) ? 'Enter a percentage (negative allowed).' : '') || bad;
  const cash = parseDecimal($('cash').value);
  bad = setError('cash', !(cash >= 0) ? 'Enter an amount (0 or more).' : '') || bad;

  const netincome = parseSigned($('netincome').value);
  bad = setError('netincome', Number.isNaN(netincome) ? 'Enter an amount (negative allowed for a loss).' : '') || bad;
  const prefdiv = parseDecimal($('prefdiv').value);
  bad = setError('prefdiv', !(prefdiv >= 0) ? 'Enter an amount (0 or more).' : '') || bad;
  const dilshares = parseDecimal($('dilshares').value);
  bad = setError('dilshares', !(dilshares >= 0) ? 'Enter an amount (0 or more).' : '') || bad;

  const priceRaw = $('price').value.trim();
  const hasPrice = priceRaw !== '';
  const price = hasPrice ? parseDecimal(priceRaw) : null;
  if (hasPrice) bad = setError('price', !(price > 0) ? 'Enter a share price (above 0), or clear this field.' : '') || bad;
  else setError('price', '');

  if (bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the results.</p>';
    return;
  }

  const costOfEquity = capmCostOfEquity({ riskFreeRate: rf / 100, beta, equityRiskPremium: erp / 100 });
  const waccValue = wacc({ costOfEquity, costOfDebtPreTax: cod / 100, taxRate: tax / 100, marketValueEquity: mve, marketValueDebt: mvd });
  if (!(waccValue > 0)) {
    out.innerHTML = '<p class="error-banner">Your calculated WACC is 0% or less, so a DCF valuation cannot be computed. Increase the risk-free rate, beta, equity risk premium, or cost of debt.</p>';
    return;
  }
  const terminalDecimal = terminal / 100;
  if (!(terminalDecimal < waccValue)) {
    setError('terminal', `Long-term growth must be lower than your calculated WACC of ${pct(waccValue)}.`);
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the results.</p>';
    return;
  }

  const baseFcf = freeCashFlow({ ebit, taxRate: tax / 100, depreciationAmortization: da, capex, changeInNWC: nwc });
  const projected = projectFreeCashFlows({ baseFcf, growthRate: growth / 100, years });
  const dcf = discountedCashFlowValue({ projectedFcfs: projected, discountRate: waccValue, terminalGrowth: terminalDecimal });
  const equityValue = equityValueFromEnterprise({ enterpriseValue: dcf.enterpriseValue, totalDebt: mvd, cash });
  const perShare = perShareValue({ totalValue: equityValue, sharesOutstanding: shares });

  const basic = basicEps({ netIncome: netincome, preferredDividends: prefdiv, sharesOutstanding: shares });
  const diluted = dilutedEps({ netIncome: netincome, preferredDividends: prefdiv, sharesOutstanding: shares, additionalDilutedShares: dilshares });

  const metrics = [
    metric(pct(costOfEquity), 'cost of equity (CAPM)'),
    metric(pct(cod / 100 * (1 - tax / 100)), 'cost of debt, after tax'),
    metric(pct(waccValue), 'WACC (discount rate used below)'),
    metric(money(baseFcf), 'free cash flow, base year'),
    metric(money(dcf.enterpriseValue), 'enterprise value'),
    metric(money(equityValue), 'equity value'),
    metric(money(basic), 'basic EPS'),
    metric(money(diluted), 'diluted EPS'),
  ];

  const blocks = [info(
    `Estimated value per share (worked example): ${money(perShare)}`,
    `This is the result of the discounted cash flow (DCF) calculation above, built entirely from the assumptions you entered. It is a learning exercise showing how the method works, not a valuation of any real company and not a signal to buy or sell anything.`,
  )];

  if (hasPrice) {
    const pe = priceToEarnings({ price, eps: basic });
    metrics.push(metric(pe === null ? 'n/a' : num(pe, 1), 'P/E ratio (price ÷ basic EPS)'));
    const diffPct = (price / perShare - 1) * 100;
    const relation = Math.abs(diffPct) < 1 ? 'about equal to' : diffPct > 0 ? `about ${num(Math.abs(diffPct), 0)}% above` : `about ${num(Math.abs(diffPct), 0)}% below`;
    blocks.push(info(
      `Market price entered: ${money(price)}`,
      `The share price you entered is ${relation} the ${money(perShare)} produced by this worked example's DCF calculation. This is simply a numeric comparison between two different figures: market price reflects what investors are currently paying, while the DCF figure depends entirely on the assumptions entered above. Neither number is automatically "correct" — seeing why they differ, and which assumption drives the gap, is the point of the exercise.`,
    ));
  }

  const rows = projected.map((fcf, i) => {
    const t = i + 1;
    const pv = fcf / Math.pow(1 + waccValue, t);
    return `<tr><td>Year ${t}</td><td>${money(fcf)}</td><td>${money(pv)}</td></tr>`;
  }).join('');
  const workings = `
    <details class="workings">
      <summary>See the year-by-year DCF workings</summary>
      <table>
        <thead><tr><th>Period</th><th>Projected FCF</th><th>Present value</th></tr></thead>
        <tbody>
          ${rows}
          <tr><td>Terminal value (year ${years} onward)</td><td>${money(dcf.terminalValue)}</td><td>${money(dcf.presentValueOfTerminal)}</td></tr>
        </tbody>
        <tfoot><tr><td>Enterprise value</td><td></td><td>${money(dcf.enterpriseValue)}</td></tr></tfoot>
      </table>
    </details>`;

  out.innerHTML =
    '<h2>Results</h2>' +
    blocks.join('') +
    `<div class="metrics">${metrics.join('')}</div>` +
    workings +
    `<ul class="notes"><li>Every figure above comes only from what you typed in — no real market data was used.</li><li>The terminal value usually makes up most of the enterprise value, so small changes to the terminal growth rate or the WACC can move the result a lot.</li></ul>`;
}

$('valuation-form').addEventListener('input', () => { track(); render(); });
$('valuation-form').addEventListener('change', render);
$('valuation-form').addEventListener('submit', (e) => e.preventDefault());

$('year').textContent = new Date().getFullYear();
const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

render();
