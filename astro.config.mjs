// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
        return item;
      },
    }),
  ],
  build: {
    format: 'directory',
  },
});
