---
description: GSC Sitemap and Index Maintenance - Run when pages change or GSC issues appear
---

# Google Search Console Maintenance Workflow

Run this workflow when:
- New pages are added or removed
- URL slugs change
- New issues appear in GSC dashboard
- After any major deployment

## Pre-flight Checks

// turbo
1. Verify GSC connection is working:
```bash
node scripts/gsc-client.js sitemaps
```

## When Pages Are Added/Removed/Changed

// turbo
2. Rebuild the site to regenerate sitemap:
```bash
npm run build
```

// turbo
3. Verify sitemap was generated with correct URL count:
```bash
cat dist/sitemap-0.xml | grep -o '<loc>' | wc -l
```
Expected: ~1820 URLs (should match page count)

4. Deploy the updated `dist/` folder to Hostinger via FTP or hosting panel.

// turbo
5. Submit updated sitemap to GSC:
```bash
node scripts/gsc-client.js submit-sitemap
```

## When URL Slugs Change

6. Add 301 redirects in `public/.htaccess` for old URLs:
```apache
Redirect 301 /old-url/ /new-url/
```

// turbo
7. Rebuild and redeploy (repeat steps 2-5)

## Check GSC for Issues

// turbo
8. View sitemap status and errors:
```bash
node scripts/gsc-client.js sitemaps
```

// turbo
9. Get performance data (last 7 days):
```bash
node scripts/gsc-client.js performance --days=7
```

// turbo
10. Inspect specific problematic URLs:
```bash
node scripts/gsc-client.js inspect-url /services/
```

## Verify Key Pages Are Indexed

// turbo
11. Check homepage indexing:
```bash
node scripts/gsc-client.js inspect-url /
```

// turbo
12. Check a sample service+city page:
```bash
node scripts/gsc-client.js inspect-url /services/level-2-ev-charger-installation/miami/
```

## If 404 Errors Appear in GSC

13. Add appropriate 301 redirects in `public/.htaccess`:
```apache
# Example pattern for old service URLs
Redirect 301 /services/old-service-name /services/new-service-name/
```

14. Rebuild and deploy, then resubmit sitemap.

## Quick Reference Commands

| Task | Command |
|------|---------|
| Check sitemaps | `node scripts/gsc-client.js sitemaps` |
| Submit sitemap | `node scripts/gsc-client.js submit-sitemap` |
| Inspect URL | `node scripts/gsc-client.js inspect-url /path/` |
| Performance | `node scripts/gsc-client.js performance --days=7` |
| Count sitemap URLs | `cat dist/sitemap-0.xml \| grep -o '<loc>' \| wc -l` |
