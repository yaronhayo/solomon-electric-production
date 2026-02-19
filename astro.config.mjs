// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// Configured for static output (Hostinger deployment)
export default defineConfig({
  site: 'https://www.247electricianmiami.com',
  output: 'static',
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: '_astro/[name].[hash].js',
          assetFileNames: '_astro/[name].[hash][extname]'
        }
      },
      target: 'esnext',
      minify: 'esbuild',
      cssCodeSplit: true,
      assetsInlineLimit: 4096
    }
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/thank-you') &&
        !page.includes('/api/') &&
        !page.includes('/404') &&
        !page.includes('/500') &&
        !page.includes('/branding'),
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      }
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ]
});