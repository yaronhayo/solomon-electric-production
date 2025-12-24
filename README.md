# Solomon Electric - Miami's Premier Electrical Contractors

Professional electrical services for residential and commercial properties throughout South Florida. Licensed, insured, and available 24/7 for emergencies.

## 🏆 Features

- **63 Service Pages** - Comprehensive electrical service offerings
- **27 Service Areas** - Coverage across Miami-Dade, Broward, and Palm Beach counties
- **15 Educational Blog Posts** - Expert electrical knowledge and safety guides
- **100% Google Policy Compliant** - No pricing, ETAs, or employee names
- **Full Schema.org Implementation** - 9 different structured data types
- **PWA Ready** - Progressive Web App with offline support
- **SEO Optimized** - Dynamic meta tags, sitemaps, canonical URLs

## 🛠 Tech Stack

- **[Astro](https://astro.build)** - Static site generator
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[MDX](https://mdxjs.com)** - Markdown with JSX for blog posts
- **Content Collections** - Type-safe content management
- **Google Analytics** - Traffic and conversion tracking
- **Google Tag Manager** - Marketing tag management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit `http://localhost:4321` to view the site.

### Environment Variables

See `.env.example` for required configuration:

- `PUBLIC_GOOGLE_MAPS_API_KEY` - Address autocomplete in booking form
- `PUBLIC_TURNSTILE_SITE_KEY` - Cloudflare spam protection
- `PUBLIC_GA_MEASUREMENT_ID` - Google Analytics tracking
- `PUBLIC_GTM_ID` - Google Tag Manager container

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

For deployment instructions to Hostinger, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📁 Project Structure

```
/
├── public/              # Static assets
│   ├── api/            # PHP email backend
│   ├── .htaccess       # Apache configuration
│   └── robots.txt      # SEO crawler instructions
├── src/
│   ├── assets/         # Images, fonts
│   ├── components/     # Reusable Astro components
│   ├── config/         # Site configuration
│   ├── content/        # Content collections (MDX/JSON)
│   │   ├── blog/      # Blog posts
│   │   ├── faqs/      # FAQ entries
│   │   ├── reviews/   # Customer testimonials
│   │   └── services/  # Service definitions
│   ├── data/          # Static data files
│   ├── layouts/       # Page layouts
│   ├── pages/         # File-based routing
│   ├── styles/        # Global CSS & design tokens
│   └── utils/         # Helper functions
└── package.json
```

## 🎨 Design System

The site uses a comprehensive design system with CSS custom properties:

- **Colors**: Primary (navy), Accent (yellow), semantic colors
- **Spacing**: Consistent scale from xs to 3xl
- **Typography**: Fluid responsive sizing
- **Shadows**: Elevation system for depth
- **Animations**: Consistent timing and easing

See `src/styles/global.css` for the complete token system.

## 📄 Key Pages

- **Homepage** (`/`) - LocalBusiness schema
- **Services** (`/services`) - 63 individual service pages
- **Service Areas** (`/service-areas`) - 27 city-specific pages
- **Blog** (`/blog`) - Educational electrical content
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form and information
- **Book** (`/book`) - Multi-step booking wizard

## 🔍 SEO Features

- Dynamic title tags and meta descriptions
- 9 Schema.org structured data types
- Auto-generated XML sitemap
- Canonical URLs on all pages
- Open Graph and Twitter Card meta tags
- Geo-targeting meta tags for local SEO

## 📊 Analytics & Tracking

- Google Analytics 4 integration
- Google Tag Manager support
- Custom event tracking on forms
- Conversion tracking ready

## 🛡 Compliance

- 100% Google LSA/GBP policy compliant
- Privacy Policy page
- Terms of Service page
- GDPR-ready (cookie consent banner included)
- Accessible (WCAG 2.1 AA standards)

## 🤝 Contributing

This is a production website for Solomon Electric. For feature requests or bug reports, please contact the development team.

## 📝 License

Proprietary - All rights reserved by Solomon Electric

## 📞 Support

For questions about the codebase or deployment:
- Email: [your-dev-email]
- Documentation: See [DEPLOYMENT.md](./DEPLOYMENT.md)
