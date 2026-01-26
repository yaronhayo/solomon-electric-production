#!/usr/bin/env node

/**
 * Post-Build IndexNow Automation
 * Automatically submits sitemap to IndexNow after successful build
 * 
 * This script is designed to run after `npm run build` completes.
 * It reads the sitemap-index.xml and submits all URLs to search engines.
 */

import { submitFromSitemapIndex } from '../src/utils/indexnow.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│         Post-Build IndexNow Automation                     │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  const distPath = path.join(__dirname, '../dist');
  const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');

  // Check if dist folder exists
  try {
    await fs.access(distPath);
  } catch {
    console.error('❌ Error: dist/ folder not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Check if sitemap-index.xml exists
  try {
    await fs.access(sitemapIndexPath);
  } catch {
    console.error('❌ Error: sitemap-index.xml not found in dist/');
    console.error('   Make sure @astrojs/sitemap is configured and build completed successfully.');
    process.exit(1);
  }

  console.log('✅ Build artifacts found');
  console.log(`📍 Sitemap: ${sitemapIndexPath}\n`);

  // Submit to IndexNow
  try {
    await submitFromSitemapIndex(sitemapIndexPath);
    
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│  ✅ IndexNow submission completed successfully!            │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    console.log('📊 Status: All URLs submitted to Bing and Yandex');
    console.log('⏱️  Indexing: Search engines will process within 24-48 hours\n');
  } catch (error) {
    console.error('\n❌ IndexNow submission failed:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
