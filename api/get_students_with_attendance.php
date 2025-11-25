<?php
// File: C:\laragon\www\sccqr\api\get_students_with_attendance.php
// FIXED VERSION - Auto-inactive at 4+ absences
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../sql_php/connection.php';

try {
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? 'Unknown error'));
    }

    $sql = "SELECT 
                s.user_id,
                s.student_id,
                CONCAT(
                    IFNULL(s.first_name, ''), 
                    ' ', 
                    IFNULL(s.middle_initial, ''), 
                    IF(s.middle_initial != '', '. ', ' '),
                    IFNULL(s.last_name, '')
                ) as full_name,
                s.first_name,
                s.middle_initial,
                s.last_name,
                IFNULL(s.year_level, 'N/A') as year_level,
                IFNULL(s.student_set, 'N/A') as student_set,
                IFNULL(s.course, 'N/A') as course,
                IFNULL(s.sex, 'N/A') as sex,
                COALESCE(sa.is_archived, 0) as is_archived,
                sa.archived_date,
                sa.archive_reason,
                sa.archived_by
            FROM student s
            LEFT JOIN student_archive sa ON s.student_id = sa.student_id
            ORDER BY s.last_name ASC, s.first_name ASC";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $students = [];
    
    while ($row = $result->fetch_assoc()) {
        $studentId = $row['student_id'];
        
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
            $status = strtolower($attRow['status']);
            
            if ($status === 'present') {
                $presentCount++;
            } elseif ($status === 'late') {
                $lateCount++;
            } elseif ($status === 'absent') {
                $absentCount++;
            }
            
            $totalAttendance++;
            
            $statusDisplay = ucfirst($status);
            
            $attendance[] = [
                'event' => $attRow['event_name'],
                'date' => $attRow['date'],
                'date_formatted' => $attRow['date_formatted'],
                'time_in' => $attRow['time_in_formatted'] ?? 'N/A',
                'time_out' => $attRow['time_out_formatted'] ?? 'Pending',
                'status' => $statusDisplay,
                'completion' => $attRow['completion_status'],
                'is_complete' => $attRow['time_out'] !== null
            ];
        }
        
        $attendanceStmt->close();
        
        $attendedCount = $presentCount + $lateCount;
        $attendanceRate = $totalAttendance > 0 
            ? round(($attendedCount / $totalAttendance) * 100, 1) 
            : 0;
        
        // ============================================
        // FIXED: Auto-inactive at 4+ absences
        // Manual archive overrides everything
        // ============================================
        $isManuallyArchived = (int)$row['is_archived'] === 1;
        $isAutoInactive = ($absentCount >= 4 && !$isManuallyArchived);
        
        // Status determination
        if ($isManuallyArchived) {
            $studentStatus = 'Inactive';
        } elseif ($absentCount >= 4) {
            $studentStatus = 'Inactive';
        } else {
            $studentStatus = 'Active';
        }
        
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
            'status' => $studentStatus,
            'is_archived' => $isManuallyArchived,
            'is_auto_inactive' => $isAutoInactive,
            'archived_date' => $row['archived_date'],
            'archive_reason' => $row['archive_reason'],
            'archived_by' => $row['archived_by'],
            'absentCount' => $absentCount,
            'attendance' => $attendance,
            'stats' => [
                'total' => $totalAttendance,
                'present' => $presentCount,
                'late' => $lateCount,
                'absent' => $absentCount,
                'attended' => $attendedCount,
                'attendance_rate' => $attendanceRate,
                'on_time_rate' => $totalAttendance > 0 
                    ? round(($presentCount / $totalAttendance) * 100, 1) 
                    : 0
            ]
        ];
    }
    
    $totalStudents = count($students);
    $activeStudents = 0;
    $inactiveStudents = 0;
    $studentsWithAttendance = 0;
    $overallPresentCount = 0;
    $overallLateCount = 0;
    $overallAbsentCount = 0;
    $overallTotalAttendance = 0;
    
    foreach ($students as $student) {
        if ($student['status'] === 'Active') {
            $activeStudents++;
        } else {
            $inactiveStudents++;
        }
        
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
            'active_students' => $activeStudents,
            'inactive_students' => $inactiveStudents,
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