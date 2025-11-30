<?php
// File: C:\laragon\www\sccqr\api\save_student.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../sql_php/connection.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }
    
    $studentId = $data['student_id'];
    $firstName = $data['first_name'];
    $middleInitial = isset($data['middle_initial']) ? $data['middle_initial'] : '';
    $lastName = $data['last_name'];
    $yearLevel = $data['year_level'];
    $sex = isset($data['sex']) ? $data['sex'] : 'Not Specified';
    $studentSet = isset($data['student_set']) ? $data['student_set'] : '';
    $course = isset($data['course']) ? $data['course'] : '';
    $isUpdate = isset($data['is_update']) ? $data['is_update'] : false;
    
    if ($isUpdate) {
        // Update existing student
        $sql = "UPDATE student 
                SET first_name = ?, 
                    middle_initial = ?,
                    last_name = ?, 
                    year_level = ?,
                    sex = ?,
                    student_set = ?,
                    course = ?
                WHERE student_id = ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssssssi', $firstName, $middleInitial, $lastName, $yearLevel, $sex, $studentSet, $course, $studentId);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Student updated successfully'
            ]);
        } else {
            throw new Exception('Failed to update student: ' . $stmt->error);
        }
    } else {
        // Check if student ID already exists
        $checkSql = "SELECT student_id FROM student WHERE student_id = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param('i', $studentId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            echo json_encode([
                'success' => false,
                'error' => 'Student ID already exists'
            ]);
            exit;
        }
        
        // Insert new student
        $sql = "INSERT INTO student 
                (student_id, first_name, middle_initial, last_name, year_level, sex, student_set, course) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('isssssss', $studentId, $firstName, $middleInitial, $lastName, $yearLevel, $sex, $studentSet, $course);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Student added successfully',
                'student_id' => $studentId
            ]);
        } else {
            throw new Exception('Failed to add student: ' . $stmt->error);
        }
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