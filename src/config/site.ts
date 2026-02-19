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
            formatted: "(786)\u00A0833\u20119211",
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
            fullDisplay: "100% Licensed &amp; Insured • Florida License: #EC13012419"
        },
        yearsExperience: "18+"
    },

    social: {
        facebook: "https://www.facebook.com/Solomonselectric",
        instagram: "https://www.instagram.com/solomonelectric",
        yelp: "https://www.yelp.com/biz/solomon-electric-hollywood-6",
        googleMaps: "https://maps.app.goo.gl/xRAyZhNnNDVds3gh6"
    },

    stats: {
        totalProjects: "19,400",
        residentialProjects: "12,000+",
        commercialJobs: "4,500+",
        industrialSystems: "2,000+",
        happyClients: "19,000+",
        totalReviews: "1,200+",
        averageRating: 4.9,
    },

    seo: {
        defaultTitle: "Electrician Miami-Dade &amp; Broward | 24/7 Emergency Services | Solomon Electric",
        defaultDescription: "Top-rated licensed electricians in Miami-Dade &amp; Broward. Residential &amp; commercial repairs, installations, and 24/7 emergency service. Get your free estimate today!",
        siteUrl: "https://www.247electricianmiami.com",
        tracking: {
            gtm: "GTM-KQQZXTZ6",
        },
        integrations: {
            googleMaps: "AIzaSyCPUa0e_IB0rB5UeJrWa3__Lohkm7HB9hY",
            recaptcha: "6LeDDjUsAAAAAEJquohduwPouri3rOne3ahYp765",
        },
        schema: {
            businessName: "Solomon Electric",
            type: "ElectricalContractor",
            priceRange: "$$",
            latitude: 26.035414,
            longitude: -80.170560,
            areaServed: [
                "Boca Raton", "Boynton Beach", "Coconut Creek", "Coral Springs", "Deerfield Beach", "Delray Beach", "Davie", "Fort Lauderdale", "Hialeah", "Homestead", "Hollywood", "Jupiter", "Lauderhill", "Margate", "Miami", "Miami Beach", "Miami Gardens", "Miramar", "North Miami", "Pembroke Pines", "Plantation", "Pompano Beach", "Sunrise", "Tamarac", "Wellington", "Weston", "West Palm Beach"
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

