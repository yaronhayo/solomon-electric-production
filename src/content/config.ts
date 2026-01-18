import { defineCollection, z } from "astro:content";

const faqs = defineCollection({
    type: "data",
    schema: z.object({
        id: z.string(),
        question: z.string(),
        answer: z.string(),
        category: z.string(),
    }),
});

const blog = defineCollection({
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        image: image().optional(),
        imageAlt: z.string().optional(),
        icon: z.string().optional(), // Keeping icon as string path for now or separate handling
        tags: z.array(z.string()).optional(),
        category: z.string(),
        featured: z.boolean().optional().default(false),
        excerpt: z.string().optional(),
        author: z.string().optional().default("Solomon Electric"),
        keywords: z.array(z.string()).optional(),
        updatedDate: z.date().optional(),
        faqs: z.array(z.object({
            question: z.string(),
            answer: z.string()
        })).optional(),
    }),
});

const reviews = defineCollection({
    type: "data",
    schema: z.object({
        id: z.string(),
        author: z.string(),
        rating: z.number().min(1).max(5),
        text: z.string(),
        date: z.string(), // Keeping as string for now to match current usage, or can transform to Date
        service: z.string().optional(),
    }),
});

const services = defineCollection({
    type: "data",
    schema: ({ image }) => z.object({
            name: z.string(),
            slug: z.string(),
            description: z.string(),
            shortDescription: z.string(),
            icon: z.string(), // Storing icon name (e.g., 'Zap')
            image: image().optional(),
            category: z.enum([
                'Electrical Panels & Power Systems',
                'Emergency Electrical Services',
                'EV Charging & Solar',
                'Outlets, Switches & Wiring',
                'Lighting & Smart Home',
                'Commercial & Inspections'
            ]),
            features: z.array(z.string()),
            relatedBlogPosts: z.array(z.string()),
            order: z.number(),
            faqs: z.array(z.object({
                question: z.string(),
                answer: z.string()
            })).optional(),
            // NEW: Extended fields for comprehensive service pages
            problems: z.array(z.object({
                title: z.string(),
                description: z.string(),
                icon: z.string().optional()
            })).optional(),
            process: z.array(z.object({
                step: z.number(),
                title: z.string(),
                description: z.string()
            })).optional(),
            benefits: z.array(z.object({
                title: z.string(),
                description: z.string(),
                icon: z.string().optional()
            })).optional(),
            stats: z.array(z.object({
                value: z.string(),
                label: z.string()
            })).optional(),
            relatedServices: z.array(z.string()).optional(),
            seoContent: z.array(z.object({
                heading: z.string(),
                body: z.string()
            })).optional(),
            warningSignsHeading: z.string().optional(),
            warningSignsSubheading: z.string().optional(),
            processHeading: z.string().optional(),
            benefitsHeading: z.string().optional(),
    }),
});

const serviceAreas = defineCollection({
    type: "data",
    schema: z.object({
        // Basic Info
        name: z.string(),
        slug: z.string(),
        county: z.enum(["Miami-Dade", "Broward", "Palm Beach"]),
        description: z.string(),
        
        // City Facts
        population: z.string(),
        founded: z.string().optional(),
        areaSquareMiles: z.string().optional(),
        tagline: z.string().optional(),
        
        // Notable Locations
        landmarks: z.array(z.string()).optional(),
        neighborhoods: z.array(z.string()),
        majorRoads: z.array(z.string()).optional(),
        
        // Map Coordinates
        coordinates: z.object({
            lat: z.number(),
            lng: z.number()
        }).optional(),
        
        // City-specific Electrical Challenges
        challenges: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string().optional()
        })).optional(),
        
        // Featured Services (slugs)
        featuredServices: z.array(z.string()).optional(),
        
        // Stats Bar
        stats: z.array(z.object({
            value: z.string(),
            label: z.string()
        })).optional(),
        
        // FAQs
        faqs: z.array(z.object({
            question: z.string(),
            answer: z.string()
        })),
        
        // SEO Content Sections
        seoContent: z.array(z.object({
            heading: z.string(),
            body: z.string()
        })).optional()
    })
});

export const collections = {
    faqs,
    reviews,
    services,
    blog,
    "service-areas": serviceAreas,
};
