/**
 * DataForSEO On-Page API Integration
 * For website auditing, SEO analysis, and page optimization
 * 
 * @see https://docs.dataforseo.com/v3/on_page/overview/
 */

import { getClient, DataForSEOClient } from './client';
import type {
  OnPageTaskResult,
  OnPageSummaryResult,
  OnPagePageResult,
  OnPageKeywordDensityResult,
  SEOIssue
} from './types';

// ============================================
// On-Page Task Interfaces
// ============================================

export interface CrawlTaskConfig {
  domain: string;
  maxPages?: number;
  maxDepth?: number;
  enableJavascript?: boolean;
  calculateKeywordDensity?: boolean;
  checkSpell?: boolean;
}

export interface PageAuditResult {
  url: string;
  statusCode: number;
  onpageScore: number;
  title: string | null;
  description: string | null;
  issues: SEOIssue[];
  timing: PageTimingData | null;
  contentStats: ContentStats | null;
}

export interface PageTimingData {
  loadTime: number | null;
  timeToInteractive: number | null;
  largestContentfulPaint: number | null;
}

export interface ContentStats {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Map<string, number>;
}

// ============================================
// Crawl Task Functions
// ============================================

/**
 * Start a website crawl task
 * Returns the task ID for status checking
 */
export async function startCrawlTask(
  config: CrawlTaskConfig,
  client?: DataForSEOClient
): Promise<string> {
  const apiClient = client || getClient();

  const taskData = [{
    target: config.domain,
    max_crawl_pages: config.maxPages || 100,
    max_crawl_depth: config.maxDepth || 3,
    enable_javascript: config.enableJavascript || false,
    calculate_keyword_density: config.calculateKeywordDensity || true,
    check_spell: config.checkSpell || false,
    load_resources: true,
    enable_browser_rendering: false  // Disable to reduce cost
  }];

  try {
    const response = await apiClient.post<OnPageTaskResult>(
      '/on_page/task_post',
      taskData
    );

    if (response.tasks?.[0]?.id) {
      return response.tasks[0].id;
    }
    throw new Error('No task ID returned');
  } catch (error) {
    console.error(`Error starting crawl for "${config.domain}":`, error);
    throw error;
  }
}

/**
 * Get the summary of a crawl task
 */
export async function getCrawlSummary(
  taskId: string,
  client?: DataForSEOClient
): Promise<OnPageSummaryResult | null> {
  const apiClient = client || getClient();

  const taskData = [{
    id: taskId
  }];

  try {
    const response = await apiClient.post<OnPageSummaryResult>(
      '/on_page/summary',
      taskData
    );

    if (response.tasks?.[0]?.result?.[0]) {
      return response.tasks[0].result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching crawl summary for task ${taskId}:`, error);
    throw error;
  }
}

/**
 * Get crawled pages from a task
 */
export async function getCrawledPages(
  taskId: string,
  limit: number = 100,
  offset: number = 0,
  client?: DataForSEOClient
): Promise<OnPagePageResult[]> {
  const apiClient = client || getClient();

  const taskData = [{
    id: taskId,
    limit,
    offset
  }];

  try {
    const response = await apiClient.post<OnPagePageResult>(
      '/on_page/pages',
      taskData
    );

    if (response.tasks?.[0]?.result) {
      return response.tasks[0].result;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching pages for task ${taskId}:`, error);
    throw error;
  }
}

// ============================================
// Instant Page Analysis Functions
// ============================================

/**
 * Get instant on-page analysis for a single URL
 * Does not require starting a crawl task
 */
export async function analyzePageInstant(
  url: string,
  client?: DataForSEOClient
): Promise<OnPagePageResult | null> {
  const apiClient = client || getClient();

  const taskData = [{
    url,
    enable_javascript: true,
    calculate_keyword_density: true,
    load_resources: true
  }];

  try {
    const response = await apiClient.post<OnPagePageResult>(
      '/on_page/instant_pages',
      taskData
    );

    if (response.tasks?.[0]?.result?.[0]) {
      return response.tasks[0].result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error analyzing page "${url}":`, error);
    throw error;
  }
}

/**
 * Get keyword density for a specific page
 */
export async function getKeywordDensity(
  taskId: string,
  url: string,
  client?: DataForSEOClient
): Promise<OnPageKeywordDensityResult[]> {
  const apiClient = client || getClient();

  const taskData = [{
    id: taskId,
    url
  }];

  try {
    const response = await apiClient.post<OnPageKeywordDensityResult>(
      '/on_page/keyword_density',
      taskData
    );

    if (response.tasks?.[0]?.result) {
      return response.tasks[0].result;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching keyword density for "${url}":`, error);
    throw error;
  }
}

// ============================================
// SEO Audit Analysis Functions
// ============================================

/**
 * Perform a comprehensive SEO audit of a page
 */
export async function auditPage(
  url: string,
  client?: DataForSEOClient
): Promise<PageAuditResult> {
  const pageData = await analyzePageInstant(url, client);

  if (!pageData) {
    throw new Error(`Could not analyze page: ${url}`);
  }

  const issues = extractSEOIssues(pageData);

  return {
    url,
    statusCode: pageData.status_code,
    onpageScore: pageData.onpage_score,
    title: pageData.meta?.title || null,
    description: pageData.meta?.description || null,
    issues,
    timing: pageData.page_timing ? {
      loadTime: pageData.page_timing.duration_time || null,
      timeToInteractive: pageData.page_timing.time_to_interactive || null,
      largestContentfulPaint: pageData.page_timing.largest_contentful_paint || null
    } : null,
    contentStats: pageData.meta?.content ? {
      wordCount: pageData.meta.content.plain_text_word_count,
      readabilityScore: pageData.meta.content.flesch_kincaid_grade_level,
      keywordDensity: new Map()
    } : null
  };
}

