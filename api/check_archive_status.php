<?php
// File: C:\laragon\www\sccqr\api\check_archive_status.php
// Description: Check if a student is archived

header('Content-Type: application/json');

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../sql_php/connection.php';

try {
    $studentId = isset($_GET['student_id']) ? intval($_GET['student_id']) : null;
    
    if (!$studentId) {
        echo json_encode([
            'success' => true,
            'is_archived' => false,
            'message' => 'No student ID provided'
        ]);
        exit;
    }
    
    // Check if student_archive table exists
    $checkTable = "SHOW TABLES LIKE 'student_archive'";
    $tableResult = $conn->query($checkTable);
    
    if ($tableResult->num_rows == 0) {
        // Table doesn't exist yet - student is not archived
        echo json_encode([
            'success' => true,
            'is_archived' => false,
            'message' => 'Archive table does not exist yet'
        ]);
        exit;
    }
    
    // Query archive status
    $sql = "SELECT is_archived, archived_date, archive_reason 
            FROM student_archive 
            WHERE student_id = ? 
            LIMIT 1";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Database prepare failed: ' . $conn->error);
    }
    
    $stmt->bind_param('i', $studentId);
    
    if (!$stmt->execute()) {
        throw new Exception('Database execute failed: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'is_archived' => (bool)$row['is_archived'],
            'archived_date' => $row['archived_date'],
            'archive_reason' => $row['archive_reason']
        ]);
    } else {
        // No archive record found - student is not archived
        echo json_encode([
            'success' => true,
            'is_archived' => false,
            'message' => 'No archive record found'
        ]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'is_archived' => false
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?>