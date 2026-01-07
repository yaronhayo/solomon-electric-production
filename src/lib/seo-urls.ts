/**
 * SEO URL Utilities
 * Comprehensive URL management for optimal local SEO
 * 
 * Features:
 * - URL canonicalization
 * - Slug generation  
 * - Breadcrumb generation
 * - Schema.org URL formatting
 * - Hreflang generation
 */

import { SITE_CONFIG } from '../config/site';

// ============================================
// Configuration
// ============================================

const SITE_URL = SITE_CONFIG.seo.siteUrl;
const CANONICAL_HOST = new URL(SITE_URL).hostname;

// ============================================
// URL Canonicalization
// ============================================

/**
 * Generate the canonical URL for a given path
 * Ensures consistent URL format across the site
 */
export function getCanonicalUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slash except for homepage
  const cleanPath = normalizedPath === '/' 
    ? '/' 
    : normalizedPath.replace(/\/+$/, '');
  
  // Add trailing slash for directory pages
  const finalPath = cleanPath === '/' || cleanPath.includes('.') 
    ? cleanPath 
    : `${cleanPath}/`;
  
  return `${SITE_URL}${finalPath}`;
}

/**
 * Get URL without trailing slash (for comparison/matching)
 */
export function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '').toLowerCase();
}

/**
 * Check if a URL is internal to the site
 */
export function isInternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, SITE_URL);
    return urlObj.hostname === CANONICAL_HOST || 
           urlObj.hostname === `www.${CANONICAL_HOST}`;
  } catch {
    // Relative URLs are internal
    return !url.startsWith('http');
  }
}

// ============================================
// Slug Generation
// ============================================

/**
 * Generate an SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+|-+$/g, ''); // Trim - from start/end
}

/**
 * Generate service URL from service name
 */
export function getServiceUrl(serviceSlug: string): string {
  return getCanonicalUrl(`/services/${serviceSlug}`);
}

/**
 * Generate service area URL from city name
 */
export function getServiceAreaUrl(citySlug: string): string {
  return getCanonicalUrl(`/service-areas/${citySlug}`);
}

/**
 * Generate localized service URL (service + area combination)
 */
export function getLocalizedServiceUrl(serviceSlug: string, citySlug: string): string {
  return getCanonicalUrl(`/services/${serviceSlug}/${citySlug}`);
}

/**
 * Generate blog post URL
 */
export function getBlogPostUrl(postSlug: string): string {
  return getCanonicalUrl(`/blog/${postSlug}`);
}

// ============================================
// Breadcrumb Generation
// ============================================

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

/**
 * Generate breadcrumbs from URL path
 */
export function generateBreadcrumbs(path: string, labels?: Record<string, string>): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: SITE_URL, position: 1 }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Get label from provided labels or format segment
    const label = labels?.[segment] || formatSegmentLabel(segment);
    
    breadcrumbs.push({
      name: label,
      url: getCanonicalUrl(currentPath),
      position: index + 2
    });
  });

  return breadcrumbs;
}

/**
 * Format URL segment as readable label
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate Schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url
    }))
  };
}

// ============================================
// Local SEO URL Helpers
// ============================================

/**
 * Generate all localized URLs for a service
 */
export function getServiceLocalizedUrls(
  serviceSlug: string, 
  serviceName: string,
  areas: { slug: string; name: string }[]
): { area: string; url: string; title: string }[] {
  return areas.map(area => ({
    area: area.name,
    url: getLocalizedServiceUrl(serviceSlug, area.slug),
    title: `${serviceName} in ${area.name}, FL`
  }));
}

/**
 * Generate URL for Google Maps embed
 */
export function getGoogleMapsEmbedUrl(
  address: string,
  apiKey?: string
): string {
  const encodedAddress = encodeURIComponent(address);
  const key = apiKey || import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
  return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodedAddress}`;
}

/**
 * Generate Google Maps directions URL
 */
export function getGoogleMapsDirectionsUrl(destination: string): string {
  const encoded = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
}

// ============================================
// URL Validation
// ============================================

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if URL path exists in sitemap
 */
export function isValidSitePath(path: string): boolean {
  const validPaths = [
    '/',
    '/about',
    '/contact',
    '/services',
    '/service-areas',
    '/blog',
    '/reviews',
    '/faq',
    '/book'
  ];

  const normalizedPath = normalizeUrl(path);
  
  // Check exact match or starts with valid prefix
  return validPaths.some(valid => 
    normalizedPath === valid ||
    normalizedPath.startsWith(`${valid}/`)
  );
}

// ============================================
// Hreflang Generation (for future multi-language)
// ============================================

export interface HreflangEntry {
  lang: string;
  url: string;
}

/**
 * Generate hreflang links for a page
 * Currently single language, but ready for expansion
 */
export function generateHreflangLinks(path: string): HreflangEntry[] {
  const url = getCanonicalUrl(path);
  
  return [
    { lang: 'en-US', url },
    { lang: 'x-default', url }
  ];
}

// ============================================
// Sitemap Helpers
// ============================================

/**
 * Generate sitemap entry for a URL
 */
export function generateSitemapEntry(
  path: string,
  lastmod?: Date,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  priority: number = 0.5
): { loc: string; lastmod?: string; changefreq: string; priority: number } {
  return {
    loc: getCanonicalUrl(path),
    lastmod: lastmod?.toISOString().split('T')[0],
    changefreq,
    priority
  };
}

/**
 * Get priority for a given page type
 */
export function getPagePriority(path: string): number {
  if (path === '/') return 1.0;
  if (path.startsWith('/services/') && !path.includes('/', 10)) return 0.9;
  if (path.startsWith('/service-areas/')) return 0.8;
  if (path.startsWith('/guides/')) return 0.85;
  if (path.startsWith('/blog/')) return 0.7;
  if (['/contact', '/about', '/reviews'].some(p => path.startsWith(p))) return 0.6;
  if (['/privacy', '/terms'].some(p => path.startsWith(p))) return 0.3;
  return 0.5;
}

// ============================================
// Export Utilities
// ============================================

export const seoUrls = {
  getCanonicalUrl,
  normalizeUrl,
  isInternalUrl,
  generateSlug,
  getServiceUrl,
  getServiceAreaUrl,
  getLocalizedServiceUrl,
  getBlogPostUrl,
  generateBreadcrumbs,
  generateBreadcrumbSchema,
  getServiceLocalizedUrls,
  getGoogleMapsEmbedUrl,
  getGoogleMapsDirectionsUrl,
  isValidUrl,
  isValidSitePath,
  generateHreflangLinks,
  generateSitemapEntry,
  getPagePriority
};

export default seoUrls;
