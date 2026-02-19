#!/usr/bin/env node
/**
 * Internal Link Crawler
 * Scans all HTML files in dist/ and validates that every internal <a href>
 * resolves to an existing file. Reports broken links with source and target.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const SITE_URL = 'https://www.247electricianmiami.com';

// Collect all HTML files in dist/
function getAllHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract all href values from HTML
function extractHrefs(html) {
  const regex = /<a[^>]+href=["']([^"'#?]+)/gi;
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

// Normalize a URL path to a filesystem path in dist/
function resolveToFile(href) {
  // Skip external links, mailto, tel, javascript BEFORE any transformation
  if (href.startsWith('mailto:') || href.startsWith('tel:') ||
      href.startsWith('javascript:') || href.startsWith('data:') ||
      href.startsWith('//')) {
    return null;
  }

  // Skip external URLs (any http(s) that isn't our own site)
  if ((href.startsWith('http://') || href.startsWith('https://')) &&
      !href.startsWith(SITE_URL)) {
    return null;
  }

  // Strip our own site URL prefix if present
  let urlPath = href.replace(SITE_URL, '');

  // Skip anchor-only links and asset paths
  if (urlPath.startsWith('#') || urlPath.startsWith('/_astro/') ||
      urlPath.match(/\.(css|js|png|jpg|jpeg|webp|avif|svg|ico|woff|woff2|ttf|eot|xml|json|txt|pdf|php)$/i)) {
    return null;
  }

  if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;

  // Try as directory with index.html
  const asDir = path.join(DIST_DIR, urlPath, 'index.html');
  if (fs.existsSync(asDir)) return asDir;

  // Try as .html file
  const asHtml = path.join(DIST_DIR, urlPath + '.html');
  if (fs.existsSync(asHtml)) return asHtml;

  // Try exact path
  const exact = path.join(DIST_DIR, urlPath);
  if (fs.existsSync(exact)) return exact;

  // Try stripping trailing slash
  const stripped = urlPath.replace(/\/$/, '');
  const strippedDir = path.join(DIST_DIR, stripped, 'index.html');
  if (fs.existsSync(strippedDir)) return strippedDir;
  const strippedHtml = path.join(DIST_DIR, stripped + '.html');
  if (fs.existsSync(strippedHtml)) return strippedHtml;

  return false;
}

// Main
function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  console.log(`\n🔍 Scanning ${htmlFiles.length} HTML files for internal links...\n`);

  const brokenLinks = [];
  const checkedLinks = new Set();
  let totalLinks = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    const hrefs = extractHrefs(html);
    const relPath = path.relative(DIST_DIR, file);

    for (const href of hrefs) {
      totalLinks++;
      const resolved = resolveToFile(href);

      if (resolved === null) continue;
      if (resolved === false) {
        const key = `${relPath} → ${href}`;
        if (!checkedLinks.has(key)) {
          checkedLinks.add(key);
          brokenLinks.push({ source: relPath, target: href });
        }
      }
    }
  }

  const uniqueTargets = [...new Set(brokenLinks.map(b => b.target))];

  console.log(`📊 Results:`);
  console.log(`   Total <a href> links scanned: ${totalLinks}`);
  console.log(`   HTML files scanned: ${htmlFiles.length}`);
  console.log(`   Broken internal links: ${brokenLinks.length}`);
  console.log(`   Unique broken targets: ${uniqueTargets.length}\n`);

  if (brokenLinks.length === 0) {
    console.log('✅ All internal links are valid!\n');
    process.exit(0);
  }

  console.log('❌ Broken Links Found:\n');

  for (const target of uniqueTargets.sort()) {
    const sources = brokenLinks
      .filter(b => b.target === target)
      .map(b => b.source);
    console.log(`  🔗 ${target}`);
    const shown = sources.slice(0, 3);
    for (const src of shown) {
      console.log(`     ← ${src}`);
    }
    if (sources.length > 3) {
      console.log(`     ... and ${sources.length - 3} more files`);
    }
    console.log('');
  }

  process.exit(1);
}

main();
