---
name: quality_assurance
description: Automated testing, HTML validation, and pre-commit health checks to ensure 1,800-page stability.
---

# Expert Quality Assurance (v3.0)

This skill enables an agent to maintain the integrity of a massive 1,800+ page codebase by leveraging automated testing and strict validation protocols.

## 🔍 Validation Suite

### 1. SEO & Semantic Audit (`seo-validate.js`)
Identifies failures across three content types (Services, Areas, Blog).
- **Checks**: Meta length, duplicate titles, slug consistency, and word counts.
- **Fail Condition**: Any `error` level issue in `seo-validate.js` must block a build.

### 2. HTML & Accessibility Standards
Uses `html-validate` on the `dist` folder.
- **Standard**: 100% W3C compliance for generated HTML.
- **A11y**: Every Image component must have an `alt` tag from the typed registry.

## 🧪 Testing Architecture

### 1. E2E Testing (Playwright)
Validates the "Critical Path" (Homepage -> Service -> Booking Form).
- **Visual Regression**: Ensure hero sections and magnetic CTAs render correctly across mobile/desktop.
- **Form Testing**: Send test submissions with random data to ensure API endpoints return 200 OK.

### 2. Unit Testing (Vitest)
Validates content generation logic.
- **Target**: `src/utils/service-location-generator.ts`. Ensure placeholders like `[City]` are correctly replaced.

## 🛠 Command Mastery

| Command | Objective | When to Run |
| :--- | :--- | :--- |
| `npm run check` | Type Safety | Before every commit. |
| `npm run seo:validate` | Content Health | After modifying any JSON collection. |
| `npm run test:e2e` | UX Integrity | After UI or layout changes. |
| `npm run validate:html` | Compliance | After a successful build. |

## 🕹 QA Flow
- **Pre-commit**: The `.git/hooks/pre-commit` enforces code quality via `pre-commit.sh`.
- **Pre-deploy**: `npm run test:build` must pass to ensure the 1,800-page generation is successful.
