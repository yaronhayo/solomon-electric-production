<?php
/**
 * Email Configuration & Helper Functions
 * Solomon Electric - Hostinger Deployment
 * 
 * All configuration comes from env.php
 */

// Load centralized environment configuration
require_once __DIR__ . '/env.php';

/**
 * Send email to company using SMTP2GO API
 */
function sendEmailViaSMTP2GO($subject, $htmlBody, $replyTo = null) {
    // Primary recipient (TO)
    $toAddress = RECIPIENT_NAME . ' <' . RECIPIENT_EMAIL . '>';
    
    // BCC recipients (tracking/monitoring)
    $bccEmails = array_map('trim', explode(',', BCC_EMAIL));
    $bccAddresses = array_map(function($email) {
        return $email; // BCC doesn't need display name
    }, $bccEmails);
    
    $payload = [
        'api_key' => SMTP2GO_API_KEY,
        'to' => [$toAddress],
        'bcc' => $bccAddresses,
        'sender' => SENDER_NAME . ' <' . SENDER_EMAIL . '>',
        'subject' => $subject,
        'html_body' => $htmlBody,
    ];
    
    if ($replyTo) {
        $payload['custom_headers'] = [
            [
                'header' => 'Reply-To',
                'value' => $replyTo
            ]
        ];
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, SMTP2GO_API_URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return [
            'success' => false,
            'message' => 'Connection error: ' . $error
        ];
    }
    
    $result = json_decode($response, true);
    
    if ($httpCode === 200 && isset($result['data']['succeeded']) && $result['data']['succeeded'] > 0) {
        return [
            'success' => true,
            'message' => 'Email sent successfully'
        ];
    } else {
        return [
            'success' => false,
            'message' => isset($result['data']['error']) ? $result['data']['error'] : 'Failed to send email',
            'smtp2go_response' => $result, // Include full API response for debugging
            'http_code' => $httpCode
        ];
    }
}

/**
 * Send autoresponder email to customer
 */
function sendAutoresponder($toEmail, $toName, $subject, $htmlBody) {
    $payload = [
        'api_key' => SMTP2GO_API_KEY,
        'to' => [$toName . ' <' . $toEmail . '>'],
        'sender' => SENDER_NAME . ' <' . SENDER_EMAIL . '>',
        'subject' => $subject,
        'html_body' => $htmlBody,
        'custom_headers' => [
            [
                'header' => 'Reply-To',
                'value' => RECIPIENT_EMAIL
            ]
        ]
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, SMTP2GO_API_URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return [
            'success' => false,
            'message' => 'Connection error: ' . $error
        ];
    }
    
    $result = json_decode($response, true);
    
    if ($httpCode === 200 && isset($result['data']['succeeded']) && $result['data']['succeeded'] > 0) {
        return [
            'success' => true,
            'message' => 'Autoresponder sent successfully'
        ];
    } else {
        return [
            'success' => false,
            'message' => isset($result['data']['error']) ? $result['data']['error'] : 'Failed to send autoresponder'
        ];
    }
}

/**
 * Sanitize input data
 */
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

/**
 * Set CORS headers for API responses
 */
function setCorsHeaders() {
    // Get the origin
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Production domains
    $productionOrigins = [
        'https://247electricianmiami.com',
        'https://www.247electricianmiami.com',
    ];
    
    // Check if it's a production domain, localhost, or Hostinger staging
    $isAllowed = in_array($origin, $productionOrigins) 
        || strpos($origin, 'localhost') !== false
        || strpos($origin, '.hostingersite.com') !== false  // Hostinger staging
        || strpos($origin, '.hstgr.io') !== false;           // Hostinger temp domains
    
    if ($isAllowed && !empty($origin)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // Allow same-origin requests (no Origin header = same domain)
        header('Access-Control-Allow-Origin: *');
    }
    
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Verify Google reCAPTCHA token
 */
function verifyRecaptcha($token) {
    if (empty($token) || RECAPTCHA_SECRET_KEY === 'YOUR_RECAPTCHA_SECRET_KEY_HERE') {
        // Skip verification if not configured
        return true;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, RECAPTCHA_VERIFY_URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret' => RECAPTCHA_SECRET_KEY,
        'response' => $token
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($response, true);
    return isset($result['success']) && $result['success'] === true;
}
