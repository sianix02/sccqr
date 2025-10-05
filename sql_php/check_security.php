<?php
session_start();
header('Content-Type: application/json');
require_once 'connection.php';

if (!isset($_SESSION['session_id'])) {
    echo json_encode(['has_security' => false, 'error' => 'Not logged in']);
    exit();
}

$user_id = $_SESSION['session_id'];

// Check if security questions exist
$query = "SELECT user_id FROM secret_question WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode(['has_security' => $result->num_rows > 0]);

$stmt->close();
$conn->close();
?>