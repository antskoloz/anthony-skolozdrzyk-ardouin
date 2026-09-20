// Pure scoring, ranking, paste-parsing and CSV helpers for the RICE / ICE Prioritizer. No DOM access.

export const IMPACT_LEVELS = [
  { value: 0.25, label: 'Minimal' },
  { value: 0.5, label: 'Low' },
  { value: 1, label: 'Medium' },
  { value: 2, label: 'High' },
  { value: 3, label: 'Massive' },
];

export const FIELDS = {
  rice: ['reach', 'impact', 'confidence', 'effort'],
  ice: ['impact', 'confidence', 'ease'],
};

const inScale = (v) => v >= 1 && v <= 10;

// RICE = Reach x Impact x Confidence / Effort. Confidence is a percentage (0-100), effort is in person-months.
export function riceScore({ reach, impact, confidence, effort }) {
  if (!(reach >= 0)) throw new RangeError('Reach must be a number, 0 or more.');
  if (!IMPACT_LEVELS.some((l) => l.value === impact)) throw new RangeError('Impact must be 0.25, 0.5, 1, 2 or 3.');
  if (!(confidence >= 0 && confidence <= 100)) throw new RangeError('Confidence must be a percentage from 0 to 100.');
  if (!(effort > 0)) throw new RangeError('Effort must be greater than 0.');
  return (reach * impact * (confidence / 100)) / effort;
}

// ICE = Impact x Confidence x Ease, each scored 1-10 (maximum 1000).
export function iceScore({ impact, confidence, ease }) {
  if (!inScale(impact)) throw new RangeError('Impact must be a number from 1 to 10.');
  if (!inScale(confidence)) throw new RangeError('Confidence must be a number from 1 to 10.');
  if (!inScale(ease)) throw new RangeError('Ease must be a number from 1 to 10.');
  return impact * confidence * ease;
}

export function score(method, item) {
  return method === 'ice' ? iceScore(item) : riceScore(item);
}

// Sort by score, highest first. Equal scores keep their input order and share a rank (1, 2, 2, 4).
export function rankItems(items) {
  const key = (s) => Math.round(s * 1e6) / 1e6;
  const sorted = items.map((item, i) => ({ item, i })).sort((a, b) => key(b.item.score) - key(a.item.score) || a.i - b.i);
  let rank = 0;
  return sorted.map(({ item }, pos) => {
    if (pos === 0 || key(item.score) !== key(sorted[pos - 1].item.score)) rank = pos + 1;
    return { ...item, rank };
  });
}

const IMPACT_WORDS = { minimal: 0.25, low: 0.5, medium: 1, high: 2, massive: 3 };

// Accepts a number or one of the impact words (minimal, low, medium, high, massive); NaN otherwise.
export function parseImpact(text) {
  const t = String(text).trim().toLowerCase();
  return t in IMPACT_WORDS ? IMPACT_WORDS[t] : parseNumber(t);
}

// Plain number, optionally with a trailing %; a comma is a decimal separator when there is no dot.
export function parseNumber(text) {
  let t = String(text).trim().replace(/%$/, '').replace(/\s/g, '');
  if (t.includes(',') && !t.includes('.')) t = t.replace(',', '.');
  return /^-?\d*\.?\d+$|^-?\d+\.$/.test(t) ? Number(t) : NaN;
}

// Splits one line on the delimiter, honouring double-quoted cells (so a name may contain the delimiter).
function splitLine(line, delim) {
  const cells = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') quoted = false; else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delim) { cells.push(cur.trim()); cur = ''; } else cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

// Parses rows pasted from a spreadsheet (tab-separated) or a CSV. Column order: name, then the method's fields.
// A header row is detected (first cell after the name is not a number) and skipped. Bad lines are reported, not fatal.
export function parsePasted(text, method) {
  const fields = FIELDS[method];
  const delim = /\t/.test(text) ? '\t' : ',';
  const rows = [];
  const errors = [];
  let first = true;
  String(text).split(/\r?\n/).forEach((raw, idx) => {
    if (raw.trim() === '') return;
    const cells = splitLine(raw, delim);
    const wasFirst = first;
    first = false;
    if (wasFirst && cells.length > 1 && Number.isNaN(parseNumber(cells[1])) && !(cells[1].toLowerCase() in IMPACT_WORDS)) return;
    const line = idx + 1;
    if (cells.length < fields.length + 1) {
      errors.push(`Line ${line}: expected ${fields.length + 1} columns (name, ${fields.join(', ')}), found ${cells.length}.`);
      return;
    }
    const item = { name: cells[0] || 'Untitled' };
    fields.forEach((f, i) => { item[f] = f === 'impact' && method === 'rice' ? parseImpact(cells[i + 1]) : parseNumber(cells[i + 1]); });
    try {
      score(method, item);
    } catch (e) {
      errors.push(`Line ${line} (${item.name}): ${e.message}`);
      return;
    }
    rows.push(item);
  });
  return { rows, errors };
}

// One CSV cell. Text starting with = + - @ (or a tab / carriage return) is prefixed with an apostrophe so
// spreadsheets do not run it as a formula; cells with a comma, quote or line break are quoted.
export function csvCell(value) {
  let s = String(value);
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HEADERS = {
  rice: ['Rank', 'Name', 'Reach', 'Impact', 'Confidence (%)', 'Effort (person-months)', 'RICE score'],
  ice: ['Rank', 'Name', 'Impact', 'Confidence', 'Ease', 'ICE score'],
};

// `ranked` comes from rankItems: each item carries name, the method's fields, score and rank.
export function toCsv(ranked, method) {
  const lines = [HEADERS[method].map(csvCell).join(',')];
  for (const r of ranked) {
    lines.push([r.rank, r.name, ...FIELDS[method].map((f) => r[f]), Number(r.score.toFixed(2))].map(csvCell).join(','));
  }
  return lines.join('\r\n');
}
