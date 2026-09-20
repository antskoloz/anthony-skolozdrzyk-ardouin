import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: `${SITE_TITLE} — Blog`,
    description: SITE_DESCRIPTION,
    // Links are relative (no leading slash) against a `site` ending in "/".
    // This is a leftover of the old GitHub Pages sub-path, where it was required
    // (@astrojs/rss ignores Astro's `base`); at the domain root it is harmless.
    site: `${SITE_URL}/`,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `blog/${post.id}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
