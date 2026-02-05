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
$zipCode = isset($input['zipCode']) ? sanitizeInput($input['zipCode']) : '';
$city = isset($input['city']) ? sanitizeInput($input['city']) : '';
$state = isset($input['state']) ? sanitizeInput($input['state']) : '';
$urgency = sanitizeInput($input['urgency']);
$name = sanitizeInput($input['name']);
$phone = sanitizeInput($input['phone']);
$email = isset($input['email']) && !empty($input['email']) ? sanitizeInput($input['email']) : null;

// Tracking Data - Comprehensive Marketing Analytics
$trackingData = [
    'sessionStart' => isset($input['tracking_sessionStart']) ? sanitizeInput($input['tracking_sessionStart']) : 'N/A',
    'timeOnSite' => isset($input['tracking_timeOnSite']) ? sanitizeInput($input['tracking_timeOnSite']) : '0',
    'currentUrl' => isset($input['tracking_currentUrl']) ? sanitizeInput($input['tracking_currentUrl']) : 'N/A',
    'referrer' => isset($input['tracking_referrer']) ? sanitizeInput($input['tracking_referrer']) : 'Direct',
    'clickPath' => isset($input['tracking_clickPath']) ? sanitizeInput($input['tracking_clickPath']) : 'N/A',
    'deviceType' => isset($input['tracking_deviceType']) ? sanitizeInput($input['tracking_deviceType']) : 'Unknown',
    'screenResolution' => isset($input['tracking_screenResolution']) ? sanitizeInput($input['tracking_screenResolution']) : 'N/A',
    'userAgent' => isset($input['tracking_userAgent']) ? sanitizeInput($input['tracking_userAgent']) : $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
    'language' => isset($input['tracking_language']) ? sanitizeInput($input['tracking_language']) : 'N/A',
    'cookiesAccepted' => isset($input['tracking_cookiesAccepted']) ? ($input['tracking_cookiesAccepted'] === 'true' ? 'Yes' : 'No') : 'Unknown',
    'consentTimestamp' => isset($input['tracking_consentTimestamp']) ? sanitizeInput($input['tracking_consentTimestamp']) : 'N/A',
    'recaptchaVerified' => !empty($input['g-recaptcha-response']) ? 'Yes ✓' : 'No',
    'trafficSource' => isset($input['tracking_trafficSource']) ? sanitizeInput($input['tracking_trafficSource']) : 'Unknown',
    'utmSource' => isset($input['tracking_utmSource']) ? sanitizeInput($input['tracking_utmSource']) : 'N/A',
    'utmMedium' => isset($input['tracking_utmMedium']) ? sanitizeInput($input['tracking_utmMedium']) : 'N/A',
    'utmCampaign' => isset($input['tracking_utmCampaign']) ? sanitizeInput($input['tracking_utmCampaign']) : 'N/A',
    'gclid' => isset($input['tracking_gclid']) && $input['tracking_gclid'] !== 'null' ? sanitizeInput($input['tracking_gclid']) : null,
    'newReturning' => isset($input['tracking_newReturning']) ? sanitizeInput($input['tracking_newReturning']) : 'Unknown'
];

// Enhanced traffic source detection based on referrer
$referrer = $trackingData['referrer'];
if ($trackingData['trafficSource'] === 'Unknown' || $trackingData['trafficSource'] === 'Referral') {
    if (stripos($referrer, 'business.google.com') !== false || stripos($referrer, 'business.google') !== false) {
        $trackingData['trafficSource'] = 'Google Business Profile';
    } elseif (stripos($referrer, 'google.com/maps') !== false || stripos($referrer, 'maps.google.com') !== false) {
        $trackingData['trafficSource'] = 'Google Maps';
    } elseif (stripos($referrer, 'google.com') !== false && empty($trackingData['gclid'])) {
        $trackingData['trafficSource'] = 'Google Organic';
    } elseif (stripos($referrer, 'bing.com') !== false) {
        $trackingData['trafficSource'] = 'Bing Organic';
    } elseif (stripos($referrer, 'facebook.com') !== false) {
        $trackingData['trafficSource'] = 'Facebook';
    } elseif (stripos($referrer, 'instagram.com') !== false) {
        $trackingData['trafficSource'] = 'Instagram';
    } elseif (stripos($referrer, 'yelp.com') !== false) {
        $trackingData['trafficSource'] = 'Yelp';
    } elseif (!empty($referrer) && $referrer !== 'Direct') {
        $trackingData['trafficSource'] = 'Referral: ' . parse_url($referrer, PHP_URL_HOST);
    } elseif (empty($referrer) || $referrer === 'Direct') {
        $trackingData['trafficSource'] = 'Direct';
    }
}

