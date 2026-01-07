<?php
/**
 * ========================================
 * SOLOMON ELECTRIC - ENVIRONMENT CONFIG
 * ========================================
 * 
 * SECURITY: This file should only be included, never accessed directly.
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to: env.php
 * 2. Replace ALL placeholder values below with your real keys
 * 3. Upload env.php to: public_html/api/env.php on server
 * 4. NEVER commit env.php to version control
 * 5. Keep env.php secure (blocked in .htaccess)
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
define('SMTP2GO_API_KEY', 'YOUR_SMTP2GO_API_KEY_HERE');

// ==========================================
// GOOGLE RECAPTCHA v3 (Invisible)
// Get keys from: https://www.google.com/recaptcha/admin
// Required for form spam protection
// ==========================================
define('RECAPTCHA_SITE_KEY', 'YOUR_RECAPTCHA_SITE_KEY_HERE');
define('RECAPTCHA_SECRET_KEY', 'YOUR_RECAPTCHA_SECRET_KEY_HERE');

// ==========================================
// GOOGLE MAPS API (Address Autocomplete)
// Get key from: https://console.cloud.google.com/apis/credentials
// Required APIs: Places API, Maps JavaScript API, Geocoding API
// ==========================================
define('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY_HERE');

// ==========================================
// EMAIL CONFIGURATION
// Primary recipient + BCC recipients
// ==========================================
define('RECIPIENT_EMAIL', 'your-email@yourdomain.com');
define('BCC_EMAIL', 'bcc1@example.com,bcc2@example.com'); // BCC recipients (comma separated)
define('RECIPIENT_NAME', 'Your Company Name');
define('SENDER_EMAIL', 'noreply@yourdomain.com');
define('SENDER_NAME', 'Your Company Name');

// ==========================================
// COMPANY INFO (Used in emails)
// ==========================================
define('COMPANY_NAME', 'Your Company Name');
define('COMPANY_PHONE', '(123) 456-7890');
define('COMPANY_PHONE_RAW', '1234567890');
define('COMPANY_EMAIL', 'your-email@yourdomain.com');
define('COMPANY_ADDRESS', '123 Main St, City, ST 12345');
define('COMPANY_LICENSE', '#XXXXXXX');
define('WEBSITE_URL', 'https://www.yourwebsite.com');

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
