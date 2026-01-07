/**
 * DataForSEO API Types
 * TypeScript interfaces for all DataForSEO API responses
 */

// ============================================
// Common Types
// ============================================

export interface DataForSEOResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: Task<T>[];
}

export interface Task<T> {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  path: string[];
  data: TaskData;
  result: T[] | null;
}

export interface TaskData {
  api: string;
  function: string;
  se?: string;
  se_type?: string;
  keyword?: string;
  location_code?: number;
  location_name?: string;
  language_code?: string;
  device?: string;
  os?: string;
}

// ============================================
// SERP API Types - Google Maps
// ============================================

export interface SerpGoogleMapsResult {
  keyword: string;
  type: string;
  se_domain: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  spell?: SpellInfo;
  refinement_chips?: RefinementChip[];
  item_types: string[];
  se_results_count: number;
  items_count: number;
  items: GoogleMapsItem[];
}

export interface GoogleMapsItem {
  type: string;
  rank_group: number;
  rank_absolute: number;
  domain?: string;
  title: string;
  url?: string;
  contact_url?: string;
  contributor_url?: string;
  address: string;
  address_info?: AddressInfo;
  place_id: string;
  phone?: string;
  main_image?: string;
  category: string;
  additional_categories?: string[];
  category_ids?: string[];
  work_hours?: WorkHours;
  feature_id: string;
  cid: string;
  latitude: number;
  longitude: number;
  is_claimed: boolean;
  local_justifications?: LocalJustification[];
  is_directory_item: boolean;
  rating?: RatingInfo;
  hotel_rating?: number;
  price_level?: string;
  hotel_description?: string;
  book_online_url?: string;
  is_spending_on_ads?: boolean;
}

export interface AddressInfo {
  borough?: string;
  address: string;
  city: string;
  zip: string;
  region: string;
  country_code: string;
}

export interface WorkHours {
  work_hours: WorkHoursInfo;
  timetable: Record<string, TimeSlot[]>;
  current_status: string;
}

export interface WorkHoursInfo {
  open_24_7?: boolean;
  open_now?: boolean;
  current_status?: string;
}

export interface TimeSlot {
  open: TimeInfo;
  close: TimeInfo;
}

export interface TimeInfo {
  hour: number;
  minute: number;
}

export interface LocalJustification {
  type: string;
  text?: string;
}

export interface RatingInfo {
  rating_type: string;
  value: number;
  votes_count: number;
  rating_max?: number;
}

export interface SpellInfo {
  keyword: string;
  type: string;
}

export interface RefinementChip {
  type: string;
  title: string;
  value: string;
}

// ============================================
// SERP API Types - Google Local Finder
// ============================================

export interface SerpLocalFinderResult {
  keyword: string;
  type: string;
  se_domain: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  item_types: string[];
  se_results_count: number;
  items_count: number;
  items: LocalFinderItem[];
}

export interface LocalFinderItem {
  type: string;
  rank_group: number;
  rank_absolute: number;
  title: string;
  domain?: string;
  url?: string;
  address: string;
  address_info?: AddressInfo;
  place_id: string;
  phone?: string;
  category: string;
  latitude: number;
  longitude: number;
  is_claimed: boolean;
  rating?: RatingInfo;
  cid: string;
  feature_id: string;
}

// ============================================
// SERP API Types - Google Organic
// ============================================

export interface SerpGoogleOrganicResult {
  keyword: string;
  type: string;
  se_domain: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  item_types: string[];
  se_results_count: number;
  items_count: number;
  items: OrganicItem[];
}

export interface OrganicItem {
  type: string;
  rank_group: number;
  rank_absolute: number;
  position: string;
  xpath: string;
  domain: string;
  title: string;
  url: string;
  cache_url?: string;
  related_search_url?: string;
  breadcrumb: string;
  website_name?: string;
  is_image: boolean;
  is_video: boolean;
  is_featured_snippet: boolean;
  is_malicious: boolean;
  is_web_story: boolean;
  description: string;
  pre_snippet?: string;
  extended_snippet?: string;
  amp_version: boolean;
  rating?: RatingInfo;
  highlighted?: string[];
  links?: SiteLink[];
  faq?: FAQItem;
  timestamp?: string;
  extended_people_also_search?: string[];
  about_this_result?: AboutThisResult;
  rectangle?: Rectangle;
}

export interface SiteLink {
  type: string;
  title: string;
  url: string;
  description?: string;
}

export interface FAQItem {
  type: string;
  items: { question: string; answer?: string }[];
}

