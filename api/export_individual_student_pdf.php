<?php
// File: C:\laragon\www\sccqr\api\export_individual_student_pdf.php
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

// Define base paths
define('BASE_PATH', dirname(__DIR__));
define('FPDF_PATH', BASE_PATH . '/vendor/fpdf/fpdf.php');
define('LOGO1_PATH', BASE_PATH . '/images/Sibonga.jpg');
define('LOGO2_PATH', BASE_PATH . '/images/logo.jpg');

if (!file_exists(FPDF_PATH)) {
    die('FPDF library not found at: ' . FPDF_PATH);
}

require_once(FPDF_PATH);

if (!isset($conn) || $conn->connect_error) {
    die('Database connection failed');
}

// Get student ID from URL
$student_id = isset($_GET['student_id']) ? (int)$_GET['student_id'] : 0;

if (!$student_id) {
    die('Invalid student ID');
}

try {
    // Get student info
    $student_query = "
        SELECT s.first_name, s.last_name, s.student_id, s.year_level, s.student_set, s.course, s.sex
        FROM student s
        INNER JOIN users u ON s.user_id = u.user_id
        WHERE s.student_id = ?
        LIMIT 1
    ";

    $student_stmt = $conn->prepare($student_query);
    $student_stmt->bind_param("i", $student_id);
    $student_stmt->execute();
    $student_result = $student_stmt->get_result();
    
    if ($student_result->num_rows === 0) {
        die('Student not found');
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

    // Process records
    $table_rows = [];
    $now = new DateTime('now', new DateTimeZone('Asia/Manila'));
    $present_count = 0;
    $late_count = 0;
    $absent_count = 0;
    
    // Status descriptions
    $status_descriptions = [
        'present' => 'Completed Attendance',
        'late' => 'Arrive 30+ minutes late',
        'absent' => 'Failed to Attend',
        'pending' => 'Active - Time out required'
    ];
    
    foreach ($records as $record) {
        $event_name = $record['event_name'];
        $description = $record['description'] ?? 'N/A';
        
        // Format date
        $date_time = new DateTime($record['date_time']);
        $date_formatted = $date_time->format('m/d/Y');
        
        // Handle time_in for absent students
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
        
        // CHECK IF ABSENT: time_in = '00:00:00' AND time_out = '00:00:00'
        if ($record['time_in'] === '00:00:00' && $record['time_out'] === '00:00:00') {
            $status = 'ABSENT';
            $remarks = 'Absent';
            $status_description = $status_descriptions['absent'];
            $time_in = 'N/A';
            $time_out = 'N/A';
            $absent_count++;
        }
        // CHECK IF HAS TIME OUT
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
        // PENDING: Has time_in but no time_out
        else {
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

    // Calculate statistics
    $total = count($table_rows);
    $attended = $present_count + $late_count;
    $attendance_rate = $total > 0 ? round(($attended / $total) * 100, 1) : 0;

    // ============================================
    // FIXED: Check archive status AFTER counting absences
    // ============================================
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

    // Determine student status: Manual archive OR 4+ absences = Inactive
    $student_status = ($is_manually_archived || $absent_count >= 4) ? 'Inactive' : 'Active';
    $status_reason = '';
    if ($is_manually_archived) {
        $status_reason = ' (Manually Archived)';
    } elseif ($absent_count >= 4) {
        $status_reason = ' (4+ Absences)';
    }

    // ===== CREATE PDF =====
    class PDF extends FPDF {
        private $schoolName = 'Sibonga Community College';
        private $reportTitle = 'INDIVIDUAL STUDENT ATTENDANCE REPORT';
        private $subtitle = 'Poblacion, Sibonga, Cebu 6020';
        
        private function convertInterlacedPNG($imagePath) {
            if (!extension_loaded('gd')) {
                return $imagePath;
            }
            
            $img = @imagecreatefrompng($imagePath);
            if (!$img) {
                return $imagePath;
            }
            
            $tempPath = sys_get_temp_dir() . '/logo_temp_' . uniqid() . '.png';
            
            imagesavealpha($img, true);
            imagepng($img, $tempPath, 9, PNG_NO_FILTER);
            imagedestroy($img);
            
            return $tempPath;
        }
        
        function Header() {
            $logo1 = LOGO1_PATH;
            $logo2 = LOGO2_PATH;
            
            if (file_exists($logo1)) {
                try {
                    $this->Image($logo1, 10, 10, 25);
                } catch (Exception $e) {
                    error_log('Logo 1 error: ' . $e->getMessage());
                }
            }
            
            if (file_exists($logo2)) {
                try {
                    $converted_logo = $this->convertInterlacedPNG($logo2);
                    $this->Image($converted_logo, 175, 10, 25);
                    
                    if ($converted_logo !== $logo2 && file_exists($converted_logo)) {
                        @unlink($converted_logo);
                    }
                } catch (Exception $e) {
                    error_log('Logo 2 error: ' . $e->getMessage());
                }
            }
            
            $this->SetFont('Arial', 'B', 14);
            $this->SetY(18);
            $this->Cell(0, 6, $this->schoolName, 0, 1, 'C');
            
            $this->SetFont('Arial', 'B', 12);
            $this->Cell(0, 6, $this->reportTitle, 0, 1, 'C');
            
            $this->SetFont('Arial', '', 9);
            $this->Cell(0, 5, $this->subtitle, 0, 1, 'C');
            
            $this->SetDrawColor(0, 102, 204);
            $this->SetLineWidth(0.5);
            $this->Line(10, $this->GetY() + 5, 200, $this->GetY() + 5);
            $this->Ln(8);
        }
        
        function Footer() {
            $this->SetY(-15);
            $this->SetFont('Arial', 'I', 8);
            $this->Cell(0, 10, 'Page ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
        }
        
        function AttendanceTable($header, $data, $widths) {
            // Header styling
            $this->SetFillColor(0, 102, 204);
            $this->SetTextColor(255);
            $this->SetDrawColor(0, 102, 204);
            $this->SetLineWidth(.3);
            $this->SetFont('', 'B', 9);
            
            for($i = 0; $i < count($header); $i++) {
                $this->Cell($widths[$i], 7, $header[$i], 1, 0, 'C', true);
            }
            $this->Ln();
            
            // Data styling
            $this->SetFillColor(224, 235, 255);
            $this->SetTextColor(0);
            $this->SetFont('', '', 8);
            
            $fill = false;
            foreach($data as $row) {
                $this->Cell($widths[0], 8, $row['date'], 'LRB', 0, 'C', $fill);
                $this->Cell($widths[1], 8, substr($row['event'], 0, 25), 'LRB', 0, 'L', $fill);
                $this->Cell($widths[2], 8, $row['time_in'], 'LRB', 0, 'C', $fill);
                $this->Cell($widths[3], 8, $row['time_out'], 'LRB', 0, 'C', $fill);
                
                // Color based on remarks
                $status = strtoupper($row['remarks']);
                if ($status === 'PRESENT') {
                    $bgColor = [40, 167, 69];
                    $textColor = 255;
                } elseif ($status === 'LATE') {
                    $bgColor = [255, 193, 7];
                    $textColor = 0;
                } elseif ($status === 'ABSENT') {
                    $bgColor = [220, 53, 69];
                    $textColor = 255;
                } else {
                    $bgColor = [108, 117, 125];
                    $textColor = 255;
                }
                
                $this->SetFillColor($bgColor[0], $bgColor[1], $bgColor[2]);
                $this->SetTextColor($textColor);
                $this->SetFont('', 'B', 8);
                $this->Cell($widths[4], 8, $status, 'LRB', 0, 'C', true);
                
                $this->SetFillColor(255, 255, 255);
                $this->SetTextColor(0);
                $this->SetFont('', '', 8);
                $this->Cell($widths[5], 8, substr($row['status_description'], 0, 30), 'LRB', 0, 'L', true);
                
                $this->Ln();
                $fill = !$fill;
            }
            
            $this->Cell(array_sum($widths), 0, '', 'T');
        }
        
        function InfoBox($label, $value) {
            $this->SetFont('Arial', 'B', 9);
            $this->Cell(50, 6, $label, 1, 0, 'L', true);
            $this->SetFont('Arial', '', 9);
            $this->Cell(140, 6, $value, 1, 1, 'L');
        }
    }

    $pdf = new PDF();
    $pdf->AliasNbPages();
    $pdf->SetMargins(10, 10, 10);
    $pdf->SetAutoPageBreak(true, 20);
    $pdf->AddPage();
    
    // Student Information
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(240, 248, 255);
    $pdf->Cell(0, 6, 'STUDENT INFORMATION', 1, 1, 'L', true);
    
    $pdf->InfoBox('Name:', $student['first_name'] . ' ' . $student['last_name']);
    $pdf->InfoBox('Student ID:', $student['student_id']);
    $pdf->InfoBox('Year & Set:', $student['year_level'] . ' - ' . $student['student_set']);
    $pdf->InfoBox('Course:', $student['course']);
    $pdf->InfoBox('Sex:', $student['sex']);
    $pdf->InfoBox('Status:', $student_status . $status_reason);
    $pdf->InfoBox('Report Date:', date('F d, Y g:i A'));
    
    $pdf->Ln(5);
    
    // Statistics
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(240, 248, 255);
    $pdf->Cell(0, 6, 'ATTENDANCE STATISTICS', 1, 1, 'L', true);
    
    $pdf->SetFont('Arial', 'B', 9);
    $pdf->SetFillColor(0, 102, 204);
    $pdf->SetTextColor(255);
    $pdf->Cell(38, 6, 'Total Events', 1, 0, 'C', true);
    $pdf->Cell(38, 6, 'Present', 1, 0, 'C', true);
    $pdf->Cell(38, 6, 'Late', 1, 0, 'C', true);
    $pdf->Cell(38, 6, 'Absent', 1, 0, 'C', true);
    $pdf->Cell(38, 6, 'Attendance Rate', 1, 1, 'C', true);
    
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetTextColor(0);
    $pdf->Cell(38, 7, $total, 1, 0, 'C');
    $pdf->Cell(38, 7, $present_count, 1, 0, 'C');
    $pdf->Cell(38, 7, $late_count, 1, 0, 'C');
    $pdf->Cell(38, 7, $absent_count, 1, 0, 'C');
    $pdf->Cell(38, 7, $attendance_rate . '%', 1, 1, 'C');
    
    $pdf->Ln(5);
    
    // Attendance Records
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(240, 248, 255);
    $pdf->Cell(0, 6, 'ATTENDANCE RECORDS', 1, 1, 'L', true);
    
    $pdf->Ln(2);
    
    $header = array('Date', 'Event', 'Time In', 'Time Out', 'Remarks', 'Status');
    $widths = array(22, 40, 22, 22, 30, 54);
    
    $data = [];
    if (count($table_rows) === 0) {
        $data[] = [
            'date' => '',
            'event' => 'No attendance records found',
            'time_in' => '',
            'time_out' => '',
            'remarks' => '',
            'status_description' => ''
        ];
    } else {
        $data = $table_rows;
    }
    
    $pdf->AttendanceTable($header, $data, $widths);
    
    // Footer note
    $pdf->Ln(5);
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->MultiCell(0, 4, 'This is an official attendance report generated on ' . date('F d, Y \a\t g:i A') . '. Students with 4 or more absences are automatically marked as Inactive. For inquiries, please contact the Student Community Center (SCC) Office.', 0, 'C');
    
    // Output
    $filename = 'Student_' . str_replace(' ', '_', $student['first_name'] . '_' . $student['last_name']) . '_Report_' . date('Y-m-d') . '.pdf';
    $pdf->Output('D', $filename);
    exit;

} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>