<?php
// File: C:\laragon\www\sccqr\api\get_class_students.php
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
    $instructor_query = "SELECT i.adviser_id, i.position, i.year_level_assigned, i.department,
                                i.first_name, i.last_name
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
    
    // Build student query based on position
    $query = "SELECT 
                s.user_id,
                s.student_id,
                CONCAT(IFNULL(s.first_name, ''), ' ', IFNULL(s.middle_initial, ''), ' ', IFNULL(s.last_name, '')) as full_name,
                s.first_name,
                s.last_name,
                s.year_level,
                IFNULL(s.student_set, 'N/A') as student_set,
                IFNULL(s.course, 'N/A') as course,
                IFNULL(s.sex, 'N/A') as sex
              FROM student s
              WHERE 1=1";
    
    // Apply role-based filtering
    if (strpos($position, 'dean') !== false) {
        // Dean sees all students in their department
        $query .= " AND s.course = ?";
        $params = [$department];
        $types = "s";
    } else {
        // Class adviser sees only their assigned year level and department
        $query .= " AND s.year_level = ? AND s.course = ?";
        $params = [$year_level, $department];
        $types = "ss";
    }
    
    $query .= " ORDER BY s.student_id ASC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $students = [];
    
    while ($row = $result->fetch_assoc()) {
        $studentId = $row['student_id'];
        
        // Get attendance records for this student
        $attendanceSql = "SELECT 
                            event_name,
                            date,
                            time_in,
                            remarks
                          FROM attendance_report 
                          WHERE student_id = ?
                          ORDER BY date DESC, time_in DESC";
        
        $attendanceStmt = $conn->prepare($attendanceSql);
        $attendanceStmt->bind_param('i', $studentId);
        $attendanceStmt->execute();
        $attendanceResult = $attendanceStmt->get_result();
        
        $attendance = [];
        $presentCount = 0;
        
        while ($attRow = $attendanceResult->fetch_assoc()) {
            // Use remarks field to determine actual status
            $status = ucfirst(strtolower($attRow['remarks'] ?? 'Absent'));
            
            // Count only if remarks is 'Present'
            if ($status === 'Present') {
                $presentCount++;
            }
            
            $attendance[] = [
                'event' => $attRow['event_name'],
                'date' => $attRow['date'],
                'time' => $attRow['time_in'] ? date('h:i A', strtotime($attRow['time_in'])) : 'N/A',
                'status' => $status
            ];
        }
        
        $students[] = [
            'id' => (string)$studentId,
            'name' => trim($row['full_name']),
            'set' => $row['student_set'],
            'year' => str_replace(' Year', '', $row['year_level']),
            'course' => $row['course'],
            'sex' => $row['sex'],
            'status' => 'Active',
            'attendance' => $attendance,
            'attendanceCount' => $presentCount
        ];
    }
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $students,
        'total' => count($students),
        'instructor' => [
            'position' => $instructor['position'],
            'department' => $department,
            'yearLevel' => $year_level,
            'name' => trim($instructor['first_name'] . ' ' . $instructor['last_name'])
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?>