// SEO utility functions

/**
 * Generate JSON-LD structured data for a blog post (Article)
 */
export function generateArticleSchema(post: any, siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.data.title,
        description: post.data.description,
        image: post.data.image ? `${siteUrl}${post.data.image}` : undefined,
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
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema(siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': siteUrl,
        name: 'Solomon Electric',
        description: "Miami's Premier 24/7 Electrical Services - Licensed, Insured, and Ready to Power Your World",
        url: siteUrl,
        telephone: '786-833-9211',
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Miami',
            addressRegion: 'FL',
            addressCountry: 'US',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 25.7617,
            longitude: -80.1918,
        },
        areaServed: [
            'Miami',
            'Miami Beach',
            'Fort Lauderdale',
            'Boca Raton',
            'West Palm Beach',
        ],
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
        },
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
