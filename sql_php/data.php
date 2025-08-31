<?php
session_start();
header('Content-Type: application/json');
include "connection.php";

try {
    // Check if MySQLi connection exists
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Database connection failed']);
        exit;
    }
    
    // Check if session exists
    if (!isset($_SESSION['session_id'])) {
        echo json_encode(['success' => false, 'error' => 'No session found']);
        exit;
    }
    
    $session_id = $_SESSION['session_id'];
    
    // Use prepared statement with MySQLi
    $sql = "SELECT `user_id`, `student_id`, `first_name`, `last_name`, `year_level`, `sex`, `student_set`, `course` FROM `student` WHERE `user_id` = ?";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'Prepare statement failed: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("s", $session_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $student = $result->fetch_assoc();
    
    if ($student) {
        echo json_encode(['success' => true, 'student' => $student]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Student not found']);
    }
    
    $stmt->close();
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?>