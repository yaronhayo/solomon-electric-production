---
name: lead_intelligence
description: Technical management of high-fidelity lead attribution, TCPA/TCR legal compliance, and server-side lead verification.
---

# Expert Lead Intelligence (v3.0)

This skill enables an agent to manage the lead capture pipeline, ensuring that every submission is legally compliant, correctly attributed, and delivered with zero latency.

## ⚖️ Legal & Compliance Architecture

### 1. TCR/TCPA SMS Consent

Compliance is not optional. Every form MUST display the simplified SMS consent text.

- **Standard**: "By clicking 'Book Service', I agree to receive text messages... Msg & data rates may apply. Reply STOP to opt out."
- **Protocol**: Never modify form submit buttons or legal footers without re-validating against project compliance standards.

### 2. reCAPTCHA Return-Score Pattern

The site uses a "Score-at-the-Edge" pattern to filter spam without friction.

- **Standard**: Check `recaptcha_v3` scores on the server before processing the lead.
- **Benchmark**: Return a 403 or "Soft Failure" if the score is below 0.3.

## 📊 Lead Attribution Standard

### High-Fidelity Source Discovery

Every lead must be attributed to a source using the "Logo Sticker" pattern.

- **UTM Capture**: Ensure UTM source, medium, and campaign are persisted into the form's hidden inputs from `sessionStorage`.
- **Signal-to-Noise**: Lead emails must strip "noise" variables and only present actionable dispatcher info.

### Lead Intelligence Parameters

- `lead_source`: (e.g., google_ads, organic_search, yelp_listing)
- `conversion_page`: The specific city/service intersection where they converted.
- `campaign_id`: The ID of the ad group for performance tracking.

## 🛠 Technical Stewardship

| Task | Pattern | Standard |
| :--- | :--- | :--- |
| **SMTP Relay** | SMTP2GO integration | 100% deliverability; use dedicated subdomains for mail. |
| **Normalisation** | Mc/Mac-aware capitalization | Names/cities must be cleaned (e.g., miami -> Miami). |
| **Validation** | US Phone Formatting | Auto-formatting `(XXX) XXX-XXXX` on-the-fly. |

## 🎯 Mastery Signals

- **Attribution Accuracy**: 100% of leads show a source in GTM.
- **Compliance Audit**: 0 missing legal checkboxes on live forms.
- **Notification Latency**: Internal lead alerts delivered under 10 seconds.
