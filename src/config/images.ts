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
import logoWhite from '../assets/images/logo-white.png';
import logoNew from '../assets/images/logo-new.webp';
import badgeSatisfaction from '../assets/images/badge-satisfaction.png';
import badgeAngi from '../assets/images/badge-angi.png';
import badgeYelp from '../assets/images/badge-yelp.png';
import badgeBBB from '../assets/images/badge-bbb.png';
import badgeGuarantee from '../assets/images/badge-guarantee.png';

// ==========================================
// PAGE HERO BACKGROUNDS
// ==========================================
import heroHomepage from '../assets/images/heroes/homepage.png';
import heroAbout from '../assets/images/heroes/about.png';
import heroContact from '../assets/images/heroes/contact.png';
import heroServices from '../assets/images/heroes/services.png';
import heroServiceAreas from '../assets/images/heroes/service-areas.png';
import heroBlog from '../assets/images/heroes/blog.png';
import heroReviews from '../assets/images/heroes/reviews.png';
import heroFaq from '../assets/images/heroes/faq.png';
import heroBook from '../assets/images/heroes/book.png';

// ==========================================
// SERVICE CATEGORIES (Homepage/Services Index)
// ==========================================
import categoryEmergency from '../assets/images/categories/emergency.png';
import categoryPanelUpgrade from '../assets/images/categories/panel-upgrade.png';
import categoryEvCharging from '../assets/images/categories/ev-charging.png';
import categoryLighting from '../assets/images/categories/lighting.png';
import categoryWiring from '../assets/images/categories/wiring.png';
import categoryGenerators from '../assets/images/categories/generators.png';
import categorySmartHome from '../assets/images/categories/smart-home.png';
import categoryCommercial from '../assets/images/categories/commercial.png';
import categoryInspection from '../assets/images/categories/inspection.png';
import categoryOutdoor from '../assets/images/categories/outdoor.png';

// ==========================================
// SITE ENHANCEMENTS (About, Story sections)
// ==========================================
import enhDispatcher from '../assets/images/enhancements/dispatcher.png';
import enhTrustBg from '../assets/images/enhancements/trust-bg.png';
import enhCustomerInteraction from '../assets/images/enhancements/customer-interaction.png';
import heroTeam from '../assets/images/hero-team.png';
import heroTruck from '../assets/images/hero-truck.png';
import servicePanel from '../assets/images/service-panel.png';

// ==========================================
// BLOG POST FEATURED IMAGES
// ==========================================
import blogElectricalSafety from '../assets/images/blog/electrical-safety-inspection.png';
import blogKitchenWiring from '../assets/images/blog/kitchen-wiring.png';
import blogArchitecturalLighting from '../assets/images/blog/architectural-lighting.png';
import blogEvCharger from '../assets/images/blog/ev-charger-install.png';
import blogUndergroundWiring from '../assets/images/blog/underground-wiring.png';
import blogLightingFixture from '../assets/images/blog/lighting-fixture.png';
import blogHistoricHome from '../assets/images/blog/historic-home-wiring.png';
import blogMaintenance from '../assets/images/blog/electrical-maintenance.png';
import blogInstallation from '../assets/images/blog/electrical-installation.png';
import blogCeilingFan from '../assets/images/blog/ceiling-fan.png';
import blogHurricanePrep from '../assets/images/blog/hurricane-prep-miami.png';
import blogPanelRepair from '../assets/images/blog/panel-repair.png';
import blogSmokeDetector from '../assets/images/blog/smoke-detector.png';
import blogPanelUpgrade from '../assets/images/blog/panel-upgrade.png';
import blogSecurityLighting from '../assets/images/blog/security-lighting.png';
import blogDiagnostics from '../assets/images/blog/electrical-diagnostics.png';
import blogOutletSwitch from '../assets/images/blog/outlet-switch.png';
import blogMiamiCondo from '../assets/images/blog/miami-condo-renovation.png';

// ==========================================
// SERVICE PAGE IMAGES
// ==========================================
import svcCommercial from '../assets/images/services/commercial.png';
import svcEmergency from '../assets/images/services/emergency.png';
import svcEvCharging from '../assets/images/services/ev-charging.png';
import svcLighting from '../assets/images/services/lighting.png';
import svcWiring from '../assets/images/services/wiring.png';
import svcPanelWork from '../assets/images/services/panel-work.png';

