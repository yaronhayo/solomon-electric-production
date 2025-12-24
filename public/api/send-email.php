<?php
/**
 * Service Request Form Handler
 * Solomon Electric - Hostinger Deployment
 * 
 * Sends:
 * 1. Lead notification to company
 * 2. Autoresponder confirmation to customer
 * 
 * All configuration loaded from env.php via email-config.php
 */

require_once __DIR__ . '/email-config.php';

setCorsHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Verify reCAPTCHA if token provided
if (!empty($input['g-recaptcha-response'])) {
    if (!verifyRecaptcha($input['g-recaptcha-response'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Security verification failed']);
        exit();
    }
}

// Sanitize all inputs
$serviceType = sanitizeInput($input['serviceType']);
$serviceDetails = isset($input['serviceDetails']) ? sanitizeInput($input['serviceDetails']) : 'None provided';
$address = sanitizeInput($input['address']);
$aptUnit = isset($input['aptUnit']) ? sanitizeInput($input['aptUnit']) : '';
$gateCode = isset($input['gateCode']) ? sanitizeInput($input['gateCode']) : '';
$urgency = sanitizeInput($input['urgency']);
$name = sanitizeInput($input['name']);
$phone = sanitizeInput($input['phone']);
$email = isset($input['email']) && !empty($input['email']) ? sanitizeInput($input['email']) : null;

// Address components for CRM mapping
$streetNumber = isset($input['streetNumber']) ? sanitizeInput($input['streetNumber']) : '';
$streetName = isset($input['streetName']) ? sanitizeInput($input['streetName']) : '';
$city = isset($input['city']) ? sanitizeInput($input['city']) : '';
$state = isset($input['state']) ? sanitizeInput($input['state']) : '';
$zipCode = isset($input['zipCode']) ? sanitizeInput($input['zipCode']) : '';

// Extract tracking data (sent from frontend with tracking_ prefix)
$trackingSessionStart = isset($input['tracking_sessionStart']) ? sanitizeInput($input['tracking_sessionStart']) : 'N/A';
$trackingTimeOnSite = isset($input['tracking_timeOnSite']) ? sanitizeInput($input['tracking_timeOnSite']) : '0';
$trackingCurrentUrl = isset($input['tracking_currentUrl']) ? sanitizeInput($input['tracking_currentUrl']) : '';
$trackingReferrer = isset($input['tracking_referrer']) ? sanitizeInput($input['tracking_referrer']) : 'Direct';
$trackingClickPath = isset($input['tracking_clickPath']) ? sanitizeInput($input['tracking_clickPath']) : '';
$trackingUserAgent = isset($input['tracking_userAgent']) ? sanitizeInput($input['tracking_userAgent']) : '';
$trackingDeviceType = isset($input['tracking_deviceType']) ? sanitizeInput($input['tracking_deviceType']) : 'Unknown';
$trackingScreenResolution = isset($input['tracking_screenResolution']) ? sanitizeInput($input['tracking_screenResolution']) : '';
$trackingLanguage = isset($input['tracking_language']) ? sanitizeInput($input['tracking_language']) : '';
$trackingCookiesAccepted = isset($input['tracking_cookiesAccepted']) ? ($input['tracking_cookiesAccepted'] === 'true' ? 'Yes' : 'No') : 'Unknown';
$trackingConsentTimestamp = isset($input['tracking_consentTimestamp']) ? sanitizeInput($input['tracking_consentTimestamp']) : 'N/A';
$trackingRecaptchaVerified = isset($input['tracking_recaptchaVerified']) ? ($input['tracking_recaptchaVerified'] === 'true' ? 'Yes ✓' : 'No') : 'No';
$trackingUtmSource = isset($input['tracking_utmSource']) ? sanitizeInput($input['tracking_utmSource']) : 'N/A';
$trackingUtmMedium = isset($input['tracking_utmMedium']) ? sanitizeInput($input['tracking_utmMedium']) : 'N/A';
$trackingUtmCampaign = isset($input['tracking_utmCampaign']) ? sanitizeInput($input['tracking_utmCampaign']) : 'N/A';
$trackingGclid = isset($input['tracking_gclid']) && $input['tracking_gclid'] !== 'null' ? sanitizeInput($input['tracking_gclid']) : null;
$trackingTrafficSource = isset($input['tracking_trafficSource']) ? sanitizeInput($input['tracking_trafficSource']) : 'Unknown';

// Format time on site for readability
$timeOnSiteFormatted = 'N/A';
if (is_numeric($trackingTimeOnSite)) {
    $seconds = intval($trackingTimeOnSite);
    if ($seconds >= 60) {
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;
        $timeOnSiteFormatted = $minutes . 'm ' . $remainingSeconds . 's';
    } else {
        $timeOnSiteFormatted = $seconds . 's';
    }
}

// Get client IP address
$clientIp = 'Unknown';
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $clientIp = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'];
} elseif (!empty($_SERVER['REMOTE_ADDR'])) {
    $clientIp = $_SERVER['REMOTE_ADDR'];
}

// Format service type for display
$serviceTypeFormatted = ucwords(str_replace('_', ' ', $serviceType));

// Get first name for personalization
$firstName = explode(' ', $name)[0];

// Current date/time in Eastern Time (Florida)
date_default_timezone_set('America/New_York');
$submittedDate = date('F j, Y');
$submittedTime = date('g:i A');

// Get branding from env.php constants
$brandPrimary = BRAND_PRIMARY;
$brandAccent = BRAND_ACCENT;
$companyPhone = COMPANY_PHONE;
$companyPhoneRaw = COMPANY_PHONE_RAW;
$companyEmail = COMPANY_EMAIL;
$companyAddress = COMPANY_ADDRESS;
$companyLicense = COMPANY_LICENSE;
$websiteUrl = WEBSITE_URL;
$logoUrl = $websiteUrl . '/logo.png';

// ============================================
// LEAD NOTIFICATION EMAIL (To Company)
// ============================================
$urgencyBadge = $urgency === 'ASAP' 
    ? "<span style='background: #DC2626; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase;'>🚨 URGENT - ASAP</span>"
    : "<span style='background: $brandAccent; color: $brandPrimary; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase;'>$urgency</span>";

$leadEmailHtml = "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>New Service Request</title>
    <style>
        /* Mobile-first responsive design */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            .content-padding {
                padding: 20px !important;
            }
            .mobile-text {
                font-size: 14px !important;
            }
            .mobile-heading {
                font-size: 20px !important;
            }
        }
    </style>
