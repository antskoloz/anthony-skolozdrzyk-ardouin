// Run with: node calc.test.mjs
import assert from 'node:assert/strict';
import { buildUtmUrl, buildBulk, normalizeValue } from './calc.js';

const base = { source: 'newsletter', medium: 'email', campaign: 'spring_sale' };

// Basic build: parameters appended in order, hash kept after the query
let r = buildUtmUrl({ url: 'https://example.com/page', ...base });
assert.equal(r.url, 'https://example.com/page?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale');
assert.deepEqual(r.errors, {});

// Existing query and fragment preserved; optional term/content added
r = buildUtmUrl({ url: 'https://example.com/page?ref=abc&x=1%202#top', ...base, term: 'red shoes', content: 'Banner A' });
assert.equal(r.url, 'https://example.com/page?ref=abc&x=1%202&utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale&utm_term=red_shoes&utm_content=banner_a#top');

// Normalisation: trim, lowercase, whitespace → underscore
assert.equal(normalizeValue('  Spring   Sale 2026 ', true), 'spring_sale_2026');
assert.equal(normalizeValue('  Spring Sale ', false), 'Spring Sale');

// Bare domain gets a path; the destination path keeps its case
assert.equal(buildUtmUrl({ url: 'https://example.com', ...base }).url, 'https://example.com/?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale');
assert.ok(buildUtmUrl({ url: 'https://Example.com/Case/Path', ...base }).url.startsWith('https://example.com/Case/Path?'));

// Existing utm params that we set are replaced and reported; other utm_* are kept
r = buildUtmUrl({ url: 'https://example.com/?utm_source=old&utm_id=42&x=1', ...base });
assert.equal(r.url, 'https://example.com/?utm_id=42&x=1&utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale');
assert.deepEqual(r.overwritten, ['utm_source']);
assert.ok(r.warnings.some((w) => w.includes('utm_source')));
// Case-insensitive match on the existing name
assert.deepEqual(buildUtmUrl({ url: 'https://example.com/?UTM_Medium=x', ...base }).overwritten, ['UTM_Medium']);
// Not setting term leaves an existing utm_term alone
assert.ok(buildUtmUrl({ url: 'https://example.com/?utm_term=keep', ...base }).url.includes('utm_term=keep'));

// Encoding of reserved and non-ASCII characters
r = buildUtmUrl({ url: 'https://example.com/', ...base, campaign: 'a&b=c', term: 'café' });
assert.ok(r.url.includes('utm_campaign=a%26b%3Dc'));
assert.ok(r.url.includes('utm_term=caf%C3%A9'));

// Case-sensitive mode warns instead of changing values
r = buildUtmUrl({ url: 'https://example.com/', source: 'Newsletter', medium: 'email', campaign: 'Spring Sale', normalize: false });
assert.ok(r.url.includes('utm_source=Newsletter') && r.url.includes('utm_campaign=Spring%20Sale'));
assert.equal(r.warnings.length, 2);
assert.equal(buildUtmUrl({ url: 'https://example.com/', ...base, normalize: false }).warnings.length, 0);

// Validation
assert.match(buildUtmUrl({ url: '', ...base }).errors.url, /Enter the page URL/);
assert.match(buildUtmUrl({ url: 'example.com/page', ...base }).errors.url, /full URL/);
assert.match(buildUtmUrl({ url: 'ftp://example.com/', ...base }).errors.url, /http/);
assert.match(buildUtmUrl({ url: 'https://intranet', ...base }).errors.url, /incomplete/);
assert.equal(buildUtmUrl({ url: 'http://localhost:3000/x', ...base }).errors.url, undefined);
r = buildUtmUrl({ url: 'https://example.com/', source: '', medium: ' ', campaign: '' });
assert.equal(r.url, null);
assert.deepEqual(Object.keys(r.errors).sort(), ['campaign', 'medium', 'source']);
// Errors are reported together, including a bad URL
assert.deepEqual(Object.keys(buildUtmUrl({ url: 'nope', source: '', medium: 'x', campaign: 'y' }).errors).sort(), ['source', 'url']);

// Bulk: blank lines skipped, failures reported by line number, valid ones still tagged
const b = buildBulk({ urlsText: 'https://a.com/x\n\nnot a url\r\nhttps://b.com/?q=1', ...base });
assert.equal(b.results.length, 3);
assert.equal(b.tagged.length, 2);
assert.equal(b.failed[0].line, 2);
assert.equal(b.failed[0].input, 'not a url');
assert.ok(b.tagged[1].startsWith('https://b.com/?q=1&utm_source='));
assert.equal(buildBulk({ urlsText: '', ...base }).results.length, 0);

console.log('utm-builder calc: all assertions passed');
