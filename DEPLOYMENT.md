# Deployment Guide - Solomon Electric

## Overview

This guide covers deploying the static build to Hostinger and managing sensitive configuration files.

## Build Process

### 1. Pre-Build Checks

```bash
# Run type checking
npm run check

# Validate SEO metadata
npm run seo:validate
```

### 2. Build for Production

```bash
# Build with 8GB heap allocation (required for 1,683 pages)
npm run build
```

**Expected Output:**
- 1,823 HTML pages generated
- Sitemap files created (`sitemap-index.xml` and `sitemap-0.xml`)
- ~26MB HTML compression
- Build time: ~10-15 minutes

### 3. Verify Build

```bash
# Check sitemap generation
ls -la dist/sitemap*.xml

# Count generated pages
find dist -name "*.html" | wc -l

# Verify URL count in sitemap
cat dist/sitemap-0.xml | grep -o '<loc>' | wc -l
```

## Hostinger Deployment

### Option 1: FTP Upload (Recommended for Large Sites)

```bash
# Install lftp if not already installed
brew install lftp

# Mirror dist/ to server
lftp -u "username,password" ftp.yourdomain.com -e "set ssl:verify-certificate no; mirror -R --parallel=10 --verbose dist/ public_html/; quit"
```

### Option 2: Manual via hPanel File Manager

1. Log into Hostinger hPanel
2. Navigate to File Manager → public_html
3. Delete old files (except `api/env.php` - see below)
4. Upload entire `dist/` folder contents
5. Verify sitemap is accessible

## Critical: Environment Configuration (env.php)

### Local Development

The `env.php` file with **real API keys** is stored in:
```
/server-config/env.php  (excluded from Git and dist/)
```

This prevents accidentally:
- Committing credentials to Git
- Including credentials in dist/ build
- Exposing secrets in public repos

### Server Deployment

**IMPORTANT:** The real `env.php` file must be manually uploaded to the server at:
```
public_html/api/env.php
```

**Steps:**
1. Copy `/server-config/env.php` to your local clipboard
2. Via FTP or hPanel File Manager, upload to `public_html/api/env.php`
3. Verify file permissions (644 or 640)
4. Test by visiting `yourdomain.com/contact` and submitting a test form

**Why env.php is kept separate:**
- Astro copies everything in `public/` to `dist/`
- We don't want credentials in version control or build output
- Server needs env.php in `public_html/api/` to process forms
- `.htaccess` blocks direct web access to env.php

### Creating New env.php for Different Site

1. Copy `public/api/env.example.php` to `server-config/env.php`
2. Fill in real values for all `YOUR_*_HERE` placeholders
3. Upload to server at `public_html/api/env.php`

## Post-Deployment Verification

### 1. Check Core Pages

```bash
# Homepage loads
curl -I https://www.247electricianmiami.com/

# Sitemap accessible
curl -I https://www.247electricianmiami.com/sitemap-index.xml

# Sample service+city page
curl -I https://www.247electricianmiami.com/services/level-2-ev-charger-installation/miami/
```

### 2. Verify HTTPS & WWW Redirects

```bash
# Should redirect to www
curl -I http://247electricianmiami.com

# Should enforce HTTPS
curl -I http://www.247electricianmiami.com
```

### 3. Test Form Submission

1. Visit `/book` or `/contact`
2. Fill out form with test data
3. Submit and verify:
   - Redirect to `/thank-you`
   - Email received at configured addresses
   - No console errors

### 4. Submit Sitemap to Google

```bash
# Submit to Google Search Console
npm run seo:submit-sitemap

# Check submission status
npm run seo:sitemaps
```

## Hostinger CDN Cache

**CRITICAL:** Hostinger's CDN caches aggressively. After deployment:

1. Log into hPanel
2. Navigate to Website → Advanced → CDN
3. Click "Purge Cache" or "Clear Cache"
4. Wait 2-5 minutes for purge to complete

**Why:** Without cache purge, old sitemap files or 404 pages may be served even after successful deployment.

## Troubleshooting

### Sitemap 404 Error

```bash
# On server, verify file exists
ls -la public_html/sitemap-index.xml

# Check permissions
chmod 644 public_html/sitemap*.xml

# Purge Hostinger CDN cache

# Re-verify
curl -I https://www.247electricianmiami.com/sitemap-index.xml
```

### Forms Not Sending

```bash
# Verify env.php exists on server
ls -la public_html/api/env.php

# Check .htaccess allows access (should return 403, not 404)
curl -I https://www.247electricianmiami.com/api/env.php

# Verify SMTP2GO API key is valid
# Check error logs in hPanel → Advanced → Error Logs
```

### Build Fails (Out of Memory)

```bash
# Increase heap allocation in package.json
"build": "NODE_OPTIONS='--max-old-space-size=12288' astro build"

# Or reduce compression
# Comment out compress() integration in astro.config.mjs
```

## Security Checklist

Before every deployment:

- [ ] `env.php` is NOT in `dist/` folder
- [ ] `gsc-credentials.json` is NOT in `dist/` folder
- [ ] `.env` file is NOT in `dist/` folder
- [ ] All sensitive files listed in `.gitignore`
- [ ] `.htaccess` denies access to sensitive files
- [ ] robots.txt properly configured
- [ ] HTTPS enforced via .htaccess

## Automated Deployment (Optional)

For GitHub Actions CI/CD, see `.github/workflows/deploy.yml` (if configured).

**Note:** Automated deployment requires:
- FTP credentials stored in GitHub Secrets
- Manual upload of `env.php` to server initially
- Careful exclusion of `server-config/` from deployment artifacts
