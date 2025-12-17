<?php
// send-mail.php provided by Solomon Electric Astro Rebuild
header('Content-Type: application/json');

// Allow requests from same origin (or specific domains if needed)
// header('Access-Control-Allow-Origin: *'); 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get raw POST data
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, true);

    // If json_decode failed, check if it's standard form data
    if (is_array($decoded)) {
        $name = filter_var($decoded['name'] ?? '', FILTER_SANITIZE_STRING);
        $email = filter_var($decoded['email'] ?? '', FILTER_SANITIZE_EMAIL);
        $phone = filter_var($decoded['phone'] ?? '', FILTER_SANITIZE_STRING);
        $message = filter_var($decoded['message'] ?? '', FILTER_SANITIZE_STRING);
    } else {
        $name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
        $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
        $phone = filter_var($_POST['phone'] ?? '', FILTER_SANITIZE_STRING);
        $message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);
    }

    // Validate inputs
    if (empty($name) || empty($email) || empty($phone)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
        exit;
    }

    // Email Configuration
    $to = "info@solomonelectric.com"; // CHANGE THIS TO OWNER EMAIL
    $subject = "New Contact Request from Solomon Electric Website";
    
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n\n";
    $email_content .= "Message:\n$message\n";

    $headers = "From: noreply@solomonelectric.com\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Send Email
    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Thank you! Your message has been sent."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Oops! Something went wrong and we couldn't send your message."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
}
?>
