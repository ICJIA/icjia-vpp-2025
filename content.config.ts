import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
       
        title: z.string().optional(),
        summary: z.string().optional(),
        description: z.string().optional(),
        date: z.string().optional(),
        image: z.string().optional(),
        mdRaw: z.string().optional(),
        showToc: z.boolean().optional()
      })
    })
  }
})
