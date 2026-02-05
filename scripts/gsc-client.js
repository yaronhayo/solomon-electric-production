#!/usr/bin/env node
/**
 * Google Search Console API Client - Enhanced for Local SEO
 * Solomon Electric - SEO Optimization Tools
 * 
 * Prerequisites:
 * 1. Create a Google Cloud Project
 * 2. Enable "Google Search Console API"
 * 3. Create a Service Account and download JSON key
 * 4. Add service account email as Owner in Search Console
 * 5. Save JSON key as gsc-credentials.json in project root
 * 
 * Commands:
 *   submit-sitemap          Submit sitemap to Search Console
 *   sitemaps                List all sitemaps and their status
 *   inspect-url <url>       Inspect a specific URL
 *   performance             Get performance data (clicks, CTR, etc)
 *   batch-inspect           Batch inspect URLs from sitemap
 *   local-queries           Track location-based search queries
 *   rich-results            Validate schema markup on pages
 *   indexing-health         Comprehensive indexing health dashboard
 */

import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const SITE_URL = 'sc-domain:247electricianmiami.com';
const SITE_BASE = 'https://www.247electricianmiami.com';
const SITEMAP_URL = `${SITE_BASE}/sitemap-index.xml`;

// Service areas for local query tracking
const SERVICE_AREAS = [
  'Boca Raton', 'Boynton Beach', 'Coconut Creek', 'Coral Springs',
  'Deerfield Beach', 'Delray Beach', 'Davie', 'Fort Lauderdale',
  'Hialeah', 'Homestead', 'Hollywood', 'Jupiter', 'Lauderhill',
  'Margate', 'Miami', 'Miami Beach', 'Miami Gardens', 'Miramar',
  'North Miami', 'Pembroke Pines', 'Plantation', 'Pompano Beach',
  'Sunrise', 'Tamarac', 'Wellington', 'Weston', 'West Palm Beach'
];

/**
 * Load Google Service Account credentials
 */
function loadCredentials() {
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
    console.log('✅ Sitemap submitted successfully!');
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
  const fullUrl = urlPath.startsWith('http') ? urlPath : `${SITE_BASE}${urlPath}`;
  
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
    
    const indexing = result.indexStatusResult;
    if (indexing) {
      console.log(`│ Coverage: ${indexing.coverageState}`);
      console.log(`│ Verdict: ${indexing.verdict}`);
      console.log(`│ Robots.txt: ${indexing.robotsTxtState}`);
      console.log(`│ Page Fetch: ${indexing.pageFetchState}`);
      console.log(`│ Indexing: ${indexing.indexingState}`);
      if (indexing.lastCrawlTime) {
        console.log(`│ Last Crawl: ${indexing.lastCrawlTime}`);
      }
    }
    
    const richResults = result.richResultsResult;
    if (richResults) {
      console.log(`│ Rich Results: ${richResults.verdict}`);
      if (richResults.detectedItems) {
        for (const item of richResults.detectedItems) {
          console.log(`│   ✅ ${item.richResultType}`);
        }
      }
    }
    
    console.log('└─────────────────────────────────────────────────────────────┘');
    
    return result;
  } catch (error) {
    console.error('❌ Failed to inspect URL:', error.message);
    return null;
  }
}

/**
 * Get performance data
 */
async function getPerformance(client, days = 28) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const formatDate = (d) => d.toISOString().split('T')[0];
  
  console.log(`\n📊 Performance Data (${days} days)\n`);
  
  try {
    const overallResponse = await client.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: [],
        rowLimit: 1
      }
    });
    
    if (overallResponse.data.rows?.length > 0) {
      const row = overallResponse.data.rows[0];
      console.log('┌─────────────────────────────────────────────────────────────┐');
      console.log('│ OVERALL PERFORMANCE                                         │');
      console.log('├─────────────────────────────────────────────────────────────┤');
      console.log(`│ Clicks: ${row.clicks?.toLocaleString() || 0}`);
      console.log(`│ Impressions: ${row.impressions?.toLocaleString() || 0}`);
      console.log(`│ CTR: ${((row.ctr || 0) * 100).toFixed(2)}%`);
      console.log(`│ Avg Position: ${(row.position || 0).toFixed(1)}`);
      console.log('└─────────────────────────────────────────────────────────────┘');
    }
    
    // Top pages
    console.log('\n📄 Top 10 Pages:\n');
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
      for (const row of pagesResponse.data.rows) {
        const page = row.keys[0].replace(SITE_BASE, '').slice(0, 50);
        console.log(`  ${page}`);
        console.log(`    Clicks: ${row.clicks} | Impr: ${row.impressions} | CTR: ${((row.ctr || 0) * 100).toFixed(1)}%`);
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to fetch performance:', error.message);
  }
}

