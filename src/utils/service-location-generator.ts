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
        `Ready for professional {serviceName} in {cityName}? Call ${SITE_CONFIG.contact.phone.formatted} or book online for a free estimate.`,
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

// Service category keywords for SEO - Complete coverage for all 63 services
export const SERVICE_KEYWORDS: Record<string, string[]> = {
    // Electrical Panels & Power Systems
    "electrical-panel-upgrade-100a-to-200a": ["panel upgrade", "200 amp service", "electrical panel replacement", "breaker panel upgrade"],
    "panel-repair-circuit-breaker-replacement": ["circuit breaker repair", "panel repair", "breaker replacement", "electrical panel fix"],
    "service-panel-replacement": ["panel replacement", "main panel upgrade", "electrical service upgrade", "breaker box replacement"],
    "home-electrical-system-upgrade": ["home electrical upgrade", "whole house electrical", "electrical system modernization", "residential electrical upgrade"],
    "commercial-panel-installation-upgrades": ["commercial panel", "commercial electrical upgrade", "business panel installation", "industrial panel"],
    "three-phase-power-installation": ["three phase power", "3 phase electrical", "commercial power installation", "industrial electrical"],
    "high-voltage-electrical-services": ["high voltage electrician", "industrial electrical", "high power installation", "commercial high voltage"],
    
    // EV Charging
    "level-2-ev-charger-installation": ["EV charger installation", "Tesla charger", "electric vehicle charging", "home EV charger"],
    "level-3-dc-fast-charger-installation": ["DC fast charger", "level 3 charger", "commercial EV charging", "fast charging station"],
    "home-ev-charging-system-setup": ["home EV charger", "residential charging station", "electric car charger", "EV outlet installation"],
    "electric-vehicle-outlet-installation": ["EV outlet", "240v outlet for EV", "NEMA 14-50 outlet", "car charger outlet"],
    "commercial-ev-charging-infrastructure": ["commercial EV charging", "business charging station", "fleet charging", "workplace EV charger"],
    
    // Emergency Services
    "24-7-emergency-electrical-service": ["emergency electrician", "24 hour electrician", "electrical emergency", "urgent electrical repair"],
    "power-outage-emergency-response": ["power outage repair", "no power electrician", "blackout repair", "electricity restoration"],
    "storm-damage-electrical-repair": ["storm damage electrician", "hurricane electrical repair", "electrical storm damage", "weather damage electrical"],
    "electrical-burning-smell-investigation": ["burning electrical smell", "electrical fire smell", "burning plastic smell", "overheating electrical"],
    "electrical-fire-hazard-investigation": ["electrical fire hazard", "fire risk inspection", "electrical fire prevention", "fire safety electrical"],
    "sparking-outlet-circuit-breaker-repair": ["sparking outlet", "outlet sparking repair", "electrical sparks", "arcing outlet fix"],
    
    // Generators
    "home-standby-generator-installation": ["generator installation", "standby generator", "whole house generator", "backup power"],
    "portable-generator-hookup": ["portable generator hookup", "generator transfer switch", "portable generator connection", "temporary generator"],
    "automatic-transfer-switch-installation": ["transfer switch installation", "ATS installation", "generator switch", "automatic transfer"],
    "generator-maintenance-service": ["generator maintenance", "generator service", "generator repair", "generator tune-up"],
    "generator-sizing-load-analysis": ["generator sizing", "load calculation", "generator capacity", "power requirement analysis"],
    "emergency-power-system-design": ["emergency power design", "backup power system", "UPS installation", "emergency electrical"],
    
    // Lighting
    "recessed-lighting-installation": ["recessed lighting", "can lights", "LED recessed lights", "pot lights"],
    "indoor-outdoor-lighting-installation": ["lighting installation", "light fixture installation", "indoor lighting", "outdoor lights"],
    "landscape-outdoor-lighting": ["landscape lighting", "outdoor lighting design", "garden lights", "pathway lighting"],
    "led-lighting-retrofit-conversion": ["LED retrofit", "LED conversion", "energy efficient lighting", "LED upgrade"],
    "commercial-led-lighting-retrofit": ["commercial LED lighting", "office LED upgrade", "business lighting retrofit", "commercial lighting"],
    "smart-lighting-installation": ["smart lighting", "WiFi lights", "app controlled lights", "automated lighting"],
    "motion-sensor-dimmer-installation": ["motion sensor lights", "dimmer switch", "occupancy sensor", "light dimmer installation"],
    "holiday-lighting-installation-removal": ["holiday lights installation", "Christmas lights", "outdoor holiday lighting", "festive lighting"],
    "parking-lot-security-lighting": ["parking lot lights", "security lighting", "commercial outdoor lighting", "LED parking lights"],
    "exit-emergency-lighting-systems": ["exit lights", "emergency lighting", "emergency exit signs", "backup lighting"],
    
    // Outlets & Switches
    "gfci-outlet-installation-repair": ["GFCI outlet", "ground fault outlet", "bathroom outlet", "kitchen outlet"],
    "new-outlet-installation-repair": ["outlet installation", "electrical outlet repair", "add outlet", "outlet replacement"],
    "outdoor-waterproof-outlet-installation": ["outdoor outlet", "waterproof outlet", "exterior electrical outlet", "weather resistant outlet"],
    "240v-outlet-installation": ["240v outlet", "dryer outlet", "range outlet", "high voltage outlet"],
    "light-switch-installation-replacement": ["light switch installation", "switch replacement", "dimmer switch", "smart switch"],
    "commercial-gfci-safety-compliance": ["commercial GFCI", "OSHA electrical compliance", "workplace outlet safety", "commercial outlet inspection"],
    
    // Inspections & Safety
    "electrical-safety-inspection": ["electrical inspection", "home electrical safety", "electrical safety check", "panel inspection"],
    "electrical-safety-inspection-certification": ["electrical certification", "safety certificate", "electrical compliance", "inspection certification"],
    "home-electrical-inspection-certification": ["home inspection electrical", "residential electrical inspection", "home safety inspection", "electrical home check"],
    "pre-purchase-electrical-inspection": ["pre-purchase inspection", "home buying electrical", "real estate electrical inspection", "buyer electrical check"],
    "insurance-electrical-inspection": ["insurance inspection", "4-point inspection electrical", "insurance electrical certification", "policy electrical check"],
    "real-estate-inspection-services": ["real estate electrical", "property electrical inspection", "home sale electrical", "closing electrical inspection"],
    "electrical-code-compliance-audit": ["code compliance", "electrical code inspection", "NEC compliance", "building code electrical"],
    "electrical-code-compliance-violation-repairs": ["code violation repair", "electrical violation fix", "permit violation correction", "code correction"],
    "permit-application-inspection-coordination": ["electrical permit", "permit application", "inspection coordination", "building permit electrical"],
    
    // Smart Home & Automation
    "smart-thermostat-installation": ["smart thermostat", "Nest installation", "programmable thermostat", "WiFi thermostat"],
    "smart-switch-home-automation": ["smart switch", "home automation", "smart home electrical", "automated switches"],
    "ring-doorbell-security-camera-wiring": ["doorbell camera installation", "Ring doorbell wiring", "security camera installation", "smart doorbell"],
    "home-theater-low-voltage-wiring": ["home theater wiring", "low voltage installation", "surround sound wiring", "media room electrical"],
    "computer-network-outlet-installation": ["network outlet", "ethernet installation", "data cable", "CAT6 installation"],
    
    // Ceiling Fans & Fixtures
    "ceiling-fan-light-fixture-installation": ["ceiling fan installation", "light fixture", "fan installation", "chandelier installation"],
    
    // Surge Protection
    "whole-home-surge-protection": ["surge protector", "whole house surge protection", "lightning protection", "power surge"],
    
    // Specialty Services
    "pool-spa-wiring-inspection": ["pool electrical", "spa wiring", "pool pump electrical", "hot tub wiring"],
    "hot-tub-spa-installation": ["hot tub electrical", "spa installation", "jacuzzi wiring", "hot tub circuit"],
    "sauna-steam-room-electrical": ["sauna electrical", "steam room wiring", "sauna installation", "steam generator electrical"],
    "dock-marina-electrical-services": ["dock electrical", "marina wiring", "boat lift electrical", "waterfront electrical"],
    "solar-panel-electrical-integration": ["solar panel electrical", "solar integration", "solar inverter", "renewable energy electrical"],
    
    // Wiring
    "electrical-wiring-updates-rewiring": ["rewiring", "electrical wiring", "whole house rewiring", "wire replacement"],
    
    // Commercial
    "tenant-build-out-electrical-work": ["tenant buildout electrical", "commercial buildout", "office electrical", "retail electrical"],
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
    return `Professional ${serviceName.toLowerCase()} in ${cityName}, FL. Licensed electrician serving ${neighborhoodText}. 24/7 service, free estimates. Call ${SITE_CONFIG.contact.phone.formatted}.`;
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
 * Generate local regulatory and permit information by county
 */
export function generateLocalRegulatoryInfo(county: string): {
    title: string;
    content: string;
    jurisdiction: string;
} {
    const normalizedCounty = county.toLowerCase();
    
    if (normalizedCounty.includes('miami-dade')) {
        return {
            title: "Miami-Dade County Compliance",
            content: "All electrical installations in Miami-Dade require specialized permitting through the RER Department. We coordinate all inspections, including the mandatory 40-year recertification checks for older properties.",
            jurisdiction: "Miami-Dade RER"
        };
    }
    
    if (normalizedCounty.includes('broward')) {
        return {
            title: "Broward County Standards",
            content: "Electrical work in Broward County must comply with the Florida Building Code and local amendments. We handle all permit applications and coordinate with municipal building departments across the county.",
            jurisdiction: "Broward County Planning & Development"
        };
    }
    
    if (normalizedCounty.includes('palm beach')) {
        return {
            title: "Palm Beach County Requirements",
            content: "Palm Beach County has strict standards for coastal electrical exposed to salt air. We ensure all materials used meet the PZ&B requirements for longevity and safety in this environment.",
            jurisdiction: "Palm Beach County PZ&B"
        };
    }
    
    return {
        title: "Florida Building Code Compliance",
        content: "Our work follows the latest NEC (National Electrical Code) and Florida Building Code standards to ensure your safety and passing inspections.",
        jurisdiction: "Local Building Department"
    };
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
 * Includes Service, LocalBusiness, BreadcrumbList, and FAQPage schemas
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
    },
    faqs?: { question: string; answer: string }[]
) {
    const siteUrl = SITE_CONFIG.seo.siteUrl;
    
    // Build FAQPage schema if FAQs provided
    const faqSchema = faqs && faqs.length > 0 ? [{
        "@type": "FAQPage",
        "@id": `${siteUrl}/services/${service.slug}/${city.slug}/#faqpage`,
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }] : [];
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "@id": `${siteUrl}/services/${service.slug}/${city.slug}/#service`,
                "name": `${service.name} in ${city.name}, FL`,
                "description": service.description,
                "serviceType": service.category,
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
                "url": `${siteUrl}/services/${service.slug}/${city.slug}`,
                "image": `${siteUrl}/og-default.jpg`,
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock",
                    "priceCurrency": "USD",
                    "priceRange": "$$"
                },
                "availableChannel": {
                    "@type": "ServiceChannel",
                    "serviceUrl": `${siteUrl}/services/${service.slug}/${city.slug}`,
                    "servicePhone": SITE_CONFIG.contact.phone.formatted,
                    "availableLanguage": ["English", "Spanish"],
                    ...(city.coordinates && {
                        "serviceLocation": {
                            "@type": "Place",
                            "name": city.name,
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": city.coordinates.lat,
                                "longitude": city.coordinates.lng
                            }
                        }
                    })
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
            },
            // ImageObject for image search optimization
            {
                "@type": "ImageObject",
                "@id": `${siteUrl}/services/${service.slug}/${city.slug}/#primaryimage`,
                "url": `${siteUrl}/og-default.jpg`,
                "contentUrl": `${siteUrl}/og-default.jpg`,
                "caption": `${service.name} services in ${city.name}, FL - Solomon Electric`,
                "name": `${service.name} in ${city.name}`,
                "description": `Professional ${service.name.toLowerCase()} provided by licensed electricians at Solomon Electric in ${city.name}, Florida`,
                "width": 1200,
                "height": 630,
                "representativeOfPage": true,
                "inLanguage": "en-US",
                "license": `${siteUrl}/terms/`,
                "acquireLicensePage": `${siteUrl}/contact/`,
                "creditText": "Solomon Electric",
                "copyrightNotice": "© Solomon Electric",
                "creator": {
                    "@id": `${siteUrl}/#organization`
                }
            },
            // FAQPage schema for rich snippets
            ...faqSchema
        ]
    };
}
