/**
 * SEO Competitor Tracker
 * Tracks and analyzes top competitors for each service + location
 * 
 * Creates actionable competitive intelligence:
 * - Who ranks above us for each keyword
 * - What they're doing better (reviews, ratings, content)
 * - Specific actions to outrank them
 */

import { getClient, DataForSEOClient } from './dataforseo/client';
import type { GoogleMapsItem } from './dataforseo/types';

// ============================================
// Types
// ============================================

export interface Competitor {
  name: string;
  placeId?: string;
  rank: number;
  rating: number | null;
  reviewCount: number;
  address: string;
  phone?: string;
  website?: string;
  category: string;
}

export interface CompetitorAnalysis {
  keyword: string;
  location: string;
  timestamp: string;
  ourRanking: number | null;
  ourBusiness: Competitor | null;
  topCompetitors: Competitor[];
  competitiveGap: CompetitiveGap;
  actionItems: string[];
}

export interface CompetitiveGap {
  reviewGap: number;  // How many more reviews they have
  ratingGap: number;  // Rating difference
  positionGap: number;  // How many positions behind
}

// ============================================
// Analysis Functions
// ============================================

/**
 * Analyze competitors from Maps results
 */
export function analyzeCompetitors(
  results: GoogleMapsItem[],
  businessName: string
): {
  ourBusiness: Competitor | null;
  competitors: Competitor[];
  ourRank: number | null;
} {
  const normalizedName = businessName.toLowerCase();
  
  let ourBusiness: Competitor | null = null;
  const competitors: Competitor[] = [];
  
  for (const item of results) {
    const competitor: Competitor = {
      name: item.title,
      placeId: item.place_id,
      rank: item.rank_group,
      rating: item.rating?.value || null,
      reviewCount: item.rating?.votes_count || 0,
      address: item.address || '',
      phone: item.phone,
      website: item.url,
      category: item.category || 'Electrician'
    };
    
    // Check if this is our business
    const isOurs = item.title.toLowerCase().includes(normalizedName) || 
                   item.title.toLowerCase().includes('solomon');
    
    if (isOurs) {
      ourBusiness = competitor;
    } else {
      competitors.push(competitor);
    }
  }
  
  return {
    ourBusiness,
    competitors,
    ourRank: ourBusiness?.rank || null
  };
}

/**
 * Calculate competitive gap
 */
export function calculateCompetitiveGap(
  ourBusiness: Competitor | null,
  topCompetitor: Competitor | null
): CompetitiveGap {
  if (!ourBusiness || !topCompetitor) {
    return {
      reviewGap: 0,
      ratingGap: 0,
      positionGap: ourBusiness?.rank ? ourBusiness.rank - 1 : 20
    };
  }
  
  return {
    reviewGap: topCompetitor.reviewCount - ourBusiness.reviewCount,
    ratingGap: (topCompetitor.rating || 0) - (ourBusiness.rating || 0),
    positionGap: ourBusiness.rank - topCompetitor.rank
  };
}

/**
 * Generate action items based on competitive analysis
 */
export function generateActionItems(
  analysis: Omit<CompetitorAnalysis, 'actionItems'>
): string[] {
  const actions: string[] = [];
  const { ourBusiness, topCompetitors, competitiveGap, keyword, location } = analysis;
  
  // Not ranking at all
  if (!ourBusiness) {
    actions.push(`Register/claim Google Business Profile for "${location}" service area`);
    actions.push(`Add "${keyword}" to GBP business description`);
    actions.push(`Request reviews from customers in ${location}`);
    return actions;
  }
  
  // Low ranking position
  if (ourBusiness.rank > 3) {
    actions.push(`Improve ranking from ${ourBusiness.rank} to top 3 for "${keyword}"`);
  }
  
  // Review gap
  if (competitiveGap.reviewGap > 10) {
    const target = topCompetitors[0]?.reviewCount || 0;
    actions.push(`Acquire ${competitiveGap.reviewGap} more reviews to match top competitor (${target} reviews)`);
  }
  
  // Rating gap
  if (competitiveGap.ratingGap > 0.2) {
    actions.push(`Improve rating from ${ourBusiness.rating?.toFixed(1)} to ${(topCompetitors[0]?.rating || 5).toFixed(1)}`);
  }
  
  // Lower reviews than competitor
  if (ourBusiness.reviewCount < 100) {
    actions.push(`Build review volume - currently at ${ourBusiness.reviewCount}, target 100+`);
  }
  
  // Content optimization
  actions.push(`Create/optimize service page for "${keyword}" targeting ${location}`);
  
  // Local citations
  if (ourBusiness.rank > 5) {
    actions.push(`Build local citations for ${location} on Yelp, BBB, HomeAdvisor`);
  }
  
  return actions;
}

