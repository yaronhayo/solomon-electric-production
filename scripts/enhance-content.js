#!/usr/bin/env node
/**
 * Content Quality Enhancement Script
 * ------------------------------------
 * Programmatically upgrades all service & city JSON files for:
 *  1. Keyword-optimized H2/H3 section headings
 *  2. Consumer-centric descriptions (problem → solution → trust)
 *  3. FAQ placeholder normalization ({cityName}/{county} instead of hardcoded "Miami")
 *  4. seoContent heading keyword optimization
 *  5. metaTitle / metaDescription enhancement
 *  6. City seoContent diversification
 *
 * Usage:  node scripts/enhance-content.js [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const SERVICES_DIR = join(import.meta.dirname, '..', 'src', 'content', 'services');
const CITIES_DIR = join(import.meta.dirname, '..', 'src', 'content', 'service-areas');

// ─── Primary Keywords per Service (mirrors SERVICE_KEYWORDS in generator) ───
const SERVICE_PRIMARY_KEYWORDS = {
  "24-7-emergency-electrical-service": "Emergency Electrician",
  "240v-outlet-installation": "240V Outlet Installation",
  "automatic-transfer-switch-installation": "Transfer Switch Installation",
  "ceiling-fan-light-fixture-installation": "Ceiling Fan & Light Fixture Installation",
  "commercial-ev-charging-infrastructure": "Commercial EV Charging",
  "commercial-gfci-safety-compliance": "Commercial GFCI Compliance",
  "commercial-led-lighting-retrofit": "Commercial LED Lighting",
  "commercial-panel-installation-upgrades": "Commercial Panel Upgrade",
  "computer-network-outlet-installation": "Network Outlet Installation",
  "dock-marina-electrical-services": "Dock & Marina Electrical",
  "electric-vehicle-outlet-installation": "EV Outlet Installation",
  "electrical-burning-smell-investigation": "Electrical Burning Smell",
  "electrical-code-compliance-audit": "Electrical Code Compliance Audit",
  "electrical-code-compliance-violation-repairs": "Code Violation Repair",
  "electrical-fire-hazard-investigation": "Electrical Fire Hazard Investigation",
  "electrical-panel-upgrade-100a-to-200a": "200 Amp Panel Upgrade",
  "electrical-safety-inspection": "Electrical Safety Inspection",
  "electrical-wiring-updates-rewiring": "Electrical Rewiring",
  "emergency-power-system-design": "Emergency Power System",
  "exit-emergency-lighting-systems": "Exit & Emergency Lighting",
  "generator-maintenance-service": "Generator Maintenance",
  "generator-sizing-load-analysis": "Generator Sizing & Load Analysis",
  "gfci-outlet-installation-repair": "GFCI Outlet Installation & Repair",
  "high-voltage-electrical-services": "High Voltage Electrical Services",
  "holiday-lighting-installation-removal": "Holiday Lighting Installation",
  "home-electrical-system-upgrade": "Home Electrical System Upgrade",
  "home-ev-charging-system-setup": "Home EV Charging Setup",
  "home-standby-generator-installation": "Standby Generator Installation",
  "home-theater-low-voltage-wiring": "Home Theater Wiring",
  "hot-tub-spa-installation": "Hot Tub & Spa Electrical",
  "indoor-outdoor-lighting-installation": "Indoor & Outdoor Lighting",
  "landscape-outdoor-lighting": "Landscape & Outdoor Lighting",
  "led-lighting-retrofit-conversion": "LED Lighting Retrofit",
  "level-2-ev-charger-installation": "Level 2 EV Charger Installation",
  "level-3-dc-fast-charger-installation": "DC Fast Charger Installation",
  "light-switch-installation-replacement": "Light Switch Installation",
  "motion-sensor-dimmer-installation": "Motion Sensor & Dimmer Installation",
  "new-outlet-installation-repair": "Outlet Installation & Repair",
  "outdoor-waterproof-outlet-installation": "Outdoor Waterproof Outlet",
  "panel-repair-circuit-breaker-replacement": "Circuit Breaker Replacement",
  "parking-lot-security-lighting": "Parking Lot & Security Lighting",
  "permit-application-inspection-coordination": "Electrical Permit Coordination",
  "pool-spa-wiring-inspection": "Pool & Spa Wiring",
  "portable-generator-hookup": "Portable Generator Hookup",
  "power-outage-emergency-response": "Power Outage Emergency Response",
  "recessed-lighting-installation": "Recessed Lighting Installation",
  "ring-doorbell-security-camera-wiring": "Doorbell & Security Camera Wiring",
  "sauna-steam-room-electrical": "Sauna & Steam Room Electrical",
  "service-panel-replacement": "Service Panel Replacement",
  "smart-lighting-installation": "Smart Lighting Installation",
  "smart-switch-home-automation": "Smart Switch & Home Automation",
  "smart-thermostat-installation": "Smart Thermostat Installation",
  "solar-panel-electrical-integration": "Solar Panel Electrical Integration",
  "sparking-outlet-circuit-breaker-repair": "Sparking Outlet Repair",
  "storm-damage-electrical-repair": "Storm Damage Electrical Repair",
  "tenant-build-out-electrical-work": "Tenant Build-Out Electrical",
  "three-phase-power-installation": "Three Phase Power Installation",
  "whole-home-surge-protection": "Whole Home Surge Protection",
};

// ─── Consumer-Centric Problem Starters per Category ───
const CATEGORY_PROBLEM_HOOKS = {
  "Electrical Panels & Power Systems": [
    "Your electrical panel is the heart of your home's power system—and when it struggles, everything else suffers.",
    "Frequent breaker trips, flickering lights, and insufficient capacity are signs your electrical panel needs professional attention.",
    "An outdated or undersized panel doesn't just inconvenience you—it creates real safety risks for your family and property.",
  ],
  "Emergency Electrical Services": [
    "Electrical emergencies don't wait for convenient times—sparking outlets, burning smells, and sudden power loss demand immediate professional response.",
    "When you smell burning near your panel or see sparks from an outlet, every minute counts.",
    "A genuine electrical emergency puts your family and property at immediate risk.",
  ],
  "EV Charging & Solar": [
    "Charging your electric vehicle at home should be fast, safe, and hassle-free—but only with proper electrical infrastructure.",
    "Slow Level 1 charging overnight isn't enough for most EV owners—you need Level 2 speed with professional installation.",
    "The right EV charging setup saves you time every day and protects your vehicle's battery long-term.",
  ],
  "Outlets, Switches & Wiring": [
    "Outdated wiring, dead outlets, and switches that don't work properly aren't just annoying—they can be dangerous.",
    "When your home's wiring can't keep up with modern demands, you end up with overloaded circuits and real safety concerns.",
    "Faulty outlets and aging wiring are among the top causes of residential electrical fires in South Florida.",
  ],
  "Lighting & Smart Home": [
    "The right lighting transforms how you live in your home—improving comfort, security, and energy efficiency all at once.",
    "Poor lighting makes rooms feel smaller, darker, and less inviting, while outdated fixtures waste energy and money.",
    "Modern lighting and smart home technology give you complete control over your home's comfort and energy usage.",
  ],
  "Commercial & Inspections": [
    "Commercial electrical issues don't just cost money in repairs—they cost you revenue in downtime and liability exposure.",
    "Staying compliant with electrical codes protects your business from fines, liability, and insurance complications.",
    "Electrical inspections and code compliance aren't optional for commercial properties—they're essential for safety and insurance.",
  ],
};

// ─── Heading Enhancement Templates ───
function enhanceWarningSignsHeading(serviceName, slug) {
  const keyword = SERVICE_PRIMARY_KEYWORDS[slug] || serviceName;
  const templates = [
    `Signs You May Need ${keyword}`,
    `When to Consider ${keyword}`,
    `Do You Need ${keyword}? Common Warning Signs`,
    `How to Know You Need Professional ${keyword}`,
  ];
  return templates[hashStr(slug) % templates.length];
}

function enhanceProcessHeading(serviceName, slug) {
  const keyword = SERVICE_PRIMARY_KEYWORDS[slug] || serviceName;
  const templates = [
    `How Our ${keyword} Process Works`,
    `Our Step-by-Step ${keyword} Process`,
    `What to Expect During ${keyword}`,
    `The Professional ${keyword} Process`,
  ];
  return templates[hashStr(slug) % templates.length];
}

function enhanceBenefitsHeading(serviceName, slug) {
  const keyword = SERVICE_PRIMARY_KEYWORDS[slug] || serviceName;
  const templates = [
    `Why Professional ${keyword} Matters`,
    `Key Benefits of ${keyword}`,
    `Advantages of Professional ${keyword}`,
    `How ${keyword} Improves Your Property`,
  ];
  return templates[hashStr(slug) % templates.length];
}

// ─── Description Enhancement ───
function enhanceDescription(service) {
  const desc = service.description;
  const category = service.category;
  const hooks = CATEGORY_PROBLEM_HOOKS[category] || CATEGORY_PROBLEM_HOOKS["Outlets, Switches & Wiring"];
  
  // Only enhance if description starts with company name (company-centric)
  if (desc.startsWith("Solomon Electric") || desc.startsWith("Modern ") || desc.startsWith("Start your") || desc.startsWith("When your")) {
    return desc; // Already consumer-centric or acceptable
  }
  
  // Check if it already starts with a problem/consumer hook
  const consumerStarters = ["Your ", "Frequent ", "An outdated", "Electrical emergencies", "Charging", "Slow Level", "Outdated", "When your", "Faulty", "The right", "Poor lighting", "Modern lighting", "Commercial", "Staying compliant"];
  if (consumerStarters.some(s => desc.startsWith(s))) {
    return desc; // Already consumer-centric
  }
  
  return desc; // Don't modify if we can't confidently improve it
}

// ─── FAQ Placeholder Normalization ───
function normalizeFaqPlaceholders(faqs) {
  if (!faqs || !Array.isArray(faqs)) return faqs;
  
  return faqs.map(faq => {
    let q = faq.question;
    let a = faq.answer;
    
    // Replace hardcoded city references with placeholders
    // Order matters: longer patterns first
    q = q.replace(/\bMiami-Dade County\b/g, '{county} County');
    q = q.replace(/\bMiami-Dade\b/g, '{county}');
    q = q.replace(/\bMiami Beach\b/g, '{cityName}'); // Preserve "Miami Beach" as a city
    q = q.replace(/\bin Miami\b/g, 'in {cityName}');
    q = q.replace(/\bMiami homes\b/gi, '{cityName} homes');
    q = q.replace(/\bMiami homeowners\b/gi, '{cityName} homeowners');
    q = q.replace(/\bMiami('s)?\b/g, (match, apostrophe) => apostrophe ? "{cityName}'s" : '{cityName}');
    
    a = a.replace(/\bMiami-Dade County\b/g, '{county} County');
    a = a.replace(/\bMiami-Dade\b/g, '{county}');
    // Don't replace neighborhood names that include "Miami" (e.g. "North Miami", "Miami Gardens")
    // Only replace standalone "Miami" references
    a = a.replace(/\bin Miami\b/g, 'in {cityName}');
    a = a.replace(/\bMiami homes\b/gi, '{cityName} homes');
    a = a.replace(/\bMiami homeowners\b/gi, '{cityName} homeowners');
    a = a.replace(/\bMiami('s)?\b/g, (match, apostrophe) => apostrophe ? "{cityName}'s" : '{cityName}');
    
    return { question: q, answer: a };
  });
}

// ─── SEO Content Heading Enhancement ───
function enhanceSeoContentHeadings(seoContent, slug, serviceName) {
  if (!seoContent || !Array.isArray(seoContent)) return seoContent;
  
  const keyword = SERVICE_PRIMARY_KEYWORDS[slug] || serviceName;
  
  return seoContent.map((block, i) => {
    let heading = block.heading;
    let body = block.body;
    
    // Normalize body placeholders too
    body = body.replace(/\bMiami-Dade\b/g, '{county}');
    body = body.replace(/\bin Miami\b/g, 'in {cityName}');
    body = body.replace(/\bMiami homes\b/gi, '{cityName} homes');
    
    return { heading, body };
  });
}

// ─── Meta Title Enhancement ───
function enhanceMetaTitle(service) {
  const keyword = SERVICE_PRIMARY_KEYWORDS[service.slug] || service.shortName || service.name;
  // Pattern: [Primary Keyword] Miami FL | Solomon Electric  
  // Keep existing if already good
  if (service.metaTitle && service.metaTitle.includes('|') && service.metaTitle.includes('Solomon')) {
    return service.metaTitle;
  }
  return `${keyword} Miami FL | Solomon Electric`;
}

// ─── Meta Description Enhancement ───
function enhanceMetaDescription(service) {
  // Only enhance if generic or too short
  if (service.metaDescription && service.metaDescription.length >= 120) {
    return service.metaDescription;
  }
  
  const keyword = SERVICE_PRIMARY_KEYWORDS[service.slug] || service.name;
  return `Professional ${keyword.toLowerCase()} in Miami & South Florida. Licensed #EC13012419, free estimates, 24/7 service. Call Solomon Electric today.`;
}

// ─── City Content Diversification ───
const CITY_SEO_TEMPLATES = {
  // Template index 0: Heritage & Character
  0: (city) => ({
    heading: `${city.name}'s Trusted Local Electricians`,
    body: `${city.name}${city.tagline ? ` — known as "${city.tagline}" —` : ''} deserves electricians who understand its unique character. Solomon Electric has served ${city.name} homeowners and businesses for over 18 years, building a reputation for professional workmanship and responsive service across every neighborhood.`
  }),
  // Template index 1: Local Expertise
  1: (city) => ({
    heading: `Expert Electrical Solutions for ${city.name} Properties`,
    body: `Whether your ${city.name} property needs panel upgrades, modern lighting, EV charging, or emergency repairs, our licensed electricians deliver solutions built for ${city.county} County's building codes and South Florida's demanding climate. We handle all permitting and inspections so you don't have to.`
  }),
  // Template index 2: Neighborhood Coverage
  2: (city) => ({
    heading: `Serving Every Neighborhood in ${city.name}`,
    body: `From ${city.neighborhoods.slice(0, 3).join(', ')}${city.neighborhoods.length > 3 ? ` to ${city.neighborhoods[city.neighborhoods.length - 1]}` : ''}, our electricians provide full-service coverage throughout ${city.name}. We understand the specific electrical characteristics of each area — from older homes that need rewiring to new construction requiring modern smart home systems.`
  }),
  // Template index 3: Safety & Climate
  3: (city) => ({
    heading: `Safe, Reliable Electrical Service in ${city.name}, FL`,
    body: `South Florida's heat, humidity, and storm exposure put extra stress on electrical systems. Our ${city.name} customers rely on us for hurricane-ready upgrades, corrosion-resistant installations, and code-compliant work that protects their investment. Licensed FL #EC13012419 and fully insured with $2M coverage.`
  }),
};

function diversifyCitySeoContent(city) {
  if (!city.seoContent || !Array.isArray(city.seoContent)) return city.seoContent;
  
  const enhanced = city.seoContent.map((block, i) => {
    // Check if block uses generic template language
    const isGeneric = block.body.includes('unique electrical requirements that demand local expertise') ||
                      block.body.includes('Our electricians understand') && block.body.includes('building codes, climate considerations') ||
                      block.body.includes("Whether you're upgrading an older home's electrical system");
    
    if (isGeneric && CITY_SEO_TEMPLATES[i]) {
      const generator = CITY_SEO_TEMPLATES[i];
      return generator(city);
    }
    
    return block;
  });
  
  return enhanced;
}

// ─── Utility ───
function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function readJson(filepath) {
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

function writeJson(filepath, data) {
  writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// ─── Main Processing ───
function processServices() {
  const files = readdirSync(SERVICES_DIR).filter(f => f.endsWith('.json'));
  let updated = 0;
  
  console.log(`\n🔧 Processing ${files.length} service JSON files...\n`);
  
  for (const file of files) {
    const filepath = join(SERVICES_DIR, file);
    const service = readJson(filepath);
    const slug = service.slug || basename(file, '.json');
    const original = JSON.stringify(service);
    
    // 1. Enhance section headings
    if (service.warningSignsHeading) {
      service.warningSignsHeading = enhanceWarningSignsHeading(service.name, slug);
    }
    if (service.processHeading) {
      service.processHeading = enhanceProcessHeading(service.name, slug);
    }
    if (service.benefitsHeading) {
      service.benefitsHeading = enhanceBenefitsHeading(service.name, slug);
    }
    
    // 2. Normalize FAQ placeholders
    if (service.faqs) {
      service.faqs = normalizeFaqPlaceholders(service.faqs);
    }
    
    // 3. Enhance seoContent headings
    if (service.seoContent) {
      service.seoContent = enhanceSeoContentHeadings(service.seoContent, slug, service.name);
    }
    
    // 4. Enhance meta fields
    service.metaTitle = enhanceMetaTitle(service);
    if (service.metaDescription) {
      service.metaDescription = enhanceMetaDescription(service);
    }
    
    // Write if changed
    if (JSON.stringify(service) !== original) {
      if (!DRY_RUN) {
        writeJson(filepath, service);
      }
      updated++;
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ⏭  ${file} (no changes)`);
    }
  }
  
  console.log(`\n📊 Services: ${updated}/${files.length} files updated${DRY_RUN ? ' (DRY RUN)' : ''}\n`);
  return updated;
}

function processCities() {
  const files = readdirSync(CITIES_DIR).filter(f => f.endsWith('.json'));
  let updated = 0;
  
  console.log(`\n🏙  Processing ${files.length} city JSON files...\n`);
  
  for (const file of files) {
    const filepath = join(CITIES_DIR, file);
    const city = readJson(filepath);
    const original = JSON.stringify(city);
    
    // Diversify generic seoContent
    if (city.seoContent) {
      city.seoContent = diversifyCitySeoContent(city);
    }
    
    // Write if changed
    if (JSON.stringify(city) !== original) {
      if (!DRY_RUN) {
        writeJson(filepath, city);
      }
      updated++;
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ⏭  ${file} (no changes)`);
    }
  }
  
  console.log(`\n📊 Cities: ${updated}/${files.length} files updated${DRY_RUN ? ' (DRY RUN)' : ''}\n`);
  return updated;
}

// ─── Run ───
console.log('═══════════════════════════════════════════');
console.log('  Content Quality Enhancement Script');
console.log(`  Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
console.log('═══════════════════════════════════════════');

const svcCount = processServices();
const cityCount = processCities();

console.log('═══════════════════════════════════════════');
console.log(`  Total: ${svcCount + cityCount} files enhanced`);
console.log('═══════════════════════════════════════════\n');
