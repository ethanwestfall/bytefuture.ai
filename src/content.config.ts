import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writings = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/writings',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'zh', 'ja', 'ko']),
    title: z.string(),
    summary: z.string(),
    category: z.string().default('tutorial'),
    date: z.coerce.date(),
    cta: z.string().url().default('https://models.bytefuture.ai/intro.html'),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writings };
