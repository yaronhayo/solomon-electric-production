<?php
/**
 * ========================================
 * SOLOMON ELECTRIC - ENVIRONMENT CONFIG
 * ========================================
 * 
 * SECURITY: This file should only be included, never accessed directly.
 * 
 * INSTRUCTIONS:
 * 1. Replace ALL placeholder values below with your real keys
 * 2. Upload this file to: public_html/api/env.php
 * 3. DO NOT commit real keys to version control
 * 4. Keep this file secure (blocked in .htaccess)
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
// Get your API key from: https://app.smtp2go.com/settings/api_keys/
// ==========================================
define('SMTP2GO_API_KEY', 'api-7D2432B374FE43778013AC83BE34E397');

// ==========================================
// GOOGLE RECAPTCHA v3 (Invisible)
// Get keys from: https://www.google.com/recaptcha/admin
// Required for form spam protection
// ==========================================
define('RECAPTCHA_SITE_KEY', '6LeDDjUsAAAAAEJquohduwPouri3rOne3ahYp765');
define('RECAPTCHA_SECRET_KEY', '6LeDDjUsAAAAAIzvR7AaBHn89DiFfejtYuL5afwf');

// ==========================================
// GOOGLE MAPS API (Address Autocomplete)
// Get key from: https://console.cloud.google.com/apis/credentials
// Required APIs: Places API, Maps JavaScript API, Geocoding API
// ==========================================
define('GOOGLE_MAPS_API_KEY', 'AIzaSyCPUa0e_IB0rB5UeJrWa3__Lohkm7HB9hY');

// ==========================================
// EMAIL CONFIGURATION
// Primary recipient + BCC recipients
// ==========================================
define('RECIPIENT_EMAIL', 'contactus@solomonselectric.com');
define('BCC_EMAIL', 'yaron@gettmarketing.com,sandrahmarketing@gmail.com'); // BCC recipients
define('RECIPIENT_NAME', 'Solomon Electric');
define('SENDER_EMAIL', 'noreply@247electricianmiami.com');
define('SENDER_NAME', 'Solomon Electric');

// ==========================================
// COMPANY INFO (Used in emails)
// ==========================================
define('COMPANY_NAME', 'Solomon Electric');
define('COMPANY_PHONE', '(786) 833-9211');
define('COMPANY_PHONE_RAW', '7868339211');
define('COMPANY_EMAIL', 'contactus@solomonselectric.com');
define('COMPANY_ADDRESS', '4036 N 29th Ave, Hollywood, FL 33020');
define('COMPANY_LICENSE', '#EC13012419');
define('WEBSITE_URL', 'https://www.247electricianmiami.com');

// ==========================================
// BRANDING COLORS (Used in email templates)
// ==========================================
define('BRAND_PRIMARY', '#0D4380');
define('BRAND_ACCENT', '#14D3E3');
define('BRAND_LIGHT', '#F3F3F3');

// ==========================================
// API ENDPOINTS
// ==========================================
define('SMTP2GO_API_URL', 'https://api.smtp2go.com/v3/email/send');
define('RECAPTCHA_VERIFY_URL', 'https://www.google.com/recaptcha/api/siteverify');
