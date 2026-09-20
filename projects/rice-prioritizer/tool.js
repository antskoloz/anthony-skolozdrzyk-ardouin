import { IMPACT_LEVELS, FIELDS, score, rankItems, parseNumber, parseImpact, parsePasted, toCsv } from './calc.js';

const $ = (id) => document.getElementById(id);
const MAX_ROWS = 50;

const LABELS = {
  rice: { reach: 'Reach (people per quarter)', impact: 'Impact', confidence: 'Confidence (%)', effort: 'Effort (person-months)' },
  ice: { impact: 'Impact (1–10)', confidence: 'Confidence (1–10)', ease: 'Ease (1–10)' },
};
const SHORT = { reach: 'Reach', impact: 'Impact', confidence: 'Confidence', effort: 'Effort', ease: 'Ease' };

const EXAMPLES = {
  rice: [
    { name: 'Self-serve onboarding checklist', reach: '4000', impact: '2', confidence: '80', effort: '3' },
    { name: 'SSO for enterprise customers', reach: '300', impact: '3', confidence: '70', effort: '6' },
    { name: 'Dark mode', reach: '5000', impact: '0.5', confidence: '90', effort: '1' },
    { name: 'Referral programme', reach: '1500', impact: '1', confidence: '50', effort: '2' },
    { name: 'Usage dashboard', reach: '800', impact: '2', confidence: '60', effort: '4' },
  ],
  ice: [
    { name: 'Self-serve onboarding checklist', impact: '8', confidence: '7', ease: '6' },
    { name: 'SSO for enterprise customers', impact: '9', confidence: '5', ease: '3' },
    { name: 'Dark mode', impact: '4', confidence: '9', ease: '9' },
    { name: 'Referral programme', impact: '6', confidence: '6', ease: '8' },
  ],
};

const clone = (rows) => rows.map((r) => ({ ...r }));
const state = { method: 'rice', rows: { rice: clone(EXAMPLES.rice), ice: clone(EXAMPLES.ice) } };
const fmt = (n) => n.toLocaleString('en-US', { maximumFractionDigits: n >= 100 ? 0 : 2 });

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

let tracked = false;
function track() {
  if (tracked || typeof window.gtag !== 'function') return;
  tracked = true;
  window.gtag('event', 'tool_used', { tool: 'rice-prioritizer' });
}

const method = () => state.method;
const rows = () => state.rows[state.method];
const isBlank = (row) => row.name.trim() === '' && FIELDS[method()].every((f) => (method() === 'rice' && f === 'impact') || row[f].trim() === '');

// Turns one raw row into numbers and a score; throws RangeError with a readable message when invalid.
function scoreRaw(row) {
  const item = { name: row.name.trim() || 'Untitled' };
  for (const f of FIELDS[method()]) {
    item[f] = f === 'impact' && method() === 'rice' ? parseImpact(row[f]) : parseNumber(row[f]);
  }
  item.score = score(method(), item);
  return item;
}

function buildTable() {
  const m = method();
  const table = $('items');
  table.replaceChildren();
  const head = el('tr');
  head.append(el('th', 'col-idx', '#'), el('th', 'col-name', 'Idea or feature'));
  FIELDS[m].forEach((f) => head.append(el('th', 'col-num', LABELS[m][f])));
  head.append(el('th', 'col-score', m === 'rice' ? 'RICE score' : 'ICE score'), el('th', 'col-x'));
  const thead = el('thead');
  thead.append(head);
  const tbody = el('tbody');
  rows().forEach((row, i) => {
    const tr = el('tr');
    tr.dataset.i = String(i);
    tr.append(el('td', 'col-idx', String(i + 1)));

    const nameCell = el('td', 'col-name');
    const name = el('input');
    name.type = 'text';
    name.dataset.k = 'name';
    name.value = row.name;
    name.placeholder = 'Name';
    name.maxLength = 120;
    name.setAttribute('aria-label', `Name of row ${i + 1}`);
    nameCell.append(name);
    tr.append(nameCell);

    FIELDS[m].forEach((f) => {
      const td = el('td', 'col-num');
      let input;
      if (m === 'rice' && f === 'impact') {
        input = el('select');
        IMPACT_LEVELS.forEach((l) => {
          const o = el('option', '', `${l.label} (${l.value})`);
          o.value = String(l.value);
          input.append(o);
        });
      } else {
        input = el('input');
        input.type = 'text';
        input.inputMode = 'decimal';
        input.autocomplete = 'off';
      }
      input.dataset.k = f;
      input.value = row[f];
      input.setAttribute('aria-label', `${SHORT[f]} of row ${i + 1}`);
      td.append(input);
      tr.append(td);
    });

    tr.append(el('td', 'col-score'));
    const x = el('td', 'col-x');
    const remove = el('button', 'icon-btn', '×');
    remove.type = 'button';
    remove.dataset.remove = String(i);
    remove.setAttribute('aria-label', `Remove row ${i + 1}`);
    x.append(remove);
    tr.append(x);
    tbody.append(tr);
  });
  table.append(thead, tbody);
  $('add-row').disabled = rows().length >= MAX_ROWS;
}

