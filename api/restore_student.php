<?php
// File: C:\laragon\www\sccqr\api\restore_student.php
// Description: Restore an archived student (mark as active)

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
    $restoredBy = isset($data['restored_by']) ? trim($data['restored_by']) : 'Admin';
    $notes = isset($data['notes']) ? trim($data['notes']) : 'Restored from archive';
    
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
        // Update student_archive record to mark as not archived
        $sql1 = "UPDATE student_archive 
                SET is_archived = 0, 
                    restored_date = NOW(), 
                    restored_by = ?
                WHERE student_id = ? AND is_archived = 1";
        
        $stmt1 = $conn->prepare($sql1);
        
        if (!$stmt1) {
            throw new Exception('Failed to prepare restore statement: ' . $conn->error);
        }
        
        $stmt1->bind_param('si', $restoredBy, $studentId);
        
        if (!$stmt1->execute()) {
            throw new Exception('Failed to restore student: ' . $stmt1->error);
        }
        
        $affectedRows = $stmt1->affected_rows;
        $stmt1->close();
        
        if ($affectedRows === 0) {
            throw new Exception('Student not found in archives or already restored');
        }
        
        // Insert into archive_history
        $sql2 = "INSERT INTO archive_history 
                (student_id, action, performed_by, notes, action_date)
                VALUES (?, 'restore', ?, ?, NOW())";
        
        $stmt2 = $conn->prepare($sql2);
        
        if (!$stmt2) {
            throw new Exception('Failed to prepare history statement: ' . $conn->error);
        }
        
        $stmt2->bind_param('iss', $studentId, $restoredBy, $notes);
        
        if (!$stmt2->execute()) {
            throw new Exception('Failed to log restore action: ' . $stmt2->error);
        }
        
        $stmt2->close();
        
        // Commit transaction
        $conn->commit();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Student restored successfully',
            'student_id' => $studentId,
            'restored_by' => $restoredBy,
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