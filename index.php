<?php
session_start();

if (!isset($_SESSION['zoom_access_token'])) {
    die("<h1>❌ No hay un Access Token en la sesión.</h1>");
}

$access_token = $_SESSION['zoom_access_token'];

// Hacer una petición a la API de Zoom para obtener información del usuario
$url = "https://api.zoom.us/v2/users/me";
$headers = [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$user_data = json_decode($response, true);

if (isset($user_data["id"])) {
    echo "<h1>✅ Información del Usuario de Zoom</h1>";
    echo "<p><strong>Nombre:</strong> " . htmlspecialchars($user_data["first_name"] . " " . $user_data["last_name"]) . "</p>";
    echo "<p><strong>Email:</strong> " . htmlspecialchars($user_data["email"]) . "</p>";
    echo "<p><strong>ID de Usuario:</strong> " . htmlspecialchars($user_data["id"]) . "</p>";
} else {
    echo "<h1>❌ Error al obtener datos del usuario.</h1>";
    echo "<pre>" . print_r($user_data, true) . "</pre>";
}
?>

