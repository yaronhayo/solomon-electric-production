/**
 * DataForSEO Ranking Tracker
 * Tracks rankings for all service + area combinations
 */

import { SITE_CONFIG } from '../../config/site';
import { SERVICE_AREAS, type ServiceArea } from '../../data/service-areas';
import { getClient, DataForSEOClient } from './client';
import {
  getComprehensiveRanking,
  generateKeywordVariations,
  FLORIDA_LOCATIONS,
  type FloridaCity
} from './serp';
import type { RankingData, ServiceAreaKeyword } from './types';

// ============================================
// Configuration
// ============================================

const BUSINESS_NAME = SITE_CONFIG.company.name;
const BUSINESS_PHONE = SITE_CONFIG.contact.phone.raw;
const WEBSITE_DOMAIN = new URL(SITE_CONFIG.seo.siteUrl).hostname;

// ============================================
// Ranking Storage Interface
// ============================================

export interface RankingHistory {
  lastUpdated: string;
  rankings: RankingData[];
}

export interface RankingSummary {
  totalKeywords: number;
  trackedKeywords: number;
  top3Count: number;
  top10Count: number;
  top20Count: number;
  notRanking: number;
  averagePosition: number;
  improvements: number;
  declines: number;
}

// ============================================
// Service Keyword Generation
// ============================================

/**
 * Get all service names from content directory
 * This is a simplified version - in production, read from the services collection
 */
export function getServiceNames(): string[] {
  // These are the primary service keywords for tracking
  return [
    'electrician',
    'electrical panel upgrade',
    'ev charger installation',
    'generator installation',
    'electrical repair',
    'outlet installation',
    'lighting installation',
    'emergency electrician',
    'ceiling fan installation',
    'smart home wiring',
    'electrical inspection',
    'surge protection',
    'circuit breaker repair',
    'home rewiring',
    'commercial electrician'
  ];
}

/**
 * Generate all keyword + location combinations to track
 */
export function generateTrackingKeywords(): ServiceAreaKeyword[] {
  const services = getServiceNames();
  const keywords: ServiceAreaKeyword[] = [];

  for (const service of services) {
    for (const area of SERVICE_AREAS) {
      // Only generate for areas we have location codes for
      if (area in FLORIDA_LOCATIONS) {
        keywords.push({
          service,
          serviceSlug: service.toLowerCase().replace(/\s+/g, '-'),
          area,
          areaSlug: area.toLowerCase().replace(/\s+/g, '-'),
          primaryKeyword: `${service} ${area}`,
          secondaryKeywords: generateKeywordVariations(service, area),
          location: area,
          locationCode: FLORIDA_LOCATIONS[area as FloridaCity]
        });
      }
    }
  }

  return keywords;
}

// ============================================
// Ranking Tracking Functions
// ============================================

/**
 * Track rankings for a single keyword
 */
export async function trackSingleKeyword(
  keyword: string,
  location: FloridaCity,
  service: string,
  area: string,
  client?: DataForSEOClient
): Promise<RankingData> {
  const apiClient = client || getClient();

  const result = await getComprehensiveRanking(
    keyword,
    location,
    BUSINESS_NAME,
    BUSINESS_PHONE,
    WEBSITE_DOMAIN,
    apiClient
  );

  return {
    keyword,
    location,
    service,
    area,
    timestamp: result.timestamp,
    mapRank: result.mapRank,
    localFinderRank: result.localFinderRank,
    organicRank: result.organicRank,
    competitorCount: result.topCompetitors.length
  };
}

/**
 * Track rankings for multiple keywords in batches
 */
export async function trackKeywordBatch(
  keywords: ServiceAreaKeyword[],
  batchSize: number = 10,
  delayMs: number = 1000,
  onProgress?: (completed: number, total: number) => void,
  client?: DataForSEOClient
): Promise<RankingData[]> {
  const apiClient = client || getClient();
  const results: RankingData[] = [];

  for (let i = 0; i < keywords.length; i += batchSize) {
    const batch = keywords.slice(i, i + batchSize);
    
    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map(kw => 
        trackSingleKeyword(
          kw.primaryKeyword,
          kw.location as FloridaCity,
          kw.service,
          kw.area,
          apiClient
        ).catch(error => {
          console.error(`Error tracking "${kw.primaryKeyword}":`, error);
          return null;
        })
      )
    );

    // Add successful results
    for (const result of batchResults) {
      if (result) results.push(result);
    }

    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + batchSize, keywords.length), keywords.length);
    }

    // Delay between batches to respect rate limits
    if (i + batchSize < keywords.length) {
      await delay(delayMs);
    }
  }

  return results;
}

/**
 * Track all rankings (full sync)
 */
export async function trackAllRankings(
  onProgress?: (completed: number, total: number) => void,
  client?: DataForSEOClient
): Promise<RankingHistory> {
  const keywords = generateTrackingKeywords();
  const rankings = await trackKeywordBatch(keywords, 5, 2000, onProgress, client);

  return {
    lastUpdated: new Date().toISOString(),
    rankings
  };
}

/**
 * Track rankings for a specific service across all areas
 */
