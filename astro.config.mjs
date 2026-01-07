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
  site: 'https://247electricianmiami.com',
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
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Homepage - highest priority, crawl daily
        if (item.url === 'https://www.247electricianmiami.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } 
        // Service pages - high priority transactional pages
        else if (item.url.includes('/services/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } 
        // Service area pages - location landing pages
        else if (item.url.includes('/service-areas/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } 
        // Guide pages - educational pillar content
        else if (item.url.includes('/guides/')) {
          item.priority = 0.85;
          item.changefreq = 'monthly';
        }
        // Blog posts - informational content
        else if (item.url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        // Contact, About, Reviews - supporting pages
        else if (item.url.includes('/contact/') || item.url.includes('/about/') || item.url.includes('/reviews/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }
        // Legal/utility pages
        else if (item.url.includes('/privacy/') || item.url.includes('/terms/')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        // Thank you pages should not be indexed (but can be in sitemap with low priority)
        else if (item.url.includes('/thank-you/')) {
          item.priority = 0.1;
          item.changefreq = 'yearly';
        }
        return item;
      }
    })
  ]
});