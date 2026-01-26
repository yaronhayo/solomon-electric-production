# Security & Anti-Spam Configuration for Solomon Electric

## Enhanced Security Headers

### Content Security Policy (CSP)

**Purpose**: Prevent XSS attacks while allowing legitimate tracking scripts

**Whitelisted Domains**:

- **GTM**: `https://www.googletagmanager.com`
- **GA4**: `https://www.google-analytics.com`, `https://analytics.google.com`
- **Clarity**: `https://www.clarity.ms`, `https://c.clarity.ms`, `https://t.clarity.ms`
- **Google Fonts**: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
- **reCAPTCHA**: `https://www.google.com`, `https://www.gstatic.com`

**Key Protections**:

```apache
script-src: Only allows scripts from whitelisted domains + inline (for GTM dataLayer)
connect-src: Only allows API calls to analytics endpoints
frame-src: Blocks embedding (clickjacking protection)
object-src 'none': Blocks Flash and other plugins
form-action 'self': Forms can only submit to same domain
```

### Anti-Spam Measures

#### 1. Form Honeypot (Already implemented in BookingForm.astro)

- Hidden field that bots fill but humans don't
- Immediate rejection if filled

#### 2. Rate Limiting (Server-side in env.php)

- Max 5 form submissions per IP per hour
- Prevents automated spam bots

#### 3. ReCAPTCHA v3 (configured in GTM)

- Invisible challenge scoring (0.0 - 1.0)
- Blocks scores below 0.5
- No user interaction required

#### 4. CSRF Protection

- Form tokens generated per session
- Validates on submission

#### 5. Email Validation

- Regex pattern check
- Disposable email blocking
- MX record verification

### Global Variable Access Control

#### Clarity Variables (Safe - Read Only)

```javascript
clarity: Read/Write/Execute allowed
clarity.q: Read/Write/Execute allowed
```

**Why Safe**: Clarity only accesses its own queue, doesn't modify site data

#### GTM Variables (Controlled)

```javascript
window.dataLayer: Write only (push events)
window.google_tag_manager: Read only
```

#### Protected Variables (Blocked by CSP)

```javascript
eval(): Blocked unless from whitelisted domain
Function(): Same origin only
innerHTML: Sanitized
```

### URL Match Patterns Allowed

#### Clarity

- `https://www.clarity.ms/*` - Main script
- `https://c.clarity.ms/*` - Configuration
- `https://t.clarity.ms/*` - Tracking endpoint

#### GTM

- `https://www.googletagmanager.com/gtm.js?id=*` - Container loading
- `https://www.googletagmanager.com/gtag/js?id=*` - GA4 loading

#### GA4

- `https://www.google-analytics.com/analytics.js` - Universal Analytics (legacy)
- `https://www.google-analytics.com/g/collect` - GA4 event collection
- `https://region1.google-analytics.com/*` - Regional endpoint

### Spam Filter Configuration

**Email Server (SMTP2GO)**:

```php
// In env.php
'spam_score_threshold' => 5.0,  // Block emails scoring >5
'dkim_validation' => true,       // Require DKIM signature
'spf_validation' => true,        // Require SPF record
'dmarc_policy' => 'quarantine',  // Quarantine suspicious emails
```

**IP Blacklist** (Auto-updated):

- Spamhaus DROP list
- Tor exit nodes
- Known bot networks

**User-Agent Filtering**:

```apache
# Block known bad bots
RewriteCond %{HTTP_USER_AGENT} (semrush|ahrefs|majestic) [NC,OR]
RewriteCond %{HTTP_USER_AGENT} (scrapy|wget|curl) [NC]
RewriteRule .* - [F,L]
```

### Recommended Additional Protections

#### 1. Cloudflare (or similar CDN)

- DDoS protection
- Bot management
- WAF (Web Application Firewall)
- Challenge page for suspicious traffic

#### 2. reCAPTCHA Enterprise (Upgrade from v3)

- Better bot detection
- Custom challenge rules
- Fraud prevention

#### 3. Form Field Timing

- Track time to complete form
- Block submissions < 3 seconds (bots)
- Block submissions > 30 minutes (abandoned sessions)

#### 4. Browser Fingerprinting

- Detect automated browsers
- Block headless Chrome/Puppeteer
- Track repeat offenders

### Monitoring & Alerts

#### Setup Alerts For

1. Spike in form submissions (>10/hour)
2. Multiple failed CAPTCHA attempts
3. Unusual traffic patterns
4. Blocked IPs trying repeatedly

#### GTM Events to Monitor

```javascript
// Spam attempt detected
window.dataLayer.push({
  event: 'spam_detected',
  spam_type: 'honeypot_filled',
  ip_hash: '...',
  timestamp: Date.now()
});

// Suspicious behavior
window.dataLayer.push({
  event: 'suspicious_activity',
  activity_type: 'rapid_form_fill',
  time_to_complete: 1.2  // seconds
});
```

### Testing Security

#### Test CSP

```bash
# Check headers
curl -I https://www.247electricianmiami.com | grep -i "content-security"

# Test GTM loading
# Should load successfully
curl https://www.googletagmanager.com/gtm.js?id=GTM-KQQZXTZ6
```

#### Test Form Protection

1. Fill honeypot field → Should reject
2. Submit twice in 5 seconds → Should rate limit
3. Use disposable email → Should block
4. Fill form in <3 seconds → Should flag

### Security Checklist

- [x] CSP headers configured
- [x] HSTS enabled (force HTTPS)
- [x] Clickjacking protection (X-Frame-Options)
- [x] XSS protection headers
- [x] MIME sniffing blocked
- [x] GTM/GA4/Clarity whitelisted
- [x] Form honeypot implemented
- [ ] Rate limiting active (deploy env.php)
- [ ] reCAPTCHA configured
- [ ] Email validation active
- [ ] Bot user-agent blocking
- [ ] Monitoring alerts setup

### Files Modified

1. `public/.htaccess` - Enhanced CSP headers
2. `src/components/BookingForm.astro` - Honeypot field
3. `server-config/env.php` - Rate limiting, email validation

### Resources

- CSP Evaluator: <https://csp-evaluator.withgoogle.com/>
- Security Headers: <https://securityheaders.com/>
- GTM Security: <https://developers.google.com/tag-platform/security>
- OWASP Top 10: <https://owasp.org/www-project-top-ten/>
