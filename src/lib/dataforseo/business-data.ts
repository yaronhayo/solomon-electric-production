/**
 * DataForSEO Business Data API Integration
 * For Google Business Profile data, reviews, and competitor analysis
 * 
 * @see https://docs.dataforseo.com/v3/business_data/overview/
 */

import { getClient, DataForSEOClient } from './client';
import type { GoogleBusinessItem, GoogleReview, GoogleReviewResult } from './types';

// ============================================
// Business Data Interfaces
// ============================================

export interface BusinessInfo {
  title: string;
  description: string | null;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number;
  category: string;
  categories: string[];
  isVerified: boolean;
  latitude: number;
  longitude: number;
  placeId: string;
  photos: number;
  workHours: Record<string, string> | null;
  attributes: BusinessAttribute[];
}

export interface BusinessAttribute {
  name: string;
  value: string | boolean | string[];
}

export interface ReviewData {
  id: string;
  author: string;
  authorUrl: string;
  authorImage: string | null;
  rating: number | null;
  text: string | null;
  timestamp: string | null;
  timeAgo: string | null;
  ownerReply: string | null;
}

export interface CompetitorAnalysis {
  businessName: string;
  ourBusiness: BusinessInfo | null;
  competitors: CompetitorInfo[];
  marketStats: MarketStats;
}

export interface CompetitorInfo {
  rank: number;
  name: string;
  rating: number | null;
  reviewCount: number;
  address: string;
  category: string;
  distance?: number;
  placeId: string;
}

export interface MarketStats {
  averageRating: number;
  averageReviews: number;
  topCompetitorRating: number;
  topCompetitorReviews: number;
  ourRankByRating: number | null;
  ourRankByReviews: number | null;
}

// ============================================
// Business Info Functions
// ============================================

/**
 * Get Google Business Profile information by keyword search
 */
export async function searchBusinessInfo(
  keyword: string,
  locationName: string,
  client?: DataForSEOClient
): Promise<GoogleBusinessItem[]> {
  const apiClient = client || getClient();

  const taskData = [{
    keyword,
    location_name: `${locationName}, Florida, United States`,
    language_name: 'English',
    depth: 20
  }];

  try {
    const response = await apiClient.post<{ items: GoogleBusinessItem[] }>(
      '/business_data/google/my_business_info/task_post',
      taskData
    );

    // Get the task ID and fetch results
    if (response.tasks?.[0]?.id) {
      const taskId = response.tasks[0].id;
      // Wait a moment for processing
      await delay(2000);
      return await getBusinessInfoResults(taskId, apiClient);
    }
    return [];
  } catch (error) {
    console.error(`Error searching business info for "${keyword}":`, error);
    throw error;
  }
}

/**
 * Get business info results from a task
 */
async function getBusinessInfoResults(
  taskId: string,
  client: DataForSEOClient
): Promise<GoogleBusinessItem[]> {
  const taskData = [{
    id: taskId
  }];

  try {
    const response = await client.post<{ items: GoogleBusinessItem[] }>(
      '/business_data/google/my_business_info/task_get',
      taskData
    );

    if (response.tasks?.[0]?.result?.[0]?.items) {
      return response.tasks[0].result[0].items;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching business info results:`, error);
    throw error;
  }
}

/**
 * Get reviews for a specific business
 */
export async function getBusinessReviews(
  keyword: string,
  locationName: string,
  limit: number = 100,
  client?: DataForSEOClient
): Promise<ReviewData[]> {
  const apiClient = client || getClient();

  const taskData = [{
    keyword,
    location_name: `${locationName}, Florida, United States`,
    language_name: 'English',
    depth: limit
  }];

  try {
    const response = await apiClient.post<GoogleReviewResult>(
      '/business_data/google/reviews/task_post',
      taskData
    );

    if (response.tasks?.[0]?.id) {
      const taskId = response.tasks[0].id;
      await delay(3000);  // Reviews take longer
      return await getReviewsResults(taskId, apiClient);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching reviews for "${keyword}":`, error);
    throw error;
  }
}

/**
 * Get review results from a task
 */
