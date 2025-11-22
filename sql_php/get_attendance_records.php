<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

try {
    if (!isset($_SESSION['session_id']) || !isset($_SESSION['student_id'])) {
        throw new Exception('Unauthorized access - Session not found');
    }

    if (!file_exists('connection.php')) {
        throw new Exception('Database configuration file not found');
    }

    require_once 'connection.php';

    if (!isset($conn)) {
        throw new Exception('Database connection variable not set');
    }
    
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    $student_id = (int)$_SESSION['student_id'];
    $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 50;

    // ===== AUTO-MARK ABSENT FOR PAST EVENTS =====
    $mark_absent_query = "
        INSERT INTO attendance_report (student_id, event_name, date_time, time_in, time_out, remarks)
        SELECT 
            ?, 
            e.event_name,
            e.event_date,
            '00:00:00',
            '00:00:00',
            'absent'
        FROM events e
        WHERE e.event_date < NOW()
        AND e.status = 'Active'
        AND NOT EXISTS (
            SELECT 1 
            FROM attendance_report ar 
            WHERE ar.student_id = ? 
            AND ar.event_name = e.event_name
            AND DATE(ar.date_time) = DATE(e.event_date)
        )
    ";
    
    $mark_absent_stmt = $conn->prepare($mark_absent_query);
    if ($mark_absent_stmt) {
        $mark_absent_stmt->bind_param("ii", $student_id, $student_id);
        $mark_absent_stmt->execute();
        $mark_absent_stmt->close();
    }

    // ===== GET ATTENDANCE RECORDS =====
    $attendance_query = "
        SELECT 
            ar.attendance_id,
            ar.student_id,
            ar.event_name,
            ar.date_time,
            ar.time_in,
            ar.time_out,
            ar.remarks,
            e.description,
            e.event_date,
            e.qr_code_data
        FROM attendance_report ar
        LEFT JOIN events e ON ar.event_name = e.event_name
        WHERE ar.student_id = ?
        ORDER BY ar.date_time DESC
        LIMIT ?
    ";

    $attendance_stmt = $conn->prepare($attendance_query);
    if (!$attendance_stmt) {
        throw new Exception('Failed to prepare attendance query: ' . $conn->error);
    }

    $attendance_stmt->bind_param("ii", $student_id, $limit);
    if (!$attendance_stmt->execute()) {
        throw new Exception('Failed to execute attendance query: ' . $attendance_stmt->error);
    }

    $attendance_result = $attendance_stmt->get_result();
    $records = [];
    $event_filters = [];
    
    while ($row = $attendance_result->fetch_assoc()) {
        $event_name = $row['event_name'];
        $description = $row['description'] ?? 'N/A';
        
        // Add to filters
        if ($description && $description !== 'N/A' && !in_array($description, $event_filters)) {
            $event_filters[] = $description;
        }
        
        // Parse QR code to get scheduled time
        $scheduled_time = 'N/A';
        if ($row['qr_code_data']) {
            $parts = explode('-', $row['qr_code_data']);
            if (count($parts) >= 3) {
                $scheduled_time = trim($parts[count($parts) - 1]);
            }
        }

        // Format time_in
        $time_in_formatted = null;
        if ($row['time_in'] && $row['time_in'] !== '00:00:00') {
            $time_in_obj = DateTime::createFromFormat('H:i:s', $row['time_in']);
            if ($time_in_obj) {
                $time_in_formatted = $time_in_obj->format('g:i A');
            }
        }

        // UPDATED LOGIC: Determine status and remarks
        $time_out_formatted = 'N/A';
        $status = 'pending';
        $remarks = 'Active - Time out required';
        $is_active = false;
        
        if ($row['time_out'] && $row['time_out'] !== '00:00:00') {
            // HAS TIME OUT - Completed attendance
            $time_out_obj = DateTime::createFromFormat('H:i:s', $row['time_out']);
            if ($time_out_obj) {
                $time_out_formatted = $time_out_obj->format('g:i A');
            }
            
            // Status is based on remarks field (present/late)
            $status = $row['remarks'] ?: 'present';
            
            // Remarks should show the actual status, not "Completed Attendance"
            $remarks = ucfirst($row['remarks'] ?: 'present');
            
        } else if ($row['time_in'] && $row['time_in'] !== '00:00:00' && (!$row['time_out'] || $row['time_out'] === '00:00:00')) {
            // HAS TIME IN but NO TIME OUT
            $event_date = new DateTime($row['event_date']);
            $now = new DateTime('now', new DateTimeZone('Asia/Manila'));
            
            if ($event_date->format('Y-m-d') < $now->format('Y-m-d')) {
                // Past event with time_in but no time_out = Set status to the remarks
                $status = $row['remarks'] ?: 'present';
                $remarks = ucfirst($row['remarks'] ?: 'present');
                $time_out_formatted = 'N/A';
            } else {
                // Current/future event - Still active
                $status = 'pending';
                $is_active = true;
                $time_out_formatted = 'Pending';
                $remarks = 'Active - Time out required';
            }
            
        } else if ((!$row['time_in'] || $row['time_in'] === '00:00:00') && (!$row['time_out'] || $row['time_out'] === '00:00:00')) {
            // NO TIME IN and NO TIME OUT = ABSENT
            $status = 'absent';
            $remarks = 'Absent';
            $time_in_formatted = 'N/A';
            $time_out_formatted = 'N/A';
        }

        // Format date and time
        $date_time = new DateTime($row['date_time']);
        $date_formatted = $date_time->format('l, F d, Y');
        $date_time_formatted = $date_time->format('n/j/y') . '-' . $date_time->format('g:i A');
        
        $records[] = [
            'attendance_id' => (int)$row['attendance_id'],
            'event_name' => $event_name,
            'description' => $description,
            'date' => $date_time->format('Y-m-d'),
            'date_formatted' => $date_formatted,
            'date_time_formatted' => $date_time_formatted,
            'scheduled_time' => $scheduled_time,
            'time_in' => $time_in_formatted,
            'time_out' => $time_out_formatted,
            'status' => $status,
            'is_active' => $is_active,
            'remarks' => $remarks
        ];
    }
    $attendance_stmt->close();

    // ===== Get statistics =====
    $stats_query = "
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN time_out IS NOT NULL AND remarks = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN time_out IS NOT NULL AND remarks = 'late' THEN 1 ELSE 0 END) as late,
            SUM(CASE WHEN remarks = 'absent' OR (time_in IS NULL AND time_out IS NULL) THEN 1 ELSE 0 END) as absent,
            SUM(CASE WHEN time_out IS NULL AND time_in IS NOT NULL THEN 1 ELSE 0 END) as pending
        FROM attendance_report
        WHERE student_id = ?
    ";

    $stats_stmt = $conn->prepare($stats_query);
    if (!$stats_stmt) {
        throw new Exception('Failed to prepare stats query: ' . $conn->error);
    }

    $stats_stmt->bind_param("i", $student_id);
    if (!$stats_stmt->execute()) {
        throw new Exception('Failed to execute stats query: ' . $stats_stmt->error);
    }

    $stats_result = $stats_stmt->get_result();
    $stats = $stats_result->fetch_assoc();
    $stats_stmt->close();

    // Calculate statistics
    $total = (int)($stats['total'] ?? 0);
    $present = (int)($stats['present'] ?? 0);
    $late = (int)($stats['late'] ?? 0);
    $pending = (int)($stats['pending'] ?? 0);
    $absent = (int)($stats['absent'] ?? 0);
    $attended = $present + $late;
    $completion_rate = $total > 0 ? round(($attended / $total) * 100, 1) : 0;

    // ===== Check for active session =====
    $active_stmt = $conn->prepare("
        SELECT event_name 
        FROM attendance_report
        WHERE student_id = ? 
        AND time_out IS NULL
        AND time_in IS NOT NULL
        AND DATE(date_time) = CURDATE()
        LIMIT 1
    ");
    
    if (!$active_stmt) {
        throw new Exception('Failed to prepare active session query: ' . $conn->error);
    }

    $active_stmt->bind_param("i", $student_id);
    if (!$active_stmt->execute()) {
        throw new Exception('Failed to execute active session query: ' . $active_stmt->error);
    }

    $active_result = $active_stmt->get_result();
    $active_session = null;

    if ($active_result->num_rows > 0) {
        $active_session = $active_result->fetch_assoc()['event_name'];
    }

    $active_stmt->close();
    $conn->close();

    // ===== Return JSON response =====
    echo json_encode([
        'success' => true,
        'records' => $records,
        'stats' => [
            'total' => $total,
            'present' => $present,
            'absent' => $absent,
            'late' => $late,
            'pending' => $pending,
            'completion_rate' => $completion_rate
        ],
        'active_session' => $active_session,
        'event_filters' => $event_filters,
        'total_records' => count($records),
        'limit' => $limit,
        'debug' => [
            'student_id' => $student_id,
            'timestamp' => date('Y-m-d H:i:s'),
            'php_version' => phpversion()
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => basename(__FILE__),
        'line' => $e->getLine()
    ], JSON_PRETTY_PRINT);
    
    error_log('Attendance Records Error: ' . $e->getMessage());
}
?>