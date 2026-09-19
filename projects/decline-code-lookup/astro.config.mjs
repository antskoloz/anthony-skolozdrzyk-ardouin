// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://antskoloz.github.io',
  base: '/anthony-skolozdrzyk-ardouin/projects/decline-code-lookup',
  integrations: [sitemap()],
});
