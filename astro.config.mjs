// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import icon from 'astro-icon';

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
  integrations: [
    mdx(), 
    react(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    icon(),
    compress(),
    sitemap({
      // Filter out noindex pages and system routes from sitemap
      filter: (page) =>
        !page.includes('/thank-you') &&
        !page.includes('/api/') &&
        !page.includes('/404') &&
        !page.includes('/500'),
      // Note: priority and changefreq are NOT included as Google ignores them
      // See: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
      serialize(item) {
        // Add lastmod for service+location pages (freshness signal)
        // Pattern: /services/{service}/{city}/
        const urlParts = item.url.split('/');
        if (urlParts.includes('services') && urlParts.length >= 6) {
          item.lastmod = new Date().toISOString();
        }
        return item;
      }
    })
  ]
});