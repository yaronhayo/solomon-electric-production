/**
 * ========================================
 * CENTRAL IMAGE REGISTRY
 * ========================================
 * 
 * Single source of truth for all website images.
 * Update imports here to change images across the entire site.
 * 
 * USAGE:
 * import { IMAGES } from '@/config/images';
 * <Image src={IMAGES.branding.logo} alt="Solomon Electric" />
 * 
 * FUTURE CMS INTEGRATION:
 * This file structure is designed to be easily replaced by
 * a database/CMS query while maintaining type safety.
 */

// ==========================================
// BRANDING & TRUST BADGES
// ==========================================
import logo from '../assets/images/logo.png';
import logoWhite from '../assets/images/logo-white.webp';
import logoNew from '../assets/images/logo-new.webp';
import badgeSatisfaction from '../assets/images/badge-satisfaction.webp';
import badgeAngi from '../assets/images/badge-angi.webp';
import badgeYelp from '../assets/images/badge-yelp.webp';
import badgeBBB from '../assets/images/badge-bbb.webp';
import badgeGuarantee from '../assets/images/badge-guarantee.webp';

// ==========================================
// PAGE HERO BACKGROUNDS
// ==========================================
import heroHomepage from '../assets/images/heroes/homepage.webp';
import heroAbout from '../assets/images/heroes/about.webp';
import heroContact from '../assets/images/heroes/contact.webp';
import heroServices from '../assets/images/heroes/services.webp';
import heroServiceAreas from '../assets/images/heroes/service-areas.webp';
import heroBlog from '../assets/images/heroes/blog.webp';
import heroReviews from '../assets/images/heroes/reviews.webp';
import heroFaq from '../assets/images/heroes/faq.webp';
import heroBook from '../assets/images/heroes/book.webp';

// ==========================================
// SERVICE CATEGORIES (Homepage/Services Index)
// ==========================================
import categoryEmergency from '../assets/images/categories/emergency.webp';
import categoryPanelUpgrade from '../assets/images/categories/panel-upgrade.webp';
import categoryEvCharging from '../assets/images/categories/ev-charging.webp';
import categoryLighting from '../assets/images/categories/lighting.webp';
import categoryWiring from '../assets/images/categories/wiring.webp';
import categoryGenerators from '../assets/images/categories/generators.webp';
import categorySmartHome from '../assets/images/categories/smart-home.webp';
import categoryCommercial from '../assets/images/categories/commercial.webp';
import categoryInspection from '../assets/images/categories/inspection.webp';

// ==========================================
// SITE ENHANCEMENTS (About, Story sections)
// ==========================================
import enhDispatcher from '../assets/images/enhancements/dispatcher.webp';
import enhTrustBg from '../assets/images/enhancements/trust-bg.webp';
import enhCustomerInteraction from '../assets/images/enhancements/customer-interaction.webp';

// ==========================================
// BLOG POST FEATURED IMAGES
// ==========================================
import blogElectricalSafety from '../assets/images/blog/electrical-safety-inspection.webp';
import blogKitchenWiring from '../assets/images/blog/kitchen-wiring.webp';
import blogArchitecturalLighting from '../assets/images/blog/architectural-lighting.webp';
import blogEvCharger from '../assets/images/blog/ev-charger-install.webp';
import blogUndergroundWiring from '../assets/images/blog/underground-wiring.webp';
import blogLightingFixture from '../assets/images/blog/lighting-fixture.webp';
import blogHistoricHome from '../assets/images/blog/historic-home-wiring.webp';
import blogMaintenance from '../assets/images/blog/electrical-maintenance.webp';
import blogInstallation from '../assets/images/blog/electrical-installation.webp';
import blogCeilingFan from '../assets/images/blog/ceiling-fan.webp';
import blogHurricanePrep from '../assets/images/blog/hurricane-prep-miami.webp';
import blogPanelRepair from '../assets/images/blog/panel-repair.webp';
import blogSmokeDetector from '../assets/images/blog/smoke-detector.webp';
import blogPanelUpgrade from '../assets/images/blog/panel-upgrade.webp';
import blogSecurityLighting from '../assets/images/blog/security-lighting.webp';
import blogDiagnostics from '../assets/images/blog/electrical-diagnostics.webp';
import blogOutletSwitch from '../assets/images/blog/outlet-switch.webp';
import blogMiamiCondo from '../assets/images/blog/miami-condo-renovation.webp';

