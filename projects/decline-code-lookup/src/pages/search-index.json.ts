import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
  const codes = await getCollection("codes", ({ data }) => !data.draft);

  const index = codes.map(({ data }) => ({
    slug: data.slug,
    title: data.title,
    category: data.category,
    summary: data.summary,
    schemeCodes: data.schemeCodes.map((entry) => entry.code),
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
