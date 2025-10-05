<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../sql_php/connection.php';

try {
    // Check if user is logged in
    if (!isset($_SESSION['session_id'])) {
        throw new Exception('Unauthorized access');
    }
    
    $user_id = $_SESSION['session_id'];
    
    // Get instructor information including position
    $instructor_query = "SELECT i.adviser_id, i.position, i.year_level_assigned, i.department 
                        FROM instructor i 
                        INNER JOIN users u ON i.adviser_id = u.user_id 
                        WHERE u.user_id = ?";
    $stmt = $conn->prepare($instructor_query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $instructor_result = $stmt->get_result();
    
    if ($instructor_result->num_rows === 0) {
        throw new Exception('Instructor not found');
    }
    
    $instructor = $instructor_result->fetch_assoc();
    $position = strtolower(trim($instructor['position']));
    $year_level = $instructor['year_level_assigned'];
    $department = $instructor['department'];
    
    // Get filters
    $status = isset($_GET['status']) ? $_GET['status'] : 'all';
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    // Build query based on position
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
              WHERE ar.date = CURDATE()";
    
    // Apply role-based filtering
    if (strpos($position, 'dean') !== false) {
        // Dean sees all students in their department
        $query .= " AND s.course = '" . $conn->real_escape_string($department) . "'";
    } else {
        // Class adviser sees only their assigned year level and department
        $query .= " AND s.year_level = '" . $conn->real_escape_string($year_level) . "'";
        $query .= " AND s.course = '" . $conn->real_escape_string($department) . "'";
    }
    
    // Apply status filter
    if ($status !== 'all' && !empty($status)) {
        $query .= " AND ar.remarks = '" . $conn->real_escape_string($status) . "'";
    }
    
    // Apply search filter
    if (!empty($search)) {
        $searchEscaped = $conn->real_escape_string($search);
        $query .= " AND (ar.student_id LIKE '%{$searchEscaped}%' 
                    OR s.first_name LIKE '%{$searchEscaped}%' 
                    OR s.last_name LIKE '%{$searchEscaped}%' 
                    OR s.course LIKE '%{$searchEscaped}%')";
    }
    
    $query .= " ORDER BY ar.time_in DESC LIMIT 100";
    
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
    
    // Get statistics with same filtering
    $statsQuery = "SELECT 
                    COUNT(DISTINCT ar.student_id) as total_students,
                    COUNT(*) as total_checkins,
                    SUM(CASE WHEN ar.remarks = 'present' THEN 1 ELSE 0 END) as present_count,
                    SUM(CASE WHEN ar.remarks = 'late' THEN 1 ELSE 0 END) as late_count,
                    MAX(ar.time_in) as last_checkin
                   FROM attendance_report ar
                   INNER JOIN student s ON ar.student_id = s.student_id
                   WHERE ar.date = CURDATE()";
    
    if (strpos($position, 'dean') !== false) {
        $statsQuery .= " AND s.course = '" . $conn->real_escape_string($department) . "'";
    } else {
        $statsQuery .= " AND s.year_level = '" . $conn->real_escape_string($year_level) . "'";
        $statsQuery .= " AND s.course = '" . $conn->real_escape_string($department) . "'";
    }
    
    $statsResult = $conn->query($statsQuery);
    
    if (!$statsResult) {
        throw new Exception("Stats query failed: " . $conn->error);
    }
    
    $stats = $statsResult->fetch_assoc();
    
    $totalStudents = (int)$stats['total_students'];
    $presentCount = (int)$stats['present_count'];
    $attendanceRate = $totalStudents > 0 ? round(($presentCount / $totalStudents) * 100) : 0;
    
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
        'instructor' => [
            'position' => $instructor['position'],
            'department' => $department,
            'yearLevel' => $year_level
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

if (isset($conn)) {
    $conn->close();
}
?>