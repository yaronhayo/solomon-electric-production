#!/usr/bin/env node

/**
 * Comprehensive Internal Link Checker
 * Scans ALL hrefs in ALL HTML files and validates they resolve to actual pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const SITE_URL = 'https://www.247electricianmiami.com';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

// Track all pages that exist
const existingPages = new Set();

// Build index of all existing pages
function buildPageIndex(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      buildPageIndex(fullPath, path.join(basePath, item));
    } else if (item === 'index.html') {
      // Add both with and without trailing slash
      const urlPath = '/' + basePath.replace(/\\/g, '/');
      existingPages.add(urlPath);
      existingPages.add(urlPath + '/');
      if (basePath === '') {
        existingPages.add('/');
      }
    } else if (item.endsWith('.html')) {
      const urlPath = '/' + path.join(basePath, item.replace('.html', '')).replace(/\\/g, '/');
      existingPages.add(urlPath);
    }
  }
}

// Add static assets
function addStaticAssets(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      addStaticAssets(fullPath, path.join(basePath, item));
    } else {
      const urlPath = '/' + path.join(basePath, item).replace(/\\/g, '/');
      existingPages.add(urlPath);
    }
  }
}

// Extract all hrefs from HTML
function extractAllHrefs(html) {
  const hrefs = [];
  // Match href= with or without quotes
  const regex = /href=["']?([^"'\s>]+)["']?/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

// Check if URL is internal
function isInternalUrl(url) {
  if (!url) return false;
  if (url.startsWith('data:')) return false;
  if (url.startsWith('javascript:')) return false;
  if (url.startsWith('mailto:')) return false;
  if (url.startsWith('tel:')) return false;
  if (url.startsWith('#')) return false;
  
  // External URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url.startsWith(SITE_URL);
  }
  
  return true;
}

// Normalize URL
function normalizeUrl(url) {
  let normalized = url;
  
  // Remove site URL prefix
  if (normalized.startsWith(SITE_URL)) {
    normalized = normalized.slice(SITE_URL.length);
  }
  
  // Remove query strings and hash
  normalized = normalized.split('?')[0].split('#')[0];
  
  // Ensure starts with /
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  
  return normalized;
}

// Check if URL exists
function urlExists(url) {
  const normalized = normalizeUrl(url);
  
  // Check exact match
  if (existingPages.has(normalized)) return true;
  
  // Check with/without trailing slash
  if (existingPages.has(normalized + '/')) return true;
  if (normalized.endsWith('/') && existingPages.has(normalized.slice(0, -1))) return true;
  
  return false;
}

// Main
async function main() {
  console.log(`\n${colors.cyan}====================================`);
  console.log('  Comprehensive Internal Link Check');
  console.log(`====================================${colors.reset}\n`);
  
  // Build index of all pages
  console.log(`${colors.blue}Building page index...${colors.reset}`);
  buildPageIndex(DIST_DIR);
  addStaticAssets(DIST_DIR);
  console.log(`Found ${existingPages.size} valid paths\n`);
  
  // Scan all HTML files
  console.log(`${colors.blue}Scanning all HTML files for links...${colors.reset}`);
  
  const brokenLinks = [];
  const checkedLinks = new Set();
  let totalLinks = 0;
  let htmlFiles = 0;
  
  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.html')) {
        htmlFiles++;
        const html = fs.readFileSync(fullPath, 'utf-8');
        const hrefs = extractAllHrefs(html);
        const relPath = path.relative(DIST_DIR, fullPath);
        
        for (const href of hrefs) {
          if (!isInternalUrl(href)) continue;
          
          totalLinks++;
          const normalized = normalizeUrl(href);
          
          // Skip if already checked
          const checkKey = `${relPath}:${normalized}`;
          if (checkedLinks.has(checkKey)) continue;
          checkedLinks.add(checkKey);
          
          if (!urlExists(href)) {
            brokenLinks.push({
              source: relPath,
              href: href,
              normalized: normalized
            });
          }
        }
      }
    }
  }
  
  scanDir(DIST_DIR);
  
  console.log(`Scanned ${htmlFiles} HTML files`);
  console.log(`Checked ${totalLinks} internal links`);
  console.log(`Found ${brokenLinks.length} broken links\n`);
  
  if (brokenLinks.length > 0) {
    console.log(`${colors.red}====================================`);
    console.log('  BROKEN LINKS FOUND');
    console.log(`====================================${colors.reset}\n`);
    
    // Group by target URL pattern
    const byPattern = {};
    for (const link of brokenLinks) {
      const pattern = link.normalized.split('/').slice(0, 3).join('/');
      if (!byPattern[pattern]) byPattern[pattern] = [];
      byPattern[pattern].push(link);
    }
    
    // Show summary by pattern
    console.log(`${colors.yellow}Broken link patterns:${colors.reset}`);
    const sortedPatterns = Object.entries(byPattern).sort((a, b) => b[1].length - a[1].length);
    
    for (const [pattern, links] of sortedPatterns.slice(0, 20)) {
      console.log(`  ${pattern}* : ${links.length} broken links`);
    }
    
    // Show sample broken links
    console.log(`\n${colors.yellow}Sample broken links:${colors.reset}`);
    for (const link of brokenLinks.slice(0, 30)) {
      console.log(`  ${colors.dim}${link.source}${colors.reset}`);
      console.log(`    ${colors.red}→${colors.reset} ${link.href}`);
    }
    
    if (brokenLinks.length > 30) {
      console.log(`  ... and ${brokenLinks.length - 30} more`);
    }
    
    // Save full report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        htmlFiles,
        totalLinks,
        broken: brokenLinks.length
      },
      brokenLinks: brokenLinks.map(l => ({
        source: l.source,
        href: l.href
      }))
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../comprehensive-link-report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log(`\n${colors.blue}Full report saved to: comprehensive-link-report.json${colors.reset}`);
    
    process.exit(1);
  } else {
    console.log(`${colors.green}✓ No broken internal links found!${colors.reset}`);
    process.exit(0);
  }
}

main().catch(console.error);
