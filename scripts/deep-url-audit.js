#!/usr/bin/env node
/**
 * Deep URL Audit Script
 * Comprehensive audit of all HTML files in dist/
 * Checks: H1 tags, schema, OG tags, meta descriptions, noindex, 
 *         sitemap completeness, orphan pages, external links, heading hierarchy
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const SITE_URL = 'https://www.247electricianmiami.com';

// Known intentional exclusions (verified as correct)
const EXPECTED_NOINDEX = new Set(['404.html', '500.html', 'branding/index.html', 'thank-you/index.html']);
const EXPECTED_ORPHANS = new Set(['branding/', 'thank-you/']);
const EXPECTED_SITEMAP_MISSING = new Set(['index/']); // homepage false positive

// Collect all HTML index files
function getAllHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllHtmlFiles(fullPath));
    } else if (entry.name === 'index.html' || (entry.name.endsWith('.html') && !entry.name.startsWith('_'))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract URLs from sitemap XML files
function getSitemapUrls() {
  const urls = new Set();
  const sitemapFiles = fs.readdirSync(DIST_DIR)
    .filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
  
  for (const file of sitemapFiles) {
    const content = fs.readFileSync(path.join(DIST_DIR, file), 'utf-8');
    // Check if it's a sitemap index
    if (content.includes('<sitemapindex')) {
      // Extract sitemap file references
      const sitemapRefs = content.match(/<loc>([^<]+)<\/loc>/g) || [];
      for (const ref of sitemapRefs) {
        const url = ref.replace('<loc>', '').replace('</loc>', '');
        const localFile = url.replace(SITE_URL + '/', '');
        const localPath = path.join(DIST_DIR, localFile);
        if (fs.existsSync(localPath)) {
          const subContent = fs.readFileSync(localPath, 'utf-8');
          const subUrls = subContent.match(/<loc>([^<]+)<\/loc>/g) || [];
          for (const u of subUrls) {
            urls.add(u.replace('<loc>', '').replace('</loc>', ''));
          }
        }
      }
    } else {
      const fileUrls = content.match(/<loc>([^<]+)<\/loc>/g) || [];
      for (const u of fileUrls) {
        urls.add(u.replace('<loc>', '').replace('</loc>', ''));
      }
    }
  }
  return urls;
}

// Convert dist file path to expected canonical URL
function fileToUrl(filePath) {
  let rel = path.relative(DIST_DIR, filePath);
  rel = rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  if (rel === 'index.html') rel = '';
  return SITE_URL + '/' + rel;
}

// Extract all external URLs from HTML
function extractExternalUrls(html) {
  const regex = /<a[^>]+href=["'](https?:\/\/[^"'#?]+)/gi;
  const urls = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    if (!url.startsWith(SITE_URL)) {
      urls.push(url);
    }
  }
  return urls;
}

// Check heading hierarchy
function checkHeadingHierarchy(html) {
  const headings = [];
  const regex = /<h([1-6])[^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push(parseInt(match[1]));
  }
  
  const issues = [];
  if (headings.length === 0) return ['No headings found'];
  if (headings[0] !== 1) issues.push('First heading is not H1');
  
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i-1] + 1) {
      issues.push(`Skipped heading level: H${headings[i-1]} → H${headings[i]}`);
      break; // Only report first skip
    }
  }
  
  return issues;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ not found');
    process.exit(1);
  }

  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  console.log(`\n🔍 Deep URL Audit — Scanning ${htmlFiles.length} HTML files\n`);

  // Counters
  const results = {
    total: htmlFiles.length,
    missingH1: [],
    multipleH1: [],
    noSchema: [],
    noOgTitle: [],
    noMetaDesc: [],
    noindex: [],
    headingSkips: [],
    duplicateTitles: new Map(),
    duplicateDescs: new Map(),
    externalLinks: new Map(),
    missingFromSitemap: [],
    orphanPages: [],
  };

  // Collect all titles and descriptions for duplicate check
  const allTitles = new Map();
  const allDescs = new Map();

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    const rel = path.relative(DIST_DIR, file);

    // H1 check
    const h1Matches = html.match(/<h1[\s>]/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    if (h1Count === 0) results.missingH1.push(rel);
    else if (h1Count > 1) results.multipleH1.push({ page: rel, count: h1Count });

    // Schema check
    if (!html.includes('application/ld+json')) results.noSchema.push(rel);

    // OG check
    if (!html.includes('og:title')) results.noOgTitle.push(rel);

    // Meta description check
    if (!html.includes('name="description"')) results.noMetaDesc.push(rel);

    // Noindex check
    if (html.includes('noindex')) results.noindex.push(rel);

    // Title duplicate check
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      const title = titleMatch[1];
      if (!allTitles.has(title)) allTitles.set(title, []);
      allTitles.get(title).push(rel);
    }

    // Description duplicate check
    const descMatch = html.match(/name="description"\s+content="([^"]*)"/);
    if (descMatch) {
      const desc = descMatch[1];
      if (desc.length > 0) {
        if (!allDescs.has(desc)) allDescs.set(desc, []);
        allDescs.get(desc).push(rel);
      }
    }

    // Heading hierarchy check
    const hierarchyIssues = checkHeadingHierarchy(html);
    if (hierarchyIssues.length > 0) {
      results.headingSkips.push({ page: rel, issues: hierarchyIssues });
    }

    // External link collection
    const extUrls = extractExternalUrls(html);
    for (const url of extUrls) {
      if (!results.externalLinks.has(url)) results.externalLinks.set(url, []);
      results.externalLinks.get(url).push(rel);
    }
  }

  // Sitemap completeness check
  const sitemapUrls = getSitemapUrls();
  const distUrls = new Set(htmlFiles.map(f => fileToUrl(f)));

  // Pages in dist but not in sitemap
  for (const url of distUrls) {
    if (!sitemapUrls.has(url)) {
      const rel = url.replace(SITE_URL + '/', '');
      // Skip expected exclusions
      if (!rel.includes('404') && !rel.includes('500') && 
          !rel.includes('thank-you') && !rel.includes('branding')) {
        results.missingFromSitemap.push(rel);
      }
    }
  }

  // Find duplicate titles
  for (const [title, pages] of allTitles) {
    if (pages.length > 1) {
      results.duplicateTitles.set(title, pages);
    }
  }

  // Find duplicate descriptions
  for (const [desc, pages] of allDescs) {
    if (pages.length > 1) {
      results.duplicateDescs.set(desc, pages);
    }
  }

  // Internal link graph for orphan detection
  const linkGraph = new Map();
  for (const file of htmlFiles) {
    const rel = path.relative(DIST_DIR, file);
    linkGraph.set(rel, new Set());
  }

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    const hrefRegex = /<a[^>]+href=["']([^"'#?]+)/gi;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      let href = match[1].replace(SITE_URL, '');
      if (href.startsWith('http')) continue;
      if (!href.startsWith('/')) continue;
      
      // Normalize to dist path
      href = href.replace(/^\//, '').replace(/\/$/, '');
      const possiblePaths = [
        href + '/index.html',
        href + '.html',
        href,
      ];
      for (const p of possiblePaths) {
        if (linkGraph.has(p)) {
          linkGraph.get(p).add(path.relative(DIST_DIR, file));
          break;
        }
      }
    }
  }

  // Pages not linked from any other page (orphans)
  for (const [page, incomingLinks] of linkGraph) {
    if (incomingLinks.size === 0 && page !== 'index.html') {
      const rel = page.replace('/index.html', '/');
      if (!rel.includes('404') && !rel.includes('500')) {
        results.orphanPages.push(rel);
      }
    }
  }

  // ==================== REPORT ====================
  console.log('═'.repeat(60));
  console.log('  DEEP URL AUDIT REPORT');
  console.log('═'.repeat(60));

  // 1. H1 Tags
  console.log('\n📌 H1 TAG AUDIT');
  console.log(`   Missing H1: ${results.missingH1.length}`);
  for (const p of results.missingH1.slice(0, 10)) console.log(`     ❌ ${p}`);
  console.log(`   Multiple H1: ${results.multipleH1.length}`);
  for (const p of results.multipleH1.slice(0, 10)) console.log(`     ⚠️  ${p.page} (${p.count} H1s)`);

  // 2. Schema
  console.log('\n📌 SCHEMA MARKUP (application/ld+json)');
  console.log(`   Without schema: ${results.noSchema.length}`);
  for (const p of results.noSchema.slice(0, 10)) console.log(`     ❌ ${p}`);

  // 3. OG Tags
  console.log('\n📌 OPEN GRAPH TAGS');
  console.log(`   Without og:title: ${results.noOgTitle.length}`);
  for (const p of results.noOgTitle.slice(0, 10)) console.log(`     ❌ ${p}`);

  // 4. Meta Description
  console.log('\n📌 META DESCRIPTIONS');
  console.log(`   Without meta description: ${results.noMetaDesc.length}`);
  for (const p of results.noMetaDesc.slice(0, 10)) console.log(`     ❌ ${p}`);

  // 5. Noindex
  const expectedNoindex = results.noindex.filter(p => EXPECTED_NOINDEX.has(p));
  const unexpectedNoindex = results.noindex.filter(p => !EXPECTED_NOINDEX.has(p));
  console.log('\n📌 NOINDEX CHECK');
  console.log(`   Pages with noindex: ${results.noindex.length} (${expectedNoindex.length} expected, ${unexpectedNoindex.length} unexpected)`);
  for (const p of expectedNoindex) console.log(`     ✔️  ${p} (expected)`);
  for (const p of unexpectedNoindex) console.log(`     🚫 ${p}`);

  // 6. Duplicate Titles
  console.log('\n📌 DUPLICATE TITLES');
  console.log(`   Duplicate title groups: ${results.duplicateTitles.size}`);
  let titleCount = 0;
  for (const [title, pages] of results.duplicateTitles) {
    if (titleCount++ >= 5) { console.log('     ... and more'); break; }
    console.log(`     ⚠️  "${title.substring(0, 60)}..." (${pages.length} pages)`);
  }

  // 7. Duplicate Descriptions
  console.log('\n📌 DUPLICATE META DESCRIPTIONS');
  console.log(`   Duplicate description groups: ${results.duplicateDescs.size}`);
  let descCount = 0;
  for (const [desc, pages] of results.duplicateDescs) {
    if (descCount++ >= 5) { console.log('     ... and more'); break; }
    console.log(`     ⚠️  "${desc.substring(0, 50)}..." (${pages.length} pages)`);
  }

  // 8. Heading Hierarchy
  console.log('\n📌 HEADING HIERARCHY');
  console.log(`   Pages with hierarchy issues: ${results.headingSkips.length}`);
  for (const p of results.headingSkips.slice(0, 10)) {
    console.log(`     ⚠️  ${p.page}: ${p.issues.join(', ')}`);
  }

  // 9. Sitemap Completeness
  const unexpectedSitemapMissing = results.missingFromSitemap.filter(p => !EXPECTED_SITEMAP_MISSING.has(p));
  const expectedSitemapMissing = results.missingFromSitemap.filter(p => EXPECTED_SITEMAP_MISSING.has(p));
  console.log('\n📌 SITEMAP COMPLETENESS');
  console.log(`   Sitemap URLs: ${sitemapUrls.size}`);
  console.log(`   Pages in dist: ${distUrls.size}`);
  console.log(`   Missing from sitemap: ${results.missingFromSitemap.length} (${expectedSitemapMissing.length} expected, ${unexpectedSitemapMissing.length} unexpected)`);
  for (const p of expectedSitemapMissing) console.log(`     ✔️  ${p} (homepage — expected)`);
  for (const p of unexpectedSitemapMissing.slice(0, 10)) console.log(`     ❌ ${p}`);

  // 10. Orphan Pages
  const unexpectedOrphans = results.orphanPages.filter(p => !EXPECTED_ORPHANS.has(p));
  const expectedOrphans = results.orphanPages.filter(p => EXPECTED_ORPHANS.has(p));
  console.log('\n📌 ORPHAN PAGES (not linked from any other page)');
  console.log(`   Orphan pages: ${results.orphanPages.length} (${expectedOrphans.length} expected, ${unexpectedOrphans.length} unexpected)`);
  for (const p of expectedOrphans) console.log(`     ✔️  ${p} (expected)`);
  for (const p of unexpectedOrphans.slice(0, 15)) console.log(`     🔗 ${p}`);

  // 11. External Links Summary
  console.log('\n📌 EXTERNAL LINKS');
  console.log(`   Unique external domains: ${new Set([...results.externalLinks.keys()].map(u => new URL(u).hostname)).size}`);
  console.log(`   Unique external URLs: ${results.externalLinks.size}`);

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('  SUMMARY SCORECARD');
  console.log('═'.repeat(60));
  const checks = [
    ['H1 Tags (1 per page)', results.missingH1.length === 0 && results.multipleH1.length === 0],
    ['Schema Markup', results.noSchema.length === 0],
    ['Open Graph Tags', results.noOgTitle.length === 0],
    ['Meta Descriptions', results.noMetaDesc.length === 0],
    ['No Noindex Leaks', unexpectedNoindex.length === 0],
    ['Unique Titles', results.duplicateTitles.size === 0],
    ['Unique Descriptions', results.duplicateDescs.size === 0],
    ['Heading Hierarchy', results.headingSkips.length === 0],
    ['Sitemap Complete', unexpectedSitemapMissing.length === 0],
    ['No Orphan Pages', unexpectedOrphans.length === 0],
  ];

  let passed = 0;
  for (const [name, ok] of checks) {
    console.log(`   ${ok ? '✅' : '❌'} ${name}`);
    if (ok) passed++;
  }
  console.log(`\n   Score: ${passed}/${checks.length}`);
  console.log('');

  process.exit(passed === checks.length ? 0 : 1);
}

main();
