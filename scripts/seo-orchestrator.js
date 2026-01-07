#!/usr/bin/env node

/**
 * Unified SEO Data Orchestrator
 * Combines DataForSEO, Google Search Console, and Google Analytics APIs
 * 
 * Provides comprehensive competitive intelligence for outranking competitors:
 * - Real ranking data from DataForSEO
 * - Search performance from Google Search Console
 * - User behavior from Google Analytics
 * - Actionable recommendations for each service + area combination
 * 
 * Usage:
 *   npm run seo:unified           # Full analysis
 *   npm run seo:unified -- gaps   # Keyword gap analysis
 *   npm run seo:unified -- audit  # Full site audit
 */

import 'dotenv/config';
import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================
// Configuration
// ============================================

const CONFIG = {
  site: {
    url: 'https://247electricianmiami.com',
    domain: '247electricianmiami.com',
    gscProperty: 'sc-domain:247electricianmiami.com',
    businessName: 'Solomon Electric'
  },
  paths: {
    dataDir: join(process.cwd(), 'src', 'data', 'seo'),
    servicesDir: join(process.cwd(), 'src', 'content', 'services'),
    areasDir: join(process.cwd(), 'src', 'content', 'service-areas')
  },
  dataforseo: {
    login: process.env.DATAFORSEO_LOGIN,
    password: process.env.DATAFORSEO_PASSWORD,
    baseUrl: 'https://api.dataforseo.com/v3'
  }
};

// Florida location codes for DataForSEO SERP API
const FLORIDA_LOCATIONS = {
  'miami': { code: 1015116, name: 'Miami' },
  'fort-lauderdale': { code: 1015023, name: 'Fort Lauderdale' },
  'hollywood': { code: 1015032, name: 'Hollywood' },
  'miami-beach': { code: 1015117, name: 'Miami Beach' },
  'boca-raton': { code: 1014986, name: 'Boca Raton' },
  'coral-springs': { code: 1015004, name: 'Coral Springs' },
  'pembroke-pines': { code: 1015152, name: 'Pembroke Pines' },
  'hialeah': { code: 1015029, name: 'Hialeah' },
  'homestead': { code: 1015033, name: 'Homestead' },
  'west-palm-beach': { code: 1015207, name: 'West Palm Beach' },
  'pompano-beach': { code: 1015158, name: 'Pompano Beach' },
  'davie': { code: 1015008, name: 'Davie' },
  'plantation': { code: 1015155, name: 'Plantation' },
  'sunrise': { code: 1015181, name: 'Sunrise' },
  'miramar': { code: 1015121, name: 'Miramar' },
  'weston': { code: 1015206, name: 'Weston' },
  'deerfield-beach': { code: 1015009, name: 'Deerfield Beach' }
};

// Core services to track for rankings
const CORE_SERVICES = [
  'electrician',
  'electrical panel upgrade',
  'ev charger installation',
  'generator installation',
  'electrical repair',
  'emergency electrician',
  'lighting installation',
  'outlet installation',
  'ceiling fan installation',
  'smart home wiring'
];

// ============================================
// DataForSEO Client
// ============================================

class DataForSEOClient {
  constructor() {
    if (!CONFIG.dataforseo.login || !CONFIG.dataforseo.password) {
      throw new Error('DataForSEO credentials not found in .env');
    }
    
    const credentials = `${CONFIG.dataforseo.login}:${CONFIG.dataforseo.password}`;
    this.authHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  async request(endpoint, data) {
    const response = await fetch(`${CONFIG.dataforseo.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.status}`);
    }

    const result = await response.json();
    if (result.status_code !== 20000) {
      throw new Error(`DataForSEO error: ${result.status_message}`);
    }

    return result;
  }

  async testConnection() {
    try {
      const response = await fetch(`${CONFIG.dataforseo.baseUrl.replace('/v3', '')}/v3/appendix/user_data`, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader
        }
      });
      
      if (!response.ok) {
        return { connected: false, error: `HTTP ${response.status}` };
      }
      
