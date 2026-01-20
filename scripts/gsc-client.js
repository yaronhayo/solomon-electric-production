#!/usr/bin/env node
/**
 * Google Search Console API Client
 * Solomon Electric - SEO Optimization Tools
 * 
 * Prerequisites:
 * 1. Create a Google Cloud Project
 * 2. Enable "Google Search Console API"
 * 3. Create a Service Account and download JSON key
 * 4. Add service account email as Owner in Search Console
 * 5. Set GSC_CREDENTIALS_PATH in .env to the JSON key path
 * 
 * Usage:
 *   node scripts/gsc-client.js submit-sitemap
 *   node scripts/gsc-client.js inspect-url /services/electrical-panel-upgrade-100a-to-200a/
 *   node scripts/gsc-client.js performance --days=28
 *   node scripts/gsc-client.js sitemaps
 *   node scripts/gsc-client.js crawl-errors
 */

import { google } from 'googleapis';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
// Use Domain property format (sc-domain:) as detected from Search Console
const SITE_URL = 'sc-domain:247electricianmiami.com';
const SITEMAP_URL = 'https://www.247electricianmiami.com/sitemap-index.xml';

/**
 * Load Google Service Account credentials
 */
function loadCredentials() {
  // Try environment variable first
  const envPath = process.env.GSC_CREDENTIALS_PATH;
  const credentialsPath = envPath || resolve(__dirname, '../gsc-credentials.json');
  
  if (!existsSync(credentialsPath)) {
    console.error('❌ Credentials file not found at:', credentialsPath);
    console.log('\n📋 Setup Instructions:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create or select a project');
    console.log('3. Enable "Google Search Console API"');
    console.log('4. Go to IAM & Admin > Service Accounts');
    console.log('5. Create a service account and download JSON key');
    console.log('6. Save it as gsc-credentials.json in the project root');
    console.log('7. Add the service account email as Owner in Search Console');
    console.log('   https://search.google.com/search-console/users');
    process.exit(1);
  }
  
  return JSON.parse(readFileSync(credentialsPath, 'utf8'));
}

/**
 * Create authenticated client
 */
async function createClient() {
  const credentials = loadCredentials();
  
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      'https://www.googleapis.com/auth/webmasters',
      'https://www.googleapis.com/auth/webmasters.readonly'
    ]
  });
  
  await auth.authorize();
  
  return google.searchconsole({ version: 'v1', auth });
}

/**
 * Submit sitemap to Search Console
 */
async function submitSitemap(client, sitemapUrl = SITEMAP_URL) {
  console.log(`\n📤 Submitting sitemap: ${sitemapUrl}`);
  
  try {
    await client.sitemaps.submit({
      siteUrl: SITE_URL,
      feedpath: sitemapUrl
    });
    console.log('✅ Sitemap index submitted successfully!');
    console.log('   Google will automatically discover all child sitemaps referenced within it.');
    
  } catch (error) {
    console.error('❌ Failed to submit sitemap:', error.message);
  }
}

/**
 * List all sitemaps and their status
 */
async function listSitemaps(client) {
  console.log('\n📋 Fetching sitemap status...\n');
  
  try {
    const response = await client.sitemaps.list({ siteUrl: SITE_URL });
    const sitemaps = response.data.sitemap || [];
    
    if (sitemaps.length === 0) {
      console.log('No sitemaps found. Use "submit-sitemap" to add one.');
      return;
    }
    
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ SITEMAP STATUS                                              │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    
    for (const sitemap of sitemaps) {
      console.log(`│ URL: ${sitemap.path}`);
      console.log(`│ Last Downloaded: ${sitemap.lastDownloaded || 'Never'}`);
      console.log(`│ Submitted: ${sitemap.lastSubmitted || 'Unknown'}`);
      console.log(`│ Warnings: ${sitemap.warnings || 0}`);
      console.log(`│ Errors: ${sitemap.errors || 0}`);
      
      if (sitemap.contents) {
        for (const content of sitemap.contents) {
          console.log(`│   └─ ${content.type}: ${content.submitted || 0} submitted, ${content.indexed || 0} indexed`);
        }
      }
      console.log('├─────────────────────────────────────────────────────────────┤');
    }
    console.log('└─────────────────────────────────────────────────────────────┘');
    
  } catch (error) {
    console.error('❌ Failed to fetch sitemaps:', error.message);
  }
}

/**
 * Inspect a specific URL
 */
async function inspectUrl(client, urlPath) {
  const fullUrl = urlPath.startsWith('http') 
    ? urlPath 
    : `https://www.247electricianmiami.com${urlPath}`;
  
  console.log(`\n🔍 Inspecting URL: ${fullUrl}\n`);
  
  try {
    const response = await client.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: fullUrl,
        siteUrl: SITE_URL
      }
    });
    
    const result = response.data.inspectionResult;
    
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ URL INSPECTION RESULT                                       │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    
    // Indexing status
    const indexing = result.indexStatusResult;
    if (indexing) {
      console.log(`│ Indexing Status: ${indexing.coverageState}`);
      console.log(`│ Verdict: ${indexing.verdict}`);
      console.log(`│ Robots.txt Allowed: ${indexing.robotsTxtState}`);
      console.log(`│ Page Fetch: ${indexing.pageFetchState}`);
      console.log(`│ Indexing Allowed: ${indexing.indexingState}`);
      if (indexing.lastCrawlTime) {
        console.log(`│ Last Crawl: ${indexing.lastCrawlTime}`);
      }
      if (indexing.crawledAs) {
        console.log(`│ Crawled As: ${indexing.crawledAs}`);
      }
    }
    
    // Mobile usability
    const mobile = result.mobileUsabilityResult;
    if (mobile) {
      console.log(`│ Mobile: ${mobile.verdict}`);
      if (mobile.issues) {
        for (const issue of mobile.issues) {
          console.log(`│   ⚠️ ${issue.issueType}: ${issue.message}`);
        }
      }
    }
    
    // Rich results
    const richResults = result.richResultsResult;
    if (richResults) {
      console.log(`│ Rich Results: ${richResults.verdict}`);
      if (richResults.detectedItems) {
        for (const item of richResults.detectedItems) {
          console.log(`│   ✅ ${item.richResultType}`);
          if (item.issues) {
            for (const issue of item.issues) {
              console.log(`│      ⚠️ ${issue.issueMessage}`);
            }
          }
        }
      }
    }
    
    console.log('└─────────────────────────────────────────────────────────────┘');
    
  } catch (error) {
    console.error('❌ Failed to inspect URL:', error.message);
  }
}

