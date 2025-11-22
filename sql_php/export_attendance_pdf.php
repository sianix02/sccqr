<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

if (!isset($_SESSION['session_id']) || !isset($_SESSION['student_id'])) {
    die('Unauthorized access');
}

if (!file_exists('connection.php')) {
    die('Database configuration not found');
}

require_once 'connection.php';

// Define base paths - UPDATED FOR YOUR LARAGON SETUP
define('BASE_PATH', dirname(__DIR__)); // C:\laragon\www\sccqr
define('FPDF_PATH', BASE_PATH . '/vendor/fpdf/fpdf.php');
define('LOGO1_PATH', BASE_PATH . '/images/Sibonga.jpg');
define('LOGO2_PATH', BASE_PATH . '/images/logo.jpg');

// Check if FPDF is installed
if (!file_exists(FPDF_PATH)) {
    die('FPDF library not found at: ' . FPDF_PATH);
}

require_once(FPDF_PATH);

if (!isset($conn) || $conn->connect_error) {
    die('Database connection failed');
}

$student_id = (int)$_SESSION['student_id'];
$filter_description = isset($_GET['filter']) ? trim($_GET['filter']) : '';

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

    // Get ONLY actual attendance records
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
    ";

    if ($filter_description) {
        $attendance_query .= " AND e.description = ?";
    }

    $attendance_query .= " ORDER BY ar.date_time DESC";

    $attendance_stmt = $conn->prepare($attendance_query);

    if ($filter_description) {
        $attendance_stmt->bind_param("is", $student_id, $filter_description);
    } else {
        $attendance_stmt->bind_param("i", $student_id);
    }

    $attendance_stmt->execute();
    $attendance_result = $attendance_stmt->get_result();
    $records = [];
    
    while ($row = $attendance_result->fetch_assoc()) {
        $records[] = $row;
    }
    $attendance_stmt->close();
    $conn->close();

    // Process records
    $table_rows = [];
    $now = new DateTime('now', new DateTimeZone('Asia/Manila'));
    $present_count = 0;
    $late_count = 0;
    $absent_count = 0;
    
    foreach ($records as $record) {
        $event_name = $record['event_name'];
        $description = $record['description'] ?? 'N/A';
        
        // Format date
        $date_time = new DateTime($record['date_time']);
        $date_formatted = $date_time->format('m/d/Y');
        
        // Format times
        $time_in = 'N/A';
        if ($record['time_in']) {
            $time_in_obj = DateTime::createFromFormat('H:i:s', $record['time_in']);
            if ($time_in_obj) {
                $time_in = $time_in_obj->format('g:i A');
            }
        }
        
        $time_out = 'N/A';
        $status = 'PENDING';
        $remarks = 'Pending';
        
        if ($record['time_out']) {
            $time_out_obj = DateTime::createFromFormat('H:i:s', $record['time_out']);
            if ($time_out_obj) {
                $time_out = $time_out_obj->format('g:i A');
            }
            $status = strtoupper($record['remarks'] ?? 'PRESENT');
            $remarks = ucfirst($record['remarks'] ?? 'present');
            
            if ($status === 'PRESENT') $present_count++;
            if ($status === 'LATE') $late_count++;
        } else {
            $event_date = new DateTime($record['event_date']);
            if ($event_date->format('Y-m-d') < $now->format('Y-m-d')) {
                $status = 'ABSENT';
                $remarks = 'Absent - No Time Out';
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
            'remarks' => $remarks
        ];
    }

    // Calculate statistics
    $total = count($table_rows);
    $attended = $present_count + $late_count;
    $attendance_rate = $total > 0 ? round(($attended / $total) * 100, 1) : 0;

    // ===== CREATE PDF USING FPDF =====
    class PDF extends FPDF {
        private $schoolName = 'UNIVERSITY OF SIBONGA, CEBU, PHILIPPINES';
        private $reportTitle = 'EXTRACURRICULAR ACTIVITIES ATTENDANCE REPORT';
        private $subtitle = 'SCC - Student Community Center';
        
        // Function to convert interlaced PNG to non-interlaced
        private function convertInterlacedPNG($imagePath) {
            // Check if GD library is available
            if (!extension_loaded('gd')) {
                return $imagePath; // Return original if GD not available
            }
            
            // Try to load the image
            $img = @imagecreatefrompng($imagePath);
            if (!$img) {
                return $imagePath; // Return original if can't load
            }
            
            // Create a temporary file
            $tempPath = sys_get_temp_dir() . '/logo_temp_' . uniqid() . '.png';
            
            // Save as non-interlaced PNG
            imagesavealpha($img, true);
            imagepng($img, $tempPath, 9, PNG_NO_FILTER);
            imagedestroy($img);
            
            return $tempPath;
        }
        
        function Header() {
            // Use the defined constants for logo paths
            $logo1 = LOGO1_PATH;
            $logo2 = LOGO2_PATH;
            
            // Add logos if they exist - with error handling for interlaced PNGs
            if (file_exists($logo1)) {
                try {
                    $this->Image($logo1, 10, 10, 25);
                } catch (Exception $e) {
                    error_log('Logo 1 error: ' . $e->getMessage());
                }
            } else {
                error_log('Logo 1 not found at: ' . $logo1);
            }
            
            if (file_exists($logo2)) {
                try {
                    // Convert interlaced PNG if needed
                    $converted_logo = $this->convertInterlacedPNG($logo2);
                    $this->Image($converted_logo, 175, 10, 25);
                    
                    // Clean up temporary file if created
                    if ($converted_logo !== $logo2 && file_exists($converted_logo)) {
                        @unlink($converted_logo);
                    }
                } catch (Exception $e) {
                    error_log('Logo 2 error: ' . $e->getMessage());
                }
            } else {
                error_log('Logo 2 not found at: ' . $logo2);
            }
            
            // School name - lowered position
            $this->SetFont('Arial', 'B', 14);
            $this->SetY(18);  // Changed from 12 to 18 (6mm lower)
            $this->Cell(0, 6, $this->schoolName, 0, 1, 'C');
            
            // Report title
            $this->SetFont('Arial', 'B', 12);
            $this->Cell(0, 6, $this->reportTitle, 0, 1, 'C');
            
            // Subtitle
            $this->SetFont('Arial', '', 9);
            $this->Cell(0, 5, $this->subtitle, 0, 1, 'C');
            
            // Line - lowered position
            $this->SetDrawColor(0, 102, 204);
            $this->SetLineWidth(0.5);
            $this->Line(10, $this->GetY() + 5, 200, $this->GetY() + 5);  // Changed from +2 to +5
            $this->Ln(8);  // Changed from 5 to 8
        }
        
        function Footer() {
            $this->SetY(-15);
            $this->SetFont('Arial', 'I', 8);
            $this->Cell(0, 10, 'Page ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
        }
        
        // Colored table
        function FancyTable($header, $data, $widths) {
            // Colors, line width and bold font
            $this->SetFillColor(0, 102, 204);
            $this->SetTextColor(255);
            $this->SetDrawColor(0, 102, 204);
            $this->SetLineWidth(.3);
            $this->SetFont('', 'B', 9);
            
            // Header
            for($i = 0; $i < count($header); $i++) {
                $this->Cell($widths[$i], 7, $header[$i], 1, 0, 'C', true);
            }
            $this->Ln();
            
            // Color and font restoration
            $this->SetFillColor(224, 235, 255);
            $this->SetTextColor(0);
            $this->SetFont('', '', 8);
            
            // Data
            $fill = false;
            foreach($data as $row) {
                $this->Cell($widths[0], 6, $row[0], 'LR', 0, 'L', $fill);
                
                // Wrap long event names
                $this->Cell($widths[1], 6, substr($row[1], 0, 35), 'LR', 0, 'L', $fill);
                $this->Cell($widths[2], 6, $row[2], 'LR', 0, 'C', $fill);
                $this->Cell($widths[3], 6, $row[3], 'LR', 0, 'C', $fill);
                
                // Status with color
                $status = $row[4];
                if ($status === 'PRESENT') {
                    $this->SetTextColor(40, 167, 69); // Green
                } elseif ($status === 'LATE') {
                    $this->SetTextColor(255, 193, 7); // Yellow
                } elseif ($status === 'ABSENT') {
                    $this->SetTextColor(220, 53, 69); // Red
                } else {
                    $this->SetTextColor(108, 117, 125); // Gray
                }
                $this->Cell($widths[4], 6, $status, 'LR', 0, 'C', $fill);
                $this->SetTextColor(0); // Reset to black
                
                $this->Cell($widths[5], 6, substr($row[5], 0, 20), 'LR', 0, 'L', $fill);
                $this->Ln();
                $fill = !$fill;
            }
            
            // Closing line
            $this->Cell(array_sum($widths), 0, '', 'T');
        }
        
        function InfoBox($label, $value) {
            $this->SetFont('Arial', 'B', 9);
            $this->Cell(50, 6, $label, 1, 0, 'L', true);
            $this->SetFont('Arial', '', 9);
            $this->Cell(140, 6, $value, 1, 1, 'L');
        }
    }

    // Create PDF
    $pdf = new PDF();
    $pdf->AliasNbPages();
    $pdf->SetMargins(10, 10, 10);
    $pdf->SetAutoPageBreak(true, 20);
    $pdf->AddPage();
    
    // Student Information Box
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(240, 248, 255);
    $pdf->Cell(0, 6, 'STUDENT INFORMATION', 1, 1, 'L', true);
    
    $pdf->InfoBox('Name:', $student['first_name'] . ' ' . $student['last_name']);
    $pdf->InfoBox('Student ID:', $student['student_id']);
    $pdf->InfoBox('Year & Set:', $student['year_level'] . ' - ' . $student['student_set']);
    $pdf->InfoBox('Course:', $student['course']);
    $pdf->InfoBox('Sex:', $student['sex']);
    $pdf->InfoBox('Report Date:', date('F d, Y g:i A'));
    
    if ($filter_description) {
        $pdf->SetFillColor(255, 243, 205);
        $pdf->InfoBox('Filter Applied:', $filter_description);
    }
    
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
    
    // Table headers
    $header = array('Date', 'Event', 'Time In', 'Time Out', 'Status', 'Remarks');
    $widths = array(22, 50, 22, 22, 22, 52);
    
    // Prepare data
    $data = array();
    if (count($table_rows) === 0) {
        $data[] = array('', 'No attendance records found', '', '', '', '');
    } else {
        foreach ($table_rows as $row) {
            $data[] = array(
                $row['date'],
                $row['event'],
                $row['time_in'],
                $row['time_out'],
                $row['status'],
                $row['remarks']
            );
        }
    }
    
    $pdf->FancyTable($header, $data, $widths);
    
    // Footer note
    $pdf->Ln(5);
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->MultiCell(0, 4, 'This is an official attendance report generated on ' . date('F d, Y \a\t g:i A') . '. For inquiries, please contact the Student Community Center (SCC) Office.', 0, 'C');
    
    // Output PDF
    $filename = 'Attendance_Report_' . str_replace(' ', '_', $student['first_name'] . '_' . $student['last_name']) . '_' . date('Y-m-d-Hi') . '.pdf';
    $pdf->Output('D', $filename); // D = Download
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