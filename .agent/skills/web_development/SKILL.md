---
name: web_development
description: Senior-level Astro 5 engineering, TypeScript architecture, and High-Performance rendering.
---

# Expert Web Development (v3.0)

This skill enables an agent to engineer and maintain the Solomon Electric platform using the modern Astro 5 stack, focused on maximum performance and programmatic scalability.

## 🛠 Technology Stack Standards

- **Framework**: Astro 5 (using `prerender = true` for high-intensity programmatic pages).
- **Styles**: Tailwind CSS 4 with the `@theme` centralized design token system.
- **Images**: `sharp` library for automated server-side optimization.
- **Language**: Strict TypeScript with defined types for images and site config.

## 🏗 Architectural Patterns

### 1. Dynamic Intersection Routing
The core of the site relies on the `[service]/[city].astro` pattern.
- **Rule**: Any new dynamic route must implement `getStaticPaths` with a double-loop (Services x Areas) to ensure full coverage.
- **Data Source**: Use `getCollection('services')` and `getCollection('service-areas')`.

### 2. Isomorphic Content Helpers
Use `replacePlaceholder()` and `generateMetaTitle()` utilities in `src/utils/` to maintain 100% uniformity in localized content generation. Never hardcode city names in components.

### 3. FOUC Prevention & Hydration
- **Blocking Script**: Use the inline `document.fonts.ready` pattern in `Layout.astro` to hold the body opacity until CSS is ready.
- **Hydration**: Use `is:inline` for critical tracking scripts to prevent execution delays.

## ⚡ Performance Engineering

| Feature | Standard | Implementation |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | < 1.0s | `loading="eager"` + `fetchpriority="high"` for hero images. |
| **CLS (Layout Shift)** | 0.0 | Explicit aspect ratios on all `Image` components. |
| **Hydration Cost** | Minimal | Use standard HTML/CSS for 90% of UI; reserve Astro islands for complex interactivity. |

## 🕹 Maintenance Workflow

1.  **Adding a Service**: Create a new `.json` file in `src/content/services`. The dynamic router will automatically build 27+ new localized pages.
2.  **Schema Modification**: Update `generateServiceLocationSchema` in `utils/service-location-generator.ts`.
3.  **Build Optimization**: Use `NODE_OPTIONS='--max-old-space-size=8192'` during build to handle 1,800+ page generation.
