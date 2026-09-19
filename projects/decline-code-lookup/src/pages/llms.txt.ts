import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { categories } from "../data/categories";
import { withBase } from "../utils/seo";

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const codes = (await getCollection("codes", ({ data }) => !data.draft)).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );

  const url = (path: string) => new URL(withBase(path), site).toString();

  const lines: string[] = [];
  lines.push("# Decline Code Lookup");
  lines.push("");
  lines.push(
    "> A free, independent glossary explaining card payment decline codes (Visa, Mastercard, American Express) for merchants, with plain-English causes and recommended next steps.",
  );
  lines.push("");
  lines.push("## Key pages");
  lines.push(`- [Glossary of all decline codes](${url("/glossary/")})`);
  lines.push(`- [About this tool](${url("/about/")})`);
  lines.push("");
  lines.push("## Categories");
  for (const category of categories) {
    lines.push(`- [${category.label}](${url(`/category/${category.id}/`)}): ${category.description}`);
  }
  lines.push("");
  lines.push("## Decline codes");
  for (const entry of codes) {
    lines.push(`- [${entry.data.title}](${url(`/codes/${entry.data.slug}/`)}): ${entry.data.summary}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
