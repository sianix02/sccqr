<?php
session_start();
require_once 'connection.php';

// Check if user is logged in
if (!isset($_SESSION['session_id'])) {
    if (isset($_GET['ajax'])) {
        echo json_encode(['has_profile' => false, 'error' => 'Not logged in']);
    } else {
        header("Location: ../index.php");
    }
    exit();
}

$user_id = $_SESSION['session_id'];

// Get instructor profile
$query = "SELECT i.adviser_id, i.first_name, i.middle_initial, i.last_name, 
          i.year_level_assigned, i.department, i.position
          FROM instructor i
          WHERE i.adviser_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Check if profile is complete
    $is_complete = !empty($row['first_name']) && 
                   !empty($row['last_name']) && 
                   !empty($row['department']) && 
                   !empty($row['year_level_assigned']);
    
    $profile_data = array(
        'adviser_id' => $row['adviser_id'],
        'first_name' => $row['first_name'],
        'middle_initial' => $row['middle_initial'],
        'last_name' => $row['last_name'],
        'department' => $row['department'],
        'year_level_assigned' => $row['year_level_assigned'],
        'position' => $row['position']
    );
    
    if (isset($_GET['ajax'])) {
        echo json_encode([
            'has_profile' => $is_complete,
            'profile_data' => $profile_data
        ]);
    }
} else {
    if (isset($_GET['ajax'])) {
        echo json_encode([
            'has_profile' => false,
            'profile_data' => null
        ]);
    }
}

$stmt->close();
$conn->close();
?>