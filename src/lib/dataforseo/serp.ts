/**
 * DataForSEO SERP API Integration
 * For tracking Google Maps, Local Finder, and Organic search rankings
 * 
 * @see https://docs.dataforseo.com/v3/serp/google/maps/overview/
 * @see https://docs.dataforseo.com/v3/serp/google/local_finder/overview/
 * @see https://docs.dataforseo.com/v3/serp/google/organic/overview/
 */

import { getClient, DataForSEOClient } from './client';
import type {
  SerpGoogleMapsResult,
  SerpLocalFinderResult,
  SerpGoogleOrganicResult,
  GoogleMapsItem,
  LocalFinderItem,
  OrganicItem
} from './types';

// ============================================
// Configuration
// ============================================

// Florida location codes for DataForSEO
export const FLORIDA_LOCATIONS = {
  'Miami': 1015116,
  'Fort Lauderdale': 1015023,
  'Hollywood': 1015032,
  'Miami Beach': 1015117,
  'Boca Raton': 1014986,
  'Coral Springs': 1015004,
  'Pembroke Pines': 1015152,
  'Hialeah': 1015029,
  'Homestead': 1015033,
  'Jupiter': 1015045,
  'West Palm Beach': 1015207,
  'Boynton Beach': 1014992,
  'Delray Beach': 1015010,
  'Pompano Beach': 1015158,
  'Davie': 1015008,
  'Plantation': 1015155,
  'Sunrise': 1015181,
  'Miramar': 1015121,
  'Coral Gables': 1015003,
  'Aventura': 1014976,
  'Weston': 1015206,
  'Deerfield Beach': 1015009,
  'Tamarac': 1015184,
  'Margate': 1015100,
  'Coconut Creek': 1015001,
  'Lauderhill': 1015075,
  'North Miami': 1015140,
  'Miami Gardens': 1015118,
  'Wellington': 1015205,
} as const;

export type FloridaCity = keyof typeof FLORIDA_LOCATIONS;

// ============================================
// SERP Result Interfaces
// ============================================

export interface RankingResult {
  keyword: string;
  location: string;
  timestamp: string;
  businessName: string;
  mapRank: number | null;
  localFinderRank: number | null;
  organicRank: number | null;
  totalResults: number;
  topCompetitors: CompetitorInfo[];
}

export interface CompetitorInfo {
  rank: number;
  name: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
}

// ============================================
// Google Maps SERP Functions
// ============================================

/**
 * Get Google Maps rankings for a keyword in a specific location
 * Uses the Live/Advanced endpoint for real-time results
 */
export async function getGoogleMapsRankings(
  keyword: string,
  location: FloridaCity,
  client?: DataForSEOClient
): Promise<SerpGoogleMapsResult | null> {
  const apiClient = client || getClient();
  
  const locationCode = FLORIDA_LOCATIONS[location];
  if (!locationCode) {
    throw new Error(`Unknown location: ${location}`);
  }

  const taskData = [{
    keyword,
    location_code: locationCode,
    language_code: 'en',
    device: 'desktop',
    os: 'windows',
    depth: 20  // Get top 20 results
  }];

  try {
    const response = await apiClient.post<SerpGoogleMapsResult>(
      '/serp/google/maps/live/advanced',
      taskData
    );

    if (response.tasks?.[0]?.result?.[0]) {
      return response.tasks[0].result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching Maps rankings for "${keyword}" in ${location}:`, error);
    throw error;
  }
}

/**
 * Get Google Local Finder rankings for a keyword
 */
export async function getLocalFinderRankings(
  keyword: string,
  location: FloridaCity,
  client?: DataForSEOClient
): Promise<SerpLocalFinderResult | null> {
  const apiClient = client || getClient();
  
  const locationCode = FLORIDA_LOCATIONS[location];
  if (!locationCode) {
    throw new Error(`Unknown location: ${location}`);
  }

  const taskData = [{
    keyword,
    location_code: locationCode,
    language_code: 'en',
    device: 'desktop',
    os: 'windows',
    depth: 20
  }];

  try {
    const response = await apiClient.post<SerpLocalFinderResult>(
      '/serp/google/local_finder/live/advanced',
      taskData
    );

    if (response.tasks?.[0]?.result?.[0]) {
      return response.tasks[0].result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching Local Finder rankings for "${keyword}" in ${location}:`, error);
    throw error;
  }
}

/**
 * Get Google Organic search rankings for a keyword
 */
