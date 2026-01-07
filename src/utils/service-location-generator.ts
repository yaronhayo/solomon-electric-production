/**
 * Service-Location Content Generator
 * Utilities for generating localized service content at scale
 */

import { SITE_CONFIG } from '../config/site';

// City-specific content templates
export const CITY_CONTENT_TEMPLATES = {
    // Intro paragraph templates - rotated for variety
    introTemplates: [
        "Looking for professional {serviceName} in {cityName}? Solomon Electric provides licensed, insured electrical services to {cityName} residents and businesses. With {yearsExperience}+ years serving {county} County, we understand the unique electrical challenges facing {cityName} properties.",
        "Solomon Electric is {cityName}'s trusted choice for {serviceName}. Our licensed electricians serve homes and businesses throughout {cityName}'s neighborhoods, from {neighborhood1} to {neighborhood2}. Available 24/7 for your electrical needs.",
        "Need {serviceName} in {cityName}, FL? Solomon Electric delivers expert electrical solutions backed by our satisfaction guarantee. We're proud to serve the {cityName} community with professional, code-compliant electrical work.",
    ],
    
    // Why choose us for this city
    whyChooseTemplates: [
        "As a locally-owned electrical contractor, we know {cityName}. From the building codes in {county} County to the specific electrical challenges caused by {challenge}, we have the expertise to handle your {serviceName} project right the first time.",
        "Solomon Electric has completed hundreds of electrical projects in {cityName}. Our familiarity with local permit requirements, FPL coordination, and {cityName}'s unique property types means faster, smoother project completion.",
        "{cityName} homeowners trust Solomon Electric because we're not just electricians—we're your neighbors. We take pride in every {cityName} project, treating your home with the care and respect it deserves.",
    ],
    
    // Call to action templates
    ctaTemplates: [
        "Ready for professional {serviceName} in {cityName}? Call (786) 833-9211 or book online for a free estimate.",
        "Get expert {serviceName} services in {cityName} today. Our licensed electricians are standing by.",
        "Schedule your {serviceName} consultation in {cityName}. Fast response, fair pricing, guaranteed satisfaction.",
    ],
};

// City-specific challenges that apply to multiple services
export const CITY_CHALLENGES: Record<string, string[]> = {
    "miami": ["coastal corrosion", "high-rise electrical systems", "hurricane preparedness"],
    "miami-beach": ["salt air exposure", "condo electrical requirements", "flood zone considerations"],
    "fort-lauderdale": ["marine environment", "older home rewiring needs", "storm surge protection"],
    "hollywood": ["mixed residential/commercial zones", "coastal humidity", "aging infrastructure"],
    "pembroke-pines": ["newer construction demands", "HOA requirements", "growing EV adoption"],
    "coral-springs": ["suburban electrical loads", "pool equipment demands", "smart home integration"],
    "boca-raton": ["luxury home requirements", "high-end lighting systems", "extensive outdoor living"],
    "weston": ["modern home automation", "hurricane-rated installations", "energy efficiency focus"],
    "hialeah": ["older building stock", "commercial electrical needs", "bilingual service requirements"],
    "miramar": ["rapid development growth", "mixed-use properties", "modern code requirements"],
    "homestead": ["agricultural properties", "longer service distances", "well pump systems"],
    "north-miami": ["aging condos", "commercial corridors", "flood considerations"],
    "miami-gardens": ["residential growth", "commercial development", "modernization needs"],
    "plantation": ["established neighborhoods", "pool/spa electrical", "panel upgrade demand"],
    "davie": ["equestrian properties", "rural electrical needs", "large lot installations"],
    "sunrise": ["commercial centers", "established residential", "renovation projects"],
    "pompano-beach": ["coastal properties", "marine electrical", "storm damage repairs"],
    "deerfield-beach": ["retirement communities", "accessibility needs", "safety upgrades"],
    "coconut-creek": ["planned communities", "HOA coordination", "modern amenities"],
    "margate": ["affordable housing", "efficiency upgrades", "basic electrical services"],
    "tamarac": ["senior communities", "safety inspections", "outlet accessibility"],
    "lauderhill": ["diverse housing stock", "commercial electrical", "code compliance"],
    "boynton-beach": ["coastal exposure", "retirement communities", "hurricane prep"],
    "delray-beach": ["downtown development", "historic properties", "upscale residential"],
    "west-palm-beach": ["urban development", "high-rise condos", "commercial growth"],
    "jupiter": ["waterfront properties", "luxury homes", "marine electrical"],
    "wellington": ["equestrian estates", "large properties", "high-capacity panels"],
};

