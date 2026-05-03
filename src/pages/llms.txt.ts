import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES } from '../content.config.ts';

const slugOf = (id: string) => id.replace(/\/index$/, '').split('/').pop()!;

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  const lines: string[] = [
    '# Carlos Vilhena',
    '',
    '> Thoughts on entrepreneurship, leadership and engineering. Personal essays by Carlos Vilhena.',
    '',
    '## About',
    '',
    `- [About me](${new URL('/about-me/', site)})`,
    `- [Now](${new URL('/now/', site)})`,
    `- [Get in touch](${new URL('/get-in-touch/', site)})`,
    '',
  ];

  for (const cat of Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]) {
    const inCat = sorted.filter((p) => p.data.category === cat);
    if (inCat.length === 0) continue;
    lines.push(`## ${CATEGORIES[cat].label}`, '');
    for (const p of inCat) {
      const url = new URL(`/${slugOf(p.id)}/`, site).toString();
      lines.push(`- [${p.data.title}](${url}): ${p.data.description}`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
