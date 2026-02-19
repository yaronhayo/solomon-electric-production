<?php
/**
 * ========================================
 * ENVIRONMENT CONFIG - EXAMPLE TEMPLATE
 * ========================================
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to your server as: public_html/api/env.php
 * 2. Replace all PLACEHOLDER values with real credentials
 * 3. NEVER commit the real env.php file to Git
 * 
 * SECURITY NOTES:
 * - This example file is safe to commit (contains no real credentials)
 * - Real env.php must ONLY exist on production server
 * - Real env.php is blocked by .htaccess from direct web access
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
define('SMTP2GO_API_KEY', 'YOUR_SMTP2GO_API_KEY_HERE');

// ==========================================
// GOOGLE RECAPTCHA v3
// ==========================================
define('RECAPTCHA_SITE_KEY', 'YOUR_RECAPTCHA_SITE_KEY_HERE');
define('RECAPTCHA_SECRET_KEY', 'YOUR_RECAPTCHA_SECRET_KEY_HERE');

// ==========================================
// GOOGLE MAPS API
// ==========================================
define('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY_HERE');

// ==========================================
// EMAIL CONFIGURATION
// ==========================================
define('RECIPIENT_EMAIL', 'contact@yourcompany.com');
define('BCC_EMAIL', 'admin@yourcompany.com');
define('RECIPIENT_NAME', 'Your Company Name');
define('SENDER_EMAIL', 'noreply@yourdomain.com');
define('SENDER_NAME', 'Your Company Name');

// ==========================================
// COMPANY INFO
// ==========================================
define('COMPANY_NAME', 'Your Company Name');
define('COMPANY_PHONE', '(XXX) XXX-XXXX');
define('COMPANY_PHONE_RAW', 'XXXXXXXXXX');
define('COMPANY_EMAIL', 'contact@yourcompany.com');
define('COMPANY_ADDRESS', 'Your Address Here');
define('COMPANY_LICENSE', '#LICENSE_NUMBER');
define('WEBSITE_URL', 'https://www.yourdomain.com');

// ==========================================
// BRANDING COLORS
// ==========================================
define('BRAND_PRIMARY', '#000000');
define('BRAND_PRIMARY_DARK', '#000000');
define('BRAND_ACCENT', '#FFFFFF');
define('BRAND_ACCENT_DARK', '#CCCCCC');
define('BRAND_LIGHT', '#F3F3F3');
define('BRAND_DARK', '#111111');
define('BRAND_GOLD', '#CDAC4F');

// ==========================================
// API ENDPOINTS
// ==========================================
define('SMTP2GO_API_URL', 'https://api.smtp2go.com/v3/email/send');
define('RECAPTCHA_VERIFY_URL', 'https://www.google.com/recaptcha/api/siteverify');