// Recomputes every row's score and the ranked list without rebuilding the table (keeps focus while typing).
function update() {
  const m = method();
  const valid = [];
  const problems = [];
  document.querySelectorAll('#items tbody tr').forEach((tr, i) => {
    const row = rows()[i];
    const cell = tr.querySelector('.col-score');
    if (isBlank(row)) {
      cell.textContent = '';
      return;
    }
    try {
      const item = scoreRaw(row);
      valid.push(item);
      cell.textContent = fmt(item.score);
    } catch (e) {
      cell.textContent = '—';
      problems.push(`Row ${i + 1}${row.name.trim() ? ` (${row.name.trim()})` : ''}: ${e.message}`);
    }
  });

  const errs = $('row-errors');
  errs.replaceChildren(...problems.map((p) => el('li', '', p)));
  errs.hidden = problems.length === 0;

  const list = $('ranking');
  const ranked = rankItems(valid);
  list.replaceChildren();
  $('export-bar').hidden = ranked.length === 0;
  $('rank-hint').textContent = ranked.length === 0
    ? 'Fill in at least one complete row to see the ranking.'
    : ranked.length === 1 ? 'Add more rows to compare ideas against each other.' : '';
  const top = ranked.length ? ranked[0].score : 0;
  ranked.forEach((r) => {
    const li = el('li', 'rank-item');
    const badge = el('span', 'rank-badge', String(r.rank));
    const body = el('div', 'rank-body');
    const line = el('div', 'rank-line');
    line.append(el('strong', '', r.name), el('span', 'rank-score', `${fmt(r.score)} ${m.toUpperCase()}`));
    const bar = el('div', 'rank-bar');
    const fill = el('span');
    fill.style.width = `${top > 0 ? Math.max(2, (r.score / top) * 100) : 0}%`;
    bar.append(fill);
    body.append(line, bar);
    li.append(badge, body);
    list.append(li);
  });
  state.ranked = ranked;
}

function switchMethod(next) {
  state.method = next;
  document.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.method === next)));
  $('method-help').textContent = next === 'rice'
    ? 'RICE score = Reach × Impact × Confidence ÷ Effort. The higher, the more value per unit of effort.'
    : 'ICE score = Impact × Confidence × Ease, each scored from 1 (low) to 10 (high), so the maximum is 1000.';
  $('paste-format').textContent = next === 'rice' ? 'name, reach, impact, confidence, effort' : 'name, impact, confidence, ease';
  $('import-status').replaceChildren();
  buildTable();
  update();
}

document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => switchMethod(t.dataset.method)));

$('items').addEventListener('input', (e) => {
  const k = e.target.dataset.k;
  if (!k) return;
  track();
  rows()[Number(e.target.closest('tr').dataset.i)][k] = e.target.value;
  update();
});

$('items').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  const i = Number(btn.dataset.remove);
  rows().splice(i, 1);
  buildTable();
  update();
  const next = document.querySelector(`#items tbody tr:nth-child(${Math.min(i + 1, rows().length)}) input`);
  (next || $('add-row')).focus();
});

$('add-row').addEventListener('click', () => {
  track();
  const blank = { name: '' };
  FIELDS[method()].forEach((f) => { blank[f] = method() === 'rice' && f === 'impact' ? '1' : ''; });
  rows().push(blank);
  buildTable();
  update();
  const last = document.querySelector('#items tbody tr:last-child input');
  if (last) last.focus();
});

$('reset').addEventListener('click', () => {
  state.rows[method()] = clone(EXAMPLES[method()]);
  buildTable();
  update();
});

$('clear').addEventListener('click', () => {
  state.rows[method()] = [];
  $('add-row').click();
});

$('import').addEventListener('click', () => {
  const m = method();
  const { rows: parsed, errors } = parsePasted($('paste').value, m);
  const status = $('import-status');
  status.replaceChildren();
  if (parsed.length === 0) {
    status.append(el('li', '', errors.length ? 'No rows imported.' : 'Paste some rows first.'), ...errors.map((x) => el('li', '', x)));
    return;
  }
  track();
  const capped = parsed.slice(0, MAX_ROWS);
  state.rows[m] = capped.map((r) => {
    const raw = { name: r.name === 'Untitled' ? '' : r.name };
    FIELDS[m].forEach((f) => { raw[f] = String(r[f]); });
    return raw;
  });
  buildTable();
  update();
  status.append(el('li', '', `Imported ${capped.length} row${capped.length === 1 ? '' : 's'}${parsed.length > MAX_ROWS ? ` (limited to ${MAX_ROWS})` : ''}.`), ...errors.map((x) => el('li', '', x)));
});

function csvText() { return toCsv(state.ranked, method()); }

$('download').addEventListener('click', () => {
  track();
  const blob = new Blob(['﻿' + csvText()], { type: 'text/csv;charset=utf-8' });
  const a = el('a');
  a.href = URL.createObjectURL(blob);
  a.download = `prioritization-${method()}.csv`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

$('copy').addEventListener('click', async () => {
  const msg = $('export-status');
  try {
    await navigator.clipboard.writeText(csvText());
    msg.textContent = 'Copied. Paste it into a spreadsheet.';
  } catch {
    msg.textContent = 'Copying was blocked by your browser. Use Download CSV instead.';
  }
});

$('year').textContent = new Date().getFullYear();
const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

switchMethod('rice');
