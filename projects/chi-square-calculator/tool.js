import { chiSquareTest } from './stats.js';

const $ = (id) => document.getElementById(id);
const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
const fmtChi = (x) => (x < 1000 ? x.toFixed(3) : x.toFixed(1));
const fmtP = (p) => (p < 0.0001 ? '< 0.0001' : p.toFixed(4));
const pct = (v, d = 1) => `${(v * 100).toFixed(d)}%`;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const MAX_GROUPS = 8;
const STAND_OUT = 1.96;

// The p-value said in everyday words.
function luck(p) {
  if (p >= 0.995) return 'almost every time';
  if (p >= 0.02) return `about ${plural(Math.round(p * 100), 'time')} in 100`;
  if (p >= 0.0005) return `about ${Math.round(p * 1000)} in 1,000`;
  return 'far fewer than 1 time in 1,000';
}

function parseInteger(raw) {
  const s = String(raw).trim().replace(/[\s,_]/g, '');
  return /^\d+$/.test(s) ? Number(s) : NaN;
}

const STRENGTH = {
  negligible: ['very small', 'The groups behave almost identically. The gap may be real, but it hardly matters in practice.'],
  small: ['small', 'A real but modest difference. Worth knowing, unlikely to change your plans on its own.'],
  medium: ['moderate', 'A difference you would notice in practice.'],
  large: ['strong', 'The groups behave very differently.'],
};

const answer = (kind, label, headline, paragraphs) =>
  `<div class="answer is-${kind}"><span class="tag-label">${label}</span><p class="headline">${headline}</p>${paragraphs.map((p) => `<p>${p}</p>`).join('')}</div>`;
const list = (items, cls = 'todo-list') => `<ul class="${cls}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const block = (title, body) => `<div class="result-block"><h3>${title}</h3>${body}</div>`;
const notes = (items) => (items.length ? `<ul class="notes">${items.map((n) => `<li>${n}</li>`).join('')}</ul>` : '');
const confidence = () => Number($('confidence').value);

const used = new Set();
function track(mode) {
  if (used.has(mode) || typeof window.gtag !== 'function') return;
  used.add(mode);
  window.gtag('event', 'tool_used', { tool: 'chi-square-calculator', mode });
}

// --- shared result rendering ---------------------------------------------------------------

function technicalDetails(t, rowLabels, colLabels) {
  const head = colLabels.map((l) => `<th scope="col">${esc(l)}</th>`).join('');
  const rows = t.expected.map((row, i) =>
    `<tr><th scope="row">${esc(rowLabels[i])}</th>${row.map((v) => `<td class="${v < 5 ? 'low' : ''}">${v.toFixed(1)}</td>`).join('')}</tr>`).join('');
  return '<details class="technical"><summary>Technical details (for analysts)</summary><div class="inner">' +
    '<div class="table-scroll"><table class="obs-table"><tbody>' +
    `<tr><td>χ² statistic</td><td>${fmtChi(t.chi2)}</td></tr>` +
    `<tr><td>Degrees of freedom</td><td>${t.df}</td></tr>` +
    `<tr><td>p-value</td><td>${fmtP(t.pValue)}</td></tr>` +
    `<tr><td>Cramér's V</td><td>${t.cramersV.toFixed(3)}</td></tr>` +
    `<tr><td>Observations</td><td>${fmtInt(t.n)}</td></tr>` +
    (t.yatesApplied ? '<tr><td>Continuity correction</td><td>Yates applied</td></tr>' : '') +
    '</tbody></table></div>' +
    `<div class="table-scroll" style="margin-top:14px;"><table class="obs-table"><caption>Expected counts if all groups behaved the same (highlighted: below 5)</caption><thead><tr><th scope="col"></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>` +
    '</div></details>';
}

function friendlyError(e) {
  return e instanceof RangeError && /zero/.test(e.message)
    ? 'There is nothing to compare: a row or column adds up to zero (for example nobody converted, or everybody did). Check your numbers.'
    : 'These numbers cannot be analysed. Check that every number is a whole number of 0 or more.';
}

