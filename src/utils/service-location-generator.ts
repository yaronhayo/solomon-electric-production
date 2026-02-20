/**
 * Service-Location Content Generator
 * Utilities for generating localized service content at scale
 */

import { SITE_CONFIG } from '../config/site';

// City-specific content templates
export const CITY_CONTENT_TEMPLATES = {
    // Intro paragraph templates - rotated for variety
    // Intro paragraph templates - expanded for maximum variety across 1,700+ pages
    introTemplates: [
        "Looking for professional {serviceName} in {cityName}? Solomon Electric provides licensed, insured electrical services to {cityName} residents and businesses. With {yearsExperience}+ years serving {county} County, we understand the unique electrical challenges facing {cityName} properties.",
        "Solomon Electric is {cityName}'s trusted choice for {serviceName}. Our licensed electricians serve homes and businesses throughout {cityName}'s neighborhoods, from {neighborhood1} to {neighborhood2}. Available 24/7 for your electrical needs.",
        "Need {serviceName} in {cityName}, FL? Solomon Electric delivers expert electrical solutions backed by our satisfaction guarantee. We're proud to serve the {cityName} community with professional, code-compliant electrical work.",
        "When you need reliable {serviceName} in {cityName}, Solomon Electric is the local contractor that {county} County property owners depend on. Our master electricians are familiar with {cityName}'s specific building codes and infrastructure.",
        "Solomon Electric offers comprehensive {serviceName} across {cityName}, FL. From emergency repairs to major installations, our licensed team brings the expertise required for {cityName}'s diverse residential and commercial spaces.",
        "Searching for {serviceName} in {cityName}? Our team at Solomon Electric provides top-tier electrical craftsmanship for every {cityName} neighborhood. We combine local experience in {county} County with a commitment to safety and excellence.",
        "Secure your property with expert {serviceName} in {cityName}. Solomon Electric offers prompt dispatch for all {cityName} electrical projects, ensuring your systems are safe, efficient, and fully code-compliant.",
        "For homeowners and businesses in {cityName}, Solomon Electric is the premier provider of {serviceName}. We specialize in {cityName} properties, offering tailored solutions that meet the specific electrical demands of {county} County.",
        "Get the peace of mind you deserve with professional {serviceName} in {cityName}. Our licensed team at Solomon Electric is dedicated to providing {cityName} with transparent pricing and superior electrical results.",
        "Solomon Electric brings years of {county} County expertise to every {serviceName} job in {cityName}. Whether it's a small repair or a major upgrade, we treat your {cityName} property like our own.",
        "Quality {serviceName} is just a phone call away in {cityName}. Solomon Electric serves the entire {cityName} area, bringing licensed expertise to local homes and commercial facilities since {foundedYear}.",
        "Don't settle for less when it comes to {serviceName} in {cityName}. Solomon Electric provides the high-fidelity electrical work that {cityName} residents trust for safety and reliability.",
        "As a leading {serviceName} specialist in {cityName}, Solomon Electric combines technical mastery with local {county} County knowledge. We're here to solve {cityName}'s most complex electrical problems.",
        "Your safety is our priority for {serviceName} in {cityName}. Solomon Electric delivers 24/7 support and professional installations for all {cityName} neighborhoods, from {neighborhood1} and beyond.",
        "Solomon Electric is proud to be part of the {cityName} business community. We provide {serviceName} that keeps {cityName} powered up and running safely, day and night.",
    ],
    
    // Why choose us for this city - expanded for diversity
    whyChooseTemplates: [
        "As a locally-owned electrical contractor, we know {cityName}. From the building codes in {county} County to the specific electrical challenges caused by {challenge}, we have the expertise to handle your {serviceName} project right the first time.",
        "Solomon Electric has completed hundreds of electrical projects in {cityName}. Our familiarity with local permit requirements, FPL coordination, and {cityName}'s unique property types means faster, smoother project completion.",
        "{cityName} homeowners trust Solomon Electric because we're not just electricians—we're your neighbors. We take pride in every {cityName} project, treating your home with the care and respect it deserves.",
        "Our deep roots in {county} County give us a unique perspective on {serviceName} in {cityName}. We address {challenge} with specialized techniques that generic contractors often overlook, ensuring long-lasting safety and performance.",
        "Efficiency and reliability define our approach to {serviceName} in {cityName}. By understanding the specific needs of {cityName} properties—including local climate impacts like {challenge}—we deliver results that stand the test of time.",
        "Solomon Electric's reputation in {cityName} is built on transparency and technical mastery. We help {cityName} residents navigate complex electrical upgrades while mitigating common local risks such as {challenge}.",
        "We understand that {cityName} properties have unique requirements. Our experience with {challenge} allows us to provide {serviceName} solutions that are specifically optimized for the {cityName} environment.",
        "In {cityName}, reputation matters. Solomon Electric has built its name on {yearsExperience}+ years of honest, licensed work in {county} County, specializing in {serviceName} for every type of {cityName} building.",
        "Choosing Solomon Electric for your {serviceName} in {cityName} means choosing local expertise. We've mastered the nuances of {cityName} electrical systems, including specialized protection against {challenge}.",
        "Our team is deeply familiar with the {cityName} permit process and {county} County regulations. This ensures your {serviceName} project is completed legally, safely, and without unnecessary delays.",
        "We've spent over a decade perfecting {serviceName} for {cityName} clients. By focusing on local issues like {challenge}, we've become the most trusted electrical team in the {cityName} area.",
        "At Solomon Electric, we don't believe in one-size-fits-all. Every {serviceName} project in {cityName} is tailored to the specific needs of the property and the unique challenges of the {county} County climate.",
        "Our licensed electricians are local to the {cityName} area. We can respond faster to {serviceName} needs and bring a level of care that only a true {cityName} neighbor can provide.",
        "With a focus on {challenge} prevention and modern code compliance, Solomon Electric is the forward-thinking choice for {serviceName} in {cityName} and the surrounding {county} County area.",
        "We've helped {cityName} families and business owners for decades. Our commitment to {cityName} is reflected in our 24/7 availability and our direct experience with local issues like {challenge}.",
    ],
    
    // Call to action templates
    ctaTemplates: [
        `Ready for professional {serviceName} in {cityName}? Call ${SITE_CONFIG.contact.phone.formatted} or book online for a free estimate.`,
        "Get expert {serviceName} services in {cityName} today. Our licensed electricians are standing by 24/7.",
        "Schedule your {serviceName} consultation in {cityName}. Fast response, fair pricing, guaranteed satisfaction.",
        "Don't wait—secure your {cityName} property with licensed {serviceName}. Call now for immediate service.",
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

// Problem-centric H2 templates by category
const CATEGORY_H2_TEMPLATES: Record<string, string[]> = {
    "Emergency": [
        "Solving Electrical Emergencies in {cityName}",
        "Stopping Dangerous Electrical Hazards in {cityName}",
        "24/7 Response: Fixing Urgent Power Issues in {cityName}"
    ],
    "Panels": [
        "Passing 2024 Electrical Codes in {cityName}",
        "Stopping Panel Overloads: Expert Upgrades in {cityName}",
        "Powering Modern Life: Reliable Panel Upgrades in {cityName}"
    ],
    "EV Charging": [
        "Charging the Future: Home EV Setup in {cityName}",
        "Professional Tesla &amp; Level 2 Charging in {cityName}",
        "Safe, Fast, and Reliable EV Charging in {cityName}"
    ],
    "Generators": [
        "Hurricane-Proof Your Power in {cityName}",
        "Storm-Ready Protection: Automatic Generators in {cityName}",
        "Reliable Backup Power: Generator Sizing in {cityName}"
    ],
    "Lighting": [
        "Slashing Utility Bills: LED Retrofit in {cityName}",
        "Luxury Lighting Design: Interior &amp; Exterior in {cityName}",
        "Stopping Maintenance Headaches: Commercial LED in {cityName}"
    ],
    "Inspections": [
        "Passing 4-Point Audits: Certified Inspections in {cityName}",
        "Stopping Hidden Hazards: Professional Audits in {cityName}",
        "Verified Safety: Electrical Certifications in {cityName}"
    ],
    "Compliance": [
        "Solving Code Violations: Legal Electrical Audits in {cityName}",
        "Passing Legal Inspections: NEC Compliance in {cityName}",
        "Resolving Unpermitted Work: Structural Audits in {cityName}"
    ],
    "Marine": [
        "Stopping Coastal Corrosion: Dock Electrical in {cityName}",
        "Reliable Waterfront Power: Marina Specialists in {cityName}",
        "ESD Prevention: Safe Dock Power in {cityName}"
    ],
    "Pool &amp; Spa": [
        "Stopping Electrocution Risks: Pool Certification in {cityName}",
        "Verified Bonding: Safe Pool &amp; Spa Wiring in {cityName}",
        "Professional Pool Audits: Pre-Purchase Inspections in {cityName}"
    ],
    "Residential": [
        "Modernizing {cityName} Homes: Safe Electrical Updates",
        "Reliable Home Power: Professional Service in {cityName}",
        "Stopping Domestic Electrical Hazards in {cityName}"
    ],
    "Commercial": [
        "Powering {cityName} Businesses: Commercial Excellence",
        "Certified Commercial Electrical: Code-Compliant Work",
        "Stopping Operational Downtime: Expert Repairs in {cityName}"
    ]
};

/**
 * Generate a high-fidelity, problem-centric H2 for localized pages
 */
export function generateProblemCentricH2(category: string, cityName: string): string {
    const templates = CATEGORY_H2_TEMPLATES[category] || CATEGORY_H2_TEMPLATES["Residential"];
    const index = Math.abs(hashString(category + cityName)) % templates.length;
    return templates[index].replace(/{cityName}/g, cityName);
}

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
    // Keep under 60 characters for SEO
    const shortServiceName = serviceName.length > 35 
        ? serviceName.split(' ').slice(0, 3).join(' ')
        : serviceName;
    
    // Rotate through high-intent patterns
    const patterns = [
        `${shortServiceName} in ${cityName}, FL | Licensed Electrician`,
        `${shortServiceName} ${cityName}, FL | 24/7 Emergency Service`,
        `${shortServiceName} near ${cityName}, FL | Free Estimates`,
        `Licensed ${shortServiceName} | ${cityName}, FL`
    ];
    
    const index = Math.abs(hashString(serviceName + cityName)) % patterns.length;
    const generatedTitle = patterns[index];

    // Enforce strict 70-character limit for W3C HTML Validation Compliance
    if (generatedTitle.length > 70) {
        const fallback = `${shortServiceName} | ${cityName}, FL`;
        return fallback.length > 70 ? fallback.substring(0, 67) + "..." : fallback;
    }

    return generatedTitle;
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
    const patterns = [
        `Professional ${serviceName.toLowerCase()} in ${cityName}, FL. Licensed electrician serving ${neighborhoodText}. 24/7 service, free estimates. Call ${SITE_CONFIG.contact.phone.formatted}.`,
        `Need ${serviceName.toLowerCase()} in ${cityName}, FL? Solomon Electric offers licensed 24/7 emergency response in ${neighborhoodText}. Guaranteed workmanship. Book your free estimate today!`,
        `Searching for an electrician for ${serviceName.toLowerCase()} in ${cityName}? Our local experts serve all ${cityName} neighborhoods. Fast service, code-compliant work. Call ${SITE_CONFIG.contact.phone.formatted} now.`
    ];
    
    const index = Math.abs(hashString(serviceName + cityName)) % patterns.length;
    return patterns[index];
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
            jurisdiction: "Broward County Planning &amp; Development"
        };
    }
    
    if (normalizedCounty.includes('palm beach')) {
        return {
            title: "Palm Beach County Requirements",
            content: "Palm Beach County has strict standards for coastal electrical exposed to salt air. We ensure all materials used meet the PZ&amp;B requirements for longevity and safety in this environment.",
            jurisdiction: "Palm Beach County PZ&amp;B"
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
                // Note: aggregateRating removed - Google requires first-party review data
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
