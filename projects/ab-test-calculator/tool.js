import { sampleSizePerVariant, compareProportions, minDetectableEffect } from './stats.js';

const $ = (id) => document.getElementById(id);
const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
const pct = (v, d = 2) => `${(v * 100).toFixed(d)}%`;
const signedPct = (v, d = 1) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(d)}%`;
const signedPp = (v, d = 2) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(d)} pp`;
const fmtP = (p) => (p < 0.0001 ? '< 0.0001' : p.toFixed(4));
const chance = (p) => (p < 0.0001 ? 'less than 0.01% of the time' : `${(p * 100).toFixed(p < 0.01 ? 2 : 1)}% of the time`);
const MAX_SHOWN = 10_000_000;

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

const metric = (value, label) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
const verdict = (kind, title, paragraphs) =>
  `<div class="verdict ${kind}"><strong class="title">${title}</strong>${paragraphs.map((p) => `<p>${p}</p>`).join('')}</div>`;
const notes = (items) => (items.length ? `<ul class="notes">${items.map((n) => `<li>${n}</li>`).join('')}</ul>` : '');
const confidence = () => Number($('confidence').value);
const confLabel = () => `${Math.round(confidence() * 100)}%`;

const used = new Set();
function track(mode) {
  if (used.has(mode) || typeof window.gtag !== 'function') return;
  used.add(mode);
  window.gtag('event', 'tool_used', { tool: 'ab-test-calculator', mode });
}

// --- plan mode -----------------------------------------------------------------------------