// Verdict, luck sentence and strength: shared by both modes.
function verdictBlocks(t, opts) {
  const conf = confidence();
  const cl = `${Math.round(conf * 100)}%`;
  const alpha = Math.round((1 - conf) * 100);
  const sig = t.pValue < 1 - conf;
  const [strength, strengthText] = STRENGTH[t.effectLabel];
  const luckLine = `If all groups really behaved the same, differences this big would happen by pure luck ${luck(t.pValue)}. You asked to be ${cl} sure, so that chance needs to be below ${alpha} in 100.`;
  const head = sig
    ? answer('good', 'Real difference', opts.sigHeadline, [opts.summary, luckLine])
    : answer('warn', 'No clear difference', opts.noHeadline, [opts.summary, luckLine + ' It is above that line, so the differences could easily be luck.']);
  const strengthBlock = opts.sizeHtml ?? block('How big is the difference?',
    `<p>The difference is <strong>${strength}</strong>. ${strengthText}</p>` +
    (sig && t.effectLabel === 'negligible' ? '<p>A very small difference can still be statistically real when you have a lot of people. Ask yourself whether it is worth acting on.</p>' : ''));
  return { sig, head, strengthBlock };
}

function smallGroupNote(t) {
  return t.cellsBelow5 > 0
    ? `${t.cellsBelow5 === 1 ? 'One count is' : `${t.cellsBelow5} counts are`} too small for this test to be fully reliable (the test likes at least 5 expected in every cell, see the technical details). Collect more data, merge small groups, or ask an analyst about an exact test.`
    : null;
}

// --- "compare groups" mode -----------------------------------------------------------------

const groups = [
  { name: 'Email', n: '10000', x: '420' },
  { name: 'Paid search', n: '10000', x: '510' },
  { name: 'Social', n: '10000', x: '300' },
  { name: 'Organic', n: '10000', x: '480' },
];

function buildGroups() {
  $('groups-grid').innerHTML =
    '<div class="groups__head"><span>Group name</span><span>People in the group</span><span>Of whom converted</span><span></span></div>' +
    groups.map((g, i) =>
      `<div class="groups__row"><input id="g-name-${i}" value="${esc(g.name)}" aria-label="Name of group ${i + 1}" autocomplete="off" placeholder="Group ${i + 1}">` +
      `<input id="g-n-${i}" type="text" inputmode="numeric" value="${esc(g.n)}" aria-label="People in group ${i + 1}" placeholder="People" autocomplete="off">` +
      `<input id="g-x-${i}" type="text" inputmode="numeric" value="${esc(g.x)}" aria-label="Converted in group ${i + 1}" placeholder="Converted" autocomplete="off">` +
      `<button type="button" class="del-btn" data-del="${i}" aria-label="Remove group ${i + 1}" ${groups.length <= 2 ? 'disabled' : ''}>×</button></div>`).join('');
  $('add-group').disabled = groups.length >= MAX_GROUPS;
}