/**
 * NEW: Batch inspect URLs from sitemap
 */
async function batchInspect(client, limit = 50) {
  console.log(`\n🔍 Batch URL Inspection (limit: ${limit})\n`);
  
  // Get URLs from sitemap
  const sitemapPath = resolve(__dirname, '../sitemap-urls.txt');
  let urls = [];
  
  if (existsSync(sitemapPath)) {
    urls = readFileSync(sitemapPath, 'utf8')
      .split('\n')
      .filter(u => u.trim())
      .slice(0, limit);
  } else {
    console.log('📁 sitemap-urls.txt not found. Using sample pages...');
    urls = [
      '/',
      '/services/',
      '/about/',
      '/contact/',
      '/service-areas/'
    ];
  }
  
  console.log(`Inspecting ${urls.length} URLs...\n`);
  
  const results = {
    indexed: [],
    notIndexed: [],
    errors: [],
    crawledNotIndexed: []
  };
  
  let processed = 0;
  
  for (const url of urls) {
    const fullUrl = url.startsWith('http') ? url : `${SITE_BASE}${url}`;
    
    try {
      const response = await client.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: fullUrl,
          siteUrl: SITE_URL
        }
      });
      
      const indexing = response.data.inspectionResult?.indexStatusResult;
      const coverage = indexing?.coverageState || 'UNKNOWN';
      const verdict = indexing?.verdict || 'UNKNOWN';
      
      const urlShort = url.replace(SITE_BASE, '').slice(0, 60);
      
      if (verdict === 'PASS' || coverage === 'Submitted and indexed') {
        results.indexed.push({ url: urlShort, lastCrawl: indexing?.lastCrawlTime });
      } else if (coverage === 'Crawled - currently not indexed') {
        results.crawledNotIndexed.push({ url: urlShort, coverage });
      } else {
        results.notIndexed.push({ url: urlShort, coverage, verdict });
      }
      
      processed++;
      if (processed % 10 === 0) {
        console.log(`  Processed ${processed}/${urls.length}...`);
      }
      
      // Rate limit: ~10 requests per second max
      await new Promise(r => setTimeout(r, 150));
      
    } catch (error) {
      results.errors.push({ url: url.slice(0, 60), error: error.message });
    }
  }
  
  // Summary
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│ BATCH INSPECTION SUMMARY                                    │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log(`│ ✅ Indexed: ${results.indexed.length}`);
  console.log(`│ ⚠️  Crawled but not indexed: ${results.crawledNotIndexed.length}`);
  console.log(`│ ❌ Not indexed: ${results.notIndexed.length}`);
  console.log(`│ 🔴 Errors: ${results.errors.length}`);
  console.log('└─────────────────────────────────────────────────────────────┘');
  
  // Show problem URLs
  if (results.crawledNotIndexed.length > 0) {
    console.log('\n⚠️  Crawled but not indexed (needs content improvement):');
    results.crawledNotIndexed.slice(0, 10).forEach(r => console.log(`   ${r.url}`));
  }
  
  if (results.notIndexed.length > 0) {
    console.log('\n❌ Not indexed:');
    results.notIndexed.slice(0, 10).forEach(r => console.log(`   ${r.url} - ${r.coverage}`));
  }
  
  // Save report
  const reportPath = resolve(__dirname, '../gsc-batch-report.json');
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full report saved: gsc-batch-report.json`);
  
  return results;
}

/**
 * NEW: Track local queries by city
 */
async function getLocalQueries(client, days = 28) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const formatDate = (d) => d.toISOString().split('T')[0];
  
  console.log(`\n📍 Local Query Performance (${days} days)\n`);
  
  try {
    const response = await client.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['query'],
        rowLimit: 1000
      }
    });
    
    if (!response.data.rows) {
      console.log('No query data available.');
      return;
    }
    
    // Group queries by city
    const cityStats = {};
    const localQueries = [];
    
    for (const row of response.data.rows) {
      const query = row.keys[0].toLowerCase();
      
      for (const city of SERVICE_AREAS) {
        if (query.includes(city.toLowerCase())) {
          if (!cityStats[city]) {
            cityStats[city] = { clicks: 0, impressions: 0, queries: [] };
          }
          cityStats[city].clicks += row.clicks || 0;
          cityStats[city].impressions += row.impressions || 0;
          cityStats[city].queries.push({
            query: row.keys[0],
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            position: row.position
          });
          localQueries.push(row);
          break;
        }
      }
    }
    
    // Summary by city
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ LOCAL SEO PERFORMANCE BY CITY                               │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    
    const sorted = Object.entries(cityStats)
      .sort((a, b) => b[1].clicks - a[1].clicks);
    
    for (const [city, stats] of sorted.slice(0, 15)) {
      const clicks = String(stats.clicks).padStart(5);
      const impr = String(stats.impressions).padStart(6);
      console.log(`│ ${city.padEnd(20)} │ Clicks: ${clicks} │ Impr: ${impr}`);
    }
    
    console.log('└─────────────────────────────────────────────────────────────┘');
    
    // Underperforming cities
    const underperforming = sorted.filter(([_, s]) => s.impressions < 100);
    if (underperforming.length > 0) {
      console.log('\n⚠️  Low visibility cities (< 100 impressions):');
      underperforming.forEach(([city]) => console.log(`   - ${city}`));
    }
    
    // Top local queries
    console.log('\n🔝 Top Local Queries:');
    localQueries
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 10)
      .forEach(q => {
        console.log(`   "${q.keys[0]}" - ${q.clicks} clicks, pos ${(q.position || 0).toFixed(1)}`);
      });
    
    // Save report
    const reportPath = resolve(__dirname, '../gsc-local-queries.json');
    writeFileSync(reportPath, JSON.stringify({ cityStats, topQueries: localQueries.slice(0, 50) }, null, 2));
    console.log(`\n📄 Report saved: gsc-local-queries.json`);
    
  } catch (error) {
    console.error('❌ Failed to fetch queries:', error.message);
  }
}

/**
 * NEW: Check rich results on sample pages
 */
async function checkRichResults(client, limit = 10) {
  console.log(`\n🎨 Rich Results Validation (checking ${limit} pages)\n`);
  
  // Sample key pages to check
  const pagesToCheck = [
    '/',
    '/services/',
    '/about/',
    '/contact/',
    '/service-areas/',
    '/services/electrical-panel-upgrade/',
    '/services/ev-charger-installation/',
    '/services/lighting-installation/',
    '/services/electrical-repair/',
    '/services/generator-installation/'
  ].slice(0, limit);
  
  const results = {
    withRichResults: [],
    withoutRichResults: [],
    errors: []
  };
  
  for (const page of pagesToCheck) {
    const fullUrl = `${SITE_BASE}${page}`;
    
    try {
      const response = await client.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: fullUrl,
          siteUrl: SITE_URL
        }
      });
      
      const richResults = response.data.inspectionResult?.richResultsResult;
      const detected = richResults?.detectedItems || [];
      
      if (detected.length > 0) {
        results.withRichResults.push({
          url: page,
          types: detected.map(d => d.richResultType),
          verdict: richResults.verdict
        });
      } else {
        results.withoutRichResults.push({ url: page });
      }
      
      await new Promise(r => setTimeout(r, 200));
      
    } catch (error) {
      results.errors.push({ url: page, error: error.message });
    }
  }
  
  // Summary
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│ RICH RESULTS STATUS                                         │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  
  for (const page of results.withRichResults) {
    console.log(`│ ✅ ${page.url}`);
    page.types.forEach(t => console.log(`│    └─ ${t}`));
  }
  
  for (const page of results.withoutRichResults) {
    console.log(`│ ⚠️  ${page.url} - No rich results detected`);
  }
  
  console.log('└─────────────────────────────────────────────────────────────┘');
  
  console.log(`\n📊 Summary: ${results.withRichResults.length}/${pagesToCheck.length} pages have rich results`);
  
  return results;
}

/**
 * NEW: Comprehensive indexing health dashboard
 */
async function getIndexingHealth(client) {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║            INDEXING HEALTH DASHBOARD                          ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  
  // 1. Sitemap status
  console.log('\n📋 SITEMAP STATUS');
  console.log('─'.repeat(60));
  await listSitemaps(client);
  
  // 2. Performance snapshot
  console.log('\n📊 PERFORMANCE SNAPSHOT (7 days)');
  console.log('─'.repeat(60));
  await getPerformance(client, 7);
  
  // 3. Sample URL inspections
  console.log('\n🔍 SAMPLE URL HEALTH CHECK');
  console.log('─'.repeat(60));
  const sampleUrls = ['/', '/services/', '/about/', '/contact/', '/service-areas/'];
  
  let indexed = 0;
  for (const url of sampleUrls) {
    try {
      const response = await client.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: `${SITE_BASE}${url}`,
          siteUrl: SITE_URL
        }
      });
      
      const verdict = response.data.inspectionResult?.indexStatusResult?.verdict;
      const icon = verdict === 'PASS' ? '✅' : '⚠️';
      if (verdict === 'PASS') indexed++;
      console.log(`  ${icon} ${url} - ${verdict}`);
      
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.log(`  ❌ ${url} - Error`);
    }
  }
  
  console.log(`\n  Core pages indexed: ${indexed}/${sampleUrls.length}`);
  
  // 4. Action items
  console.log('\n📝 RECOMMENDED ACTIONS');
  console.log('─'.repeat(60));
  console.log('  1. Run "npm run gsc batch-inspect --limit=100" for deeper analysis');
  console.log('  2. Run "npm run gsc local-queries" to track city performance');
  console.log('  3. Run "npm run gsc rich-results" to validate schema markup');
  console.log('  4. Submit sitemap if not recently crawled: "npm run gsc submit-sitemap"');
  
  console.log('\n' + '═'.repeat(60) + '\n');
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
║     Solomon Electric - GSC CLI (Local SEO Enhanced)           ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Commands:                                                    ║
║    submit-sitemap        Submit sitemap to Search Console     ║
║    sitemaps              List sitemap status                  ║
║    inspect-url <url>     Inspect a specific URL               ║
║    performance           Performance data (clicks, CTR, etc)  ║
║    batch-inspect         Batch inspect URLs from sitemap      ║
║    local-queries         Track location-based search queries  ║
║    rich-results          Validate schema/rich results         ║
║    indexing-health       Full indexing health dashboard       ║
║                                                               ║
║  Options:                                                     ║
║    --days=N              Days of data (default 28)            ║
║    --limit=N             Number of URLs to check              ║
║                                                               ║
║  Examples:                                                    ║
║    npm run gsc submit-sitemap                                 ║
║    npm run gsc batch-inspect --limit=50                       ║
║    npm run gsc local-queries --days=7                         ║
║    npm run gsc indexing-health                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
    return;
  }
  
  const client = await createClient();
  
  // Parse common options
  const daysArg = args.find(a => a.startsWith('--days='));
  const days = daysArg ? parseInt(daysArg.split('=')[1], 10) : 28;
  
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 50;
  
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
        console.error('❌ Please provide a URL. Example: /services/');
        process.exit(1);
      }
      await inspectUrl(client, urlPath);
      break;
      
    case 'performance':
      await getPerformance(client, days);
      break;
      
    case 'batch-inspect':
      await batchInspect(client, limit);
      break;
      
    case 'local-queries':
      await getLocalQueries(client, days);
      break;
      
    case 'rich-results':
      await checkRichResults(client, limit);
      break;
      
    case 'indexing-health':
      await getIndexingHealth(client);
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch(console.error);
