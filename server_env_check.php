<?php
/**
 * ========================================
 * ENVIRONMENT CONFIG - PRODUCTION
 * ========================================
 * 
 * Solomon Electric - 247electricianmiami.com
 * Generated for Hostinger deployment
 * 
 * ========================================
 */

// Prevent direct access
if (basename($_SERVER['SCRIPT_FILENAME']) === 'env.php') {
    http_response_code(403);
    exit('Access denied');
}

// ==========================================
// SMTP2GO EMAIL SERVICE
// ==========================================
define('SMTP2GO_API_KEY', 'api-7D2432B374FE43778013AC83BE34E397');

// ==========================================
// GOOGLE RECAPTCHA / CLOUDFLARE TURNSTILE
// ==========================================
define('RECAPTCHA_SITE_KEY', '0x4AAAAAAASv9f9_Lz9rS72u');
define('RECAPTCHA_SECRET_KEY', '1x0000000000000000000000000000000AA');

// ==========================================
// GOOGLE MAPS API
// ==========================================
define('GOOGLE_MAPS_API_KEY', 'AIzaSyCr4wLLJHFc54QvFIrB6Jtk1P43vvoAK04');

// ==========================================
// EMAIL CONFIGURATION
// ==========================================
define('RECIPIENT_EMAIL', 'contactus@solomonselectric.com');
define('BCC_EMAIL', 'yaron@gettmarketing.com');
define('RECIPIENT_NAME', 'Solomon Electric');
define('SENDER_EMAIL', 'noreply@247electricianmiami.com');
define('SENDER_NAME', 'Solomon Electric Website');

// ==========================================
// COMPANY INFO
// ==========================================
define('COMPANY_NAME', 'Solomon Electric');
define('COMPANY_PHONE', '(786) 833-9211');
define('COMPANY_PHONE_RAW', '7868339211');
define('COMPANY_EMAIL', 'contactus@solomonselectric.com');
define('COMPANY_ADDRESS', '4036 N 29th Ave, Hollywood, FL 33020');
define('COMPANY_LICENSE', '#EC13012419');
define('WEBSITE_URL', 'https://www.247electricianmiami.com');

// ==========================================
// BRANDING COLORS
// ==========================================
define('BRAND_PRIMARY', '#0D4380');
define('BRAND_ACCENT', '#14D3E3');
define('BRAND_LIGHT', '#F3F3F3');

// ==========================================
// API ENDPOINTS
// ==========================================
define('SMTP2GO_API_URL', 'https://api.smtp2go.com/v3/email/send');
define('RECAPTCHA_VERIFY_URL', 'https://www.google.com/recaptcha/api/siteverify');
