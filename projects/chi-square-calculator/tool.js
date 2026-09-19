import { chiSquareTest } from './stats.js';

const $ = (id) => document.getElementById(id);
const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
const fmtChi = (x) => (x < 1000 ? x.toFixed(3) : x.toFixed(1));
const fmtP = (p) => (p < 0.0001 ? '< 0.0001' : p.toFixed(4));
const chance = (p) => (p < 0.0001 ? 'less than 0.01% of the time' : `${(p * 100).toFixed(p < 0.01 ? 2 : 1)}% of the time`);
const pct = (v) => `${(v * 100).toFixed(1)}%`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function parseInteger(raw) {
  const s = String(raw).trim().replace(/[\s,_]/g, '');
  return /^\d+$/.test(s) ? Number(s) : NaN;
}

function setError(id, message) {
  const err = $(`${id}-error`);
  if (err) err.textContent = message || '';
  $(id).setAttribute('aria-invalid', message ? 'true' : 'false');
  return Boolean(message);
}

const metric = (value, label) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
const verdict = (kind, title, paragraphs) =>
  `<div class="verdict ${kind}"><strong class="title">${title}</strong>${paragraphs.map((p) => `<p>${p}</p>`).join('')}</div>`;
const notes = (items) => (items.length ? `<ul class="notes">${items.map((n) => `<li>${n}</li>`).join('')}</ul>` : '');
const confidence = () => Number($('confidence').value);

const used = new Set();
function track(mode) {
  if (used.has(mode) || typeof window.gtag !== 'function') return;
  used.add(mode);
  window.gtag('event', 'tool_used', { tool: 'chi-square-calculator', mode });
}

// --- shared result rendering ---------------------------------------------------------------

function observedTable(t, table, rowLabels, colLabels) {
  const head = colLabels.map((l) => `<th scope="col">${esc(l)}</th>`).join('') + '<th scope="col">Total</th>';
  const rows = table.map((row, i) =>
    `<tr><th scope="row">${esc(rowLabels[i])}</th>${row.map((v) => `<td>${fmtInt(v)} <span class="hint">(${pct(v / t.rowTotals[i])})</span></td>`).join('')}<td>${fmtInt(t.rowTotals[i])}</td></tr>`).join('');
  const totals = `<tr><th scope="row">Total</th>${t.colTotals.map((v) => `<td>${fmtInt(v)}</td>`).join('')}<td>${fmtInt(t.n)}</td></tr>`;
  return `<div class="table-scroll"><table class="obs-table"><caption>Observed counts (row %)</caption><thead><tr><th scope="col"></th>${head}</tr></thead><tbody>${rows}${totals}</tbody></table></div>`;
}

