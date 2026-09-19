import { sampleSizePerVariant, compareProportions, minDetectableEffect } from './stats.js';

const $ = (id) => document.getElementById(id);
const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
const pct = (v, d = 2) => `${(v * 100).toFixed(d)}%`;
const signedPct = (v, d = 1) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(d)}%`;
const signedPp = (v, d = 2) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(d)} pp`;
const fmtP = (p) => (p < 0.0001 ? '< 0.0001' : p.toFixed(4));
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const MAX_SHOWN = 10_000_000;

// "About 6 times in 100": the p-value said in everyday words.
function luck(p) {
  if (p >= 0.995) return 'almost every time';
  if (p >= 0.02) return `about ${plural(Math.round(p * 100), 'time')} in 100`;
  if (p >= 0.0005) return `about ${Math.round(p * 1000)} in 1,000`;
  return 'far fewer than 1 time in 1,000';
}

function duration(days) {
  if (days < 7) return plural(days, 'day');
  const weeks = Math.round(days / 7);
  return `about ${plural(weeks, 'week')} (${fmtInt(days)} days)`;
}

// --- input parsing -------------------------------------------------------------------------

function parseDecimal(raw) {
  const s = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (s === '' || !/^\d*\.?\d+$|^\d+\.$/.test(s)) return NaN;
  return Number(s);
}

function parseInteger(raw) {
  const s = raw.trim().replace(/[\s,_]/g, '');
  return /^\d+$/.test(s) ? Number(s) : NaN;
}

function setError(id, message) {
  const input = $(id);
  $(`${id}-error`).textContent = message || '';
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  return Boolean(message);
}

// --- rendering helpers ---------------------------------------------------------------------

const answer = (kind, label, headline, paragraphs) =>
  `<div class="answer is-${kind}"><span class="tag-label">${label}</span><p class="headline">${headline}</p>${paragraphs.map((p) => `<p>${p}</p>`).join('')}</div>`;
