<?php
/**
 * Contact Form Handler
 * Solomon Electric - Hostinger Deployment
 * 
 * Receives contact form submissions and sends via SMTP2GO
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
$requiredFields = ['name', 'email', 'phone', 'message'];

foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit();
    }
}

// Validate email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Verify reCAPTCHA if token provided
if (!empty($input['g-recaptcha-response'])) {
    if (!verifyRecaptcha($input['g-recaptcha-response'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Security verification failed']);
        exit();
    }
}

// Sanitize inputs
$name = sanitizeInput($input['name']);
$email = sanitizeInput($input['email']);
$phone = sanitizeInput($input['phone']);
$message = sanitizeInput($input['message']);

// Build email HTML
$emailHtml = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0D4380; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; padding: 10px; background: white; border-left: 4px solid #F59E0B; }
        .field-label { font-weight: bold; color: #0D4380; text-transform: uppercase; font-size: 12px; }
        .field-value { font-size: 16px; margin-top: 5px; }
        .message-box { background: white; padding: 15px; border: 1px solid #ddd; margin-top: 10px; white-space: pre-wrap; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>📧 New Contact Message</h1>
            <p>From Solomon Electric Website</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='field-label'>👤 From</div>
                <div class='field-value'>$name</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>📧 Email</div>
                <div class='field-value'><a href='mailto:$email'>$email</a></div>
            </div>
            
            <div class='field'>
                <div class='field-label'>📞 Phone</div>
                <div class='field-value'><a href='tel:$phone'>$phone</a></div>
            </div>
            
            <div class='field'>
                <div class='field-label'>💬 Message</div>
                <div class='message-box'>$message</div>
            </div>
        </div>
        <div class='footer'>
            Submitted on " . date('F j, Y \a\t g:i A') . " via solomonelectric.com
        </div>
    </div>
</body>
</html>
";

// Send email
$subject = "📧 New Contact Message from $name";

$result = sendEmailViaSMTP2GO($subject, $emailHtml, $email);

if ($result['success']) {
    echo json_encode(['status' => 'success', 'message' => 'Your message has been sent! We\'ll get back to you soon.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $result['message']]);
}
