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

$student_id = $_SESSION['student_id'];

// Get all attendance records for the student with remarks (present, late, absent)
$stmt = $conn->prepare("
    SELECT 
        attendance_id,
        event_name,
        date,
        TIME_FORMAT(time_in, '%h:%i %p') as time_in,
        CASE 
            WHEN time_out IS NULL THEN 'Pending'
            ELSE TIME_FORMAT(time_out, '%h:%i %p')
        END as time_out,
        time_out IS NULL as is_active,
        COALESCE(remarks, 'present') as remarks
    FROM attendance_report 
    WHERE student_id = ? 
    ORDER BY date DESC, time_in DESC
    LIMIT 50
");

$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

$records = [];
while ($row = $result->fetch_assoc()) {
    $records[] = $row;
}

$stmt->close();

// Get statistics
$stats_stmt = $conn->prepare("
    SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN time_out IS NOT NULL THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN time_out IS NULL THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN remarks = 'late' AND time_out IS NOT NULL THEN 1 ELSE 0 END) as late,
        SUM(CASE WHEN remarks = 'present' AND time_out IS NOT NULL THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN remarks = 'absent' THEN 1 ELSE 0 END) as absent
    FROM attendance_report 
    WHERE student_id = ?
");

$stats_stmt->bind_param("i", $student_id);
$stats_stmt->execute();
$stats_result = $stats_stmt->get_result();
$stats = $stats_result->fetch_assoc();
$stats_stmt->close();

// Check for active session
$active_stmt = $conn->prepare("
    SELECT event_name 
    FROM attendance_report 
    WHERE student_id = ? AND time_out IS NULL 
    LIMIT 1
");

$active_stmt->bind_param("i", $student_id);
$active_stmt->execute();
$active_result = $active_stmt->get_result();
$active_session = $active_result->num_rows > 0 ? $active_result->fetch_assoc()['event_name'] : null;
$active_stmt->close();

$conn->close();

echo json_encode([
    'success' => true,
    'records' => $records,
    'stats' => $stats,
    'active_session' => $active_session
]);
?>