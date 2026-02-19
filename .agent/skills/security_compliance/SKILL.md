---
name: security_compliance
description: Strict management of TCR/TCPA legal standards, reCAPTCHA protection, and server-side safety headers.
---

# Expert Security & Compliance (v3.0)

This skill enables an agent to protect the Solomon Electric asset from legal risk, spam-bot intrusion, and security vulnerabilities.

## ⚖️ Legal Standards (TCPA/TCR)

### 1. SMS Consent Protocol
The business uses SMS for dispatch. Compliance with TCR (The Campaign Registry) is mission-critical to prevent carrier blocking.
- **Form Standard**: Every submit button must be preceded by: *"By clicking [Button], I agree to receive text messages... Reply STOP to opt out."*
- **Privacy Policy**: All forms must link to a compliant Privacy Policy that explicitly states data is NOT shared with third parties for marketing.

### 2. Prohibited Terms Audit
`seo-validate.js` enforces a "Safe Content" standard.
- **Response Times**: Do not promise "60-minute" or "Within the hour" (Carrier/Legal risk). Use "Rapid Response" or "Priority Dispatch".
- **Pricing**: Avoid specific dollar amounts in programmatic content to prevent stale pricing legal issues.

## 🛡 Technical Security

### 1. Bot Protection (reCAPTCHA v3)
- **Standard**: Site uses reCAPTCHA v3. Verification happens server-side.
- **Logic**: Use the `SITE_CONFIG.seo.integrations.recaptcha` key for frontend execution.

### 2. Security Headers (Best Practice)
Security headers should be managed via `.htaccess` or the server config:
- `Content-Security-Policy`: Restrict scripts to trusted domains (GTM, Google, reCAPTCHA).
- `Strict-Transport-Security`: Force HTTPS for all transitions.
- `X-Content-Type-Options: nosniff`: Prevent MIME-type sniffing.

## 🕹 Compliance Workflow

1.  **Form Modification**: If a field is added to `BookingForm.astro`, the agent must verify the `required` attributes and re-test the SMS disclaimer visibility.
2.  **Content Update**: Before committing new service descriptions, run `npm run seo:validate` to check for prohibited legal terms.
3.  **PII Handling**: Ensure GTM does not capture PII (Names, Emails) in URLs or custom dimensions.
