/**
 * DataForSEO Keywords Data API Integration
 * For getting search volume, keyword suggestions, and trend data
 * 
 * @see https://docs.dataforseo.com/v3/keywords_data/overview/
 */

import { getClient, DataForSEOClient } from './client';
import type { KeywordsDataResult, KeywordSuggestionsResult, KeywordInfo } from './types';

// ============================================
// Configuration
// ============================================

// US location code for Keywords Data API
const US_LOCATION_CODE = 2840;
const FLORIDA_LOCATION_CODE = 21142;

// ============================================
// Keywords Data Result Interfaces
// ============================================

export interface KeywordData {
  keyword: string;
  searchVolume: number | null;
  competition: string | null;
  cpc: number | null;
  trend: TrendData[];
  difficulty?: number;
}

export interface TrendData {
  year: number;
  month: number;
  volume: number;
}

export interface KeywordResearchResult {
  seed: string;
  keywords: KeywordData[];
  totalVolume: number;
  averageCpc: number;
}

// ============================================
// Search Volume Functions
// ============================================

/**
 * Get search volume data for a list of keywords
 * Uses Google Ads data for accurate volume metrics
 */
export async function getSearchVolume(
  keywords: string[],
  client?: DataForSEOClient
): Promise<KeywordsDataResult[]> {
  const apiClient = client || getClient();

  // DataForSEO accepts up to 1000 keywords per request
  const batchSize = 1000;
  const results: KeywordsDataResult[] = [];

  for (let i = 0; i < keywords.length; i += batchSize) {
    const batch = keywords.slice(i, i + batchSize);
    
    const taskData = [{
      keywords: batch,
      location_code: US_LOCATION_CODE,
      language_code: 'en',
      date_from: getDateMonthsAgo(12),  // Last 12 months
      date_to: getCurrentDate()
    }];

    try {
      const response = await apiClient.post<KeywordsDataResult>(
        '/keywords_data/google_ads/search_volume/live',
        taskData
      );

      if (response.tasks?.[0]?.result) {
        results.push(...response.tasks[0].result);
      }
    } catch (error) {
      console.error(`Error fetching search volume for batch starting at ${i}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Get keyword suggestions based on a seed keyword
 */
export async function getKeywordSuggestions(
  seedKeyword: string,
  limit: number = 50,
  client?: DataForSEOClient
): Promise<KeywordsDataResult[]> {
  const apiClient = client || getClient();

  const taskData = [{
    keyword: seedKeyword,
    location_code: US_LOCATION_CODE,
    language_code: 'en',
    include_seed_keyword: true,
    limit: limit
  }];

  try {
    const response = await apiClient.post<KeywordsDataResult>(
      '/keywords_data/google_ads/keywords_for_keywords/live',
      taskData
    );

    if (response.tasks?.[0]?.result) {
      return response.tasks[0].result;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching keyword suggestions for "${seedKeyword}":`, error);
    throw error;
  }
}

/**
 * Get keywords for a specific website/domain
 */
export async function getKeywordsForSite(
  domain: string,
  limit: number = 100,
  client?: DataForSEOClient
): Promise<KeywordsDataResult[]> {
  const apiClient = client || getClient();

  const taskData = [{
    target: domain,
    location_code: US_LOCATION_CODE,
    language_code: 'en',
    limit: limit
  }];

  try {
    const response = await apiClient.post<KeywordsDataResult>(
      '/keywords_data/google_ads/keywords_for_site/live',
      taskData
    );

    if (response.tasks?.[0]?.result) {
      return response.tasks[0].result;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching keywords for site "${domain}":`, error);
    throw error;
  }
}

// ============================================
// Keyword Research Functions
// ============================================

/**
 * Perform comprehensive keyword research for a topic
 */
export async function researchKeywords(
  seedKeyword: string,
  client?: DataForSEOClient
): Promise<KeywordResearchResult> {
  const apiClient = client || getClient();

  // Get suggestions for the seed keyword
  const suggestions = await getKeywordSuggestions(seedKeyword, 100, apiClient);

  // Transform results
  const keywords: KeywordData[] = suggestions.map(result => ({
    keyword: result.keyword,
    searchVolume: result.keyword_info?.search_volume || null,
    competition: result.keyword_info?.competition_level || null,
    cpc: result.keyword_info?.cpc || null,
    trend: result.keyword_info?.monthly_searches?.map(ms => ({
      year: ms.year,
      month: ms.month,
      volume: ms.search_volume
    })) || []
  }));

  // Calculate aggregates
  const totalVolume = keywords.reduce((sum, kw) => sum + (kw.searchVolume || 0), 0);
  const cpcValues = keywords.filter(kw => kw.cpc != null).map(kw => kw.cpc!);
  const averageCpc = cpcValues.length > 0 
    ? cpcValues.reduce((a, b) => a + b, 0) / cpcValues.length 
    : 0;

  return {
    seed: seedKeyword,
    keywords: keywords.sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0)),
    totalVolume,
    averageCpc
  };
}

/**
 * Get search volume data formatted for easy use
 */
export async function getKeywordMetrics(
  keywords: string[],
  client?: DataForSEOClient
): Promise<Map<string, KeywordData>> {
  const apiClient = client || getClient();
  const results = await getSearchVolume(keywords, apiClient);
  
  const metricsMap = new Map<string, KeywordData>();
  
  for (const result of results) {
    metricsMap.set(result.keyword.toLowerCase(), {
      keyword: result.keyword,
      searchVolume: result.keyword_info?.search_volume || null,
      competition: result.keyword_info?.competition_level || null,
      cpc: result.keyword_info?.cpc || null,
      trend: result.keyword_info?.monthly_searches?.map(ms => ({
        year: ms.year,
        month: ms.month,
        volume: ms.search_volume
      })) || []
    });
  }
  
  return metricsMap;
}

// ============================================
// Local SEO Keyword Functions
// ============================================

/**
 * Generate and analyze keywords for a local service business
 */
export async function analyzeLocalServiceKeywords(
  service: string,
  locations: string[],
  client?: DataForSEOClient
): Promise<Map<string, KeywordData>> {
  const keywords: string[] = [];

  // Generate keyword combinations
  for (const location of locations) {
    keywords.push(
      `${service} ${location}`,
      `${service} in ${location}`,
      `${service} near ${location}`,
      `${location} ${service}`,
      `best ${service} ${location}`
    );
  }

  // Add generic service keywords
  keywords.push(
    service,
    `${service} near me`,
    `best ${service}`,
    `${service} service`,
    `${service} company`
  );

  return getKeywordMetrics(keywords, client);
}

/**
 * Find high-volume, low-competition keywords
 */
export function findOpportunityKeywords(
  keywords: KeywordData[],
  minVolume: number = 100,
  maxCompetition: number = 0.5
): KeywordData[] {
  return keywords
    .filter(kw => {
      const hasVolume = (kw.searchVolume || 0) >= minVolume;
      const lowCompetition = kw.competition === 'LOW' || 
        kw.competition === 'MEDIUM' ||
        (kw.difficulty !== undefined && kw.difficulty <= maxCompetition * 100);
      return hasVolume && lowCompetition;
    })
    .sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0));
}

// ============================================
// Utility Functions
// ============================================

function getDateMonthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
}

function getCurrentDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Calculate keyword difficulty score (0-100)
 */
export function calculateKeywordDifficulty(info: KeywordInfo): number {
  if (!info.competition) return 50; // Unknown difficulty
  
  // Based on competition value (0-1) and CPC
  const competitionScore = (info.competition || 0) * 60;
  const cpcScore = info.cpc ? Math.min(info.cpc / 10, 1) * 40 : 0;
  
  return Math.round(competitionScore + cpcScore);
}
