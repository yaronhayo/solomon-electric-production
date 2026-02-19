---
name: search_engineering
description: Mastery of high-scale programmatic SEO (1,800+ pages), multi-source data orchestration, and automated Google Search Console management.
---

# Expert Search Engineering Skill (v3.0)

This skill enables an agent to manage the "Solomon Electric Search Asset," a programmatic SEO engine generating 1,800+ service-area intersections with automated indexing and competitive tracking.

## 📐 Intellectual Architecture

### 1. Programmatic Routing & Internal Linking

The site uses a "Maximum Density" internal linking strategy. The `[service]/[city].astro` template is designed to link to **all 27 cities** for every service to maximize crawler depth.

- **Pattern**: `getRelatedCities(cityId, allCities, 27)`
- **Standard**: Every intersection must contain a "Related Cities" and "Related Services" section to maintain 100% link coverage.

### 2. Multi-Source SEO Orchestration

The `seo-orchestrator.js` combines three data streams:

- **DataForSEO**: Real-time Maps/Local Finder rankings for competitive intelligence.
- **Search Console**: Performance data (clicks, impressions, position).
- **Google Analytics**: User behavior and lead attribution.

### 3. Automated Indexing Quotas

With 1,800+ URLs, managing the **Google Indexing API** is the primary operational bottleneck.

- **Quota Management**: Agents must check `npm run gsc-health` to identify "Crawled - currently not indexed" URLs before submitting more via the API.
- **Ghost Module Discovery**: Identify URLs that exist in the sitemap but are missing from the GSC property.

### 4. Semantic Validation & QA

- **Rule**: Every new service must pass `npm run seo:validate`.
- **Prohibited Content**: No pricing mentions, no hyperbolic response claims (60-min), and no hardcoded staff names in programmatic content.

## 🛠 Advanced Toolset & Commands

| Command | Purpose | Technical Logic |
| :--- | :--- | :--- |
| `npm run gsc:health` | Indexing Dashboard | Compares Sitemap URLs vs. GSC Index status. |
| `npm run seo:unified` | Multi-Source Audit | Merges DataForSEO SERP data with GSC impressions. |
| `npm run gsc:local-queries` | City-Level Gaps | Filters queries by `SERVICE_AREAS` array. |
| `npm run gsc:rich-results` | Schema Validation | Validates `FAQPage` and `Service` schema at scale. |

## 🕹 Implementation Patterns

### FAQ Content Injection

When modifying `combinedFaqs`, the agent must use the placeholder replacement pattern to ensure local relevance:

```javascript
const combinedFaqs = service.faqs.map(faq => ({
    question: faq.question.replace(/Miami/g, city.name),
    answer: faq.answer.replace(/Miami/g, city.name)
}));
```

### Regulatory Compliance Generator

Every page must have county-specific regulatory info generated via `generateLocalRegulatoryInfo(city.county)` to maintain high E-E-A-T scores for local service intent.

## 🎯 Operational Benchmarks

- **Target Link Density**: 100% (No orphaned service pages).
- **Indexing Velocity**: >95% of programmatic pages indexed within 14 days of launch.
- **Rich Result Pass Rate**: 100% (Verify via `npm run gsc rich-results`).
