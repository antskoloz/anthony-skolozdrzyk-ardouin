// Pure UTM link-building logic for the UTM Link Builder. No DOM access.

const PARAMS = [
  ['utm_source', 'source'],
  ['utm_medium', 'medium'],
  ['utm_campaign', 'campaign'],
  ['utm_term', 'term'],
  ['utm_content', 'content'],
];
const REQUIRED = ['source', 'medium', 'campaign'];

// Trim; optionally lowercase and turn runs of whitespace into a single underscore.
export function normalizeValue(value, normalize) {
  const v = String(value ?? '').trim();
  return normalize ? v.toLowerCase().replace(/\s+/g, '_') : v;
}

function parseDestination(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return { error: 'Enter the page URL you want to link to.' };
  let url;
  try {
    url = new URL(text);
  } catch {
    return { error: 'This does not look like a full URL. Start with https:// (or http://).' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { error: 'Only http:// and https:// links can be tagged.' };
  if (!url.hostname.includes('.') && url.hostname !== 'localhost') return { error: 'The web address looks incomplete (for example example.com).' };
  return { url };
}

// Builds one tagged URL. Existing utm_* parameters that would be replaced are removed and reported;
// every other query parameter and the #fragment are kept exactly as written.
export function buildUtmUrl({ url, source, medium, campaign, term = '', content = '', normalize = true }) {
  const errors = {};
  const warnings = [];
  const parsed = parseDestination(url);
  if (parsed.error) errors.url = parsed.error;

  const values = { source, medium, campaign, term, content };
  const clean = {};
  for (const [, key] of PARAMS) clean[key] = normalizeValue(values[key], normalize);
  for (const key of REQUIRED) if (!clean[key]) errors[key] = `${key[0].toUpperCase()}${key.slice(1)} is required.`;
  if (Object.keys(errors).length) return { url: null, errors, warnings, overwritten: [] };

  if (!normalize) {
    const raw = PARAMS.map(([, key]) => String(values[key] ?? '').trim()).filter(Boolean);
    if (raw.some((v) => /[A-Z]/.test(v))) warnings.push('Some values contain capital letters. Google Analytics treats "Email" and "email" as different values, which splits your reports. Turn on the lowercase option to avoid this.');
    if (raw.some((v) => /\s/.test(v))) warnings.push('Some values contain spaces, which are encoded as %20. Underscores or hyphens keep links cleaner.');
  }

  const setNames = PARAMS.filter(([, key]) => clean[key]).map(([name]) => name);
  const u = parsed.url;
  const kept = [];
  const overwritten = [];
  for (const pair of u.search.slice(1).split('&').filter(Boolean)) {
    let name = pair.split('=')[0];
    try { name = decodeURIComponent(name); } catch { /* keep raw name */ }
    if (setNames.includes(name.toLowerCase())) overwritten.push(name);
    else kept.push(pair);
  }
  if (overwritten.length) warnings.push(`The URL already had ${overwritten.join(', ')}; ${overwritten.length === 1 ? 'it was' : 'they were'} replaced by the values you entered.`);

  const tags = PARAMS.filter(([, key]) => clean[key]).map(([name, key]) => `${name}=${encodeURIComponent(clean[key])}`);
  const query = [...kept, ...tags].join('&');
  return { url: `${u.origin}${u.pathname}?${query}${u.hash}`, errors, warnings, overwritten };
}

// Tags many URLs (one per line) with the same campaign fields.
export function buildBulk({ urlsText, ...fields }) {
  const lines = String(urlsText ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const results = lines.map((input, i) => {
    const r = buildUtmUrl({ ...fields, url: input });
    return { line: i + 1, input, url: r.url, errors: r.errors, warnings: r.warnings };
  });
  return { results, tagged: results.filter((r) => r.url).map((r) => r.url), failed: results.filter((r) => !r.url) };
}
