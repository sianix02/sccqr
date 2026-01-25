<?php
// File: instructor_get_class_students.php
// UPDATED VERSION - Uses instructor_sets table for proper set assignments

session_start();
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

function sendResponse($success, $message = '', $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

try {
    $connectionPath = __DIR__ . '/../sql_php/connection.php';
    if (!file_exists($connectionPath)) {
        throw new Exception("Database connection file not found");
    }
    
    require_once $connectionPath;
    
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Database connection failed');
    }
    
    if (!isset($_SESSION['session_id'])) {
        http_response_code(401);
        sendResponse(false, 'Unauthorized: Please log in');
    }
    
    $user_id = $_SESSION['session_id'];
    
    // Get instructor information
    $instructor_query = "SELECT 
            i.adviser_id, 
            i.position, 
            i.year_level_assigned,
            i.department,
            i.first_name, 
            i.last_name
        FROM instructor i 
        INNER JOIN users u ON i.adviser_id = u.user_id 
        WHERE u.user_id = ? 
        LIMIT 1";
    
    $stmt = $conn->prepare($instructor_query);
    if (!$stmt) {
        throw new Exception('Prepare instructor query failed: ' . $conn->error);
    }
    
    $stmt->bind_param("i", $user_id);
    
    if (!$stmt->execute()) {
        throw new Exception('Execute instructor query failed: ' . $stmt->error);
    }
    
    $instructor_result = $stmt->get_result();
    
    if ($instructor_result->num_rows === 0) {
        $stmt->close();
        http_response_code(404);
        sendResponse(false, 'Instructor record not found');
    }
    
    $instructor = $instructor_result->fetch_assoc();
    $stmt->close();
    
    if (empty($instructor['position'])) {
        throw new Exception('Instructor position not set');
    }
    
    $position = strtolower(trim($instructor['position']));
    $year_level = $instructor['year_level_assigned'] ?? '';
    $department = $instructor['department'] ?? '';
    $adviser_id = $instructor['adviser_id'];
    
    // Get assigned sets from instructor_sets table
    $sets_query = "SELECT set_name FROM instructor_sets WHERE adviser_id = ? ORDER BY set_name ASC";
    $sets_stmt = $conn->prepare($sets_query);
    $assigned_sets_array = [];
    
    if ($sets_stmt) {
        $sets_stmt->bind_param("i", $adviser_id);
        if ($sets_stmt->execute()) {
            $sets_result = $sets_stmt->get_result();
            while ($set_row = $sets_result->fetch_assoc()) {
                $assigned_sets_array[] = $set_row['set_name'];
            }
        }
        $sets_stmt->close();
    }
    
    // Determine if Dean/Department Head
    $isDeanOrHead = (strpos($position, 'dean') !== false || 
                     strpos($position, 'department head') !== false || 
                     strpos($position, 'head') !== false);
    
    // Build student query based on position
    $query = "SELECT 
            s.user_id,
            s.student_id,
            CONCAT(
                IFNULL(s.first_name, ''), 
                ' ', 
                IFNULL(s.middle_initial, ''), 
                ' ', 
                IFNULL(s.last_name, '')
            ) as full_name,
            s.first_name,
            s.last_name,
            s.year_level,
            IFNULL(s.student_set, 'N/A') as student_set,
            IFNULL(s.course, 'N/A') as course,
            IFNULL(s.sex, 'N/A') as sex
          FROM student s
          INNER JOIN users u ON s.user_id = u.user_id
          WHERE 1=1";
    
    $params = [];
    $types = "";
    
    // Apply role-based filtering
    if ($isDeanOrHead) {
        // Dean/Department Head: All students in department (all year levels, all sets)
        if (empty($department)) {
            throw new Exception('Department not set for Dean/Department Head');
        }
        $query .= " AND s.course = ?";
        $params[] = $department;
        $types .= "s";
    } else {
        // Adviser: Students in specific year level and department
        if (empty($year_level) || empty($department)) {
            throw new Exception('Year level or department not set for Adviser');
        }
        $query .= " AND s.year_level = ? AND s.course = ?";
        $params[] = $year_level;
        $params[] = $department;
        $types .= "ss";
        
        // FILTER BY ASSIGNED SETS from instructor_sets table
        if (count($assigned_sets_array) > 0) {
            $placeholders = implode(',', array_fill(0, count($assigned_sets_array), '?'));
            $query .= " AND s.student_set IN ($placeholders)";
            foreach ($assigned_sets_array as $set) {
                $params[] = $set;
                $types .= "s";
            }
        }
    }
    
    $query .= " ORDER BY s.student_id ASC";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception('Prepare student query failed: ' . $conn->error);
    }
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    if (!$stmt->execute()) {
        throw new Exception('Execute student query failed: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $students = [];
    
    while ($row = $result->fetch_assoc()) {
        $studentId = $row['student_id'];
        
        // Get attendance with absence counting
        $attendanceSql = "SELECT 
                event_name,
                DATE(date_time) as attendance_date,
                time_in,
                time_out,
                remarks
              FROM attendance_report 
              WHERE student_id = ?
              ORDER BY date_time DESC, time_in DESC";
        
        $attendanceStmt = $conn->prepare($attendanceSql);
        if (!$attendanceStmt) {
            error_log('Attendance prepare failed for student ' . $studentId . ': ' . $conn->error);
            $attendance = [];
            $presentCount = 0;
            $absentCount = 0;
        } else {
            $attendanceStmt->bind_param('i', $studentId);
            
            if (!$attendanceStmt->execute()) {
                error_log('Attendance execute failed for student ' . $studentId . ': ' . $attendanceStmt->error);
                $attendance = [];
                $presentCount = 0;
                $absentCount = 0;
            } else {
                $attendanceResult = $attendanceStmt->get_result();
                $attendance = [];
                $presentCount = 0;
                $absentCount = 0;
                
                while ($attRow = $attendanceResult->fetch_assoc()) {
                    $remarks = strtolower($attRow['remarks'] ?? 'absent');
                    $timeIn = $attRow['time_in'] ?? '00:00:00';
                    $timeOut = $attRow['time_out'] ?? '00:00:00';
                    
                    // Count absences
                    if ($timeIn === '00:00:00' && $timeOut === '00:00:00') {
                        $absentCount++;
                        $status = 'Absent';
                    } else {
                        $status = ucfirst($remarks);
                    }
                    
                    if ($status === 'Present') {
                        $presentCount++;
                    }
                    
                    // Format time
                    $formattedTime = 'N/A';
                    if ($timeIn && $timeIn !== '00:00:00') {
                        $time = DateTime::createFromFormat('H:i:s', $timeIn);
                        if ($time) {
                            $formattedTime = $time->format('h:i A');
                        }
                    }
                    
                    $attendance[] = [
                        'event' => $attRow['event_name'] ?? 'Unknown Event',
                        'date' => $attRow['attendance_date'] ?? date('Y-m-d'),
                        'time' => $formattedTime,
                        'status' => $status
                    ];
                }
            }
            
            $attendanceStmt->close();
        }
        
        // Check manual archive status
        $archiveQuery = "SELECT is_archived FROM student_archive WHERE student_id = ? LIMIT 1";
        $archiveStmt = $conn->prepare($archiveQuery);
        $isManuallyArchived = false;
        
        if ($archiveStmt) {
            $archiveStmt->bind_param('i', $studentId);
            if ($archiveStmt->execute()) {
                $archiveResult = $archiveStmt->get_result();
                if ($archiveResult->num_rows > 0) {
                    $archiveRow = $archiveResult->fetch_assoc();
                    $isManuallyArchived = (int)$archiveRow['is_archived'] === 1;
                }
            }
            $archiveStmt->close();
        }
        
        // Instructor rule: Manual Archive OR 4+ Absences = Inactive
        $studentStatus = ($isManuallyArchived || $absentCount >= 4) ? 'Inactive' : 'Active';
        
        $students[] = [
            'id' => (string)$studentId,
            'name' => trim($row['full_name']),
            'set' => $row['student_set'],
            'year' => str_replace(' Year', '', $row['year_level']),
            'course' => $row['course'],
            'sex' => $row['sex'],
            'status' => $studentStatus,
            'attendance' => $attendance,
            'attendanceCount' => $presentCount,
            'absentCount' => $absentCount,
            'isManuallyArchived' => $isManuallyArchived
        ];
    }
    
    $stmt->close();
    
    // For display: if no sets assigned but Dean/Head, get all unique sets from students
    if ($isDeanOrHead && count($assigned_sets_array) === 0) {
        $uniqueSets = array_unique(array_column($students, 'set'));
        $assigned_sets_array = array_values($uniqueSets);
        sort($assigned_sets_array);
    }
    
    $displayYearLevel = $isDeanOrHead ? 'All Year Levels' : $year_level;
    
    // Success response
    echo json_encode([
        'success' => true,
        'data' => $students,
        'total' => count($students),
        'instructor' => [
            'position' => $instructor['position'],
            'department' => $department,
            'yearLevel' => $displayYearLevel,
            'name' => trim($instructor['first_name'] . ' ' . $instructor['last_name']),
            'isDeanOrHead' => $isDeanOrHead,
            'assignedSets' => $assigned_sets_array
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    error_log('Class management error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}
?>