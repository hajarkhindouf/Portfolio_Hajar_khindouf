<?php
// Alternative serveur : à utiliser avec CONTACT_MODE = 'php' dans js/custom.js
header('Content-Type: application/json; charset=utf-8');

$to = 'hajarkhindouf001@gmail.com';

function clean($v) { return trim(str_replace(array("\r", "\n", "%0a", "%0d"), ' ', strip_tags((string)$v))); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(array('ok' => false)); exit; }
if (!empty($_POST['_honey'])) { echo json_encode(array('ok' => true)); exit; }   // anti-spam

$name    = clean(isset($_POST['name']) ? $_POST['name'] : '');
$email   = clean(isset($_POST['email']) ? $_POST['email'] : '');
$phone   = clean(isset($_POST['phone']) ? $_POST['phone'] : '');
$message = trim(strip_tags(isset($_POST['message']) ? (string)$_POST['message'] : ''));

if (strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($message) < 5) {
    http_response_code(422); echo json_encode(array('ok' => false)); exit;
}

$subject = 'Portfolio – nouveau message de ' . $name;
$body    = "Nom : $name\r\nE-mail : $email\r\nTéléphone : $phone\r\n\r\nMessage :\r\n$message\r\n";
$headers = "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n" .
           "From: Portfolio <no-reply@" . preg_replace('/^www\./', '', $_SERVER['HTTP_HOST']) . ">\r\n" .
           "Reply-To: $email\r\n";

$ok = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);
if (!$ok) { http_response_code(500); }
echo json_encode(array('ok' => (bool)$ok));
