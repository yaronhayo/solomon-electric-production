#!/usr/bin/env node

/**
 * Internal Link Validator
 * Scans all HTML files in dist/ and validates internal links
 * 
 * Usage: node scripts/validate-internal-links.js
 * 
 * Checks:
 * - All <a href="..."> links to internal pages
 * - Image sources <img src="...">
 * - Script and CSS references
 * - Canonical and alternate links
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

/**
 * Get all HTML files recursively
 */
function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extract all internal links from HTML content
 */
function extractLinks(htmlContent, filePath) {
  const links = [];
  
  // Match href attributes (including canonical, alternate links)
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(htmlContent)) !== null) {
    links.push({
      type: 'href',
      url: match[1],
      source: filePath
    });
  }
  
  // Match src attributes (images, scripts)
  const srcRegex = /src=["']([^"']+)["']/gi;
  while ((match = srcRegex.exec(htmlContent)) !== null) {
    links.push({
      type: 'src',
      url: match[1],
      source: filePath
    });
  }
  
  // Match srcset for responsive images
  const srcsetRegex = /srcset=["']([^"']+)["']/gi;
  while ((match = srcsetRegex.exec(htmlContent)) !== null) {
    // Parse srcset (comma-separated)
    const srcset = match[1];
    const srcs = srcset.split(',').map(s => s.trim().split(/\s+/)[0]);
    for (const src of srcs) {
      links.push({
        type: 'srcset',
        url: src,
        source: filePath
      });
    }
  }
  
  return links;
}

/**
 * Check if a URL is internal
 */
function isInternalUrl(url) {
  if (!url) return false;
  
  // Skip non-URL values
  if (url.startsWith('data:')) return false;
  if (url.startsWith('javascript:')) return false;
  if (url.startsWith('mailto:')) return false;
  if (url.startsWith('tel:')) return false;
  if (url.startsWith('#')) return false;
  
  // External URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url.startsWith(SITE_URL);
  }
  
  // Relative URLs are internal
  return true;
}

/**
 * Normalize URL to file path
 */
function urlToFilePath(url, sourceFile) {
  let normalizedUrl = url;
  
  // Strip site URL prefix
  if (normalizedUrl.startsWith(SITE_URL)) {
    normalizedUrl = normalizedUrl.slice(SITE_URL.length);
  }
  
  // Remove query strings and hash
  normalizedUrl = normalizedUrl.split('?')[0].split('#')[0];
  
  // Handle relative URLs
  if (!normalizedUrl.startsWith('/')) {
    const sourceDir = path.dirname(sourceFile);
    const relPath = path.relative(DIST_DIR, sourceDir);
    normalizedUrl = '/' + path.join(relPath, normalizedUrl).replace(/\\/g, '/');
  }
  
  // Resolve .. and .
  normalizedUrl = path.normalize(normalizedUrl).replace(/\\/g, '/');
  
  // Check if it's a directory (needs index.html) or a file
  const fullPath = path.join(DIST_DIR, normalizedUrl);
  
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      return path.join(fullPath, 'index.html');
    }
    return fullPath;
  }
  
  // Try adding index.html
  const withIndex = path.join(fullPath, 'index.html');
  if (fs.existsSync(withIndex)) {
    return withIndex;
  }
  
  // Try with .html extension
  if (!fullPath.endsWith('.html') && fs.existsSync(fullPath + '.html')) {
    return fullPath + '.html';
  }
  
  return fullPath;
}

/**
 * Validate a single link
 */
function validateLink(link) {
  if (!isInternalUrl(link.url)) {
    return { ...link, valid: true, external: true };
  }
  
  const filePath = urlToFilePath(link.url, link.source);
  const exists = fs.existsSync(filePath);
  
  return {
    ...link,
    valid: exists,
    external: false,
    resolvedPath: filePath
  };
}

/**
 * Generate report
 */