async function getReviewsResults(
  taskId: string,
  client: DataForSEOClient
): Promise<ReviewData[]> {
  const taskData = [{
    id: taskId
  }];

  try {
    const response = await client.post<GoogleReviewResult>(
      '/business_data/google/reviews/task_get',
      taskData
    );

    if (response.tasks?.[0]?.result?.[0]?.reviews) {
      return response.tasks[0].result[0].reviews.map(review => ({
        id: review.review_id,
        author: review.profile_name,
        authorUrl: review.profile_url,
        authorImage: review.profile_image_url || null,
        rating: review.rating?.value || null,
        text: review.review_text || null,
        timestamp: review.timestamp || null,
        timeAgo: review.time_ago || null,
        ownerReply: review.owner_answer || null
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching review results:`, error);
    throw error;
  }
}

// ============================================
// Competitor Analysis Functions
// ============================================

/**
 * Analyze competitors for a specific business type in an area
 */
export async function analyzeCompetitors(
  businessType: string,
  locationName: string,
  ourBusinessName: string,
  client?: DataForSEOClient
): Promise<CompetitorAnalysis> {
  const businesses = await searchBusinessInfo(businessType, locationName, client);

  // Find our business in the results
  const normalizedOurName = ourBusinessName.toLowerCase();
  const ourBusiness = businesses.find(b => 
    b.title.toLowerCase().includes(normalizedOurName) ||
    normalizedOurName.includes(b.title.toLowerCase())
  );

  // Extract competitor info
  const competitors: CompetitorInfo[] = businesses
    .filter(b => b.title.toLowerCase() !== normalizedOurName)
    .map((b, index) => ({
      rank: index + 1,
      name: b.title,
      rating: b.rating?.value || null,
      reviewCount: b.rating?.votes_count || 0,
      address: b.address,
      category: b.category,
      placeId: b.place_id
    }));

  // Calculate market stats
  const allRatings = businesses
    .map(b => b.rating?.value)
    .filter((r): r is number => r != null);
  
  const allReviews = businesses
    .map(b => b.rating?.votes_count || 0);

  const marketStats: MarketStats = {
    averageRating: allRatings.length > 0 
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length 
      : 0,
    averageReviews: allReviews.length > 0
      ? allReviews.reduce((a, b) => a + b, 0) / allReviews.length
      : 0,
    topCompetitorRating: competitors[0]?.rating || 0,
    topCompetitorReviews: competitors[0]?.reviewCount || 0,
    ourRankByRating: ourBusiness 
      ? businesses.sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0))
        .findIndex(b => b.place_id === ourBusiness.place_id) + 1
      : null,
    ourRankByReviews: ourBusiness
      ? businesses.sort((a, b) => (b.rating?.votes_count || 0) - (a.rating?.votes_count || 0))
        .findIndex(b => b.place_id === ourBusiness.place_id) + 1
      : null
  };

  return {
    businessName: ourBusinessName,
    ourBusiness: ourBusiness ? transformToBusinessInfo(ourBusiness) : null,
    competitors,
    marketStats
  };
}

/**
 * Transform GoogleBusinessItem to BusinessInfo
 */
function transformToBusinessInfo(item: GoogleBusinessItem): BusinessInfo {
  return {
    title: item.title,
    description: item.description || null,
    address: item.address,
    phone: item.phone || null,
    website: item.url || null,
    rating: item.rating?.value || null,
    reviewCount: item.reviews_count,
    category: item.category,
    categories: item.additional_categories || [],
    isVerified: item.is_claimed,
    latitude: item.latitude,
    longitude: item.longitude,
    placeId: item.place_id,
    photos: item.total_photos,
    workHours: item.work_time?.work_hours || null,
    attributes: item.attributes?.map(a => ({
      name: a.name,
      value: a.value ?? a.values ?? ''
    })) || []
  };
}

// ============================================
// Review Analysis Functions
// ============================================

/**
 * Analyze review sentiment and extract insights
 */
export function analyzeReviews(reviews: ReviewData[]): ReviewAnalysis {
  const totalReviews = reviews.length;
  const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const respondedCount = reviews.filter(r => r.ownerReply).length;

  for (const review of reviews) {
    if (review.rating && review.rating >= 1 && review.rating <= 5) {
      ratingsCount[review.rating as 1|2|3|4|5]++;
    }
  }

  const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  // Find common themes in reviews (simple keyword extraction)
  const positiveKeywords = new Map<string, number>();
  const negativeKeywords = new Map<string, number>();

  for (const review of reviews) {
    if (!review.text) continue;
    const words = review.text.toLowerCase().split(/\s+/);
    const isPositive = (review.rating || 0) >= 4;
    const map = isPositive ? positiveKeywords : negativeKeywords;
    
    for (const word of words) {
      if (word.length > 4) {  // Skip short words
        map.set(word, (map.get(word) || 0) + 1);
      }
    }
  }

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingsDistribution: ratingsCount,
    responseRate: totalReviews > 0 ? respondedCount / totalReviews : 0,
    positivePercentage: totalReviews > 0 
      ? ((ratingsCount[4] + ratingsCount[5]) / totalReviews) * 100 
      : 0,
    recentReviews: reviews.slice(0, 10)
  };
}

export interface ReviewAnalysis {
  totalReviews: number;
  averageRating: number;
  ratingsDistribution: Record<1|2|3|4|5, number>;
  responseRate: number;
  positivePercentage: number;
  recentReviews: ReviewData[];
}

// ============================================
// Utility Functions
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
