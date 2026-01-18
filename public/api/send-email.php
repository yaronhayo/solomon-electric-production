<?php
/**
 * Service Request Form Handler (Booking Form)
 * Solomon Electric - Optimized for accurate analytics and dark/light mode aesthetics
 */

require_once __DIR__ . '/email-config.php';

setCorsHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get form data (supports both FormData and JSON)
$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
} else {
    $input = $_POST;
}

// Required fields
$requiredFields = ['serviceType', 'address', 'urgency', 'name', 'phone'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit();
    }
}

// Verify reCAPTCHA
if (!empty($input['g-recaptcha-response'])) {
    if (!verifyRecaptcha($input['g-recaptcha-response'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Security verification failed']);
        exit();
    }
}

// Sanitize inputs
$serviceType = sanitizeInput($input['serviceType']);
$serviceTypeFormatted = ucwords(str_replace('_', ' ', $serviceType));
$serviceDetails = isset($input['serviceDetails']) ? sanitizeInput($input['serviceDetails']) : 'None provided';
$address = sanitizeInput($input['address']);
$aptUnit = isset($input['aptUnit']) ? sanitizeInput($input['aptUnit']) : '';
$gateCode = isset($input['gateCode']) ? sanitizeInput($input['gateCode']) : '';
$urgency = sanitizeInput($input['urgency']);
$name = sanitizeInput($input['name']);
$phone = sanitizeInput($input['phone']);
$email = isset($input['email']) && !empty($input['email']) ? sanitizeInput($input['email']) : null;

// Tracking Data
$trackingData = [
    'sessionStart' => isset($input['tracking_sessionStart']) ? sanitizeInput($input['tracking_sessionStart']) : 'N/A',
    'timeOnSite' => isset($input['tracking_timeOnSite']) ? sanitizeInput($input['tracking_timeOnSite']) : '0',
    'currentUrl' => isset($input['tracking_currentUrl']) ? sanitizeInput($input['tracking_currentUrl']) : 'N/A',
    'referrer' => isset($input['tracking_referrer']) ? sanitizeInput($input['tracking_referrer']) : 'Direct',
    'clickPath' => isset($input['tracking_clickPath']) ? sanitizeInput($input['tracking_clickPath']) : 'N/A',
    'deviceType' => isset($input['tracking_deviceType']) ? sanitizeInput($input['tracking_deviceType']) : 'Unknown',
    'cookiesAccepted' => isset($input['tracking_cookiesAccepted']) ? ($input['tracking_cookiesAccepted'] === 'true' ? 'Yes' : 'No') : 'Unknown',
    'consentTimestamp' => isset($input['tracking_consentTimestamp']) ? sanitizeInput($input['tracking_consentTimestamp']) : 'N/A',
    'recaptchaVerified' => isset($input['tracking_recaptchaVerified']) ? ($input['tracking_recaptchaVerified'] === 'true' ? 'Yes ✓' : 'No') : 'No',
    'trafficSource' => isset($input['tracking_trafficSource']) ? sanitizeInput($input['tracking_trafficSource']) : 'Unknown',
    'utmSource' => isset($input['tracking_utmSource']) ? sanitizeInput($input['tracking_utmSource']) : 'N/A',
    'utmMedium' => isset($input['tracking_utmMedium']) ? sanitizeInput($input['tracking_utmMedium']) : 'N/A',
    'utmCampaign' => isset($input['tracking_utmCampaign']) ? sanitizeInput($input['tracking_utmCampaign']) : 'N/A',
    'gclid' => isset($input['tracking_gclid']) && $input['tracking_gclid'] !== 'null' ? sanitizeInput($input['tracking_gclid']) : null
];

// Formatting
date_default_timezone_set('America/New_York');
$submittedDate = date('F j, Y');
$submittedTime = date('g:i A');
$clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

// Branding
$brandPrimary = BRAND_PRIMARY;
$brandAccent = BRAND_ACCENT;
$logoUrl = WEBSITE_URL . '/logo.png';

// SHARED STYLES FOR DARK/LIGHT MODE - FULLY RESPONSIVE
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
    .urgency-asap { display: inline-block; background-color: #DC2626; color: #ffffff !important; padding: 6px 14px; border-radius: 4px; font-size: 12px; font-weight: 700; }
    .urgency-standard { display: inline-block; background-color: #E0F2FE; color: $brandPrimary !important; padding: 6px 14px; border-radius: 4px; font-size: 12px; font-weight: 700; }
    .analytics-box { background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 16px; border-radius: 8px; margin-top: 16px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-success { background-color: #DCFCE7; color: #166534; }
    .badge-error { background-color: #FEE2E2; color: #991B1B; }
    .footer { background-color: $brandPrimary; padding: 24px 20px; text-align: center; color: #ffffff; font-size: 12px; line-height: 1.5; }
    .cta-button { display: inline-block; background-color: $brandAccent; color: $brandPrimary !important; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 16px; text-decoration: none; text-align: center; }
    .emergency-box { background-color: #f0fdfa; border: 2px solid $brandAccent; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
    .emergency-box h3 { margin: 0 0 8px 0; color: $brandPrimary; font-size: 18px; }
    .emergency-box p { margin: 0 0 16px 0; color: #444444; }
    
    /* Mobile Responsive */
    @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 10px 8px !important; }
        .email-container { border-radius: 8px !important; }
        .header { padding: 24px 16px !important; }
        .header h1 { font-size: 20px !important; }
        .section { padding: 20px 16px !important; }
        .section-title { font-size: 12px !important; }
        .data-value { font-size: 14px !important; }
        table td { display: block !important; width: 100% !important; padding: 8px 0 !important; }
        .cta-button { display: block !important; width: 100% !important; padding: 16px 20px !important; }
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
        .analytics-box { background-color: #363636 !important; border-color: #4a4a4a !important; }
        .emergency-box { background-color: #1a3a3a !important; border-color: $brandAccent !important; }
        .emergency-box h3 { color: $brandAccent !important; }
        .emergency-box p { color: #cccccc !important; }
        .footer { background-color: #1a3a5c !important; }
        .badge-success { background-color: #166534 !important; color: #DCFCE7 !important; }
        .badge-error { background-color: #991B1B !important; color: #FEE2E2 !important; }
        .urgency-standard { background-color: #1a3a5c !important; color: $brandAccent !important; }
    }
    
    /* Outlook Dark Mode Fix */
    [data-ogsc] .email-container { background-color: #2d2d2d !important; }
    [data-ogsc] .data-value { color: #f0f0f0 !important; }
    [data-ogsc] .data-label { color: #a0a0a0 !important; }
";


// LEAD EMAIL
$urgencyClass = $urgency === 'ASAP' ? 'urgency-asap' : 'urgency-standard';
$leadEmailHtml = "
<!DOCTYPE html>
<html>
<head><style>$styles</style></head>
<body>
<div class='email-wrapper'>
    <div class='email-container'>
        <div class='header'>
            <img src='$logoUrl' alt='Solomon Electric' style='height: 50px; margin-bottom: 15px;'>
            <h1 style='margin: 0; font-size: 24px;'>⚡ New Lead Alert</h1>
        </div>
        
        <div class='section' style='background-color: " . ($urgency === 'ASAP' ? '#FEF2F2' : '#ffffff') . ";'>
            <div class='section-title'>Service Information</div>
            <div class='data-row'>
                <div class='data-label'>Urgency</div>
                <div class='data-value'><span class='$urgencyClass'>$urgency</span></div>
            </div>
            <div class='data-row'>
                <div class='data-label'>Service Type</div>
                <div class='data-value'>$serviceTypeFormatted</div>
            </div>
            <div class='data-row'>
                <div class='data-label'>Address</div>
                <div class='data-value'>📍 $address " . ($aptUnit ? " (Unit $aptUnit)" : "") . "</div>
            </div>
            <div class='data-row' style='border: none;'>
                <div class='data-label'>Details</div>
                <div style='color: #444; font-size: 14px; margin-top: 5px; line-height: 1.5;'>$serviceDetails</div>
            </div>
        </div>
        
        <div class='section' style='border-top: 8px solid #F3F3F3;'>
            <div class='section-title'>Customer Contact</div>
            <div class='data-row'>
                <div class='data-label'>Name</div>
                <div class='data-value'>$name</div>
            </div>
            <div class='data-row'>
                <div class='data-label'>Phone</div>
                <div class='data-value'><a href='tel:$phone' style='color: $brandAccent; text-decoration: none;'>📞 $phone</a></div>
            </div>
            <div class='data-row' style='border-bottom: none;'>
                <div class='data-label'>Email</div>
                <div class='data-value'>" . ($email ?: 'Not provided') . "</div>
            </div>
        </div>

        <div class='section' style='background-color: #fafafa; border-top: 8px solid #F3F3F3;'>
            <div class='section-title'>📊 Marketing Analytics</div>
            <div class='analytics-box'>
                <table width='100%' cellspacing='0' cellpadding='0'>
                    <tr>
                        <td width='50%' style='padding-bottom: 15px;'>
                            <div class='data-label'>Traffic Source</div>
                            <div class='data-value'>{$trackingData['trafficSource']}</div>
                        </td>
                        <td width='50%' style='padding-bottom: 15px;'>
                            <div class='data-label'>Time on Site</div>
                            <div class='data-value'>{$trackingData['timeOnSite']}s</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan='2' style='padding-bottom: 15px;'>
                            <div class='data-label'>UTM Journey</div>
                            <div style='font-size: 11px; color: #666;'>
                                Source: {$trackingData['utmSource']} • Medium: {$trackingData['utmMedium']} • Campaign: {$trackingData['utmCampaign']}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td width='50%'>
                            <div class='data-label'>Cookies Accepted</div>
                            <div class='data-value'>" . ($trackingData['cookiesAccepted'] === 'Yes' ? "<span class='badge badge-success'>Yes</span>" : "<span class='badge badge-error'>No</span>") . "</div>
                        </td>
                        <td width='50%'>
                            <div class='data-label'>reCAPTCHA Security</div>
                            <div class='data-value'>" . ($trackingData['recaptchaVerified'] === 'Yes ✓' ? "<span class='badge badge-success'>Verified</span>" : "<span class='badge badge-error'>Unverified</span>") . "</div>
                        </td>
                    </tr>
                </table>
                <div style='margin-top: 15px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px;'>
                    IP: $clientIp • Device: {$trackingData['deviceType']} • Consent Date: {$trackingData['consentTimestamp']}
                </div>
            </div>
        </div>
        
        <div class='footer'>
            Submitted on $submittedDate at $submittedTime Florida Time
        </div>
    </div>
</div>
</body>
</html>
";

// AUTO-RESPONDER EMAIL
$firstName = explode(' ', $name)[0];
$autoresponderHtml = "
<!DOCTYPE html>
<html>
<head><style>$styles</style></head>
<body>
<div class='email-wrapper'>
    <div class='email-container'>
        <div class='header'>
            <img src='$logoUrl' alt='Solomon Electric' style='height: 60px; margin-bottom: 15px;'>
            <h1 style='margin: 0; font-size: 28px;'>Request Received ✓</h1>
        </div>
        
        <div class='section' style='text-align: center;'>
            <p style='font-size: 18px; color: #333;'>Thank you for choosing Solomon Electric, <strong>$firstName</strong>!</p>
            <p style='color: #666; line-height: 1.6;'>We've received your request for <strong>$serviceTypeFormatted</strong>. One of our licensed electricians will call you shortly to discuss the details and schedule your visit.</p>
            
            <div style='background-color: #f0fdfa; border: 2px solid $brandAccent; border-radius: 12px; padding: 20px; margin: 30px 0;'>
                <h3 style='margin-top: 0; color: $brandPrimary;'>Emergency?</h3>
                <p style='color: #444;'>If this is an immediate emergency, call us right now:</p>
                <a href='tel:7868339211' style='display: inline-block; background-color: $brandAccent; color: $brandPrimary; padding: 15px 30px; border-radius: 8px; font-weight: 800; text-decoration: none;'>📞 (786) 833-9211</a>
            </div>
        </div>
        
        <div class='footer'>
            $brandPrimary Solomon Electric • 4036 N 29th Ave, Hollywood, FL 33020
        </div>
    </div>
</div>
</body>
</html>
";

// Send Lead
$leadSubject = "⚡ New Lead: $serviceTypeFormatted" . ($urgency === 'ASAP' ? ' [URGENT]' : '') . " - $name";
$leadResult = sendEmailViaSMTP2GO($leadSubject, $leadEmailHtml, $email);

// Send Autoresponder
if ($email) {
    sendAutoresponder($email, $name, "We've Received Your Request - Solomon Electric", $autoresponderHtml);
}

echo json_encode(['success' => $leadResult['success'], 'message' => $leadResult['message']]);
