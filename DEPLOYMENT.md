# Solomon Electric - Hostinger Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Production build successful (122 pages)
- [x] All 94 images optimized
- [x] Sitemap generated
- [x] Total size: ~45MB
- [x] Centralized environment config (`env.php`)

---

## 🔑 STEP 1: Configure Environment Variables

**Open `dist/api/env.php` and replace ALL placeholders with real keys:**

```php
// REQUIRED - Email will not work without this
define('SMTP2GO_API_KEY', 'YOUR_SMTP2GO_API_KEY_HERE');

// OPTIONAL - Form works without these
define('TURNSTILE_SITE_KEY', 'YOUR_TURNSTILE_SITE_KEY_HERE');
define('TURNSTILE_SECRET_KEY', 'YOUR_TURNSTILE_SECRET_KEY_HERE');
define('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY_HERE');
```

### Where to Get Keys:
| Service | URL | Purpose |
|---------|-----|---------|
| SMTP2GO | https://app.smtp2go.com/settings/api_keys/ | Form emails |
| Turnstile | https://dash.cloudflare.com/turnstile | CAPTCHA (optional) |
| Google Maps | https://console.cloud.google.com/apis/credentials | Address autocomplete (optional) |

---

## 📁 STEP 2: Upload to Hostinger

### Option A: File Manager (Easiest)
1. Login to Hostinger hPanel
2. Go to **Files → File Manager**
3. Navigate to `public_html`
4. Delete existing files (if any)
5. Upload ALL contents from `dist/` folder
6. **Important:** Enable "Show hidden files" to see `.htaccess`

### Option B: FTP/SFTP
```
Host: ftp.247electricianmiami.com
Port: 21 (FTP) or 22 (SFTP)
Directory: /public_html/
```

---

## 🔒 STEP 3: Verify Security

After upload, test these URLs return 403 Forbidden:
- `https://247electricianmiami.com/api/env.php` → Should be blocked

---

## ✓ STEP 4: Post-Deployment Testing

### Test Pages
- [ ] Homepage: `/`
- [ ] Services: `/services`
- [ ] Contact: `/contact`
- [ ] Book: `/book`

### Test Form Submission
1. Go to `/book`
2. Fill out form with test data
3. Submit
4. Check:
   - [ ] Redirects to `/thank-you`
   - [ ] Company receives lead email at `info@solomonelectric.com`
   - [ ] Customer receives autoresponder (if email provided)

### Test Redirects
- [ ] `/about-us` → `/about`
- [ ] `/contact-us` → `/contact`

---

## 📧 Email Configuration Summary

| Setting | Value |
|---------|-------|
| Lead notifications sent to | `info@solomonelectric.com` |
| Emails sent from | `noreply@solomonelectric.com` |
| Reply-to for autoresponders | `info@solomonelectric.com` |

---

## 🚀 Go Live

Once all tests pass:
1. Verify SSL is active (Hostinger provides free SSL)
2. Submit sitemap to Google Search Console: `/sitemap-index.xml`
3. Verify in GTM that tags are firing

**Your site is now live!**
