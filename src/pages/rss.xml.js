import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: `${SITE_TITLE} — Blog`,
    description: SITE_DESCRIPTION,
    // @astrojs/rss doesn't know about Astro's `base` config, and resolving a
    // leading-slash link against a site URL replaces its path instead of
    // appending — so `site` must end in "/" and links must be relative
    // (no leading slash) for the repo path to survive URL resolution.
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
