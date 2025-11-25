<?php
// File: C:\laragon\www\sccqr\api\auto_mark_absent.php
// Silent background script - safe to include in index.php

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/auto_absent.log');

// Include database connection
$db_path = __DIR__ . '/../sql_php/connection.php';
if (!file_exists($db_path)) {
    error_log("Auto-absent: Database connection file not found");
    return;
}

require_once $db_path;

if (!isset($conn) || $conn->connect_error) {
    error_log("Auto-absent: Database connection failed");
    return;
}

// Check if script has run recently (prevent multiple runs)
$lockFile = __DIR__ . '/../logs/auto_absent.lock';
$lockTime = 3600; // Run only once per hour

if (file_exists($lockFile)) {
    $lastRun = filemtime($lockFile);
    if (time() - $lastRun < $lockTime) {
        // Script ran recently, skip
        return;
    }
}

try {
    // Create/update lock file
    touch($lockFile);
    
    // Start transaction
    $conn->begin_transaction();
    
    $currentDateTime = date('Y-m-d H:i:s');
    $studentsMarked = 0;
    $eventsProcessed = 0;
    $skippedRecords = 0;
    
    // Get all past events that have already occurred
    $eventQuery = "SELECT event_id, event_name, event_date 
                   FROM events 
                   WHERE event_date < ? 
                   AND status != 'Cancelled'
                   ORDER BY event_date ASC";
    
    $eventStmt = $conn->prepare($eventQuery);
    if (!$eventStmt) {
        throw new Exception("Failed to prepare event query: " . $conn->error);
    }
    
    $eventStmt->bind_param("s", $currentDateTime);
    $eventStmt->execute();
    $eventResult = $eventStmt->get_result();
    
    if ($eventResult->num_rows === 0) {
        $conn->commit();
        error_log("Auto-absent: No past events to process");
        return;
    }
    
    // Get all active students
    $studentQuery = "SELECT student_id FROM student";
    $studentResult = $conn->query($studentQuery);
    
    if (!$studentResult) {
        throw new Exception("Failed to fetch students: " . $conn->error);
    }
    
    $students = [];
    while ($row = $studentResult->fetch_assoc()) {
        $students[] = $row['student_id'];
    }
    
    if (empty($students)) {
        $conn->commit();
        error_log("Auto-absent: No students found");
        return;
    }
    
    // Prepare insert statement for absent records
    $insertQuery = "INSERT INTO attendance_report 
                    (student_id, event_name, date_time, time_in, time_out, remarks) 
                    VALUES (?, ?, ?, '00:00:00', NULL, 'absent')";
    
    $insertStmt = $conn->prepare($insertQuery);
    if (!$insertStmt) {
        throw new Exception("Failed to prepare insert statement: " . $conn->error);
    }
    
    // Check if record exists statement
    $checkQuery = "SELECT COUNT(*) as count 
                   FROM attendance_report 
                   WHERE student_id = ? AND event_name = ?";
    
    $checkStmt = $conn->prepare($checkQuery);
    if (!$checkStmt) {
        throw new Exception("Failed to prepare check statement: " . $conn->error);
    }
    
    // Process each past event
    while ($event = $eventResult->fetch_assoc()) {
        $eventName = $event['event_name'];
        $eventDate = $event['event_date'];
        $eventsProcessed++;
        
        // For each student, check if they have attendance record for this event
        foreach ($students as $studentId) {
            // Check if student already has a record for this event
            $checkStmt->bind_param("ss", $studentId, $eventName);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            $row = $checkResult->fetch_assoc();
            
            if ($row['count'] > 0) {
                // Student already has a record (present, late, or absent) - skip
                $skippedRecords++;
                continue;
            }
            
            // Student doesn't have a record - mark as absent
            $insertStmt->bind_param("sss", $studentId, $eventName, $eventDate);
            
            if ($insertStmt->execute()) {
                $studentsMarked++;
            } else {
                error_log("Auto-absent: Failed to mark student $studentId absent for event '$eventName': " . $insertStmt->error);
            }
        }
    }
    
    // Close statements
    $eventStmt->close();
    $insertStmt->close();
    $checkStmt->close();
    
    // Commit transaction
    $conn->commit();
    
    // Log the action
    error_log("Auto-absent completed: Events=$eventsProcessed, Marked=$studentsMarked, Skipped=$skippedRecords");
    
} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($conn)) {
        $conn->rollback();
    }
    
    error_log("Auto-absent error: " . $e->getMessage());
} finally {
    // Don't close connection - it might be needed by index.php
    // Connection will be closed at script end
}
?>