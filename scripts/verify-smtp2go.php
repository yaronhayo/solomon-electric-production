<?php
/**
 * SMTP2GO Integration Diagnostic Tool
 * This script verifies connection, API key validity, and recipient parsing.
 */

require_once __DIR__ . '/../public/api/email-config.php';

echo "=== SMTP2GO Integration Diagnostic ===\n";
echo "Date: " . date('Y-m-d H:i:s') . "\n\n";

// 1. Check Configuration
echo "[1] Checking Configuration...\n";
$config_vars = [
    'SMTP2GO_API_KEY' => defined('SMTP2GO_API_KEY') ? 'LOADED' : 'MISSING',
    'RECIPIENT_EMAIL' => defined('RECIPIENT_EMAIL') ? RECIPIENT_EMAIL : 'MISSING',
    'BCC_EMAIL' => defined('BCC_EMAIL') ? BCC_EMAIL : 'MISSING',
    'SENDER_EMAIL' => defined('SENDER_EMAIL') ? SENDER_EMAIL : 'MISSING'
];

foreach ($config_vars as $var => $status) {
    echo "  - $var: $status\n";
}

// 2. Test Recipient Parsing
echo "\n[2] Testing Recipient Parsing...\n";
$toAddress = RECIPIENT_NAME . ' <' . RECIPIENT_EMAIL . '>';
echo "  - TO: $toAddress\n";

$bccEmails = array_filter(array_map('trim', explode(',', BCC_EMAIL)));
$bccAddresses = array_values($bccEmails);
echo "  - BCC count: " . count($bccAddresses) . "\n";
foreach ($bccAddresses as $idx => $email) {
    echo "    [$idx]: $email\n";
}

// 3. API Connectivity Test (Minimal Payload)
echo "\n[3] Testing API Connectivity (Validation Only)...\n";
$testMail = [
    'api_key' => SMTP2GO_API_KEY,
    'to' => [$toAddress],
    'sender' => SENDER_NAME . ' <' . SENDER_EMAIL . '>',
    'subject' => '🔧 SMTP2GO Integration Diagnostic',
    'html_body' => "<h1>Diagnostic Success</h1><p>The SMTP2GO integration for " . COMPANY_NAME . " is verified at " . date('r') . ".</p>",
];

// Perform actual test send if requested via CLI arg --send
$doSend = in_array('--send', $argv);

if ($doSend) {
    echo "  - Sending actual diagnostic email...\n";
    $result = sendEmailViaSMTP2GO('🔧 SMTP2GO Integration Diagnostic', $testMail['html_body']);
    if ($result['success']) {
        echo "  ✅ SUCCESS: Email sent successfully.\n";
    } else {
        echo "  ❌ FAILURE: " . $result['message'] . "\n";
        if (isset($result['smtp2go_response'])) {
            print_r($result['smtp2go_response']);
        }
    }
} else {
    echo "  - Skipping actual send. Use --send to perform a live test.\n";
}

echo "\n=== Diagnostic Complete ===\n";
