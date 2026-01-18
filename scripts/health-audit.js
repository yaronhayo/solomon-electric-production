#!/usr/bin/env node

/**
 * Comprehensive Site Health Audit
 * Uses PageSpeed Insights API for factual Lighthouse data
 * Checks: Performance, SEO, Accessibility, Best Practices
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use user's API key
const API_KEY = 'AIzaSyCr4wLLJHFc54QvFIrB6Jtk1P43vvoAK04';
const SITE_URL = 'https://www.247electricianmiami.com';

// Pages to audit
const PAGES_TO_AUDIT = [
  { name: 'Homepage', path: '/' },
  { name: 'Services Index', path: '/services' },
  { name: 'Service Page', path: '/services/electrical-panel-upgrade-100a-to-200a' },
  { name: 'Service+City Page', path: '/services/electrical-panel-upgrade-100a-to-200a/miami' },
  { name: 'Service Areas', path: '/service-areas' },
  { name: 'City Page', path: '/service-areas/miami' },
  { name: 'Blog Index', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function getScoreColor(score) {
  if (score >= 90) return colors.green;
  if (score >= 50) return colors.yellow;
  return colors.red;
}

function formatScore(score) {
  const color = getScoreColor(score);
  return `${color}${score}${colors.reset}`;
}

async function fetchPSI(url, strategy = 'mobile') {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${API_KEY}&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function auditPage(page, strategy = 'mobile') {
  const url = `${SITE_URL}${page.path}`;
  process.stdout.write(`  Auditing ${page.name} (${strategy})... `);
  
  try {
    const result = await fetchPSI(url, strategy);
    
    if (result.error) {
      console.log(`${colors.red}Error: ${result.error.message}${colors.reset}`);
      return null;
    }
    
    const categories = result.lighthouseResult?.categories || {};
    const scores = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    };
    
    console.log(`P:${formatScore(scores.performance)} A:${formatScore(scores.accessibility)} BP:${formatScore(scores.bestPractices)} SEO:${formatScore(scores.seo)}`);
    
    // Get key metrics
    const audits = result.lighthouseResult?.audits || {};
    const metrics = {
      fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
      lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
      cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      tbt: audits['total-blocking-time']?.displayValue || 'N/A',
      speed: audits['speed-index']?.displayValue || 'N/A',
    };
    
    return { page, strategy, scores, metrics, audits };
  } catch (error) {
    console.log(`${colors.red}Failed: ${error.message}${colors.reset}`);
    return null;
  }
}

async function runFullAudit() {
  console.log(`\n${colors.cyan}=========================================`);
  console.log('  Comprehensive Site Health Audit');
  console.log(`=========================================${colors.reset}\n`);
  console.log(`Site: ${SITE_URL}`);
  console.log(`Using: PageSpeed Insights API (Lighthouse data)\n`);
  
  const results = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    mobile: [],
    desktop: [],
  };
  
  // Mobile audits
  console.log(`${colors.blue}📱 Mobile Audits${colors.reset}`);
  console.log(`${'─'.repeat(60)}`);
  for (const page of PAGES_TO_AUDIT) {
    const result = await auditPage(page, 'mobile');
    if (result) results.mobile.push(result);
    // Rate limit
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('');
  
  // Desktop audits (subset)
  console.log(`${colors.blue}🖥️  Desktop Audits${colors.reset}`);
  console.log(`${'─'.repeat(60)}`);
  for (const page of PAGES_TO_AUDIT.slice(0, 4)) {
    const result = await auditPage(page, 'desktop');
    if (result) results.desktop.push(result);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Summary
  console.log(`\n${colors.cyan}=========================================`);
  console.log('  Summary');
  console.log(`=========================================${colors.reset}\n`);
  
  const allScores = [...results.mobile, ...results.desktop].filter(r => r);
  
  if (allScores.length > 0) {
    const avgMobile = {
      performance: Math.round(results.mobile.reduce((sum, r) => sum + r.scores.performance, 0) / results.mobile.length),
      accessibility: Math.round(results.mobile.reduce((sum, r) => sum + r.scores.accessibility, 0) / results.mobile.length),
      bestPractices: Math.round(results.mobile.reduce((sum, r) => sum + r.scores.bestPractices, 0) / results.mobile.length),
      seo: Math.round(results.mobile.reduce((sum, r) => sum + r.scores.seo, 0) / results.mobile.length),
    };
    
    console.log(`${colors.blue}Mobile Averages:${colors.reset}`);
    console.log(`  Performance:    ${formatScore(avgMobile.performance)}`);
    console.log(`  Accessibility:  ${formatScore(avgMobile.accessibility)}`);
    console.log(`  Best Practices: ${formatScore(avgMobile.bestPractices)}`);
    console.log(`  SEO:            ${formatScore(avgMobile.seo)}`);
    
    // Find issues
    console.log(`\n${colors.yellow}⚠️  Potential Issues:${colors.reset}`);
    
    let issueCount = 0;
    for (const result of allScores) {
      if (result.scores.performance < 50) {
        console.log(`  ${colors.red}✗${colors.reset} ${result.page.name} (${result.strategy}): Performance ${result.scores.performance} - needs optimization`);
        issueCount++;
      }
      if (result.scores.accessibility < 90) {
        console.log(`  ${colors.yellow}!${colors.reset} ${result.page.name} (${result.strategy}): Accessibility ${result.scores.accessibility} - should be 90+`);
        issueCount++;
      }
      if (result.scores.seo < 90) {
        console.log(`  ${colors.yellow}!${colors.reset} ${result.page.name} (${result.strategy}): SEO ${result.scores.seo} - should be 90+`);
        issueCount++;
      }
    }
    
    if (issueCount === 0) {
      console.log(`  ${colors.green}✓ No critical issues found!${colors.reset}`);
    }
    
    // Core Web Vitals from first result
    const firstResult = results.mobile[0];
    if (firstResult) {
      console.log(`\n${colors.blue}Core Web Vitals (Homepage):${colors.reset}`);
      console.log(`  FCP (First Contentful Paint):    ${firstResult.metrics.fcp}`);
      console.log(`  LCP (Largest Contentful Paint):  ${firstResult.metrics.lcp}`);
      console.log(`  CLS (Cumulative Layout Shift):   ${firstResult.metrics.cls}`);
      console.log(`  TBT (Total Blocking Time):       ${firstResult.metrics.tbt}`);
    }
  }
  
  // Save full report
  fs.writeFileSync(
    path.join(__dirname, '../health-audit-report.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`\n${colors.dim}Full report saved to: health-audit-report.json${colors.reset}`);
}

runFullAudit().catch(console.error);
