// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
// import compress from 'astro-compress'; // Disabled - causes OOM on 1600+ pages
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
    plugins: [tailwindcss()],
    build: {
      // Enable code-splitting for smaller chunks
      rollupOptions: {
        output: {
          // Split vendor chunks for better caching
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
          },
          // Optimize chunk file names for caching
          chunkFileNames: '_astro/[name].[hash].js',
          assetFileNames: '_astro/[name].[hash][extname]'
        }
      },
      // Target modern browsers for smaller bundles
      target: 'esnext',
      // Enable minification
      minify: 'esbuild',
      // CSS code-splitting
      cssCodeSplit: true,
      // Inline assets under 4KB
      assetsInlineLimit: 4096
    }
  },
  integrations: [
    mdx(), 
    react(),
    // Note: Partytown removed - GTM runs in main thread for full tracking capability
    // Scripts loaded via GTM (Clarity, GA4) need main thread access
    icon(),
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
    // NOTE: astro-compress disabled - causes out-of-memory errors with 1600+ pages
    // Compression is handled by:
    // 1. Hostinger's server-side gzip (automatic)
    // 2. .htaccess mod_deflate configuration
  ]
});