/**
 * Get full competitive analysis for a keyword + location
 */
export async function getCompetitorAnalysis(
  keyword: string,
  location: string,
  locationCode: number,
  businessName: string,
  client?: DataForSEOClient
): Promise<CompetitorAnalysis> {
  const apiClient = client || getClient();
  
  // Fetch Maps results
  const taskData = [{
    keyword,
    location_code: locationCode,
    language_code: 'en',
    device: 'desktop',
    depth: 20
  }];

  const response = await apiClient.post<{ items: GoogleMapsItem[] }>(
    '/serp/google/maps/live/advanced',
    taskData
  );

  const items = response.tasks?.[0]?.result?.[0]?.items || [];
  
  // Analyze competitors
  const { ourBusiness, competitors, ourRank } = analyzeCompetitors(items, businessName);
  
  const topCompetitors = competitors.slice(0, 5);
  
  // Calculate gap
  const competitiveGap = calculateCompetitiveGap(ourBusiness, topCompetitors[0] || null);
  
  // Build analysis object (without action items first)
  const analysisBase = {
    keyword,
    location,
    timestamp: new Date().toISOString(),
    ourRanking: ourRank,
    ourBusiness,
    topCompetitors,
    competitiveGap
  };
  
  // Generate action items
  const actionItems = generateActionItems(analysisBase);
  
  return {
    ...analysisBase,
    actionItems
  };
}

/**
 * Aggregate competitive analysis across all locations
 */
export function aggregateCompetitorData(
  analyses: CompetitorAnalysis[]
): {
  competitorFrequency: Map<string, number>;
  averageGaps: CompetitiveGap;
  prioritizedActions: string[];
} {
  const competitorFrequency = new Map<string, number>();
  let totalReviewGap = 0;
  let totalRatingGap = 0;
  let totalPositionGap = 0;
  const allActions: string[] = [];
  
  for (const analysis of analyses) {
    // Count competitor frequency
    for (const competitor of analysis.topCompetitors) {
      const count = competitorFrequency.get(competitor.name) || 0;
      competitorFrequency.set(competitor.name, count + 1);
    }
    
    // Sum gaps
    totalReviewGap += analysis.competitiveGap.reviewGap;
    totalRatingGap += analysis.competitiveGap.ratingGap;
    totalPositionGap += analysis.competitiveGap.positionGap;
    
    // Collect actions
    allActions.push(...analysis.actionItems);
  }
  
  const count = analyses.length || 1;
  
  // Dedupe and prioritize actions
  const actionCounts = new Map<string, number>();
  for (const action of allActions) {
    actionCounts.set(action, (actionCounts.get(action) || 0) + 1);
  }
  
  const prioritizedActions = [...actionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([action]) => action);
  
  return {
    competitorFrequency,
    averageGaps: {
      reviewGap: Math.round(totalReviewGap / count),
      ratingGap: Math.round((totalRatingGap / count) * 100) / 100,
      positionGap: Math.round(totalPositionGap / count)
    },
    prioritizedActions
  };
}

export default {
  analyzeCompetitors,
  calculateCompetitiveGap,
  generateActionItems,
  getCompetitorAnalysis,
  aggregateCompetitorData
};
