import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const codes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/codes" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    category: z.enum([
      "fraud",
      "insufficient-funds",
      "technical-processing",
      "card-issuer-restriction",
      "risk-compliance",
      "other",
    ]),

    // A single, self-contained, quotable 40-60 word definition (GEO answer-first block).
    summary: z.string(),

    schemeCodes: z.array(
      z.object({
        scheme: z.enum(["visa", "mastercard", "amex", "discover", "jcb"]),
        code: z.string(),
        label: z.string().optional(),
      }),
    ).min(1),

    commonCauses: z.array(z.string()).min(1),
    merchantActions: z.array(z.string()).min(1),
    preventionTips: z.array(z.string()).min(1),

    relatedSlugs: z.array(z.string()).default([]),

    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ).default([]),

    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),

    lastUpdated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { codes };
