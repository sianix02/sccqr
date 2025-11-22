<?php
session_start();
header('Content-Type: application/json');

// Check authentication
if (!isset($_SESSION['session_id']) || !isset($_SESSION['student_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Unauthorized access'
    ]);
    exit;
}

// Include database connection with error handling
if (!file_exists('connection.php')) {
    echo json_encode([
        'success' => false,
        'error' => 'Database configuration file not found'
    ]);
    exit;
}

require_once 'connection.php';

// Validate database connection
if (!isset($conn) || $conn->connect_error) {
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed'
    ]);
    exit;
}

// Get and validate action
$action = $_POST['action'] ?? '';
$student_id = (int)$_SESSION['student_id']; // Cast to integer for safety

// Validate action parameter
if (!in_array($action, ['time_in', 'time_out'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid action'
    ]);
    exit;
}

// Helper function to validate time format (HH:MM:SS or HH:MM)
function validateTime($time) {
    $pattern = '/^([01][0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/';
    return preg_match($pattern, $time);
}

// Helper function to sanitize input
function sanitizeInput($input) {
    return trim(htmlspecialchars($input, ENT_QUOTES, 'UTF-8'));
}

if ($action === 'time_in') {
    // Get and sanitize inputs
    $event_name = sanitizeInput($_POST['event_name'] ?? '');
    $scheduled_time = sanitizeInput($_POST['scheduled_time'] ?? '');
    $actual_time = sanitizeInput($_POST['actual_time'] ?? '');
    $remarks = sanitizeInput($_POST['remarks'] ?? 'present');
    
    // Validate required fields
    if (empty($event_name)) {
        echo json_encode([
            'success' => false,
            'error' => 'Event name is required'
        ]);
        exit;
    }
    
    if (empty($actual_time)) {
        echo json_encode([
            'success' => false,
            'error' => 'Time is required'
        ]);
        exit;
    }
    
    // Validate time format
    if (!validateTime($actual_time)) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid time format. Use HH:MM or HH:MM:SS'
        ]);
        exit;
    }
    
    // Validate remarks/status
    $valid_statuses = ['present', 'late', 'absent'];
    if (!in_array($remarks, $valid_statuses)) {
        $remarks = 'present'; // Default to present if invalid
    }
    
    // Check for active session (no time_out)
    $check_active_stmt = $conn->prepare("
        SELECT attendance_id, event_name 
        FROM attendance_report 
        WHERE student_id = ? 
        AND time_out IS NULL 
        AND DATE(date_time) = CURDATE()
    ");
    
    if (!$check_active_stmt) {
        echo json_encode([
            'success' => false,
            'error' => 'Database query preparation failed'
        ]);
        exit;
    }
    
    $check_active_stmt->bind_param("i", $student_id);
    $check_active_stmt->execute();
    $active_result = $check_active_stmt->get_result();
    
    if ($active_result->num_rows > 0) {
        $active_event = $active_result->fetch_assoc()['event_name'];
        echo json_encode([
            'success' => false,
            'error' => 'You have an active session for "' . htmlspecialchars($active_event) . '". Please time out first.'
        ]);
        $check_active_stmt->close();
        exit;
    }
    $check_active_stmt->close();
    
    // Check for duplicate attendance today
    $check_duplicate_stmt = $conn->prepare("
        SELECT attendance_id 
        FROM attendance_report 
        WHERE student_id = ? 
        AND event_name = ? 
        AND DATE(date_time) = CURDATE()
    ");
    
    if (!$check_duplicate_stmt) {
        echo json_encode([
            'success' => false,
            'error' => 'Database query preparation failed'
        ]);
        exit;
    }
    
    $check_duplicate_stmt->bind_param("is", $student_id, $event_name);
    $check_duplicate_stmt->execute();
    $duplicate_result = $check_duplicate_stmt->get_result();
    
    if ($duplicate_result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'error' => 'You have already recorded attendance for "' . htmlspecialchars($event_name) . '" today.'
        ]);
        $check_duplicate_stmt->close();
        exit;
    }
    $check_duplicate_stmt->close();
    
    // Insert new attendance record
    $stmt = $conn->prepare("
        INSERT INTO attendance_report 
        (student_id, event_name, date_time, time_in, remarks) 
        VALUES (?, ?, NOW(), ?, ?)
    ");
    
    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'error' => 'Database query preparation failed'
        ]);
        exit;
    }
    
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
            'error' => 'Failed to record time in. Please try again.'
        ]);
    }
    
    $stmt->close();
    
} elseif ($action === 'time_out') {
    // Get and sanitize inputs
    $event_name = sanitizeInput($_POST['event_name'] ?? '');
    $time_out = sanitizeInput($_POST['time_out'] ?? '');
    
    // Validate required fields
    if (empty($event_name)) {
        echo json_encode([
            'success' => false,
            'error' => 'Event name is required'
        ]);
        exit;
    }
    
    if (empty($time_out)) {
        echo json_encode([
            'success' => false,
            'error' => 'Time out is required'
        ]);
        exit;
    }
    
    // Validate time format
    if (!validateTime($time_out)) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid time format. Use HH:MM or HH:MM:SS'
        ]);
        exit;
    }
    
    // Update time_out for active session
    $stmt = $conn->prepare("
        UPDATE attendance_report 
        SET time_out = ? 
        WHERE student_id = ? 
        AND event_name = ? 
        AND time_out IS NULL 
        AND DATE(date_time) = CURDATE()
    ");
    
    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'error' => 'Database query preparation failed'
        ]);
        exit;
    }
    
    $stmt->bind_param("sis", $time_out, $student_id, $event_name);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Get the remarks from the record
            $get_stmt = $conn->prepare("
                SELECT remarks 
                FROM attendance_report 
                WHERE student_id = ? 
                AND event_name = ? 
                AND DATE(date_time) = CURDATE() 
                ORDER BY attendance_id DESC 
                LIMIT 1
            ");
            
            if ($get_stmt) {
                $get_stmt->bind_param("is", $student_id, $event_name);
                $get_stmt->execute();
                $get_result = $get_stmt->get_result();
                $remarks = 'present'; // Default value
                
                if ($get_result->num_rows > 0) {
                    $remarks = $get_result->fetch_assoc()['remarks'] ?? 'present';
                }
                
                $get_stmt->close();
            }
            
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
            'error' => 'Failed to record time out. Please try again.'
        ]);
    }
    
    $stmt->close();
}

$conn->close();
?>