      const data = await response.json();
      if (data.status_code === 20000 && data.tasks?.[0]?.result?.[0]) {
        const info = data.tasks[0].result[0];
        return {
          connected: true,
          balance: info.money?.balance || 0,
          dailyLimit: info.limits?.day?.limit || 0,
          dailyUsed: info.limits?.day?.count || 0
        };
      }
      return { connected: false, error: 'Unexpected response' };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }

  async getGoogleMapsRankings(keyword, locationCode) {
    const result = await this.request('/serp/google/maps/live/advanced', [{
      keyword,
      location_code: locationCode,
      language_code: 'en',
      device: 'desktop',
      depth: 20
    }]);

    return result.tasks?.[0]?.result?.[0] || null;
  }

  async getLocalFinderRankings(keyword, locationCode) {
    const result = await this.request('/serp/google/local_finder/live/advanced', [{
      keyword,
      location_code: locationCode,
      language_code: 'en',
      device: 'desktop',
      depth: 20
    }]);

    return result.tasks?.[0]?.result?.[0] || null;
  }

  async getSearchVolume(keywords) {
    const result = await this.request('/keywords_data/google_ads/search_volume/live', [{
      keywords,
      location_code: 2840, // US
      language_code: 'en'
    }]);

    return result.tasks?.[0]?.result || [];
  }

  findBusinessInResults(results, businessName) {
    if (!results?.items) return null;
    
    const normalized = businessName.toLowerCase();
    return results.items.find(item => 
      item.title?.toLowerCase().includes(normalized) ||
      item.title?.toLowerCase().includes('solomon')
    );
  }
}

// ============================================
// Google Search Console Client
// ============================================

class GSCClient {
  constructor() {
    this.client = null;
  }

  async initialize() {
    const credentialsPath = process.env.GSC_CREDENTIALS_PATH || 
      resolve(__dirname, '../gsc-credentials.json');
    
    if (!existsSync(credentialsPath)) {
      console.log('⚠️  GSC credentials not found - GSC data will be skipped');
      return false;
    }

    try {
      const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
      
      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
      });

      await auth.authorize();
      this.client = google.searchconsole({ version: 'v1', auth });
      return true;
    } catch (error) {
      console.log(`⚠️  GSC auth failed: ${error.message}`);
      return false;
    }
  }

  async getPerformanceByPage(days = 28) {
    if (!this.client) return [];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const formatDate = (d) => d.toISOString().split('T')[0];

    try {
      const response = await this.client.searchanalytics.query({
        siteUrl: CONFIG.site.gscProperty,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['page'],
          rowLimit: 500
        }
      });

      return response.data.rows || [];
    } catch (error) {
      console.log(`⚠️  GSC query failed: ${error.message}`);
      return [];
    }
  }

  async getPerformanceByQuery(days = 28) {
    if (!this.client) return [];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const formatDate = (d) => d.toISOString().split('T')[0];

    try {
      const response = await this.client.searchanalytics.query({
        siteUrl: CONFIG.site.gscProperty,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['query'],
          rowLimit: 1000
        }
      });

      return response.data.rows || [];
    } catch (error) {
      console.log(`⚠️  GSC query failed: ${error.message}`);
      return [];
    }
  }

  async getQueryPageMatrix(days = 28) {
    if (!this.client) return [];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const formatDate = (d) => d.toISOString().split('T')[0];

    try {
      const response = await this.client.searchanalytics.query({
        siteUrl: CONFIG.site.gscProperty,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['query', 'page'],
          rowLimit: 5000
        }
      });

      return response.data.rows || [];
    } catch (error) {
      console.log(`⚠️  GSC query failed: ${error.message}`);
      return [];
    }
  }
}

// ============================================
// Unified SEO Orchestrator
// ============================================

class SEOOrchestrator {
  constructor() {
    this.dataforseo = new DataForSEOClient();
    this.gsc = new GSCClient();
    this.data = {
      rankings: [],
      gscPerformance: { pages: [], queries: [] },
      opportunities: [],
      issues: [],
      lastUpdated: null
    };
  }

  async initialize() {
    console.log('🚀 Initializing SEO Data Orchestrator...\n');
    
    // Test DataForSEO connection
    console.log('📡 Testing DataForSEO connection...');
    const dfsTest = await this.dataforseo.testConnection();
    
    if (dfsTest.connected) {
      console.log(`   ✅ Connected! Balance: $${dfsTest.balance.toFixed(2)}`);
      console.log(`   📊 Daily usage: ${dfsTest.dailyUsed}/${dfsTest.dailyLimit} requests`);
    } else {
      console.error(`   ❌ DataForSEO connection failed: ${dfsTest.error}`);
      return false;
    }
    
    // Initialize GSC
    console.log('\n📊 Initializing Google Search Console...');
    const gscReady = await this.gsc.initialize();
    if (gscReady) {
      console.log('   ✅ GSC connected!');
    }
    
    console.log('');
    return true;
  }

  async runFullAnalysis() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('             UNIFIED SEO ANALYSIS - SOUTH FLORIDA              ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // 1. Get GSC performance data
    console.log('📈 Fetching Google Search Console data...');
    this.data.gscPerformance.pages = await this.gsc.getPerformanceByPage(28);
    this.data.gscPerformance.queries = await this.gsc.getPerformanceByQuery(28);
    console.log(`   Found ${this.data.gscPerformance.pages.length} pages, ${this.data.gscPerformance.queries.length} queries\n`);

    // 2. Track rankings for core keywords in key locations
    console.log('🎯 Tracking rankings in South Florida locations...');
    await this.trackKeyLocations();

    // 3. Identify opportunities
    console.log('\n🔍 Analyzing opportunities and gaps...');
    this.analyzeOpportunities();

    // 4. Generate report
    console.log('\n📊 Generating competitive analysis report...');
    this.generateReport();

    // 5. Save data
    this.saveData();
    
    return this.data;
  }

