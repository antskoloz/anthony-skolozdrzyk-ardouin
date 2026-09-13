// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: `site` is the domain, `base` is the repo path.
  // Astro combines the two when generating absolute URLs (sitemap, RSS) —
  // see https://docs.astro.build/en/guides/deploy/github/
  site: 'https://antskoloz.github.io',
  base: '/anthony-skolozdrzyk-ardouin',
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
