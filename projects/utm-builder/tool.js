import { buildUtmUrl, buildBulk, normalizeValue } from './calc.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const FIELDS = ['source', 'medium', 'campaign', 'term', 'content'];
let mode = 'single';

function setError(id, message) {
  const err = $(`${id}-error`);
  if (err) err.textContent = message || '';
  $(id).setAttribute('aria-invalid', message ? 'true' : 'false');
}

function fieldValues() {
  const v = { normalize: $('normalize').checked };
  for (const f of FIELDS) v[f] = $(`utm-${f}`).value;
  return v;
}

const warnList = (warnings) => (warnings.length ? `<ul class="notes">${warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : '');

let tracked = new Set();
function track(m) {
  if (tracked.has(m) || typeof window.gtag !== 'function') return;
  tracked.add(m);
  window.gtag('event', 'tool_used', { tool: 'utm-builder', mode: m });
}

function renderSingle(out) {
  const fields = fieldValues();
  const r = buildUtmUrl({ url: $('utm-url').value, ...fields });
  setError('utm-url', r.errors.url);
  for (const f of ['source', 'medium', 'campaign']) setError(`utm-${f}`, r.errors[f]);
  if (!r.url) {
    out.innerHTML = '<p class="empty-state">Fill in the highlighted fields to build your link.</p>';
    return;
  }
  const rows = FIELDS
    .map((f) => [f, normalizeValue(fields[f], fields.normalize)])
    .filter(([, v]) => v)
    .map(([f, v]) => `<tr><th scope="row">utm_${f}</th><td>${esc(v)}</td></tr>`).join('');
  out.innerHTML =
    '<h2>Your tagged link</h2>' +
    `<div class="verdict is-good"><p id="link-out" class="linkbox" data-copy="${esc(r.url)}">${esc(r.url)}</p></div>` +
    '<p><button class="btn btn-primary btn-sm" id="copy-btn" type="button">Copy link</button></p>' +
    `<div class="table-scroll"><table class="obs-table"><caption>What analytics will see</caption><tbody>${rows}</tbody></table></div>` +
    warnList(r.warnings);
}

function renderBulk(out) {
  const fields = fieldValues();
  const urlsText = $('utm-urls').value;
  const b = buildBulk({ urlsText, ...fields });
  const campaignError = ['source', 'medium', 'campaign'].map((f) => buildUtmUrl({ url: 'https://example.com/', ...fields }).errors[f]);
  ['source', 'medium', 'campaign'].forEach((f, i) => setError(`utm-${f}`, campaignError[i]));
  setError('utm-urls', b.results.length ? '' : 'Paste at least one URL, one per line.');
  if (!b.results.length || campaignError.some(Boolean)) {
    out.innerHTML = '<p class="empty-state">Add your URLs and the required fields to build your links.</p>';
    return;
  }
  const failures = b.failed.map((f) => `<li>Line ${f.line} (${esc(f.input.slice(0, 60))}): ${esc(Object.values(f.errors)[0])}</li>`).join('');
  const allWarnings = [...new Set(b.results.flatMap((r) => r.warnings))];
  out.innerHTML =
    `<h2>${b.tagged.length} tagged link${b.tagged.length === 1 ? '' : 's'}</h2>` +
    `<div class="verdict is-good"><pre class="linkbox" id="link-out" data-copy="${esc(b.tagged.join('\n'))}" style="margin:0;white-space:pre-wrap;">${esc(b.tagged.join('\n'))}</pre></div>` +
    (b.tagged.length ? '<p><button class="btn btn-primary btn-sm" id="copy-btn" type="button">Copy all links</button></p>' : '') +
    (failures ? `<div class="verdict is-bad"><strong class="title">${b.failed.length} line${b.failed.length === 1 ? '' : 's'} could not be tagged</strong><ul class="notes">${failures}</ul></div>` : '') +
    warnList(allWarnings);
}

function render() {
  const out = $('results');
  (mode === 'single' ? renderSingle : renderBulk)(out);
}

async function copy(text, button) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  const label = button.textContent;
  button.textContent = 'Copied!';
  setTimeout(() => { button.textContent = label; }, 1600);
}

$('results').addEventListener('click', (e) => {
  const button = e.target.closest('#copy-btn');
  if (button) copy($('link-out').dataset.copy, button);
});

function selectTab(next) {
  mode = next;
  const single = next === 'single';
  $('tab-single').setAttribute('aria-selected', String(single));
  $('tab-bulk').setAttribute('aria-selected', String(!single));
  $('panel-single').hidden = !single;
  $('panel-bulk').hidden = single;
  render();
}
const tabs = [$('tab-single'), $('tab-bulk')];
tabs[0].addEventListener('click', () => selectTab('single'));
tabs[1].addEventListener('click', () => selectTab('bulk'));
tabs.forEach((tab, i) =>
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const other = tabs[(i + 1) % tabs.length];
    other.focus();
    selectTab(other === tabs[0] ? 'single' : 'bulk');
  }),
);

$('utm-form').addEventListener('input', () => { track(mode); render(); });
$('utm-form').addEventListener('submit', (e) => e.preventDefault());

$('year').textContent = new Date().getFullYear();
const toggle = $('nav-toggle');
const mobileNav = $('nav-mobile');
toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

render();
