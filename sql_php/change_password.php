<?php
session_start();
header('Content-Type: application/json');
require_once 'connection.php';

if (!isset($_SESSION['session_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

$user_id = $_SESSION['session_id'];

// Validate input
if (empty($_POST['current_password']) || empty($_POST['new_password']) || 
    empty($_POST['confirm_new_password'])) {
    echo json_encode(['success' => false, 'message' => 'All password fields are required']);
    exit();
}

// Validate security questions
for ($i = 1; $i <= 5; $i++) {
    if (empty($_POST["secret_question_$i"]) || empty($_POST["answer_$i"])) {
        echo json_encode(['success' => false, 'message' => 'All security questions must be answered']);
        exit();
    }
}

$current_password = $_POST['current_password'];
$new_password = $_POST['new_password'];
$confirm_password = $_POST['confirm_new_password'];

// Validate new password
if ($new_password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'New passwords do not match']);
    exit();
}

if (strlen($new_password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long']);
    exit();
}

// Verify current password
$verify_query = "SELECT password FROM users WHERE user_id = ?";
$verify_stmt = $conn->prepare($verify_query);
$verify_stmt->bind_param("i", $user_id);
$verify_stmt->execute();
$verify_result = $verify_stmt->get_result();

if ($verify_result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit();
}

$user = $verify_result->fetch_assoc();

if (!password_verify($current_password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
    exit();
}

// Hash new password and answers
$hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
$hashed_answers = [];
for ($i = 1; $i <= 5; $i++) {
    $hashed_answers[$i] = password_hash($_POST["answer_$i"], PASSWORD_DEFAULT);
}

// Begin transaction
$conn->begin_transaction();

try {
    // Update password
    $password_query = "UPDATE users SET password = ? WHERE user_id = ?";
    $password_stmt = $conn->prepare($password_query);
    $password_stmt->bind_param("si", $hashed_password, $user_id);
    $password_stmt->execute();
    
    // Check if security questions exist
    $check_query = "SELECT user_id FROM secret_question WHERE user_id = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("i", $user_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        // Update existing security questions
        $update_query = "UPDATE secret_question SET 
                        secret_question_1 = ?, secret_question_2 = ?, secret_question_3 = ?, 
                        secret_question_4 = ?, secret_question_5 = ?,
                        answer_1 = ?, answer_2 = ?, answer_3 = ?, answer_4 = ?, answer_5 = ?
                        WHERE user_id = ?";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bind_param("ssssssssssi",
            $_POST['secret_question_1'], $_POST['secret_question_2'], $_POST['secret_question_3'],
            $_POST['secret_question_4'], $_POST['secret_question_5'],
            $hashed_answers[1], $hashed_answers[2], $hashed_answers[3],
            $hashed_answers[4], $hashed_answers[5],
            $user_id
        );
        $update_stmt->execute();
    } else {
        // Insert new security questions
        $insert_query = "INSERT INTO secret_question 
                        (user_id, secret_question_1, secret_question_2, secret_question_3, 
                        secret_question_4, secret_question_5, answer_1, answer_2, answer_3, 
                        answer_4, answer_5) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $insert_stmt = $conn->prepare($insert_query);
        $insert_stmt->bind_param("issssssssss", $user_id,
            $_POST['secret_question_1'], $_POST['secret_question_2'], $_POST['secret_question_3'],
            $_POST['secret_question_4'], $_POST['secret_question_5'],
            $hashed_answers[1], $hashed_answers[2], $hashed_answers[3],
            $hashed_answers[4], $hashed_answers[5]
        );
        $insert_stmt->execute();
    }
    
    $conn->commit();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Password and security questions updated successfully!'
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to update: ' . $e->getMessage()
    ]);
}

$conn->close();
?>