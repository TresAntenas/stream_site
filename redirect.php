<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start(); // Asegurar que la sesión está iniciada

$client_id = "mq1qtj8ZQBmX4uhIUrb_Tw";
$client_secret = "76cjl75sXVTlAlDFnDYJBU33nX8cAX7g";
$redirect_uri = "https://stream.tresantenas.cl/redirect.php";

// Verificar si el código de autorización fue recibido
if (!isset($_GET['code'])) {
    error_log("❌ Error: No se recibió el código de autorización.\n", 3, "/var/www/html/redirect.log");
    die("❌ Error: No se recibió el código de autorización.");
}

$code = $_GET['code'];

// URL de Zoom para intercambiar código por Access Token
$url = "https://zoom.us/oauth/token";
$data = [
    "grant_type" => "authorization_code",
    "code" => $code,
    "redirect_uri" => $redirect_uri
];

$headers = [
    "Authorization: Basic " . base64_encode("$client_id:$client_secret"),
    "Content-Type: application/x-www-form-urlencoded"
];

// Hacer la petición a Zoom
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

// Manejar errores de cURL
if (curl_errno($ch)) {
    $error_msg = curl_error($ch);
    error_log("❌ cURL Error: $error_msg\n", 3, "/var/www/html/redirect.log");
    die("❌ Error en la conexión con Zoom: $error_msg");
}

curl_close($ch);

// Registrar la respuesta de Zoom en un archivo de logs
error_log("🔎 Respuesta de Zoom: " . print_r($response, true) . "\n", 3, "/var/www/html/redirect.log");

// Decodificar la respuesta JSON
$response_data = json_decode($response, true);

if (!isset($response_data["access_token"])) {
    error_log("❌ Error: No se pudo obtener el Access Token.\n" . print_r($response_data, true), 3, "/var/www/html/redirect.log");
    die("❌ Error: No se pudo obtener el Access Token.");
}

// Guardar el token en la sesión
$_SESSION['zoom_access_token'] = $response_data["access_token"];
$_SESSION['zoom_refresh_token'] = $response_data["refresh_token"];
$_SESSION['zoom_expires_in'] = time() + $response_data["expires_in"];

// Redirigir a index.php solo si hay un token válido
header("Location: /index.php");
exit();
?>

