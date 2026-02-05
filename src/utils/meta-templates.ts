/**
 * Meta Description Templates
 * Standardized, SEO-optimized templates for consistent meta descriptions
 * 
 * Best Practices Applied:
 * - 155-160 character limit
 * - Primary keyword near the start
 * - Call-to-action included
 * - Location targeting for local SEO
 */

import { SITE_CONFIG } from '../config/site';

// ============================================
// Types
// ============================================

export interface ServiceMetaInput {
  serviceName: string;
  cityName?: string;
  countyName?: string;
  priceRange?: string;
}

export interface BlogMetaInput {
  title: string;
  category: string;
  readingTime?: number;
}

export interface ServiceAreaMetaInput {
  cityName: string;
  countyName: string;
  neighborhoods?: string[];
}

// ============================================
// Template Generators
// ============================================

/**
 * Generate meta description for service pages
 * Optimized for local search + CTR
 */
export function generateServiceMeta(input: ServiceMetaInput): string {
  const { serviceName, cityName, priceRange } = input;
  
  // With city (local landing page)
  if (cityName) {
    const base = `Professional ${serviceName.toLowerCase()} in ${cityName}. Licensed electricians, 24/7 service, free estimates.`;
    const cta = priceRange ? ` Starting at ${priceRange}.` : ' Call now!';
    return truncateMeta(base + cta);
  }
  
  // Without city (main service page)
  const base = `Expert ${serviceName.toLowerCase()} services in South Florida. FL License #${SITE_CONFIG.credentials.license.number}, 24/7 emergency service.`;
  const cta = ' Get a free estimate today!';
  return truncateMeta(base + cta);
}

/**
 * Generate meta description for blog posts
 * Optimized for click-through rate
 */
export function generateBlogMeta(input: BlogMetaInput): string {
  const { title, category, readingTime } = input;
  
  const timeStr = readingTime ? ` (${readingTime} min read)` : '';
  const base = `${title}${timeStr}. Expert ${category.toLowerCase()} tips from licensed Miami electricians.`;
  const cta = ' Learn more now!';
  
  return truncateMeta(base + cta);
}

/**
 * Generate meta description for service area pages
 * Geo-targeted for local pack
 */
export function generateServiceAreaMeta(input: ServiceAreaMetaInput): string {
  const { cityName, countyName, neighborhoods = [] } = input;
  
  let base = `Licensed electrician serving ${cityName}, ${countyName} County.`;
  
  // Add top neighborhoods if available
  if (neighborhoods.length > 0) {
    const topNeighborhoods = neighborhoods.slice(0, 2).join(', ');
    base += ` Serving ${topNeighborhoods} & nearby areas.`;
  }
  
  base += ` 24/7 emergency service, free estimates.`;
  const cta = ' Call now!';
  
  return truncateMeta(base + cta);
}

/**
 * Generate meta description for homepage
 */
export function generateHomepageMeta(): string {
  return `${SITE_CONFIG.company.name} - Licensed electricians serving Miami-Dade & Broward. 24/7 emergency service, free estimates. FL License #${SITE_CONFIG.credentials.license.number}. Call now!`;
}

/**
 * Generate meta description for contact page
 */
export function generateContactMeta(): string {
  return `Contact ${SITE_CONFIG.company.name} for electrical services in South Florida. Call ${SITE_CONFIG.contact.phone} or request a free quote online. 24/7 availability.`;
}

/**
 * Generate meta description for reviews page
 */
export function generateReviewsMeta(): string {
  const rating = SITE_CONFIG.stats.averageRating;
  const count = SITE_CONFIG.stats.totalReviews;
  return `See why ${SITE_CONFIG.company.name} has ${rating}★ rating from ${count}+ reviews. Read customer testimonials from Miami-Dade & Broward. Licensed & trusted since ${SITE_CONFIG.company.foundedYear}.`;
}

/**
 * Generate meta description for about page
 */
export function generateAboutMeta(): string {
  const years = SITE_CONFIG.credentials.yearsExperience;
  return `About ${SITE_CONFIG.company.name} - ${years}+ years serving South Florida. FL License #${SITE_CONFIG.credentials.license.number}. Family-owned, satisfaction guaranteed. Meet our team.`;
}

// ============================================
// Utilities
// ============================================

/**
 * Truncate meta description to optimal length
 * Target: 155-160 characters (Google's typical display limit)
 */
function truncateMeta(text: string, maxLength: number = 158): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Try to cut at a natural break point
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Validate meta description
 * Returns issues if any
 */
export function validateMeta(text: string): string[] {
  const issues: string[] = [];
  
  if (text.length < 100) {
    issues.push('Too short - aim for 155+ characters');
  }
  
  if (text.length > 160) {
    issues.push('Too long - may be truncated in SERPs');
  }
  
  if (!text.includes(SITE_CONFIG.company.name) && !text.includes('electrician')) {
    issues.push('Missing brand or primary keyword');
  }
  
  if (!text.match(/call|contact|get|request|schedule/i)) {
    issues.push('Consider adding a call-to-action');
  }
  
  return issues;
}

export default {
  generateServiceMeta,
  generateBlogMeta,
  generateServiceAreaMeta,
  generateHomepageMeta,
  generateContactMeta,
  generateReviewsMeta,
  generateAboutMeta,
  validateMeta,
};
