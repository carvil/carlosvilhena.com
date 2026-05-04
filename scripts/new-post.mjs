#!/usr/bin/env node
// Scaffold a new post folder with co-located assets and a fully commented
// frontmatter block. Comments survive in the source file but are stripped
// during YAML parse, so they don't reach the schema validator.
//
// Usage:
//   pnpm new:post <slug>
//   pnpm new:post my-post --category=stem-education --title="My post title"
//
// Categories: leadership-breadcrumbs | stem-education | side-quests
// Default category: stem-education
//
// The script will:
//   - validate the slug (lowercase letters, digits, hyphens; no leading/trailing dash)
//   - refuse to overwrite an existing post
//   - create src/content/posts/<slug>/index.mdx
//   - default publishedAt to today's date
//   - default draft: true so it's excluded from build until you flip it

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const VALID_CATEGORIES = ['leadership-breadcrumbs', 'stem-education', 'side-quests'];
const DEFAULT_CATEGORY = 'stem-education';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const flags = Object.fromEntries(
  args
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, ...rest] = a.replace(/^--/, '').split('=');
      return [k, rest.join('=') || true];
    }),
);

const slug = positional[0];

function fail(msg) {
  console.error(`✖ ${msg}`);
  console.error('');
  console.error('Usage: pnpm new:post <slug> [--category=<slug>] [--title="..."]');
  console.error(`Categories: ${VALID_CATEGORIES.join(' | ')}`);
  process.exit(1);
}

if (!slug || flags.help || flags.h) {
  fail('Missing required <slug> argument.');
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  fail(`Invalid slug "${slug}". Use lowercase letters, digits, and hyphens only — no leading/trailing dash.`);
}

const category = flags.category ?? DEFAULT_CATEGORY;
if (!VALID_CATEGORIES.includes(category)) {
  fail(`Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(' | ')}`);
}

const title =
  flags.title ??
  slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const today = new Date().toISOString().split('T')[0];

const postDir = join('src/content/posts', slug);
const postFile = join(postDir, 'index.mdx');

if (existsSync(postFile)) {
  fail(`Post already exists at ${postFile}. Pick a different slug or delete the existing folder first.`);
}

mkdirSync(postDir, { recursive: true });

const content = `---
# SEO METADATA — this is what Google + share cards see.
# All fields below are validated by src/content.config.ts on build.

# Title — keep under 60 chars (Google truncates beyond that).
# Lead with the keyword someone would actually search.
# The publication name "Tiny Delights" is appended automatically in the <title> tag.
title: "${title.replace(/"/g, '\\"')}"

# Description — 140–160 chars. Active voice. Lead with the value/outcome.
# Don't repeat the title; Google may show neither if they overlap.
description: "TODO — write the search snippet here."

# One of: ${VALID_CATEGORIES.join(' | ')}
category: ${category}

# Sort order + JSON-LD datePublished + RSS pubDate.
# NEVER rendered visibly anywhere on the site (timeless feel).
publishedAt: ${today}

# Optional. Set this when you meaningfully revise the post — it updates
# JSON-LD dateModified so search engines know there's fresh content.
# updatedAt: ${today}

# Optional cover image. Drop the file in THIS folder (not public/images/!),
# then reference it relatively. Astro will run it through sharp at build.
# Used as og:image on social shares + JSON-LD image.
# cover: ./cover.jpg
# coverAlt: "Description for screen readers and search engines."

# Optional free-form tags — feeds the auto-generated /tags/<tag>/ pages.
# tags: [parenting, programming]

# Set to false when ready to publish. Drafts are excluded from the build,
# the sitemap, and the RSS feed.
draft: true
---

{/*
  Affiliate links use <Aff slug="..."> from astro-recommends.
  Slugs are defined in affiliates.config.ts. Build will fail if you
  reference a slug that doesn't exist (validate: 'strict').

    import { Aff } from 'astro-recommends/components';
    <Aff slug="deep-work">Deep Work</Aff>

  Uncomment the import below if you use any affiliate links.
*/}

{/* import { Aff } from 'astro-recommends/components'; */}

Write your post body here. Markdown + MDX components both work.

## A section heading

Some body text. Internal links are relative-ish: \`[my other post](/my-other-post/)\`.
External links: \`[some site](https://example.com)\`.

Images can also be co-located in this folder and referenced relatively:
\`![alt text](./diagram.png)\` — they'll be optimized at build.
`;

writeFileSync(postFile, content);
console.log(`✓ Created ${postFile}`);
console.log('');
console.log('Next:');
console.log(`  1. Edit ${postFile}`);
console.log(`     - replace the description placeholder`);
console.log(`     - drop a cover image into this folder if you have one`);
console.log(`     - write the body`);
console.log(`  2. Set draft: false when ready to publish`);
console.log(`  3. git add ${postDir} && commit`);
