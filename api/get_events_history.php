<?php
/**
 * Get Events History API
 * Location: C:\laragon\www\sccqr\api\get_events_history.php
 */

// Enable error reporting for debugging (REMOVE IN PRODUCTION)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 1 to see errors in browser
ini_set('log_errors', 1);
error_log("=== get_events_history.php called ===");

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Include connection file
$connectionPath = __DIR__ . '/../sql_php/connection.php';

if (!file_exists($connectionPath)) {
    error_log("Connection file not found at: " . $connectionPath);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Connection file not found',
        'debug' => [
            'expected_path' => $connectionPath,
            'current_dir' => __DIR__,
            'file_exists' => false
        ]
    ]);
    exit();
}

require_once $connectionPath;

try {
    // Verify connection exists
    if (!isset($conn)) {
        throw new Exception("Database connection object not created");
    }
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    error_log("Database connected successfully");
    
    // Test if events table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE 'events'");
    if (!$tableCheck || $tableCheck->num_rows === 0) {
        throw new Exception("Events table does not exist in database");
    }
    
    error_log("Events table exists");
    
    // Main query - Join with attendance_report table
    $query = "
        SELECT 
            e.event_id,
            e.event_name,
            e.event_date,
            e.event_type,
            COALESCE(e.description, '') as description,
            COALESCE(e.qr_code_data, '') as qr_code_data,
            e.created_at,
            COALESCE(e.status, 'Active') as status,
            COUNT(DISTINCT ar.student_id) as total_participants,
            SUM(CASE WHEN LOWER(ar.remarks) = 'present' THEN 1 ELSE 0 END) as present_count,
            SUM(CASE WHEN LOWER(ar.remarks) = 'late' THEN 1 ELSE 0 END) as late_count,
            SUM(CASE WHEN LOWER(ar.remarks) = 'absent' THEN 1 ELSE 0 END) as absent_count
        FROM events e
        LEFT JOIN attendance_report ar ON e.event_name = ar.event_name
        GROUP BY 
            e.event_id, 
            e.event_name, 
            e.event_date, 
            e.event_type, 
            e.description, 
            e.qr_code_data, 
            e.created_at, 
            e.status
        ORDER BY e.event_date DESC, e.created_at DESC
    ";
    
    error_log("Executing query");
    
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    error_log("Query successful, rows: " . $result->num_rows);
    
    $events = [];
    
    while ($row = $result->fetch_assoc()) {
        // Determine status based on event date if status is Active
        $eventDate = new DateTime($row['event_date']);
        $now = new DateTime();
        
        $status = $row['status'];
        if ($status === 'Active' && $eventDate < $now) {
            $status = 'Completed';
        }
        
        $events[] = [
            'event_id' => (int)$row['event_id'],
            'event_name' => $row['event_name'],
            'event_date' => $row['event_date'],
            'event_type' => $row['event_type'],
            'description' => $row['description'],
            'qr_code_data' => $row['qr_code_data'],
            'status' => $status,
            'created_at' => $row['created_at'],
            'total_participants' => (int)$row['total_participants'],
            'present_count' => (int)$row['present_count'],
            'late_count' => (int)$row['late_count'],
            'absent_count' => (int)$row['absent_count']
        ];
    }
    
    error_log("Processed " . count($events) . " events");
    
    // Return success response
    echo json_encode([
        'success' => true,
        'data' => $events,
        'count' => count($events),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
    
    $conn->close();
    
} catch (Exception $e) {
    error_log("ERROR in get_events_history.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => [],
        'debug' => [
            'file' => basename(__FILE__),
            'line' => $e->getLine(),
            'error' => $e->getMessage()
        ]
    ], JSON_PRETTY_PRINT);
    
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
}
?>