</head>
<body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; background-color: #f3f3f3;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f3f3f3; padding: 20px 0;'>
        <tr>
            <td align='center'>
                <table class='email-container' width='600' cellpadding='0' cellspacing='0' style='max-width: 600px; width: 100%; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);'>
                    
                    <!-- Header -->
                    <tr>
                        <td class='content-padding' style='background: linear-gradient(135deg, $brandPrimary 0%, #0a3a6e 100%); padding: 30px 40px; text-align: center;'>
                            <img src='$logoUrl' alt='Solomon Electric' style='height: 50px; margin-bottom: 15px; max-width: 100%;'>
                            <h1 class='mobile-heading' style='color: white; margin: 0; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;'>⚡ New Lead Alert</h1>
                            <p style='color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px;'>Service Request from Website</p>
                        </td>
                    </tr>
                    
                    <!-- Urgency Banner -->
                    <tr>
                        <td class='content-padding' style='padding: 20px 40px; background: " . ($urgency === 'ASAP' ? '#FEF2F2' : '#F0FDFA') . "; border-bottom: 1px solid #e5e7eb;'>
                            <table width='100%'>
                                <tr>
                                    <td style='font-weight: bold; color: #374151;'>Priority Level:</td>
                                    <td align='right'>$urgencyBadge</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Customer Info -->
                    <tr>
                        <td class='content-padding' style='padding: 30px 40px;'>
                            <h2 style='color: $brandPrimary; font-size: 18px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 3px solid $brandAccent; padding-bottom: 10px; display: inline-block;'>Customer Information</h2>
                            
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #f3f3f3;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>Name</span><br>
                                        <strong style='color: $brandPrimary; font-size: 18px;'>$name</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #f3f3f3;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>Phone</span><br>
                                        <a href='tel:$phone' style='color: $brandPrimary; font-size: 18px; font-weight: bold; text-decoration: none;'>📞 $phone</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #f3f3f3;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>Email</span><br>
                                        <span style='color: $brandPrimary; font-size: 16px;'>" . ($email ?: 'Not provided') . "</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Service Details -->
                    <tr>
                        <td class='content-padding' style='padding: 0 40px 30px;'>
                            <h2 style='color: $brandPrimary; font-size: 18px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 3px solid $brandAccent; padding-bottom: 10px; display: inline-block;'>Service Request</h2>
                            
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #f3f3f3;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>Service Type</span><br>
                                        <strong style='color: $brandPrimary; font-size: 16px;'>$serviceTypeFormatted</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #f3f3f3;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>Details</span><br>
                                        <span style='color: #374151; font-size: 14px; line-height: 1.6;'>$serviceDetails</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #f3f3f3;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>Service Address</span><br>
                                        <strong style='color: $brandPrimary; font-size: 16px;'>📍 $address</strong>
                                        " . ($aptUnit ? "<br><span style='color: #6b7280; font-size: 14px;'>Apt/Unit: $aptUnit</span>" : "") . "
                                        " . ($gateCode ? "<br><span style='color: #6b7280; font-size: 14px;'>Gate Code: $gateCode</span>" : "") . "
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px 0;'>
                                        <span style='color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;'>Address Components</span><br>
                                        <table style='width: 100%; margin-top: 8px; font-size: 13px;' cellspacing='0'>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280; width: 80px;'>House #:</td><td style='color: #374151;'><strong>$streetNumber</strong></td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>Street:</td><td style='color: #374151;'><strong>$streetName</strong></td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>City:</td><td style='color: #374151;'><strong>$city</strong></td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>State:</td><td style='color: #374151;'><strong>$state</strong></td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>ZIP:</td><td style='color: #374151;'><strong>$zipCode</strong></td></tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- User Analytics & Tracking Data -->
                    <tr>
                        <td class='content-padding' style='padding: 0 40px 30px; background: #fafafa;'>
                            <h2 style='color: $brandPrimary; font-size: 18px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 3px solid $brandAccent; padding-bottom: 10px; display: inline-block;'>📊 User Analytics</h2>
                            
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <!-- Session Information -->
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #e5e7eb;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>⏱️ Session Duration</span><br>
                                        <strong style='color: #374151; font-size: 15px;'>$timeOnSiteFormatted</strong>
                                        <span style='color: #9ca3af; font-size: 12px; margin-left: 8px;'>(Session Start: " . date('g:i A', strtotime($trackingSessionStart)) . ")</span>
                                    </td>
                                </tr>
                                
                                <!-- Navigation Path -->
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #e5e7eb;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>🔗 Navigation</span><br>
                                        <strong style='color: #374151; font-size: 13px;'>Entry:</strong> <span style='color: #6b7280; font-size: 13px;'>$trackingReferrer</span><br>
                                        <strong style='color: #374151; font-size: 13px;'>Click Path:</strong> <span style='color: #6b7280; font-size: 13px;'>$trackingClickPath</span>
                                    </td>
                                </tr>
                                
                                <!-- Device & Browser -->
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #e5e7eb;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>📱 Device Information</span><br>
                                        <table style='width: 100%; margin-top: 4px; font-size: 13px;' cellspacing='0'>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280; width: 120px;'>Device Type:</td><td style='color: #374151;'><strong>$trackingDeviceType</strong></td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>Screen:</td><td style='color: #374151;'>$trackingScreenResolution</td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>Language:</td><td style='color: #374151;'>$trackingLanguage</td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>IP Address:</td><td style='color: #374151;'><strong>$clientIp</strong></td></tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Consent & Security -->
                                <tr>
                                    <td style='padding: 12px 0; border-bottom: 1px solid #e5e7eb;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>🔒 Consent & Security</span><br>
                                        <table style='width: 100%; margin-top: 4px; font-size: 13px;' cellspacing='0'>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280; width: 150px;'>Cookies Accepted:</td><td style='color: #374151;'><strong>$trackingCookiesAccepted</strong></td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>Consent Given:</td><td style='color: #374151;'>" . ($trackingConsentTimestamp !== 'N/A' ? date('M j, Y g:i A', strtotime($trackingConsentTimestamp)) : 'N/A') . "</td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>reCAPTCHA:</td><td style='color: " . ($trackingRecaptchaVerified === 'Yes ✓' ? '#10b581' : '#ef4444') . ";'><strong>$trackingRecaptchaVerified</strong></td></tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Traffic Source -->
                                <tr>
                                    <td style='padding: 12px 0;'>
                                        <span style='color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;'>🎯 Traffic Source</span><br>
                                        <strong style='color: " . ($trackingGclid ? '#4285f4' : '#10b581') . "; font-size: 15px;'>$trackingTrafficSource</strong>
                                        " . ($trackingGclid ? "<br><span style='color: #6b7280; font-size: 12px;'>Google Click ID: <code style='background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-size: 11px;'>$trackingGclid</code></span>" : "") . "
                                        <table style='width: 100%; margin-top: 8px; font-size: 12px;' cellspacing='0'>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280; width: 100px;'>UTM Source:</td><td style='color: #374151;'>$trackingUtmSource</td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>UTM Medium:</td><td style='color: #374151;'>$trackingUtmMedium</td></tr>
                                            <tr><td style='padding: 2px 8px 2px 0; color: #6b7280;'>UTM Campaign:</td><td style='color: #374151;'>$trackingUtmCampaign</td></tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Action Button -->
                    <tr>
                        <td class='content-padding' style='padding: 30px 40px; text-align: center;'>
                            <a href='tel:$phone' style='display: inline-block; background: $brandAccent; color: $brandPrimary; padding: 16px 40px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;'>📞 Call Customer Now</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class='content-padding' style='background: $brandPrimary; padding: 20px 40px; text-align: center;'>
                            <p style='color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;'>
                                Submitted on $submittedDate at $submittedTime EST<br>
                                via 247electricianmiami.com
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
";

