<?php
include "sql_php/connection.php";
session_start();

include_once __DIR__ . '/api/auto_mark_absent.php';

if(isset($_POST['btn'])){

    $textid = $_POST['id'];
    $password = $_POST['password'];

    // Convert id to int
    $id = (int) $textid;

    // Use prepared statement to prevent SQL injection
    $sql = "SELECT * FROM `users` WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if($row = $result->fetch_assoc()){
        // Verify hashed password
        if(password_verify($password, $row['password'])){
            $user_id = $row['user_id'];
            $role = $row['role'];
            
            // Store user_id in session
            $_SESSION['session_id'] = $user_id;
            $_SESSION['role'] = $role;
            
            switch ($role){
                case 'admin':
                    header("location: pages/admin/a-home.php");
                    exit();
                    break;
                    
                case 'student':
                    // Get student_id from student table and store in session
                    $student_sql = "SELECT student_id FROM `student` WHERE user_id = ?";
                    $student_stmt = $conn->prepare($student_sql);
                    $student_stmt->bind_param("i", $user_id);
                    $student_stmt->execute();
                    $student_result = $student_stmt->get_result();
                    
                    if($student_row = $student_result->fetch_assoc()){
                        $_SESSION['student_id'] = $student_row['student_id'];
                        $student_stmt->close();
                        header("location: pages/student/home.php");
                        exit();
                    } else {
                        // Redirect to registration page with user_id
                        $student_stmt->close();
                        header("location: pages/student/student-registration.php?user_id=" . $user_id);
                        exit();
                    }
                    break;

                case 'instructor':
                    header("location: pages/instructor/home.php");
                    exit();
                    break;
                    
                default:
                    $notice = "Invalid role assigned";
            }
        } else {
            $notice = "Invalid ID or Password";
        }
    } else {
        $notice = "Invalid ID or Password";
    }
    
    $stmt->close();
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
                <div class="password-wrapper">
                    <input type="password" id="password" name="password" required placeholder="Enter your password">
                    <button type="button" class="toggle-password" id="togglePassword">
                        <span class="eye-icon">⦸</span>
                    </button>
                </div>
            </div>
            <button type="submit" class="login-button" name="btn">Login</button>
            <?php if(isset($notice)): ?>
                <p id='notif' style="color: #dc3545; margin-top: 10px; text-align: center;"><?php echo htmlspecialchars($notice); ?></p>
            <?php endif; ?>
            
            <div class="forgot-password-link">
                <a href="forgot-password.php">Forgot Password?</a>
            </div>
        </form>

        <div class="login-footer">
            Sibonga Community College@2008
        </div>
    </div>

    <script>
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        togglePassword.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle the icon
            this.querySelector('.eye-icon').textContent = type === 'password' ? '⦸' : '👁';
        });
    </script>
</body>
</html>