<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['session_id']) || !isset($_SESSION['student_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Unauthorized access'
    ]);
    exit;
}

require_once 'connection.php';

$current_password = $_POST['current_password'] ?? '';
$new_password = $_POST['new_password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';

if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
    echo json_encode([
        'success' => false,
        'error' => 'All fields are required'
    ]);
    exit;
}

if ($new_password !== $confirm_password) {
    echo json_encode([
        'success' => false,
        'error' => 'New passwords do not match'
    ]);
    exit;
}

if (strlen($new_password) < 8) {
    echo json_encode([
        'success' => false,
        'error' => 'New password must be at least 8 characters long'
    ]);
    exit;
}

if ($current_password === $new_password) {
    echo json_encode([
        'success' => false,
        'error' => 'New password must be different from current password'
    ]);
    exit;
}

$user_id = $_SESSION['session_id'];

$stmt = $conn->prepare("SELECT password FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'error' => 'User not found'
    ]);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

if (!password_verify($current_password, $user['password'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Current password is incorrect'
    ]);
    exit;
}

$new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);

$update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
$update_stmt->bind_param("si", $new_password_hash, $user_id);

if ($update_stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Password changed successfully! Redirecting to login...'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to update password. Please try again.'
    ]);
}

$update_stmt->close();
$conn->close();
?>