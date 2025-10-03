<?php
//ayaw e delete
// Allow cross-origin requests (for testing)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include database connection
require_once '../sql_php/connection.php';

try {
    // Get optional filters from query parameters
    $timeframe = isset($_GET['timeframe']) ? $_GET['timeframe'] : 'today';
    $status = isset($_GET['status']) ? $_GET['status'] : 'all';
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    // Build the base query with your exact table structure
    $query = "SELECT 
                ar.attendance_id,
                ar.student_id,
                ar.event_name,
                ar.date,
                ar.time_in,
                ar.time_out,
                ar.remarks,
                s.first_name,
                s.last_name,
                s.year_level,
                s.course,
                CONCAT(s.first_name, ' ', s.last_name) as full_name
              FROM attendance_report ar
              INNER JOIN student s ON ar.student_id = s.student_id
              WHERE 1=1";
    
    // Apply timeframe filter
    if ($timeframe === 'today') {
        $query .= " AND ar.date = CURDATE()";
    } elseif ($timeframe === 'this-week') {
        $query .= " AND YEARWEEK(ar.date, 1) = YEARWEEK(CURDATE(), 1)";
    } elseif ($timeframe === 'this-month') {
        $query .= " AND MONTH(ar.date) = MONTH(CURDATE()) AND YEAR(ar.date) = YEAR(CURDATE())";
    }
    
    // Apply status filter if not 'all'
    if ($status !== 'all' && !empty($status)) {
        $query .= " AND ar.remarks = '" . $conn->real_escape_string($status) . "'";
    }
    
    // Apply search filter if provided
    if (!empty($search)) {
        $searchEscaped = $conn->real_escape_string($search);
        $query .= " AND (ar.student_id LIKE '%{$searchEscaped}%' 
                    OR s.first_name LIKE '%{$searchEscaped}%' 
                    OR s.last_name LIKE '%{$searchEscaped}%' 
                    OR s.course LIKE '%{$searchEscaped}%')";
    }
    
    // Order by most recent first
    $query .= " ORDER BY ar.date DESC, ar.time_in DESC LIMIT 100";
    
    // Execute query
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    // Fetch attendance data
    $attendanceData = [];
    while ($row = $result->fetch_assoc()) {
        $attendanceData[] = [
            'id' => (int)$row['attendance_id'],
            'studentId' => $row['student_id'],
            'name' => $row['full_name'],
            'course' => $row['course'] . ' - ' . $row['year_level'],
            'event' => $row['event_name'],
            'status' => $row['remarks'] ? $row['remarks'] : 'present',
            'date' => $row['date'],
            'time' => date('g:i A', strtotime($row['time_in'])),
            'timestamp' => $row['date'] . ' ' . $row['time_in'],
            'timeIn' => $row['time_in'],
            'timeOut' => $row['time_out']
        ];
    }
    
    // Get statistics for today only
    $statsQuery = "SELECT 
                    COUNT(DISTINCT ar.student_id) as total_students,
                    COUNT(*) as total_checkins,
                    SUM(CASE WHEN ar.remarks = 'present' THEN 1 ELSE 0 END) as present_count,
                    SUM(CASE WHEN ar.remarks = 'late' THEN 1 ELSE 0 END) as late_count,
                    MAX(ar.time_in) as last_checkin
                   FROM attendance_report ar
                   WHERE ar.date = CURDATE()";
    
    $statsResult = $conn->query($statsQuery);
    
    if (!$statsResult) {
        throw new Exception("Stats query failed: " . $conn->error);
    }
    
    $stats = $statsResult->fetch_assoc();
    
    // Calculate attendance rate
    $totalStudents = (int)$stats['total_students'];
    $presentCount = (int)$stats['present_count'];
    $attendanceRate = $totalStudents > 0 ? round(($presentCount / $totalStudents) * 100) : 0;
    
    // Format response
    $response = [
        'success' => true,
        'data' => $attendanceData,
        'stats' => [
            'totalStudents' => $totalStudents,
            'presentCount' => $presentCount,
            'lateCount' => (int)$stats['late_count'],
            'attendanceRate' => $attendanceRate,
            'lastCheckin' => $stats['last_checkin'] ? date('g:i A', strtotime($stats['last_checkin'])) : '--:--'
        ],
        'timestamp' => date('Y-m-d H:i:s'),
        'count' => count($attendanceData)
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error occurred',
        'message' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

// Close connection
if (isset($conn)) {
    $conn->close();
}
?>