function expectedTable(t, rowLabels, colLabels) {
  const head = colLabels.map((l) => `<th scope="col">${esc(l)}</th>`).join('');
  const rows = t.expected.map((row, i) =>
    `<tr><th scope="row">${esc(rowLabels[i])}</th>${row.map((v) => `<td class="${v < 5 ? 'low' : ''}">${v.toFixed(1)}</td>`).join('')}</tr>`).join('');
  return `<div class="table-scroll"><table class="obs-table"><caption>Expected counts if there were no difference</caption><thead><tr><th scope="col"></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderResult(out, table, rowLabels, colLabels) {
  let t;
  try {
    t = chiSquareTest(table, { yates: $('yates').checked });
  } catch (e) {
    out.innerHTML = `<p class="empty-state">${e instanceof RangeError && /zero/.test(e.message)
      ? 'A row or column adds up to zero, so there is nothing to compare there. Check your counts, or reduce the table size.'
      : 'These counts cannot be analysed. Check that every cell is a whole number of 0 or more.'}</p>`;
    return;
  }

  const conf = confidence();
  const cl = `${Math.round(conf * 100)}%`;
  const alpha = Math.round((1 - conf) * 100);
  const sig = t.pValue < 1 - conf;
  const twoByTwo = table.length === 2 && table[0].length === 2;
  const stat = `χ²(${t.df}) = ${fmtChi(t.chi2)}, p ${t.pValue < 0.0001 ? fmtP(t.pValue) : `= ${fmtP(t.pValue)}`}`;
  const effect = `Cramér's V = ${t.cramersV.toFixed(3)}, a <strong>${t.effectLabel}</strong> effect.`;

  const paragraphs = [];
  let kind;
  let title;
  if (twoByTwo) {
    paragraphs.push(`In “${esc(colLabels[0])}”: ${esc(rowLabels[0])} ${pct(table[0][0] / t.rowTotals[0])} vs ${esc(rowLabels[1])} ${pct(table[1][0] / t.rowTotals[1])}.`);
  }
  if (sig) {
    kind = 'is-good';
    title = `Statistically significant at ${cl} confidence: ${twoByTwo ? 'the two groups differ' : 'the groups are not all the same'}`;
    paragraphs.push(`${stat}. If all groups truly had the same mix of outcomes, differences this large would occur ${chance(t.pValue)}, below your ${alpha}% threshold.`);
    paragraphs.push(effect + (t.effectLabel === 'negligible' || t.effectLabel === 'small' ? ' The difference is statistically real but small: check that it matters for your business.' : ''));
    if (!twoByTwo) paragraphs.push('This tells you that at least one group differs, not which one. Compare the row percentages in the table below.');
  } else {
    kind = 'is-warn';
    title = `Not enough evidence of a difference at ${cl} confidence`;
    paragraphs.push(`${stat}. Differences this large would occur ${chance(t.pValue)} even if the groups were identical, which is above your ${alpha}% threshold.`);
    paragraphs.push(`${effect} That is not proof that the groups are the same: a small or moderate sample can hide a real difference.`);
  }

  const items = [];
  if (t.cellsBelow5 > 0) {
    items.push(`${t.cellsBelow5} of ${t.cells} cells have an expected count below 5 (highlighted below), so the chi-square approximation is unreliable. Collect more data, merge sparse categories, or use Fisher's exact test for a 2×2 table (not offered here).`);
  }
  if ($('yates').checked && !twoByTwo) items.push('The Yates correction applies only to 2×2 tables and was not used here.');
  if (t.yatesApplied) items.push('The Yates continuity correction was applied: it is more conservative and can understate significance with large samples.');
  items.push('This assumes every observation is counted once, in one cell only, and that observations are independent. Chi-square shows association, not cause.');
  if (twoByTwo) items.push('Want the size of the lift with a confidence interval? Try the <a href="https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/projects/ab-test-calculator/">free A/B Test Calculator</a>.');

  out.innerHTML =
    '<h2>Result</h2>' +
    `<div class="metrics">${metric(fmtChi(t.chi2), `χ² (${t.df} degree${t.df === 1 ? '' : 's'} of freedom)`)}${metric(fmtP(t.pValue), 'p-value')}` +
    `${metric(t.cramersV.toFixed(3), `Cramér's V (${t.effectLabel})`)}${metric(fmtInt(t.n), 'observations in total')}</div>` +
    verdict(kind, title, paragraphs) +
    observedTable(t, table, rowLabels, colLabels) +
    expectedTable(t, rowLabels, colLabels) +
    notes(items);
}

// --- simple mode (2×2) ---------------------------------------------------------------------

function renderSimple() {
  const out = $('simple-results');
  const n1 = parseInteger($('s-n1').value);
  const x1 = parseInteger($('s-x1').value);
  const n2 = parseInteger($('s-n2').value);
  const x2 = parseInteger($('s-x2').value);
  let bad = false;
  bad = setError('s-n1', !(n1 >= 1) ? 'Enter a whole number of visitors (1 or more).' : '') || bad;
  bad = setError('s-n2', !(n2 >= 1) ? 'Enter a whole number of visitors (1 or more).' : '') || bad;
  bad = setError('s-x1', Number.isNaN(x1) ? 'Enter a whole number of conversions (0 or more).' : x1 > n1 ? 'Conversions cannot exceed visitors.' : '') || bad;
  bad = setError('s-x2', Number.isNaN(x2) ? 'Enter a whole number of conversions (0 or more).' : x2 > n2 ? 'Conversions cannot exceed visitors.' : '') || bad;
  if (bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the analysis.</p>';
    return;
  }
  renderResult(out, [[x1, n1 - x1], [x2, n2 - x2]], ['Control (A)', 'Variant (B)'], ['Converted', 'Did not convert']);
}

// --- advanced mode (up to 5×5) -------------------------------------------------------------

