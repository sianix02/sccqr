<?php
// Suppress error output to prevent breaking JSON response
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Include database connection
    require_once '../sql_php/connection.php';
    
    // Verify connection exists
    if (!isset($conn)) {
        throw new Exception("Database connection not established");
    }
    
    // Check for connection errors
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Initialize stats array
    $stats = [];
    
    // Total Students
    $result = $conn->query("SELECT COUNT(*) as total FROM student");
    if (!$result) {
        throw new Exception("Query failed (total students): " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $stats['total_students'] = (int)$row['total'];
    
    // Total Instructors
    $result = $conn->query("SELECT COUNT(*) as total FROM instructor");
    if (!$result) {
        throw new Exception("Query failed (total instructors): " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $stats['total_instructors'] = (int)$row['total'];
    
    // Total Events (distinct event names from attendance records)
    $result = $conn->query("SELECT COUNT(DISTINCT event_name) as total FROM attendance_report");
    if (!$result) {
        throw new Exception("Query failed (total events): " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $stats['total_events'] = (int)$row['total'];
    
    // Total Attendance Records
    $result = $conn->query("SELECT COUNT(*) as total FROM attendance_report");
    if (!$result) {
        throw new Exception("Query failed (total records): " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $stats['total_attendance_records'] = (int)$row['total'];
    
    // Attendance Status Breakdown
    $result = $conn->query("
        SELECT 
            COALESCE(remarks, 'present') as status,
            COUNT(*) as count
        FROM attendance_report
        GROUP BY COALESCE(remarks, 'present')
    ");
    if (!$result) {
        throw new Exception("Query failed (status breakdown): " . $conn->error);
    }
    
    $presentCount = 0;
    $lateCount = 0;
    $absentCount = 0;
    
    while ($row = $result->fetch_assoc()) {
        $status = strtolower($row['status']);
        $count = (int)$row['count'];
        
        if ($status === 'present') {
            $presentCount = $count;
        } elseif ($status === 'late') {
            $lateCount = $count;
        } elseif ($status === 'absent') {
            $absentCount = $count;
        }
    }
    
    $stats['present_count'] = $presentCount;
    $stats['late_count'] = $lateCount;
    $stats['absent_count'] = $absentCount;
    
    // Calculate engagement rate (students who have attended at least 1 event)
    // Count students with 'present' OR 'late' (both mean they attended)
    $result = $conn->query("
        SELECT COUNT(DISTINCT student_id) as engaged_students 
        FROM attendance_report
        WHERE COALESCE(remarks, 'present') IN ('present', 'late')
    ");
    if (!$result) {
        throw new Exception("Query failed (engagement rate): " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $engaged = (int)$row['engaged_students'];
    
    $stats['engaged_students'] = $engaged;
    $stats['engagement_rate'] = $stats['total_students'] > 0 
        ? round(($engaged / $stats['total_students']) * 100, 1) 
        : 0;
    
    // Calculate on-time rate (present vs total attended)
    $attendedCount = $presentCount + $lateCount;
    $stats['on_time_rate'] = $attendedCount > 0
        ? round(($presentCount / $attendedCount) * 100, 1)
        : 0;
    
    // Get course attendance data for chart (last 6 months)
    // Fixed: Use date_time column instead of date
    $query = "
        SELECT 
            COALESCE(NULLIF(s.course, ''), 'Unknown Course') as course,
            DATE_FORMAT(ar.date_time, '%Y-%m') as month_key,
            DATE_FORMAT(ar.date_time, '%b %Y') as month_label,
            COUNT(DISTINCT ar.student_id) as attendee_count,
            SUM(CASE WHEN COALESCE(ar.remarks, 'present') = 'present' THEN 1 ELSE 0 END) as present_count,
            SUM(CASE WHEN COALESCE(ar.remarks, 'present') = 'late' THEN 1 ELSE 0 END) as late_count,
            SUM(CASE WHEN COALESCE(ar.remarks, 'present') = 'absent' THEN 1 ELSE 0 END) as absent_count
        FROM attendance_report ar
        INNER JOIN student s ON ar.student_id = s.student_id
        WHERE ar.date_time >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY 
            s.course, 
            DATE_FORMAT(ar.date_time, '%Y-%m'),
            DATE_FORMAT(ar.date_time, '%b %Y')
        ORDER BY month_key ASC, s.course
    ";
    
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Query failed (chart data): " . $conn->error);
    }
    
    // Organize data by course
    $chartData = [];
    $monthsMap = []; // month_key => month_label mapping
    
    while ($row = $result->fetch_assoc()) {
        $course = $row['course'];
        $monthKey = $row['month_key'];
        $monthLabel = $row['month_label'];
        
        // Initialize course array if not exists
        if (!isset($chartData[$course])) {
            $chartData[$course] = [
                'total' => [],
                'present' => [],
                'late' => [],
                'absent' => []
            ];
        }
        
        // Store attendance counts for this course and month
        $chartData[$course]['total'][$monthKey] = (int)$row['attendee_count'];
        $chartData[$course]['present'][$monthKey] = (int)$row['present_count'];
        $chartData[$course]['late'][$monthKey] = (int)$row['late_count'];
        $chartData[$course]['absent'][$monthKey] = (int)$row['absent_count'];
        
        // Keep track of all months
        if (!isset($monthsMap[$monthKey])) {
            $monthsMap[$monthKey] = $monthLabel;
        }
    }
    
    // Sort months chronologically (by key: YYYY-MM format)
    ksort($monthsMap);
    $months = array_values($monthsMap);
    $monthKeys = array_keys($monthsMap);
    
    // Fill gaps: ensure all courses have data for all months (0 if no attendance)
    foreach ($chartData as $course => &$courseData) {
        foreach ($monthKeys as $monthKey) {
            if (!isset($courseData['total'][$monthKey])) {
                $courseData['total'][$monthKey] = 0;
                $courseData['present'][$monthKey] = 0;
                $courseData['late'][$monthKey] = 0;
                $courseData['absent'][$monthKey] = 0;
            }
        }
        
        // Sort by month key and convert to indexed arrays
        ksort($courseData['total']);
        ksort($courseData['present']);
        ksort($courseData['late']);
        ksort($courseData['absent']);
        
        $courseData['total'] = array_values($courseData['total']);
        $courseData['present'] = array_values($courseData['present']);
        $courseData['late'] = array_values($courseData['late']);
        $courseData['absent'] = array_values($courseData['absent']);
    }
    unset($courseData); // Break reference
    
    // Get recent activity (last 10 attendance records)
    $recentQuery = "
        SELECT 
            ar.event_name,
            DATE_FORMAT(ar.date_time, '%Y-%m-%d %h:%i %p') as datetime,
            TIME_FORMAT(ar.time_in, '%h:%i %p') as time_in,
            CONCAT(s.first_name, ' ', s.last_name) as student_name,
            COALESCE(ar.remarks, 'present') as status
        FROM attendance_report ar
        INNER JOIN student s ON ar.student_id = s.student_id
        ORDER BY ar.date_time DESC, ar.time_in DESC
        LIMIT 10
    ";
    
    $result = $conn->query($recentQuery);
    if (!$result) {
        throw new Exception("Query failed (recent activity): " . $conn->error);
    }
    
    $recentActivity = [];
    while ($row = $result->fetch_assoc()) {
        $recentActivity[] = [
            'event' => $row['event_name'],
            'datetime' => $row['datetime'],
            'time_in' => $row['time_in'],
            'student' => $row['student_name'],
            'status' => ucfirst($row['status'])
        ];
    }
    
    // Get event summary (top 5 events by attendance)
    $eventQuery = "
        SELECT 
            event_name,
            COUNT(DISTINCT student_id) as total_attendees,
            SUM(CASE WHEN COALESCE(remarks, 'present') = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN COALESCE(remarks, 'present') = 'late' THEN 1 ELSE 0 END) as late,
            SUM(CASE WHEN COALESCE(remarks, 'present') = 'absent' THEN 1 ELSE 0 END) as absent,
            MAX(DATE(date_time)) as last_date
        FROM attendance_report
        GROUP BY event_name
        ORDER BY total_attendees DESC
        LIMIT 5
    ";
    
    $result = $conn->query($eventQuery);
    if (!$result) {
        throw new Exception("Query failed (event summary): " . $conn->error);
    }
    
    $topEvents = [];
    while ($row = $result->fetch_assoc()) {
        $topEvents[] = [
            'name' => $row['event_name'],
            'attendees' => (int)$row['total_attendees'],
            'present' => (int)$row['present'],
            'late' => (int)$row['late'],
            'absent' => (int)$row['absent'],
            'last_date' => $row['last_date']
        ];
    }
    
    // Close connection
    $conn->close();
    
    // Return successful response
    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'chartData' => [
            'labels' => $months,
            'datasets' => $chartData
        ],
        'recentActivity' => $recentActivity,
        'topEvents' => $topEvents,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    // Log the error
    error_log('Analytics API Error: ' . $e->getMessage());
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => basename(__FILE__),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
    
    // Close connection if it exists
    if (isset($conn) && !$conn->connect_error) {
        $conn->close();
    }
}
?>