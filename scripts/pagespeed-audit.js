#!/usr/bin/env node
/**
 * PageSpeed Insights CLI Tool
 * Usage: node scripts/pagespeed-audit.js [url] [--desktop]
 * 
 * Runs PageSpeed Insights API and outputs Lighthouse scores + issues
 */

import https from 'https';

const API_KEY = process.env.PSI_API_KEY || 'AIzaSyCPUa0e_IB0rB5UeJrWa3__Lohkm7HB9hY';
const DEFAULT_URL = 'https://www.247electricianmiami.com/';

async function runPageSpeed(url, strategy = 'mobile') {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?` +
      `url=${encodeURIComponent(url)}&` +
      `strategy=${strategy}&` +
      `category=performance&category=accessibility&category=best-practices&category=seo` +
      (API_KEY ? `&key=${API_KEY}` : '');

    console.log(`\n🔍 Running ${strategy.toUpperCase()} test for: ${url}\n`);

    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      });
    }).on('error', reject);
  });
}

function displayResults(data, strategy) {
  if (data.error) {
    console.log('❌ Error:', data.error.message);
    return null;
  }

  const cats = data.lighthouseResult.categories;
  const audits = data.lighthouseResult.audits;

  const emoji = strategy === 'mobile' ? '📱' : '🖥️';
  const title = strategy.toUpperCase();

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log(`║ ${emoji} ${title} LIGHTHOUSE SCORES`.padEnd(65) + '║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  
  const perfScore = Math.round(cats.performance.score * 100);
  const a11yScore = Math.round(cats.accessibility.score * 100);
  const bpScore = Math.round(cats['best-practices'].score * 100);
  const seoScore = Math.round(cats.seo.score * 100);

  const getColor = (score) => score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';

  console.log(`║ ${getColor(perfScore)} Performance:    ${String(perfScore).padEnd(47)}║`);
  console.log(`║ ${getColor(a11yScore)} Accessibility:  ${String(a11yScore).padEnd(47)}║`);
  console.log(`║ ${getColor(bpScore)} Best Practices: ${String(bpScore).padEnd(47)}║`);
  console.log(`║ ${getColor(seoScore)} SEO:            ${String(seoScore).padEnd(47)}║`);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║ CORE WEB VITALS                                               ║');
  
  const fcp = audits['first-contentful-paint']?.displayValue || 'N/A';
  const lcp = audits['largest-contentful-paint']?.displayValue || 'N/A';
  const cls = audits['cumulative-layout-shift']?.displayValue || 'N/A';
  const tbt = audits['total-blocking-time']?.displayValue || 'N/A';
  const si = audits['speed-index']?.displayValue || 'N/A';

  console.log(`║  FCP:  ${String(fcp).padEnd(56)}║`);
  console.log(`║  LCP:  ${String(lcp).padEnd(56)}║`);
  console.log(`║  CLS:  ${String(cls).padEnd(56)}║`);
  console.log(`║  TBT:  ${String(tbt).padEnd(56)}║`);
  console.log(`║  SI:   ${String(si).padEnd(56)}║`);
  console.log('╚════════════════════════════════════════════════════════════════╝');

  // Collect failed audits
  const issues = [];
  for (const [key, audit] of Object.entries(audits)) {
    if (audit.score !== null && 
        audit.score < 0.9 && 
        audit.scoreDisplayMode !== 'informative' && 
        audit.scoreDisplayMode !== 'notApplicable' && 
        audit.scoreDisplayMode !== 'manual') {
      issues.push({
        id: key,
        title: audit.title,
        score: Math.round(audit.score * 100),
        displayValue: audit.displayValue || '',
        description: audit.description
      });
    }
  }

  if (issues.length) {
    console.log(`\n🔴 Issues to Fix (${issues.length}):`);
    issues.sort((a, b) => a.score - b.score).slice(0, 15).forEach(i => {
      const scoreStr = `[${i.score}%]`;
      console.log(`  ${scoreStr.padEnd(7)} ${i.title}${i.displayValue ? ` (${i.displayValue})` : ''}`);
    });
  } else {
    console.log('\n✅ No major issues found!');
  }

  return { scores: { perfScore, a11yScore, bpScore, seoScore }, issues };
}

async function main() {
  const args = process.argv.slice(2);
  const url = args.find(a => a.startsWith('http')) || DEFAULT_URL;
  const isDesktop = args.includes('--desktop');
  const runBoth = args.includes('--both') || (!args.includes('--mobile') && !args.includes('--desktop'));

  console.log('🚀 PageSpeed Insights Audit\n');
  console.log(`📍 URL: ${url}`);

  try {
    if (runBoth || !isDesktop) {
      const mobileData = await runPageSpeed(url, 'mobile');
      displayResults(mobileData, 'mobile');
    }

    if (runBoth || isDesktop) {
      if (runBoth) console.log('\n' + '─'.repeat(68) + '\n');
      const desktopData = await runPageSpeed(url, 'desktop');
      displayResults(desktopData, 'desktop');
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
