// SEO utility functions
import { SITE_CONFIG } from "../config/site";

/**
 * Generate JSON-LD structured data for a blog post (Article)
 * Enhanced with E-E-A-T signals for author expertise and credentials
 */
export function generateArticleSchema(post: any, siteUrl: string) {
    const canonical = `${siteUrl}/blog/${post.slug}/`;
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: post.data.title,
        description: post.data.description,
        image: post.data.image ? (typeof post.data.image === 'string' ? `${siteUrl}${post.data.image}` : `${siteUrl}${post.data.image.src}`) : `${siteUrl}/og-default.webp`,
        datePublished: post.data.pubDate.toISOString(),
        dateModified: (post.data.updatedDate || post.data.pubDate).toISOString(),
        author: [
            {
                '@type': 'Organization',
                '@id': `${siteUrl}/#organization`,
                name: 'Solomon Electric Team',
                url: `${siteUrl}/about`,
                description: `Licensed Florida electricians with ${SITE_CONFIG.credentials.yearsExperience} experience serving Miami-Dade and Broward counties.`,
                hasCredential: {
                    '@type': 'EducationalOccupationalCredential',
                    credentialCategory: 'license',
                    name: 'Florida Electrical Contractor License',
                    recognizedBy: {
                        '@type': 'Organization',
                        name: 'Florida Department of Business and Professional Regulation'
                    },
                    validIn: {
                        '@type': 'AdministrativeArea',
                        name: 'Florida'
                    }
                },
                knowsAbout: [
                    'Electrical Panel Upgrades',
                    'EV Charger Installation',
                    'Emergency Electrical Repair',
                    'Residential Electrical Services',
                    'Commercial Electrical Services'
                ]
            }
        ],
        publisher: {
            '@id': `${siteUrl}/#organization`
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonical,
        },
        isPartOf: {
            '@id': `${siteUrl}/#website`
        },
        about: {
            '@type': 'Thing',
            name: 'Electrical Services',
            sameAs: 'https://en.wikipedia.org/wiki/Electrician'
        }
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
/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema(siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Electrician',
        '@id': `${siteUrl}/#organization`,
        name: 'Solomon Electric',
        image: `${siteUrl}/og-default.webp`,
        description: `Miami's Premier 24/7 Electrical Services - Licensed, Insured, and Ready to Power Your World. Serving Miami-Dade and Broward counties since ${SITE_CONFIG.company.foundedYear}.`,
        url: siteUrl,
        telephone: SITE_CONFIG.contact.phone.raw,
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
        // Note: aggregateRating removed - must have review array or link to reviews page
        // See /reviews page for valid aggregateRating with individual reviews
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            "name": "Professional Electrical Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Electrical Panel Modernization",
                        "description": "Professional 100A to 200A panel upgrades for modern South Florida homes."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "24/7 Emergency Response",
                        "description": "Rapid electrical repair for sparking outlets and circuit breaker failures."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Smart Home Automation",
                        "description": "Installation of motion sensors, dimmers, and integrated smart lighting systems."
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
            "Top Rated Electrician - South Florida",
            "Best of Hollywood 2024 - Electrical Contractor",
            "Angi Super Service Award Winner"
        ],
        brand: {
            "@type": "Brand",
            "name": "Solomon Electric",
            "logo": `${siteUrl}/logo.png`
        },
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
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, siteUrl: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${siteUrl}${cleanPath}`;
}

/**
 * Generate consolidated @graph schema for Homepage
 * Includes WebSite, Electrician (Organization), and BreadcrumbList
 */
export function generateHomepageSchema(siteUrl: string) {
    const electrician = generateOrganizationSchema(siteUrl);
    
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                'url': siteUrl,
                'name': 'Solomon Electric',
                'description': electrician.description,
                'publisher': { '@id': `${siteUrl}/#organization` },
                'potentialAction': [
                    {
                        '@type': 'SearchAction',
                        'target': {
                            '@type': 'EntryPoint',
                            'urlTemplate': `${siteUrl}/search?q={search_term_string}`
                        },
                        'query-input': 'required name=search_term_string'
                    }
                ],
                'inLanguage': 'en-US'
            },
            {
                ...electrician,
                'isPartOf': { '@id': `${siteUrl}/#website` }
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${siteUrl}/#breadcrumb`,
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': siteUrl
                    }
                ]
            }
        ]
    };
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
            item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
        })),
    };
}
