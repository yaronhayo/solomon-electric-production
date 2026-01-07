#!/usr/bin/env node

/**
 * DataForSEO Sync CLI Script
 * Fetches and caches SEO data from DataForSEO APIs
 * 
 * Usage:
 *   npm run seo:sync          # Full sync (rankings + keywords + audit)
 *   npm run seo:rankings      # Rankings only
 *   npm run seo:keywords      # Keywords data only
 *   npm run seo:audit         # On-page audit only
 *   npm run seo:test          # Test API connection
 * 
 * Options:
 *   --test         Test API connection only
 *   --service=X    Track specific service only
 *   --area=X       Track specific area only
 *   --verbose      Show detailed progress
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env
import 'dotenv/config';

// ============================================
// Configuration
// ============================================

const DATA_DIR = join(process.cwd(), 'src', 'data', 'seo');
const RANKINGS_FILE = join(DATA_DIR, 'rankings.json');
const KEYWORDS_FILE = join(DATA_DIR, 'keywords.json');
const AUDIT_FILE = join(DATA_DIR, 'audit.json');

// ============================================
// CLI Argument Parsing
// ============================================

const args = process.argv.slice(2);
const command = args[0] || 'sync';
const options = {
  test: args.includes('--test'),
  verbose: args.includes('--verbose'),
  service: args.find(a => a.startsWith('--service='))?.split('=')[1],
  area: args.find(a => a.startsWith('--area='))?.split('=')[1]
};

// ============================================
// Helper Functions
// ============================================

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
    console.log(`📁 Created data directory: ${DATA_DIR}`);
  }
}

function saveJson(filepath, data) {
  writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`💾 Saved: ${filepath}`);
}

function loadJson(filepath) {
  if (existsSync(filepath)) {
    return JSON.parse(readFileSync(filepath, 'utf-8'));
  }
  return null;
}

function log(message, verbose = false) {
  if (verbose && !options.verbose) return;
  console.log(message);
}

async function createClient() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    console.error('❌ Error: DataForSEO credentials not found');
    console.error('   Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in .env');
    process.exit(1);
  }

  // Dynamic import to avoid issues with ES modules
  const { DataForSEOClient } = await import('../src/lib/dataforseo/client.js');
  return new DataForSEOClient({ login, password });
}

// ============================================
// Test Connection
// ============================================

async function testConnection() {
  console.log('🔌 Testing DataForSEO API connection...\n');
  
  try {
    const client = await createClient();
    const connected = await client.testConnection();
    
    if (connected) {
      console.log('✅ Connection successful!');
      
      // Get account info
      const accountInfo = await client.getAccountInfo();
      if (accountInfo.tasks?.[0]?.result?.[0]) {
        const info = accountInfo.tasks[0].result[0];
        console.log(`\n📊 Account Info:`);
        console.log(`   Balance: $${info.balance.toFixed(2)} ${info.currency}`);
        console.log(`   Daily Usage: ${info.limits.day.count}/${info.limits.day.limit} requests`);
      }
    } else {
      console.log('❌ Connection failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }
}

// ============================================
// Sync Rankings
// ============================================

async function syncRankings() {
  console.log('📊 Syncing rankings data...\n');
  
  ensureDataDir();
  const client = await createClient();
  
  // Import ranking tracker
  const { 
    trackAllRankings, 
    trackServiceRankings, 
    trackAreaRankings,
    calculateRankingSummary 
  } = await import('../src/lib/dataforseo/ranking-tracker.js');
  
  let rankings;
  
  if (options.service) {
    console.log(`📍 Tracking service: ${options.service}`);
    const data = await trackServiceRankings(options.service, client);
    rankings = { lastUpdated: new Date().toISOString(), rankings: data };
  } else if (options.area) {
    console.log(`📍 Tracking area: ${options.area}`);
    const data = await trackAreaRankings(options.area, client);
    rankings = { lastUpdated: new Date().toISOString(), rankings: data };
  } else {
    // Full sync with progress
    rankings = await trackAllRankings((completed, total) => {
      const percent = Math.round((completed / total) * 100);
      process.stdout.write(`\r   Progress: ${percent}% (${completed}/${total})`);
    }, client);
    console.log('\n');
  }
  
  // Save rankings
  saveJson(RANKINGS_FILE, rankings);
  
  // Show summary
  const summary = calculateRankingSummary(rankings.rankings);
  console.log('\n📈 Rankings Summary:');
  console.log(`   Total Keywords: ${summary.totalKeywords}`);
  console.log(`   Top 3 Rankings: ${summary.top3Count}`);
  console.log(`   Top 10 Rankings: ${summary.top10Count}`);
  console.log(`   Top 20 Rankings: ${summary.top20Count}`);
  console.log(`   Not Ranking: ${summary.notRanking}`);
  console.log(`   Average Position: ${summary.averagePosition}`);
}

// ============================================
// Sync Keywords
// ============================================

async function syncKeywords() {
  console.log('🔑 Syncing keywords data...\n');
  
  ensureDataDir();
  const client = await createClient();
  
  const { analyzeLocalServiceKeywords } = await import('../src/lib/dataforseo/keywords.js');
  const { SERVICE_AREAS } = await import('../src/data/service-areas.js');
  
  // Core service terms to analyze
  const coreServices = [
    'electrician',
    'electrical repair',
    'ev charger installation',
    'generator installation',
    'panel upgrade'
  ];
  
  const keywordData = {};
  
  for (const service of coreServices) {
    console.log(`   Analyzing: ${service}`);
    const metrics = await analyzeLocalServiceKeywords(service, SERVICE_AREAS.slice(0, 5), client);
    keywordData[service] = Object.fromEntries(metrics);
  }
  
  const result = {
    lastUpdated: new Date().toISOString(),
    keywords: keywordData
  };
  
  saveJson(KEYWORDS_FILE, result);
  console.log('\n✅ Keywords data synced');
}

// ============================================
// Run SEO Audit
// ============================================

async function runAudit() {
  console.log('🔍 Running SEO audit...\n');
  
  ensureDataDir();
  const client = await createClient();
  
  const { startCrawlTask, getCrawlSummary } = await import('../src/lib/dataforseo/onpage.js');
  
  // Get site URL from config
  const { SITE_CONFIG } = await import('../src/config/site.js');
  const domain = new URL(SITE_CONFIG.seo.siteUrl).hostname;
  
  console.log(`   Crawling: ${domain}`);
  
  // Start crawl
  const taskId = await startCrawlTask({
    domain,
    maxPages: 100,
    calculateKeywordDensity: true
  }, client);
  
  console.log(`   Task ID: ${taskId}`);
  console.log('   Waiting for crawl to complete...');
  
  // Poll for completion
  let attempts = 0;
  let summary = null;
  
  while (attempts < 60) {  // Max 5 minutes
    await new Promise(r => setTimeout(r, 5000));
    summary = await getCrawlSummary(taskId, client);
    
    if (summary?.crawl_progress === 'finished') {
      break;
    }
    
    const pagesProcessed = summary?.crawl_status?.pages_crawled || 0;
    process.stdout.write(`\r   Pages crawled: ${pagesProcessed}`);
    attempts++;
  }
  
  console.log('\n');
  
  if (summary) {
    const result = {
      lastUpdated: new Date().toISOString(),
      taskId,
      summary: {
        domain: summary.domain_info?.name,
        totalPages: summary.domain_info?.total_pages,
        onpageScore: summary.page_metrics?.onpage_score,
        brokenLinks: summary.page_metrics?.broken_links,
        brokenResources: summary.page_metrics?.broken_resources,
        duplicateTitle: summary.page_metrics?.duplicate_title,
        duplicateDescription: summary.page_metrics?.duplicate_description,
        nonIndexable: summary.page_metrics?.non_indexable
      }
    };
    
    saveJson(AUDIT_FILE, result);
    
    console.log('📋 Audit Summary:');
    console.log(`   On-Page Score: ${result.summary.onpageScore}`);
    console.log(`   Total Pages: ${result.summary.totalPages}`);
    console.log(`   Broken Links: ${result.summary.brokenLinks}`);
    console.log(`   Duplicate Titles: ${result.summary.duplicateTitle}`);
  } else {
    console.log('❌ Audit timed out');
  }
}

// ============================================
// Main Execution
// ============================================

async function main() {
  console.log('🚀 DataForSEO CLI\n');
  
  if (options.test || command === 'test') {
    await testConnection();
    return;
  }
  
  switch (command) {
    case 'sync':
      await syncRankings();
      await syncKeywords();
      break;
    case 'rankings':
      await syncRankings();
      break;
    case 'keywords':
      await syncKeywords();
      break;
    case 'audit':
      await runAudit();
      break;
    default:
      console.log('Unknown command:', command);
      console.log('Available commands: sync, rankings, keywords, audit, test');
      process.exit(1);
  }
  
  console.log('\n✨ Done!');
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