const adv = {
  rowLabels: ['Variant A', 'Variant B', 'Variant C', 'Variant D', 'Variant E'],
  colLabels: ['Converted', 'Did not convert', 'Outcome 3', 'Outcome 4', 'Outcome 5'],
  counts: [
    ['120', '880', '', '', ''],
    ['150', '850', '', '', ''],
    ['165', '835', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ],
};

function buildGrid() {
  const r = Number($('adv-rows').value);
  const c = Number($('adv-cols').value);
  const head = Array.from({ length: c }, (_, j) => `<th scope="col"><input class="label" id="adv-l-${j}" value="${esc(adv.colLabels[j])}" aria-label="Outcome ${j + 1} name" autocomplete="off"></th>`).join('');
  const body = Array.from({ length: r }, (_, i) =>
    `<tr><th scope="row"><input class="label" id="adv-r-${i}" value="${esc(adv.rowLabels[i])}" aria-label="Group ${i + 1} name" autocomplete="off"></th>` +
    Array.from({ length: c }, (_, j) => `<td><input id="adv-c-${i}-${j}" type="text" inputmode="numeric" value="${esc(adv.counts[i][j])}" aria-label="Count for group ${i + 1}, outcome ${j + 1}" autocomplete="off"></td>`).join('') +
    '</tr>').join('');
  $('adv-grid').innerHTML = `<table class="ct"><thead><tr><th></th>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function renderAdv() {
  const out = $('adv-results');
  const r = Number($('adv-rows').value);
  const c = Number($('adv-cols').value);
  const table = [];
  let bad = false;
  for (let i = 0; i < r; i++) {
    const row = [];
    for (let j = 0; j < c; j++) {
      const v = parseInteger(adv.counts[i][j]);
      const invalid = Number.isNaN(v);
      const input = $(`adv-c-${i}-${j}`);
      if (input) input.setAttribute('aria-invalid', String(invalid));
      bad = bad || invalid;
      row.push(v);
    }
    table.push(row);
  }
  $('adv-error').textContent = bad ? 'Every cell needs a whole number of 0 or more.' : '';
  if (bad) {
    out.innerHTML = '<p class="empty-state">Fill in every cell with a count to see the analysis.</p>';
    return;
  }
  const rowLabels = adv.rowLabels.slice(0, r).map((l, i) => l.trim() || `Group ${i + 1}`);
  const colLabels = adv.colLabels.slice(0, c).map((l, j) => l.trim() || `Outcome ${j + 1}`);
  renderResult(out, table, rowLabels, colLabels);
}

$('adv-grid').addEventListener('input', (e) => {
  const id = e.target.id;
  let m;
  if ((m = /^adv-c-(\d)-(\d)$/.exec(id))) adv.counts[m[1]][m[2]] = e.target.value;
  else if ((m = /^adv-r-(\d)$/.exec(id))) adv.rowLabels[m[1]] = e.target.value;
  else if ((m = /^adv-l-(\d)$/.exec(id))) adv.colLabels[m[1]] = e.target.value;
  track('advanced');
  renderAdv();
});
['adv-rows', 'adv-cols'].forEach((id) => $(id).addEventListener('change', () => { buildGrid(); renderAdv(); }));

// --- wiring --------------------------------------------------------------------------------

function selectTab(mode) {
  const simple = mode === 'simple';
  $('tab-simple').setAttribute('aria-selected', String(simple));
  $('tab-adv').setAttribute('aria-selected', String(!simple));
  $('panel-simple').hidden = !simple;
  $('panel-adv').hidden = simple;
  (simple ? renderSimple : renderAdv)();
}

const tabs = [$('tab-simple'), $('tab-adv')];
tabs[0].addEventListener('click', () => selectTab('simple'));
tabs[1].addEventListener('click', () => selectTab('adv'));
tabs.forEach((tab, i) =>
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const next = tabs[(i + 1) % tabs.length];
    next.focus();
    selectTab(next === tabs[0] ? 'simple' : 'adv');
  }),
);

$('simple-form').addEventListener('input', () => { track('simple'); renderSimple(); });
$('simple-form').addEventListener('submit', (e) => e.preventDefault());
['confidence', 'yates'].forEach((id) => $(id).addEventListener('change', () => (($('panel-simple').hidden ? renderAdv : renderSimple)())));

$('year').textContent = new Date().getFullYear();
const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

buildGrid();
renderSimple();
