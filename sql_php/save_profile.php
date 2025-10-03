<?php
session_start();
require_once 'connection.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['session_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$user_id = $_SESSION['session_id'];

// Validate POST data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first_name = trim($_POST['first_name'] ?? '');
    $last_name = trim($_POST['last_name'] ?? '');
    $year_level = trim($_POST['year_level'] ?? '');
    $department = trim($_POST['department'] ?? '');
    
    // Validation
    if (empty($first_name) || empty($last_name) || empty($year_level) || empty($department)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }
    
    // Check if profile exists
    $check_query = "SELECT adviser_id FROM instructor WHERE adviser_id = ?";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $exists = $result->num_rows > 0;
    $stmt->close();
    
    if ($exists) {
        // Update existing profile
        $update_query = "UPDATE instructor SET first_name = ?, last_name = ?, year_level_assigned = ?, department = ? WHERE adviser_id = ?";
        $stmt = $conn->prepare($update_query);
        $stmt->bind_param("ssssi", $first_name, $last_name, $year_level, $department, $user_id);
    } else {
        // Insert new profile
        $insert_query = "INSERT INTO instructor (adviser_id, first_name, last_name, year_level_assigned, department) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insert_query);
        $stmt->bind_param("issss", $user_id, $first_name, $last_name, $year_level, $department);
    }
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => $exists ? 'Profile updated successfully' : 'Profile created successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>