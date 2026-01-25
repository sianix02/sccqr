<?php
// File: instructor_export_all_students.php
// FIXED VERSION - Properly queries students with JOIN to users table

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

try {
    // Get instructor info to filter students
    $instructor_query = "SELECT i.position, i.year_level_assigned, i.department, i.first_name, i.last_name
                         FROM instructor i
                         INNER JOIN users u ON i.adviser_id = u.user_id
                         WHERE u.user_id = ? 
                         LIMIT 1";
    
    $inst_stmt = $conn->prepare($instructor_query);
    $inst_stmt->bind_param("i", $user_id);
    $inst_stmt->execute();
    $inst_result = $inst_stmt->get_result();
    
    if ($inst_result->num_rows === 0) {
        throw new Exception('Instructor not found');
    }
    
    $instructor = $inst_result->fetch_assoc();
    $inst_stmt->close();
    
    $position = strtolower(trim($instructor['position']));
    $year_level = $instructor['year_level_assigned'] ?? '';
    $department = $instructor['department'] ?? '';
    
    // Build query - Get students WITH PROPER JOIN (same as instructor_get_class_students.php)
    $student_query = "SELECT 
                s.student_id,
                CONCAT(
                    IFNULL(s.first_name, ''), 
                    ' ', 
                    IFNULL(s.middle_initial, ''), 
                    ' ', 
                    IFNULL(s.last_name, '')
                ) as full_name,
                s.course,
                s.student_set,
                s.year_level,
                COALESCE(sa.is_archived, 0) as is_archived
            FROM student s
            INNER JOIN users u ON s.user_id = u.user_id
            LEFT JOIN student_archive sa ON s.student_id = sa.student_id
            WHERE 1=1";

    // Apply instructor-specific filtering (same logic as instructor_get_class_students.php)
    if (strpos($position, 'dean') !== false || 
        strpos($position, 'department head') !== false || 
        strpos($position, 'head') !== false) {
        // Dean/Department Head: All students in department
        if (empty($department)) {
            throw new Exception('Department not set for Dean/Department Head');
        }
        $student_query .= " AND s.course = '" . $conn->real_escape_string($department) . "'";
    } else {
        // Adviser: Specific year level in department
        if (empty($year_level) || empty($department)) {
            throw new Exception('Year level or department not set for Adviser');
        }
        $student_query .= " AND s.year_level = '" . $conn->real_escape_string($year_level) . "'";
        $student_query .= " AND s.course = '" . $conn->real_escape_string($department) . "'";
    }

    $student_query .= " ORDER BY s.student_id ASC";
    
    $result = $conn->query($student_query);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $students = [];
    
    // Process each student individually
    while ($row = $result->fetch_assoc()) {
        $student_id = $row['student_id'];
        $isManuallyArchived = (int)$row['is_archived'] === 1;
        
        // ===== COUNT ATTENDANCE PER STUDENT =====
        $attendance_query = "SELECT 
                COUNT(*) as total_attendance,
                SUM(CASE WHEN remarks = 'present' THEN 1 ELSE 0 END) as present_count,
                SUM(CASE WHEN remarks = 'late' THEN 1 ELSE 0 END) as late_count,
                SUM(CASE 
                    WHEN (time_in = '00:00:00' AND time_out = '00:00:00') 
                    OR remarks = 'absent' 
                    THEN 1 
                    ELSE 0 
                END) as absent_count
            FROM attendance_report
            WHERE student_id = ?";
        
        $att_stmt = $conn->prepare($attendance_query);
        $att_stmt->bind_param("i", $student_id);
        $att_stmt->execute();
        $att_result = $att_stmt->get_result();
        $att_data = $att_result->fetch_assoc();
        $att_stmt->close();
        
        $total = (int)($att_data['total_attendance'] ?? 0);
        $present = (int)($att_data['present_count'] ?? 0);
        $late = (int)($att_data['late_count'] ?? 0);
        $absent = (int)($att_data['absent_count'] ?? 0);
        
        // ===== DETERMINE STATUS: Manual archive OR 4+ absences = Inactive =====
        $status = ($isManuallyArchived || $absent >= 4) ? 'Inactive' : 'Active';
        
        $students[] = [
            'id' => $student_id,
            'name' => trim($row['full_name']),
            'course' => $row['course'] ?: 'N/A',
            'set' => $row['student_set'] ?: 'N/A',
            'year' => $row['year_level'] ?: 'N/A',
            'total' => $total,
            'present' => $present,
            'late' => $late,
            'absent' => $absent,
            'status' => $status,
            'is_manually_archived' => $isManuallyArchived
        ];
    }
    
    $conn->close();
    
    // Check if no students found
    if (count($students) === 0) {
        throw new Exception('No students found for your assignment. Please verify your position settings.');
    }
    
    // ===== CREATE PDF =====
    $pdf = new PDF_Generator('L', 'mm', [297, 210]); // A4 Landscape
    $pdf->setReportTitle('INSTRUCTOR CLASS LIST - ATTENDANCE REPORT');
    $pdf->AliasNbPages();
    $pdf->SetMargins(10, 10, 10);
    $pdf->SetAutoPageBreak(true, 20);
    $pdf->AddPage();
    
    // Report Information
    $pdf->SectionHeader('REPORT DETAILS');
    
    $instructor_name = trim($instructor['first_name'] . ' ' . $instructor['last_name']);
    
    // Determine display text for year level
    $isDeanOrHead = (strpos($position, 'dean') !== false || 
                     strpos($position, 'department head') !== false || 
                     strpos($position, 'head') !== false);
    $displayYearLevel = $isDeanOrHead ? 'All Year Levels' : $year_level;
    
    $pdf->InfoBox('Report Date:', date('F d, Y g:i A'));
    $pdf->InfoBox('Instructor:', $instructor_name);
    $pdf->InfoBox('Position:', $instructor['position']);
    $pdf->InfoBox('Department:', $department);
    $pdf->InfoBox('Year Level:', $displayYearLevel);
    $pdf->InfoBox('Total Students:', count($students));
    
    $pdf->Ln(5);
    
    // Statistics
    $activeCount = count(array_filter($students, fn($s) => $s['status'] === 'Active'));
    $inactiveCount = count(array_filter($students, fn($s) => $s['status'] === 'Inactive'));
    $totalPresent = array_sum(array_column($students, 'present'));
    $totalLate = array_sum(array_column($students, 'late'));
    $totalAbsent = array_sum(array_column($students, 'absent'));
    
    // Count students with 4+ absences
    $students_4plus_absences = count(array_filter($students, fn($s) => $s['absent'] >= 4 && !$s['is_manually_archived']));
    $manually_archived = count(array_filter($students, fn($s) => $s['is_manually_archived']));
    
    $pdf->SectionHeader('STATISTICS');
    
    $avgAttendance = ($totalPresent + $totalLate + $totalAbsent) > 0 
        ? round((($totalPresent + $totalLate) / ($totalPresent + $totalLate + $totalAbsent)) * 100, 1) 
        : 0;
    
    $pdf->StatsRow(
        ['Active', 'Inactive', 'Total Present', 'Total Late', 'Total Absent', 'Avg Attendance'],
        [$activeCount, $inactiveCount, $totalPresent, $totalLate, $totalAbsent, $avgAttendance . '%'],
        [46, 46, 46, 46, 46, 47]
    );
    
    $pdf->Ln(2);
    
    // Additional info about inactive students
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->SetTextColor(220, 53, 69);
    $pdf->Cell(0, 5, "Inactive Breakdown: {$students_4plus_absences} student(s) with 4+ absences, {$manually_archived} manually archived", 0, 1, 'C');
    $pdf->SetTextColor(0);
    
    $pdf->Ln(3);
    
    // Students Table
    $pdf->SectionHeader('STUDENT LIST');
    $pdf->Ln(2);
    
    $header = ['ID', 'Name', 'Course', 'Set', 'Year', 'Present', 'Late', 'Absent', 'Rate', 'Status'];
    $widths = [30, 55, 35, 20, 18, 20, 20, 20, 20, 29];
    
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
    
    // Data
    $pdf->SetFillColor(224, 235, 255);
    $pdf->SetTextColor(0);
    $pdf->SetFont('', '', 8);
    
    $fill = false;
    foreach($students as $row) {
        $attended = $row['present'] + $row['late'];
        $attendanceRate = $row['total'] > 0 ? round(($attended / $row['total']) * 100) : 0;
        
        // Highlight rows with 4+ absences
        if ($row['absent'] >= 4) {
            $pdf->SetFillColor(255, 240, 240); // Light red background
        } else {
            $pdf->SetFillColor($fill ? 224 : 255, $fill ? 235 : 255, $fill ? 255 : 255);
        }
        
        $pdf->Cell($widths[0], 7, $row['id'], 'LRB', 0, 'C', true);
        $pdf->Cell($widths[1], 7, substr($row['name'], 0, 30), 'LRB', 0, 'L', true);
        $pdf->Cell($widths[2], 7, substr($row['course'], 0, 15), 'LRB', 0, 'C', true);
        $pdf->Cell($widths[3], 7, $row['set'], 'LRB', 0, 'C', true);
        $pdf->Cell($widths[4], 7, $row['year'], 'LRB', 0, 'C', true);
        $pdf->Cell($widths[5], 7, $row['present'], 'LRB', 0, 'C', true);
        $pdf->Cell($widths[6], 7, $row['late'], 'LRB', 0, 'C', true);
        
        // Highlight absent count if >= 4
        if ($row['absent'] >= 4) {
            $pdf->SetFont('', 'B', 9);
            $pdf->SetTextColor(220, 53, 69);
        }
        $pdf->Cell($widths[7], 7, $row['absent'], 'LRB', 0, 'C', true);
        $pdf->SetFont('', '', 8);
        $pdf->SetTextColor(0);
        
        $pdf->Cell($widths[8], 7, $attendanceRate . '%', 'LRB', 0, 'C', true);
        
        // Status with color
        $colors = $pdf->getStatusColor($row['status']);
        $pdf->SetFillColor($colors[0], $colors[1], $colors[2]);
        $pdf->SetTextColor($colors[3]);
        $pdf->SetFont('', 'B', 8);
        $pdf->Cell($widths[9], 7, $row['status'], 'LRB', 0, 'C', true);
        
        $pdf->SetTextColor(0);
        $pdf->SetFont('', '', 8);
        
        $pdf->Ln();
        $fill = !$fill;
    }
    
    $pdf->Cell(array_sum($widths), 0, '', 'T');
    
    // Footer note
    $pdf->InactiveStatusNote();
    
    // Output
    $filename = 'Instructor_Class_List_' . date('Y-m-d_His') . '.pdf';
    
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