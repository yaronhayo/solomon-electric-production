/**
 * Enhanced Schema.org Generator for Local SEO
 * Generates rich structured data for maximum local authority
 * 
 * Schemas included:
 * - LocalBusiness (ElectricalContractor)
 * - Service
 * - FAQPage
 * - BreadcrumbList
 * - Review/AggregateRating
 * - GeoCoordinates
 * - OfferCatalog
 */

import { SITE_CONFIG } from '../config/site';
import type { WithContext, LocalBusiness, Service, FAQPage, BreadcrumbList, Review, AggregateRating } from 'schema-dts';

// ============================================
// Configuration
// ============================================

const BUSINESS_NAME = SITE_CONFIG.company.name;
const SITE_URL = SITE_CONFIG.seo.siteUrl;

// ============================================
// LocalBusiness Schema (Electrician/Contractor)
// ============================================

export function generateLocalBusinessSchema(): WithContext<LocalBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ElectricalContractor' as any,
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    alternateName: 'Solomon Electric',
    description: SITE_CONFIG.seo.defaultDescription,
    url: SITE_URL,
    telephone: SITE_CONFIG.contact.phone.formatted,
    email: SITE_CONFIG.contact.email.primary,
    
    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.contact.address.street,
      addressLocality: SITE_CONFIG.contact.address.city,
      addressRegion: SITE_CONFIG.contact.address.state,
      postalCode: SITE_CONFIG.contact.address.zip,
      addressCountry: 'US'
    },
    
    // Geo coordinates
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.seo.schema.latitude,
      longitude: SITE_CONFIG.seo.schema.longitude
    },
    
    // Business details
    priceRange: SITE_CONFIG.seo.schema.priceRange,
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Check',
    
    // Opening hours (24/7)
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      }
    ],
    
    // Areas served
    areaServed: SITE_CONFIG.seo.schema.areaServed.map(city => ({
      '@type': 'City',
      name: city,
      '@id': `${SITE_URL}/service-areas/${city.toLowerCase().replace(/\s+/g, '-')}/`
    })),
    
    // Social profiles
    sameAs: SITE_CONFIG.seo.schema.socialProfiles,
    
    // Business identifiers
    legalName: BUSINESS_NAME,
    foundingDate: String(SITE_CONFIG.company.foundedYear),
    
    // Images
    image: `${SITE_URL}/logo.png`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: '512',
      height: '512'
    },
    
    // Aggregate rating
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(SITE_CONFIG.stats.averageRating),
      reviewCount: SITE_CONFIG.stats.totalReviews.replace(/\+/g, '') as any,
      bestRating: '5',
      worstRating: '1'
    } as any,
    
    // Contact points
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.contact.phone.formatted,
        contactType: 'customer service',
        availableLanguage: ['English', 'Spanish'],
        areaServed: 'US',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59'
        }
      },
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.contact.phone.formatted,
        contactType: 'emergency',
        availableLanguage: ['English', 'Spanish'],
        areaServed: 'US'
      }
    ],
    
    // Known for / has credential
    knowsAbout: [
      'Electrical Panel Upgrades',
      'EV Charger Installation',
      'Emergency Electrical Services',
      'Residential Electrical Work',
      'Commercial Electrical Work',
      'Electrical Safety Inspections',
      'Generator Installation',
      'Smart Home Wiring'
    ],
    
    // Has official credential
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'State Electrical License',
      recognizedBy: {
        '@type': 'State' as any,
        name: 'Florida'
      }
    } as any
  };
}

// ============================================
// Service Schema
// ============================================

export interface ServiceSchemaInput {
  name: string;
  slug: string;
  description: string;
  image?: string;
  category?: string;
  areaServed?: string[];
  faqs?: { question: string; answer: string }[];
}