// ============================================
// AUTORESPONDER EMAIL (To Customer)
// ============================================
$autoresponderHtml = "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>We've Received Your Request - Solomon Electric</title>
</head>
<body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; background-color: #f3f3f3;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f3f3f3; padding: 40px 20px;'>
        <tr>
            <td align='center'>
                <table width='600' cellpadding='0' cellspacing='0' style='background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);'>
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style='background: linear-gradient(135deg, $brandPrimary 0%, #0a3a6e 100%); padding: 40px; text-align: center;'>
                            <img src='$logoUrl' alt='Solomon Electric' style='height: 60px; margin-bottom: 20px;'>
                            <h1 style='color: white; margin: 0; font-size: 32px; font-weight: 800;'>Request Received ✓</h1>
                            <p style='color: $brandAccent; margin: 15px 0 0; font-size: 16px; font-weight: 500;'>We're on it, $firstName.</p>
                        </td>
                    </tr>
                    
                    <!-- Confirmation Message -->
                    <tr>
                        <td style='padding: 40px;'>
                            <p style='color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 25px;'>
                                Thank you for reaching out to <strong style='color: $brandPrimary;'>Solomon Electric</strong>. Your service request has been received and one of our licensed electricians will review it personally.
                            </p>
                            
                            <p style='color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 25px;'>
                                We understand that electrical issues can be stressful. Rest assured, we'll be in touch shortly to discuss your needs—no pressure, no sales pitch, just helpful expertise.
                            </p>
                            
                            <!-- What You Requested Box -->
                            <div style='background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%); border-left: 4px solid $brandAccent; padding: 20px; border-radius: 8px; margin: 25px 0;'>
                                <h3 style='color: $brandPrimary; margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;'>Your Request Summary</h3>
                                <p style='color: #374151; margin: 0; font-size: 16px;'>
                                    <strong>Service:</strong> $serviceTypeFormatted<br>
                                    <strong>Priority:</strong> $urgency<br>
                                    <strong>Location:</strong> $address
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- What Happens Next -->
                    <tr>
                        <td style='padding: 0 40px 40px;'>
                            <h2 style='color: $brandPrimary; font-size: 20px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 1px;'>What Happens Next</h2>
                            
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style='padding: 15px 0; border-bottom: 1px solid #f3f3f3;'>
                                        <table width='100%'>
                                            <tr>
                                                <td width='50' valign='top'>
                                                    <div style='background: $brandAccent; color: $brandPrimary; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: bold;'>1</div>
                                                </td>
                                                <td valign='top'>
                                                    <strong style='color: $brandPrimary;'>Quick Review</strong><br>
                                                    <span style='color: #6b7280; font-size: 14px;'>A licensed electrician reviews your request</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 15px 0; border-bottom: 1px solid #f3f3f3;'>
                                        <table width='100%'>
                                            <tr>
                                                <td width='50' valign='top'>
                                                    <div style='background: $brandAccent; color: $brandPrimary; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: bold;'>2</div>
                                                </td>
                                                <td valign='top'>
                                                    <strong style='color: $brandPrimary;'>Personal Call</strong><br>
                                                    <span style='color: #6b7280; font-size: 14px;'>We'll call to discuss details and answer questions</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 15px 0;'>
                                        <table width='100%'>
                                            <tr>
                                                <td width='50' valign='top'>
                                                    <div style='background: $brandAccent; color: $brandPrimary; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: bold;'>3</div>
                                                </td>
                                                <td valign='top'>
                                                    <strong style='color: $brandPrimary;'>Expert Service</strong><br>
                                                    <span style='color: #6b7280; font-size: 14px;'>Professional work, guaranteed satisfaction</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Emergency CTA -->
                    <tr>
                        <td style='padding: 0 40px 40px;'>
                            <div style='background: linear-gradient(135deg, $brandPrimary 0%, #0a3a6e 100%); padding: 25px; border-radius: 12px; text-align: center;'>
                                <p style='color: white; margin: 0 0 15px; font-size: 16px;'>
                                    <strong>Have an electrical emergency?</strong><br>
                                    <span style='opacity: 0.8;'>Don't wait—call us now for immediate assistance.</span>
                                </p>
                                <a href='tel:$companyPhoneRaw' style='display: inline-block; background: $brandAccent; color: $brandPrimary; padding: 14px 35px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 18px;'>📞 $companyPhone</a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Trust Indicators -->
                    <tr>
                        <td style='padding: 30px 40px; background: #f8fafc; border-top: 1px solid #e5e7eb;'>
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td width='33%' align='center' style='padding: 10px;'>
                                        <div style='font-size: 24px;'>⚡</div>
                                        <div style='color: $brandPrimary; font-weight: bold; font-size: 12px; text-transform: uppercase;'>Licensed</div>
                                        <div style='color: #6b7280; font-size: 11px;'>FL $companyLicense</div>
                                    </td>
                                    <td width='33%' align='center' style='padding: 10px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;'>
                                        <div style='font-size: 24px;'>🛡️</div>
                                        <div style='color: $brandPrimary; font-weight: bold; font-size: 12px; text-transform: uppercase;'>Insured</div>
                                        <div style='color: #6b7280; font-size: 11px;'>Fully Covered</div>
                                    </td>
                                    <td width='33%' align='center' style='padding: 10px;'>
                                        <div style='font-size: 24px;'>⭐</div>
                                        <div style='color: $brandPrimary; font-weight: bold; font-size: 12px; text-transform: uppercase;'>4.9 Rating</div>
                                        <div style='color: #6b7280; font-size: 11px;'>1,200+ Reviews</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style='background: $brandPrimary; padding: 30px 40px; text-align: center;'>
                            <img src='$logoUrl' alt='Solomon Electric' style='height: 40px; margin-bottom: 15px; opacity: 0.9;'>
                            <p style='color: rgba(255,255,255,0.9); margin: 0 0 10px; font-size: 14px;'>
                                <strong>Solomon Electric</strong><br>
                                Miami's Trusted Electrical Experts
                            </p>
                            <p style='color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;'>
                                $companyAddress<br>
                                $companyPhone • $companyEmail
                            </p>
                            <p style='color: rgba(255,255,255,0.5); margin: 20px 0 0; font-size: 11px;'>
                                © " . date('Y') . " Solomon Electric. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
                <!-- Unsubscribe Note -->
                <p style='color: #9ca3af; font-size: 11px; margin-top: 20px; text-align: center;'>
                    This is a one-time confirmation email for your service request.<br>
                    You will not receive marketing emails unless you subscribe.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
";

// Send lead notification to company
$leadSubject = "⚡ New Lead: $serviceTypeFormatted" . ($urgency === 'ASAP' ? ' [URGENT]' : '') . " - $name";
$replyTo = $email ?: null;
$leadResult = sendEmailViaSMTP2GO($leadSubject, $leadEmailHtml, $replyTo);

// Send autoresponder to customer (only if email provided)
$autoresponderSent = false;
if ($email) {
    $autoresponderSubject = "We've Received Your Request - Solomon Electric";
    $autoresponderResult = sendAutoresponder($email, $name, $autoresponderSubject, $autoresponderHtml);
    $autoresponderSent = $autoresponderResult['success'];
}

// Return response
if ($leadResult['success']) {
    $response = [
        'success' => true,
        'message' => 'Request submitted successfully',
        'autoresponderSent' => $autoresponderSent
    ];
    http_response_code(200);
} else {
    $response = [
        'success' => false,
        'message' => 'Failed to submit request',
        'debug' => $leadResult // Show actual SMTP2GO error
    ];
    http_response_code(500);
}

echo json_encode($response);
