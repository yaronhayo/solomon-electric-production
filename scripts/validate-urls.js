#!/usr/bin/env node

/**
 * URL Validation Script for 247electricianmiami.com
 * Checks all URLs from sitemap and local dist folder for 404s
 * 
 * Usage: node scripts/validate-urls.js [--local | --live | --both]
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.247electricianmiami.com';
const DIST_DIR = path.join(__dirname, '../dist');

// Throttle requests to avoid rate limiting
const CONCURRENT_REQUESTS = 10;
const DELAY_BETWEEN_BATCHES = 500;

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Get all URLs from local dist folder
 */
function getLocalUrls() {
  const urls = [];
  
  function walkDir(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath, path.join(basePath, item));
      } else if (item === 'index.html') {
        // Convert path to URL
        const urlPath = basePath.replace(/\\/g, '/');
        urls.push(`${SITE_URL}/${urlPath}${urlPath ? '/' : ''}`);
      }
    }
  }
  
  walkDir(DIST_DIR);
  return urls;
}

/**
 * Check if a URL returns 200
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 10000 }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 400
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        ok: false,
        error: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        ok: false,
        error: 'Timeout'
      });
    });
  });
}

/**
 * Check URLs in batches
 */
async function checkUrlsBatched(urls, onProgress) {
  const results = [];
  const total = urls.length;
  
  for (let i = 0; i < urls.length; i += CONCURRENT_REQUESTS) {
    const batch = urls.slice(i, i + CONCURRENT_REQUESTS);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    
    if (onProgress) {
      onProgress(results.length, total);
    }
    
    if (i + CONCURRENT_REQUESTS < urls.length) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES));
    }
  }
  
  return results;
}

/**
 * Format results
 */
function formatResults(results, label) {
  const ok = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);
  
  console.log(`\n${colors.cyan}=== ${label} ===${colors.reset}`);
  console.log(`${colors.green}✓ Working: ${ok.length}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${failed.length}${colors.reset}`);
  
  if (failed.length > 0) {
    console.log(`\n${colors.yellow}Failed URLs:${colors.reset}`);
    
    // Group by status code
    const byStatus = {};
    for (const r of failed) {
      const key = r.status || 'Error';
      if (!byStatus[key]) byStatus[key] = [];
      byStatus[key].push(r);
    }
    
    for (const [status, urls] of Object.entries(byStatus)) {
      console.log(`\n  ${colors.red}Status ${status}:${colors.reset} (${urls.length} URLs)`);
      // Show first 20 for each status
      urls.slice(0, 20).forEach(r => {
        console.log(`    - ${r.url}${r.error ? ` (${r.error})` : ''}`);
      });
      if (urls.length > 20) {
        console.log(`    ... and ${urls.length - 20} more`);
      }
    }
  }
  
  return { ok: ok.length, failed: failed.length, failures: failed };
}

/**
 * Save report to file
 */
function saveReport(results, filename) {
  const report = {
    timestamp: new Date().toISOString(),
    total: results.length,
    ok: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    failures: results.filter(r => !r.ok)
  };
  
  fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  console.log(`\n${colors.blue}Report saved to: ${filename}${colors.reset}`);
}

/**
 * Main validation
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--both';
  
  console.log(`\n${colors.cyan}====================================`);
  console.log('   URL Validation Script');
  console.log(`====================================${colors.reset}\n`);
  
  // Get local URLs
  console.log(`${colors.blue}Scanning local dist folder...${colors.reset}`);
  const localUrls = getLocalUrls();
  console.log(`Found ${localUrls.length} pages in local build\n`);
  
  if (mode === '--local') {
    console.log('Local validation only - checking if files exist (skip network)');
    console.log(`${colors.green}All ${localUrls.length} pages exist locally.${colors.reset}`);
    return;
  }
  
  // Check live URLs
  console.log(`${colors.blue}Checking live URLs...${colors.reset}`);
  console.log(`This will check ${localUrls.length} URLs (may take a few minutes)\n`);
  
  const results = await checkUrlsBatched(localUrls, (done, total) => {
    const pct = Math.round((done / total) * 100);
    process.stdout.write(`\rProgress: ${done}/${total} (${pct}%)`);
  });
  
  console.log('\n');
  
  const summary = formatResults(results, 'Live Site Validation');
  
  // Save detailed report
  saveReport(results, path.join(__dirname, '../url-validation-report.json'));
  
  // Exit with error if failures found
  if (summary.failed > 0) {
    console.log(`\n${colors.red}❌ VALIDATION FAILED${colors.reset}`);
    console.log(`${summary.failed} URLs returned errors. Deploy the latest build to fix.`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✓ ALL URLS VALID${colors.reset}`);
    process.exit(0);
  }
}

main().catch(console.error);
