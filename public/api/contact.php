<?php
/**
 * Generic Contact Form Handler
 * Solomon Electric - optimized for accurate tracking and refined email aesthetics
 */

require_once __DIR__ . '/email-config.php';

setCorsHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

// Get form data (supports both FormData and JSON)
$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';

if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
} else {
    $input = $_POST;
}

// Required fields for contact form
$requiredFields = ['name', 'phone', 'message'];

foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit();
    }
}

// Verify reCAPTCHA if token provided
if (!empty($input['g-recaptcha-response'])) {
    if (!verifyRecaptcha($input['g-recaptcha-response'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Security verification failed']);
        exit();
    }
}

// Sanitize all inputs
$name = sanitizeInput($input['name']);
$email = isset($input['email']) && !empty($input['email']) ? sanitizeInput($input['email']) : null;
$phone = sanitizeInput($input['phone']);
$messageBody = sanitizeInput($input['message']);

// Extract tracking data (sent from frontend with tracking_ prefix)
$trackingData = [
    'sessionStart' => isset($input['tracking_sessionStart']) ? sanitizeInput($input['tracking_sessionStart']) : 'N/A',
    'timeOnSite' => isset($input['tracking_timeOnSite']) ? sanitizeInput($input['tracking_timeOnSite']) : '0',
    'currentUrl' => isset($input['tracking_currentUrl']) ? sanitizeInput($input['tracking_currentUrl']) : 'N/A',
    'referrer' => isset($input['tracking_referrer']) ? sanitizeInput($input['tracking_referrer']) : 'Direct',
    'clickPath' => isset($input['tracking_clickPath']) ? sanitizeInput($input['tracking_clickPath']) : 'N/A',
    'userAgent' => isset($input['tracking_userAgent']) ? sanitizeInput($input['tracking_userAgent']) : 'N/A',
    'deviceType' => isset($input['tracking_deviceType']) ? sanitizeInput($input['tracking_deviceType']) : 'Unknown',
    'screenResolution' => isset($input['tracking_screenResolution']) ? sanitizeInput($input['tracking_screenResolution']) : 'N/A',
    'language' => isset($input['tracking_language']) ? sanitizeInput($input['tracking_language']) : 'N/A',
    'cookiesAccepted' => isset($input['tracking_cookiesAccepted']) ? ($input['tracking_cookiesAccepted'] === 'true' ? 'Yes' : 'No') : 'Unknown',
    'consentTimestamp' => isset($input['tracking_consentTimestamp']) ? sanitizeInput($input['tracking_consentTimestamp']) : 'N/A',
    'recaptchaVerified' => isset($input['tracking_recaptchaVerified']) ? ($input['tracking_recaptchaVerified'] === 'true' ? 'Yes ✓' : 'No') : 'No',
    'utmSource' => isset($input['tracking_utmSource']) ? sanitizeInput($input['tracking_utmSource']) : 'N/A',
    'utmMedium' => isset($input['tracking_utmMedium']) ? sanitizeInput($input['tracking_utmMedium']) : 'N/A',
    'utmCampaign' => isset($input['tracking_utmCampaign']) ? sanitizeInput($input['tracking_utmCampaign']) : 'N/A',
    'gclid' => isset($input['tracking_gclid']) && $input['tracking_gclid'] !== 'null' ? sanitizeInput($input['tracking_gclid']) : null,
    'trafficSource' => isset($input['tracking_trafficSource']) ? sanitizeInput($input['tracking_trafficSource']) : 'Unknown'
];

// Current date/time in Eastern Time (Florida)
date_default_timezone_set('America/New_York');
$submittedDate = date('F j, Y');
$submittedTime = date('g:i A');
$clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

// Get branding
$brandPrimary = BRAND_PRIMARY;
$brandAccent = BRAND_ACCENT;
$logoUrl = WEBSITE_URL . '/logo.png';

// EMAIL TEMPLATE HELPERS - FULLY RESPONSIVE
$styles = "
    /* Reset & Base */
    * { box-sizing: border-box; }
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    body, .body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #F3F3F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; }
    .email-wrapper { width: 100% !important; background-color: #F3F3F3; padding: 20px 10px; margin: 0; }
    .email-container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, $brandPrimary 0%, #0a3a6e 100%); padding: 32px 20px; text-align: center; color: #ffffff; }
    .header img { max-width: 150px; height: auto; margin-bottom: 12px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; line-height: 1.3; }
    .section { padding: 24px 20px; }
    .section-title { color: $brandPrimary; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; border-bottom: 2px solid $brandAccent; display: inline-block; padding-bottom: 4px; }
    .data-row { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .data-row:last-child { border-bottom: none; }
    .data-label { color: #888888; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .data-value { color: #333333; font-size: 15px; font-weight: 600; word-break: break-word; }
    .data-value a { color: $brandAccent; text-decoration: none; }
    .message-box { background-color: #f9f9f9; padding: 16px; border-radius: 8px; border-left: 4px solid $brandAccent; color: #444444; font-size: 15px; line-height: 1.6; }
    .analytics-box { background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 16px; border-radius: 8px; margin-top: 16px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-success { background-color: #DCFCE7; color: #166534; }
    .badge-error { background-color: #FEE2E2; color: #991B1B; }
    .badge-info { background-color: #E0F2FE; color: #075985; }
    .footer { background-color: $brandPrimary; padding: 24px 20px; text-align: center; color: #ffffff; font-size: 12px; line-height: 1.5; }
    
    /* Mobile Responsive */
    @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 10px 8px !important; }
        .email-container { border-radius: 8px !important; }
        .header { padding: 24px 16px !important; }
        .header h1 { font-size: 20px !important; }
        .section { padding: 20px 16px !important; }
        .section-title { font-size: 12px !important; }
        .data-value { font-size: 14px !important; }
        .message-box { padding: 12px !important; }
        table td { display: block !important; width: 100% !important; padding: 8px 0 !important; }
        .footer { padding: 20px 16px !important; }
    }
    
    /* Dark Mode Support - Apple Mail, iOS, macOS */
    @media (prefers-color-scheme: dark) {
        body, .body, .email-wrapper { background-color: #1a1a1a !important; }
        .email-container { background-color: #2d2d2d !important; box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important; }
        .header { background: linear-gradient(135deg, #1a3a5c 0%, #0d1f33 100%) !important; }
        .section { background-color: #2d2d2d !important; }
        .section-title { color: $brandAccent !important; border-bottom-color: $brandAccent !important; }
        .data-row { border-bottom-color: #404040 !important; }
        .data-label { color: #a0a0a0 !important; }
        .data-value { color: #f0f0f0 !important; }
        .data-value a { color: $brandAccent !important; }
        .message-box { background-color: #363636 !important; color: #e0e0e0 !important; border-left-color: $brandAccent !important; }
        .analytics-box { background-color: #363636 !important; border-color: #4a4a4a !important; }
        .footer { background-color: #1a3a5c !important; }
        .badge-success { background-color: #166534 !important; color: #DCFCE7 !important; }
        .badge-error { background-color: #991B1B !important; color: #FEE2E2 !important; }
        .badge-info { background-color: #075985 !important; color: #E0F2FE !important; }
    }
    
    /* Outlook Dark Mode Fix */
    [data-ogsc] .email-container { background-color: #2d2d2d !important; }
    [data-ogsc] .data-value { color: #f0f0f0 !important; }
    [data-ogsc] .data-label { color: #a0a0a0 !important; }
";


// LEAD EMAIL
$leadEmailHtml = "
<!DOCTYPE html>
<html>
<head>
    <style>$styles</style>
</head>
<body>
<div class='email-wrapper'>
    <div class='email-container'>
        <div class='header'>
            <img src='$logoUrl' alt='Solomon Electric' style='height: 50px; margin-bottom: 15px;'>
            <h1 style='margin: 0; font-size: 24px;'>New Contact Message</h1>
        </div>
        
        <div class='section'>
            <div class='section-title'>Customer Details</div>
            <div class='data-row'>
                <div class='data-label'>Name</div>
                <div class='data-value'>$name</div>
            </div>
            <div class='data-row'>
                <div class='data-label'>Phone</div>
                <div class='data-value'><a href='tel:$phone' style='color: $brandAccent; text-decoration: none;'>$phone</a></div>
            </div>
            <div class='data-row'>
                <div class='data-label'>Email</div>
                <div class='data-value'>" . ($email ?: 'N/A') . "</div>
            </div>
            
            <div class='section-title' style='margin-top: 30px;'>Message</div>
            <div class='message-box'>$messageBody</div>
        </div>
        
        <div class='section' style='background-color: #fafafa; padding-top: 20px;'>
            <div class='section-title'>📊 Marketing & Analytics</div>
            <div class='analytics-box'>
                <table width='100%' cellspacing='0' cellpadding='0'>
                    <tr>
                        <td width='50%' style='padding-bottom: 15px;'>
                            <div class='data-label'>Source</div>
                            <div class='data-value'><span class='badge badge-info'>{$trackingData['trafficSource']}</span></div>
                        </td>
                        <td width='50%' style='padding-bottom: 15px;'>
                            <div class='data-label'>Session Time</div>
                            <div class='data-value'>{$trackingData['timeOnSite']}s</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan='2' style='padding-bottom: 15px;'>
                            <div class='data-label'>UTM Data</div>
                            <div style='font-size: 11px; color: #666;'>
                                S: {$trackingData['utmSource']} | M: {$trackingData['utmMedium']} | C: {$trackingData['utmCampaign']}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td width='50%'>
                            <div class='data-label'>Cookies</div>
                            <div class='data-value'>" . ($trackingData['cookiesAccepted'] === 'Yes' ? "<span class='badge badge-success'>Accepted</span>" : "<span class='badge badge-error'>Declined</span>") . "</div>
                        </td>
                        <td width='50%'>
                            <div class='data-label'>reCAPTCHA</div>
                            <div class='data-value'>" . ($trackingData['recaptchaVerified'] === 'Yes ✓' ? "<span class='badge badge-success'>Verified</span>" : "<span class='badge badge-error'>Failed</span>") . "</div>
                        </td>
                    </tr>
                </table>
                <div style='margin-top: 15px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px;'>
                    IP: $clientIp | User Agent: {$trackingData['deviceType']} | Consent: {$trackingData['consentTimestamp']}
                </div>
            </div>
        </div>
        
        <div class='footer'>
            Submitted on $submittedDate at $submittedTime Florida Time<br>
            Tracking ID: " . uniqid('LEAD_') . "
        </div>
    </div>
</div>
</body>
</html>
";

// Send email
$subject = "✉️ Contact Form: $name";
$replyTo = $email ?: null;
$result = sendEmailViaSMTP2GO($subject, $leadEmailHtml, $replyTo);

if ($result['success']) {
    echo json_encode(['status' => 'success', 'message' => 'Message sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to send message', 'debug' => $result]);
}