function renderGroups() {
  const out = $('groups-results');
  const table = [];
  const labels = [];
  let bad = false;
  groups.forEach((g, i) => {
    const n = parseInteger(g.n);
    const x = parseInteger(g.x);
    const nBad = !(n >= 1);
    const xBad = Number.isNaN(x) || x > n;
    $(`g-n-${i}`).setAttribute('aria-invalid', String(nBad));
    $(`g-x-${i}`).setAttribute('aria-invalid', String(xBad));
    bad = bad || nBad || xBad;
    table.push([x, n - x]);
    labels.push(g.name.trim() || `Group ${i + 1}`);
  });
  $('groups-error').textContent = bad ? 'Each group needs a whole number of people (1 or more), and the number who converted cannot be more than that.' : '';
  if (bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted numbers to see the verdict.</p>';
    return;
  }

  let t;
  try {
    t = chiSquareTest(table, { yates: $('yates').checked });
  } catch (e) {
    out.innerHTML = `<p class="empty-state">${friendlyError(e)}</p>`;
    return;
  }

  const rates = table.map((row, i) => row[0] / t.rowTotals[i]);
  const hi = rates.indexOf(Math.max(...rates));
  const lo = rates.indexOf(Math.min(...rates));
  const overall = t.colTotals[0] / t.n;
  const summary = `Conversion rates go from <strong>${pct(rates[lo])}</strong> (${esc(labels[lo])}) to <strong>${pct(rates[hi])}</strong> (${esc(labels[hi])}), against ${pct(overall)} overall.`;
  const twoGroups = groups.length === 2;
  const gapPp = (rates[hi] - rates[lo]) * 100;
  const isSig = t.pValue < 1 - confidence();
  let sizeBody;
  if (!isSig) {
    sizeBody = `<p>The gap you see, ${gapPp.toFixed(1)} percentage points between the best and the weakest group, is within what luck can produce, so it should not guide decisions.</p>`;
  } else if (rates[lo] === 0) {
    sizeBody = `<p>The weakest group (${esc(labels[lo])}) has no conversions at all, against ${pct(rates[hi])} for ${esc(labels[hi])}.</p>`;
  } else {
    const ratio = rates[hi] / rates[lo];
    const qualifier = ratio >= 1.5 ? 'That is a big gap in practice.' : ratio >= 1.2 ? 'That is a noticeable gap.' : 'That is a modest gap: check that it is worth acting on.';
    sizeBody = `<p>The best group (<strong>${esc(labels[hi])}</strong>, ${pct(rates[hi])}) converts <strong>${ratio.toFixed(1)} times as often</strong> as the weakest (<strong>${esc(labels[lo])}</strong>, ${pct(rates[lo])}): a gap of ${gapPp.toFixed(1)} percentage points. ${qualifier}</p>` +
      '<p class="hint">Rule of thumb only: what counts as big depends on your business and what a conversion is worth.</p>';
  }
  const { sig, head, strengthBlock } = verdictBlocks(t, {
    sizeHtml: block('How big is the gap?', sizeBody),
    summary,
    sigHeadline: twoGroups ? 'The two groups really do behave differently' : 'The groups really do behave differently',
    noHeadline: twoGroups ? 'The two groups cannot be told apart' : 'The groups cannot be told apart',
  });

  // Who stands out (only meaningful when the overall result is significant)
  const stand = labels.map((name, i) => ({ name, i, z: t.adjResiduals[i][0] }));
  const up = sig ? stand.filter((s) => s.z > STAND_OUT).map((s) => s.i) : [];
  const down = sig ? stand.filter((s) => s.z < -STAND_OUT).map((s) => s.i) : [];
  const max = Math.max(...rates) * 1.12 || 1;
  const bars = `<ul class="bars">${labels.map((name, i) =>
    `<li class="${up.includes(i) ? 'is-up' : down.includes(i) ? 'is-down' : ''}"><span>${esc(name)}</span>` +
    `<span class="bars__track"><span class="bars__fill" style="display:block;width:${((rates[i] / max) * 100).toFixed(1)}%"></span></span>` +
    `<span class="bars__val">${pct(rates[i])}</span><span class="bars__note">${fmtInt(table[i][0])} of ${fmtInt(t.rowTotals[i])} converted</span></li>`).join('')}</ul>`;
  let html = '<h2>Your answer</h2>' + head + block('Conversion rate by group', bars + `<p class="hint">Green: converts more than the average. Red: converts less.${sig ? '' : ' Nothing is coloured because the differences are within what luck can explain.'}</p>`);

  if (sig && !twoGroups) {
    let standBody;
    if (up.length || down.length) {
      const items = [
        ...up.map((i) => `<strong>${esc(labels[i])}</strong> converts more than the average of all groups (${pct(rates[i])} against ${pct(overall)}).`),
        ...down.map((i) => `<strong>${esc(labels[i])}</strong> converts less than the average of all groups (${pct(rates[i])} against ${pct(overall)}).`),
      ];
      standBody = list(items) + '<p class="hint">A guide, not proof: the more groups you compare, the more likely one stands out by luck alone.</p>';
    } else {
      standBody = '<p>No single group clearly stands out: the difference is spread across several groups.</p>';
    }
    html += block('Which groups stand out?', standBody);
  }
  html += strengthBlock;

  const next = sig
    ? [
        up.length ? `Learn from the groups that convert more (${up.map((i) => esc(labels[i])).join(', ')}): what is different about them?` : 'Compare the rates in the chart to see where the difference comes from.',
        down.length ? `Look into the groups that convert less (${down.map((i) => esc(labels[i])).join(', ')}): is it the offer, the audience, or the experience?` : 'Check whether the weakest group deserves a change or less budget.',
        'Remember that different groups can be different kinds of people: a higher rate is not proof that the group itself is better.',
      ]
    : [
        'Do not treat the differences between these groups as meaningful yet.',
        'If you need certainty, collect more people in each group, or compare a longer period.',
        'Or treat the groups alike and decide on cost, effort or brand fit.',
      ];
  html += block('What to do next', list(next));
  const small = smallGroupNote(t);
  if (small) html += block('Watch out', notes([small]));
  html += technicalDetails(t, labels, ['Converted', 'Did not convert']);
  out.innerHTML = html;
}