// ==========================================
// EXPORT: Central Image Registry
// ==========================================
export const IMAGES = {
    // Branding
    branding: {
        logo,
        logoWhite,
        logoNew,
        /** URL for email templates (must match public/logo.png) */
        logoUrl: '/logo.png',
    },

    // Trust Badges
    badges: {
        satisfaction: badgeSatisfaction,
        angi: badgeAngi,
        yelp: badgeYelp,
        bbb: badgeBBB,
        guarantee: badgeGuarantee,
    },

    // Page Heroes
    heroes: {
        homepage: heroHomepage,
        about: heroAbout,
        contact: heroContact,
        services: heroServices,
        serviceAreas: heroServiceAreas,
        blog: heroBlog,
        reviews: heroReviews,
        faq: heroFaq,
        book: heroBook,
    },

    // Service Categories
    categories: {
        emergency: categoryEmergency,
        panelUpgrade: categoryPanelUpgrade,
        evCharging: categoryEvCharging,
        lighting: categoryLighting,
        wiring: categoryWiring,
        generators: categoryGenerators,
        smartHome: categorySmartHome,
        commercial: categoryCommercial,
        inspection: categoryInspection,
        outdoor: categoryOutdoor,
    },

    // Site Enhancements
    site: {
        dispatcher: enhDispatcher,
        trustBg: enhTrustBg,
        customerInteraction: enhCustomerInteraction,
        heroTeam,
        heroTruck,
        servicePanel,
    },

    // Blog Post Images
    blog: {
        electricalSafety: blogElectricalSafety,
        kitchenWiring: blogKitchenWiring,
        architecturalLighting: blogArchitecturalLighting,
        evCharger: blogEvCharger,
        undergroundWiring: blogUndergroundWiring,
        lightingFixture: blogLightingFixture,
        historicHome: blogHistoricHome,
        maintenance: blogMaintenance,
        installation: blogInstallation,
        ceilingFan: blogCeilingFan,
        hurricanePrep: blogHurricanePrep,
        panelRepair: blogPanelRepair,
        smokeDetector: blogSmokeDetector,
        panelUpgrade: blogPanelUpgrade,
        securityLighting: blogSecurityLighting,
        diagnostics: blogDiagnostics,
        outletSwitch: blogOutletSwitch,
        miamiCondo: blogMiamiCondo,
    },

    // Service Page Images
    services: {
        commercial: svcCommercial,
        emergency: svcEmergency,
        evCharging: svcEvCharging,
        lighting: svcLighting,
        wiring: svcWiring,
        panelWork: svcPanelWork,
    },

    // Static URLs (for email templates, external references)
    static: {
        logo: '/logo.png',
        ogDefault: '/og-default.jpg',
        favicon: '/favicon.png',
    },
} as const;

// ==========================================
// TYPE EXPORTS (for future CMS)
// ==========================================
export type ImageCategory = keyof typeof IMAGES;
export type BrandingImage = keyof typeof IMAGES.branding;
export type HeroImage = keyof typeof IMAGES.heroes;
export type CategoryImage = keyof typeof IMAGES.categories;
export type BlogImage = keyof typeof IMAGES.blog;
export type ServiceImage = keyof typeof IMAGES.services;

// ==========================================
// HELPER: Get image by slug (for dynamic pages)
// ==========================================
export function getHeroImage(page: string) {
    const heroMap: Record<string, typeof IMAGES.heroes[keyof typeof IMAGES.heroes]> = {
        'index': IMAGES.heroes.homepage,
        'about': IMAGES.heroes.about,
        'contact': IMAGES.heroes.contact,
        'services': IMAGES.heroes.services,
        'service-areas': IMAGES.heroes.serviceAreas,
        'blog': IMAGES.heroes.blog,
        'reviews': IMAGES.heroes.reviews,
        'faq': IMAGES.heroes.faq,
        'book': IMAGES.heroes.book,
    };
    return heroMap[page] || IMAGES.heroes.homepage;
}

export function getCategoryImage(slug: string) {
    const categoryMap: Record<string, typeof IMAGES.categories[keyof typeof IMAGES.categories]> = {
        'emergency': IMAGES.categories.emergency,
        'panel-upgrade': IMAGES.categories.panelUpgrade,
        'ev-charging': IMAGES.categories.evCharging,
        'lighting': IMAGES.categories.lighting,
        'wiring': IMAGES.categories.wiring,
        'generators': IMAGES.categories.generators,
        'smart-home': IMAGES.categories.smartHome,
        'commercial': IMAGES.categories.commercial,
        'inspection': IMAGES.categories.inspection,
        'outdoor': IMAGES.categories.outdoor,
    };
    return categoryMap[slug] || IMAGES.categories.emergency;
}
