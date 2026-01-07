#!/usr/bin/env node
/**
 * Redirect Verification Script
 * Solomon Electric - SEO Optimization Tools
 * 
 * Parses .htaccess and verifies all 301 redirects are working correctly.
 * 
 * Usage:
 *   node scripts/verify-redirects.js
 *   node scripts/verify-redirects.js --verbose
 *   node scripts/verify-redirects.js --production  # Test against live site
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const BASE_URL = 'https://247electricianmiami.com';
const HTACCESS_PATH = resolve(__dirname, '../public/.htaccess');

/**
 * Parse .htaccess for redirect rules
 */
function parseHtaccess() {
  const content = readFileSync(HTACCESS_PATH, 'utf8');
  const lines = content.split('\n');
  const redirects = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match: Redirect 301 /old-path /new-path
    if (trimmed.startsWith('Redirect 301')) {
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 4) {
        redirects.push({
          type: 'Redirect',
          from: parts[2],
          to: parts[3]
        });
      }
    }
    
    // Match: RewriteRule patterns (commented out legacy domain redirects)
    // Skip for now as they're commented
  }
  
  return redirects;
}

/**
 * Test a redirect by following it
 */
async function testRedirect(from, to, options = {}) {
  const fullFrom = from.startsWith('http') ? from : `${BASE_URL}${from}`;
  const expectedTo = to.startsWith('http') ? to : `${BASE_URL}${to}`;
  
  try {
    // First request - check for redirect
    const response = await fetch(fullFrom, {
      method: 'HEAD',
      redirect: 'manual'
    });
    
    const status = response.status;
    const location = response.headers.get('location');
    
    // Normalize trailing slashes for comparison
    const normalizeUrl = (url) => {
      if (!url) return url;
      // Remove trailing slash for comparison, except for root
      return url.replace(/\/$/, '') || '/';
    };
    
    const normalizedLocation = normalizeUrl(location);
    const normalizedExpected = normalizeUrl(expectedTo);
    
    if (status === 301 || status === 302) {
      if (normalizedLocation === normalizedExpected || 
          normalizedLocation === normalizedExpected + '/' ||
          normalizedLocation + '/' === normalizedExpected) {
        return { success: true, status, location, expected: expectedTo };
      } else {
        return { 
          success: false, 
          status, 
          location, 
          expected: expectedTo,
          error: `Redirects to wrong URL: expected ${expectedTo}, got ${location}`
        };
      }
    } else if (status === 200) {
      return { 
        success: false, 
        status, 
        error: `No redirect - returns 200 directly (redirect may not be configured)`
      };
    } else {
      return { 
        success: false, 
        status, 
        error: `Unexpected status: ${status}`
      };
    }
    
  } catch (error) {
    return { 
      success: false, 
      error: `Request failed: ${error.message}`
    };
  }
}

/**
 * Test that destination URL returns 200
 */
async function testDestination(url) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  
  try {
    const response = await fetch(fullUrl, {
      method: 'HEAD',
      redirect: 'follow'
    });
    
    return {
      success: response.status === 200,
      status: response.status
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Main verification function
 */
async function verifyRedirects(options = {}) {
  const verbose = options.verbose || process.argv.includes('--verbose');
  const isProduction = process.argv.includes('--production');
  
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         Solomon Electric - Redirect Verification              ║
╠═══════════════════════════════════════════════════════════════╣
║  Testing: ${isProduction ? 'PRODUCTION (live site)' : 'LOCAL (reading .htaccess only)'}
╚═══════════════════════════════════════════════════════════════╝
  `);
  
  // Parse redirects
  const redirects = parseHtaccess();
  console.log(`\n📋 Found ${redirects.length} redirects in .htaccess\n`);
  
  if (!isProduction) {
    console.log('┌─────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ FROM                                              │ TO                         │');
    console.log('├─────────────────────────────────────────────────────────────────────────────────┤');
    
    for (const redirect of redirects) {
      const from = redirect.from.padEnd(48).slice(0, 48);
      const to = redirect.to.padEnd(26).slice(0, 26);
      console.log(`│ ${from} │ ${to} │`);
    }
    
    console.log('└─────────────────────────────────────────────────────────────────────────────────┘');
    
    console.log('\n💡 To test against the live site, run with --production flag');
    
    // Group by type for summary
    const serviceAreaRedirects = redirects.filter(r => r.from.includes('/service-areas/'));
    const serviceRedirects = redirects.filter(r => r.from.includes('/services/'));
    const otherRedirects = redirects.filter(r => 
      !r.from.includes('/service-areas/') && !r.from.includes('/services/')
    );
    
    console.log('\n📊 Redirect Summary:');
    console.log(`   • Service Area redirects: ${serviceAreaRedirects.length}`);
    console.log(`   • Service page redirects: ${serviceRedirects.length}`);
    console.log(`   • Other redirects: ${otherRedirects.length}`);
    
    return;
  }
  
  // Test redirects against production
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  console.log('Testing redirects...\n');
  
  for (let i = 0; i < redirects.length; i++) {
    const redirect = redirects[i];
    const result = await testRedirect(redirect.from, redirect.to);
    
    if (result.success) {
      passed++;
      if (verbose) {
        console.log(`✅ ${redirect.from} → ${redirect.to}`);
      } else {
        process.stdout.write('.');
      }
    } else {
      failed++;
      failures.push({ ...redirect, ...result });
      if (verbose) {
        console.log(`❌ ${redirect.from} → ${result.error}`);
      } else {
        process.stdout.write('X');
      }
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n');
  
  // Summary
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│ VERIFICATION RESULTS                                        │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log(`│ Total Redirects: ${redirects.length}`);
  console.log(`│ Passed: ${passed} ✅`);
  console.log(`│ Failed: ${failed} ❌`);
  console.log('└─────────────────────────────────────────────────────────────┘');
  
  if (failures.length > 0) {
    console.log('\n❌ Failed Redirects:\n');
    for (const failure of failures) {
      console.log(`  • ${failure.from}`);
      console.log(`    Expected: ${failure.to}`);
      console.log(`    Error: ${failure.error}`);
      console.log('');
    }
  }
}

// Run
verifyRedirects().catch(console.error);