function generateReport(results) {
  const brokenLinks = results.filter(r => !r.valid && !r.external);
  const validLinks = results.filter(r => r.valid && !r.external);
  const externalLinks = results.filter(r => r.external);
  
  console.log(`\n${colors.cyan}====================================`);
  console.log('   Internal Link Validation Report');
  console.log(`====================================${colors.reset}\n`);
  
  console.log(`${colors.blue}Summary:${colors.reset}`);
  console.log(`  Total links scanned: ${results.length}`);
  console.log(`  ${colors.green}Valid internal:${colors.reset} ${validLinks.length}`);
  console.log(`  ${colors.dim}External (skipped):${colors.reset} ${externalLinks.length}`);
  console.log(`  ${colors.red}Broken internal:${colors.reset} ${brokenLinks.length}`);
  
  if (brokenLinks.length > 0) {
    console.log(`\n${colors.red}====================================`);
    console.log('   BROKEN LINKS FOUND');
    console.log(`====================================${colors.reset}\n`);
    
    // Group by source file
    const bySource = {};
    for (const link of brokenLinks) {
      const relSource = path.relative(DIST_DIR, link.source);
      if (!bySource[relSource]) bySource[relSource] = [];
      bySource[relSource].push(link);
    }
    
    for (const [source, links] of Object.entries(bySource)) {
      console.log(`${colors.yellow}${source}:${colors.reset}`);
      for (const link of links) {
        console.log(`  ${colors.red}✗${colors.reset} ${link.type}: ${link.url}`);
      }
      console.log('');
    }
    
    // Also check for pattern issues
    console.log(`${colors.cyan}Common patterns in broken links:${colors.reset}`);
    const patterns = {};
    for (const link of brokenLinks) {
      // Extract pattern (first two path segments)
      const urlPath = link.url.split('?')[0].split('#')[0];
      const segments = urlPath.split('/').filter(Boolean).slice(0, 2);
      const pattern = '/' + segments.join('/');
      if (!patterns[pattern]) patterns[pattern] = 0;
      patterns[pattern]++;
    }
    
    const sortedPatterns = Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    for (const [pattern, count] of sortedPatterns) {
      console.log(`  ${pattern}* : ${count} broken`);
    }
  }
  
  return {
    total: results.length,
    valid: validLinks.length,
    external: externalLinks.length,
    broken: brokenLinks.length,
    brokenLinks
  };
}

/**
 * Save detailed report to JSON
 */
function saveDetailedReport(results, summary) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: summary.total,
      valid: summary.valid,
      external: summary.external,
      broken: summary.broken
    },
    brokenLinks: summary.brokenLinks.map(l => ({
      url: l.url,
      type: l.type,
      source: path.relative(DIST_DIR, l.source),
      resolvedPath: l.resolvedPath ? path.relative(DIST_DIR, l.resolvedPath) : null
    }))
  };
  
  const reportPath = path.join(__dirname, '../internal-links-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n${colors.blue}Detailed report saved to: internal-links-report.json${colors.reset}`);
}

/**
 * Main function
 */
async function main() {
  console.log(`\n${colors.cyan}====================================`);
  console.log('   Internal Link Validator');
  console.log(`====================================${colors.reset}\n`);
  
  // Check if dist exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`${colors.red}Error: dist/ folder not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }
  
  // Get all HTML files
  console.log(`${colors.blue}Scanning dist folder for HTML files...${colors.reset}`);
  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);
  
  // Extract and validate all links
  console.log(`${colors.blue}Extracting and validating links...${colors.reset}`);
  const allLinks = [];
  
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractLinks(content, file);
    allLinks.push(...links);
  }
  
  console.log(`Found ${allLinks.length} total links\n`);
  
  // Validate each link
  const results = allLinks.map(validateLink);
  
  // Generate report
  const summary = generateReport(results);
  
  // Save detailed report
  saveDetailedReport(results, summary);
  
  // Exit code
  if (summary.broken > 0) {
    console.log(`\n${colors.red}❌ Found ${summary.broken} broken internal links${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✓ No broken internal links found!${colors.reset}`);
    process.exit(0);
  }
}

main().catch(console.error);
