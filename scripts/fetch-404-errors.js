#!/usr/bin/env node
/**
 * 404 Error Analyzer
 * Fetches 404 errors from Google Search Console and analyzes patterns
 * 
 * Usage: node scripts/fetch-404-errors.js
 */

import { google } from 'googleapis';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'sc-domain:247electricianmiami.com';

/**
 * Load Google Service Account credentials
 */
function loadCredentials() {
  const envPath = process.env.GSC_CREDENTIALS_PATH;
  const credentialsPath = envPath || resolve(__dirname, '../gsc-credentials.json');
  
  if (!existsSync(credentialsPath)) {
    console.error('❌ Credentials file not found at:', credentialsPath);
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
 * Fetch URLs with 404 errors from Search Analytics
 */
async function fetch404Errors(client, days = 90) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const formatDate = (d) => d.toISOString().split('T')[0];
  
  console.log(`\n📊 Fetching 404 Error Data (${days} days)...\n`);
  
  try {
    // Get pages with 404 errors from Search Analytics
    const response = await client.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['page'],
        dimensionFilterGroups: [{
          filters: [{
            dimension: 'page',
            expression: '/404',
            operator: 'notContains'  // Exclude the 404 page itself
          }]
        }],
        rowLimit: 25000  // Max limit
      }
    });
    
    if (!response.data.rows || response.data.rows.length === 0) {
      console.log('✅ No 404 errors found in last', days, 'days');
      return [];
    }
    
    const urls = response.data.rows.map(row => ({
      url: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0
    }));
    
    console.log(`Found ${urls.length} URLs in Search Console data`);
    
    // Now we need to check which ones are actually 404s
    // We can't directly get 404 status from Search Analytics
    // We'll analyze based on URL patterns and existing redirects
    
    return urls;
    
  } catch (error) {
    console.error('❌ Failed to fetch analytics data:', error.message);
    return [];
  }
}

/**
 * Analyze URL patterns to identify common 404 causes
 */
function analyzePatterns(urls) {
  console.log('\n📋 Analyzing URL Patterns...\n');
  
  const patterns = {
    servicePages: [],
    serviceAreaPages: [],
    blogPosts: [],
    other: []
  };
  
  for (const item of urls) {
    const url = item.url.replace('https://www.247electricianmiami.com', '').replace('https://247electricianmiami.com', '');
    
    if (url.includes('/services/')) {
      patterns.servicePages.push(item);
    } else if (url.includes('/service-areas/')) {
      patterns.serviceAreaPages.push(item);
    } else if (url.includes('/blog/')) {
      patterns.blogPosts.push(item);
    } else {
      patterns.other.push(item);
    }
  }
  
  console.log('Service Pages:', patterns.servicePages.length);
  console.log('Service Area Pages:', patterns.serviceAreaPages.length);
  console.log('Blog Posts:', patterns.blogPosts.length);
  console.log('Other:', patterns.other.length);
  
  return patterns;
}

/**
 * Main execution
 */
async function main() {
  const client = await createClient();
  const urls = await fetch404Errors(client, 90);
  
  if (urls.length > 0) {
    const patterns = analyzePatterns(urls);
    
    // Save to file for further analysis
    const outputPath = resolve(__dirname, '../404-analysis.json');
    writeFileSync(outputPath, JSON.stringify({ urls, patterns }, null, 2));
    console.log(`\n✅ Results saved to: 404-analysis.json`);
    
    // Display top 404s by impressions
    console.log('\n📊 Top 20 URLs by Impressions:\n');
    const sorted = urls.sort((a, b) => b.impressions - a.impressions).slice(0, 20);
    
    for (const item of sorted) {
      const path = item.url.replace('https://www.247electricianmiami.com', '').replace('https://247electricianmiami.com', '');
      console.log(`${item.impressions} impressions - ${path}`);
    }
  }
}

main().catch(console.error);
