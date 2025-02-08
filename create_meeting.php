<?php
session_start();

if (!isset($_SESSION['zoom_access_token'])) {
    die("❌ No hay un Access Token en la sesión.");
}

$access_token = $_SESSION['zoom_access_token'];

$url = "https://api.zoom.us/v2/users/me/meetings";
$data = json_encode([
    "topic" => "Reunión en Vivo - Tres Antenas",
    "type" => 1, // Tipo 1: Instantánea (puedes usar 2 para programada)
    "duration" => 60,
    "timezone" => "America/Santiago",
    "agenda" => "Reunión en vivo desde la web",
    "settings" => [
        "host_video" => true,
        "participant_video" => true,
        "join_before_host" => true,
        "mute_upon_entry" => false,
        "waiting_room" => false
    ]
]);

$headers = [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$meeting_data = json_decode($response, true);

if (isset($meeting_data["id"])) {
    echo "<h1>✅ Reunión Creada</h1>";
    echo "<p><strong>Meeting ID:</strong> " . $meeting_data["id"] . "</p>";
    echo "<p><strong>Join URL:</strong> <a href='" . $meeting_data["join_url"] . "' target='_blank'>" . $meeting_data["join_url"] . "</a></p>";
} else {
    echo "<h1>❌ Error al crear la reunión</h1>";
    echo "<pre>" . print_r($meeting_data, true) . "</pre>";
}
?>

