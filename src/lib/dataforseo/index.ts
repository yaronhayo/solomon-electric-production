/**
 * DataForSEO API Library
 * Public exports for the DataForSEO integration
 * 
 * @see https://docs.dataforseo.com/v3/
 */

// Core client
export { 
  DataForSEOClient, 
  DataForSEOError, 
  getClient, 
  getSandboxClient 
} from './client';

// SERP API
export {
  getGoogleMapsRankings,
  getLocalFinderRankings,
  getOrganicRankings,
  getComprehensiveRanking,
  findBusinessInMapsResults,
  findBusinessInLocalFinderResults,
  findDomainInOrganicResults,
  generateKeywordVariations,
  FLORIDA_LOCATIONS,
  type FloridaCity,
  type RankingResult,
  type CompetitorInfo
} from './serp';

// Keywords Data API
export {
  getSearchVolume,
  getKeywordSuggestions,
  getKeywordsForSite,
  researchKeywords,
  getKeywordMetrics,
  analyzeLocalServiceKeywords,
  findOpportunityKeywords,
  calculateKeywordDifficulty,
  type KeywordData,
  type TrendData,
  type KeywordResearchResult
} from './keywords';

// On-Page API
export {
  startCrawlTask,
  getCrawlSummary,
  getCrawledPages,
  analyzePageInstant,
  getKeywordDensity,
  auditPage,
  calculateSEOScore,
  getPagesWithIssues,
  type CrawlTaskConfig,
  type PageAuditResult,
  type PageTimingData,
  type ContentStats
} from './onpage';

// Business Data API
export {
  searchBusinessInfo,
  getBusinessReviews,
  analyzeCompetitors,
  analyzeReviews,
  type BusinessInfo,
  type ReviewData,
  type CompetitorAnalysis,
  type ReviewAnalysis,
  type MarketStats
} from './business-data';

// Ranking Tracker
export {
  generateTrackingKeywords,
  trackSingleKeyword,
  trackKeywordBatch,
  trackAllRankings,
  trackServiceRankings,
  trackAreaRankings,
  calculateRankingSummary,
  compareRankings,
  getTopPerformingKeywords,
  getKeywordsNeedingImprovement,
  getServiceNames,
  type RankingHistory,
  type RankingSummary
} from './ranking-tracker';

// Types
export type {
  DataForSEOResponse,
  Task,
  TaskData,
  SerpGoogleMapsResult,
  SerpLocalFinderResult,
  SerpGoogleOrganicResult,
  GoogleMapsItem,
  LocalFinderItem,
  OrganicItem,
  BusinessDataGoogleResult,
  GoogleBusinessItem,
  GoogleReview,
  KeywordsDataResult,
  KeywordInfo,
  MonthlySearch,
  OnPageTaskResult,
  OnPageSummaryResult,
  OnPagePageResult,
  OnPageKeywordDensityResult,
  RankingData,
  ServiceAreaKeyword,
  SEOAuditResult,
  SEOIssue
} from './types';