function renderPlan() {
  const out = $('plan-results');
  const baseline = parseDecimal($('plan-baseline').value);
  const mde = parseDecimal($('plan-mde').value);
  const variants = parseInteger($('plan-variants').value);
  const trafficRaw = $('plan-traffic').value.trim();
  const traffic = trafficRaw === '' ? null : parseInteger(trafficRaw);
  const relative = $('plan-mde-type').value === 'relative';

  let bad = false;
  bad = setError('plan-baseline', !(baseline > 0 && baseline < 100) ? 'Enter a rate above 0 and below 100.' : '') || bad;
  bad = setError('plan-mde', !(mde > 0) ? 'Enter a lift greater than 0.' : '') || bad;
  bad = setError('plan-variants', !(variants >= 2 && variants <= 10) ? 'Enter a whole number from 2 to 10.' : '') || bad;
  bad = setError('plan-traffic', traffic !== null && !(traffic >= 1) ? 'Enter a whole number of visitors per day, or leave empty.' : '') || bad;

  let p1;
  let p2;
  if (!bad) {
    p1 = baseline / 100;
    p2 = relative ? p1 * (1 + mde / 100) : p1 + mde / 100;
    if (!(p2 < 1)) bad = setError('plan-mde', 'This lift would push the rate to 100% or more. Use a smaller lift.');
  }
  if (bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the required sample size.</p>';
    return;
  }

  const conf = confidence();
  const power = Number($('plan-power').value);
  const sides = Number($('plan-sides').value);
  const n = sampleSizePerVariant({ p1, p2, confidence: conf, power, sides });
  const total = n * variants;
  const days = traffic ? Math.ceil(total / traffic) : null;

  const items = [];
  if (n > MAX_SHOWN) items.push('This is a very large sample. Consider a larger minimum lift, or a metric with a higher baseline rate.');
  if (days !== null && days < 7) items.push(`The test would reach its sample in under a week. Run it for at least 7 days anyway so every weekday is represented.`);
  if (days !== null && days >= 7) items.push('Round the duration up to whole weeks so each weekday is represented equally.');
  if (variants > 2) items.push('Testing more than two variants raises the chance of a false positive. This calculator does not adjust for it: treat a lone winner among many variants with caution.');
  items.push('Decide this sample size in advance and read the result once it is reached. Stopping at the first significant reading inflates false positives.');
  if (sides === 1) items.push('A one-sided test cannot detect that the variant is worse than control. Use it only if a decrease would lead to the same decision as no change.');

  const shown = n > MAX_SHOWN ? 'more than 10 million' : fmtInt(n);
  out.innerHTML =
    '<h2>Required sample size</h2>' +
    `<div class="metrics">${metric(shown, 'visitors needed per variant')}${metric(n * variants > MAX_SHOWN ? 'more than 10 million' : fmtInt(total), `visitors in total (${variants} variants)`)}` +
    `${metric(`${pct(p1)} → ${pct(p2)}`, `${relative ? `relative lift of +${mde}%` : `absolute lift of +${mde} pp`} (${signedPp(p2 - p1)})`)}` +
    `${days !== null ? metric(`${fmtInt(days)} day${days === 1 ? '' : 's'}`, `estimated duration at ${fmtInt(traffic)} visitors/day`) : ''}</div>` +
    verdict('', 'In plain English', [
      `To detect a lift from ${pct(p1)} to ${pct(p2)} with ${confLabel()} confidence and ${Math.round(power * 100)}% power, send ${n > MAX_SHOWN ? 'more than <strong>10 million</strong>' : `about <strong>${shown}</strong>`} visitors to each variant. ` +
        `If the lift is at least that large, you would detect it about ${Math.round(power * 10)} times out of 10; if there is no real difference, you would wrongly declare a winner about ${Math.round((1 - conf) * 100)} time${Math.round((1 - conf) * 100) === 1 ? '' : 's'} in 100.`,
    ]) +
    notes(items);
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
  bad = setError('check-x1', Number.isNaN(x1) ? 'Enter a whole number of conversions (0 or more).' : x1 > n1 ? 'Conversions cannot exceed visitors.' : '') || bad;
  bad = setError('check-x2', Number.isNaN(x2) ? 'Enter a whole number of conversions (0 or more).' : x2 > n2 ? 'Conversions cannot exceed visitors.' : '') || bad;
  if (bad) {
    out.innerHTML = '<p class="empty-state">Fix the highlighted fields to see the analysis.</p>';
    return;
  }

  if (x1 + x2 === 0) {
    out.innerHTML = '<h2>Result</h2>' + verdict('is-warn', 'No conversions recorded', ['Neither group has any conversions yet, so there is nothing to compare and no meaningful interval can be computed. Enter your conversion counts once the test has collected some.']);
    return;
  }

  const conf = confidence();
  const cl = confLabel();
  const r = compareProportions({ n1, x1, n2, x2, confidence: conf });
  const rel = r.relLift !== null;
  const ciBetween = rel
    ? `${signedPct(r.relLow)} and ${signedPct(r.relHigh)} relative (${signedPp(r.diffLow)} and ${signedPp(r.diffHigh)})`
    : `${signedPp(r.diffLow)} and ${signedPp(r.diffHigh)}`;
  const ciRange = rel
    ? `${signedPct(r.relLow)} to ${signedPct(r.relHigh)} relative (${signedPp(r.diffLow)} to ${signedPp(r.diffHigh)})`
    : `${signedPp(r.diffLow)} to ${signedPp(r.diffHigh)}`;

  const paragraphs = [];
  let kind;
  let title;
  const gap = `Control converts at ${pct(r.p1)} and the variant at ${pct(r.p2)} (${rel ? `${signedPct(r.relLift)} relative, ` : ''}${signedPp(r.diff)}).`;

  if (r.significant && r.diff > 0) {
    kind = 'is-good';
    title = `Statistically significant at ${cl} confidence: the variant is better`;
    paragraphs.push(`${gap} If the two versions were truly identical, a gap this large would occur ${chance(r.pValue)} (p-value ${fmtP(r.pValue)}), which is below your ${Math.round((1 - conf) * 100)}% threshold.`);
    paragraphs.push(`With ${cl} confidence, the true lift is between <strong>${ciBetween}</strong>.`);
    const lowerTooSmall = rel ? r.relLow < 0.2 * r.relLift : r.diffLow < 0.2 * r.diff;
    if (lowerTooSmall) {
      kind = 'is-warn';
      paragraphs.push('The interval is wide. The variant probably helps, but the true lift could be much smaller than the observed one. More data would narrow it.');
    }
  } else if (r.significant) {
    kind = 'is-bad';
    title = `Statistically significant at ${cl} confidence: the variant is worse`;
    paragraphs.push(`${gap} If the two versions were truly identical, a gap this large would occur ${chance(r.pValue)} (p-value ${fmtP(r.pValue)}).`);
    paragraphs.push(`With ${cl} confidence, the true change is between <strong>${ciBetween}</strong>.`);
  } else {
    kind = 'is-warn';
    title = `Not enough evidence of a difference at ${cl} confidence`;
    paragraphs.push(`${gap} A gap this large would occur ${chance(r.pValue)} (p-value ${fmtP(r.pValue)}) even if the versions were identical, which is above your ${Math.round((1 - conf) * 100)}% threshold.`);
    paragraphs.push(`With ${cl} confidence, the true change could be anywhere from <strong>${ciRange}</strong>. That is not the same as "no difference": the test may simply be too small to tell.`);
    if (r.p1 > 0 && r.p1 < 1 && r.p2 > 0 && r.p2 < 1 && r.p1 !== r.p2) {
      const needed = sampleSizePerVariant({ p1: r.p1, p2: r.p2, confidence: conf, power: 0.8, sides: 2 });
      if (needed > Math.min(n1, n2)) {
        paragraphs.push(needed > MAX_SHOWN
          ? 'If the observed gap were real, it would take over 10 million visitors per variant to confirm it: it is likely too small to be worth testing.'
          : `If the observed gap were real, about <strong>${fmtInt(needed)}</strong> visitors per variant would be needed to confirm it with 80% power (you have ${fmtInt(n1)} and ${fmtInt(n2)}).`);
      }
    }
  }

  let mdeText = '';
  if (r.p1 > 0 && r.p1 < 1) {
    const mde = minDetectableEffect({ n1, n2, p1: r.p1, confidence: conf });
    mdeText = `With these sample sizes, the smallest lift this test could reliably detect (80% power) is about ${(mde * 100).toFixed(2)} pp (${signedPct(mde / r.p1, 0).replace('+', '')} relative). Smaller real effects would probably go unnoticed.`;
  }

  const items = [];
  const minConv = Math.min(x1, x2);
  if (minConv < 100) items.push(`Fewer than 100 conversions in a group (${fmtInt(minConv)}): results this small are fragile, and a few more conversions can flip the verdict.`);
  if ([x1, n1 - x1, x2, n2 - x2].some((v) => v < 10)) items.push('A group has fewer than 10 conversions or non-conversions: the normal approximation used here is unreliable. Treat the result as rough.');
  if (mdeText) items.push(mdeText);
  items.push('This assumes you fixed the sample size in advance. If you checked the result repeatedly and stopped when it looked good, the real false-positive rate is higher than stated.');
  items.push('Testing more than one variant or metric? Each extra comparison raises the chance of a false positive. This calculator compares one variant to one control.');

  out.innerHTML =
    '<h2>Result</h2>' +
    `<div class="metrics">${metric(pct(r.p1), 'control conversion rate')}${metric(pct(r.p2), 'variant conversion rate')}` +
    `${metric(rel ? signedPct(r.relLift) : 'n/a', 'relative lift')}${metric(signedPp(r.diff), 'absolute lift')}` +
    `${metric(fmtP(r.pValue), 'p-value (two-sided)')}` +
    `${metric(`${signedPp(r.diffLow)} to ${signedPp(r.diffHigh)}`, `${cl} confidence interval (absolute)`)}</div>` +
    verdict(kind, title, paragraphs) +
    notes(items);
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
$('plan-form').addEventListener('submit', (e) => e.preventDefault());
$('check-form').addEventListener('input', () => { track('check'); renderCheck(); });
$('check-form').addEventListener('submit', (e) => e.preventDefault());
$('confidence').addEventListener('change', () => (($('panel-plan').hidden ? renderCheck : renderPlan)()));
$('plan-power').addEventListener('change', renderPlan);
$('plan-sides').addEventListener('change', renderPlan);
$('plan-mde-type').addEventListener('change', renderPlan);

$('year').textContent = new Date().getFullYear();

const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

renderPlan();
