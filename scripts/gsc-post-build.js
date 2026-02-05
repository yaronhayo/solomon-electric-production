#!/usr/bin/env node
/**
 * GSC Post-Build Automation
 * Automatically notifies Google Search Console and IndexNow after builds
 */

import { google } from 'googleapis';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const SITE_URL = 'sc-domain:247electricianmiami.com';
const SITE_BASE = 'https://www.247electricianmiami.com';
const SITEMAP_URL = `${SITE_BASE}/sitemap-index.xml`;
const INDEXNOW_KEY = '7afe2e1a70b54d658a6e0d79b03d72c7';

/**
 * Load GSC credentials
 */
function loadCredentials() {
  const credentialsPath = resolve(__dirname, '../gsc-credentials.json');
  if (!existsSync(credentialsPath)) {
    console.log('⚠️  GSC credentials not found, skipping GSC notification');
    return null;
  }
  return JSON.parse(readFileSync(credentialsPath, 'utf8'));
}

/**
 * Create GSC client
 */
async function createGSCClient() {
  const credentials = loadCredentials();
  if (!credentials) return null;
  
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters']
  });
  
  await auth.authorize();
  return google.searchconsole({ version: 'v1', auth });
}

/**
 * Submit sitemap to GSC
 */
async function submitToGSC(client) {
  if (!client) return false;
  
  try {
    await client.sitemaps.submit({
      siteUrl: SITE_URL,
      feedpath: SITEMAP_URL
    });
    console.log('✅ GSC: Sitemap submitted');
    return true;
  } catch (error) {
    console.error('❌ GSC:', error.message);
    return false;
  }
}

/**
 * Submit to IndexNow (Bing, Yandex)
 */
async function submitToIndexNow() {
  const sitemapUrlsPath = resolve(__dirname, '../sitemap-urls.txt');
  
  // Get recently modified URLs (simplified: send sitemap URL)
  const urls = [SITEMAP_URL];
  
  const payload = JSON.stringify({
    host: '247electricianmiami.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_BASE}/${INDEXNOW_KEY}.txt`,
    urlList: urls
  });
  
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.indexnow.org',
      path: '/IndexNow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log('✅ IndexNow: Submitted');
        resolve(true);
      } else {
        console.log(`⚠️  IndexNow: Status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (e) => {
      console.log('⚠️  IndexNow:', e.message);
      resolve(false);
    });
    
    req.write(payload);
    req.end();
  });
}

/**
 * Quick health check (inspect 3 random pages)
 */
async function quickHealthCheck(client) {
  if (!client) return;
  
  const pages = ['/', '/services/', '/about/'];
  let indexed = 0;
  
  for (const page of pages) {
    try {
      const response = await client.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: `${SITE_BASE}${page}`,
          siteUrl: SITE_URL
        }
      });
      
      const verdict = response.data.inspectionResult?.indexStatusResult?.verdict;
      if (verdict === 'PASS') indexed++;
      
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      // Ignore errors in quick check
    }
  }
  
  console.log(`📊 Health: ${indexed}/${pages.length} core pages indexed`);
}

/**
 * Main post-build workflow
 */
async function main() {
  console.log('\n🚀 POST-BUILD: Notifying search engines...\n');
  
  const startTime = Date.now();
  
  // 1. Submit to GSC
  const client = await createGSCClient();
  await submitToGSC(client);
  
  // 2. Submit to IndexNow
  await submitToIndexNow();
  
  // 3. Quick health check
  await quickHealthCheck(client);
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✨ Post-build complete (${elapsed}s)\n`);
}

main().catch(console.error);
