#!/usr/bin/env node
/**
 * PageSpeed Insights CLI Tool
 * 
 * Usage:
 *   node scripts/pagespeed-audit.js [url] [--desktop] [--mobile] [--both]
 */

import https from 'https';
import { loadEnv } from 'vite';
import fs from 'fs';
import path from 'path';

// Load environment variables
const env = Object.assign(process.env, loadEnv('', process.cwd(), ''));
const API_KEY = env.PSI_API_KEY || '';
const DEFAULT_URL = 'https://solomonelectric.com/';

// Parse arguments
const args = process.argv.slice(2);
let targetUrl = DEFAULT_URL;
let strategy = 'mobile';

if (args.length > 0) {
  for (const arg of args) {
    if (arg.startsWith('http')) {
      targetUrl = arg;
    } else if (arg === '--desktop') {
      strategy = 'desktop';
    } else if (arg === '--mobile') {
      strategy = 'mobile';
    } else if (arg === '--both') {
      strategy = 'both';
    }
  }
}

async function runAudit(url, strat) {
  console.log(`\n🚀 Starting PageSpeed Audit for: ${url} (${strat})`);
  
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strat}${API_KEY ? `&key=${API_KEY}` : ''}`;

  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Referer': 'https://www.google.com/'
      }
    };

    https.get(apiUrl, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message));
            return;
          }
          resolve(json);
        } catch (e) {
          reject(new Error('Failed to parse response: ' + e.message));
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

function displayResults(json, strat) {
  const lighthouse = json.lighthouseResult;
  const categories = lighthouse.categories;
  const auditResults = lighthouse.audits;

  const score = (categories.performance.score * 100).toFixed(0);
  const color = score >= 90 ? '🟢' : score >= 50 ? '🟠' : '🔴';

  console.log(`\n--- Results for ${strat.toUpperCase()} ---`);
  console.log(`${color} Performance Score: ${score}/100`);
  
  const metrics = {
    'First Contentful Paint': auditResults['first-contentful-paint'].displayValue,
    'Largest Contentful Paint': auditResults['largest-contentful-paint'].displayValue,
    'Total Blocking Time': auditResults['total-blocking-time'].displayValue,
    'Cumulative Layout Shift': auditResults['cumulative-layout-shift'].displayValue,
    'Speed Index': auditResults['speed-index'].displayValue,
  };

  for (const [name, value] of Object.entries(metrics)) {
    console.log(`  - ${name.padEnd(25)}: ${value}`);
  }

  // Check thresholds
  const tbt = parseFloat(auditResults['total-blocking-time'].numericValue);
  const lcp = parseFloat(auditResults['largest-contentful-paint'].numericValue) / 1000;
  const cls = parseFloat(auditResults['cumulative-layout-shift'].numericValue);

  if (tbt > 200) console.log(`⚠️  Warning: TBT is high (${tbt.toFixed(0)}ms, target < 200ms)`);
  if (lcp > 2.5) console.log(`⚠️  Warning: LCP is slow (${lcp.toFixed(2)}s, target < 2.5s)`);
  if (cls > 0.1) console.log(`⚠️  Warning: CLS is high (${cls.toFixed(3)}, target < 0.1)`);
}

async function main() {
  if (!API_KEY) {
    console.warn('⚠️  No PSI_API_KEY found in .env. Running without key (limited quota).');
  }

  try {
    if (strategy === 'both') {
      const mobileResult = await runAudit(targetUrl, 'mobile');
      displayResults(mobileResult, 'mobile');
      const desktopResult = await runAudit(targetUrl, 'desktop');
      displayResults(desktopResult, 'desktop');
    } else {
      const result = await runAudit(targetUrl, strategy);
      displayResults(result, strategy);
    }
    console.log('\n✅ Audit completed successfully.');
  } catch (error) {
    console.error(`\n❌ Error during audit: ${error.message}`);
    process.exit(1);
  }
}

main();