// Service category keywords for SEO
export const SERVICE_KEYWORDS: Record<string, string[]> = {
    "electrical-panel-upgrade-100a-to-200a": ["panel upgrade", "200 amp service", "electrical panel replacement", "breaker panel upgrade"],
    "level-2-ev-charger-installation": ["EV charger installation", "Tesla charger", "electric vehicle charging", "home EV charger"],
    "24-7-emergency-electrical-service": ["emergency electrician", "24 hour electrician", "electrical emergency", "urgent electrical repair"],
    "whole-home-surge-protection": ["surge protector", "whole house surge protection", "lightning protection", "power surge"],
    "recessed-lighting-installation": ["recessed lighting", "can lights", "LED recessed lights", "pot lights"],
    "home-standby-generator-installation": ["generator installation", "standby generator", "whole house generator", "backup power"],
    "gfci-outlet-installation-repair": ["GFCI outlet", "ground fault outlet", "bathroom outlet", "kitchen outlet"],
    "electrical-safety-inspection": ["electrical inspection", "home electrical safety", "electrical safety check", "panel inspection"],
    "ceiling-fan-light-fixture-installation": ["ceiling fan installation", "light fixture", "fan installation", "chandelier installation"],
    "smart-thermostat-installation": ["smart thermostat", "Nest installation", "programmable thermostat", "WiFi thermostat"],
};

/**
 * Generate localized intro paragraph
 */
export function generateIntro(
    serviceName: string,
    cityName: string,
    county: string,
    neighborhoods: string[]
): string {
    const templateIndex = Math.abs(hashString(serviceName + cityName)) % CITY_CONTENT_TEMPLATES.introTemplates.length;
    let template = CITY_CONTENT_TEMPLATES.introTemplates[templateIndex];
    
    return template
        .replace(/{serviceName}/g, serviceName)
        .replace(/{cityName}/g, cityName)
        .replace(/{county}/g, county)
        .replace(/{yearsExperience}/g, SITE_CONFIG.credentials.yearsExperience)
        .replace(/{neighborhood1}/g, neighborhoods[0] || cityName)
        .replace(/{neighborhood2}/g, neighborhoods[1] || "surrounding areas");
}

/**
 * Generate why choose us section
 */
export function generateWhyChoose(
    serviceName: string,
    cityName: string,
    citySlug: string,
    county: string
): string {
    const challenges = CITY_CHALLENGES[citySlug] || ["local conditions", "climate factors", "property requirements"];
    const templateIndex = Math.abs(hashString(cityName + serviceName)) % CITY_CONTENT_TEMPLATES.whyChooseTemplates.length;
    let template = CITY_CONTENT_TEMPLATES.whyChooseTemplates[templateIndex];
    
    return template
        .replace(/{serviceName}/g, serviceName)
        .replace(/{cityName}/g, cityName)
        .replace(/{county}/g, county)
        .replace(/{challenge}/g, challenges[0]);
}

/**
 * Generate meta title for service+location page
 */
export function generateMetaTitle(serviceName: string, cityName: string): string {
    // Keep under 60 characters
    const shortServiceName = serviceName.length > 35 
        ? serviceName.split(' ').slice(0, 3).join(' ')
        : serviceName;
    
    return `${shortServiceName} in ${cityName}, FL | Solomon Electric`;
}

/**
 * Generate meta description for service+location page
 */