/**
 * Get performance data (clicks, impressions, CTR, position)
 */
async function getPerformance(client, days = 28) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const formatDate = (d) => d.toISOString().split('T')[0];
  
  console.log(`\n📊 Performance Data (${days} days)\n`);
  
  try {
    // Overall performance
    const overallResponse = await client.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: [],
        rowLimit: 1
      }
    });
    
    if (overallResponse.data.rows && overallResponse.data.rows.length > 0) {
      const row = overallResponse.data.rows[0];
      console.log('┌─────────────────────────────────────────────────────────────┐');
      console.log('│ OVERALL PERFORMANCE                                         │');
      console.log('├─────────────────────────────────────────────────────────────┤');
      console.log(`│ Total Clicks: ${row.clicks?.toLocaleString() || 0}`);
      console.log(`│ Total Impressions: ${row.impressions?.toLocaleString() || 0}`);
      console.log(`│ Average CTR: ${((row.ctr || 0) * 100).toFixed(2)}%`);
      console.log(`│ Average Position: ${(row.position || 0).toFixed(1)}`);
      console.log('└─────────────────────────────────────────────────────────────┘');
    }
    
    // Top pages
    console.log('\n📄 Top 10 Pages by Clicks:\n');
    const pagesResponse = await client.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['page'],
        rowLimit: 10
      }
    });
    
    if (pagesResponse.data.rows) {
      console.log('┌────────────────────────────────────────────────────────────────────────────────────┐');
      console.log('│ Page                                               │ Clicks │ Impr  │ CTR  │ Pos │');
      console.log('├────────────────────────────────────────────────────────────────────────────────────┤');
      
      for (const row of pagesResponse.data.rows) {
        const page = row.keys[0].replace('https://www.247electricianmiami.com', '').padEnd(48).slice(0, 48);
        const clicks = String(row.clicks || 0).padStart(6);
        const impr = String(row.impressions || 0).padStart(5);
        const ctr = `${((row.ctr || 0) * 100).toFixed(1)}%`.padStart(5);
        const pos = (row.position || 0).toFixed(1).padStart(4);
        console.log(`│ ${page} │ ${clicks} │ ${impr} │ ${ctr} │ ${pos} │`);
      }
      console.log('└────────────────────────────────────────────────────────────────────────────────────┘');
    }
    
    // Top queries
    console.log('\n🔎 Top 10 Queries by Clicks:\n');
    const queriesResponse = await client.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['query'],
        rowLimit: 10
      }
    });
    
    if (queriesResponse.data.rows) {
      console.log('┌────────────────────────────────────────────────────────────────────────────────────┐');
      console.log('│ Query                                              │ Clicks │ Impr  │ CTR  │ Pos │');
      console.log('├────────────────────────────────────────────────────────────────────────────────────┤');
      
      for (const row of queriesResponse.data.rows) {
        const query = row.keys[0].padEnd(48).slice(0, 48);
        const clicks = String(row.clicks || 0).padStart(6);
        const impr = String(row.impressions || 0).padStart(5);
        const ctr = `${((row.ctr || 0) * 100).toFixed(1)}%`.padStart(5);
        const pos = (row.position || 0).toFixed(1).padStart(4);
        console.log(`│ ${query} │ ${clicks} │ ${impr} │ ${ctr} │ ${pos} │`);
      }
      console.log('└────────────────────────────────────────────────────────────────────────────────────┘');
    }
    
  } catch (error) {
    console.error('❌ Failed to fetch performance data:', error.message);
  }
}

/**
 * Main CLI handler
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         Solomon Electric - Search Console CLI                 ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Commands:                                                    ║
║    submit-sitemap     Submit sitemap to Search Console        ║
║    sitemaps           List all sitemaps and their status      ║
║    inspect-url <url>  Inspect a specific URL                  ║
║    performance        Get performance data (clicks, CTR, etc) ║
║                                                               ║
║  Options:                                                     ║
║    --days=N           Days of data for performance (default 28)║
║                                                               ║
║  Examples:                                                    ║
║    node scripts/gsc-client.js submit-sitemap                  ║
║    node scripts/gsc-client.js inspect-url /services/          ║
║    node scripts/gsc-client.js performance --days=7            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
    return;
  }
  
  const client = await createClient();
  
  switch (command) {
    case 'submit-sitemap':
      await submitSitemap(client);
      break;
      
    case 'sitemaps':
      await listSitemaps(client);
      break;
      
    case 'inspect-url':
      const urlPath = args[1];
      if (!urlPath) {
        console.error('❌ Please provide a URL path. Example: /services/');
        process.exit(1);
      }
      await inspectUrl(client, urlPath);
      break;
      
    case 'performance':
      const daysArg = args.find(a => a.startsWith('--days='));
      const days = daysArg ? parseInt(daysArg.split('=')[1], 10) : 28;
      await getPerformance(client, days);
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch(console.error);
