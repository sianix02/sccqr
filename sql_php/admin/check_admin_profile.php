<?php
session_start();
require_once '../connection.php';

// Check if user is logged in
if (!isset($_SESSION['session_id'])) {
    if (isset($_GET['ajax'])) {
        echo json_encode(['has_profile' => false, 'error' => 'Not logged in']);
    } else {
        header("Location: ../../index.php");
    }
    exit();
}

$user_id = $_SESSION['session_id'];

// Get admin profile from users table and admin table if exists
$query = "SELECT u.user_id, u.username, a.first_name, a.middle_initial, 
          a.last_name, a.email
          FROM users u
          LEFT JOIN admin a ON u.user_id = a.user_id
          WHERE u.user_id = ? AND u.role = 'admin'";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Check if profile is complete
    $is_complete = !empty($row['first_name']) && 
                   !empty($row['last_name']) && 
                   !empty($row['email']);
    
    $profile_data = array(
        'user_id' => $row['user_id'],
        'username' => $row['username'],
        'first_name' => $row['first_name'],
        'middle_initial' => $row['middle_initial'],
        'last_name' => $row['last_name'],
        'email' => $row['email']
    );
    
    if (isset($_GET['ajax'])) {
        echo json_encode([
            'has_profile' => $is_complete,
            'profile_data' => $profile_data
        ]);
    }
} else {
    if (isset($_GET['ajax'])) {
        echo json_encode([
            'has_profile' => false,
            'profile_data' => null
        ]);
    }
}

$stmt->close();
$conn->close();
?>