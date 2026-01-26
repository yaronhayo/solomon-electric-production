/**
 * IndexNow API Client
 * Automatically notify search engines (Bing, Yandex) when URLs are added/updated
 * 
 * API Documentation: https://www.indexnow.org/documentation
 */

import fs from 'fs/promises';
import path from 'path';

const INDEXNOW_CONFIG = {
  // Your IndexNow API key
  apiKey: 'index-now-5520a66a-8172-47e6-9857-ada854872cb2',
  
  // Your website URL (canonical)
  siteUrl: 'https://www.247electricianmiami.com',
  
  // IndexNow endpoints (Bing and Yandex)
  endpoints: [
    'https://api.indexnow.org/indexnow', // Bing (Microsoft)
    'https://yandex.com/indexnow',       // Yandex
  ],
};

/**
 * Submit URLs to IndexNow API
 * @param urls - Array of URLs to submit (can be single URL or multiple)
 * @returns Promise with submission results
 */
export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  results: Array<{ endpoint: string; status: number; ok: boolean }>;
  errors?: string[];
}> {
  const urlsArray = Array.isArray(urls) ? urls : [urls];
  
  // Ensure URLs are absolute and use canonical domain
  const absoluteUrls = urlsArray.map(url => {
    if (url.startsWith('http')) return url;
    return `${INDEXNOW_CONFIG.siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
  });

  const payload = {
    host: new URL(INDEXNOW_CONFIG.siteUrl).hostname,
    key: INDEXNOW_CONFIG.apiKey,
    keyLocation: `${INDEXNOW_CONFIG.siteUrl}/${INDEXNOW_CONFIG.apiKey}.txt`,
    urlList: absoluteUrls,
  };

  console.log(`\n🚀 Submitting ${absoluteUrls.length} URL(s) to IndexNow...`);
  
  const results = [];
  const errors = [];

  for (const endpoint of INDEXNOW_CONFIG.endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const endpointName = endpoint.includes('yandex') ? 'Yandex' : 'Bing';
      
      results.push({
        endpoint: endpointName,
        status: response.status,
        ok: response.ok,
      });

      if (response.ok) {
        console.log(`✅ ${endpointName}: Successfully submitted (${response.status})`);
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`❌ ${endpointName}: Failed (${response.status}) - ${errorText}`);
        errors.push(`${endpointName}: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      const endpointName = endpoint.includes('yandex') ? 'Yandex' : 'Bing';
      console.error(`❌ ${endpointName}: Network error - ${error instanceof Error ? error.message : 'Unknown'}`);
      errors.push(`${endpointName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      results.push({
        endpoint: endpointName,
        status: 0,
        ok: false,
      });
    }
  }

  const allSuccessful = results.every(r => r.ok);
  
  console.log(`\n${allSuccessful ? '✅' : '⚠️'} IndexNow submission ${allSuccessful ? 'completed' : 'partially completed'}`);
  
  return {
    success: allSuccessful,
    results,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Submit URLs from sitemap
 * @param sitemapPath - Path to sitemap file (XML)
 * @param limit - Maximum number of URLs to submit (default: 10000, IndexNow max)
 */
export async function submitFromSitemap(
  sitemapPath: string,
  limit: number = 10000
): Promise<void> {
  try {
    const sitemapContent = await fs.readFile(sitemapPath, 'utf-8');
    
    // Extract URLs from sitemap XML
    const urlMatches = sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g);
    const urls = Array.from(urlMatches, match => match[1]).slice(0, limit);

    if (urls.length === 0) {
      console.error('❌ No URLs found in sitemap');
      return;
    }

    console.log(`📄 Found ${urls.length} URLs in sitemap`);
    
    // IndexNow supports up to 10,000 URLs per request
    await submitToIndexNow(urls);
  } catch (error) {
    console.error('❌ Error reading sitemap:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Submit all URLs from sitemap index
 * @param sitemapIndexPath - Path to sitemap index file
 * @param limit - Maximum URLs per child sitemap
 */
export async function submitFromSitemapIndex(
  sitemapIndexPath: string,
  limit: number = 10000
): Promise<void> {
  try {
    const indexContent = await fs.readFile(sitemapIndexPath, 'utf-8');
    
    // Extract child sitemap URLs
    const sitemapMatches = indexContent.matchAll(/<loc>(.*?)<\/loc>/g);
    const sitemapUrls = Array.from(sitemapMatches, match => match[1]);

    if (sitemapUrls.length === 0) {
      console.error('❌ No child sitemaps found in sitemap index');
      return;
    }

    console.log(`📑 Found ${sitemapUrls.length} child sitemap(s)`);

    // Process each child sitemap
    for (const sitemapUrl of sitemapUrls) {
      // Convert URL to local file path
      const sitemapFilename = sitemapUrl.split('/').pop();
      const sitemapPath = path.join(path.dirname(sitemapIndexPath), sitemapFilename || '');
      
      console.log(`\n📄 Processing: ${sitemapFilename}`);
      
      try {
        await submitFromSitemap(sitemapPath, limit);
      } catch (error) {
        console.error(`⚠️ Failed to process ${sitemapFilename}:`, error);
        // Continue with next sitemap even if one fails
      }
    }
  } catch (error) {
    console.error('❌ Error reading sitemap index:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Response Status Codes:
 * - 200 OK: URL successfully submitted
 * - 202 Accepted: URL received, will be processed later
 * - 400 Bad Request: Invalid request format
 * - 403 Forbidden: Key validation failed
 * - 422 Unprocessable Entity: Invalid URLs in request
 * - 429 Too Many Requests: Rate limit exceeded
 */
