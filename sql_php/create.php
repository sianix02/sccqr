<?php
include "connection.php";
echo "POST data: ";
print_r($_POST);

if(isset($_POST['btn'])){
    $username = (int) $_POST['id'];
    $password = $_POST['psw'];
    $role = $_POST['role'];

    // Add validation
    if(empty($username) || empty($password) || empty($role)) {
        echo "Please fill in all fields!";
        exit;
    }

    // hash password before storing
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // check if user exists
    $sql_check = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql_check);
    
    if(!$stmt) {
        echo "Prepare failed: " . $conn->error;
        exit;
    }
    
    $stmt->bind_param("i", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows === 0){
        // create account
        $sql_create = "INSERT INTO users (`username`, `password`, `role`) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql_create);
        
        if(!$stmt) {
            echo "Prepare failed: " . $conn->error;
            exit;
        }
        
        $stmt->bind_param("iss", $username, $hash, $role);
        
        if($stmt->execute()) {
            echo "Account created successfully!";
        } else {
            echo "Error creating account: " . $stmt->error;
        }
    } else {
        echo "User already exists!";
    }
    
    $stmt->close();
} else {
    echo "Form not submitted properly!";
}

header('location: ../pages/admin/a-home.php');
?>