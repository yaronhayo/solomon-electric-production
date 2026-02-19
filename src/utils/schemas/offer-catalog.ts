/**
 * OfferCatalog Schema Generator
 * Generates structured data for service pricing display in search results
 * 
 * Benefits:
 * - Shows price ranges in Google SERPs
 * - Increases CTR with pricing transparency
 * - Enables rich snippets for service listings
 */

import { SITE_CONFIG } from '../../config/site';

const SITE_URL = SITE_CONFIG.seo.siteUrl;

// ============================================
// Types
// ============================================

export interface ServiceOffer {
  name: string;
  slug: string;
  description: string;
  category: string;
  priceRange?: string;
  priceCurrency?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: 'InStock' | 'PreOrder' | 'OutOfStock';
}

export interface OfferCatalogOptions {
  includeProvider?: boolean;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

// ============================================
// Schema Generators
// ============================================

/**
 * Generate Offer schema for a single service
 */
export function generateOfferSchema(service: ServiceOffer) {
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    '@id': `${SITE_URL}/services/${service.slug}/#offer`,
    name: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}/`,
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: service.priceCurrency || 'USD',
      ...(service.minPrice && { minPrice: service.minPrice }),
      ...(service.maxPrice && { maxPrice: service.maxPrice }),
    },
    seller: {
      '@type': 'Electrician',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_CONFIG.company.name,
    },
    areaServed: {
      '@type': 'State',
      name: 'Florida',
    },
    itemOffered: {
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@id': `${SITE_URL}/#organization`,
      },
      serviceType: service.category,
    },
  };

  // Add price range if min/max not specified
  if (service.priceRange && !service.minPrice) {
    offer.priceRange = service.priceRange;
  }

  return offer;
}

/**
 * Generate OfferCatalog schema for all services
 * Use on /services page for comprehensive service listing
 */
export function generateOfferCatalogSchema(
  services: ServiceOffer[],
  options: OfferCatalogOptions = {}
) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/services/#offercatalog`,
    name: `${SITE_CONFIG.company.name} Electrical Services`,
    description: 'Complete catalog of professional electrical services for residential and commercial properties in South Florida.',
    url: `${SITE_URL}/services/`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateOfferSchema(service),
    })),
  };

  // Add aggregate rating if reviews are available
  if (options.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: options.aggregateRating.ratingValue,
      reviewCount: options.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add provider reference
  if (options.includeProvider !== false) {
    schema.offeredBy = {
      '@type': 'Electrician',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_CONFIG.company.name,
      telephone: SITE_CONFIG.contact.phone.formatted,
      url: SITE_URL,
    };
  }

  return schema;
}

/**
 * Generate category-specific offer catalog
 * Use for category landing pages
 */
export function generateCategoryOfferCatalogSchema(
  categoryName: string,
  categorySlug: string,
  services: ServiceOffer[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/services/#${categorySlug}-catalog`,
    name: `${categoryName} Services`,
    description: `Professional ${categoryName.toLowerCase()} services by licensed electricians in South Florida.`,
    url: `${SITE_URL}/services/`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateOfferSchema(service),
    })),
    offeredBy: {
      '@type': 'Electrician',
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

/**
 * Generate price comparison schema for a specific service
 * Useful for high-competition keywords
 */
export function generateServicePricingSchema(
  service: ServiceOffer,
  priceDetails: {
    basePrice: number;
    laborCost?: number;
    materialsCost?: number;
    estimatedDuration?: string;
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services/${service.slug}/#service`,
    name: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}/`,
    provider: {
      '@type': 'Electrician',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_CONFIG.company.name,
    },
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'CompoundPriceSpecification',
        priceComponent: [
          {
            '@type': 'UnitPriceSpecification',
            name: 'Service Fee',
            price: priceDetails.basePrice,
            priceCurrency: 'USD',
          },
          ...(priceDetails.laborCost ? [{
            '@type': 'UnitPriceSpecification',
            name: 'Labor',
            price: priceDetails.laborCost,
            priceCurrency: 'USD',
          }] : []),
          ...(priceDetails.materialsCost ? [{
            '@type': 'UnitPriceSpecification',
            name: 'Materials',
            price: priceDetails.materialsCost,
            priceCurrency: 'USD',
          }] : []),
        ],
      },
      availability: 'https://schema.org/InStock',
      areaServed: [
        { '@type': 'State', name: 'Florida' },
      ],
    },
    ...(priceDetails.estimatedDuration && {
      estimatedDuration: priceDetails.estimatedDuration,
    }),
    termsOfService: `${SITE_URL}/terms/`,
    hasOfferCatalog: {
      '@id': `${SITE_URL}/services/#offercatalog`,
    },
  };
}

export default {
  generateOfferSchema,
  generateOfferCatalogSchema,
  generateCategoryOfferCatalogSchema,
  generateServicePricingSchema,
};