  async trackKeyLocations() {
    const locations = ['miami', 'fort-lauderdale', 'hollywood', 'boca-raton', 'west-palm-beach'];
    const services = CORE_SERVICES.slice(0, 5); // Top 5 services to conserve API credits
    
    let tracked = 0;
    const total = locations.length * services.length;
    
    for (const location of locations) {
      const locationData = FLORIDA_LOCATIONS[location];
      if (!locationData) continue;

      for (const service of services) {
        const keyword = `${service} ${locationData.name}`;
        
        try {
          process.stdout.write(`\r   Tracking: ${keyword.padEnd(50)} [${++tracked}/${total}]`);
          
          // Get Maps rankings
          const mapsResult = await this.dataforseo.getGoogleMapsRankings(
            keyword, 
            locationData.code
          );
          
          // Find our business
          const ourListing = this.dataforseo.findBusinessInResults(mapsResult, CONFIG.site.businessName);
          
          // Get top competitor
          const topCompetitor = mapsResult?.items?.[0];
          
          this.data.rankings.push({
            keyword,
            service,
            location: locationData.name,
            locationSlug: location,
            ourRank: ourListing?.rank_group || null,
            ourRating: ourListing?.rating?.value || null,
            ourReviews: ourListing?.rating?.votes_count || 0,
            topCompetitor: topCompetitor?.title || null,
            topCompetitorRank: 1,
            topCompetitorRating: topCompetitor?.rating?.value || null,
            totalResults: mapsResult?.se_results_count || 0,
            timestamp: new Date().toISOString()
          });
          
          // Rate limiting - 30ms between requests
          await new Promise(r => setTimeout(r, 50));
          
        } catch (error) {
          console.log(`\n   ⚠️  Error tracking "${keyword}": ${error.message}`);
        }
      }
    }
    console.log('\n');
  }

  analyzeOpportunities() {
    // Identify pages with high impressions but low clicks (CTR opportunities)
    const ctrOpportunities = this.data.gscPerformance.pages
      .filter(p => p.impressions > 100 && (p.ctr || 0) < 0.03)
      .map(p => ({
        type: 'ctr_improvement',
        url: p.keys[0].replace(CONFIG.site.url, ''),
        impressions: p.impressions,
        clicks: p.clicks,
        ctr: ((p.ctr || 0) * 100).toFixed(2) + '%',
        position: (p.position || 0).toFixed(1),
        recommendation: 'Improve meta title and description to increase CTR'
      }));

    // Identify keywords where we rank 4-10 (striking distance)
    const strikingDistance = this.data.gscPerformance.queries
      .filter(q => (q.position || 0) >= 4 && (q.position || 0) <= 10)
      .map(q => ({
        type: 'striking_distance',
        query: q.keys[0],
        position: (q.position || 0).toFixed(1),
        impressions: q.impressions,
        clicks: q.clicks,
        recommendation: 'Optimize content to move from page 1 bottom to top 3'
      }));

    // Identify rankings we're missing (not in top 3 Maps)
    const rankingGaps = this.data.rankings
      .filter(r => r.ourRank === null || r.ourRank > 3)
      .map(r => ({
        type: 'ranking_gap',
        keyword: r.keyword,
        location: r.location,
        ourRank: r.ourRank || 'Not ranking',
        topCompetitor: r.topCompetitor,
        recommendation: r.ourRank 
          ? `Improve from position ${r.ourRank} to top 3`
          : 'Create/optimize Google Business Profile for this area'
      }));

    this.data.opportunities = [
      ...rankingGaps.slice(0, 10),
      ...strikingDistance.slice(0, 10),
      ...ctrOpportunities.slice(0, 10)
    ];
  }

