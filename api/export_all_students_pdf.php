<?php
// File: C:\laragon\www\sccqr\api\export_all_students_pdf.php
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

// Get filters from URL
$status_filter = isset($_GET['status']) ? $_GET['status'] : 'all';
$course_filter = isset($_GET['course']) ? $_GET['course'] : 'all';
$year_filter = isset($_GET['year']) ? $_GET['year'] : 'all';
$sort_by = isset($_GET['sort']) ? $_GET['sort'] : 'id-asc';

try {
    // Build query - FIXED VERSION
    $query = "SELECT 
                s.student_id,
                CONCAT(s.first_name, ' ', IFNULL(s.middle_initial, ''), ' ', s.last_name) as full_name,
                s.course,
                s.student_set,
                s.year_level,
                COUNT(DISTINCT ar.attendance_id) as total_attendance,
                SUM(CASE WHEN ar.remarks = 'present' THEN 1 ELSE 0 END) as present_count,
                SUM(CASE WHEN ar.remarks = 'late' THEN 1 ELSE 0 END) as late_count,
                SUM(CASE WHEN ar.remarks = 'absent' OR (ar.time_in = '00:00:00' AND ar.time_out = '00:00:00') THEN 1 ELSE 0 END) as absent_count,
                COALESCE(sa.is_archived, 0) as is_archived
            FROM student s
            LEFT JOIN attendance_report ar ON s.student_id = ar.student_id
            LEFT JOIN student_archive sa ON s.student_id = sa.student_id
            WHERE 1=1";

    // Apply course filter
    if ($course_filter !== 'all') {
        $query .= " AND s.course = '" . $conn->real_escape_string($course_filter) . "'";
    }

    // Apply year filter
    if ($year_filter !== 'all') {
        $query .= " AND s.year_level = '" . $conn->real_escape_string($year_filter) . "'";
    }

    $query .= " GROUP BY s.student_id, s.first_name, s.middle_initial, s.last_name, s.course, s.student_set, s.year_level, sa.is_archived";
    
    // Apply sorting
    switch($sort_by) {
        case 'id-asc':
            $query .= " ORDER BY s.student_id ASC";
            break;
        case 'id-desc':
            $query .= " ORDER BY s.student_id DESC";
            break;
        case 'name-asc':
            $query .= " ORDER BY full_name ASC";
            break;
        case 'name-desc':
            $query .= " ORDER BY full_name DESC";
            break;
        case 'course-asc':
            $query .= " ORDER BY s.course ASC, full_name ASC";
            break;
        case 'course-desc':
            $query .= " ORDER BY s.course DESC, full_name ASC";
            break;
        case 'year-asc':
            $query .= " ORDER BY s.year_level ASC, full_name ASC";
            break;
        case 'year-desc':
            $query .= " ORDER BY s.year_level DESC, full_name ASC";
            break;
        case 'attendance-high':
            $query .= " ORDER BY (present_count + late_count) DESC";
            break;
        case 'attendance-low':
            $query .= " ORDER BY (present_count + late_count) ASC";
            break;
        default:
            $query .= " ORDER BY s.student_id ASC";
    }
    
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $absentCount = (int)$row['absent_count'];
        $isManuallyArchived = (int)$row['is_archived'] === 1;
        
        // FIXED: Manual archive OR 4+ absences = Inactive
        $status = ($isManuallyArchived || $absentCount >= 4) ? 'Inactive' : 'Active';
        
        // Apply status filter
        if ($status_filter !== 'all' && strtolower($status) !== strtolower($status_filter)) {
            continue;
        }
        
        $students[] = [
            'id' => $row['student_id'],
            'name' => $row['full_name'],
            'course' => $row['course'] ?: 'N/A',
            'set' => $row['student_set'] ?: 'N/A',
            'year' => $row['year_level'] ?: 'N/A',
            'total' => (int)$row['total_attendance'],
            'present' => (int)$row['present_count'],
            'late' => (int)$row['late_count'],
            'absent' => $absentCount,
            'status' => $status
        ];
    }
    
    $conn->close();
    
    // Create PDF
    class PDF extends FPDF {
        private $schoolName = 'Sibonga Community College';
        private $reportTitle = 'ALL STUDENTS ATTENDANCE REPORT';
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
                    $this->Image($converted_logo, 260, 10, 25);
                    
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
            $this->Line(10, $this->GetY() + 5, 287, $this->GetY() + 5);
            $this->Ln(8);
        }
        
        function Footer() {
            $this->SetY(-15);
            $this->SetFont('Arial', 'I', 8);
            $this->Cell(0, 10, 'Page ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
        }
        
        function StudentTable($header, $data, $widths) {
            // Header
            $this->SetFillColor(0, 102, 204);
            $this->SetTextColor(255);
            $this->SetDrawColor(0, 102, 204);
            $this->SetLineWidth(.3);
            $this->SetFont('', 'B', 9);
            
            for($i = 0; $i < count($header); $i++) {
                $this->Cell($widths[$i], 7, $header[$i], 1, 0, 'C', true);
            }
            $this->Ln();
            
            // Data
            $this->SetFillColor(224, 235, 255);
            $this->SetTextColor(0);
            $this->SetFont('', '', 8);
            
            $fill = false;
            foreach($data as $row) {
                $attended = $row['present'] + $row['late'];
                $attendanceRate = $row['total'] > 0 ? round(($attended / $row['total']) * 100) : 0;
                
                $this->Cell($widths[0], 7, $row['id'], 'LRB', 0, 'C', $fill);
                $this->Cell($widths[1], 7, substr($row['name'], 0, 30), 'LRB', 0, 'L', $fill);
                $this->Cell($widths[2], 7, substr($row['course'], 0, 15), 'LRB', 0, 'C', $fill);
                $this->Cell($widths[3], 7, $row['set'], 'LRB', 0, 'C', $fill);
                $this->Cell($widths[4], 7, $row['year'], 'LRB', 0, 'C', $fill);
                $this->Cell($widths[5], 7, $row['present'], 'LRB', 0, 'C', $fill);
                $this->Cell($widths[6], 7, $row['late'], 'LRB', 0, 'C', $fill);
                $this->Cell($widths[7], 7, $row['absent'], 'LRB', 0, 'C', $fill);
                $this->Cell($widths[8], 7, $attendanceRate . '%', 'LRB', 0, 'C', $fill);
                
                // Status with color
                if ($row['status'] === 'Active') {
                    $this->SetFillColor(40, 167, 69);
                    $this->SetTextColor(255);
                } else {
                    $this->SetFillColor(220, 53, 69);
                    $this->SetTextColor(255);
                }
                $this->SetFont('', 'B', 8);
                $this->Cell($widths[9], 7, $row['status'], 'LRB', 0, 'C', true);
                
                $this->SetFillColor(224, 235, 255);
                $this->SetTextColor(0);
                $this->SetFont('', '', 8);
                
                $this->Ln();
                $fill = !$fill;
            }
            
            $this->Cell(array_sum($widths), 0, '', 'T');
        }
        
        function InfoBox($label, $value) {
            $this->SetFont('Arial', 'B', 9);
            $this->Cell(60, 6, $label, 1, 0, 'L', true);
            $this->SetFont('Arial', '', 9);
            $this->Cell(217, 6, $value, 1, 1, 'L');
        }
    }
    
    $pdf = new PDF();
    $pdf->AliasNbPages();
    $pdf->SetMargins(10, 10, 10);
    $pdf->SetAutoPageBreak(true, 20);
    $pdf->AddPage('L'); // Landscape
    
    // Report Information
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(240, 248, 255);
    $pdf->Cell(0, 6, 'REPORT DETAILS', 1, 1, 'L', true);
    
    $filterText = [];
    if ($status_filter !== 'all') $filterText[] = ucfirst($status_filter) . ' Students';
    if ($course_filter !== 'all') $filterText[] = 'Course: ' . $course_filter;
    if ($year_filter !== 'all') $filterText[] = 'Year: ' . $year_filter;
    
    $pdf->InfoBox('Report Date:', date('F d, Y g:i A'));
    $pdf->InfoBox('Total Students:', count($students));
    $pdf->InfoBox('Filters Applied:', empty($filterText) ? 'None (All Students)' : implode(', ', $filterText));
    $pdf->InfoBox('Sort Order:', str_replace('-', ' ', ucfirst($sort_by)));
    
    $pdf->Ln(5);
    
    // Statistics
    $totalStudents = count($students);
    $activeCount = count(array_filter($students, fn($s) => $s['status'] === 'Active'));
    $inactiveCount = count(array_filter($students, fn($s) => $s['status'] === 'Inactive'));
    $totalPresent = array_sum(array_column($students, 'present'));
    $totalLate = array_sum(array_column($students, 'late'));
    $totalAbsent = array_sum(array_column($students, 'absent'));
    
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(240, 248, 255);
    $pdf->Cell(0, 6, 'STATISTICS', 1, 1, 'L', true);
    
    $pdf->SetFont('Arial', 'B', 9);
    $pdf->SetFillColor(0, 102, 204);
    $pdf->SetTextColor(255);
    $pdf->Cell(46, 6, 'Active', 1, 0, 'C', true);
    $pdf->Cell(46, 6, 'Inactive', 1, 0, 'C', true);
    $pdf->Cell(46, 6, 'Total Present', 1, 0, 'C', true);
    $pdf->Cell(46, 6, 'Total Late', 1, 0, 'C', true);
    $pdf->Cell(46, 6, 'Total Absent', 1, 0, 'C', true);
    $pdf->Cell(47, 6, 'Avg Attendance', 1, 1, 'C', true);
    
    $avgAttendance = ($totalPresent + $totalLate + $totalAbsent) > 0 
        ? round((($totalPresent + $totalLate) / ($totalPresent + $totalLate + $totalAbsent)) * 100, 1) 
        : 0;
    
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetTextColor(0);
    $pdf->Cell(46, 7, $activeCount, 1, 0, 'C');
    $pdf->Cell(46, 7, $inactiveCount, 1, 0, 'C');
    $pdf->Cell(46, 7, $totalPresent, 1, 0, 'C');
    $pdf->Cell(46, 7, $totalLate, 1, 0, 'C');
    $pdf->Cell(46, 7, $totalAbsent, 1, 0, 'C');
    $pdf->Cell(47, 7, $avgAttendance . '%', 1, 1, 'C');
    
    $pdf->Ln(5);
    
    // Students Table
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(240, 248, 255);
    $pdf->Cell(0, 6, 'STUDENT LIST', 1, 1, 'L', true);
    
    $pdf->Ln(2);
    
    //para adjust sa table
    $header = array('ID', 'Name', 'Course', 'Set', 'Year', 'Present', 'Late', 'Absent', 'Rate', 'Status');
    $widths = array(30, 55, 35, 20, 18, 20, 20, 20, 20, 29);
    
    if (count($students) === 0) {
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(0, 10, 'No students found matching the filters', 0, 1, 'C');
    } else {
        $pdf->StudentTable($header, $students, $widths);
    }
    
    // Footer note
    $pdf->Ln(5);
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->MultiCell(0, 4, 'This is an official student attendance report generated on ' . date('F d, Y \a\t g:i A') . '. Students with more than 4 absences are automatically marked as Inactive. For inquiries, please contact the Student Community Center (SCC) Office.', 0, 'C');
    
    // Output - FORCE DOWNLOAD
    $filename = 'All_Students_Report_' . date('Y-m-d_His') . '.pdf';
    
    // Clear all output buffers
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    // Set headers to force download
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Transfer-Encoding: binary');
    header('Accept-Ranges: bytes');
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');
    header('Expires: 0');
    
    // Output PDF
    $pdf->Output('D', $filename);
    exit;
    
} catch (Exception $e) {
    // Clear buffers on error
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