#!/usr/bin/env node

/**
 * Comprehensive Site Health Checks
 * Validates: sitemap, meta tags, schema markup, HTML structure, SEO elements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '../dist');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

let totalIssues = 0;
let totalChecks = 0;
let warnings = [];
let errors = [];

function pass(msg) {
  totalChecks++;
  console.log(`  ${colors.green}✓${colors.reset} ${msg}`);
}

function warn(msg) {
  totalChecks++;
  warnings.push(msg);
  console.log(`  ${colors.yellow}!${colors.reset} ${msg}`);
}

function fail(msg) {
  totalChecks++;
  totalIssues++;
  errors.push(msg);
  console.log(`  ${colors.red}✗${colors.reset} ${msg}`);
}

// Get all HTML files
function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Check 1: Sitemap validation
function checkSitemap() {
  console.log(`\n${colors.blue}📍 Sitemap Validation${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  const sitemapIndex = path.join(DIST_DIR, 'sitemap-index.xml');
  const sitemap0 = path.join(DIST_DIR, 'sitemap-0.xml');
  
  if (fs.existsSync(sitemapIndex)) {
    const content = fs.readFileSync(sitemapIndex, 'utf-8');
    const sitemapCount = (content.match(/<sitemap>/g) || []).length;
    pass(`sitemap-index.xml exists with ${sitemapCount} sitemap(s)`);
  } else {
    fail('sitemap-index.xml not found');
  }
  
  if (fs.existsSync(sitemap0)) {
    const content = fs.readFileSync(sitemap0, 'utf-8');
    const urlCount = (content.match(/<url>/g) || []).length;
    if (urlCount > 1800) {
      pass(`sitemap-0.xml has ${urlCount} URLs (expected ~1823)`);
    } else {
      warn(`sitemap-0.xml has only ${urlCount} URLs (expected ~1823)`);
    }
  } else {
    fail('sitemap-0.xml not found');
  }
}

// Check 2: robots.txt
function checkRobots() {
  console.log(`\n${colors.blue}🤖 Robots.txt Validation${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  const robotsPath = path.join(DIST_DIR, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const content = fs.readFileSync(robotsPath, 'utf-8');
    if (content.includes('Sitemap:')) {
      pass('robots.txt references sitemap');
    } else {
      warn('robots.txt missing sitemap reference');
    }
    if (content.includes('Allow: /')) {
      pass('robots.txt allows crawling');
    }
  } else {
    fail('robots.txt not found');
  }
}

// Check 3: Meta tags on sample pages
function checkMetaTags() {
  console.log(`\n${colors.blue}🏷️  Meta Tags Validation${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  const samplePages = [
    'index.html',
    'about/index.html',
    'services/index.html',
    'services/electrical-panel-upgrade-100a-to-200a/index.html',
    'blog/index.html',
    'contact/index.html',
  ];
  
  let metaIssues = 0;
  
  for (const pagePath of samplePages) {
    const fullPath = path.join(DIST_DIR, pagePath);
    if (!fs.existsSync(fullPath)) continue;
    
    const html = fs.readFileSync(fullPath, 'utf-8');
    const pageName = pagePath.replace('/index.html', '') || 'homepage';
    
    // Check title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (!titleMatch || titleMatch[1].length < 10) {
      metaIssues++;
      warn(`${pageName}: Missing or short title`);
    }
    
    // Check meta description  
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
    if (!descMatch) {
      metaIssues++;
      warn(`${pageName}: Missing meta description`);
    } else if (descMatch[1].length < 50) {
      metaIssues++;
      warn(`${pageName}: Meta description too short (${descMatch[1].length} chars)`);
    }
    
    // Check canonical
    if (!html.includes('rel="canonical"')) {
      metaIssues++;
      warn(`${pageName}: Missing canonical tag`);
    }
    
    // Check OG tags
    if (!html.includes('og:title')) {
      metaIssues++;
      warn(`${pageName}: Missing Open Graph tags`);
    }
  }
  
  if (metaIssues === 0) {
    pass(`All ${samplePages.length} sample pages have complete meta tags`);
  }
}

// Check 4: Schema markup
function checkSchema() {
  console.log(`\n${colors.blue}📊 Schema Markup Validation${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  const homepage = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(homepage)) {
    const html = fs.readFileSync(homepage, 'utf-8');
    
    if (html.includes('application/ld+json')) {
      const schemaCount = (html.match(/application\/ld\+json/g) || []).length;
      pass(`Homepage has ${schemaCount} schema markup block(s)`);
      
      // Check for key schema types
      if (html.includes('@type":"Organization') || html.includes('@type": "Organization')) {
        pass('Organization schema present');
      }
      if (html.includes('@type":"LocalBusiness') || html.includes('@type":"ElectricalContractor')) {
        pass('LocalBusiness/ElectricalContractor schema present');
      }
    } else {
      fail('No JSON-LD schema markup found on homepage');
    }
  }
  
  // Check service page
  const servicePage = path.join(DIST_DIR, 'services/electrical-panel-upgrade-100a-to-200a/index.html');
  if (fs.existsSync(servicePage)) {
    const html = fs.readFileSync(servicePage, 'utf-8');
    if (html.includes('@type":"Service') || html.includes('@type": "Service')) {
      pass('Service schema present on service pages');
    }
    if (html.includes('@type":"FAQPage') || html.includes('@type": "FAQPage')) {
      pass('FAQ schema present on service pages');
    }
  }
}

// Check 5: Accessibility basics
function checkAccessibility() {
  console.log(`\n${colors.blue}♿ Accessibility Checks${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  const homepage = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(homepage)) {
    const html = fs.readFileSync(homepage, 'utf-8');
    
    // Check lang attribute
    if (html.includes('lang="en"')) {
      pass('HTML lang attribute present');
    } else {
      fail('Missing lang attribute on <html> tag');
    }
    
    // Check viewport
    if (html.includes('viewport')) {
      pass('Viewport meta tag present');
    }
    
    // Check skip link
    if (html.includes('skip-to-content') || html.includes('Skip to')) {
      pass('Skip to content link present');
    } else {
      warn('Skip to content link not found');
    }
    
    // Check image alt attributes (sample)
    const imgCount = (html.match(/<img/g) || []).length;
    const imgWithAlt = (html.match(/<img[^>]+alt=/g) || []).length;
    if (imgCount > 0) {
      const pct = Math.round((imgWithAlt / imgCount) * 100);
      if (pct >= 90) {
        pass(`${pct}% of images have alt attributes`);
      } else {
        warn(`Only ${pct}% of images have alt attributes`);
      }
    }
  }
}

// Check 6: Performance hints
function checkPerformance() {
  console.log(`\n${colors.blue}⚡ Performance Optimization${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  const homepage = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(homepage)) {
    const html = fs.readFileSync(homepage, 'utf-8');
    
    // Check preconnect
    if (html.includes('preconnect')) {
      const preconnects = (html.match(/rel="preconnect"/g) || []).length;
      pass(`${preconnects} preconnect hints found`);
    }
    
    // Check for async/defer on scripts
    const scripts = html.match(/<script[^>]*src=/g) || [];
    const asyncDefer = scripts.filter(s => s.includes('async') || s.includes('defer') || s.includes('module')).length;
    if (scripts.length > 0) {
      const pct = Math.round((asyncDefer / scripts.length) * 100);
      if (pct >= 80) {
        pass(`${pct}% of scripts use async/defer/module`);
      } else {
        warn(`Only ${pct}% of scripts use async/defer`);
      }
    }
    
    // Check for critical CSS / font loading
    if (html.includes('@fontsource') || html.includes('font-display')) {
      pass('Font optimization detected');
    }
  }
  
  // Check asset optimization
  const astroDir = path.join(DIST_DIR, '_astro');
  if (fs.existsSync(astroDir)) {
    const files = fs.readdirSync(astroDir);
    const jsFiles = files.filter(f => f.endsWith('.js')).length;
    const cssFiles = files.filter(f => f.endsWith('.css')).length;
    pass(`Assets bundled: ${jsFiles} JS files, ${cssFiles} CSS files`);
  }
}

// Check 7: 404 and error pages
function checkErrorPages() {
  console.log(`\n${colors.blue}🚨 Error Pages${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  if (fs.existsSync(path.join(DIST_DIR, '404.html'))) {
    pass('Custom 404 page exists');
  } else {
    warn('No custom 404 page');
  }
  
  if (fs.existsSync(path.join(DIST_DIR, '500.html'))) {
    pass('Custom 500 error page exists');
  } else {
    warn('No custom 500 error page');
  }
}

// Check 8: Page count summary
function checkPageCount() {
  console.log(`\n${colors.blue}📄 Page Statistics${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  const allHtml = getAllHtmlFiles(DIST_DIR);
  pass(`Total HTML pages: ${allHtml.length}`);
  
  // Count by section
  const sections = {
    services: allHtml.filter(f => f.includes('/services/')).length,
    serviceAreas: allHtml.filter(f => f.includes('/service-areas/')).length,
    blog: allHtml.filter(f => f.includes('/blog/')).length,
    other: 0
  };
  sections.other = allHtml.length - sections.services - sections.serviceAreas - sections.blog;
  
  console.log(`  ${colors.dim}  - Services: ${sections.services}`);
  console.log(`    - Service Areas: ${sections.serviceAreas}`);
  console.log(`    - Blog: ${sections.blog}`);
  console.log(`    - Other: ${sections.other}${colors.reset}`);
}

// Main
async function main() {
  console.log(`\n${colors.cyan}=========================================`);
  console.log('  Comprehensive Site Health Checks');
  console.log(`=========================================${colors.reset}`);
  console.log(`${colors.dim}Scanning: ${DIST_DIR}${colors.reset}`);
  
  checkSitemap();
  checkRobots();
  checkMetaTags();
  checkSchema();
  checkAccessibility();
  checkPerformance();
  checkErrorPages();
  checkPageCount();
  
  // Summary
  console.log(`\n${colors.cyan}=========================================`);
  console.log('  Summary');
  console.log(`=========================================${colors.reset}`);
  
  console.log(`\n  Total checks: ${totalChecks}`);
  console.log(`  ${colors.green}Passed: ${totalChecks - totalIssues - warnings.length}${colors.reset}`);
  console.log(`  ${colors.yellow}Warnings: ${warnings.length}${colors.reset}`);
  console.log(`  ${colors.red}Errors: ${totalIssues}${colors.reset}`);
  
  if (totalIssues === 0 && warnings.length === 0) {
    console.log(`\n${colors.green}✓ All checks passed!${colors.reset}`);
  } else if (totalIssues === 0) {
    console.log(`\n${colors.yellow}⚠ Some minor issues to review${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ Critical issues found${colors.reset}`);
    process.exit(1);
  }
}

main().catch(console.error);
