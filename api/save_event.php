<?php
// Prevent any output before headers
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "scc";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($input['event_name']) || !isset($input['event_date']) || !isset($input['event_type']) || !isset($input['event_description'])) {
        throw new Exception('Missing required fields');
    }
    
    $event_name = trim($input['event_name']);
    $event_date = trim($input['event_date']);
    $event_type = trim($input['event_type']);
    $event_description = trim($input['event_description']);
    $qr_code_data = isset($input['qr_code_data']) ? trim($input['qr_code_data']) : '';
    
    // Validate event name
    if (empty($event_name)) {
        throw new Exception('Event name cannot be empty');
    }
    
    // Validate event date
    if (empty($event_date)) {
        throw new Exception('Event date cannot be empty');
    }
    
    // Convert datetime-local format to MySQL datetime format
    $event_date = str_replace('T', ' ', $event_date) . ':00';
    
    // Insert event into database
    $stmt = $conn->prepare("INSERT INTO events (event_name, event_date, event_type, description, qr_code_data, created_at, status) VALUES (?, ?, ?, ?, ?, NOW(), 'Active')");
    
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    
    $stmt->bind_param("sssss", $event_name, $event_date, $event_type, $event_description, $qr_code_data);
    
    if ($stmt->execute()) {
        $event_id = $conn->insert_id;
        
        $response = [
            'success' => true,
            'message' => 'Event created successfully',
            'event_id' => $event_id,
            'event_name' => $event_name,
            'event_date' => $event_date,
            'event_type' => $event_type
        ];
        
        ob_end_clean();
        echo json_encode($response);
    } else {
        throw new Exception('Failed to insert event: ' . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>