/**
 * Extract SEO issues from page analysis
 */
function extractSEOIssues(page: OnPagePageResult): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // Title issues
  if (!page.meta?.title) {
    issues.push({
      type: 'error',
      category: 'Meta',
      message: 'Missing page title',
      recommendation: 'Add a descriptive <title> tag between 50-60 characters'
    });
  } else if (page.meta.title_length && page.meta.title_length > 60) {
    issues.push({
      type: 'warning',
      category: 'Meta',
      message: `Title too long (${page.meta.title_length} chars)`,
      recommendation: 'Shorten title to 50-60 characters for optimal display in search results'
    });
  } else if (page.meta.title_length && page.meta.title_length < 30) {
    issues.push({
      type: 'warning',
      category: 'Meta',
      message: `Title too short (${page.meta.title_length} chars)`,
      recommendation: 'Expand title to 50-60 characters to maximize CTR'
    });
  }

  // Description issues
  if (!page.meta?.description) {
    issues.push({
      type: 'error',
      category: 'Meta',
      message: 'Missing meta description',
      recommendation: 'Add a compelling meta description between 120-160 characters'
    });
  } else if (page.meta.description_length && page.meta.description_length > 160) {
    issues.push({
      type: 'warning',
      category: 'Meta',
      message: `Meta description too long (${page.meta.description_length} chars)`,
      recommendation: 'Shorten to 120-160 characters to prevent truncation'
    });
  }

  // H1 issues
  if (!page.meta?.htags?.h1 || page.meta.htags.h1.length === 0) {
    issues.push({
      type: 'error',
      category: 'Headings',
      message: 'Missing H1 tag',
      recommendation: 'Add a single H1 tag that includes your primary keyword'
    });
  } else if (page.meta.htags.h1.length > 1) {
    issues.push({
      type: 'warning',
      category: 'Headings',
      message: `Multiple H1 tags found (${page.meta.htags.h1.length})`,
      recommendation: 'Use only one H1 tag per page for optimal SEO'
    });
  }

  // Content issues
  if (page.meta?.content) {
    if (page.meta.content.plain_text_word_count < 300) {
      issues.push({
        type: 'warning',
        category: 'Content',
        message: `Thin content (${page.meta.content.plain_text_word_count} words)`,
        recommendation: 'Add more comprehensive content (aim for 800+ words for service pages)'
      });
    }

    if (page.meta.content.flesch_kincaid_grade_level > 12) {
      issues.push({
        type: 'info',
        category: 'Content',
        message: 'Content may be difficult to read',
        recommendation: 'Consider simplifying language for broader audience accessibility'
      });
    }
  }

  // Link issues
  if (page.broken_links) {
    issues.push({
      type: 'error',
      category: 'Links',
      message: 'Page contains broken links',
      recommendation: 'Fix or remove all broken links to improve user experience and SEO'
    });
  }

  if (page.meta && page.meta.internal_links_count < 3) {
    issues.push({
      type: 'warning',
      category: 'Links',
      message: `Low internal link count (${page.meta.internal_links_count})`,
      recommendation: 'Add more internal links to distribute page authority and help navigation'
    });
  }

  // Image issues
  if (page.broken_resources) {
    issues.push({
      type: 'error',
      category: 'Resources',
      message: 'Page has broken resources (images, scripts, etc.)',
      recommendation: 'Fix all broken resource links'
    });
  }

  // Performance issues
  if (page.page_timing?.largest_contentful_paint && page.page_timing.largest_contentful_paint > 2500) {
    issues.push({
      type: 'warning',
      category: 'Performance',
      message: `Slow LCP (${(page.page_timing.largest_contentful_paint / 1000).toFixed(2)}s)`,
      recommendation: 'Optimize largest contentful paint to under 2.5s for better Core Web Vitals'
    });
  }

  // Duplicate content issues
  if (page.duplicate_title) {
    issues.push({
      type: 'warning',
      category: 'Duplicate',
      message: 'Duplicate title tag detected',
      recommendation: 'Ensure each page has a unique title tag'
    });
  }

  if (page.duplicate_description) {
    issues.push({
      type: 'warning',
      category: 'Duplicate',
      message: 'Duplicate meta description detected',
      recommendation: 'Ensure each page has a unique meta description'
    });
  }

  return issues;
}

/**
 * Generate an SEO score based on page metrics
 */
export function calculateSEOScore(page: OnPagePageResult): number {
  let score = page.onpage_score;

  // Adjust based on issues
  if (page.broken_links) score -= 10;
  if (page.broken_resources) score -= 5;
  if (page.duplicate_title) score -= 10;
  if (page.duplicate_description) score -= 5;

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get pages with issues from a crawl
 */
export async function getPagesWithIssues(
  taskId: string,
  issueType: 'broken_links' | 'duplicate_title' | 'duplicate_description' | 'non_indexable',
  client?: DataForSEOClient
): Promise<OnPagePageResult[]> {
  const apiClient = client || getClient();

  const filters = {
    'broken_links': ['broken_links', '=', true],
    'duplicate_title': ['duplicate_title', '=', true],
    'duplicate_description': ['duplicate_description', '=', true],
    'non_indexable': ['meta.follow', '=', false]
  };

  const taskData = [{
    id: taskId,
    filters: [filters[issueType]],
    limit: 100
  }];

  try {
    const response = await apiClient.post<OnPagePageResult>(
      '/on_page/pages',
      taskData
    );

    if (response.tasks?.[0]?.result) {
      return response.tasks[0].result;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching pages with ${issueType}:`, error);
    throw error;
  }
}
