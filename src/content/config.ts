import { defineCollection, z } from 'astro:content';

// Blog collection for full articles (educational content about services)
const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(), // Short preview for listing pages
    pubDate: z.date(),
    updatedDate: z.date().optional(), // For showing when content was last updated
    author: z.string().default('Solomon Electric'),
    image: image().optional(), // Featured image
    icon: image().optional(), // Service icon
    tags: z.array(z.string()),
    category: z.enum([
      'Residential',
      'Commercial',
      'Safety',
      'Installation',
      'Repair',
      'Upgrades',
      'Smart Home',
      'EV Charging',
      'Emergency Services'
    ]).default('Residential'),
    featured: z.boolean().default(false), // For highlighting important posts
    keywords: z.array(z.string()).optional(), // SEO keywords
  }),
});

// Services collection for the services grid (simple data, not full pages)
const servicesCollection = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    shortDescription: z.string(), // Brief one-liner
    icon: image(),
    category: z.enum(['Residential', 'Commercial', 'Both']),
    features: z.array(z.string()), // Bullet points of key features
    relatedBlogPosts: z.array(z.string()).optional(), // Slugs of related blog posts
    order: z.number().default(999), // For controlling display order
  }),
});

export const collections = {
  'blog': blogCollection,
  'services': servicesCollection,
};
