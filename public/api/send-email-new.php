<?php
/**
 * MOBILE-RESPONSIVE EMAIL TEMPLATE WITH ANALYTICS
 * This is a REFERENCE for updating send-email.php
 * Key changes:
 * 1. Mobile-responsive table structure (max-width: 600px, 100% on mobile)
 * 2. Removed CRM fields section
 * 3. Added Analytics section with tracking data
 */

// Example: Extract tracking data from form submission
$trackingData = [
    'sessionStart' => $_POST['tracking_sessionStart'] ?? 'N/A',
    'timeOnSite' => $_POST['tracking_timeOnSite'] ?? '0',
    'currentUrl' => $_POST['tracking_currentUrl'] ?? 'N/A',
    'referrer' => $_POST['tracking_referrer'] ?? 'Direct',
    'clickPath' => $_POST['tracking_clickPath'] ?? 'N/A',
    'userAgent' => $_POST['tracking_userAgent'] ?? 'N/A',
    'deviceType' => $_POST['tracking_deviceType'] ?? 'Unknown',
    'cookiesAccepted' => $_POST['tracking_cookiesAccepted'] ?? 'false',
    'recaptchaVerified' => $_POST['tracking_recaptchaVerified'] ?? 'false',
    'trafficSource' => $_POST['tracking_trafficSource'] ?? 'Unknown',
    'utmSource' => $_POST['tracking_utmSource'] ?? 'N/A',
    'utmMedium' => $_POST['tracking_utmMedium'] ?? 'N/A',
    'utmCampaign' => $_POST['tracking_utmCampaign'] ?? 'N/A',
];

// Format time on site
$minutes = floor($trackingData['timeOnSite'] / 60);
$seconds = $trackingData['timeOnSite'] % 60;
$timeOnSiteFormatted = $minutes > 0 ? "{$minutes}m {$seconds}s" : "{$seconds}s";

// Mobile-responsive analytics section HTML
$analyticsSection = "
<!-- Analytics & Session Data (Mobile Responsive) -->
<tr>
    <td style='padding: 30px 20px;'>
        <h2 style='color: #0D4380; font-size: 18px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 3px solid #14D3E3; padding-bottom: 10px; display: inline-block;'>📊 Lead Analytics</h2>
        
        <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse: collapse;'>
            <!-- Session & Timing -->
            <tr>
                <td colspan='2' style='padding: 15px 0 10px; font-size: 14px; font-weight: bold; color: #0D4380; border-bottom: 2px solid #14D3E3;'>Session & Timing</td>
            </tr>
            <tr>
                <td style='padding: 10px 0; color: #6b7280; font-size: 13px; width: 40%;'>Time on Site</td>
                <td style='padding: 10px 0; color: #374151; font-weight: 600;'>{$timeOnSiteFormatted}</td>
            </tr>
            <tr>
                <td style='padding: 10px 0; color: #6b7280; font-size: 13px; border-bottom: 1px solid #f3f3f3;'>Device</td>
                <td style='padding: 10px 0; color: #374151; font-weight: 600; border-bottom: 1px solid #f3f3f3;'>{$trackingData['deviceType']}</td>
            </tr>
            
            <!-- Traffic Source -->
            <tr>
                <td colspan='2' style='padding: 15px 0 10px; font-size: 14px; font-weight: bold; color: #0D4380; border-bottom: 2px solid #14D3E3;'>Traffic Source</td>
            </tr>
            <tr>
                <td style='padding: 10px 0; color: #6b7280; font-size: 13px;'>Source</td>
                <td style='padding: 10px 0;'>
                    <span style='background: " . ($trackingData['trafficSource'] === 'Google Ads' ? '#34D399' : '#60A5FA') . "; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px;'>" . strtoupper($trackingData['trafficSource']) . "</span>
                </td>
            </tr>
            <tr>
                <td style='padding: 10px 0; color: #6b7280; font-size: 13px;'>Referrer</td>
                <td style='padding: 10px 0; color: #374151; font-size: 13px; word-break: break-all;'>{$trackingData['referrer']}</td>
            </tr>
            <tr>
                <td style='padding: 10px 0; color: #6b7280; font-size: 13px; border-bottom: 1px solid #f3f3f3;'>Click Path</td>
                <td style='padding: 10px 0; color: #374151; font-size: 12px; word-break: break-word; border-bottom: 1px solid #f3f3f3;'>{$trackingData['clickPath']}</td>
            </tr>
            
            <!-- Security & Consent -->
            <tr>
                <td colspan='2' style='padding: 15px 0 10px; font-size: 14px; font-weight: bold; color: #0D4380; border-bottom: 2px solid #14D3E3;'>Security & Consent</td>
            </tr>
            <tr>
                <td style='padding: 10px 0; color: #6b7280; font-size: 13px;'>reCAPTCHA</td>
                <td style='padding: 10px 0;'><span style='color: " . ($trackingData['recaptchaVerified'] === 'true' ? '#10B981' : '#EF4444') . "; font-weight: bold;'>" . ($trackingData['recaptchaVerified'] === 'true' ? '✓ Verified' : '✗ Not Verified') . "</span></td>
            </tr>
            <tr>
                <td style='padding: 10px 0; color: #6b7280; font-size: 13px;'>Cookies</td>
                <td style='padding: 10px 0;'><span style='color: " . ($trackingData['cookiesAccepted'] === 'true' ? '#10B981' : '#6b7280') . "; font-weight: 600;'>" . ($trackingData['cookiesAccepted'] === 'true' ? '✓ Accepted' : 'Not Accepted') . "</span></td>
            </tr>
        </table>
    </td>
</tr>
";

// NOTE: In send-email.php, replace the CRM Data section with $analyticsSection variable
// Mobile responsive table wrapper already exists (max-width: 600px)
// This section fits within that structure
?>