// --- advanced mode (up to 5×5) -------------------------------------------------------------

const adv = {
  rowLabels: ['Small businesses', 'Mid-size companies', 'Large enterprises', 'Segment D', 'Segment E'],
  colLabels: ['Satisfied', 'Neutral', 'Unhappy', 'Outcome 4', 'Outcome 5'],
  counts: [
    ['180', '90', '30', '', ''],
    ['150', '110', '40', '', ''],
    ['100', '120', '80', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ],
};

function buildAdvGrid() {
  const r = Number($('adv-rows').value);
  const c = Number($('adv-cols').value);
  const head = Array.from({ length: c }, (_, j) => `<th scope="col"><input class="label" id="adv-l-${j}" value="${esc(adv.colLabels[j])}" aria-label="Outcome ${j + 1} name" autocomplete="off"></th>`).join('');
  const body = Array.from({ length: r }, (_, i) =>
    `<tr><th scope="row"><input class="label" id="adv-r-${i}" value="${esc(adv.rowLabels[i])}" aria-label="Group ${i + 1} name" autocomplete="off"></th>` +
    Array.from({ length: c }, (_, j) => `<td><input id="adv-c-${i}-${j}" type="text" inputmode="numeric" value="${esc(adv.counts[i][j])}" aria-label="Number of people in group ${i + 1} with outcome ${j + 1}" autocomplete="off"></td>`).join('') +
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
      const input = $(`adv-c-${i}-${j}`);
      if (input) input.setAttribute('aria-invalid', String(Number.isNaN(v)));
      bad = bad || Number.isNaN(v);
      row.push(v);
    }
    table.push(row);
  }
  $('adv-error').textContent = bad ? 'Every cell needs a whole number of people (0 or more).' : '';
  if (bad) {
    out.innerHTML = '<p class="empty-state">Fill in every cell to see the verdict.</p>';
    return;
  }
  const rowLabels = adv.rowLabels.slice(0, r).map((l, i) => l.trim() || `Group ${i + 1}`);
  const colLabels = adv.colLabels.slice(0, c).map((l, j) => l.trim() || `Outcome ${j + 1}`);

  let t;
  try {
    t = chiSquareTest(table, { yates: $('yates').checked });
  } catch (e) {
    out.innerHTML = `<p class="empty-state">${friendlyError(e)}</p>`;
    return;
  }

  const { sig, head, strengthBlock } = verdictBlocks(t, {
    summary: `You compared ${r} groups across ${c} possible outcomes (${fmtInt(t.n)} people in total).`,
    sigHeadline: 'The groups really do differ in what they choose or do',
    noHeadline: 'No clear difference between the groups',
  });

  // Observed table with row percentages; cells that stand out are highlighted
  const headCells = colLabels.map((l) => `<th scope="col">${esc(l)}</th>`).join('') + '<th scope="col">Total</th>';
  const rows = table.map((row, i) =>
    `<tr><th scope="row">${esc(rowLabels[i])}</th>${row.map((v, j) => {
      const z = t.adjResiduals[i][j];
      const cls = sig && z > STAND_OUT ? 'up' : sig && z < -STAND_OUT ? 'down' : '';
      return `<td class="${cls}">${fmtInt(v)} <span class="hint">(${pct(v / t.rowTotals[i], 0)})</span></td>`;
    }).join('')}<td>${fmtInt(t.rowTotals[i])}</td></tr>`).join('');
  const observed = `<div class="table-scroll"><table class="obs-table"><caption>What each group did (share of the group in brackets)</caption><thead><tr><th scope="col"></th>${headCells}</tr></thead><tbody>${rows}</tbody></table></div>`;

  let html = '<h2>Your answer</h2>' + head + block('What each group did', observed + (sig ? '<p class="hint">Green cells: more people than luck would predict. Red cells: fewer.</p>' : ''));
  if (sig) {
    const cells = [];
    table.forEach((row, i) => row.forEach((_, j) => cells.push({ i, j, z: t.adjResiduals[i][j] })));
    const top = cells.filter((c2) => Math.abs(c2.z) > STAND_OUT).sort((a, b) => Math.abs(b.z) - Math.abs(a.z)).slice(0, 5);
    const body = top.length
      ? list(top.map((c2) => `<strong>${esc(rowLabels[c2.i])}</strong>: ${c2.z > 0 ? 'more' : 'fewer'} than expected chose or did “${esc(colLabels[c2.j])}” (${pct(table[c2.i][c2.j] / t.rowTotals[c2.i], 0)} of the group, against ${pct(t.colTotals[c2.j] / t.n, 0)} overall).`)) +
        '<p class="hint">A guide, not proof: the more groups and outcomes you compare, the more likely something stands out by luck alone.</p>'
      : '<p>No single cell clearly stands out: the difference is spread across the table.</p>';
    html += block('What stands out most?', body);
  }
  html += strengthBlock;
  html += block('What to do next', list(sig
    ? ['Use the green and red cells to see where the groups really differ, and think about why.', 'Remember that groups can be different kinds of people: a difference does not prove cause.']
    : ['Do not treat the differences as meaningful yet.', 'Collect more people in each group if you need certainty.']));
  const small = smallGroupNote(t);
  if (small) html += block('Watch out', notes([small]));
  html += technicalDetails(t, rowLabels, colLabels);
  out.innerHTML = html;
}

