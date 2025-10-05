<?php
/**
 * ONE-TIME UTILITY SCRIPT
 * Run this ONCE to hash all existing plain text passwords
 * After running successfully, DELETE this file for security
 */

include "sql_php/connection.php";

// Security: Only allow this script to run locally
if ($_SERVER['REMOTE_ADDR'] !== '127.0.0.1' && $_SERVER['REMOTE_ADDR'] !== '::1') {
    die("This script can only be run locally");
}

echo "<h2>Password Hashing Utility</h2>";
echo "<p>This will hash all plain text passwords in the users table.</p>";

// Add confirmation to prevent accidental runs
if (!isset($_GET['confirm']) || $_GET['confirm'] !== 'yes') {
    echo "<p><strong>WARNING:</strong> This will modify your database!</p>";
    echo "<p><a href='?confirm=yes'>Click here to confirm and proceed</a></p>";
    exit();
}

echo "<hr>";

// Get all users
$sql = "SELECT user_id, username, password FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $updated = 0;
    $skipped = 0;
    
    echo "<h3>Processing Users:</h3>";
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>User ID</th><th>Username</th><th>Status</th></tr>";
    
    while ($row = $result->fetch_assoc()) {
        $user_id = $row['user_id'];
        $username = $row['username'];
        $current_password = $row['password'];
        
        // Check if password is already hashed (bcrypt hashes start with $2y$)
        if (strpos($current_password, '$2y$') === 0) {
            echo "<tr><td>$user_id</td><td>$username</td><td style='color: orange;'>Already hashed - Skipped</td></tr>";
            $skipped++;
            continue;
        }
        
        // Hash the plain text password
        $hashed_password = password_hash($current_password, PASSWORD_DEFAULT);
        
        // Update the database
        $update_sql = "UPDATE users SET password = ? WHERE user_id = ?";
        $stmt = $conn->prepare($update_sql);
        $stmt->bind_param("si", $hashed_password, $user_id);
        
        if ($stmt->execute()) {
            echo "<tr><td>$user_id</td><td>$username</td><td style='color: green;'>Successfully hashed</td></tr>";
            $updated++;
        } else {
            echo "<tr><td>$user_id</td><td>$username</td><td style='color: red;'>Error: " . $stmt->error . "</td></tr>";
        }
        
        $stmt->close();
    }
    
    echo "</table>";
    echo "<hr>";
    echo "<h3>Summary:</h3>";
    echo "<p><strong>Updated:</strong> $updated users</p>";
    echo "<p><strong>Skipped:</strong> $skipped users (already hashed)</p>";
    echo "<p style='color: green;'><strong>IMPORTANT: Now DELETE this file (hash_existing_passwords.php) for security!</strong></p>";
    
} else {
    echo "<p>No users found in database.</p>";
}

$conn->close();
?>