export interface AboutThisResult {
  type: string;
  url: string;
  source?: string;
  source_info?: string;
  source_url?: string;
  language?: string;
  location?: string;
  search_terms?: string[];
  related_terms?: string[];
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================
// Business Data API Types
// ============================================

export interface BusinessDataGoogleResult {
  keyword: string;
  type: string;
  se_domain: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  items?: GoogleBusinessItem[];
}

export interface GoogleBusinessItem {
  type: string;
  title: string;
  original_title?: string;
  description?: string;
  reviews_count: number;
  rating?: RatingInfo;
  cid: string;
  place_id: string;
  feature_id: string;
  address: string;
  address_info?: AddressInfo;
  phone?: string;
  url?: string;
  domain: string;
  logo?: string;
  main_image?: string;
  total_photos: number;
  category: string;
  additional_categories?: string[];
  work_hours?: WorkHours;
  latitude: number;
  longitude: number;
  is_claimed: boolean;
  attributes?: BusinessAttribute[];
  people_also_search?: PeopleAlsoSearch[];
  work_time?: WorkTime;
  popular_times?: PopularTimes;
  local_business_links?: LocalBusinessLink[];
  is_directory_item: boolean;
}

export interface BusinessAttribute {
  name: string;
  value?: string | boolean;
  values?: string[];
}

export interface PeopleAlsoSearch {
  cid: string;
  feature_id: string;
  title: string;
  rating?: RatingInfo;
  category?: string;
}

export interface WorkTime {
  work_hours: Record<string, string>;
}

export interface PopularTimes {
  popular_times_by_day: Record<string, PopularTimesEntry[]>;
}

export interface PopularTimesEntry {
  time: number;
  popular_index: number;
}

export interface LocalBusinessLink {
  link_type: string;
  title: string;
  url: string;
}

export interface GoogleReviewResult {
  type: string;
  title: string;
  reviews_count: number;
  rating: RatingInfo;
  place_id: string;
  reviews: GoogleReview[];
}

export interface GoogleReview {
  type: string;
  review_id: string;
  rating?: RatingInfo;
  review_text?: string;
  original_review_text?: string;
  review_url?: string;
  profile_name: string;
  profile_url: string;
  profile_image_url?: string;
  owner_answer?: string;
  owner_answer_timestamp?: string;
  timestamp?: string;
  time_ago?: string;
}

// ============================================
// Keywords Data API Types
// ============================================

export interface KeywordsDataResult {
  keyword: string;
  location_code: number;
  language_code: string;
  search_partners: boolean;
  keyword_info: KeywordInfo;
  keyword_info_normalized_with_bing?: KeywordInfo;
  keyword_info_normalized_with_clickstream?: KeywordInfo;
  impressions_info?: ImpressionsInfo;
  serp_info?: SerpInfo;
  avg_backlinks_info?: AvgBacklinksInfo;
  search_intent_info?: SearchIntentInfo;
}

export interface KeywordInfo {
  se_type: string;
  last_updated_time: string;
  competition?: number;
  competition_level?: string;
  cpc?: number;
  search_volume?: number;
  low_top_of_page_bid?: number;
  high_top_of_page_bid?: number;
  categories?: number[];
  monthly_searches?: MonthlySearch[];
}

export interface MonthlySearch {
  year: number;
  month: number;
  search_volume: number;
}

export interface ImpressionsInfo {
  se_type: string;
  last_updated_time: string;
  bid: number;
  match_type: string;
  ad_position_min: number;
  ad_position_max: number;
  ad_position_average: number;
  cpc_min: number;
  cpc_max: number;
  cpc_average: number;
  daily_impressions_min: number;
  daily_impressions_max: number;
  daily_impressions_average: number;
  daily_clicks_min: number;
  daily_clicks_max: number;
  daily_clicks_average: number;
  daily_cost_min: number;
  daily_cost_max: number;
  daily_cost_average: number;
}

export interface SerpInfo {
  se_type: string;
  check_url: string;
  serp_item_types?: string[];
  se_results_count?: number;
  last_updated_time: string;
  previous_updated_time?: string;
}

export interface AvgBacklinksInfo {
  se_type: string;
  backlinks?: number;
  dofollow?: number;
  referring_pages?: number;
  referring_domains?: number;
  referring_main_domains?: number;
  rank?: number;
  main_domain_rank?: number;
  last_updated_time: string;
}

export interface SearchIntentInfo {
  se_type: string;
  main_intent?: string;
  foreign_intent?: string[];
  last_updated_time: string;
}

export interface KeywordSuggestionsResult {
  keyword: string;
  location_code: number;
  language_code: string;
  keyword_info: KeywordInfo;
  related_keywords?: string[];
  keyword_suggestions?: KeywordSuggestion[];
}

export interface KeywordSuggestion {
  keyword: string;
  keyword_info: KeywordInfo;
  search_intent_info?: SearchIntentInfo;
}

// ============================================
// On-Page API Types
// ============================================

export interface OnPageTaskResult {
  crawl_progress: string;
  crawl_status: CrawlStatus;
  max_crawl_pages: number;
  pages_in_queue: number;
  pages_crawled: number;
}

export interface CrawlStatus {
  max_crawl_pages: number;
  pages_in_queue: number;
  pages_crawled: number;
  pages_failed: number;
}

export interface OnPageSummaryResult {
  crawl_progress: string;
  crawl_status: CrawlStatus;
  crawl_gateway_address: string;
  crawl_stop_reason?: string;
  domain_info: DomainInfo;
  page_metrics: PageMetrics;
}

export interface DomainInfo {
  name: string;
  cms?: string;
  ip?: string;
  server?: string;
  crawl_start: string;
  crawl_end?: string;
  extended_crawl_status?: string;
  ssl_info?: SSLInfo;
  checks?: Record<string, boolean>;
  total_pages: number;
  page_not_found_status_code?: number;
  canonicalization_status_code?: number;
  directory_browsing_status_code?: number;
  www_redirect_status_code?: number;
}

export interface SSLInfo {
  valid_certificate: boolean;
  certificate_issuer?: string;
  certificate_subject?: string;
  certificate_version?: number;
  certificate_hash?: string;
  certificate_expiration_date?: string;
}

export interface PageMetrics {
  broken_resources: number;
  broken_links: number;
  duplicate_title: number;
  duplicate_description: number;
  duplicate_content: number;
  pages_with_clicks?: number;
  links_external: number;
  links_internal: number;
  non_indexable: number;
  onpage_score: number;
  pages_blocked_by_robots_txt: number;
  pages_blocked_by_x_robots_tag: number;
  canonicalized: number;
  checks?: Record<string, number>;
}

export interface OnPagePageResult {
  resource_type: string;
  status_code: number;
  location?: string;
  url: string;
  meta: PageMeta;
  page_timing?: PageTiming;
  onpage_score: number;
  total_dom_size: number;
  custom_js_response?: Record<string, unknown>;
  resource_errors?: ResourceError;
  broken_resources: boolean;
  broken_links: boolean;
  duplicate_title: boolean;
  duplicate_description: boolean;
  duplicate_content: boolean;
  click_depth: number;
  size: number;
  encoded_size: number;
  total_transfer_size: number;
  fetch_time: string;
  cache_control?: CacheControl;
  checks?: Record<string, boolean | number | string>;
  content_encoding?: string;
  media_type?: string;
  server?: string;
  is_resource?: boolean;
  url_length?: number;
  relative_url_length?: number;
  last_modified?: LastModified;
}

export interface PageMeta {
  title?: string;
  charset: number;
  follow: boolean;
  generator?: string;
  htags?: HTagsInfo;
  description?: string;
  favicon?: string;
  meta_keywords?: string;
  canonical?: string;
  internal_links_count: number;
  external_links_count: number;
  inbound_links_count: number;
  images_count: number;
  images_size: number;
  scripts_count: number;
  scripts_size: number;
  stylesheets_count: number;
  stylesheets_size: number;
  title_length?: number;
  description_length?: number;
  render_blocking_scripts_count?: number;
  render_blocking_stylesheets_count?: number;
  cumulative_layout_shift?: number;
  meta_title?: string;
  content?: PageContent;
  deprecated_tags?: string[];
  duplicate_meta_tags?: string[];
  spell?: SpellCheckInfo;
  social_media_tags?: SocialMediaTags;
}

export interface HTagsInfo {
  h1?: string[];
  h2?: string[];
  h3?: string[];
  h4?: string[];
  h5?: string[];
  h6?: string[];
}

export interface PageContent {
  plain_text_size: number;
  plain_text_rate: number;
  plain_text_word_count: number;
  automated_readability_index: number;
  coleman_liau_index: number;
  dale_chall_readability_index: number;
  flesch_kincaid_grade_level: number;
  smog_readability_index: number;
  description_to_content_consistency: number;
  title_to_content_consistency: number;
  meta_keywords_to_content_consistency?: number;
}

export interface SpellCheckInfo {
  hunspell_language_code?: string;
  misspelled_words_count?: number;
  misspelled_words?: string[];
}

export interface SocialMediaTags {
  og_tag?: Record<string, string>;
  twitter_card?: Record<string, string>;
}

export interface PageTiming {
  time_to_interactive?: number;
  dom_complete?: number;
  largest_contentful_paint?: number;
  first_input_delay?: number;
  connection_time?: number;
  time_to_secure_connection?: number;
  request_sent_time?: number;
  waiting_time?: number;
  download_time?: number;
  duration_time?: number;
  fetch_start?: number;
  fetch_end?: number;
}

export interface ResourceError {
  line?: number;
  column?: number;
  message?: string;
  status_code?: number;
}

export interface CacheControl {
  cachable: boolean;
  ttl?: number;
}

export interface LastModified {
  header?: string;
  sitemap?: string;
  meta_tag?: string;
}

export interface OnPageKeywordDensityResult {
  keyword: string;
  frequency: number;
  density: number;
}

// ============================================
// Ranking Tracker Types (Internal)
// ============================================

export interface RankingData {
  keyword: string;
  location: string;
  service: string;
  area: string;
  timestamp: string;
  mapRank: number | null;
  localFinderRank: number | null;
  organicRank: number | null;
  businessCid?: string;
  competitorCount?: number;
}

export interface ServiceAreaKeyword {
  service: string;
  serviceSlug: string;
  area: string;
  areaSlug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  location: string;
  locationCode: number;
}

export interface SEOAuditResult {
  url: string;
  timestamp: string;
  onpageScore: number;
  issues: SEOIssue[];
  keywordDensity: OnPageKeywordDensityResult[];
  pageMetrics: PageMetrics;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  recommendation?: string;
}
