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
    
    // Get assigned sets dynamically from students
    $assigned_sets = array();
    $year_level = $row['year_level_assigned'];
    $department = $row['department'];
    $position = strtolower($row['position'] ?? '');
    
    // Build query based on position
    // Dean or Department Head: All sets in department (all year levels)
    // Adviser: Only sets for their specific year level
    if (strpos($position, 'dean') !== false || strpos($position, 'department head') !== false || strpos($position, 'head') !== false) {
        // Dean/Department Head: Get all sets in department across ALL year levels
        $sets_query = "SELECT DISTINCT student_set 
                       FROM student 
                       WHERE course = ? 
                       AND student_set IS NOT NULL 
                       AND student_set != ''
                       ORDER BY student_set ASC";
        $sets_stmt = $conn->prepare($sets_query);
        $sets_stmt->bind_param("s", $department);
    } else {
        // Adviser: Get sets for specific year level and department only
        $sets_query = "SELECT DISTINCT student_set 
                       FROM student 
                       WHERE year_level = ? 
                       AND course = ? 
                       AND student_set IS NOT NULL 
                       AND student_set != ''
                       ORDER BY student_set ASC";
        $sets_stmt = $conn->prepare($sets_query);
        $sets_stmt->bind_param("ss", $year_level, $department);
    }
    
    if ($sets_stmt->execute()) {
        $sets_result = $sets_stmt->get_result();
        while ($set_row = $sets_result->fetch_assoc()) {
            $assigned_sets[] = $set_row['student_set'];
        }
    }
    $sets_stmt->close();
    
    // Add assigned sets to profile data
    $profile_data['assigned_sets'] = $assigned_sets;
    
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