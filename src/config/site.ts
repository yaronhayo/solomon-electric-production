/**
 * Site Configuration
 * Single source of truth for all site-wide information
 */

export const SITE_CONFIG = {
    company: {
        name: "Solomon Electric",
        tagline: "Miami's Premier Electrical Contractor",
        foundedYear: 2008,
    },

    contact: {
        phone: {
            raw: "7868339211",
            formatted: "(786) 833-9211",
            display: "(786) 833-9211",
            href: "tel:7868339211"
        },
        email: {
            primary: "info@solomonelectric.com",
            support: "contactus@solomonelectric.com",
        },
        address: {
            street: "4036 N 29th Ave",
            city: "Hollywood",
            state: "FL",
            zip: "33020",
            full: "4036 N 29th Ave, Hollywood, FL 33020"
        }
    },

    credentials: {
        license: {
            state: "FL",
            number: "EC13012419",
            display: "FL EC13012419",
            fullDisplay: "Florida License: #EC13012419"
        },
        insurance: "$2M Coverage",
        yearsExperience: "15+"
    },

    social: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
        yelp: "https://www.yelp.com",
        googleMaps: "https://www.google.com/maps"
    },

    stats: {
        residentialProjects: "12,500+",
        commercialJobs: "4,800+",
        industrialSystems: "2,100+",
        happyClients: "19,400+",
        totalReviews: "1,200+",
        averageRating: 4.9,
        fiveStarPercentage: 96,
        wouldRecommend: 100
    },

    hours: {
        office: {
            weekdays: "7:00 AM - 7:00 PM",
            saturday: "8:00 AM - 5:00 PM",
            sunday: "Closed"
        },
        emergency: "24/7",
        isAlwaysOpen: false // Set to true if actually 24/7, false if just emergency service
    },

    seo: {
        defaultTitle: "Solomon Electric - Miami's Most Trusted 24/7 Electrician | Licensed & Insured",
        defaultDescription: "Expert electrical services in Miami. 24/7 emergency response, residential & commercial. Panel upgrades, EV charging, smart homes, repairs. Licensed, insured, 15+ years experience.",
        siteUrl: "https://solomonelectric.com"
    }
} as const;

export type SiteConfig = typeof SITE_CONFIG;
