import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CATEGORY_VALUES = ['leadership-breadcrumbs', 'stem-education', 'side-quests'] as const;

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(CATEGORY_VALUES),
      // publishedAt is used for sorting and JSON-LD/RSS only — never visibly rendered.
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      // Co-located cover image. Optional. Use a relative ./path.jpg in the post folder.
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // Free-form tags — kept for the auto-generated /tags/<tag>/ discovery surface.
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const CATEGORIES: Record<
  (typeof CATEGORY_VALUES)[number],
  { label: string; intro: string; icon: string }
> = {
  'leadership-breadcrumbs': {
    label: 'Leadership Breadcrumbs',
    intro: 'Notes on leading teams, building cultures, and the long road of becoming a better operator.',
    icon: 'lucide:footprints',
  },
  'stem-education': {
    label: 'STEM Education',
    intro: 'Thoughts on raising curious learners — programming for kids, creative learning, hands-on tools.',
    icon: 'lucide:microscope',
  },
  'side-quests': {
    label: 'Side Quests',
    intro: 'Personal projects, experiments, and small obsessions that don’t fit anywhere else.',
    icon: 'lucide:compass',
  },
};

export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
};
