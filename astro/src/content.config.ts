import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sharedSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    lastModified: z.coerce.date().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    twitterCard: z.string().optional(),
    showTOC: z.boolean().optional(),
    showBorder: z.boolean().optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .passthrough();

const plan = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/plan" }),
  schema: sharedSchema,
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }),
  schema: sharedSchema,
});

const pages = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/content" }),
  schema: sharedSchema,
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/news" }),
  schema: z
    .object({
      title: z.string().optional(),
      summary: z.string().optional(),
      date: z.coerce.date().optional(),
      image: z.string().optional(),
      description: z.string().optional(),
      lastModified: z.coerce.date().optional(),
    })
    .passthrough(),
});

export const collections = { plan, legal, pages, news };