export async function getOrganicRankings(
  keyword: string,
  location: FloridaCity,
  client?: DataForSEOClient
): Promise<SerpGoogleOrganicResult | null> {
  const apiClient = client || getClient();
  
  const locationCode = FLORIDA_LOCATIONS[location];
  if (!locationCode) {
    throw new Error(`Unknown location: ${location}`);
  }

  const taskData = [{
    keyword,
    location_code: locationCode,
    language_code: 'en',
    device: 'desktop',
    os: 'windows',
    depth: 100  // Top 100 organic results
  }];

  try {
    const response = await apiClient.post<SerpGoogleOrganicResult>(
      '/serp/google/organic/live/advanced',
      taskData
    );

    if (response.tasks?.[0]?.result?.[0]) {
      return response.tasks[0].result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching Organic rankings for "${keyword}" in ${location}:`, error);
    throw error;
  }
}

// ============================================
// Ranking Analysis Functions
// ============================================

/**
 * Find a business's rank in Google Maps results
 */
export function findBusinessInMapsResults(
  results: SerpGoogleMapsResult,
  businessName: string,
  businessPhone?: string
): GoogleMapsItem | null {
  if (!results.items) return null;

  const normalizedBusinessName = businessName.toLowerCase();
  
  return results.items.find(item => {
    // Match by name (fuzzy)
    const nameMatch = item.title.toLowerCase().includes(normalizedBusinessName) ||
      normalizedBusinessName.includes(item.title.toLowerCase());
    
    // Match by phone if provided
    const phoneMatch = businessPhone && item.phone 
      ? item.phone.replace(/\D/g, '').includes(businessPhone.replace(/\D/g, ''))
      : false;
    
    return nameMatch || phoneMatch;
  }) || null;
}

/**
 * Find a business's rank in Local Finder results
 */
export function findBusinessInLocalFinderResults(
  results: SerpLocalFinderResult,
  businessName: string,
  businessPhone?: string
): LocalFinderItem | null {
  if (!results.items) return null;

  const normalizedBusinessName = businessName.toLowerCase();
  
  return results.items.find(item => {
    const nameMatch = item.title.toLowerCase().includes(normalizedBusinessName) ||
      normalizedBusinessName.includes(item.title.toLowerCase());
    
    const phoneMatch = businessPhone && item.phone
      ? item.phone.replace(/\D/g, '').includes(businessPhone.replace(/\D/g, ''))
      : false;
    
    return nameMatch || phoneMatch;
  }) || null;
}

/**
 * Find a domain's rank in organic results
 */
export function findDomainInOrganicResults(
  results: SerpGoogleOrganicResult,
  domain: string
): OrganicItem | null {
  if (!results.items) return null;

  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
  
  return results.items.find(item => {
    const itemDomain = item.domain?.toLowerCase().replace(/^www\./, '');
    return itemDomain === normalizedDomain || itemDomain?.includes(normalizedDomain);
  }) || null;
}

/**
 * Get comprehensive ranking data for a keyword
 */
export async function getComprehensiveRanking(
  keyword: string,
  location: FloridaCity,
  businessName: string,
  businessPhone: string,
  websiteDomain: string,
  client?: DataForSEOClient
): Promise<RankingResult> {
  const apiClient = client || getClient();
  const timestamp = new Date().toISOString();

  // Fetch all three ranking types in parallel
  const [mapsResult, localFinderResult, organicResult] = await Promise.all([
    getGoogleMapsRankings(keyword, location, apiClient).catch(() => null),
    getLocalFinderRankings(keyword, location, apiClient).catch(() => null),
    getOrganicRankings(keyword, location, apiClient).catch(() => null)
  ]);

  // Find our business in each result set
  const mapsItem = mapsResult 
    ? findBusinessInMapsResults(mapsResult, businessName, businessPhone)
    : null;
  
  const localFinderItem = localFinderResult
    ? findBusinessInLocalFinderResults(localFinderResult, businessName, businessPhone)
    : null;
  
  const organicItem = organicResult
    ? findDomainInOrganicResults(organicResult, websiteDomain)
    : null;

  // Extract top competitors from maps results
  const topCompetitors: CompetitorInfo[] = mapsResult?.items
    ?.slice(0, 5)
    .map(item => ({
      rank: item.rank_group,
      name: item.title,
      address: item.address,
      rating: item.rating?.value,
      reviewCount: item.rating?.votes_count
    })) || [];

  return {
    keyword,
    location,
    timestamp,
    businessName,
    mapRank: mapsItem?.rank_group || null,
    localFinderRank: localFinderItem?.rank_group || null,
    organicRank: organicItem?.rank_group || null,
    totalResults: mapsResult?.se_results_count || 0,
    topCompetitors
  };
}

/**
 * Generate all keyword variations for a service + area combination
 */
export function generateKeywordVariations(
  serviceName: string,
  areaName: string
): string[] {
  const serviceTerms = serviceName.toLowerCase();
  const areaLower = areaName.toLowerCase();
  
  return [
    `${serviceTerms} ${areaLower}`,
    `${serviceTerms} in ${areaLower}`,
    `${serviceTerms} near ${areaLower}`,
    `${areaLower} ${serviceTerms}`,
    `best ${serviceTerms} ${areaLower}`,
    `${serviceTerms} ${areaLower} fl`,
    `${serviceTerms} ${areaLower} florida`
  ];
}
