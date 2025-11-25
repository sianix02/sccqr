<?php
// File: C:\laragon\www\sccqr\api\get_archived_students.php
// Description: Fetch all archived students with their archive information

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    require_once '../sql_php/connection.php';
    
    if (!$conn) {
        throw new Exception('Database connection failed');
    }
    
    // Check if student_archive table exists
    $checkTable = "SHOW TABLES LIKE 'student_archive'";
    $tableResult = $conn->query($checkTable);
    
    if (!$tableResult || $tableResult->num_rows == 0) {
        // Table doesn't exist - return empty array
        echo json_encode([
            'success' => true,
            'data' => [],
            'count' => 0,
            'message' => 'Archive table not found. No archived students.'
        ]);
        $conn->close();
        exit;
    }
    
    // Get all archived students with their info
    $sql = "SELECT 
                s.student_id,
                s.first_name,
                s.last_name,
                s.course,
                s.year_level,
                s.student_set,
                sa.archived_date,
                sa.archive_reason,
                sa.archived_by,
                sa.notes,
                COUNT(ah.history_id) as action_count
            FROM student s
            INNER JOIN student_archive sa ON s.student_id = sa.student_id
            LEFT JOIN archive_history ah ON s.student_id = ah.student_id
            WHERE sa.is_archived = 1
            GROUP BY s.student_id
            ORDER BY sa.archived_date DESC";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception('Query failed: ' . $conn->error);
    }
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'student_id' => $row['student_id'],
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'course' => $row['course'],
            'year_level' => $row['year_level'],
            'student_set' => $row['student_set'],
            'archived_date' => $row['archived_date'],
            'archive_reason' => $row['archive_reason'],
            'archived_by' => $row['archived_by'],
            'notes' => $row['notes'],
            'action_count' => (int)$row['action_count']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $data,
        'count' => count($data),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
    
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'data' => [],
        'count' => 0
    ], JSON_PRETTY_PRINT);
}
?>