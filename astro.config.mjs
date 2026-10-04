// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Post URL -> last-modified date (updatedDate, else pubDate) from frontmatter,
// so the blog sitemap carries <lastmod> for search engines.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const postLastmod = Object.fromEntries(
  readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const src = readFileSync(new URL(f, blogDir), 'utf8');
      const field = (key) => src.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, "m"))?.[1];
      const d = new Date(field('updatedDate') ?? field('pubDate'));
      return [`https://anthonysko.com/blog/${f.replace(/\.md$/, '')}/`, d];
    })
    .filter(([, d]) => !isNaN(d.getTime())),
);

// https://astro.build/config
export default defineConfig({
  // GitHub Pages custom domain (anthonysko.com, ADR-007): the site is served
  // from the domain root, so no `base` path is needed.
  // See https://docs.astro.build/en/guides/deploy/github/
  site: 'https://anthonysko.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // The homepage (EN/FR/DE) is plain HTML served from public/ and already
      // has a hand-maintained sitemap.xml — this integration only needs to
      // cover the Astro-rendered blog routes, so it writes to its own file.
      filter: (page) => page.includes('/blog/'),
      serialize(item) {
        const d = postLastmod[item.url];
        if (d) item.lastmod = d.toISOString();
        return item;
      },
    }),
  ],
  build: {
    format: 'directory',
  },
});
