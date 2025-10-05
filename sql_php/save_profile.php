<?php
session_start();
header('Content-Type: application/json');
require_once 'connection.php';

// Check if user is logged in
if (!isset($_SESSION['session_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

$user_id = $_SESSION['session_id'];

// Validate input
if (empty($_POST['first_name']) || empty($_POST['last_name']) || 
    empty($_POST['department']) || empty($_POST['year_level'])) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
    exit();
}

$first_name = trim($_POST['first_name']);
$middle_initial = !empty($_POST['middle_initial']) ? trim($_POST['middle_initial']) : null;
$last_name = trim($_POST['last_name']);
$department = trim($_POST['department']);
$year_level = trim($_POST['year_level']);

// Update instructor profile
$query = "UPDATE instructor 
          SET first_name = ?, 
              middle_initial = ?,
              last_name = ?, 
              department = ?, 
              year_level_assigned = ?
          WHERE adviser_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("sssssi", $first_name, $middle_initial, $last_name, $department, $year_level, $user_id);

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

$stmt->close();
$conn->close();
?>