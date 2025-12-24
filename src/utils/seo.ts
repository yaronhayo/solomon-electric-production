// SEO utility functions
import { SITE_CONFIG } from "../config/site";

/**
 * Generate JSON-LD structured data for a blog post (Article)
 */
export function generateArticleSchema(post: any, siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.data.title,
        description: post.data.description,
        image: post.data.image ? `${siteUrl}${typeof post.data.image === 'string' ? post.data.image : post.data.image.src}` : undefined,
        datePublished: post.data.pubDate.toISOString(),
        dateModified: (post.data.updatedDate || post.data.pubDate).toISOString(),
        author: {
            '@type': 'Organization',
            name: post.data.author || 'Solomon Electric',
            url: siteUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Solomon Electric',
            url: siteUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${post.slug}`,
        },
    };
}

/**
 * Generate JSON-LD structured data for services list
 */
export function generateServicesSchema(services: any[], siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Service',
                name: service.name,
                description: service.description,
                provider: {
                    '@type': 'Organization',
                    name: 'Solomon Electric',
                    url: siteUrl,
                },
            },
        })),
    };
}

/**
 * Generate JSON-LD structured data for FAQPage
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
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

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema(siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Electrician',
        '@id': `${siteUrl}/#organization`,
        name: 'Solomon Electric',
        image: `${siteUrl}/og-default.jpg`,
        description: "Miami's Premier 24/7 Electrical Services - Licensed, Insured, and Ready to Power Your World. Serving Miami-Dade and Broward counties since 2008.",
        url: siteUrl,
        telephone: SITE_CONFIG.contact.phone.formatted,
        email: SITE_CONFIG.contact.email.primary,
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: SITE_CONFIG.contact.address.street,
            addressLocality: SITE_CONFIG.contact.address.city,
            addressRegion: SITE_CONFIG.contact.address.state,
            postalCode: SITE_CONFIG.contact.address.zip,
            addressCountry: 'US',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: SITE_CONFIG.seo.schema.latitude,
            longitude: SITE_CONFIG.seo.schema.longitude,
        },
        areaServed: [
            // Tri-County Coverage
            {
                "@type": "State",
                "name": "Florida"
            },
            // Miami-Dade County Cities
            {
                "@type": "City",
                "name": "Miami",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Miami-Dade County, FL" }
            },
            {
                "@type": "City",
                "name": "Miami Beach",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Miami-Dade County, FL" }
            },
            {
                "@type": "City",
                "name": "Hialeah",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Miami-Dade County, FL" }
            },
            {
                "@type": "City",
                "name": "Miami Gardens",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Miami-Dade County, FL" }
            },
            {
                "@type": "City",
                "name": "North Miami",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Miami-Dade County, FL" }
            },
            {
                "@type": "City",
                "name": "Homestead",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Miami-Dade County, FL" }
            },
            // Broward County Cities
            {
                "@type": "City",
                "name": "Fort Lauderdale",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Hollywood",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Pembroke Pines",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Miramar",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Coral Springs",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Pompano Beach",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Davie",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Plantation",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Sunrise",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Weston",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Deerfield Beach",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Coconut Creek",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Tamarac",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Margate",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            {
                "@type": "City",
                "name": "Lauderhill",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Broward County, FL" }
            },
            // Palm Beach County Cities
            {
                "@type": "City",
                "name": "West Palm Beach",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Palm Beach County, FL" }
            },
            {
                "@type": "City",
                "name": "Boca Raton",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Palm Beach County, FL" }
            },
            {
                "@type": "City",
                "name": "Boynton Beach",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Palm Beach County, FL" }
            },
            {
                "@type": "City",
                "name": "Delray Beach",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Palm Beach County, FL" }
            },
            {
                "@type": "City",
                "name": "Jupiter",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Palm Beach County, FL" }
            },
            {
                "@type": "City",
                "name": "Wellington",
                "containedInPlace": { "@type": "AdministrativeArea", "name": "Palm Beach County, FL" }
            }
        ],
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '00:00',
                closes: '23:59',
            }
        ],
        sameAs: SITE_CONFIG.seo.schema.socialProfiles,
        aggregateRating: {
            "@type": "AggregateRating",
            "ratingValue": SITE_CONFIG.stats.averageRating,
            "reviewCount": parseInt(SITE_CONFIG.stats.totalReviews.replace(/[^0-9]/g, '')) || 1200,
            "bestRating": "5",
            "worstRating": "1"
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            "name": "Electrical Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Electrical Panel Upgrades"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "24/7 Emergency Repairs"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "EV Charger Installation"
                    }
                }
            ]
        },
        // Credentials for authority signals
        hasCredential: [
            {
                "@type": "EducationalOccupationalCredential",
                "credentialCategory": "license",
                "name": "Florida Electrical Contractor License",
                "recognizedBy": {
                    "@type": "Organization",
                    "name": "Florida Department of Business and Professional Regulation"
                }
            },
            {
                "@type": "EducationalOccupationalCredential",
                "credentialCategory": "certification",
                "name": "Insured & Bonded Electrical Contractor"
            }
        ],
        knowsAbout: [
            "Residential Electrical Services",
            "Commercial Electrical Services",
            "Industrial Electrical Services",
            "Emergency Electrical Repairs",
            "Smart Home Automation",
            "Lighting Design & Installation",
            "Electrical Safety Inspections",
            "EV Charging Station Installation",
            "Electrical Panel Upgrades",
            "Generator Installation",
            "Surge Protection",
            "Ceiling Fan Installation",
            "Outlet & Switch Installation",
            "Circuit Breaker Replacement",
            "Whole House Rewiring"
        ],
        // Additional authority signals
        foundingDate: SITE_CONFIG.company.foundedYear.toString(),
        slogan: SITE_CONFIG.company.tagline,
        award: [
            {
                "@type": "Award",
                "name": "Top Rated Electrician - South Florida"
            }
        ]
    };
}

/**
 * Generate JSON-LD structured data for Speakable (Voice AI)
 */
export function generateSpeakableSchema(url: string, selectors: string[] = ['.section-title', '.section-description', '.seo-body']) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': url,
        'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': selectors
        }
    };
}

/**
 * Generate OpenGraph meta tags
 */
export function generateOGTags(
    title: string,
    description: string,
    url: string,
    image?: string,
    type: 'website' | 'article' = 'website'
) {
    return {
        'og:title': title,
        'og:description': description,
        'og:url': url,
        'og:type': type,
        'og:image': image || `${url}/og-default.jpg`,
        'og:site_name': 'Solomon Electric',
    };
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterTags(
    title: string,
    description: string,
    image?: string
) {
    return {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': image || '/og-default.jpg',
    };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, siteUrl: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${siteUrl}${cleanPath}`;
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(
    items: { name: string; url: string }[],
    siteUrl: string
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.url}`,
        })),
    };
}
