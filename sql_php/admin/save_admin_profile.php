<?php
session_start();
header('Content-Type: application/json');
require_once '../connection.php';

// Check if user is logged in
if (!isset($_SESSION['session_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

$user_id = $_SESSION['session_id'];

// Validate input
if (empty($_POST['first_name']) || empty($_POST['last_name']) || 
    empty($_POST['email'])) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
    exit();
}

$first_name = trim($_POST['first_name']);
$middle_initial = !empty($_POST['middle_initial']) ? trim($_POST['middle_initial']) : null;
$last_name = trim($_POST['last_name']);
$email = trim($_POST['email']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Check if admin record exists
$check_query = "SELECT user_id FROM admin WHERE user_id = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("i", $user_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows > 0) {
    // Update existing admin profile
    $query = "UPDATE admin 
              SET first_name = ?, 
                  middle_initial = ?,
                  last_name = ?, 
                  email = ?
              WHERE user_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssi", $first_name, $middle_initial, $last_name, $email, $user_id);
} else {
    // Insert new admin profile
    $query = "INSERT INTO admin (user_id, first_name, middle_initial, last_name, email) 
              VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("issss", $user_id, $first_name, $middle_initial, $last_name, $email);
}

if ($stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'message' => 'Profile updated successfully!'
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to update profile: ' . $conn->error
    ]);
}

$check_stmt->close();
$stmt->close();
$conn->close();
?>