// --- wiring --------------------------------------------------------------------------------

$('groups-grid').addEventListener('input', (e) => {
  const m = /^g-(name|n|x)-(\d)$/.exec(e.target.id);
  if (!m) return;
  groups[m[2]][m[1]] = e.target.value;
  track('groups');
  renderGroups();
});
$('groups-grid').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-del]');
  if (!btn || groups.length <= 2) return;
  groups.splice(Number(btn.dataset.del), 1);
  buildGroups();
  renderGroups();
});
$('add-group').addEventListener('click', () => {
  if (groups.length >= MAX_GROUPS) return;
  groups.push({ name: '', n: '', x: '' });
  buildGroups();
  renderGroups();
  $(`g-name-${groups.length - 1}`).focus();
});

$('adv-grid').addEventListener('input', (e) => {
  let m;
  if ((m = /^adv-c-(\d)-(\d)$/.exec(e.target.id))) adv.counts[m[1]][m[2]] = e.target.value;
  else if ((m = /^adv-r-(\d)$/.exec(e.target.id))) adv.rowLabels[m[1]] = e.target.value;
  else if ((m = /^adv-l-(\d)$/.exec(e.target.id))) adv.colLabels[m[1]] = e.target.value;
  track('advanced');
  renderAdv();
});
['adv-rows', 'adv-cols'].forEach((id) => $(id).addEventListener('change', () => { buildAdvGrid(); renderAdv(); }));

function selectTab(mode) {
  const g = mode === 'groups';
  $('tab-groups').setAttribute('aria-selected', String(g));
  $('tab-adv').setAttribute('aria-selected', String(!g));
  $('panel-groups').hidden = !g;
  $('panel-adv').hidden = g;
  (g ? renderGroups : renderAdv)();
}
const tabs = [$('tab-groups'), $('tab-adv')];
tabs[0].addEventListener('click', () => selectTab('groups'));
tabs[1].addEventListener('click', () => selectTab('adv'));
tabs.forEach((tab, i) =>
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const other = tabs[(i + 1) % tabs.length];
    other.focus();
    selectTab(other === tabs[0] ? 'groups' : 'adv');
  }),
);
['confidence', 'yates'].forEach((id) => $(id).addEventListener('change', () => (($('panel-groups').hidden ? renderAdv : renderGroups)())));

$('year').textContent = new Date().getFullYear();
const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

buildGroups();
buildAdvGrid();
renderGroups();
