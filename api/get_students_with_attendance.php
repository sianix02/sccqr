<?php
// File: C:\laragon\www\sccqr\api\get_students_with_attendance.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../sql_php/connection.php';

try {
    // Get all students from student table
    $sql = "SELECT 
                user_id,
                student_id,
                CONCAT(IFNULL(first_name, ''), ' ', IFNULL(last_name, '')) as full_name,
                first_name,
                last_name,
                IFNULL(year_level, 'N/A') as year_level,
                IFNULL(student_set, '') as email,
                IFNULL(course, 'N/A') as course,
                IFNULL(sex, 'N/A') as sex
            FROM student
            ORDER BY student_id ASC";
    
    $result = $conn->query($sql);
    
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
        while ($attRow = $attendanceResult->fetch_assoc()) {
            $attendance[] = [
                'event' => $attRow['event_name'],
                'date' => $attRow['date'],
                'time' => $attRow['time_in'] ? date('h:i A', strtotime($attRow['time_in'])) : 'N/A',
                'status' => !empty($attRow['time_in']) ? 'Present' : 'Absent',
                'remarks' => $attRow['remarks']
            ];
        }
        
        $attendanceCount = count($attendance);
        
        $students[] = [
            'id' => (string)$studentId,
            'name' => trim($row['full_name']),
            'email' => $row['email'],
            'year' => str_replace(' Year', '', $row['year_level']),
            'course' => $row['course'],
            'sex' => $row['sex'],
            'status' => 'Active',
            'attendance' => $attendance,
            'attendanceCount' => $attendanceCount
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $students,
        'total' => count($students),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>