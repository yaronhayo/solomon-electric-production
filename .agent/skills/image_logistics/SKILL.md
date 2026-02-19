---
name: image_logistics
description: Operating within a strictly-typed central image registry to maintain performance, global consistency, and geo-SEO dominance.
---

# Expert Image Logistics (v3.0)

This skill enables an agent to manage physical assets and their metadata as a cohesive "Image Data Layer," ensuring that 200+ local assets scale without bloating the site or breaking SEO.

## 📦 The Central Registry Pattern

### 1. Strictly-Typed Imports

The site uses `src/config/images.ts` as the **Single Source of Truth**.

- **Rule**: No direct component imports of `.png` or `.webp`. Always go through the registry.
- **Pattern**:
  ```typescript
  export const IMAGES = {
      branding: { logo: { src: logo, alt: "..." } },
      heroes: { homepage: { src: hero, alt: "..." } }
  };
  ```

### 2. Type-Safe Category Mapping

Agents must use the exported types to ensure component props never reference missing assets:

- `ImageCategory`, `BrandingImage`, `HeroImage`, `ServiceImage`.

## 🌍 Geo-SEO & Metadata Hygiene

### Semantic Alt-Tag Pattern

Every image alt tag is an SEO opportunity. Agents must follow the **Context + Location** pattern.

- **Pattern**: `[Specific Service Description] + [City/County Name] + [Brand Trust Factor]`
- **Example**: "Certified Level 2 Home EV Charger Installation in Miami-Dade County - 100% Satisfaction Guaranteed"

### Image Content Integrity

- **Heroes**: Must represent the service intent clearly (e.g., `heroEmergency` must show rapid response imagery).
- **Badges**: Trust icons (BBB, Yelp, Angi) must be high-res 1:1 ratios.

## ⚡ Performance Engineering

- **Format Standard**: 100% `.webp` or `.avif` for photographs; `.svg` for icons.
- **Resolution**: Heroes capped at 1920px width; thumbnails at 400px.
- **LCP Optimization**: Heroes must use `<Image loading="eager" fetchpriority="high" />`.

## 🛠 Maintenance Commands

| Action | Pattern |
| :--- | :--- |
| **Update Asset** | Replace file in `/assets/images` and verify import in `images.ts`. |
| **Audit Alts** | Run `npm run seo:validate` to check for missing or generic alt text. |
| **Prune Registry** | Identify `IMAGES` keys that are no longer used in `src/pages`. |

## 🎯 Mastery Signals

- **Zero CLS**: Images never cause layout shifts (Always have width/height or aspect-ratio).
- **LCP Speed**: Under 1.2s on mobile connections.
- **Accessibility**: 100% alt-tag coverage across all 1,800 programmatic pages.
