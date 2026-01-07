#!/usr/bin/env node

/**
 * Service Area Content Enrichment Script
 * Adds FAQs and SEO content to thin service area pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_AREAS_DIR = path.join(__dirname, '../src/content/service-areas');

// Pages that need enrichment (97-99 lines, only 2 FAQs)
const THIN_PAGES = [
    'deerfield-beach.json',
    'lauderhill.json',
    'margate.json',
    'sunrise.json',
    'tamarac.json',
    'boynton-beach.json',
    'hialeah.json',
    'homestead.json',
    'miramar.json',
    'pompano-beach.json',
    'weston.json',
    'boca-raton.json',
    'davie.json',
    'delray-beach.json',
    'jupiter.json',
    'plantation.json',
    'wellington.json',
    'west-palm-beach.json',
    'coral-springs.json',
    'hollywood.json',
    'pembroke-pines.json',
    'fort-lauderdale.json',
    'miami-beach.json',
    'miami.json',
    'north-miami.json'
];

function generateAdditionalFAQs(cityName, county, neighborhoods) {
    return [
        {
            question: `What electrical services do you offer in ${cityName}?`,
            answer: `We provide comprehensive electrical services throughout ${cityName} including panel upgrades (100A to 200A), emergency repairs, outlet and switch installation, lighting upgrades, ceiling fan installation, GFCI protection, EV charger installation, generator hookups, and 24/7 emergency service. Our licensed electricians serve all ${cityName} neighborhoods.`
        },
        {
            question: `Are your electricians licensed to work in ${cityName}?`,
            answer: `Absolutely. All Solomon Electric technicians are Florida State Licensed (License #EC13012419) and fully insured. We pull all required ${county} County permits for electrical work in ${cityName}, ensuring your project passes inspection and meets current NEC code requirements.`
        },
        {
            question: `How do I know if my ${cityName} home needs a panel upgrade?`,
            answer: `Many ${cityName} homes have outdated 100-amp panels that can't handle modern electrical demands. Signs you need an upgrade include: frequently tripping breakers, dimming lights when appliances run, planning to add an EV charger or pool, or if you have a Federal Pacific, Zinsco, or fuse box. We offer free panel inspections throughout ${cityName}.`
        },
        {
            question: `Do you offer 24/7 emergency electrical service in ${cityName}?`,
            answer: `Yes! We provide round-the-clock emergency electrical service to all ${cityName} neighborhoods. If you're experiencing sparking outlets, burning smells, power outages, or any electrical emergency, call us immediately—we respond quickly to protect your property and family.`
        }
    ];
}

function generateAdditionalSEO(cityName, county, tagline, neighborhoods) {
    return [
        {
            heading: `Understanding ${cityName}'s Electrical Needs`,
            body: `${cityName} homes and businesses have unique electrical requirements that demand local expertise. Our electricians understand ${county} County building codes, climate considerations, and the specific challenges of South Florida electrical systems. From aging infrastructure in established neighborhoods to modern smart home installations, we provide solutions tailored to ${cityName}'s needs.`
        },
        {
            heading: `Comprehensive Electrical Services for Your ${cityName} Home`,
            body: `Whether you're upgrading an older home's electrical system, installing modern energy-efficient lighting, adding an EV charger, or facing an urgent electrical issue, our licensed team delivers professional solutions throughout ${cityName}. We provide transparent upfront pricing, respect your property, and stand behind our work with guarantees that have earned South Florida's trust for over 15 years.`
        }
    ];
}

function enrichServiceArea(filename) {
    const filePath = path.join(SERVICE_AREAS_DIR, filename);
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Check if already enriched
        if (data.faqs && data.faqs.length >= 6) {
            console.log(`✓ ${data.name} already enriched (${data.faqs.length} FAQs)`);
            return;
        }
        
        console.log(`Enriching ${data.name}...`);
        
        // Generate additional content
        const additionalFAQs = generateAdditionalFAQs(
            data.name,
            data.county,
            data.neighborhoods
        );
        
        const additionalSEO = generateAdditionalSEO(
            data.name,
            data.county,
            data.tagline,
            data.neighborhoods
        );
        
        // Add new FAQs (insert before existing ones to maintain quality order)
        data.faqs = [...additionalFAQs, ...data.faqs];
        
        // Add new SEO content (insert in middle for better flow)
        if (data.seoContent && data.seoContent.length >= 2) {
            data.seoContent = [
                data.seoContent[0],
                ...additionalSEO,
                data.seoContent[1]
            ];
        }
        
        // Write back
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf8');
        
        console.log(`✅ ${data.name}: ${data.faqs.length} FAQs, ${data.seoContent.length} SEO blocks`);
        
    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
    }
}

// Main execution
console.log('🚀 Starting service area content enrichment...\n');

THIN_PAGES.forEach(enrichServiceArea);

console.log('\n✨ Content enrichment complete!');
