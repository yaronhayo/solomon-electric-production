/**
 * Local SEO Optimizer
 * Generates optimized content recommendations based on real data
 * 
 * Uses DataForSEO + GSC data to:
 * - Identify underperforming pages
 * - Suggest keyword optimizations
 * - Generate content improvement recommendations
 * - Track NAP consistency
 */

import { SITE_CONFIG } from '../config/site';

// ============================================
// Types
// ============================================

export interface PageOptimization {
  url: string;
  title: string;
  issues: SEOIssue[];
  recommendations: Recommendation[];
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
}

export interface SEOIssue {
  type: 'title' | 'description' | 'h1' | 'content' | 'schema' | 'internal_link' | 'keyword';
  severity: 'error' | 'warning' | 'info';
  message: string;
  currentValue?: string;
  suggestedValue?: string;
}

export interface Recommendation {
  action: string;
  priority: number;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface NAPData {
  name: string;
  address: string;
  phone: string;
  website: string;
}

// ============================================
// Local SEO Configuration
// ============================================

export const BUSINESS_NAP: NAPData = {
  name: SITE_CONFIG.company.name,
  address: `${SITE_CONFIG.contact.address.street}, ${SITE_CONFIG.contact.address.city}, ${SITE_CONFIG.contact.address.state} ${SITE_CONFIG.contact.address.zip}`,
  phone: SITE_CONFIG.contact.phone.formatted,
  website: SITE_CONFIG.seo.siteUrl
};

// Target keywords for each service type
export const SERVICE_KEYWORDS: Record<string, string[]> = {
  'electrician': [
    'electrician near me',
    'local electrician',
    'residential electrician',
    'licensed electrician',
    'emergency electrician'
  ],
  'panel-upgrade': [
    'electrical panel upgrade',
    'panel replacement',
    '200 amp service upgrade',
    'circuit breaker panel upgrade',
    'electrical panel installation'
  ],
  'ev-charger': [
    'ev charger installation',
    'tesla charger installation',
    'level 2 charger installation',
    'home ev charging station',
    'electric vehicle charger installation'
  ],
  'generator': [
    'generator installation',
    'standby generator',
    'whole home generator',
    'generac installation',
    'backup generator installation'
  ],
  'lighting': [
    'lighting installation',
    'led lighting installation',
    'recessed lighting installation',
    'outdoor lighting',
    'landscape lighting'
  ]
};

// ============================================
// Optimization Functions
// ============================================

/**
 * Generate local-optimized title tag
 */
export function generateLocalTitle(
  serviceName: string,
  cityName: string,
  options?: {
    includeState?: boolean;
    includeCompanyName?: boolean;
    maxLength?: number;
  }
): string {
  const {
    includeState = true,
    includeCompanyName = true,
    maxLength = 60
  } = options || {};

  const state = includeState ? ', FL' : '';
  const company = includeCompanyName ? ` | ${SITE_CONFIG.company.name}` : '';
  
  // Try full format first
  let title = `${serviceName} in ${cityName}${state}${company}`;
  
  // Shorten if needed
  if (title.length > maxLength) {
    title = `${serviceName} ${cityName}${state}${company}`;
  }
  
  if (title.length > maxLength) {
    title = `${serviceName} ${cityName}${state}`;
  }
  
  return title.slice(0, maxLength);
}

/**
 * Generate local-optimized meta description
 */
export function generateLocalDescription(
  serviceName: string,
  cityName: string,
  options?: {
    includePhone?: boolean;
    includeRating?: boolean;
    maxLength?: number;
  }
): string {
  const {
    includePhone = true,
    includeRating = true,
    maxLength = 160
  } = options || {};

  const rating = includeRating ? `⭐ ${SITE_CONFIG.stats.averageRating}-star rated. ` : '';
  const phone = includePhone ? ` Call ${SITE_CONFIG.contact.phone.formatted}` : '';
  
  const base = `${rating}Professional ${serviceName.toLowerCase()} in ${cityName}, FL. Licensed, insured & available 24/7.${phone}`;
  
  return base.slice(0, maxLength);
}

/**
 * Generate keyword variations for a service + location
 */
export function generateKeywordVariations(
  serviceName: string,
  cityName: string
): string[] {
  const service = serviceName.toLowerCase();
  const city = cityName.toLowerCase();
  
  return [
    `${service} ${city}`,
    `${service} in ${city}`,
    `${service} near ${city}`,
    `${city} ${service}`,
    `best ${service} ${city}`,
    `${service} ${city} fl`,
    `${service} ${city} florida`,
    `affordable ${service} ${city}`,
    `professional ${service} ${city}`,
    `licensed ${service} ${city}`,
    `${service} company ${city}`,
    `${service} services ${city}`
  ];
}

/**
 * Check content for keyword optimization
 */
export function analyzeKeywordDensity(
  content: string,
  targetKeywords: string[]
): Map<string, { count: number; density: number; optimal: boolean }> {
  const wordCount = content.split(/\s+/).length;
  const results = new Map();
  
  for (const keyword of targetKeywords) {
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    const count = matches?.length || 0;
    const density = (count / wordCount) * 100;
    
    // Optimal density is 1-2% for primary keywords, 0.5-1% for secondary
    const optimal = density >= 0.5 && density <= 2.5;
    
    results.set(keyword, { count, density: Math.round(density * 100) / 100, optimal });
  }
  
  return results;
}

/**
 * Generate content optimization recommendations
 */
export function generateContentRecommendations(
  pageData: {
    url: string;
    title: string;
    description: string;
    h1: string;
    content: string;
    internalLinks: number;
    externalLinks: number;
  },
  targetService: string,
  targetCity: string
): PageOptimization {
  const issues: SEOIssue[] = [];
  const recommendations: Recommendation[] = [];
  
  const primaryKeyword = `${targetService} ${targetCity}`.toLowerCase();
  
  // Title analysis
  if (!pageData.title.toLowerCase().includes(targetCity.toLowerCase())) {
    issues.push({
      type: 'title',
      severity: 'warning',
      message: `Title doesn't include target city "${targetCity}"`,
      currentValue: pageData.title,
      suggestedValue: generateLocalTitle(targetService, targetCity)
    });
  }
  
  if (pageData.title.length > 60) {
    issues.push({
      type: 'title',
      severity: 'warning',
      message: `Title too long (${pageData.title.length} chars)`,
      currentValue: pageData.title
    });
  }
  
  // Description analysis
  if (!pageData.description.toLowerCase().includes(targetCity.toLowerCase())) {
    issues.push({
      type: 'description',
      severity: 'warning',
      message: `Description doesn't include target city`,
      suggestedValue: generateLocalDescription(targetService, targetCity)
    });
  }
  
  // H1 analysis
  if (!pageData.h1.toLowerCase().includes(targetService.toLowerCase())) {
    issues.push({
      type: 'h1',
      severity: 'error',
      message: `H1 doesn't include primary service keyword`,
      currentValue: pageData.h1
    });
  }
  
  // Content analysis
  const wordCount = pageData.content.split(/\s+/).length;
  if (wordCount < 800) {
    issues.push({
      type: 'content',
      severity: 'warning',
      message: `Content thin (${wordCount} words). Aim for 800+ words`,
    });
    
    recommendations.push({
      action: `Expand content to 800+ words with local context about ${targetCity}`,
      priority: 1,
      expectedImpact: 'Improved rankings for long-tail keywords',
      effort: 'medium'
    });
  }
  
  // Keyword density check
  const densityAnalysis = analyzeKeywordDensity(pageData.content, [primaryKeyword]);
  const primaryDensity = densityAnalysis.get(primaryKeyword);
  
  if (primaryDensity && !primaryDensity.optimal) {
    if (primaryDensity.density < 0.5) {
      issues.push({
        type: 'keyword',
        severity: 'warning',
        message: `Primary keyword density too low (${primaryDensity.density}%)`,
      });
      
      recommendations.push({
        action: `Add more mentions of "${primaryKeyword}" naturally throughout content`,
        priority: 2,
        expectedImpact: 'Better keyword relevance signals',
        effort: 'low'
      });
    }
  }
  
  // Internal linking
  if (pageData.internalLinks < 5) {
    issues.push({
      type: 'internal_link',
      severity: 'info',
      message: `Low internal link count (${pageData.internalLinks})`,
    });
    
    recommendations.push({
      action: 'Add internal links to related services and nearby service areas',
      priority: 3,
      expectedImpact: 'Better link equity distribution',
      effort: 'low'
    });
  }
  
  // Determine priority based on issues
  const hasErrors = issues.some(i => i.severity === 'error');
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  let priority: 'high' | 'medium' | 'low';
  if (hasErrors || warningCount >= 3) {
    priority = 'high';
  } else if (warningCount >= 1) {
    priority = 'medium';
  } else {
    priority = 'low';
  }
  
  return {
    url: pageData.url,
    title: pageData.title,
    issues,
    recommendations: recommendations.sort((a, b) => a.priority - b.priority),
    priority,
    estimatedImpact: priority === 'high' 
      ? 'Significant ranking improvement expected'
      : priority === 'medium'
        ? 'Moderate ranking improvement expected'
        : 'Minor optimization - already well-optimized'
  };
}

/**
 * Generate local schema markup recommendations
 */
export function getSchemaRecommendations(
  pageType: 'service' | 'service-area' | 'home' | 'about' | 'contact'
): string[] {
  const base = ['LocalBusiness (ElectricalContractor)', 'BreadcrumbList'];
  
  switch (pageType) {
    case 'service':
      return [...base, 'Service', 'FAQPage', 'AggregateRating'];
    case 'service-area':
      return [...base, 'GeoCircle/GeoCoordinates', 'AreaServed', 'FAQPage'];
    case 'home':
      return [...base, 'WebSite', 'Organization', 'AggregateRating'];
    case 'about':
      return [...base, 'AboutPage', 'Organization'];
    case 'contact':
      return [...base, 'ContactPage', 'PostalAddress'];
    default:
      return base;
  }
}

export default {
  BUSINESS_NAP,
  SERVICE_KEYWORDS,
  generateLocalTitle,
  generateLocalDescription,
  generateKeywordVariations,
  analyzeKeywordDensity,
  generateContentRecommendations,
  getSchemaRecommendations
};
