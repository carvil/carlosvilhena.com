# carlosvilhena.com

Personal blog of Carlos Vilhena. Astro static site, deployed to Cloudflare Pages.

## Stack

- [Astro 6](https://astro.build) + Tailwind CSS v4 + MDX
- Content collections with co-located post images
- Affiliate link cloaking via [`astro-recommends`](https://github.com/carvil/astro-recommends) (sister project, sibling repo)
- Deploy: Cloudflare Pages
- Analytics: Cloudflare Web Analytics

## Conventions

See [`CLAUDE.md`](./CLAUDE.md) for the full project conventions. Key decisions:

- Post URLs flat at `/<slug>/` (preserved from the WordPress source).
- Three categories: Leadership Breadcrumbs, STEM Education, Side Quests.
- `publishedAt` in frontmatter is used for sorting + JSON-LD/RSS only — never visibly rendered. Goal: timeless feel, ordered freshness without visible staleness.
- Per-post folder layout: `src/content/posts/<slug>/index.mdx` with co-located images.
- Affiliate cloak prefix is `/go/<slug>/` (not `/recommends/`) to preserve existing links from the WordPress site.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # output → dist/
pnpm preview
```

## Attribution

Initial scaffold forked from [brook-2 / astro-brook](https://github.com/holger1411/astro-brook) (MIT) by Holger Sindbaek. Significantly modified for personal-blog use.

## License

Source code: MIT (see [`LICENSE`](./LICENSE) — added on first content release).
Post content: © Carlos Vilhena, all rights reserved.
