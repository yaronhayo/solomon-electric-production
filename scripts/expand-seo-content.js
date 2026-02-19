#!/usr/bin/env node
/**
 * Phase 2: Deep Content Expansion Script
 * ────────────────────────────────────────
 * Expands seoContent bodies from ~37 words to 80-120+ words per block,
 * adds localSignals (pricing, timelines, brands, permits), and enriches descriptions.
 *
 * Usage:  node scripts/expand-seo-content.js [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const SERVICES_DIR = join(import.meta.dirname, '..', 'src', 'content', 'services');
const CITIES_DIR = join(import.meta.dirname, '..', 'src', 'content', 'service-areas');

// ─── LOCAL SIGNALS: Pricing, timelines, brands, permit notes per service ───
const LOCAL_SIGNALS = {
  // Electrical Panels & Power Systems
  "electrical-panel-upgrade-100a-to-200a": {
    typicalTimeline: "Most 200-amp panel upgrades complete in 6-8 hours with a single visit",
    priceRange: "Typically $2,200–$4,800 depending on existing wiring and meter base requirements",
    commonBrands: ["Square D QO", "Eaton CH", "Siemens PL/ES"],
    permitNote: "Requires {county} County electrical permit, FPL meter disconnect coordination, and final inspection"
  },
  "panel-repair-circuit-breaker-replacement": {
    typicalTimeline: "Single breaker replacements complete in under 1 hour; multi-breaker repairs in 2-3 hours",
    priceRange: "Individual breaker replacement typically $175–$350; full panel diagnostic and repair $400–$900",
    commonBrands: ["Square D", "Eaton/Cutler-Hammer", "Siemens", "GE"],
    permitNote: "Minor repairs may not require a permit; panel modifications do require {county} County permits"
  },
  "service-panel-replacement": {
    typicalTimeline: "Full panel replacement typically requires 6-10 hours including FPL coordination",
    priceRange: "Complete panel replacement ranges from $2,500–$5,500 depending on amperage and complexity",
    commonBrands: ["Square D Homeline", "Eaton BR/CH", "Siemens", "Leviton"],
    permitNote: "Requires {county} County electrical permit, FPL meter pull, and mandatory final inspection"
  },
  "home-electrical-system-upgrade": {
    typicalTimeline: "Whole-home upgrades typically span 2-5 days depending on scope",
    priceRange: "Comprehensive upgrades range from $3,500–$12,000+ based on home size and existing conditions",
    commonBrands: ["Square D QO", "Eaton CH", "Leviton", "Lutron"],
    permitNote: "Requires {county} County master permit covering all circuits, panel, and service entrance"
  },
  "commercial-panel-installation-upgrades": {
    typicalTimeline: "Commercial panel installations typically require 1-3 days with minimal business disruption",
    priceRange: "Commercial panels range from $4,000–$15,000+ depending on amperage and number of circuits",
    commonBrands: ["Square D I-Line", "Eaton PRL", "Siemens P1/P4", "GE A-Series"],
    permitNote: "Requires {county} County commercial electrical permit and fire marshal coordination"
  },
  "three-phase-power-installation": {
    typicalTimeline: "Three-phase installations typically require 2-5 days including utility coordination",
    priceRange: "Three-phase service installation ranges from $8,000–$25,000+ depending on capacity",
    commonBrands: ["Square D", "Eaton", "Siemens", "ABB"],
    permitNote: "Requires {county} County commercial permit, FPL service application, and utility meter installation"
  },
  "high-voltage-electrical-services": {
    typicalTimeline: "High-voltage projects vary from 1 day to several weeks based on scope",
    priceRange: "High-voltage work starts at $5,000 and can exceed $50,000 for complex installations",
    commonBrands: ["Eaton", "ABB", "Schneider Electric", "Siemens"],
    permitNote: "Requires specialized {county} County permits and may require utility engineering review"
  },

  // EV Charging
  "level-2-ev-charger-installation": {
    typicalTimeline: "Most Level 2 charger installations complete within 3-5 hours",
    priceRange: "Typical installation ranges from $800–$2,200 including wiring, breaker, and outlet",
    commonBrands: ["Tesla Wall Connector", "ChargePoint Home Flex", "JuiceBox", "Grizzl-E"],
    permitNote: "Requires {county} County electrical permit for new 240V circuit installation"
  },
  "level-3-dc-fast-charger-installation": {
    typicalTimeline: "DC fast charger installations typically require 3-7 business days",
    priceRange: "Commercial DC fast charger installations range from $25,000–$100,000+ with infrastructure",
    commonBrands: ["ChargePoint Express", "ABB Terra", "Tritium", "BTC Power"],
    permitNote: "Requires {county} County commercial permit, utility service upgrade application, and ADA compliance"
  },
  "home-ev-charging-system-setup": {
    typicalTimeline: "Home EV charging setup typically completes in 3-5 hours including panel assessment",
    priceRange: "Complete home charging setup ranges from $900–$2,500 depending on panel distance and capacity",
    commonBrands: ["Tesla Wall Connector", "ChargePoint Home Flex", "Emporia", "Wallbox Pulsar Plus"],
    permitNote: "Requires {county} County electrical permit for dedicated 240V 40-50 amp circuit"
  },
  "electric-vehicle-outlet-installation": {
    typicalTimeline: "NEMA 14-50 outlet installation typically completes in 2-4 hours",
    priceRange: "Standard EV outlet installation ranges from $500–$1,200 depending on wire run distance",
    commonBrands: ["Leviton", "Hubbell", "Eaton", "Pass & Seymour"],
    permitNote: "Requires {county} County electrical permit for new 240V dedicated circuit"
  },
  "commercial-ev-charging-infrastructure": {
    typicalTimeline: "Commercial EV infrastructure projects typically span 2-8 weeks including permitting",
    priceRange: "Multi-station commercial installations range from $15,000–$150,000+ depending on scale",
    commonBrands: ["ChargePoint", "Blink", "EverCharge", "SemaConnect"],
    permitNote: "Requires {county} County commercial permit, ADA compliance review, and fire marshal approval"
  },

  // Emergency Services
  "24-7-emergency-electrical-service": {
    typicalTimeline: "Emergency response within 60 minutes for most {county} County locations",
    priceRange: "Emergency service calls start at $150–$300 for diagnosis; repairs quoted on-site",
    commonBrands: ["Fluke diagnostic equipment", "Klein Tools", "Milwaukee"],
    permitNote: "Emergency repairs may proceed immediately; follow-up permits filed within 48 hours per Florida code"
  },
  "power-outage-emergency-response": {
    typicalTimeline: "On-site diagnosis within 60 minutes; most restorations complete in 2-4 hours",
    priceRange: "Power restoration typically ranges from $200–$1,500 depending on the cause",
    commonBrands: ["Fluke power analyzers", "Amprobe", "Ideal Industries"],
    permitNote: "FPL coordination for utility-side issues; {county} County permit for panel or service entrance repairs"
  },
  "storm-damage-electrical-repair": {
    typicalTimeline: "Emergency storm response within 2 hours; full repairs may require 1-3 days",
    priceRange: "Storm damage repairs range from $500–$5,000+ depending on extent of damage",
    commonBrands: ["Square D", "Eaton", "Generac", "Siemens"],
    permitNote: "Emergency authorization from {county} County for immediate safety work; full permits follow"
  },
  "electrical-burning-smell-investigation": {
    typicalTimeline: "Thermal imaging investigation typically completes in 1-2 hours",
    priceRange: "Comprehensive electrical investigation ranges from $200–$500 with thermal imaging",
    commonBrands: ["FLIR thermal cameras", "Fluke Ti series", "Klein Tools"],
    permitNote: "Investigation itself doesn't require a permit; any resulting repairs may require {county} County permits"
  },
  "electrical-fire-hazard-investigation": {
    typicalTimeline: "Full electrical fire hazard assessment typically requires 2-3 hours",
    priceRange: "Fire hazard investigation ranges from $250–$600 including thermal imaging and full report",
    commonBrands: ["FLIR thermal imaging", "Fluke insulation testers", "Megger"],
    permitNote: "Investigations may trigger mandatory {county} County reporting if imminent hazards are found"
  },
  "sparking-outlet-circuit-breaker-repair": {
    typicalTimeline: "Most sparking outlet repairs complete within 1-2 hours",
    priceRange: "Sparking outlet repair typically ranges from $175–$500 depending on root cause",
    commonBrands: ["Leviton", "Hubbell", "Pass & Seymour", "Eaton"],
    permitNote: "Simple outlet replacement may not require a permit; circuit modifications do require {county} County permits"
  },

  // Generators
  "home-standby-generator-installation": {
    typicalTimeline: "Standby generator installation typically requires 2-3 days including concrete pad and gas line",
    priceRange: "Complete standby generator installation ranges from $7,500–$18,000 for 16-26kW units",
    commonBrands: ["Generac Guardian", "Kohler", "Briggs & Stratton", "Cummins"],
    permitNote: "Requires {county} County electrical and building permits, gas line permit, and FPL coordination"
  },
  "portable-generator-hookup": {
    typicalTimeline: "Generator interlock or inlet box installation typically completes in 3-5 hours",
    priceRange: "Portable generator hookup installation ranges from $800–$2,000 including transfer mechanism",
    commonBrands: ["Generac", "Reliance Controls", "GenTran", "Interlock Technologies"],
    permitNote: "Requires {county} County electrical permit for transfer switch or interlock installation"
  },
  "automatic-transfer-switch-installation": {
    typicalTimeline: "Transfer switch installation typically requires 4-6 hours",
    priceRange: "Automatic transfer switch installation ranges from $1,500–$4,000 depending on amperage",
    commonBrands: ["Generac", "Kohler", "ASCO", "Eaton"],
    permitNote: "Requires {county} County electrical permit and FPL coordination for service connection"
  },
  "generator-maintenance-service": {
    typicalTimeline: "Annual maintenance service typically requires 1-2 hours on-site",
    priceRange: "Annual generator maintenance ranges from $250–$500 depending on unit size",
    commonBrands: ["Generac", "Kohler", "Briggs & Stratton", "Cummins"],
    permitNote: "Routine maintenance does not require permits; component replacements may trigger {county} County permits"
  },
  "generator-sizing-load-analysis": {
    typicalTimeline: "On-site load analysis typically requires 1-2 hours",
    priceRange: "Professional load analysis ranges from $150–$350, often credited toward installation",
    commonBrands: ["Generac", "Kohler", "Cummins", "Briggs & Stratton"],
    permitNote: "Load analysis is pre-installation; actual installation requires {county} County electrical and building permits"
  },
  "emergency-power-system-design": {
    typicalTimeline: "System design and engineering typically requires 1-3 weeks; installation 1-4 weeks",
    priceRange: "Emergency power system design and installation ranges from $10,000–$100,000+ for commercial facilities",
    commonBrands: ["Generac", "Kohler", "Caterpillar", "Eaton UPS"],
    permitNote: "Requires {county} County commercial permits, fire marshal review, and health department approval for medical facilities"
  },

  // Lighting
  "recessed-lighting-installation": {
    typicalTimeline: "4-6 recessed lights typically install in 3-5 hours; larger layouts may take a full day",
    priceRange: "Recessed lighting installation ranges from $150–$300 per light including housing and trim",
    commonBrands: ["Halo", "Lithonia", "WAC Lighting", "Juno"],
    permitNote: "New circuit installations require {county} County electrical permits; retrofit into existing circuits may not"
  },
  "indoor-outdoor-lighting-installation": {
    typicalTimeline: "Individual fixture installations typically complete in 1-2 hours; full-home projects 1-2 days",
    priceRange: "Light fixture installation ranges from $150–$500 per fixture depending on complexity",
    commonBrands: ["Kichler", "Progress Lighting", "Sea Gull", "Hinkley"],
    permitNote: "Simple fixture swaps may not require permits; new circuit work requires {county} County permits"
  },
  "landscape-outdoor-lighting": {
    typicalTimeline: "Landscape lighting projects typically require 1-3 days depending on scope",
    priceRange: "Professional landscape lighting ranges from $2,500–$8,000+ for full-property designs",
    commonBrands: ["FX Luminaire", "Kichler", "WAC Lighting", "Volt Lighting"],
    permitNote: "Low-voltage landscape lighting typically doesn't require permits; line-voltage outdoor fixtures do"
  },
  "led-lighting-retrofit-conversion": {
    typicalTimeline: "Whole-home LED conversions typically complete in 4-8 hours",
    priceRange: "LED retrofit typically ranges from $100–$250 per fixture; whole-home packages from $800–$2,500",
    commonBrands: ["Philips", "Cree", "Sylvania", "GE"],
    permitNote: "Direct LED bulb/tube replacements don't require permits; rewiring for new LED fixtures may require {county} County permits"
  },
  "commercial-led-lighting-retrofit": {
    typicalTimeline: "Commercial LED retrofits typically span 1-5 days depending on facility size",
    priceRange: "Commercial LED retrofit ranges from $3,000–$25,000+; FPL rebates can offset 30-50% of costs",
    commonBrands: ["Lithonia", "Philips/Signify", "RAB Lighting", "Cree"],
    permitNote: "May require {county} County commercial permit depending on scope; FPL rebate pre-approval recommended"
  },
  "smart-lighting-installation": {
    typicalTimeline: "Smart lighting setup typically completes in 2-4 hours for a standard room",
    priceRange: "Smart lighting installation ranges from $300–$1,500 per room depending on system complexity",
    commonBrands: ["Lutron Caséta", "Philips Hue", "Leviton Decora Smart", "TP-Link Kasa"],
    permitNote: "Smart switch installations typically don't require permits unless new wiring is run"
  },
  "motion-sensor-dimmer-installation": {
    typicalTimeline: "Motion sensor or dimmer switch installation typically completes in 30-60 minutes per switch",
    priceRange: "Motion sensor and dimmer installation ranges from $125–$300 per switch including device",
    commonBrands: ["Lutron Maestro", "Leviton", "Eaton", "Legrand"],
    permitNote: "Simple switch replacements typically don't require permits in {county} County"
  },
  "holiday-lighting-installation-removal": {
    typicalTimeline: "Residential holiday lighting installations typically complete in 4-8 hours",
    priceRange: "Professional holiday lighting services range from $500–$3,000+ depending on home size and design",
    commonBrands: ["C9 LED", "Mini LED strings", "Icicle lights", "Commercial-grade LED"],
    permitNote: "Holiday lighting installations typically don't require permits; permanent outdoor fixtures do"
  },
  "parking-lot-security-lighting": {
    typicalTimeline: "Parking lot lighting projects typically span 2-5 days",
    priceRange: "Parking lot LED lighting ranges from $5,000–$25,000+ depending on area size and pole count",
    commonBrands: ["Lithonia", "RAB Lighting", "Hubbell", "Eaton/Cooper"],
    permitNote: "Requires {county} County commercial electrical permit and may require site plan review"
  },
  "exit-emergency-lighting-systems": {
    typicalTimeline: "Exit sign and emergency lighting installations typically complete in 1-2 days",
    priceRange: "Exit and emergency lighting systems range from $200–$600 per unit installed",
    commonBrands: ["Lithonia", "Hubbell/Dual-Lite", "Sure-Lites", "Barron Lighting"],
    permitNote: "Requires {county} County commercial permit and fire marshal inspection for life safety systems"
  },

  // Outlets & Switches
  "gfci-outlet-installation-repair": {
    typicalTimeline: "GFCI outlet installations typically complete in 30-60 minutes per outlet",
    priceRange: "GFCI outlet installation ranges from $150–$300 per outlet including the device",
    commonBrands: ["Leviton", "Hubbell", "Pass & Seymour", "Eaton"],
    permitNote: "Required by Florida code in kitchens, bathrooms, garages, and outdoor locations"
  },
  "new-outlet-installation-repair": {
    typicalTimeline: "New outlet installation typically completes in 1-2 hours; repairs in under 1 hour",
    priceRange: "New outlet installation ranges from $175–$400 depending on wire run distance",
    commonBrands: ["Leviton", "Hubbell", "Pass & Seymour", "Legrand"],
    permitNote: "New outlet installations require {county} County electrical permits; direct replacements typically don't"
  },
  "outdoor-waterproof-outlet-installation": {
    typicalTimeline: "Outdoor outlet installation typically completes in 2-3 hours",
    priceRange: "Waterproof outdoor outlet installation ranges from $250–$500 including weatherproof cover",
    commonBrands: ["Hubbell", "Leviton", "TayMac/Hubbell", "Intermatic"],
    permitNote: "Requires {county} County electrical permit; must include GFCI protection per Florida code"
  },
  "240v-outlet-installation": {
    typicalTimeline: "240V outlet installation typically completes in 2-4 hours depending on wire run",
    priceRange: "240V outlet installation ranges from $400–$1,000 depending on distance from panel",
    commonBrands: ["Leviton", "Hubbell", "Cooper/Eaton", "Pass & Seymour"],
    permitNote: "Requires {county} County electrical permit for new 240V dedicated circuit"
  },
  "light-switch-installation-replacement": {
    typicalTimeline: "Switch replacement typically completes in 30-45 minutes per switch",
    priceRange: "Light switch replacement ranges from $100–$250 per switch including the device",
    commonBrands: ["Leviton Decora", "Lutron", "Legrand", "Eaton"],
    permitNote: "Simple switch replacements typically don't require permits in {county} County"
  },
  "commercial-gfci-safety-compliance": {
    typicalTimeline: "Commercial GFCI compliance audits and upgrades typically require 1-2 days",
    priceRange: "Commercial GFCI compliance ranges from $1,500–$5,000+ depending on number of circuits",
    commonBrands: ["Leviton", "Hubbell", "Eaton", "Square D"],
    permitNote: "May be required for OSHA compliance; {county} County commercial permit needed for new installations"
  },

  // Inspections & Safety
  "electrical-safety-inspection": {
    typicalTimeline: "Full home electrical inspection typically requires 2-3 hours",
    priceRange: "Comprehensive electrical inspection ranges from $250–$500 with detailed written report",
    commonBrands: ["Fluke testers", "FLIR thermal cameras", "Amprobe"],
    permitNote: "Inspections don't require permits; any corrective work identified may require {county} County permits"
  },
  "electrical-code-compliance-audit": {
    typicalTimeline: "Full code compliance audit typically requires 3-4 hours for residential",
    priceRange: "Code compliance audits range from $300–$600 with detailed violation report and remediation plan",
    commonBrands: ["Fluke", "FLIR", "Ideal Industries"],
    permitNote: "Audit is non-invasive; remediation work requires {county} County electrical permits per violation"
  },
  "electrical-code-compliance-violation-repairs": {
    typicalTimeline: "Violation repairs vary from 2 hours to several days depending on scope",
    priceRange: "Code violation repairs range from $200–$3,000+ per violation depending on severity",
    commonBrands: ["Square D", "Leviton", "Eaton", "various per violation"],
    permitNote: "All violation repairs require {county} County permits to close out open violations"
  },
  "permit-application-inspection-coordination": {
    typicalTimeline: "Permit processing typically takes 2-5 business days; full coordination spans project duration",
    priceRange: "Permit coordination services range from $200–$500 on top of actual permit fees",
    commonBrands: [],
    permitNote: "We handle all {county} County permit applications, fee payments, and inspection scheduling"
  },

  // Smart Home & Automation
  "smart-thermostat-installation": {
    typicalTimeline: "Smart thermostat installation typically completes in 1-2 hours",
    priceRange: "Smart thermostat installation ranges from $200–$450 including the device",
    commonBrands: ["Nest", "ecobee", "Honeywell T-Series", "Emerson Sensi"],
    permitNote: "Smart thermostat installations typically don't require permits unless HVAC wiring modifications are needed"
  },
  "smart-switch-home-automation": {
    typicalTimeline: "Smart switch installation typically completes in 30-60 minutes per switch; whole-home in 1-2 days",
    priceRange: "Smart switch installation ranges from $150–$350 per switch including device and configuration",
    commonBrands: ["Lutron Caséta", "Leviton Decora Smart", "TP-Link Kasa", "Inovelli"],
    permitNote: "Smart switch devices replace existing switches and typically don't require {county} County permits"
  },
  "ring-doorbell-security-camera-wiring": {
    typicalTimeline: "Doorbell and camera installations typically complete in 2-4 hours for up to 4 devices",
    priceRange: "Doorbell and camera wiring ranges from $200–$800 per device depending on wiring requirements",
    commonBrands: ["Ring", "Nest/Google", "Arlo", "Reolink"],
    permitNote: "Low voltage wiring installations typically don't require {county} County permits"
  },
  "home-theater-low-voltage-wiring": {
    typicalTimeline: "Home theater wiring typically requires 1-2 days for a complete room setup",
    priceRange: "Home theater wiring ranges from $1,000–$4,000 depending on speaker count and display setup",
    commonBrands: ["Belden cable", "Monoprice", "AudioQuest", "Legrand/On-Q"],
    permitNote: "Low voltage wiring typically doesn't require permits; new electrical circuits for equipment do"
  },
  "computer-network-outlet-installation": {
    typicalTimeline: "Network outlet installations typically complete in 1-2 hours per drop; whole-home in 1 day",
    priceRange: "Network cable installation ranges from $150–$350 per outlet drop including CAT6 cable",
    commonBrands: ["Belden CAT6/6A", "Leviton", "Legrand/On-Q", "Monoprice"],
    permitNote: "Low voltage data cabling typically doesn't require {county} County permits"
  },

  // Ceiling Fans & Fixtures
  "ceiling-fan-light-fixture-installation": {
    typicalTimeline: "Ceiling fan installation typically completes in 1-2 hours; chandeliers may require more time",
    priceRange: "Ceiling fan installation ranges from $200–$500; chandelier mounting from $300–$800",
    commonBrands: ["Hunter", "Minka Aire", "Casablanca", "Modern Forms"],
    permitNote: "Simple fixture swaps don't require permits; new junction boxes or circuits require {county} County permits"
  },

  // Surge Protection
  "whole-home-surge-protection": {
    typicalTimeline: "Whole-home surge protector installation typically completes in 1-2 hours",
    priceRange: "Whole-home surge protection ranges from $400–$900 installed at the main panel",
    commonBrands: ["Eaton", "Leviton", "Square D", "Siemens"],
    permitNote: "Panel-mounted surge protectors may require {county} County permits as panel modifications"
  },

  // Specialty Services
  "pool-spa-wiring-inspection": {
    typicalTimeline: "Pool electrical inspection typically requires 1-2 hours",
    priceRange: "Pool and spa electrical inspection ranges from $200–$400 with written safety report",
    commonBrands: ["Hayward", "Pentair", "Jandy", "Intermatic"],
    permitNote: "Pool electrical work is heavily regulated in Florida; all modifications require {county} County permits"
  },
  "hot-tub-spa-installation": {
    typicalTimeline: "Hot tub electrical hookup typically completes in 3-5 hours including dedicated circuit",
    priceRange: "Hot tub electrical installation ranges from $1,000–$2,500 depending on distance from panel",
    commonBrands: ["Jacuzzi", "Hot Spring", "Sundance", "Bullfrog Spas"],
    permitNote: "Requires {county} County electrical permit; must include GFCI protection and proper grounding per NEC"
  },
  "sauna-steam-room-electrical": {
    typicalTimeline: "Sauna electrical installation typically requires 4-6 hours including dedicated circuit",
    priceRange: "Sauna and steam room electrical ranges from $1,200–$3,500 depending on heater size",
    commonBrands: ["Harvia", "Finnleo", "Amerec", "ThermaSol"],
    permitNote: "Requires {county} County electrical permit; high-humidity installations have specific NEC requirements"
  },
  "dock-marina-electrical-services": {
    typicalTimeline: "Dock electrical installations typically require 2-5 days including marine-grade components",
    priceRange: "Dock electrical installation ranges from $3,000–$15,000+ depending on slip count and power needs",
    commonBrands: ["Eaton Marina Power", "Hubbell Marine", "Marinco", "Dock Edge"],
    permitNote: "Marine electrical work requires {county} County permits plus USCG and ABYC compliance"
  },
  "solar-panel-electrical-integration": {
    typicalTimeline: "Solar electrical integration typically requires 1-2 days for residential systems",
    priceRange: "Solar electrical integration ranges from $2,000–$5,000 for inverter, disconnect, and net metering",
    commonBrands: ["Enphase", "SolarEdge", "Tesla Powerwall", "SMA"],
    permitNote: "Requires {county} County electrical permit, FPL interconnection agreement, and net metering application"
  },

  // Wiring
  "electrical-wiring-updates-rewiring": {
    typicalTimeline: "Whole-home rewiring typically requires 3-7 days depending on house size and accessibility",
    priceRange: "Complete rewiring ranges from $8,000–$20,000+ for a standard 3-bedroom home",
    commonBrands: ["Southwire ROMEX", "Cerro Wire", "AFC Cable"],
    permitNote: "Requires {county} County master electrical permit with multiple inspections (rough-in and final)"
  },

  // Commercial
  "tenant-build-out-electrical-work": {
    typicalTimeline: "Tenant build-out electrical typically requires 1-4 weeks depending on space size",
    priceRange: "Tenant electrical build-outs range from $5,000–$30,000+ depending on square footage and requirements",
    commonBrands: ["Square D", "Eaton", "Lithonia", "Hubbell"],
    permitNote: "Requires {county} County commercial electrical permit and may require fire marshal approval"
  },
};

// ─── SEOCONTENT BODY EXPANSION DATA ───
// Expert-level content additions per service category to expand thin seoContent bodies.
// These are appended to existing content, not replacements.
const CATEGORY_EXPANSIONS = {
  "Electrical Panels & Power Systems": [
    "Our licensed electricians perform a complete load calculation before any panel work, ensuring your new panel meets current NEC requirements and has room for future expansion. We use copper bus bars, properly torqued connections, and AFCI/GFCI breakers where required by Florida Building Code.",
    "South Florida's heat and humidity accelerate corrosion inside electrical panels. We inspect for oxidized bus bars, loose connections, and thermal damage that compromise safety. Every panel we install includes proper weather sealing rated for coastal environments.",
    "Insurance companies increasingly require panel upgrades for policy renewals. Our electricians provide documented before-and-after reports that satisfy insurance requirements, and we coordinate directly with your insurer when needed.",
    "Modern electrical demands—EV chargers, home offices, pool equipment, smart home systems—require more capacity than panels installed even 15 years ago. We future-proof your installation with 20-30% additional capacity beyond your current needs."
  ],
  "Emergency Electrical Services": [
    "Every emergency call begins with a safety assessment. Our electricians use non-contact voltage testers, thermal imaging cameras, and circuit analyzers to identify the root cause—not just the symptom. We explain what we find in plain language before any work begins.",
    "South Florida's combination of aging infrastructure, lightning exposure, and high humidity creates unique emergency scenarios. Our electricians are trained to handle salt-air corrosion, water intrusion in panels, and surge damage from frequent thunderstorms.",
    "We stock our service vehicles with the most commonly needed parts—breakers, GFCI outlets, wire nuts, connectors, and diagnostic equipment—so most emergency repairs are completed in a single visit without waiting for parts.",
    "After every emergency repair, we provide a written safety assessment and recommend any additional work needed to prevent recurrence. We never upsell unnecessary services, and our upfront pricing means no surprises on your bill."
  ],
  "EV Charging & Solar": [
    "We evaluate your existing electrical panel capacity before any EV charger installation. If your panel can't support the additional 40-50 amp load, we'll recommend the most cost-effective upgrade path—whether that's a panel upgrade, load management device, or dedicated sub-panel.",
    "South Florida's year-round warm climate is ideal for electric vehicles, but the heat also demands properly rated charging equipment and wiring. We use only wiring and components rated for the elevated temperatures inside Florida garages and carports.",
    "We install all major EV charger brands and can advise on the best option for your vehicle. Whether you drive a Tesla, Ford, Rivian, or any other EV, we ensure your charging setup delivers maximum speed within your electrical capacity.",
    "Our installations include a dedicated circuit with proper wire sizing for the full length of the run, GFCI protection where required, and a weatherproof disconnect if the charger is outdoors. Every installation passes {county} County inspection the first time."
  ],
  "Outlets, Switches & Wiring": [
    "We use hospital-grade and commercial-grade outlets where durability matters. For homes with children, we install tamper-resistant receptacles as required by current NEC code. All outlets are properly grounded and tested before we leave.",
    "South Florida's salt air and humidity cause accelerated corrosion in outdoor and garage outlets. We use corrosion-resistant stainless steel or PVC covers and weather-rated outlets designed for coastal environments.",
    "Older South Florida homes often have ungrounded two-prong outlets, aluminum wiring connections, or backstabbed wires—all of which are fire hazards. Our electricians properly diagnose the condition and provide code-compliant solutions.",
    "We run new circuits using appropriately-sized copper wire with proper support and protection. Every connection is hand-tightened to manufacturer torque specifications—never backstabbed—ensuring reliable, long-lasting performance."
  ],
  "Lighting & Smart Home": [
    "We design lighting layouts that balance aesthetics, function, and energy efficiency. For recessed lighting, we calculate proper spacing and placement to eliminate shadows and dark spots while avoiding over-lighting that wastes energy.",
    "South Florida's intense sunlight creates specific indoor lighting challenges—high contrast between sun-drenched windows and interior spaces. We design lighting to complement natural light patterns, using dimmers and zones for all-day comfort.",
    "Modern LED lighting typically pays for itself within 1-2 years through energy savings. We calculate your specific ROI based on current fixtures, usage patterns, and FPL rates so you can make an informed decision.",
    "Smart lighting systems connect to your existing WiFi network and integrate with voice assistants like Alexa and Google Home. We configure scenes, schedules, and automations during installation so your system is ready to use immediately."
  ],
  "Commercial & Inspections": [
    "Commercial electrical inspections follow NFPA 70B maintenance standards and Florida Building Code requirements. Our detailed reports include photographs, code references, and prioritized remediation recommendations.",
    "We understand the urgency of commercial electrical issues—downtime means lost revenue. Our commercial team schedules work during off-hours and weekends to minimize business disruption, and we maintain fully-stocked vehicles for faster completions.",
    "Code compliance isn't just about passing inspections—it's about protecting your business from liability. We document all findings and provide certificates of compliance that satisfy insurance underwriters and commercial lease requirements.",
    "For commercial properties, we coordinate with property managers, general contractors, and municipal building departments to ensure smooth permitting and inspection processes. Our familiarity with {county} County procedures saves you time and prevents delays."
  ]
};

// ─── DESCRIPTION ENRICHMENT per service ───
// Problem-opener → existing description → trust-close pattern
const DESCRIPTION_ENRICHMENTS = {
  // Panels
  "electrical-panel-upgrade-100a-to-200a": {
    opener: "Is your 100-amp panel struggling to keep up with modern electrical demands? Tripping breakers, dimming lights, and an inability to add new circuits are clear signs you've outgrown your panel.",
    closer: "Licensed FL electricians serving {cityName} with code-compliant upgrades, FPL coordination, and same-day permits."
  },
  "panel-repair-circuit-breaker-replacement": {
    opener: "A breaker that keeps tripping isn't just annoying—it's telling you something. Faulty breakers, warm panels, and circuits that won't stay on point to problems that worsen over time.",
    closer: "Licensed FL electricians with parts in-stock for same-visit repairs throughout {cityName} and {county} County."
  },
  "service-panel-replacement": {
    opener: "Outdated or damaged panels don't just limit your home's electrical capacity—they create genuine fire and safety risks that grow more serious each year.",
    closer: "Licensed FL electricians providing complete panel replacements with FPL coordination and {county} County permits."
  },
  // Emergency
  "24-7-emergency-electrical-service": {
    opener: "Electrical emergencies don't wait for business hours. Sparking outlets, burning smells, total power loss, and exposed wiring demand immediate professional response to protect your family and property.",
    closer: "Licensed FL electricians with 60-minute response times across {cityName} and all of {county} County."
  },
  "power-outage-emergency-response": {
    opener: "When your power goes out and your neighbors' stays on, the problem is on your side—and it needs professional diagnosis, not guesswork.",
    closer: "Licensed FL electricians with fully-stocked trucks for same-visit power restoration in {cityName}."
  },
  "storm-damage-electrical-repair": {
    opener: "After a hurricane or severe storm, damaged electrical systems pose immediate dangers: downed lines, water-compromised panels, and surge-damaged circuits that may not show visible signs of failure.",
    closer: "Licensed FL electricians providing emergency storm response across {cityName} and {county} County."
  },
  // EV
  "level-2-ev-charger-installation": {
    opener: "Still charging your EV from a standard 120V outlet? At 4-5 miles of range per hour, Level 1 charging can't keep up with daily driving. Level 2 charging delivers 25-30 miles per hour.",
    closer: "Licensed FL electricians installing all major EV charger brands throughout {cityName}."
  },
  "home-ev-charging-system-setup": {
    opener: "Setting up home EV charging involves more than plugging in a box. Your panel capacity, wire gauge, circuit protection, and charger placement all need to be right for safe, fast, reliable charging.",
    closer: "Licensed FL electricians providing complete EV charging solutions for {cityName} homeowners."
  },
  "electric-vehicle-outlet-installation": {
    opener: "Need a dedicated 240V outlet for your EV's mobile charger? The right outlet type, wire gauge, and circuit protection make the difference between safe daily charging and a potential hazard.",
    closer: "Licensed FL electricians installing NEMA 14-50 and 6-50 outlets throughout {cityName}."
  },
  // Lighting
  "recessed-lighting-installation": {
    opener: "Tired of dark corners, dated flush-mount fixtures, and rooms that feel smaller than they are? Recessed lighting transforms your space with clean, modern illumination that sits flush with the ceiling.",
    closer: "Licensed FL electricians serving {cityName} with code-compliant installation, proper load calculations, and dimmer integration."
  },
  "landscape-outdoor-lighting": {
    opener: "Your home's curb appeal doesn't have to disappear at sunset. Professional landscape lighting extends your living space, deters intruders, and showcases the property you've invested in.",
    closer: "Licensed FL electricians designing and installing landscape lighting systems throughout {cityName}."
  },
  "led-lighting-retrofit-conversion": {
    opener: "Still running fluorescent tubes, halogen bulbs, or outdated incandescent fixtures? LED retrofits cut lighting energy costs by 50-75% while delivering better light quality and lasting 15-25 times longer.",
    closer: "Licensed FL electricians converting {cityName} homes and businesses to energy-efficient LED technology."
  },
  // Smart Home
  "smart-thermostat-installation": {
    opener: "Manual thermostats waste energy when you're away and make you uncomfortable when you're home. Smart thermostats learn your schedule, adjust automatically, and save the average household 10-15% on HVAC costs.",
    closer: "Licensed FL electricians installing and configuring smart thermostats throughout {cityName}."
  },
  // Generators
  "home-standby-generator-installation": {
    opener: "South Florida's hurricane season brings extended power outages that can last days or even weeks. A standby generator starts automatically within seconds of a power failure, keeping your AC, refrigerator, medical equipment, and security system running.",
    closer: "Licensed FL electricians installing Generac, Kohler, and Cummins generators throughout {cityName}."
  },
  "generator-maintenance-service": {
    opener: "A generator that hasn't been maintained is a generator that may not start when you need it most. Annual service catches worn spark plugs, degraded oil, corroded batteries, and failed transfer switches before hurricane season.",
    closer: "Licensed FL electricians providing annual generator maintenance throughout {cityName} and {county} County."
  },
  // Safety
  "electrical-safety-inspection": {
    opener: "You can't see hidden hazards behind your walls—but a professional electrical inspection can. Thermal imaging reveals overheated connections, and comprehensive testing exposes code violations that put your family at risk.",
    closer: "Licensed FL electricians providing thorough inspections with detailed reports throughout {cityName}."
  },
  "gfci-outlet-installation-repair": {
    opener: "GFCI outlets save lives by cutting power in milliseconds when they detect a ground fault—preventing electrocution in kitchens, bathrooms, garages, and outdoor areas where water is present.",
    closer: "Licensed FL electricians installing and repairing GFCI outlets throughout {cityName} per current Florida code."
  },
  "whole-home-surge-protection": {
    opener: "South Florida leads the nation in lightning strikes, and each one can send thousands of volts through your wiring. Power strip surge protectors can't handle this—you need panel-level protection.",
    closer: "Licensed FL electricians installing whole-home surge protection at the panel level throughout {cityName}."
  },
  // Wiring
  "electrical-wiring-updates-rewiring": {
    opener: "Homes built before 1975 often have aluminum wiring, cloth-insulated cables, or undersized circuits that struggle with modern electrical loads and pose genuine fire risks.",
    closer: "Licensed FL electricians providing complete rewiring services throughout {cityName} with multi-stage inspections."
  },
  // Specialty
  "pool-spa-wiring-inspection": {
    opener: "Pool and spa electrical systems operate in a high-risk environment where water and electricity intersect. Corroded bonding wires, failed GFCI protection, and improper grounding can create invisible shock hazards.",
    closer: "Licensed FL electricians providing thorough pool electrical inspections throughout {cityName}."
  },
  "hot-tub-spa-installation": {
    opener: "Hot tub electrical installation requires a dedicated 240V circuit, proper GFCI protection, and a disconnect switch within sight of the unit—all per NEC code. Getting this wrong isn't just a code problem; it's a safety problem.",
    closer: "Licensed FL electricians providing hot tub electrical hookups throughout {cityName} with full permit coordination."
  },
};

// ─── Utility ───
function readJson(filepath) {
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

function writeJson(filepath, data) {
  writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ─── SEO CONTENT EXPANSION LOGIC ───
function expandSeoContentBodies(service, slug) {
  const seoContent = service.seoContent;
  if (!seoContent || seoContent.length === 0) return seoContent;

  const category = service.category || "Outlets, Switches & Wiring";
  const expansions = CATEGORY_EXPANSIONS[category] || CATEGORY_EXPANSIONS["Outlets, Switches & Wiring"];

  return seoContent.map((block, i) => {
    const currentWords = block.body.split(/\s+/).length;

    // Only expand if under 70 words
    if (currentWords >= 70) return block;

    // Select an expansion paragraph based on block index
    const expansion = expansions[i % expansions.length];

    return {
      heading: block.heading,
      body: block.body.trim() + ' ' + expansion
    };
  });
}

// ─── DESCRIPTION ENRICHMENT LOGIC ───
function enrichDescription(service, slug) {
  const enrichment = DESCRIPTION_ENRICHMENTS[slug];
  if (!enrichment) return service.description;

  const currentWords = service.description.split(/\s+/).length;
  // Only enrich if description is under 70 words
  if (currentWords >= 70) return service.description;

  // Prepend the problem opener, keep original, append trust closer
  return `${enrichment.opener} ${service.description} ${enrichment.closer}`;
}

// ─── Main Processing ───
function processServices() {
  const files = readdirSync(SERVICES_DIR).filter(f => f.endsWith('.json'));
  let updated = 0;
  let seoExpandCount = 0;
  let descEnrichCount = 0;
  let signalsCount = 0;

  console.log(`\n🔧 Processing ${files.length} service JSON files...\n`);

  for (const file of files) {
    const filepath = join(SERVICES_DIR, file);
    const service = readJson(filepath);
    const slug = service.slug || basename(file, '.json');
    const original = JSON.stringify(service);

    // 1. Expand seoContent bodies
    const expandedSeo = expandSeoContentBodies(service, slug);
    if (JSON.stringify(expandedSeo) !== JSON.stringify(service.seoContent)) {
      service.seoContent = expandedSeo;
      seoExpandCount++;
    }

    // 2. Enrich description
    const enrichedDesc = enrichDescription(service, slug);
    if (enrichedDesc !== service.description) {
      service.description = enrichedDesc;
      descEnrichCount++;
    }

    // 3. Add localSignals
    if (!service.localSignals && LOCAL_SIGNALS[slug]) {
      service.localSignals = LOCAL_SIGNALS[slug];
      signalsCount++;
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

  console.log(`\n📊 Services: ${updated}/${files.length} files updated${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log(`   seoContent expanded: ${seoExpandCount}`);
  console.log(`   Descriptions enriched: ${descEnrichCount}`);
  console.log(`   Local signals added: ${signalsCount}\n`);
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

    // Expand seoContent bodies using generic category expansions
    if (city.seoContent) {
      const expansions = CATEGORY_EXPANSIONS["Electrical Panels & Power Systems"];
      city.seoContent = city.seoContent.map((block, i) => {
        const currentWords = block.body.split(/\s+/).length;
        if (currentWords >= 70) return block;

        // City-specific expansions about local service coverage
        const cityExpansions = [
          `Our electricians are dispatched from strategic locations across ${city.county || 'South Florida'} County, often arriving within 60 minutes. We maintain full parts inventory on every truck, so most repairs and installations are completed in a single visit.`,
          `Every project in ${city.name} is handled by W-2 employees—never subcontractors. Our electricians are drug-tested, background-checked, and carry our $2M liability insurance. We treat your home with the same care and respect we'd want in our own.`,
          `${city.name} properties face unique electrical challenges from South Florida's heat, humidity, and storm exposure. We use marine-grade hardware, UV-resistant conduit, and corrosion-resistant components that last in this environment.`,
          `From routine outlet installations to complex rewiring projects, we handle all aspects of residential and commercial electrical work in ${city.name}. Every job includes upfront pricing, clean worksite practices, and a satisfaction guarantee.`
        ];

        return {
          heading: block.heading,
          body: block.body.trim() + ' ' + cityExpansions[i % cityExpansions.length]
        };
      });
    }

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
console.log('  Phase 2: Deep Content Expansion');
console.log(`  Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
console.log('═══════════════════════════════════════════');

const svcCount = processServices();
const cityCount = processCities();

console.log('═══════════════════════════════════════════');
console.log(`  Total: ${svcCount + cityCount} files enhanced`);
console.log('═══════════════════════════════════════════\n');
