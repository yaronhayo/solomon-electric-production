/**
 * VideoObject Schema Generator
 * Generates structured data for embedded videos
 * 
 * Benefits:
 * - Video carousels in search results
 * - Rich snippets with thumbnails
 * - Increased CTR for video content
 */

import { SITE_CONFIG } from '../../config/site';

const SITE_URL = SITE_CONFIG.seo.siteUrl;

// ============================================
// Types
// ============================================

export interface VideoInput {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;  // ISO 8601 format
  duration?: string;   // ISO 8601 duration format (e.g., PT1H30M)
  contentUrl?: string; // Direct URL to video file
  embedUrl?: string;   // Embed URL (e.g., YouTube embed)
  transcript?: string;
  interactionCount?: number;
  expires?: string;    // ISO 8601 format
}

export interface VideoSchemaOptions {
  includePublisher?: boolean;
  regionRestrictions?: string[];
  hasPart?: VideoClip[];
}

export interface VideoClip {
  name: string;
  startOffset: number;  // seconds
  endOffset: number;    // seconds
  url?: string;
}

// ============================================
// Schema Generators
// ============================================

/**
 * Generate VideoObject schema for a single video
 */
export function generateVideoSchema(
  video: VideoInput,
  options: VideoSchemaOptions = {}
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
  };

  // Optional fields
  if (video.duration) {
    schema.duration = video.duration;
  }

  if (video.contentUrl) {
    schema.contentUrl = video.contentUrl;
  }

  if (video.embedUrl) {
    schema.embedUrl = video.embedUrl;
  }

  if (video.transcript) {
    schema.transcript = video.transcript;
  }

  if (video.interactionCount) {
    schema.interactionStatistic = {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: video.interactionCount,
    };
  }

  if (video.expires) {
    schema.expires = video.expires;
  }

  // Add publisher info
  if (options.includePublisher !== false) {
    schema.publisher = {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_CONFIG.company.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    };
  }

  // Add region restrictions if applicable
  if (options.regionRestrictions && options.regionRestrictions.length > 0) {
    schema.regionsAllowed = options.regionRestrictions;
  }

  // Add video clips/chapters if available
  if (options.hasPart && options.hasPart.length > 0) {
    schema.hasPart = options.hasPart.map((clip) => ({
      '@type': 'Clip',
      name: clip.name,
      startOffset: clip.startOffset,
      endOffset: clip.endOffset,
      ...(clip.url && { url: clip.url }),
    }));
  }

  return schema;
}

/**
 * Generate YouTube video schema from URL
 */
export function generateYouTubeVideoSchema(
  youtubeUrl: string,
  title: string,
  description: string,
  uploadDate: string,
  thumbnailUrl?: string
): Record<string, unknown> {
  // Extract video ID from YouTube URL
  const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';

  return generateVideoSchema({
    name: title,
    description: description,
    thumbnailUrl: thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    uploadDate: uploadDate,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    contentUrl: youtubeUrl,
  });
}

/**
 * Generate VideoGallery schema for multiple videos
 */
export function generateVideoGallerySchema(
  videos: VideoInput[],
  galleryName: string,
  galleryDescription: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: galleryName,
    description: galleryDescription,
    numberOfItems: videos.length,
    itemListElement: videos.map((video, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateVideoSchema(video, { includePublisher: false }),
    })),
  };
}

/**
 * Generate HowTo video schema
 * For instructional/tutorial content
 */
export function generateHowToVideoSchema(
  video: VideoInput,
  steps: Array<{ name: string; text: string; startOffset: number }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: video.name,
    description: video.description,
    video: generateVideoSchema(video, { includePublisher: true }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: video.embedUrl ? `${video.embedUrl}?t=${step.startOffset}` : undefined,
    })),
  };
}

export default {
  generateVideoSchema,
  generateYouTubeVideoSchema,
  generateVideoGallerySchema,
  generateHowToVideoSchema,
};
