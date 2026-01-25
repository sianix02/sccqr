<?php
// File: instructor_export_individual_student.php
// FIXED VERSION - Added authorization check and proper student query

session_start();

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

if (!isset($_SESSION['session_id'])) {
    die('Unauthorized access');
}

if (!file_exists('../sql_php/connection.php')) {
    die('Database configuration not found');
}

require_once '../sql_php/connection.php';
require_once '../includes/PDF_Generator.php';

if (!isset($conn) || $conn->connect_error) {
    die('Database connection failed');
}

$user_id = $_SESSION['session_id'];
$student_id = isset($_GET['student_id']) ? (int)$_GET['student_id'] : 0;

if (!$student_id) {
    die('Invalid student ID');
}

try {
    // AUTHORIZATION CHECK: Verify instructor has access to this student
    $auth_query = "SELECT i.position, i.year_level_assigned, i.department
                   FROM instructor i
                   INNER JOIN users u ON i.adviser_id = u.user_id
                   WHERE u.user_id = ?
                   LIMIT 1";
    
    $auth_stmt = $conn->prepare($auth_query);
    $auth_stmt->bind_param("i", $user_id);
    $auth_stmt->execute();
    $auth_result = $auth_stmt->get_result();
    
    if ($auth_result->num_rows === 0) {
        throw new Exception('Instructor not found');
    }
    
    $instructor = $auth_result->fetch_assoc();
    $auth_stmt->close();
    
    $position = strtolower(trim($instructor['position']));
    $year_level = $instructor['year_level_assigned'] ?? '';
    $department = $instructor['department'] ?? '';
    
    // Get student info WITH PROPER JOIN and authorization check
    $student_query = "
        SELECT s.first_name, s.last_name, s.student_id, s.year_level, s.student_set, s.course, s.sex
        FROM student s
        INNER JOIN users u ON s.user_id = u.user_id
        WHERE s.student_id = ?";
    
    // Add authorization filter
    if (strpos($position, 'dean') !== false || 
        strpos($position, 'department head') !== false || 
        strpos($position, 'head') !== false) {
        // Dean/Department Head: Must be in same department
        $student_query .= " AND s.course = ?";
    } else {
        // Adviser: Must be in same year level and department
        $student_query .= " AND s.year_level = ? AND s.course = ?";
    }
    
    $student_query .= " LIMIT 1";

    $student_stmt = $conn->prepare($student_query);
    
    // Bind parameters based on position
    if (strpos($position, 'dean') !== false || 
        strpos($position, 'department head') !== false || 
        strpos($position, 'head') !== false) {
        $student_stmt->bind_param("is", $student_id, $department);
    } else {
        $student_stmt->bind_param("iss", $student_id, $year_level, $department);
    }
    
    $student_stmt->execute();
    $student_result = $student_stmt->get_result();
    
    if ($student_result->num_rows === 0) {
        throw new Exception('Student not found or you do not have permission to view this student');
    }

    $student = $student_result->fetch_assoc();
    $student_stmt->close();

    // Get attendance records
    $attendance_query = "
        SELECT 
            ar.event_name,
            ar.date_time,
            ar.time_in,
            ar.time_out,
            ar.remarks,
            e.description,
            e.event_date
        FROM attendance_report ar
        LEFT JOIN events e ON ar.event_name = e.event_name
        WHERE ar.student_id = ?
        ORDER BY ar.date_time DESC
    ";

    $attendance_stmt = $conn->prepare($attendance_query);
    $attendance_stmt->bind_param("i", $student_id);
    $attendance_stmt->execute();
    $attendance_result = $attendance_stmt->get_result();
    $records = [];
    
    while ($row = $attendance_result->fetch_assoc()) {
        $records[] = $row;
    }
    $attendance_stmt->close();

    // Process records and count properly
    $table_rows = [];
    $now = new DateTime('now', new DateTimeZone('Asia/Manila'));
    $present_count = 0;
    $late_count = 0;
    $absent_count = 0;
    
    $status_descriptions = [
        'present' => 'Completed Attendance',
        'late' => 'Arrive 30+ minutes late',
        'absent' => 'Failed to Attend',
        'pending' => 'Active - Time out required'
    ];
    
    foreach ($records as $record) {
        $event_name = $record['event_name'];
        $description = $record['description'] ?? 'N/A';
        
        $date_time = new DateTime($record['date_time']);
        $date_formatted = $date_time->format('m/d/Y');
        
        $time_in = 'N/A';
        if ($record['time_in'] && $record['time_in'] !== '00:00:00') {
            $time_in_obj = DateTime::createFromFormat('H:i:s', $record['time_in']);
            if ($time_in_obj) {
                $time_in = $time_in_obj->format('g:i A');
            }
        }
        
        $time_out = 'N/A';
        $status = 'PENDING';
        $remarks = 'Pending';
        $status_description = $status_descriptions['pending'];
        
        // ===== IMPROVED ABSENT CHECK =====
        $isAbsent = false;
        
        // Method 1: Check if both time_in and time_out are 00:00:00
        if ($record['time_in'] === '00:00:00' && $record['time_out'] === '00:00:00') {
            $isAbsent = true;
        }
        
        // Method 2: Check if remarks explicitly say 'absent'
        if (strtolower($record['remarks']) === 'absent') {
            $isAbsent = true;
        }
        
        if ($isAbsent) {
            $status = 'ABSENT';
            $remarks = 'Absent';
            $status_description = $status_descriptions['absent'];
            $time_in = 'N/A';
            $time_out = 'N/A';
            $absent_count++;
        }
        // Has time out - completed attendance
        elseif ($record['time_out'] && $record['time_out'] !== '00:00:00') {
            $time_out_obj = DateTime::createFromFormat('H:i:s', $record['time_out']);
            if ($time_out_obj) {
                $time_out = $time_out_obj->format('g:i A');
            }
            $status = strtoupper($record['remarks'] ?? 'PRESENT');
            $remarks = ucfirst($record['remarks'] ?? 'present');
            $status_description = $status_descriptions[strtolower($remarks)] ?? $status_descriptions['present'];
            
            if ($status === 'PRESENT') $present_count++;
            if ($status === 'LATE') $late_count++;
        }
        // Pending but event date passed - count as absent
        else {
            if (isset($record['event_date'])) {
                $event_date = new DateTime($record['event_date']);
                if ($event_date->format('Y-m-d') < $now->format('Y-m-d')) {
                    $status = 'ABSENT';
                    $remarks = 'Absent';
                    $status_description = $status_descriptions['absent'];
                    $time_in = 'N/A';
                    $time_out = 'N/A';
                    $absent_count++;
                }
            }
        }

        $table_rows[] = [
            'date' => $date_formatted,
            'event' => $event_name,
            'description' => $description,
            'time_in' => $time_in,
            'time_out' => $time_out,
            'status' => $status,
            'remarks' => $remarks,
            'status_description' => $status_description
        ];
    }

    $total = count($table_rows);
    $attended = $present_count + $late_count;
    $attendance_rate = $total > 0 ? round(($attended / $total) * 100, 1) : 0;

    // Check manual archive
    $student_archive_query = "SELECT is_archived FROM student_archive WHERE student_id = ? LIMIT 1";
    $archive_stmt = $conn->prepare($student_archive_query);
    $archive_stmt->bind_param("i", $student_id);
    $archive_stmt->execute();
    $archive_result = $archive_stmt->get_result();
    $is_manually_archived = false;

    if ($archive_result->num_rows > 0) {
        $archive_row = $archive_result->fetch_assoc();
        $is_manually_archived = (int)$archive_row['is_archived'] === 1;
    }
    $archive_stmt->close();
    $conn->close();

    // ===== DETERMINE STATUS: 4+ Absences OR Manual Archive = Inactive =====
    $student_status = ($is_manually_archived || $absent_count >= 4) ? 'Inactive' : 'Active';
    $status_reason = '';
    if ($is_manually_archived) {
        $status_reason = ' (Manually Archived)';
    } elseif ($absent_count >= 4) {
        $status_reason = ' (4+ Absences - Auto Inactive)';
    }

    // ===== CREATE PDF =====
    $pdf = new PDF_Generator('P', 'mm', 'A4');
    $pdf->setReportTitle('STUDENT ATTENDANCE REPORT - INSTRUCTOR VIEW');
    $pdf->AliasNbPages();
    $pdf->SetMargins(10, 10, 10);
    $pdf->SetAutoPageBreak(true, 20);
    $pdf->AddPage();
    
    // Student Information
    $pdf->SectionHeader('STUDENT INFORMATION');
    
    $pdf->InfoBox('Name:', $student['first_name'] . ' ' . $student['last_name'], 50, 140);
    $pdf->InfoBox('Student ID:', $student['student_id'], 50, 140);
    $pdf->InfoBox('Year & Set:', $student['year_level'] . ' - ' . $student['student_set'], 50, 140);
    $pdf->InfoBox('Course:', $student['course'], 50, 140);
    $pdf->InfoBox('Sex:', $student['sex'], 50, 140);
    
    // Highlight status if inactive
    $pdf->SetFont('Arial', 'B', 9);
    $pdf->Cell(50, 6, 'Status:', 1, 0, 'L', true);
    $pdf->SetFont('Arial', '', 9);
    
    if ($student_status === 'Inactive') {
        $pdf->SetTextColor(220, 53, 69);
        $pdf->SetFont('Arial', 'B', 9);
    }
    $pdf->Cell(140, 6, $student_status . $status_reason, 1, 1, 'L');
    $pdf->SetTextColor(0);
    $pdf->SetFont('Arial', '', 9);
    
    $pdf->InfoBox('Report Date:', date('F d, Y g:i A'), 50, 140);
    
    $pdf->Ln(5);
    
    // Statistics
    $pdf->SectionHeader('ATTENDANCE STATISTICS');
    
    $pdf->StatsRow(
        ['Total Events', 'Present', 'Late', 'Absent', 'Attendance Rate'],
        [$total, $present_count, $late_count, $absent_count, $attendance_rate . '%'],
        [38, 38, 38, 38, 38]
    );
    
    // Warning if 4+ absences
    if ($absent_count >= 4) {
        $pdf->Ln(2);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetTextColor(220, 53, 69);
        $pdf->Cell(0, 5, "WARNING: Student has {$absent_count} absences (4+ absences = Auto Inactive)", 0, 1, 'C');
        $pdf->SetTextColor(0);
    }
    
    $pdf->Ln(3);
    
    // Attendance Records
    $pdf->SectionHeader('ATTENDANCE RECORDS');
    $pdf->Ln(2);
    
    $header = ['Date', 'Event', 'Time In', 'Time Out', 'Remarks', 'Status'];
    $widths = [22, 40, 22, 22, 30, 54];
    
    if (count($table_rows) === 0) {
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(0, 10, 'No attendance records found', 0, 1, 'C');
    } else {
        // Table Header
        $pdf->SetFillColor(0, 102, 204);
        $pdf->SetTextColor(255);
        $pdf->SetDrawColor(0, 102, 204);
        $pdf->SetLineWidth(.3);
        $pdf->SetFont('', 'B', 9);
        
        for($i = 0; $i < count($header); $i++) {
            $pdf->Cell($widths[$i], 7, $header[$i], 1, 0, 'C', true);
        }
        $pdf->Ln();
        
        $pdf->SetFillColor(224, 235, 255);
        $pdf->SetTextColor(0);
        $pdf->SetFont('', '', 8);
        
        $fill = false;
        foreach($table_rows as $row) {
            // Highlight absent rows
            if (strtoupper($row['remarks']) === 'ABSENT') {
                $pdf->SetFillColor(255, 240, 240); // Light red
            } else {
                $pdf->SetFillColor($fill ? 224 : 255, $fill ? 235 : 255, $fill ? 255 : 255);
            }
            
            $pdf->Cell($widths[0], 8, $row['date'], 'LRB', 0, 'C', true);
            $pdf->Cell($widths[1], 8, substr($row['event'], 0, 25), 'LRB', 0, 'L', true);
            $pdf->Cell($widths[2], 8, $row['time_in'], 'LRB', 0, 'C', true);
            $pdf->Cell($widths[3], 8, $row['time_out'], 'LRB', 0, 'C', true);
            
            $colors = $pdf->getStatusColor($row['remarks']);
            $pdf->SetFillColor($colors[0], $colors[1], $colors[2]);
            $pdf->SetTextColor($colors[3]);
            $pdf->SetFont('', 'B', 8);
            $pdf->Cell($widths[4], 8, strtoupper($row['remarks']), 'LRB', 0, 'C', true);
            
            $pdf->SetFillColor(255, 255, 255);
            $pdf->SetTextColor(0);
            $pdf->SetFont('', '', 8);
            $pdf->Cell($widths[5], 8, substr($row['status_description'], 0, 30), 'LRB', 0, 'L', true);
            
            $pdf->Ln();
            $fill = !$fill;
        }
        
        $pdf->Cell(array_sum($widths), 0, '', 'T');
    }
    
    $pdf->InactiveStatusNote();
    
    $filename = 'Student_' . str_replace(' ', '_', $student['first_name'] . '_' . $student['last_name']) . '_Report_' . date('Y-m-d') . '.pdf';
    
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Transfer-Encoding: binary');
    header('Accept-Ranges: bytes');
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');
    header('Expires: 0');
    
    $pdf->Output('D', $filename);
    exit;

} catch (Exception $e) {
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    header('Content-Type: text/html; charset=utf-8');
    http_response_code(500);
    echo '<!DOCTYPE html>';
    echo '<html><head><title>PDF Generation Error</title></head><body>';
    echo '<h1>Error Generating PDF</h1>';
    echo '<p>' . htmlspecialchars($e->getMessage()) . '</p>';
    echo '<p><a href="javascript:history.back()">Go Back</a></p>';
    echo '</body></html>';
    exit;
}
?>