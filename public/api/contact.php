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
    'trafficSource' => isset($input['tracking_trafficSource']) ? sanitizeInput($input['tracking_trafficSource']) : 'Unknown',
    'newReturning' => isset($input['tracking_newReturning']) ? sanitizeInput($input['tracking_newReturning']) : 'Unknown'
];

// Current date/time in Eastern Time (Florida)
date_default_timezone_set('America/New_York');
$submittedDate = date('F j, Y');
$submittedTime = date('g:i A');
$clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

// =====================================================
// SOLOMON ELECTRIC BRAND SYSTEM
// =====================================================
// Primary: #0D4380 (Navy Blue)
// Accent: #14D3E3 (Electric Cyan)
// Light: #F3F3F3
// Dark: #111111
// Star Gold: #CDAC4F
// =====================================================

$brandPrimary = '#0D4380';
$brandAccent = '#14D3E3';
$brandLight = '#F3F3F3';
$brandDark = '#111111';
$brandGold = '#CDAC4F';
$logoUrl = WEBSITE_URL . '/logo.png';
$faviconUrl = WEBSITE_URL . '/favicon.svg';

// SOLOMON ELECTRIC EMAIL DESIGN SYSTEM
// Pixel-perfect responsive templates with brand consistency
$styles = "
    /* =====================================================
       RESET & BASE - Email Client Normalization
       ===================================================== */
    * { box-sizing: border-box; }
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    
    body, .body { 
        margin: 0 !important; 
        padding: 0 !important; 
        width: 100% !important; 
        min-width: 100% !important; 
        -webkit-text-size-adjust: 100%; 
        -ms-text-size-adjust: 100%; 
        background-color: $brandLight; 
        font-family: 'Outfit', 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
        font-size: 16px; 
        line-height: 1.6; 
        color: $brandDark;
    }
    
    /* =====================================================
       LAYOUT STRUCTURE
       ===================================================== */
    .email-wrapper { 
        width: 100% !important; 
        background-color: $brandLight; 
        padding: 32px 16px; 
        margin: 0; 
    }
    
    .email-container { 
        width: 100%; 
        max-width: 600px; 
        margin: 0 auto; 
        background-color: #ffffff; 
        border-radius: 4px;
        overflow: hidden; 
        box-shadow: 0 4px 24px rgba(13, 67, 128, 0.12);
        border-left: 4px solid $brandAccent;
    }
    
    /* =====================================================
       HEADER - Brand Gradient with Logo
       ===================================================== */
    .header { 
        background: linear-gradient(135deg, $brandPrimary 0%, #092d5a 100%); 
        padding: 40px 24px; 
        text-align: center; 
        color: #ffffff;
        position: relative;
    }
    
    .header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, $brandAccent, transparent);
    }
    
    .header img { 
        max-width: 180px; 
        height: auto; 
        margin-bottom: 16px; 
    }
    
    .header h1 { 
        margin: 0; 
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 24px; 
        font-weight: 700; 
        line-height: 1.3; 
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }
    
    .header-subtitle {
        margin: 8px 0 0 0;
        font-size: 13px;
        font-weight: 600;
        color: $brandAccent;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }
    
    /* =====================================================
       CONTENT SECTIONS
       ===================================================== */
    .section { 
        padding: 28px 24px; 
        background-color: #ffffff;
    }
    
    .section-title { 
        color: $brandPrimary; 
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 12px; 
        font-weight: 800; 
        text-transform: uppercase; 
        letter-spacing: 0.12em; 
        margin-bottom: 20px; 
        border-bottom: 2px solid $brandAccent; 
        display: inline-block; 
        padding-bottom: 6px; 
    }
    
    .data-row { 
        padding: 14px 0; 
        border-bottom: 1px solid #e5e7eb; 
    }
    
    .data-row:last-child { 
        border-bottom: none; 
    }
    
    .data-label { 
        color: #6b7280; 
        font-size: 11px; 
        font-weight: 700; 
        text-transform: uppercase; 
        letter-spacing: 0.08em; 
        margin-bottom: 4px; 
    }
    
    .data-value { 
        color: $brandDark; 
        font-size: 15px; 
        font-weight: 600; 
        word-break: break-word; 
        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .data-value a { 
        color: $brandPrimary; 
        text-decoration: none;
        font-weight: 700;
    }
    
    .message-box { 
        background: linear-gradient(135deg, rgba(20, 211, 227, 0.05) 0%, rgba(13, 67, 128, 0.03) 100%);
        padding: 20px; 
        border-radius: 8px; 
        border-left: 4px solid $brandAccent; 
        color: #374151; 
        font-size: 15px; 
        line-height: 1.7;
        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* =====================================================
       BADGES & STATUS INDICATORS
       ===================================================== */
    .badge { 
        display: inline-block; 
        padding: 5px 12px; 
        border-radius: 4px; 
        font-size: 10px; 
        font-weight: 800; 
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .badge-success { 
        background-color: #DCFCE7; 
        color: #166534; 
    }
    
    .badge-error { 
        background-color: #FEE2E2; 
        color: #991B1B; 
    }
    
    .badge-info {
        background-color: rgba(20, 211, 227, 0.2);
        color: $brandPrimary;
    }
    
    /* =====================================================
       ANALYTICS BOX - Marketing Data Display
       ===================================================== */
    .analytics-box { 
        background-color: #f8fafc; 
        border: 1px solid #e2e8f0; 
        padding: 20px; 
        border-radius: 8px; 
        margin-top: 20px; 
    }
    
    /* =====================================================
       CTA BUTTON - Brand Accent Styling
       ===================================================== */
    .cta-button { 
        display: inline-block; 
        background: linear-gradient(135deg, $brandAccent 0%, #10b8c6 100%); 
        color: $brandPrimary !important; 
        padding: 16px 32px; 
        border-radius: 4px; 
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 800; 
        font-size: 14px; 
        text-decoration: none; 
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        box-shadow: 0 4px 14px rgba(20, 211, 227, 0.4);
    }
    
    /* =====================================================
       FOOTER - Brand Navy Background
       ===================================================== */
    .footer { 
        background: linear-gradient(135deg, $brandPrimary 0%, #092d5a 100%); 
        padding: 28px 24px; 
        text-align: center; 
        color: rgba(255, 255, 255, 0.9); 
        font-size: 12px; 
        line-height: 1.6; 
    }
    
    .footer-brand {
        color: $brandAccent;
        font-weight: 700;
    }
    
    /* =====================================================
       MOBILE RESPONSIVE - 600px Breakpoint
       ===================================================== */
    @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 16px 12px !important; }
        .email-container { border-radius: 4px !important; }
        .header { padding: 28px 20px !important; }
        .header h1 { font-size: 20px !important; }
        .header img { max-width: 140px !important; }
        .section { padding: 24px 20px !important; }
        .section-title { font-size: 11px !important; }
        .data-value { font-size: 14px !important; }
        .message-box { padding: 16px !important; }
        table td { display: block !important; width: 100% !important; padding: 10px 0 !important; }
        .cta-button { display: block !important; width: 100% !important; padding: 18px 24px !important; }
        .footer { padding: 24px 20px !important; }
    }
    
    /* =====================================================
       DARK MODE - Apple Mail, iOS, macOS, Gmail
       Brand-tinted dark theme for consistency
       ===================================================== */
    @media (prefers-color-scheme: dark) {
        body, .body, .email-wrapper { 
            background-color: $brandDark !important; 
        }
        
        .email-container { 
            background-color: #1a1a1a !important; 
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4) !important;
            border-left-color: $brandAccent !important;
        }
        
        .header { 
            background: linear-gradient(135deg, #0a2d4d 0%, #061a2e 100%) !important; 
        }
        
        .section { 
            background-color: #1a1a1a !important; 
        }
        
        .section-title { 
            color: $brandAccent !important; 
            border-bottom-color: rgba(20, 211, 227, 0.5) !important; 
        }
        
        .data-row { 
            border-bottom-color: #2d2d2d !important; 
        }
        
        .data-label { 
            color: #9ca3af !important; 
        }
        
        .data-value { 
            color: #f1f5f9 !important; 
        }
        
        .data-value a { 
            color: $brandAccent !important; 
        }
        
        .message-box { 
            background: linear-gradient(135deg, rgba(20, 211, 227, 0.08) 0%, rgba(13, 67, 128, 0.05) 100%) !important;
            color: #e5e7eb !important; 
            border-left-color: $brandAccent !important; 
        }
        
        .analytics-box { 
            background-color: #252525 !important; 
            border-color: #3d3d3d !important; 
        }
        
        .footer { 
            background: linear-gradient(135deg, #0a2d4d 0%, #061a2e 100%) !important; 
        }
        
        .badge-success { 
            background-color: rgba(22, 101, 52, 0.3) !important; 
            color: #86efac !important; 
        }
        
        .badge-error { 
            background-color: rgba(153, 27, 27, 0.3) !important; 
            color: #fca5a5 !important; 
        }
        
        .badge-info {
            background-color: rgba(20, 211, 227, 0.2) !important;
            color: $brandAccent !important;
        }
        
        .cta-button {
            background: linear-gradient(135deg, $brandAccent 0%, #10b8c6 100%) !important;
            color: #ffffff !important;
        }
    }
    
    /* =====================================================
       OUTLOOK DARK MODE FIX
       ===================================================== */
    [data-ogsc] .email-container { background-color: #1a1a1a !important; }
    [data-ogsc] .data-value { color: #f1f5f9 !important; }
    [data-ogsc] .data-label { color: #9ca3af !important; }
    [data-ogsc] .section { background-color: #1a1a1a !important; }
    [data-ogsc] .message-box { background-color: #252525 !important; color: #e5e7eb !important; }
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
                        <td width='33%' style='padding-bottom: 15px;'>
                            <div class='data-label'>Source</div>
                            <div class='data-value'><span class='badge badge-info'>{$trackingData['trafficSource']}</span></div>
                        </td>
                        <td width='33%' style='padding-bottom: 15px;'>
                            <div class='data-label'>Visitor Type</div>
                            <div class='data-value'>{$trackingData['newReturning']}</div>
                        </td>
                        <td width='34%' style='padding-bottom: 15px;'>
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