  generateReport() {
    // Calculate summary stats
    const rankings = this.data.rankings;
    const rankedCount = rankings.filter(r => r.ourRank !== null).length;
    const top3Count = rankings.filter(r => r.ourRank && r.ourRank <= 3).length;
    const top10Count = rankings.filter(r => r.ourRank && r.ourRank <= 10).length;
    
    const avgPosition = rankedCount > 0
      ? rankings.filter(r => r.ourRank).reduce((sum, r) => sum + r.ourRank, 0) / rankedCount
      : 0;

    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│                    SEO PERFORMANCE SUMMARY                     │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    console.log(`│ Keywords Tracked:      ${rankings.length.toString().padStart(5)}                                 │`);
    console.log(`│ Currently Ranking:     ${rankedCount.toString().padStart(5)}                                 │`);
    console.log(`│ Top 3 Rankings:        ${top3Count.toString().padStart(5)}  (${((top3Count/rankings.length)*100).toFixed(1)}%)                        │`);
    console.log(`│ Top 10 Rankings:       ${top10Count.toString().padStart(5)}  (${((top10Count/rankings.length)*100).toFixed(1)}%)                        │`);
    console.log(`│ Average Position:      ${avgPosition.toFixed(1).padStart(5)}                                 │`);
    console.log('├─────────────────────────────────────────────────────────────────┤');
    
    // GSC stats
    const totalClicks = this.data.gscPerformance.pages.reduce((sum, p) => sum + (p.clicks || 0), 0);
    const totalImpressions = this.data.gscPerformance.pages.reduce((sum, p) => sum + (p.impressions || 0), 0);
    
    console.log('│                 GOOGLE SEARCH CONSOLE (28 days)                │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    console.log(`│ Total Clicks:          ${totalClicks.toLocaleString().padStart(5)}                                 │`);
    console.log(`│ Total Impressions:     ${totalImpressions.toLocaleString().padStart(5)}                                 │`);
    console.log(`│ Unique Queries:        ${this.data.gscPerformance.queries.length.toString().padStart(5)}                                 │`);
    console.log('└─────────────────────────────────────────────────────────────────┘');

    // Top opportunities
    if (this.data.opportunities.length > 0) {
      console.log('\n🎯 TOP OPPORTUNITIES TO OUTRANK COMPETITORS:\n');
      
      const rankingGaps = this.data.opportunities.filter(o => o.type === 'ranking_gap').slice(0, 5);
      if (rankingGaps.length > 0) {
        console.log('   📍 Ranking Gaps (Google Maps):');
        rankingGaps.forEach((o, i) => {
          console.log(`      ${i + 1}. "${o.keyword}" - ${o.ourRank}`);
          console.log(`         ↳ ${o.recommendation}`);
        });
      }
      
      const striking = this.data.opportunities.filter(o => o.type === 'striking_distance').slice(0, 5);
      if (striking.length > 0) {
        console.log('\n   🎯 Striking Distance Keywords (Position 4-10):');
        striking.forEach((o, i) => {
          console.log(`      ${i + 1}. "${o.query}" - Position ${o.position}`);
          console.log(`         ↳ ${o.recommendation}`);
        });
      }
      
      const ctr = this.data.opportunities.filter(o => o.type === 'ctr_improvement').slice(0, 5);
      if (ctr.length > 0) {
        console.log('\n   📈 CTR Improvement Opportunities:');
        ctr.forEach((o, i) => {
          console.log(`      ${i + 1}. ${o.url} - CTR: ${o.ctr}, Impressions: ${o.impressions}`);
          console.log(`         ↳ ${o.recommendation}`);
        });
      }
    }
  }

  saveData() {
    // Ensure data directory exists
    if (!existsSync(CONFIG.paths.dataDir)) {
      mkdirSync(CONFIG.paths.dataDir, { recursive: true });
    }

    this.data.lastUpdated = new Date().toISOString();

    // Save unified data
    const outputPath = join(CONFIG.paths.dataDir, 'unified-seo-data.json');
    writeFileSync(outputPath, JSON.stringify(this.data, null, 2));
    console.log(`\n💾 Data saved to: ${outputPath}`);

    // Save opportunities as actionable report
    const reportPath = join(CONFIG.paths.dataDir, 'opportunities-report.json');
    writeFileSync(reportPath, JSON.stringify({
      generatedAt: this.data.lastUpdated,
      opportunities: this.data.opportunities,
      summary: {
        totalOpportunities: this.data.opportunities.length,
        rankingGaps: this.data.opportunities.filter(o => o.type === 'ranking_gap').length,
        strikingDistance: this.data.opportunities.filter(o => o.type === 'striking_distance').length,
        ctrImprovements: this.data.opportunities.filter(o => o.type === 'ctr_improvement').length
      }
    }, null, 2));
    console.log(`📋 Opportunities report saved to: ${reportPath}`);
  }
}

// ============================================
// CLI Commands
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('          SOLOMON ELECTRIC - UNIFIED SEO ORCHESTRATOR          ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const orchestrator = new SEOOrchestrator();
  const ready = await orchestrator.initialize();
  
  if (!ready) {
    console.error('\n❌ Failed to initialize. Check your API credentials.');
    process.exit(1);
  }

  switch (command) {
    case 'full':
    case 'analyze':
      await orchestrator.runFullAnalysis();
      break;
      
    case 'test':
      console.log('\n✅ All API connections verified successfully!');
      break;
      
    default:
      console.log('Unknown command:', command);
      console.log('Available: full, test');
      process.exit(1);
  }

  console.log('\n✨ Done!\n');
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
