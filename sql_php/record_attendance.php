<?php

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['session_id']) || !isset($_SESSION['student_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Unauthorized access'
    ]);
    exit;
}

require_once 'connection.php';

$action = $_POST['action'] ?? '';
$student_id = $_SESSION['student_id'];

if ($action === 'time_in') {
    $event_name = $_POST['event_name'] ?? '';
    $scheduled_time = $_POST['scheduled_time'] ?? '';
    $actual_time = $_POST['actual_time'] ?? '';
    $remarks = $_POST['remarks'] ?? 'present'; // This is now the status: present, late, or absent
    
    if (empty($event_name) || empty($actual_time)) {
        echo json_encode([
            'success' => false,
            'error' => 'Missing required fields'
        ]);
        exit;
    }
    
    // Check if student already has an active session (no time_out)
    $check_active_stmt = $conn->prepare("SELECT attendance_id, event_name FROM attendance_report WHERE student_id = ? AND time_out IS NULL");
    $check_active_stmt->bind_param("i", $student_id);
    $check_active_stmt->execute();
    $active_result = $check_active_stmt->get_result();
    
    if ($active_result->num_rows > 0) {
        $active_event = $active_result->fetch_assoc()['event_name'];
        echo json_encode([
            'success' => false,
            'error' => 'You have an active session for "' . $active_event . '". Please time out first.'
        ]);
        $check_active_stmt->close();
        exit;
    }
    $check_active_stmt->close();
    
    // Check if student already attended this event today (with or without time_out)
    $check_duplicate_stmt = $conn->prepare("SELECT attendance_id FROM attendance_report WHERE student_id = ? AND event_name = ? AND date = CURDATE()");
    $check_duplicate_stmt->bind_param("is", $student_id, $event_name);
    $check_duplicate_stmt->execute();
    $duplicate_result = $check_duplicate_stmt->get_result();
    
    if ($duplicate_result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'error' => 'You have already recorded attendance for "' . $event_name . '" today.'
        ]);
        $check_duplicate_stmt->close();
        exit;
    }
    $check_duplicate_stmt->close();
    
    // Insert new attendance record with remarks as status
    $stmt = $conn->prepare("INSERT INTO attendance_report (student_id, event_name, date, time_in, remarks) VALUES (?, ?, CURDATE(), ?, ?)");
    $stmt->bind_param("isss", $student_id, $event_name, $actual_time, $remarks);
    
    if ($stmt->execute()) {
        $attendance_id = $stmt->insert_id;
        
        echo json_encode([
            'success' => true,
            'message' => 'Time in recorded successfully',
            'attendance_id' => $attendance_id,
            'remarks' => $remarks,
            'time_in' => $actual_time
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to record time in: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
    
} elseif ($action === 'time_out') {
    $event_name = $_POST['event_name'] ?? '';
    $time_out = $_POST['time_out'] ?? '';
    
    if (empty($event_name) || empty($time_out)) {
        echo json_encode([
            'success' => false,
            'error' => 'Missing required fields'
        ]);
        exit;
    }
    
    // Update only time_out for the active session (don't change remarks)
    $stmt = $conn->prepare("UPDATE attendance_report SET time_out = ? WHERE student_id = ? AND event_name = ? AND time_out IS NULL AND date = CURDATE()");
    $stmt->bind_param("sis", $time_out, $student_id, $event_name);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Get the remarks from the record
            $get_stmt = $conn->prepare("SELECT remarks FROM attendance_report WHERE student_id = ? AND event_name = ? AND date = CURDATE() ORDER BY attendance_id DESC LIMIT 1");
            $get_stmt->bind_param("is", $student_id, $event_name);
            $get_stmt->execute();
            $get_result = $get_stmt->get_result();
            $remarks = $get_result->fetch_assoc()['remarks'] ?? 'present';
            $get_stmt->close();
            
            echo json_encode([
                'success' => true,
                'message' => 'Time out recorded successfully',
                'time_out' => $time_out,
                'remarks' => $remarks
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'No active session found for this event'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to record time out: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
    
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid action'
    ]);
}

$conn->close();
?>