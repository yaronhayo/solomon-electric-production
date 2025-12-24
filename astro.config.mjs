// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Configured for static output (Hostinger deployment)
export default defineConfig({
  site: 'https://www.247electricianmiami.com',
  output: 'static',
  build: {
    // Output to dist folder for Hostinger upload
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap()]
});