// Formatting
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
        border-radius: 4px; /* Brand uses subtle radius */
        overflow: hidden; 
        box-shadow: 0 4px 24px rgba(13, 67, 128, 0.12); /* Navy-tinted shadow */
        border-left: 4px solid $brandAccent; /* Signature accent stripe */
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
    
    .data-value a:hover {
        color: $brandAccent;
    }
    
    /* =====================================================
       BADGES & STATUS INDICATORS
       ===================================================== */
    .urgency-asap { 
        display: inline-block; 
        background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); 
        color: #ffffff !important; 
        padding: 8px 16px; 
        border-radius: 4px; 
        font-size: 12px; 
        font-weight: 800; 
        text-transform: uppercase;
        letter-spacing: 0.05em;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
    }
    
    .urgency-standard { 
        display: inline-block; 
        background-color: rgba(20, 211, 227, 0.15); 
        color: $brandPrimary !important; 
        padding: 8px 16px; 
        border-radius: 4px; 
        font-size: 12px; 
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
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
       EMERGENCY BOX - Highlighted Call-to-Action
       ===================================================== */
    .emergency-box { 
        background: linear-gradient(135deg, rgba(20, 211, 227, 0.08) 0%, rgba(13, 67, 128, 0.05) 100%);
        border: 2px solid $brandAccent; 
        border-radius: 8px; 
        padding: 28px 24px; 
        margin: 28px 0; 
        text-align: center; 
    }
    
    .emergency-box h3 { 
        margin: 0 0 10px 0; 
        color: $brandPrimary; 
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }
    
    .emergency-box p { 
        margin: 0 0 20px 0; 
        color: #4b5563;
        font-size: 15px;
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
        table td { display: block !important; width: 100% !important; padding: 10px 0 !important; }
        .cta-button { display: block !important; width: 100% !important; padding: 18px 24px !important; }
        .footer { padding: 24px 20px !important; }
        .emergency-box { padding: 24px 20px !important; margin: 24px 0 !important; }
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
        
        .analytics-box { 
            background-color: #252525 !important; 
            border-color: #3d3d3d !important; 
        }
        
        .emergency-box { 
            background: linear-gradient(135deg, rgba(20, 211, 227, 0.1) 0%, rgba(13, 67, 128, 0.1) 100%) !important;
            border-color: $brandAccent !important; 
        }
        
        .emergency-box h3 { 
            color: $brandAccent !important; 
        }
        
        .emergency-box p { 
            color: #d1d5db !important; 
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
        
        .urgency-standard { 
            background-color: rgba(20, 211, 227, 0.15) !important; 
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
                <div class='data-value'>📍 $address" . ($aptUnit ? " (Unit $aptUnit)" : "") . "</div>
            </div>
            <div class='data-row'>
                <div class='data-label'>City / State / Zip</div>
                <div class='data-value'>" . ($city ? "$city, " : "") . ($state ?: "") . " " . ($zipCode ?: "(zip not provided)") . "</div>
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
            <div class='section-title'>📊 Marketing & Analytics</div>
            <div class='analytics-box'>
                <!-- Traffic Source & Attribution -->
                <table width='100%' cellspacing='0' cellpadding='0' style='margin-bottom: 16px;'>
                    <tr>
                        <td width='50%' style='padding-bottom: 12px;'>
                            <div class='data-label'>🎯 Traffic Source</div>
                            <div class='data-value'>{$trackingData['trafficSource']}</div>
                        </td>
                        <td width='50%' style='padding-bottom: 12px;'>
                            <div class='data-label'>👤 Visitor Type</div>
                            <div class='data-value'>{$trackingData['newReturning']}</div>
                        </td>
                    </tr>
                    <tr>
                        <td width='50%' style='padding-bottom: 12px;'>
                            <div class='data-label'>📱 Device Type</div>
                            <div class='data-value'>{$trackingData['deviceType']}</div>
                        </td>
                        <td width='50%' style='padding-bottom: 12px;'>
                            <div class='data-label'>⏱️ Time on Site</div>
                            <div class='data-value'>{$trackingData['timeOnSite']} seconds</div>
                        </td>
                    </tr>
                </table>
                
                <!-- Click Path -->
                <div style='margin-bottom: 16px; padding: 12px; background-color: #fff; border-radius: 6px; border: 1px solid #e9ecef;'>
                    <div class='data-label'>🛤️ Click Path (User Journey)</div>
                    <div style='font-size: 12px; color: #555; margin-top: 6px; word-break: break-word; font-family: monospace;'>{$trackingData['clickPath']}</div>
                </div>
                
                <!-- Referrer -->
                <div style='margin-bottom: 16px;'>
                    <div class='data-label'>🔗 Referrer / Landing Source</div>
                    <div style='font-size: 12px; color: #555; margin-top: 4px; word-break: break-word;'>{$trackingData['referrer']}</div>
                </div>

                <!-- UTM Campaign Data -->
                <div style='margin-bottom: 16px; padding: 12px; background-color: #e8f4f8; border-radius: 6px;'>
                    <div class='data-label'>📈 UTM Campaign Data</div>
                    <table width='100%' cellspacing='0' cellpadding='0' style='margin-top: 8px;'>
                        <tr>
                            <td style='padding: 4px 0; font-size: 12px;'><strong>Source:</strong> {$trackingData['utmSource']}</td>
                            <td style='padding: 4px 0; font-size: 12px;'><strong>Medium:</strong> {$trackingData['utmMedium']}</td>
                        </tr>
                        <tr>
                            <td colspan='2' style='padding: 4px 0; font-size: 12px;'><strong>Campaign:</strong> {$trackingData['utmCampaign']}</td>
                        </tr>
                    </table>
                    " . ($trackingData['gclid'] ? "<div style='margin-top: 8px; padding: 6px 10px; background-color: #fef3c7; border-radius: 4px; font-size: 11px;'><strong>🎯 Google Ads Click ID:</strong> " . substr($trackingData['gclid'], 0, 20) . "...</div>" : "") . "
                </div>
                
                <!-- Security & Consent -->
                <table width='100%' cellspacing='0' cellpadding='0'>
                    <tr>
                        <td width='50%' style='padding-bottom: 8px;'>
                            <div class='data-label'>🍪 Cookies Accepted</div>
                            <div class='data-value'>" . ($trackingData['cookiesAccepted'] === 'Yes' ? "<span class='badge badge-success'>Yes ✓</span>" : "<span class='badge badge-error'>No</span>") . "</div>
                        </td>
                        <td width='50%' style='padding-bottom: 8px;'>
                            <div class='data-label'>🛡️ reCAPTCHA</div>
                            <div class='data-value'>" . ($trackingData['recaptchaVerified'] === 'Yes ✓' ? "<span class='badge badge-success'>Verified ✓</span>" : "<span class='badge badge-error'>Unverified</span>") . "</div>
                        </td>
                    </tr>
                </table>
                
                <!-- Technical Details -->
                <div style='margin-top: 16px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 12px;'>
                    <strong>Technical:</strong> IP: $clientIp • Screen: {$trackingData['screenResolution']} • Lang: {$trackingData['language']}<br>
                    <strong>Consent:</strong> {$trackingData['consentTimestamp']}
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