export function generateServiceSchema(service: ServiceSchemaInput): WithContext<Service> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services/${service.slug}/#service`,
    name: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}/`,
    
    provider: {
      '@id': `${SITE_URL}/#organization`
    },
    
    serviceType: service.name,
    category: service.category || 'Electrical Services',
    
    areaServed: (service.areaServed || SITE_CONFIG.seo.schema.areaServed).map(city => ({
      '@type': 'City',
      name: city
    })),
    
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_URL}/services/${service.slug}/`,
      servicePhone: SITE_CONFIG.contact.phone.formatted as any,
      availableLanguage: ['English', 'Spanish']
    } as any,
    
    termsOfService: `${SITE_URL}/terms/`,
    
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD'
      },
      availability: 'https://schema.org/InStock',
      availableAtOrFrom: {
        '@id': `${SITE_URL}/#organization`
      }
    },
    
    ...(service.image && {
      image: service.image.startsWith('http') 
        ? service.image 
        : `${SITE_URL}${service.image}`
    })
  };
}

// ============================================
// FAQ Schema
// ============================================

export function generateFAQSchema(faqs: { question: string; answer: string }[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// ============================================
// BreadcrumbList Schema
// ============================================

export interface BreadcrumbInput {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbInput[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// ============================================
// Review/AggregateRating Schema
// ============================================

export interface ReviewInput {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export function generateReviewSchema(reviews: ReviewInput[]): object {
  const ratings = reviews.map(r => r.rating);
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: String(reviews.length),
      bestRating: '5',
      worstRating: '1'
    },
    review: reviews.slice(0, 10).map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(review.rating),
        bestRating: '5',
        worstRating: '1'
      },
      reviewBody: review.text,
      datePublished: review.date
    }))
  };
}

// ============================================
// Service Area Schema (GeoCircle)
// ============================================

export interface ServiceAreaInput {
  name: string;
  slug: string;
  county: string;
  coordinates: { lat: number; lng: number };
  description: string;
}

export function generateServiceAreaSchema(area: ServiceAreaInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    description: area.description,
    url: `${SITE_URL}/service-areas/${area.slug}/`,
    
    areaServed: {
      '@type': 'City',
      name: area.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: `${area.county} County, Florida`
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: area.coordinates.lat,
        longitude: area.coordinates.lng
      }
    },
    
    geo: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: area.coordinates.lat,
        longitude: area.coordinates.lng
      },
      geoRadius: '25 miles'
    }
  };
}

// ============================================
// Combined Page Schema
// ============================================

export interface PageSchemaConfig {
  type: 'home' | 'service' | 'service-area' | 'blog' | 'contact' | 'about' | 'reviews';
  service?: ServiceSchemaInput;
  serviceArea?: ServiceAreaInput;
  faqs?: { question: string; answer: string }[];
  breadcrumbs?: BreadcrumbInput[];
  reviews?: ReviewInput[];
}

export function generatePageSchema(config: PageSchemaConfig): object[] {
  const schemas: object[] = [];
  
  // Always include organization
  schemas.push(generateLocalBusinessSchema());
  
  // Add breadcrumbs if provided
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(config.breadcrumbs));
  }
  
  // Add type-specific schemas
  switch (config.type) {
    case 'service':
      if (config.service) {
        schemas.push(generateServiceSchema(config.service));
      }
      break;
    case 'service-area':
      if (config.serviceArea) {
        schemas.push(generateServiceAreaSchema(config.serviceArea));
      }
      break;
    case 'reviews':
      if (config.reviews) {
        schemas.push(generateReviewSchema(config.reviews));
      }
      break;
  }
  
  // Add FAQs if provided
  if (config.faqs && config.faqs.length > 0) {
    schemas.push(generateFAQSchema(config.faqs));
  }
  
  return schemas;
}

// ============================================
// Utility: Convert schemas to script tag
// ============================================

export function schemasToScriptTag(schemas: object[]): string {
  if (schemas.length === 1) {
    return `<script type="application/ld+json">${JSON.stringify(schemas[0])}</script>`;
  }
  
  // Multiple schemas in a graph
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas.map(s => {
      // Remove @context from individual schemas when in graph
      const { '@context': _, ...rest } = s as { '@context'?: string };
      return rest;
    })
  })}</script>`;
}

export default {
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateReviewSchema,
  generateServiceAreaSchema,
  generatePageSchema,
  schemasToScriptTag
};