// ==========================================
// SERVICE PAGE IMAGES
// ==========================================
import svcCommercial from '../assets/images/services/commercial.webp';
import svcEmergency from '../assets/images/services/emergency.webp';
import svcEvCharging from '../assets/images/services/ev-charging.webp';
import svcLighting from '../assets/images/services/lighting.webp';
import svcWiring from '../assets/images/services/wiring.webp';
import svcPanelWork from '../assets/images/services/panel-work.webp';

// ==========================================
// EXPORT: Central Image Registry
// ==========================================
export const IMAGES = {
    // Branding
    branding: {
        logo: {
            src: logo,
            alt: "Solomon Electric - Primary Logo"
        },
        logoWhite: {
            src: logoWhite,
            alt: "Solomon Electric - White Logo"
        },
        logoNew: {
            src: logoNew,
            alt: `Solomon Electric - Licensed Miami Electricians Since 2008`
        },
        /** URL for email templates */
        logoUrl: '/logo.webp',
    },

    // Trust Badges
    badges: {
        satisfaction: {
            src: badgeSatisfaction,
            alt: "100% Satisfaction Guaranteed Badge"
        },
        angi: {
            src: badgeAngi,
            alt: "Angi Super Service Award Badge"
        },
        yelp: {
            src: badgeYelp,
            alt: "Top Rated on Yelp Badge"
        },
        bbb: {
            src: badgeBBB,
            alt: "BBB Accredited Business A+ Rating"
        },
        guarantee: {
            src: badgeGuarantee,
            alt: "Licensed and Insured Electrical Contractor"
        },
    },

    // Page Heroes
    heroes: {
        homepage: {
            src: heroHomepage,
            alt: "Professional electrician team ready for service in Miami"
        },
        about: {
            src: heroAbout,
            alt: "Our experienced electrical contractors team in uniform"
        },
        contact: {
            src: heroContact,
            alt: "Ready to answer your electrical service calls in South Florida"
        },
        services: {
            src: heroServices,
            alt: "Wide range of residential and commercial electrical solutions"
        },
        serviceAreas: {
            src: heroServiceAreas,
            alt: "Serving Miami-Dade, Broward, and Palm Beach counties"
        },
        blog: {
            src: heroBlog,
            alt: "Electrical safety tips and regional service updates"
        },
        reviews: {
            src: heroReviews,
            alt: "Highly rated electrical services by South Florida homeowners"
        },
        faq: {
            src: heroFaq,
            alt: "Expert answers to common electrical questions"
        },
        book: {
            src: heroBook,
            alt: "Schedule your electrical inspection or repair online"
        },
    },

    // Service Categories
    categories: {
        emergency: {
            src: categoryEmergency,
            alt: "24/7 Rapid Response Emergency Electrical Repairs"
        },
        panelUpgrade: {
            src: categoryPanelUpgrade,
            alt: "Main Electrical Panel Modernization (100A to 200A)"
        },
        evCharging: {
            src: categoryEvCharging,
            alt: "Level 2 and Level 3 EV Charger Installation"
        },
        lighting: {
            src: categoryLighting,
            alt: "Modern Interior and Exterior LED Lighting Solutions"
        },
        wiring: {
            src: categoryWiring,
            alt: "Safe Residential and Commercial Electrical Rewiring"
        },
        generators: {
            src: categoryGenerators,
            alt: "Automatic Home Backup Generator Systems"
        },
        smartHome: {
            src: categorySmartHome,
            alt: "Intelligent Home Automation and Smart Device Setup"
        },
        commercial: {
            src: categoryCommercial,
            alt: "Professional Commercial and Industrial Power Solutions"
        },
        inspection: {
            src: categoryInspection,
            alt: "Comprehensive Electrical Safety and Compliance Inspections"
        },
    },

    // Site Enhancements
    site: {
        dispatcher: {
            src: enhDispatcher,
            alt: "Our professional dispatch team coordinating service calls"
        },
        trustBg: {
            src: enhTrustBg,
            alt: "Close-up of a high-quality electrical installation"
        },
        customerInteraction: {
            src: enhCustomerInteraction,
            alt: "Electrician explaining service options to a satisfied client"
        },
    },

    // Blog Post Images
    blog: {
        electricalSafety: { src: blogElectricalSafety, alt: "Home electrical safety inspection checklist" },
        kitchenWiring: { src: blogKitchenWiring, alt: "Modern kitchen GFCI and appliance wiring" },
        architecturalLighting: { src: blogArchitecturalLighting, alt: "Stunning outdoor architectural lighting at night" },
        evCharger: { src: blogEvCharger, alt: "Wall-mounted Level 2 EV charging station installation" },
        undergroundWiring: { src: blogUndergroundWiring, alt: "Safe installation of underground electrical conduits" },
        lightingFixture: { src: blogLightingFixture, alt: "Installation of custom designer lighting fixtures" },
        historicHome: { src: blogHistoricHome, alt: "Rewiring solutions for historic Florida properties" },
        maintenance: { src: blogMaintenance, alt: "Preventative electrical system maintenance service" },
        installation: { src: blogInstallation, alt: "New construction electrical system installation" },
        ceilingFan: { src: blogCeilingFan, alt: "Fast and safe ceiling fan mounting and wiring" },
        hurricanePrep: { src: blogHurricanePrep, alt: "Electrical surge protection for hurricane preparation" },
        panelRepair: { src: blogPanelRepair, alt: "Expert circuit breaker and panel repair service" },
        smokeDetector: { src: blogSmokeDetector, alt: "Proper smoke and CO detector placement and wiring" },
        panelUpgrade: { src: blogPanelUpgrade, alt: "Complete service panel upgrade to 200 amps" },
        securityLighting: { src: blogSecurityLighting, alt: "Motion-activated security floodlight installation" },
        diagnostics: { src: blogDiagnostics, alt: "Advanced electrical troubleshooting and diagnostics" },
        outletSwitch: { src: blogOutletSwitch, alt: "New electrical outlet and dimmer switch installation" },
        miamiCondo: { src: blogMiamiCondo, alt: "Electrical renovation for Miami luxury condominiums" },
    },

    // Service Page Images (Direct Service Imports)
    services: {
        commercial: { src: svcCommercial, alt: "Professional commercial electrical infrastructure" },
        emergency: { src: svcEmergency, alt: "24/7 emergency electrical repairs by licensed electricians" },
        evCharging: { src: svcEvCharging, alt: "Certified Level 2 home EV charger installation" },
        lighting: { src: svcLighting, alt: "Energy-efficient LED lighting retrofit and design" },
        wiring: { src: svcWiring, alt: "Whole-home electrical rewiring for safety and code" },
        panelWork: { src: svcPanelWork, alt: "Professional main service panel modernization" },
    },

    // Static URLs (for email templates, external references)
    static: {
        logo: '/logo.webp',
        ogDefault: '/og-default.webp',
        favicon: '/favicon.png',
    },
} as const;

// ==========================================
// TYPE EXPORTS (for future CMS)
// ==========================================
export type ImageObject = { src: ImageMetadata; alt: string };
export type ImageCategory = keyof typeof IMAGES;
export type BrandingImage = keyof typeof IMAGES.branding;
export type HeroImage = keyof typeof IMAGES.heroes;
export type CategoryImage = keyof typeof IMAGES.categories;
export type BlogImage = keyof typeof IMAGES.blog;
export type ServiceImage = keyof typeof IMAGES.services;
