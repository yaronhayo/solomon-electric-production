---
name: conversion_optimization
description: Mastery of Conversion Rate Optimization (CRO), GTM/GA4 tracking orchestration, and behavioral lead capture.
---

# Expert Conversion Optimization (v3.0)

This skill enables an agent to maximize the "Visitor-to-Lead" ratio of the Solomon Electric platform through behavioral triggers and high-fidelity tracking.

## 📈 Conversion Architecture

### 1. Behavior-Based Triggers
- **Exit Intent Pattern**: Use the `ExitIntentPopup.astro` logic. Trigger on `mouseOut` (top edge < 50px) or mobile `popstate` (on-site back button click).
- **Sticky Persistence**: The `MobileFloatingCTA.astro` must remain fixed to provide zero-friction access to the primary "Call" action on mobile.
- **Magnetic CTAs**: Buttons should use `var(--ease-bounce)` and slight hover scaling to increase Click-Through Rate (CTR).

### 2. Decision Friction Reduction
- **Benefit Stacking**: CTAs must be accompanied by "Trust Signals" (e.g., "Licensed & Insured", "24/7 Service").
- **Local Validation**: Displaying `{SITE_CONFIG.stats.totalReviews}` near booking buttons to leverage social proof.

## 📊 GTM & GA4 Orchestration

### 1. Tracking Protocol
- **DataLayer Dominance**: Push custom events (`exit_intent_shown`, `booking_start`, `call_click`) to GTM.
- **Session Persistence**: Capture UTM parameters (`utm_source`, `utm_medium`) into `sessionStorage` on first visit to maintain source attribution even if the user navigates through 10+ city pages.

### 2. Conversion Signals
| Event Name | Definition | Trigger |
| :--- | :--- | :--- |
| `contact_lead` | High Intent | Contact Form Successful Submit. |
| `booking_lead` | Revenue Intent | Booking Form Successful Submit. |
| `phone_click` | Immediate Intent | Mobile CTA or Topbar Phone Click. |

## 🕹 CRO Workflow

1.  **A/B Readiness**: When modifying components, ensure `data-cta-type` or `id` attributes are preserved for GTM variable extraction.
2.  **Tracking Validation**: Use the "Preview" mode of GTM to ensure that `enhanced-tracking.ts` fires events for every interactive element.
3.  **Lead Hygiene**: Use McIntosh-aware capitalization and standard US phone formatting on all inputs to ensure clean data for sales follow-up.

## 🎯 Mastery Signals
- **Lead Capture Rate**: Maintain >3% conversion rate across the asset.
- **Attribution Accuracy**: 100% of leads mapped to an organic city/service or paid campaign.
- **Interaction Depth**: Monitor "Click Path" in session storage to optimize the linking structure.