const list = (items, cls = 'todo-list') => `<ul class="${cls}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const block = (title, body) => `<div class="result-block"><h3>${title}</h3>${body}</div>`;
const notes = (items) => (items.length ? `<ul class="notes">${items.map((n) => `<li>${n}</li>`).join('')}</ul>` : '');
const confidence = () => Number($('confidence').value);
const confLabel = () => `${Math.round(confidence() * 100)}%`;

// Horizontal bar showing a likely range around zero: Worse ← 0 → Better.
function rangeBar({ low, high, point, format }) {
  const m = Math.max(Math.abs(low), Math.abs(high), 1e-9) * 1.25;
  const pos = (v) => ((v + m) / (2 * m)) * 100;
  const kind = low > 0 ? 'is-good' : high < 0 ? 'is-bad' : '';
  return `<div class="range" role="img" aria-label="Likely range of the real improvement: ${format(low)} to ${format(high)}. Best guess ${format(point)}.">` +
    '<div class="range__track"><div class="range__zero"></div>' +
    `<div class="range__bar ${kind}" style="left:${pos(low).toFixed(1)}%;width:${(pos(high) - pos(low)).toFixed(1)}%"></div>` +
    `<div class="range__dot" style="left:${pos(point).toFixed(1)}%"></div></div>` +
    `<div class="range__labels"><span>Worse (${format(-m)})</span><span><strong>No change</strong></span><span>Better (${format(m)})</span></div></div>`;
}

const used = new Set();
function track(mode) {
  if (used.has(mode) || typeof window.gtag !== 'function') return;
  used.add(mode);
  window.gtag('event', 'tool_used', { tool: 'ab-test-calculator', mode });
}

// --- plan mode -----------------------------------------------------------------------------

function renderPlan() {
  const out = $('plan-results');
  const preset = $('plan-mde-preset').value;
  $('plan-mde-custom-wrap').hidden = preset !== 'custom';

  const baseline = parseDecimal($('plan-baseline').value);
  const mde = preset === 'custom' ? parseDecimal($('plan-mde-custom').value) : Number(preset);
  const variants = parseInteger($('plan-variants').value);
  const trafficRaw = $('plan-traffic').value.trim();
  const traffic = trafficRaw === '' ? null : parseInteger(trafficRaw);

  let bad = false;
  bad = setError('plan-baseline', !(baseline > 0 && baseline < 100) ? 'Enter a rate above 0 and below 100, for example 5.' : '') || bad;
  if (preset === 'custom') bad = setError('plan-mde-custom', !(mde > 0) ? 'Enter an improvement above 0, for example 15.' : '') || bad;
  else setError('plan-mde-custom', '');
  bad = setError('plan-variants', !(variants >= 2 && variants <= 10) ? 'Enter a whole number from 2 to 10.' : '') || bad;
  bad = setError('plan-traffic', traffic !== null && !(traffic >= 1) ? 'Enter a whole number of visitors per day, or leave empty.' : '') || bad;

  let p1;
  let p2;
  if (!bad) {
    p1 = baseline / 100;
    p2 = p1 * (1 + mde / 100);
    if (!(p2 < 1)) bad = setError(preset === 'custom' ? 'plan-mde-custom' : 'plan-baseline', 'This improvement would push the rate to 100% or more. Choose a smaller improvement or a lower starting rate.');
  }
  const preview = $('plan-mde-preview');
  if (bad) {
    preview.textContent = '';
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see how many visitors you need.</p>';
    return;
  }
  preview.textContent = `That means going from ${pct(p1, 1)} to ${pct(p2, 1)}: ${((p2 - p1) * 1000).toFixed(1).replace(/\.0$/, '')} more conversions for every 1,000 visitors.`;

  const conf = confidence();
  const power = Number($('plan-power').value);
  const sides = Number($('plan-sides').value);
  const n = sampleSizePerVariant({ p1, p2, confidence: conf, power, sides });
  const total = n * variants;
  const days = traffic ? Math.ceil(total / traffic) : null;
  const huge = n > MAX_SHOWN;
  const nText = huge ? 'more than 10 million' : fmtInt(n);

  const headline = `You need about <span class="big">${nText}</span> visitors per version`;
  const extra = [`That is ${total > MAX_SHOWN ? 'more than 10 million' : fmtInt(total)} visitors in total for ${variants === 2 ? 'A and B together' : `all ${variants} versions`}.` +
    (days !== null ? ` At ${fmtInt(traffic)} visitors a day, expect ${duration(days)}.` : ' Add your daily visitors above to see how long that takes.')];
  let html = '<h2>Your answer</h2>' + answer('neutral', 'Visitors needed', headline, extra);

  if (days !== null) {
    const weeks = days / 7;
    if (weeks <= 4) {
      html += answer('good', 'Realistic', `That is a realistic test: ${duration(days)}`, [days < 7 ? 'You would reach that number in under a week, but run the test for at least 7 days anyway so every day of the week counts equally, and do not stop early.' : 'Plan to run it for whole weeks, so every day of the week is represented equally, and do not stop early.']);
    } else if (weeks <= 8) {
      html += answer('warn', 'Long but possible', `That is a long test: ${duration(days)}`, ['It can work, but a lot can change in two months (seasons, promotions). Consider a bigger change to test, so you need fewer visitors.']);
    } else {
      html += answer('bad', 'Probably too long', `That is too long to be practical: ${duration(days)}`, [
        'You have three ways out:',
        list([
          'Test a <strong>bigger change</strong>. Big improvements need far fewer visitors to spot (see the table below).',
          'Test on a page with <strong>more traffic</strong>, or on a step earlier in the journey (for example clicks instead of purchases).',
          'Accept a <strong>lower level of certainty</strong> (the "How sure" setting above), knowing you take a bit more risk.',
        ]),
      ]);
    }
  }

  // How the answer changes with the size of the improvement
  const rows = [5, 10, 20, 50].map((x) => {
    const q2 = p1 * (1 + x / 100);
    if (!(q2 < 1)) return `<tr><td>+${x}%</td><td colspan="${traffic ? 2 : 1}">not possible from ${pct(p1, 1)}</td></tr>`;
    const q = sampleSizePerVariant({ p1, p2: q2, confidence: conf, power, sides });
    const qDays = traffic ? Math.ceil((q * variants) / traffic) : null;
    return `<tr><td>+${x}% (${pct(p1, 1)} → ${pct(q2, 1)})</td><td>${q > MAX_SHOWN ? 'over 10 million' : fmtInt(q)}</td>` +
      (traffic ? `<td>${duration(qDays)}</td>` : '') + '</tr>';
  }).join('');
  html += block('How the answer changes with the size of the improvement',
    '<p>The smaller the improvement you want to detect, the more visitors you need. The same test with your settings:</p>' +
    `<div class="table-scroll"><table class="obs-table"><thead><tr><th>Improvement to detect</th><th>Visitors per version</th>${traffic ? '<th>Estimated duration</th>' : ''}</tr></thead><tbody>${rows}</tbody></table></div>`);

  html += block('What this means in plain English',
    `<p>If B really is ${mde}% better than A (${pct(p1, 1)} becoming ${pct(p2, 1)}), a test with ${nText} visitors per version will spot it about ${Math.round(power * 10)} times out of 10. ` +
    `If there is no real difference, you would still wrongly declare a winner about ${plural(Math.round((1 - conf) * 100), 'time')} in 100.</p>`);

  const items = [
    'Write this number down <em>before</em> you launch, and stick to it. Stopping the first time B looks good is the most common way to get a false winner.',
  ];
  if (variants > 2) items.push('You are testing several versions: each extra version increases the chance that luck produces a false winner. Be more sceptical of a lone winner.');
  if (sides === 1) items.push('You chose to detect improvements only. The test will not be able to tell you that B is worse than A.');
  if (huge) items.push('This is a very large number. Try a bigger improvement or a page with more traffic.');
  html += block('Before you launch', notes(items));
  out.innerHTML = html;
}

// --- check mode ----------------------------------------------------------------------------

function renderCheck() {
  const out = $('check-results');
  const n1 = parseInteger($('check-n1').value);
  const x1 = parseInteger($('check-x1').value);
  const n2 = parseInteger($('check-n2').value);
  const x2 = parseInteger($('check-x2').value);

  let bad = false;
  bad = setError('check-n1', !(n1 >= 1) ? 'Enter a whole number of visitors (1 or more).' : '') || bad;
  bad = setError('check-n2', !(n2 >= 1) ? 'Enter a whole number of visitors (1 or more).' : '') || bad;
  bad = setError('check-x1', Number.isNaN(x1) ? 'Enter a whole number of conversions (0 or more).' : x1 > n1 ? 'Conversions cannot be more than visitors.' : '') || bad;
  bad = setError('check-x2', Number.isNaN(x2) ? 'Enter a whole number of conversions (0 or more).' : x2 > n2 ? 'Conversions cannot be more than visitors.' : '') || bad;
  if (bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the verdict.</p>';
    return;
  }
  if (x1 + x2 === 0) {
    out.innerHTML = '<h2>Your answer</h2>' + answer('warn', 'Nothing to compare', 'No conversions recorded yet', ['Neither version has any conversions, so there is nothing to compare. Come back once the test has collected some.']);
    return;
  }

  const conf = confidence();
  const cl = confLabel();
  const alpha = Math.round((1 - conf) * 100);
  const r = compareProportions({ n1, x1, n2, x2, confidence: conf });
  const rel = r.relLift !== null;
  const fmt = rel ? (v) => signedPct(v) : (v) => signedPp(v);
  const [lo, hi, pt] = rel ? [r.relLow, r.relHigh, r.relLift] : [r.diffLow, r.diffHigh, r.diff];
  const gap = `B converted at <strong>${pct(r.p2)}</strong> against <strong>${pct(r.p1)}</strong> for A${rel ? `, which is ${Math.abs(r.relLift * 100).toFixed(1)}% ${r.diff >= 0 ? 'better' : 'worse'}` : ''}.`;
  const luckLine = `If A and B were really identical, a gap this big would happen by pure luck ${luck(r.pValue)}. You asked to be ${cl} sure, so that chance needs to be below ${alpha} in 100.`;

  let html = '<h2>Your answer</h2>';
  let next;
  if (r.significant && r.diff > 0) {
    html += answer('good', 'Winner: B', 'B really is better than A', [gap, luckLine]);
    next = ['Roll out B to all your visitors.', 'Keep an eye on the numbers for a few weeks: some gains fade once a change is live for everyone.'];
    const weak = rel ? r.relLow < 0.2 * r.relLift : r.diffLow < 0.2 * r.diff;
    if (weak) next.push(`The real gain could be much smaller than what you measured (as low as ${fmt(lo)}). Weigh it against the effort of keeping B.`);
    next.push('Write down what you learned and choose the next thing to test.');
  } else if (r.significant) {
    html += answer('bad', 'Loser: B', 'B is worse than A', [gap, luckLine]);
    next = ['Keep A. Do not roll B out.', 'Try to understand why B did worse (clarity, trust, price, page speed?) and use it in your next idea.'];
  } else {
    html += answer('warn', 'No clear winner yet', 'The test cannot tell A and B apart', [gap, luckLine + ' It is above that line, so this could easily be luck.']);
    next = ['Do not declare a winner today: the data cannot separate A from B.'];
    if (r.p1 > 0 && r.p1 < 1 && r.p2 > 0 && r.p2 < 1 && r.p1 !== r.p2) {
      const needed = sampleSizePerVariant({ p1: r.p1, p2: r.p2, confidence: conf, power: 0.8, sides: 2 });
      if (needed > Math.min(n1, n2)) {
        next.push(needed > MAX_SHOWN
          ? 'If the gap you see were real, confirming it would take over 10 million visitors per version: it is too small to be worth chasing. Treat A and B as equal and pick the cheaper or simpler one.'
          : `If the gap you see were real, you would need about <strong>${fmtInt(needed)}</strong> visitors per version to confirm it (you have ${fmtInt(n1)} and ${fmtInt(n2)}). Keep the test running until then, unless you have to decide sooner.`);
      }
    }
    next.push('Or accept that any difference is small, and choose the version that is cheaper, simpler or better for your brand.');
  }

  let range = `<p>What you measured is a best guess. With ${cl} sureness, the real change from A to B is most likely between <strong>${fmt(lo)}</strong> and <strong>${fmt(hi)}</strong>${rel ? '' : ' (percentage points)'}.</p>` +
    rangeBar({ low: lo, high: hi, point: pt, format: fmt });
  if (lo <= 0 && hi >= 0) range += '<p>The range crosses zero, so B could be no better than A, or even worse. That is why there is no clear winner.</p>';
  else if (lo > 0) range += `<p>Even in the least favourable case, B is still better than A by about ${fmt(lo)}.</p>`;
  else range += `<p>Even in the most favourable case, B is still worse than A by about ${fmt(-hi)}.</p>`;
  html += block('How big is the real improvement?', range);
  html += block('What to do next', list(next));

  const warnings = [];
  if (Math.min(x1, x2) < 100) warnings.push(`One version has fewer than 100 conversions (${fmtInt(Math.min(x1, x2))}). Results this small are fragile: a few more conversions could flip the verdict.`);
  if ([x1, n1 - x1, x2, n2 - x2].some((v) => v < 10)) warnings.push('One group has fewer than 10 conversions or non-conversions. The maths used here becomes unreliable, so treat the result as rough.');
  if (warnings.length) html += block('Watch out', notes(warnings));

  html += '<details class="advanced"><summary>Before you trust this result: 6 quick checks</summary><div class="inner" style="padding:14px;">' +
    list([
      'A and B ran <strong>at the same time</strong> (not A last month and B this month).',
      'Visitors were split <strong>at random</strong>, and each person saw only one version.',
      'The test ran for <strong>full weeks</strong> (at least 7 days), so every day of the week counted equally.',
      'You did <strong>not stop early</strong> because the numbers looked good on day 3.',
      'You changed <strong>one thing</strong> between A and B (otherwise you will not know what worked).',
      'You are not hunting for a winner across <strong>many versions or many metrics</strong>: the more you look, the more likely luck fools you.',
    ], 'checklist') + '</div></details>';

  const mde = r.p1 > 0 && r.p1 < 1 ? minDetectableEffect({ n1, n2, p1: r.p1, confidence: conf }) : null;
  html += '<details class="technical"><summary>Technical details (for analysts)</summary><div class="inner"><div class="table-scroll"><table class="obs-table"><tbody>' +
    `<tr><td>Conversion rate A / B</td><td>${pct(r.p1)} / ${pct(r.p2)}</td></tr>` +
    `<tr><td>Difference (percentage points)</td><td>${signedPp(r.diff)}</td></tr>` +
    `<tr><td>Relative lift</td><td>${rel ? signedPct(r.relLift) : 'n/a (A has no conversions)'}</td></tr>` +
    `<tr><td>p-value (two-sided, pooled z-test)</td><td>${fmtP(r.pValue)}</td></tr>` +
    `<tr><td>z statistic</td><td>${r.z.toFixed(3)}</td></tr>` +
    `<tr><td>${cl} confidence interval, absolute difference</td><td>${signedPp(r.diffLow)} to ${signedPp(r.diffHigh)}</td></tr>` +
    (mde !== null ? `<tr><td>Smallest lift these sample sizes could detect (80% power)</td><td>${(mde * 100).toFixed(2)} pp (${(mde / r.p1 * 100).toFixed(0)}% relative)</td></tr>` : '') +
    '</tbody></table></div></div></details>';
  out.innerHTML = html;
}

// --- wiring --------------------------------------------------------------------------------

function selectTab(mode) {
  const plan = mode === 'plan';
  $('tab-plan').setAttribute('aria-selected', String(plan));
  $('tab-check').setAttribute('aria-selected', String(!plan));
  $('panel-plan').hidden = !plan;
  $('panel-check').hidden = plan;
  (plan ? renderPlan : renderCheck)();
}

const tabs = [$('tab-plan'), $('tab-check')];
tabs[0].addEventListener('click', () => selectTab('plan'));
tabs[1].addEventListener('click', () => selectTab('check'));
tabs.forEach((tab, i) =>
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const next = tabs[(i + 1) % tabs.length];
    next.focus();
    selectTab(next === tabs[0] ? 'plan' : 'check');
  }),
);

$('plan-form').addEventListener('input', () => { track('plan'); renderPlan(); });
$('plan-form').addEventListener('change', renderPlan);
$('plan-form').addEventListener('submit', (e) => e.preventDefault());
$('check-form').addEventListener('input', () => { track('check'); renderCheck(); });
$('check-form').addEventListener('submit', (e) => e.preventDefault());
$('confidence').addEventListener('change', () => (($('panel-plan').hidden ? renderCheck : renderPlan)()));

$('year').textContent = new Date().getFullYear();

const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

renderPlan();
