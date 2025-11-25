<?php
// File: C:\laragon\www\sccqr\includes\PDF_Generator.php
// Centralized PDF generation class for consistent formatting across instructor exports

require_once(dirname(__DIR__) . '/vendor/fpdf/fpdf.php');

class PDF_Generator extends FPDF {
    private $schoolName = 'Sibonga Community College';
    private $subtitle = 'Poblacion, Sibonga, Cebu 6020';
    private $reportTitle = '';
    
    // Define logo paths as class properties
    private $logo1Path;
    private $logo2Path;
    
    public function __construct($orientation = 'P', $unit = 'mm', $size = 'A4') {
        parent::__construct($orientation, $unit, $size);
        
        // Set logo paths
        $this->logo1Path = dirname(__DIR__) . '/images/Sibonga.jpg';
        $this->logo2Path = dirname(__DIR__) . '/images/logo.jpg';
    }
    
    /**
     * Set the report title dynamically
     */
    public function setReportTitle($title) {
        $this->reportTitle = $title;
    }
    
    /**
     * Convert interlaced PNG to standard PNG for FPDF compatibility
     */
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
    
    /**
     * Standard header with logos and school info
     */
    function Header() {
        // Calculate center position based on page width
        $pageWidth = $this->GetPageWidth();
        $centerX = $pageWidth / 2;
        
        // Logo 1 (left)
        if (file_exists($this->logo1Path)) {
            try {
                $this->Image($this->logo1Path, 10, 10, 25);
            } catch (Exception $e) {
                error_log('Logo 1 error: ' . $e->getMessage());
            }
        }
        
        // Logo 2 (right)
        if (file_exists($this->logo2Path)) {
            try {
                $converted_logo = $this->convertInterlacedPNG($this->logo2Path);
                $rightLogoX = $pageWidth - 35; // 35 = 10 (margin) + 25 (logo width)
                $this->Image($converted_logo, $rightLogoX, 10, 25);
                
                // Clean up temp file
                if ($converted_logo !== $this->logo2Path && file_exists($converted_logo)) {
                    @unlink($converted_logo);
                }
            } catch (Exception $e) {
                error_log('Logo 2 error: ' . $e->getMessage());
            }
        }
        
        // School name
        $this->SetFont('Arial', 'B', 14);
        $this->SetY(18);
        $this->Cell(0, 6, $this->schoolName, 0, 1, 'C');
        
        // Report title
        $this->SetFont('Arial', 'B', 12);
        $this->Cell(0, 6, $this->reportTitle, 0, 1, 'C');
        
        // Subtitle
        $this->SetFont('Arial', '', 9);
        $this->Cell(0, 5, $this->subtitle, 0, 1, 'C');
        
        // Separator line
        $this->SetDrawColor(0, 102, 204);
        $this->SetLineWidth(0.5);
        $lineY = $this->GetY() + 5;
        $this->Line(10, $lineY, $pageWidth - 10, $lineY);
        $this->Ln(8);
    }
    
    /**
     * Standard footer with page numbers
     */
    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 10, 'Page ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
    }
    
    /**
     * Create an info box (label + value)
     */
    public function InfoBox($label, $value, $labelWidth = 50, $valueWidth = 140) {
        $this->SetFont('Arial', 'B', 9);
        $this->Cell($labelWidth, 6, $label, 1, 0, 'L', true);
        $this->SetFont('Arial', '', 9);
        $this->Cell($valueWidth, 6, $value, 1, 1, 'L');
    }
    
    /**
     * Create a statistics row (for attendance stats)
     */
    public function StatsRow($headers, $values, $widths) {
        // Headers
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(0, 102, 204);
        $this->SetTextColor(255);
        
        foreach ($headers as $index => $header) {
            $this->Cell($widths[$index], 6, $header, 1, 0, 'C', true);
        }
        $this->Ln();
        
        // Values
        $this->SetFont('Arial', 'B', 10);
        $this->SetTextColor(0);
        
        foreach ($values as $index => $value) {
            $this->Cell($widths[$index], 7, $value, 1, 0, 'C');
        }
        $this->Ln();
    }
    
    /**
     * Get status color based on status text
     * Returns [R, G, B, TextColor]
     */
    public function getStatusColor($status) {
        $status = strtoupper($status);
        
        switch ($status) {
            case 'PRESENT':
            case 'ACTIVE':
                return [40, 167, 69, 255]; // Green [R, G, B, TextColor]
            case 'LATE':
                return [255, 193, 7, 0]; // Yellow
            case 'ABSENT':
            case 'INACTIVE':
                return [220, 53, 69, 255]; // Red
            case 'PENDING':
                return [108, 117, 125, 255]; // Gray
            default:
                return [200, 200, 200, 0]; // Light gray
        }
    }
    
    /**
     * Render a standard table with alternating row colors
     */
    public function StandardTable($headers, $data, $widths, $statusColumn = -1) {
        // Header
        $this->SetFillColor(0, 102, 204);
        $this->SetTextColor(255);
        $this->SetDrawColor(0, 102, 204);
        $this->SetLineWidth(.3);
        $this->SetFont('', 'B', 9);
        
        foreach ($headers as $index => $header) {
            $this->Cell($widths[$index], 7, $header, 1, 0, 'C', true);
        }
        $this->Ln();
        
        // Data rows
        $this->SetFillColor(224, 235, 255);
        $this->SetTextColor(0);
        $this->SetFont('', '', 8);
        
        $fill = false;
        foreach ($data as $row) {
            $colIndex = 0;
            foreach ($row as $cellValue) {
                // Check if this is a status column
                if ($colIndex === $statusColumn) {
                    $colors = $this->getStatusColor($cellValue);
                    $this->SetFillColor($colors[0], $colors[1], $colors[2]);
                    $this->SetTextColor($colors[3]);
                    $this->SetFont('', 'B', 8);
                    $this->Cell($widths[$colIndex], 7, $cellValue, 'LRB', 0, 'C', true);
                    
                    // Reset colors
                    $this->SetFillColor(224, 235, 255);
                    $this->SetTextColor(0);
                    $this->SetFont('', '', 8);
                } else {
                    $this->Cell($widths[$colIndex], 7, $cellValue, 'LRB', 0, 'L', $fill);
                }
                $colIndex++;
            }
            $this->Ln();
            $fill = !$fill;
        }
        
        // Bottom border
        $this->Cell(array_sum($widths), 0, '', 'T');
    }
    
    /**
     * Add a section header
     */
    public function SectionHeader($text) {
        $this->SetFont('Arial', 'B', 10);
        $this->SetFillColor(240, 248, 255);
        $this->Cell(0, 6, $text, 1, 1, 'L', true);
    }
    
    /**
     * Add footer note about inactive status
     */
    public function InactiveStatusNote() {
        $this->Ln(5);
        $this->SetFont('Arial', 'I', 8);
        $noteText = 'IMPORTANT: Students with 4 or more absences are automatically marked as Inactive. ' .
                   'This is an official report generated on ' . date('F d, Y \a\t g:i A') . '. ' .
                   'For inquiries, please contact the Student Community Center (SCC) Office.';
        $this->MultiCell(0, 4, $noteText, 0, 'C');
    }
}
?>