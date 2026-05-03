import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
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
        format: 'webp',
        quality: 80,
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