export async function trackServiceRankings(
  serviceName: string,
  client?: DataForSEOClient
): Promise<RankingData[]> {
  const keywords: ServiceAreaKeyword[] = [];

  for (const area of SERVICE_AREAS) {
    if (area in FLORIDA_LOCATIONS) {
      keywords.push({
        service: serviceName,
        serviceSlug: serviceName.toLowerCase().replace(/\s+/g, '-'),
        area,
        areaSlug: area.toLowerCase().replace(/\s+/g, '-'),
        primaryKeyword: `${serviceName} ${area}`,
        secondaryKeywords: generateKeywordVariations(serviceName, area),
        location: area,
        locationCode: FLORIDA_LOCATIONS[area as FloridaCity]
      });
    }
  }

  return trackKeywordBatch(keywords, 5, 2000, undefined, client);
}

/**
 * Track rankings for a specific area across all services
 */
export async function trackAreaRankings(
  areaName: ServiceArea,
  client?: DataForSEOClient
): Promise<RankingData[]> {
  const services = getServiceNames();
  const keywords: ServiceAreaKeyword[] = [];

  if (!(areaName in FLORIDA_LOCATIONS)) {
    throw new Error(`Unknown area: ${areaName}`);
  }

  for (const service of services) {
    keywords.push({
      service,
      serviceSlug: service.toLowerCase().replace(/\s+/g, '-'),
      area: areaName,
      areaSlug: areaName.toLowerCase().replace(/\s+/g, '-'),
      primaryKeyword: `${service} ${areaName}`,
      secondaryKeywords: generateKeywordVariations(service, areaName),
      location: areaName,
      locationCode: FLORIDA_LOCATIONS[areaName as FloridaCity]
    });
  }

  return trackKeywordBatch(keywords, 5, 2000, undefined, client);
}

// ============================================
// Ranking Analysis Functions
// ============================================

/**
 * Calculate ranking summary statistics
 */
export function calculateRankingSummary(rankings: RankingData[]): RankingSummary {
  const tracked = rankings.filter(r => r.mapRank !== null || r.organicRank !== null);
  
  const top3 = rankings.filter(r => 
    (r.mapRank !== null && r.mapRank <= 3) ||
    (r.localFinderRank !== null && r.localFinderRank <= 3)
  );

  const top10 = rankings.filter(r =>
    (r.mapRank !== null && r.mapRank <= 10) ||
    (r.localFinderRank !== null && r.localFinderRank <= 10)
  );

  const top20 = rankings.filter(r =>
    (r.mapRank !== null && r.mapRank <= 20) ||
    (r.localFinderRank !== null && r.localFinderRank <= 20)
  );

  const notRanking = rankings.filter(r =>
    r.mapRank === null && r.localFinderRank === null && r.organicRank === null
  );

  // Calculate average position (using map rank as primary)
  const rankedItems = rankings.filter(r => r.mapRank !== null);
  const avgPosition = rankedItems.length > 0
    ? rankedItems.reduce((sum, r) => sum + (r.mapRank || 0), 0) / rankedItems.length
    : 0;

  return {
    totalKeywords: rankings.length,
    trackedKeywords: tracked.length,
    top3Count: top3.length,
    top10Count: top10.length,
    top20Count: top20.length,
    notRanking: notRanking.length,
    averagePosition: Math.round(avgPosition * 10) / 10,
    improvements: 0,  // Requires historical comparison
    declines: 0
  };
}

/**
 * Compare current rankings with historical data
 */
export function compareRankings(
  current: RankingData[],
  previous: RankingData[]
): { improvements: RankingData[]; declines: RankingData[]; stable: RankingData[] } {
  const improvements: RankingData[] = [];
  const declines: RankingData[] = [];
  const stable: RankingData[] = [];

  const previousMap = new Map(previous.map(r => [r.keyword, r]));

  for (const curr of current) {
    const prev = previousMap.get(curr.keyword);
    if (!prev) {
      stable.push(curr);
      continue;
    }

    const currRank = curr.mapRank || curr.localFinderRank || 100;
    const prevRank = prev.mapRank || prev.localFinderRank || 100;

    if (currRank < prevRank) {
      improvements.push(curr);
    } else if (currRank > prevRank) {
      declines.push(curr);
    } else {
      stable.push(curr);
    }
  }

  return { improvements, declines, stable };
}

/**
 * Get top performing keywords
 */
export function getTopPerformingKeywords(
  rankings: RankingData[],
  limit: number = 10
): RankingData[] {
  return rankings
    .filter(r => r.mapRank !== null)
    .sort((a, b) => (a.mapRank || 100) - (b.mapRank || 100))
    .slice(0, limit);
}

/**
 * Get keywords needing improvement
 */
export function getKeywordsNeedingImprovement(
  rankings: RankingData[],
  minRank: number = 10
): RankingData[] {
  return rankings
    .filter(r => {
      const rank = r.mapRank || r.localFinderRank || 100;
      return rank > minRank || rank === null;
    })
    .sort((a, b) => {
      const aRank = a.mapRank || a.localFinderRank || 100;
      const bRank = b.mapRank || b.localFinderRank || 100;
      return aRank - bRank;
    });
}

// ============================================
// Utility Functions
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
