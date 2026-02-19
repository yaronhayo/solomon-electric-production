/**
 * Event Schema Generator
 * Generates structured data for promotional events and seasonal campaigns
 * 
 * Use Cases:
 * - Hurricane preparedness specials
 * - Holiday promotions
 * - Seasonal maintenance campaigns
 * - Limited-time offers
 */

import { SITE_CONFIG } from '../../config/site';

const SITE_URL = SITE_CONFIG.seo.siteUrl;

// ============================================
// Types
// ============================================

export interface EventInput {
  name: string;
  description: string;
  startDate: string;  // ISO 8601 format
  endDate: string;    // ISO 8601 format
  eventType?: 'Sale' | 'Promotion' | 'Seasonal' | 'Emergency';
  location?: 'Online' | 'Local' | 'Both';
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    maxDiscount?: number;
  };
  eligibleServices?: string[];
  eligibleAreas?: string[];
  image?: string;
}

export interface SeasonalPromotion {
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'hurricane';
  year: number;
  services: string[];
  specialOffer?: string;
}

// ============================================
// Schema Generators
// ============================================

/**
 * Generate Event schema for promotional events
 */
export function generateEventSchema(event: EventInput): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.location === 'Online' 
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Electrician',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_CONFIG.company.name,
      url: SITE_URL,
    },
  };

  // Add location based on event type
  if (event.location !== 'Online') {
    schema.location = {
      '@type': 'VirtualLocation',
      url: SITE_URL,
    };
  }

  // Add offers if there's a discount
  if (event.discount) {
    schema.offers = {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      validFrom: event.startDate,
      validThrough: event.endDate,
      priceSpecification: {
        '@type': 'PriceSpecification',
        ...(event.discount.type === 'percentage' && {
          discount: `${event.discount.value}%`,
        }),
        ...(event.discount.type === 'fixed' && {
          discount: event.discount.value,
          priceCurrency: 'USD',
        }),
      },
      eligibleRegion: {
        '@type': 'State',
        name: 'Florida',
      },
    };
  }

  // Add image if available
  if (event.image) {
    schema.image = event.image.startsWith('http') 
      ? event.image 
      : `${SITE_URL}${event.image}`;
  }

  return schema;
}

/**
 * Generate Sale event schema for time-limited promotions
 */
export function generateSaleEventSchema(
  saleName: string,
  description: string,
  startDate: string,
  endDate: string,
  _discountPercentage: number,
  services: string[] = []
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SaleEvent',
    name: saleName,
    description: description,
    startDate: startDate,
    endDate: endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: {
      '@type': 'Electrician',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_CONFIG.company.name,
    },
    offers: {
      '@type': 'AggregateOffer',
      highPrice: 'Variable',
      lowPrice: 'Variable',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: startDate,
      validThrough: endDate,
    },
    about: services.length > 0 ? services.map(service => ({
      '@type': 'Service',
      name: service,
    })) : undefined,
  };
}

/**
 * Generate Hurricane Season special event
 */
export function generateHurricaneSeasonSchema(year: number): Record<string, unknown> {
  return generateEventSchema({
    name: `${year} Hurricane Season Electrical Preparedness`,
    description: `Protect your home during ${year} hurricane season. Generator installation, surge protection, and emergency electrical inspections available. Free safety assessment for South Florida homeowners.`,
    startDate: `${year}-06-01T00:00:00-04:00`,
    endDate: `${year}-11-30T23:59:59-05:00`,
    eventType: 'Seasonal',
    location: 'Local',
    eligibleServices: [
      'Generator Installation',
      'Surge Protection',
      'Electrical Safety Inspection',
      'Panel Upgrade',
    ],
    eligibleAreas: ['Miami-Dade County', 'Broward County'],
  });
}

/**
 * Generate seasonal maintenance promotion
 */
export function generateSeasonalPromoSchema(promo: SeasonalPromotion): Record<string, unknown> {
  const seasonDates: Record<string, { start: string; end: string }> = {
    spring: { start: `${promo.year}-03-01`, end: `${promo.year}-05-31` },
    summer: { start: `${promo.year}-06-01`, end: `${promo.year}-08-31` },
    fall: { start: `${promo.year}-09-01`, end: `${promo.year}-11-30` },
    winter: { start: `${promo.year}-12-01`, end: `${promo.year + 1}-02-28` },
    hurricane: { start: `${promo.year}-06-01`, end: `${promo.year}-11-30` },
  };

  const dates = seasonDates[promo.season];
  const seasonName = promo.season.charAt(0).toUpperCase() + promo.season.slice(1);

  return generateEventSchema({
    name: `${seasonName} ${promo.year} Electrical Maintenance Special`,
    description: `${seasonName} electrical maintenance packages. ${promo.specialOffer || 'Free safety inspection with any service'}. Available for ${promo.services.join(', ')}.`,
    startDate: dates.start,
    endDate: dates.end,
    eventType: 'Promotion',
    location: 'Local',
    eligibleServices: promo.services,
  });
}

/**
 * Generate special offer announcement
 */
export function generateSpecialOfferSchema(
  offerName: string,
  description: string,
  validDays: number,
  _discountValue: string
): Record<string, unknown> {
  const startDate = new Date().toISOString();
  const endDate = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    name: offerName,
    text: description,
    datePosted: startDate,
    expires: endDate,
    category: 'https://www.wikidata.org/wiki/Q112098903', // Special offer category
    announcementLocation: {
      '@type': 'State',
      name: 'Florida',
    },
  };
}

export default {
  generateEventSchema,
  generateSaleEventSchema,
  generateHurricaneSeasonSchema,
  generateSeasonalPromoSchema,
  generateSpecialOfferSchema,
};
