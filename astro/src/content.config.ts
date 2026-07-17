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

// NOTE: News is dormant — /news/ ships as an empty-state page only (matches
// legacy, no nav link, excluded from the sitemap). When News launches:
//   1. re-add a `news` collection here (glob over ./src/content/news),
//   2. restore getCollection("news") in pages/news/index.astro,
//   3. add a /news/[slug].astro detail route (cards link to /news/<id>/),
//   4. drop the /news exclusion from the sitemap filter in astro.config.ts.
// Defining the collection while src/content/news/ is empty makes every build
// warn ("collection does not exist or is empty"), so it stays out until then.

export const collections = { plan, legal, pages };
