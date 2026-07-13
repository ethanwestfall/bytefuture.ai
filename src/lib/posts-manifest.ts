import { getCollection } from 'astro:content';

export type ManifestLang = 'en' | 'zh' | 'ja' | 'ko';

export async function getPostsManifest(lang: ManifestLang) {
  const entries = await getCollection('writings');
  return entries
    .filter((entry) => !entry.data.draft && entry.data.lang === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((entry) => {
      const post: {
        slug: string;
        title: string;
        summary: string;
        category: string;
        date: string;
        cover?: string;
      } = {
        slug: entry.data.slug,
        title: entry.data.title,
        summary: entry.data.summary,
        category: entry.data.category,
        date: entry.data.date.toISOString().slice(0, 10),
      };
      if (entry.data.cover) post.cover = entry.data.cover;
      return post;
    });
}

export function jsonResponse(data: unknown) {
  return new Response(JSON.stringify(data, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
