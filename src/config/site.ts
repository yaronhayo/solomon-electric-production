/**
 * Site Configuration
 * Single source of truth for all site-wide information
 */

export const SITE_CONFIG = {
    company: {
        name: "Solomon Electric",
        tagline: "Miami's Trusted Electrical Experts",
        foundedYear: 2008,
        branding: {
            primary: "#0D4380",
            accent: "#14D3E3",
            light: "#F3F3F3",
            dark: "#111111",
        },
    },

    contact: {
        phone: {
            raw: "7868339211",
            formatted: "(786) 833-9211",
            display: "(786) 833-9211",
            href: "tel:7868339211"
        },
        email: {
            primary: "contactus@solomonselectric.com",
            support: "contactus@solomonselectric.com",
        },
        address: {
            street: "4036 N 29th Ave",
            city: "Hollywood",
            state: "FL",
            zip: "33020",
            full: "4036 N 29th Ave, Hollywood, FL 33020"
        },
        bookingUrl: "/book"
    },

    credentials: {
        license: {
            state: "FL",
            number: "EC13012419",
            display: "FL EC13012419",
            fullDisplay: "100% Licensed & Insured • Florida License: #EC13012419"
        },
        insurance: "Fully Insured",
        yearsExperience: "15+"
    },

    social: {
        facebook: "https://www.facebook.com/Solomonselectric",
        instagram: "https://www.instagram.com/solomonelectric",
        yelp: "https://www.yelp.com/biz/solomon-electric-hollywood-6",
        googleMaps: "https://maps.app.goo.gl/xRAyZhNnNDVds3gh6"
    },

    stats: {
        residentialProjects: "12,000+",
        commercialJobs: "4,500+",
        industrialSystems: "2,000+",
        happyClients: "19,000+",
        totalReviews: "1,000+",
        averageRating: 4.9,
        fiveStarPercentage: 98,
        wouldRecommend: 100
    },

    hours: {
        monday: "24 Hours",
        tuesday: "24 Hours",
        wednesday: "24 Hours",
        thursday: "24 Hours",
        friday: "24 Hours",
        saturday: "24 Hours",
        sunday: "24 Hours",
        emergency: "24/7 Emergency Service",
        isAlwaysOpen: true 
    },

    seo: {
        defaultTitle: "Electrician Miami & Broward | Licensed Electrical Contractors | Solomon Electric",
        defaultDescription: "Top-rated licensed electricians serving Miami-Dade & Broward. Residential, commercial & industrial electrical repairs, installations & upgrades. 24/7 emergency service available. Call for safe, reliable power solutions.",
        siteUrl: "https://www.247electricianmiami.com",
        tracking: {
            gtm: "GTM-KQQZXTZ6",
        },
        schema: {
            businessName: "Solomon Electric",
            type: "ElectricalContractor",
            priceRange: "$$",
            latitude: 26.035414,
            longitude: -80.170560,
            areaServed: [
                "Miami", "Fort Lauderdale", "Hollywood", "Miami Beach", "Boca Raton", "Coral Springs", "Pembroke Pines", "Hialeah", "Homestead", "Jupiter"
            ],
            socialProfiles: [
                "https://www.facebook.com/Solomonselectric",
                "https://www.instagram.com/solomonelectric",
                "https://www.yelp.com/biz/solomon-electric-hollywood-6"
            ]
        }
    }
} as const;

export type SiteConfig = typeof SITE_CONFIG;

