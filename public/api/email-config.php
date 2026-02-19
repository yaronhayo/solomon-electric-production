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
    $bccEmails = array_filter(array_map('trim', explode(',', BCC_EMAIL)));
    $bccAddresses = array_values($bccEmails);
    
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
    if ($data === null) return '';
    return htmlspecialchars(strip_tags(trim($data)));
}

/**
 * Capitalize name properly (handles McName, O'Brien, etc.)
 */
function normalizeName($name) {
    if (empty($name)) return '';
    
    // Lowercase everything first
    $name = strtolower(trim($name));
    
    // Split by whitespace to handle multi-part names
    $parts = preg_split('/(\s+)/', $name, -1, PREG_SPLIT_DELIM_CAPTURE);
    $normalizedParts = array_map(function($part) {
        if (trim($part) === '') return $part;
        
        // Handle Mc prefix
        if (strpos($part, 'mc') === 0 && strlen($part) > 2) {
            return 'Mc' . ucfirst(substr($part, 2));
        }
        
        // Handle Mac prefix
        if (strpos($part, 'mac') === 0 && strlen($part) > 3) {
            return 'Mac' . ucfirst(substr($part, 3));
        }
        
        // Handle O' prefix
        if (strpos($part, "o'") === 0 && strlen($part) > 2) {
            return "O'" . ucfirst(substr($part, 2));
        }
        
        // Standard capitalization
        return ucfirst($part);
    }, $parts);
    
    $name = implode('', $normalizedParts);
    
    // Handle hyphenated names
    $hyphenParts = explode('-', $name);
    $normalizedHyphenParts = array_map('ucfirst', $hyphenParts);
    
    return implode('-', $normalizedHyphenParts);
}

/**
 * Log lead for persistence (Server Source of Truth)
 * Saves lead data to a JSON file in a protected directory
 */
function logLead($data) {
    $logFile = __DIR__ . '/lead_vault.json';
    
    // Add server-side metadata
    $data['log_timestamp'] = date('Y-m-d H:i:s');
    $data['server_ip'] = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    $data['request_id'] = uniqid('LEAD_');
    
    $currentLogs = [];
    if (file_exists($logFile)) {
        $content = file_get_contents($logFile);
        if ($content) {
            $currentLogs = json_decode($content, true) ?: [];
        }
    }
    
    // Prepend new lead
    array_unshift($currentLogs, $data);
    
    // Keep only last 1000 leads
    if (count($currentLogs) > 1000) {
        $currentLogs = array_slice($currentLogs, 0, 1000);
    }
    
    file_put_contents($logFile, json_encode($currentLogs, JSON_PRETTY_PRINT));
}

/**
 * Normalize city names (e.g. miami -> Miami)
 */
function normalizeCity($city) {
    if (empty($city)) return '';
    return ucwords(strtolower(trim($city)));
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
        // Strict denial for unauthorized origins in production
        header('HTTP/1.1 403 Forbidden');
        echo json_encode(['success' => false, 'message' => 'Origin not authorized']);
        exit();
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
 * Verify Google reCAPTCHA token and return score
 * Returns array with success status and score for lead tracking
 */
function verifyRecaptcha($token) {
    if (empty($token) || RECAPTCHA_SECRET_KEY === 'YOUR_RECAPTCHA_SECRET_KEY_HERE') {
        // Skip verification if not configured
        return ['success' => true, 'score' => null];
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
    
    $success = isset($result['success']) && $result['success'] === true;
    $score = isset($result['score']) ? floatval($result['score']) : null;
    
    return [
        'success' => $success,
        'score' => $score
    ];
}
