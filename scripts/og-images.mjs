// Renders 1200x630 social share images into public/assets/img/og/:
// default.png (homepage + fallback), one per free tool and one per blog post.
// Run locally and commit the output: `node scripts/og-images.mjs`.
// Posts added later (e.g. from Decap CMS) fall back to default.png until re-run.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'public', 'assets', 'img', 'og');
mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 630;
const NAVY = '#0a1f44';
const BLUE = '#2f6fed';
const ORANGE = '#c2410c';
const FONT = "'Segoe UI', Inter, Arial, sans-serif";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Greedy word wrap using an average glyph width of ~0.52em.
function wrap(text, fontSize, maxWidth) {
  const maxChars = Math.floor(maxWidth / (fontSize * 0.52));
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function circle(size) {
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
  return sharp(join(root, 'public', 'assets', 'img', 'headshot.jpg'))
    .resize(size, size)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function render(file, { kicker, title, isDefault = false }) {
  let svg;
  const composites = [];
  if (isDefault) {
    svg = `
      <rect x="80" y="150" width="72" height="8" rx="4" fill="${ORANGE}"/>
      <text x="80" y="245" font-size="58" font-weight="700" fill="#fff" font-family="${FONT}">Anthony</text>
      <text x="80" y="312" font-size="58" font-weight="700" fill="#fff" font-family="${FONT}">Skolozdrzyk-Ardouin</text>
      <text x="80" y="380" font-size="30" fill="#c9d6ee" font-family="${FONT}">Revenue Operations &amp; Data Analytics</text>
      <text x="80" y="480" font-size="26" font-weight="600" fill="${BLUE}" font-family="${FONT}">Free tools · Blog · anthonysko.com</text>`;
    composites.push({ input: await circle(300), left: 830, top: 165 });
  } else {
    const fontSize = title.length > 70 ? 50 : 58;
    const lines = wrap(title, fontSize, 1040).slice(0, 4);
    const lineH = Math.round(fontSize * 1.18);
    const top = 215 + (4 - lines.length) * lineH * 0.35;
    svg = `
      <rect x="80" y="100" width="72" height="8" rx="4" fill="${ORANGE}"/>
      <text x="80" y="160" font-size="24" font-weight="700" letter-spacing="3" fill="${BLUE}" font-family="${FONT}">${esc(kicker)}</text>
      ${lines.map((l, i) => `<text x="80" y="${top + i * lineH}" font-size="${fontSize}" font-weight="700" fill="#fff" font-family="${FONT}">${esc(l)}</text>`).join('')}
      <text x="176" y="548" font-size="26" font-weight="600" fill="#fff" font-family="${FONT}">Anthony Skolozdrzyk-Ardouin</text>
      <text x="176" y="582" font-size="22" fill="#c9d6ee" font-family="${FONT}">anthonysko.com</text>`;
    composites.push({ input: await circle(76), left: 80, top: 512 });
  }
  const base = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${NAVY}"/>
    <circle cx="${W + 40}" cy="-60" r="360" fill="#102a54"/>
    ${svg}</svg>`);
  await sharp(base).composite(composites).png({ compressionLevel: 9, palette: true }).toFile(join(outDir, file));
}

await render('default.png', { isDefault: true });
let count = 1;

// Free tools: title from each tool page's og:title (Decline Code Lookup is an Astro app, skipped).
for (const name of readdirSync(join(root, 'projects'))) {
  const page = join(root, 'projects', name, 'index.html');
  if (!existsSync(page)) continue;
  const title = readFileSync(page, 'utf8').match(/property="og:title" content="([^"]+)"/)?.[1];
  if (!title) continue;
  const clean = title.replace(/&amp;/g, '&').replace(/^Free\s+/i, '');
  await render(`tool-${name}.png`, { kicker: 'FREE TOOL', title: clean });
  count++;
}

// Blog posts: title from frontmatter.
const blogDir = join(root, 'src', 'content', 'blog');
for (const f of readdirSync(blogDir).filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(join(blogDir, f), 'utf8').match(/^title:\s*(.+)$/m)?.[1]?.trim();
  if (!raw) continue;
  const title = raw.replace(/^["']|["']$/g, '').replace(/\\"/g, '"');
  await render(`blog-${f.replace(/\.md$/, '')}.png`, { kicker: 'BLOG', title });
  count++;
}

console.log(`[og] wrote ${count} images to public/assets/img/og/`);
