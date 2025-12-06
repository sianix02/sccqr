<?php
/**
 * Get Event Attendance API
 * Location: C:\laragon\www\sccqr\api\get_events_attendance.php
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Include connection file
require_once __DIR__ . '/../sql_php/connection.php';

try {
    // Check connection
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Connection failed: " . ($conn->connect_error ?? 'No connection'));
    }
    
    // Get event_id from query parameter
    if (!isset($_GET['event_id'])) {
        throw new Exception('Event ID is required');
    }
    
    $event_id = intval($_GET['event_id']);
    
    if ($event_id <= 0) {
        throw new Exception('Invalid Event ID');
    }
    
    error_log("Getting attendance for event_id: " . $event_id);
    
    // First, get event details from events table
    $eventQuery = "SELECT event_id, event_name, event_date FROM events WHERE event_id = ?";
    $eventStmt = $conn->prepare($eventQuery);
    
    if (!$eventStmt) {
        throw new Exception('Event query prepare failed: ' . $conn->error);
    }
    
    $eventStmt->bind_param("i", $event_id);
    $eventStmt->execute();
    $eventResult = $eventStmt->get_result();
    
    if ($eventResult->num_rows === 0) {
        throw new Exception('Event not found with ID: ' . $event_id);
    }
    
    $event = $eventResult->fetch_assoc();
    $eventName = $event['event_name'];
    
    error_log("Found event: " . $eventName);
    
    // Get attendance statistics from attendance_report table
    $statsQuery = "
        SELECT 
            COUNT(DISTINCT student_id) as total,
            SUM(CASE WHEN LOWER(remarks) = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN LOWER(remarks) = 'late' THEN 1 ELSE 0 END) as late,
            SUM(CASE WHEN LOWER(remarks) = 'absent' THEN 1 ELSE 0 END) as absent
        FROM attendance_report
        WHERE event_name = ?
    ";
    
    $statsStmt = $conn->prepare($statsQuery);
    
    if (!$statsStmt) {
        throw new Exception('Stats prepare failed: ' . $conn->error);
    }
    
    $statsStmt->bind_param("s", $eventName);
    
    if (!$statsStmt->execute()) {
        throw new Exception('Stats execute failed: ' . $statsStmt->error);
    }
    
    $result = $statsStmt->get_result();
    $stats = $result->fetch_assoc();
    
    // Handle case where no attendance records exist
    if (!$stats || $stats['total'] == 0) {
        error_log("No attendance records found for: " . $eventName);
        $stats = [
            'total' => 0,
            'present' => 0,
            'late' => 0,
            'absent' => 0
        ];
    } else {
        error_log("Found attendance: total=" . $stats['total']);
    }
    
    // Get detailed attendance records
    $detailQuery = "
        SELECT 
            ar.student_id,
            COALESCE(s.first_name, 'Unknown') as first_name,
            COALESCE(s.last_name, 'Student') as last_name,
            COALESCE(s.course, 'N/A') as course,
            COALESCE(s.year_level, 'N/A') as year,
            ar.remarks as status,
            ar.time_in,
            ar.time_out,
            ar.date_time
        FROM attendance_report ar
        LEFT JOIN student s ON ar.student_id = s.student_id
        WHERE ar.event_name = ?
        ORDER BY ar.time_in DESC
    ";
    
    $detailStmt = $conn->prepare($detailQuery);
    
    if (!$detailStmt) {
        throw new Exception('Detail prepare failed: ' . $conn->error);
    }
    
    $detailStmt->bind_param("s", $eventName);
    
    if (!$detailStmt->execute()) {
        throw new Exception('Detail execute failed: ' . $detailStmt->error);
    }
    
    $detailResult = $detailStmt->get_result();
    $attendees = [];
    
    while ($row = $detailResult->fetch_assoc()) {
        $attendees[] = [
            'student_id' => $row['student_id'],
            'name' => trim($row['first_name'] . ' ' . $row['last_name']),
            'course' => $row['course'],
            'year' => $row['year'],
            'status' => ucfirst(strtolower($row['status'])),
            'time_in' => $row['time_in'],
            'time_out' => $row['time_out'],
            'date' => $row['date_time']
        ];
    }
    
    error_log("Found " . count($attendees) . " attendees");
    
    // Return success response
    echo json_encode([
        'success' => true,
        'stats' => [
            'total' => (int)$stats['total'],
            'present' => (int)$stats['present'],
            'late' => (int)$stats['late'],
            'absent' => (int)$stats['absent']
        ],
        'attendees' => $attendees,
        'event_id' => $event_id,
        'event_name' => $eventName
    ], JSON_PRETTY_PRINT);
    
    $eventStmt->close();
    $statsStmt->close();
    $detailStmt->close();
    $conn->close();
    
} catch (Exception $e) {
    error_log("ERROR in get_events_attendance.php: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'stats' => [
            'total' => 0,
            'present' => 0,
            'late' => 0,
            'absent' => 0
        ],
        'attendees' => []
    ], JSON_PRETTY_PRINT);
    
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
}
?>