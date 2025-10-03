<?php
include "sql_php/connection.php";
session_start();

if(isset($_POST['btn'])){

    $textid = $_POST['id'];
    $password = $_POST['password'];

    // Convert id to int
    $id = (int) $textid;

    // Get user from users table
    $sql = "SELECT * FROM `users` WHERE username=$id AND password='$password'";
    $login = $conn->query($sql);

    if($row = $login->fetch_assoc()){
        $user_id = $row['user_id'];
        $role = $row['role'];
        
        // Store user_id in session
        $_SESSION['session_id'] = $user_id;
        $_SESSION['role'] = $role;
        
        switch ($role){
            case 'admin':
                header("location: pages/admin/a-home.php");
                break;
                
            case 'student':
                // IMPORTANT: Get student_id from student table and store in session
                $student_sql = "SELECT student_id FROM `student` WHERE user_id = ?";
                $student_stmt = $conn->prepare($student_sql);
                $student_stmt->bind_param("i", $user_id);
                $student_stmt->execute();
                $student_result = $student_stmt->get_result();
                
                if($student_row = $student_result->fetch_assoc()){
                    $_SESSION['student_id'] = $student_row['student_id'];
                    $student_stmt->close();
                    header("location: pages/student/home.php");
                } else {
                    $notice = "Student record not found. Please contact administrator.";
                }
                break;

            case 'instructor':
                header("location: pages/instructor/home.php");
                break;
                
            default:
                $message = "error!";
            }

    } else {
        $notice = "Invalid ID or Password";
    }
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SCC-AMEXA</title>
    <link rel="stylesheet" href="css/index.css">
    <link rel="icon" type="image/png" href="images/logo.png">
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <div class="logo">
                <div class="logo-inner"><img src="images/logo.png" alt=""></div>
            </div>
            <h1>SCC-AMEXA</h1>
            <p>Sibonga Community College Automated Monitoring for Extracurricular Activities Attendance</p>
        </div>

        <form class="login-form" action="" method="POST">
            <div class="form-group">
                <label for="username">ID</label>
                <input type="text" id="username" name="id" required placeholder="Enter your client ID">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="Enter your password">
            </div>
            <button type="submit" class="login-button" name="btn">Login</button>
            <p id='notif'><?php if(isset($notice)) echo "$notice"?></p>
        </form>

        <div class="login-footer">
            Sibonga Community College@2008
        </div>
    </div>
</body>
</html>