export function generateMetaDescription(
    serviceName: string,
    cityName: string,
    neighborhoods: string[]
): string {
    const neighborhoodText = neighborhoods.slice(0, 2).join(', ');
    return `Professional ${serviceName.toLowerCase()} in ${cityName}, FL. Licensed electrician serving ${neighborhoodText}. 24/7 service, free estimates. Call (786) 833-9211.`;
}

/**
 * Generate H1 for service+location page
 */
export function generateH1(serviceName: string, cityName: string): string {
    return `${serviceName} in ${cityName}, FL`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(serviceSlug: string, citySlug: string): string {
    return `${SITE_CONFIG.seo.siteUrl}/services/${serviceSlug}/${citySlug}`;
}

/**
 * Get related cities (same county or adjacent)
 */
export function getRelatedCities(
    currentCitySlug: string,
    allCities: Array<{ slug: string; name: string; county: string }>,
    limit: number = 4
): Array<{ slug: string; name: string; county: string }> {
    const currentCity = allCities.find(c => c.slug === currentCitySlug);
    if (!currentCity) return allCities.slice(0, limit);
    
    // Prioritize same county
    const sameCounty = allCities.filter(c => 
        c.county === currentCity.county && c.slug !== currentCitySlug
    );
    
    const otherCounty = allCities.filter(c => 
        c.county !== currentCity.county
    );
    
    return [...sameCounty, ...otherCounty]
        .filter(c => c.slug !== currentCitySlug)
        .slice(0, limit);
}

/**
 * Simple string hash for deterministic template selection
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Get keywords for a service
 */
export function getServiceKeywords(serviceSlug: string): string[] {
    return SERVICE_KEYWORDS[serviceSlug] || [];
}

/**
 * Generate structured data for service+location page
 */
export function generateServiceLocationSchema(
    service: {
        name: string;
        slug: string;
        description: string;
        category: string;
    },
    city: {
        name: string;
        slug: string;
        county: string;
        coordinates?: { lat: number; lng: number };
    }
) {
    const siteUrl = SITE_CONFIG.seo.siteUrl;
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "@id": `${siteUrl}/services/${service.slug}/${city.slug}/#service`,
                "name": `${service.name} in ${city.name}, FL`,
                "description": service.description,
                "provider": {
                    "@id": `${siteUrl}/#organization`
                },
                "areaServed": {
                    "@type": "City",
                    "name": city.name,
                    "containedInPlace": {
                        "@type": "State",
                        "name": "Florida",
                        "alternateName": "FL"
                    }
                },
                "serviceType": service.category,
                "availableChannel": {
                    "@type": "ServiceChannel",
                    "serviceUrl": `${siteUrl}/services/${service.slug}/${city.slug}`,
                    "servicePhone": SITE_CONFIG.contact.phone.formatted,
                    "availableLanguage": ["English", "Spanish"]
                }
            },
            {
                "@type": "LocalBusiness",
                "@id": `${siteUrl}/services/${service.slug}/${city.slug}/#localbusiness`,
                "name": `Solomon Electric - ${city.name}`,
                "description": `Professional ${service.name.toLowerCase()} services in ${city.name}, FL`,
                "telephone": SITE_CONFIG.contact.phone.formatted,
                "email": SITE_CONFIG.contact.email.primary,
                "url": `${siteUrl}/services/${service.slug}/${city.slug}`,
                "priceRange": "$$",
                ...(city.coordinates && {
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": city.coordinates.lat,
                        "longitude": city.coordinates.lng
                    }
                }),
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": city.name,
                    "addressRegion": "FL",
                    "addressCountry": "US"
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens": "00:00",
                    "closes": "23:59"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": SITE_CONFIG.stats.averageRating,
                    "reviewCount": parseInt(SITE_CONFIG.stats.totalReviews.replace(/[^0-9]/g, '')) || 1000,
                    "bestRating": 5,
                    "worstRating": 1
                },
                "parentOrganization": {
                    "@id": `${siteUrl}/#organization`
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Services",
                        "item": `${siteUrl}/services`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": service.name,
                        "item": `${siteUrl}/services/${service.slug}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": city.name,
                        "item": `${siteUrl}/services/${service.slug}/${city.slug}`
                    }
                ]
            }
        ]
    };
}
