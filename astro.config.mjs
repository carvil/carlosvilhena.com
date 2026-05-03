import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import recommends from 'astro-recommends';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://carlosvilhena.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        // Higher quality (was 80) — graphics with fine text or line work
        // (maps, word clouds, charts) blur noticeably below ~90 in webp.
        // The size hit on photographs at 92 is small (~10-15%); the gain
        // on graphics is substantial.
        format: 'webp',
        quality: 92,
        sizes: [640, 960, 1280, 1600, 2000],
        resizeOptions: { fit: 'cover', position: 'center' },
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    sitemap(),
    icon(),
    recommends({
      basePath: '/go',
      target: 'cloudflare',
      validate: 'strict',
      defaults: {
        rel: ['sponsored', 'nofollow', 'noopener'],
        target: '_blank',
      },
    }),
  ],
});
