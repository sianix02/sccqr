<?php
session_start();
header('Content-Type: application/json');

require_once 'connection.php';

if (!isset($_SESSION['session_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

try {
    $user_id = $_SESSION['session_id'];
    
    // Get student_id from user_id
    $stmt = $conn->prepare("SELECT student_id FROM student WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Student not found']);
        exit;
    }
    
    $student = $result->fetch_assoc();
    $student_id = $student['student_id'];
    
    // Check if student is archived
    $stmt = $conn->prepare("
        SELECT is_archived, archive_reason, archived_date 
        FROM student_archive 
        WHERE student_id = ? AND is_archived = 1
    ");
    $stmt->bind_param("s", $student_id);
    $stmt->execute();
    $archive_result = $stmt->get_result();
    
    if ($archive_result->num_rows > 0) {
        $archive_data = $archive_result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'is_archived' => true,
            'archive_reason' => $archive_data['archive_reason'],
            'archived_date' => $archive_data['archived_date']
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'is_archived' => false
        ]);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>