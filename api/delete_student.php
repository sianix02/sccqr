<?php
// File: C:\laragon\www\sccqr\api\delete_student.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../sql_php/connection.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['student_id'])) {
        throw new Exception('Student ID is required');
    }
    
    $studentId = $data['student_id'];
    
    // First, delete all attendance records for this student
    $deleteAttendanceSql = "DELETE FROM attendance_report WHERE student_id = ?";
    $deleteAttendanceStmt = $conn->prepare($deleteAttendanceSql);
    $deleteAttendanceStmt->bind_param('i', $studentId);
    $deleteAttendanceStmt->execute();
    $deletedAttendanceRecords = $deleteAttendanceStmt->affected_rows;
    
    // Then delete the student
    $deleteStudentSql = "DELETE FROM student WHERE student_id = ?";
    $deleteStudentStmt = $conn->prepare($deleteStudentSql);
    $deleteStudentStmt->bind_param('i', $studentId);
    
    if ($deleteStudentStmt->execute()) {
        if ($deleteStudentStmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Student deleted successfully',
                'deleted_attendance_records' => $deletedAttendanceRecords
            ]);
        } else {
            throw new Exception('Student not found');
        }
    } else {
        throw new Exception('Failed to delete student: ' . $deleteStudentStmt->error);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>