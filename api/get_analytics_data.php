<?php
// Suppress error output to prevent breaking JSON response
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header first
header('Content-Type: application/json');

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
        throw new Exception("Query failed: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $stats['total_students'] = (int)$row['total'];
    
    // Total Instructors
    $result = $conn->query("SELECT COUNT(*) as total FROM instructor");
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $stats['total_instructors'] = (int)$row['total'];
    
    // Total Events (distinct event names)
    $result = $conn->query("SELECT COUNT(DISTINCT event_name) as total FROM attendance_report");
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $stats['total_events'] = (int)$row['total'];
    
    // Calculate engagement rate (students who have attended at least 1 event)
    // Only count students with 'Present' remarks
    $result = $conn->query("
        SELECT COUNT(DISTINCT student_id) as engaged_students 
        FROM attendance_report
        WHERE remarks = 'Present'
    ");
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $engaged = (int)$row['engaged_students'];
    
    $stats['engagement_rate'] = $stats['total_students'] > 0 
        ? round(($engaged / $stats['total_students']) * 100, 1) 
        : 0;
    
    // Get course attendance data for chart
    // Group by course and month, sorted chronologically
    // Only count students who were actually present
    $query = "
        SELECT 
            COALESCE(NULLIF(s.course, ''), 'Unknown Course') as course,
            DATE_FORMAT(ar.date, '%Y-%m') as month_key,
            DATE_FORMAT(ar.date, '%b %Y') as month_label,
            COUNT(DISTINCT ar.student_id) as attendee_count
        FROM attendance_report ar
        INNER JOIN student s ON ar.student_id = s.student_id
        WHERE ar.date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            AND ar.remarks = 'Present'
        GROUP BY 
            s.course, 
            DATE_FORMAT(ar.date, '%Y-%m'),
            DATE_FORMAT(ar.date, '%b %Y')
        ORDER BY month_key ASC, s.course
    ";
    
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
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
            $chartData[$course] = [];
        }
        
        // Store attendance count for this course and month
        $chartData[$course][$monthKey] = (int)$row['attendee_count'];
        
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
    foreach ($chartData as $course => &$data) {
        foreach ($monthKeys as $monthKey) {
            if (!isset($data[$monthKey])) {
                $data[$monthKey] = 0;
            }
        }
        // Sort by month key
        ksort($data);
        // Convert to indexed array (remove keys for Chart.js)
        $data = array_values($data);
    }
    unset($data); // Break reference
    
    // Close connection
    $conn->close();
    
    // Return successful response
    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'chartData' => [
            'labels' => $months,
            'datasets' => $chartData
        ]
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    // General error
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    
    // Close connection if it exists
    if (isset($conn) && !$conn->connect_error) {
        $conn->close();
    }
}
?>