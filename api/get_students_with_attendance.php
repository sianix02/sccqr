<?php
// File: C:\laragon\www\sccqr\api\get_students_with_attendance.php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in production
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../sql_php/connection.php';

try {
    // Validate database connection
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? 'Unknown error'));
    }

    // Get all students from student table
    $sql = "SELECT 
                user_id,
                student_id,
                CONCAT(
                    IFNULL(first_name, ''), 
                    ' ', 
                    IFNULL(middle_initial, ''), 
                    IF(middle_initial != '', '. ', ' '),
                    IFNULL(last_name, '')
                ) as full_name,
                first_name,
                middle_initial,
                last_name,
                IFNULL(year_level, 'N/A') as year_level,
                IFNULL(student_set, 'N/A') as student_set,
                IFNULL(course, 'N/A') as course,
                IFNULL(sex, 'N/A') as sex
            FROM student
            ORDER BY last_name ASC, first_name ASC";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $students = [];
    
    while ($row = $result->fetch_assoc()) {
        $studentId = $row['student_id'];
        
        // Get attendance records for this student with corrected column names
        $attendanceSql = "SELECT 
                            event_name,
                            DATE(date_time) as attendance_date,
                            DATE_FORMAT(date_time, '%Y-%m-%d') as date,
                            DATE_FORMAT(date_time, '%W, %M %d, %Y') as date_formatted,
                            TIME_FORMAT(time_in, '%h:%i %p') as time_in_formatted,
                            time_in,
                            TIME_FORMAT(time_out, '%h:%i %p') as time_out_formatted,
                            time_out,
                            COALESCE(remarks, 'present') as status,
                            CASE 
                                WHEN time_out IS NULL THEN 'Incomplete'
                                ELSE 'Complete'
                            END as completion_status
                          FROM attendance_report 
                          WHERE student_id = ?
                          ORDER BY date_time DESC, time_in DESC
                          LIMIT 100";
        
        $attendanceStmt = $conn->prepare($attendanceSql);
        
        if (!$attendanceStmt) {
            throw new Exception("Failed to prepare attendance query: " . $conn->error);
        }
        
        $attendanceStmt->bind_param('i', $studentId);
        
        if (!$attendanceStmt->execute()) {
            throw new Exception("Failed to execute attendance query: " . $attendanceStmt->error);
        }
        
        $attendanceResult = $attendanceStmt->get_result();
        
        $attendance = [];
        $presentCount = 0;
        $lateCount = 0;
        $absentCount = 0;
        $totalAttendance = 0;
        
        while ($attRow = $attendanceResult->fetch_assoc()) {
            // The status comes from remarks column: present, late, or absent
            $status = strtolower($attRow['status']);
            
            // Count attendance by status
            if ($status === 'present') {
                $presentCount++;
            } elseif ($status === 'late') {
                $lateCount++;
            } elseif ($status === 'absent') {
                $absentCount++;
            }
            
            $totalAttendance++;
            
            // Capitalize first letter for display
            $statusDisplay = ucfirst($status);
            
            $attendance[] = [
                'event' => $attRow['event_name'],
                'date' => $attRow['date'], // Numerical format: 2025-11-22
                'date_formatted' => $attRow['date_formatted'], // Text format
                'time_in' => $attRow['time_in_formatted'] ?? 'N/A',
                'time_out' => $attRow['time_out_formatted'] ?? 'Pending',
                'status' => $statusDisplay, // Present, Late, or Absent
                'completion' => $attRow['completion_status'], // Complete or Incomplete
                'is_complete' => $attRow['time_out'] !== null
            ];
        }
        
        $attendanceStmt->close();
        
        // Calculate attendance rate (present + late = attended)
        $attendedCount = $presentCount + $lateCount;
        $attendanceRate = $totalAttendance > 0 
            ? round(($attendedCount / $totalAttendance) * 100, 1) 
            : 0;
        
        $students[] = [
            'id' => (string)$studentId,
            'user_id' => (string)$row['user_id'],
            'student_id' => (string)$studentId,
            'name' => trim($row['full_name']),
            'first_name' => $row['first_name'],
            'middle_initial' => $row['middle_initial'] ?? '',
            'last_name' => $row['last_name'],
            'year' => $row['year_level'],
            'set' => $row['student_set'],
            'course' => $row['course'],
            'sex' => $row['sex'],
            'status' => 'Active',
            'attendance' => $attendance,
            'stats' => [
                'total' => $totalAttendance,
                'present' => $presentCount,
                'late' => $lateCount,
                'absent' => $absentCount,
                'attended' => $attendedCount, // present + late
                'attendance_rate' => $attendanceRate,
                'on_time_rate' => $totalAttendance > 0 
                    ? round(($presentCount / $totalAttendance) * 100, 1) 
                    : 0
            ]
        ];
    }
    
    // Calculate overall statistics
    $totalStudents = count($students);
    $studentsWithAttendance = 0;
    $overallPresentCount = 0;
    $overallLateCount = 0;
    $overallAbsentCount = 0;
    $overallTotalAttendance = 0;
    
    foreach ($students as $student) {
        if ($student['stats']['total'] > 0) {
            $studentsWithAttendance++;
        }
        $overallPresentCount += $student['stats']['present'];
        $overallLateCount += $student['stats']['late'];
        $overallAbsentCount += $student['stats']['absent'];
        $overallTotalAttendance += $student['stats']['total'];
    }
    
    $overallAttendanceRate = $overallTotalAttendance > 0
        ? round((($overallPresentCount + $overallLateCount) / $overallTotalAttendance) * 100, 1)
        : 0;
    
    echo json_encode([
        'success' => true,
        'data' => $students,
        'summary' => [
            'total_students' => $totalStudents,
            'students_with_attendance' => $studentsWithAttendance,
            'total_attendance_records' => $overallTotalAttendance,
            'total_present' => $overallPresentCount,
            'total_late' => $overallLateCount,
            'total_absent' => $overallAbsentCount,
            'overall_attendance_rate' => $overallAttendanceRate
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    error_log('Get Students Attendance Error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
        'error' => $e->getMessage(),
        'file' => basename(__FILE__),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
}

if (isset($conn)) {
    $conn->close();
}
?>