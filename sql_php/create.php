<?php
include "connection.php";
echo "POST data: ";
print_r($_POST);

if(isset($_POST['btn'])){
    $username = (int) $_POST['id'];
    $password = $_POST['psw'];
    $role = $_POST['role'];
    $position = isset($_POST['position']) ? $_POST['position'] : null;

    // Add validation
    if(empty($username) || empty($password) || empty($role)) {
        echo "Please fill in all fields!";
        exit;
    }

    // Validate position for instructor role
    if($role === 'instructor' && empty($position)) {
        echo "Please select a position for instructor!";
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
        // create account in users table
        $sql_create = "INSERT INTO users (`username`, `password`, `role`) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql_create);
        
        if(!$stmt) {
            echo "Prepare failed: " . $conn->error;
            exit;
        }
        
        $stmt->bind_param("iss", $username, $hash, $role);
        
        if($stmt->execute()) {
            $user_id = $conn->insert_id;
            
            // If role is instructor, insert into instructor table
            if($role === 'instructor') {
                $sql_instructor = "INSERT INTO instructor (`adviser_id`, `first_name`, `middle_initial`, `last_name`, `year_level_assigned`, `department`, `position`) 
                                   VALUES (?, '', '', '', '', '', ?)";
                $stmt_instructor = $conn->prepare($sql_instructor);
                
                if(!$stmt_instructor) {
                    echo "Prepare failed for instructor: " . $conn->error;
                    exit;
                }
                
                $stmt_instructor->bind_param("is", $user_id, $position);
                
                if($stmt_instructor->execute()) {
                    echo "Instructor account created successfully with position: " . $position;
                } else {
                    echo "Error creating instructor record: " . $stmt_instructor->error;
                }
                
                $stmt_instructor->close();
            } else {
                echo "Account created successfully!";
            }
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