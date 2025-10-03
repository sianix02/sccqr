<?php
session_start();
require_once 'connection.php';

// Check if user is logged in
if (!isset($_SESSION['session_id'])) {
    header("Location: ../login.php");
    exit();
}

$user_id = $_SESSION['session_id'];

// Check if instructor profile exists
$check_query = "SELECT * FROM instructor WHERE adviser_id = ?";
$stmt = $conn->prepare($check_query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$has_profile = $result->num_rows > 0;
$profile_data = null;

if ($has_profile) {
    $profile_data = $result->fetch_assoc();
}

$stmt->close();

// Return as JSON for AJAX requests
if (isset($_GET['ajax']) && $_GET['ajax'] == '1') {
    header('Content-Type: application/json');
    echo json_encode([
        'has_profile' => $has_profile,
        'profile_data' => $profile_data,
        'user_id' => $user_id
    ]);
    exit();
}
?>