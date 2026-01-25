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

// Validate ONLY editable fields (name fields only)
if (empty($_POST['first_name']) || empty($_POST['last_name'])) {
    echo json_encode(['success' => false, 'message' => 'First name and last name are required']);
    exit();
}

$first_name = trim($_POST['first_name']);
$middle_initial = !empty($_POST['middle_initial']) ? trim($_POST['middle_initial']) : null;
$last_name = trim($_POST['last_name']);

// Sanitize middle initial (uppercase, add period if missing)
if (!empty($middle_initial)) {
    $middle_initial = strtoupper($middle_initial);
    if (!str_ends_with($middle_initial, '.')) {
        $middle_initial .= '.';
    }
}

// IMPORTANT: Only update name fields
// Department, year_level_assigned, and position are READ-ONLY and managed by admin only
$query = "UPDATE instructor 
          SET first_name = ?, 
              middle_initial = ?,
              last_name = ?
          WHERE adviser_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("sssi", $first_name, $middle_initial, $last_name, $user_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true, 
            'message' => 'Profile updated successfully!'
        ]);
    } else {
        // No rows affected - could mean no changes or profile doesn't exist
        // Check if profile exists
        $check_query = "SELECT adviser_id FROM instructor WHERE adviser_id = ?";
        $check_stmt = $conn->prepare($check_query);
        $check_stmt->bind_param("i", $user_id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows === 0) {
            // Profile doesn't exist - create minimal profile
            // Note: Admin should set department, year_level, and position first
            $insert_query = "INSERT INTO instructor 
                            (adviser_id, first_name, middle_initial, last_name) 
                            VALUES (?, ?, ?, ?)";
            $insert_stmt = $conn->prepare($insert_query);
            $insert_stmt->bind_param("isss", $user_id, $first_name, $middle_initial, $last_name);
            
            if ($insert_stmt->execute()) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Profile created successfully! Please contact admin to assign your position and department.'
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Failed to create profile: ' . $conn->error
                ]);
            }
            $insert_stmt->close();
        } else {
            // Profile exists but no changes were made
            echo json_encode([
                'success' => true, 
                'message' => 'No changes detected in profile'
            ]);
        }
        $check_stmt->close();
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to update profile: ' . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>