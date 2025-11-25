<?php
// File: C:\laragon\www\sccqr\api\archive_student.php
// Description: Archive a student (mark as inactive)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get input data
    $input = file_get_contents('php://input');
    
    if (empty($input)) {
        http_response_code(400);
        die(json_encode([
            'success' => false,
            'message' => 'No data provided'
        ]));
    }
    
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        die(json_encode([
            'success' => false,
            'message' => 'Invalid JSON: ' . json_last_error_msg()
        ]));
    }
    
    $studentId = isset($data['student_id']) ? intval($data['student_id']) : null;
    $reason = isset($data['reason']) ? trim($data['reason']) : 'Manual archive';
    $archivedBy = isset($data['archived_by']) ? trim($data['archived_by']) : 'Admin';
    $notes = isset($data['notes']) ? trim($data['notes']) : null;
    
    if (!$studentId) {
        http_response_code(400);
        die(json_encode([
            'success' => false,
            'message' => 'Student ID is required'
        ]));
    }
    
    require_once '../sql_php/connection.php';
    
    if (!$conn) {
        http_response_code(500);
        die(json_encode([
            'success' => false,
            'message' => 'Database connection failed'
        ]));
    }
    
    // Check if archive table exists
    $checkTable = "SHOW TABLES LIKE 'student_archive'";
    $tableResult = $conn->query($checkTable);
    
    if (!$tableResult || $tableResult->num_rows == 0) {
        http_response_code(400);
        die(json_encode([
            'success' => false,
            'message' => 'Archive table does not exist. Please contact administrator.'
        ]));
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert or update student_archive record
        $sql1 = "INSERT INTO student_archive 
                (student_id, archive_reason, archived_by, notes, is_archived, archived_date)
                VALUES (?, ?, ?, ?, 1, NOW())
                ON DUPLICATE KEY UPDATE 
                    archive_reason = VALUES(archive_reason),
                    archived_by = VALUES(archived_by),
                    notes = VALUES(notes),
                    is_archived = 1,
                    archived_date = NOW(),
                    restored_date = NULL,
                    restored_by = NULL";
        
        $stmt1 = $conn->prepare($sql1);
        
        if (!$stmt1) {
            throw new Exception('Failed to prepare archive statement: ' . $conn->error);
        }
        
        $stmt1->bind_param('isss', $studentId, $reason, $archivedBy, $notes);
        
        if (!$stmt1->execute()) {
            throw new Exception('Failed to archive student: ' . $stmt1->error);
        }
        
        $stmt1->close();
        
        // Insert into archive_history
        $sql2 = "INSERT INTO archive_history 
                (student_id, action, performed_by, reason, notes, action_date)
                VALUES (?, 'archive', ?, ?, ?, NOW())";
        
        $stmt2 = $conn->prepare($sql2);
        
        if (!$stmt2) {
            throw new Exception('Failed to prepare history statement: ' . $conn->error);
        }
        
        $stmt2->bind_param('isss', $studentId, $archivedBy, $reason, $notes);
        
        if (!$stmt2->execute()) {
            throw new Exception('Failed to log archive action: ' . $stmt2->error);
        }
        
        $stmt2->close();
        
        // Commit transaction
        $conn->commit();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Student archived successfully',
            'student_id' => $studentId,
            'reason' => $reason,
            'archived_by' => $archivedBy,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        throw $e;
    }
    
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'error_details' => $e->getMessage()
    ]);
}
?>