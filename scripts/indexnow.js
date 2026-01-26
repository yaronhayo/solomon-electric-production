#!/usr/bin/env node

/**
 * IndexNow CLI Tool
 * Command-line interface for submitting URLs to IndexNow
 * 
 * Usage:
 *   npm run indexnow:submit <url>              - Submit a single URL
 *   npm run indexnow:submit <url1> <url2> ... - Submit multiple URLs
 *   npm run indexnow:sitemap                   - Submit all URLs from sitemap
 */

import { submitToIndexNow, submitFromSitemap, submitFromSitemapIndex } from '../src/utils/indexnow.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command || command === '--help' || command === '-h') {
    printHelp();
    process.exit(0);
  }

  if (command === 'sitemap') {
    // Submit from sitemap index
    const sitemapIndexPath = path.join(__dirname, '../dist/sitemap-index.xml');
    console.log('📑 Submitting URLs from sitemap index...\n');
    await submitFromSitemapIndex(sitemapIndexPath);
  } else {
    // Submit provided URLs
    const urls = args;
    
    if (urls.length === 0) {
      console.error('❌ Error: No URLs provided\n');
      printHelp();
      process.exit(1);
    }

    await submitToIndexNow(urls);
  }
}

function printHelp() {
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│                    IndexNow CLI Tool                        │
│         Instantly notify search engines of updates          │
└─────────────────────────────────────────────────────────────┘

USAGE:
  node scripts/indexnow.js <command> [urls...]

COMMANDS:
  sitemap                Submit all URLs from sitemap-index.xml
  <url> [url...]        Submit one or more specific URLs

EXAMPLES:
  # Submit entire sitemap (all 1,800+ pages)
  npm run indexnow:sitemap

  # Submit a single URL
  npm run indexnow:submit https://www.247electricianmiami.com/services/electrical-panel-upgrade

  # Submit multiple URLs
  npm run indexnow:submit /blog/post-1 /blog/post-2 /services/new-service

  # Submit with full URLs
  npm run indexnow:submit https://www.247electricianmiami.com/services/outlet-installation

NOTES:
  - URLs can be relative (/path) or absolute (https://...)
  - Relative URLs will be converted to canonical domain
  - IndexNow supports up to 10,000 URLs per request
  - Supported by Bing (Microsoft) and Yandex

API KEY LOCATION:
  https://www.247electricianmiami.com/index-now-5520a66a-8172-47e6-9857-ada854872cb2.txt
`);
}

// Run the CLI
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
