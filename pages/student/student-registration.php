<?php
include "../../sql_php/connection.php";
session_start();

// Check if user_id is passed from login
if(!isset($_GET['user_id'])) {
    header("location: ../../index.php");
    exit();
}

$user_id = (int) $_GET['user_id'];

// Verify this user exists and is a student
$verify_sql = "SELECT username FROM users WHERE user_id = ? AND role = 'student'";
$verify_stmt = $conn->prepare($verify_sql);
$verify_stmt->bind_param("i", $user_id);
$verify_stmt->execute();
$verify_result = $verify_stmt->get_result();

if($verify_result->num_rows === 0) {
    header("location: ../../index.php");
    exit();
}

$user_data = $verify_result->fetch_assoc();
$username = $user_data['username']; // This will be the student_id

$success = false;
$error = "";

if(isset($_POST['register'])){
    // Use username as student_id (they must be the same)
    $student_id = $username;
    $first_name = mysqli_real_escape_string($conn, $_POST['first_name']);
    $middle_initial = mysqli_real_escape_string($conn, $_POST['middle_initial']);
    $last_name = mysqli_real_escape_string($conn, $_POST['last_name']);
    $year_level = mysqli_real_escape_string($conn, $_POST['year_level']);
    $sex = mysqli_real_escape_string($conn, $_POST['sex']);
    $student_set = mysqli_real_escape_string($conn, $_POST['student_set']);
    $course = mysqli_real_escape_string($conn, $_POST['course']);
    
    // Password change
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate password
    if($new_password !== $confirm_password) {
        $error = "Passwords do not match!";
    } elseif(strlen($new_password) < 8) {
        $error = "Password must be at least 8 characters long!";
    } else {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        
        // Secret questions
        $sq1 = mysqli_real_escape_string($conn, $_POST['secret_question_1']);
        $sq2 = mysqli_real_escape_string($conn, $_POST['secret_question_2']);
        $sq3 = mysqli_real_escape_string($conn, $_POST['secret_question_3']);
        $sq4 = mysqli_real_escape_string($conn, $_POST['secret_question_4']);
        $sq5 = mysqli_real_escape_string($conn, $_POST['secret_question_5']);
        
        $ans1 = password_hash($_POST['answer_1'], PASSWORD_DEFAULT);
        $ans2 = password_hash($_POST['answer_2'], PASSWORD_DEFAULT);
        $ans3 = password_hash($_POST['answer_3'], PASSWORD_DEFAULT);
        $ans4 = password_hash($_POST['answer_4'], PASSWORD_DEFAULT);
        $ans5 = password_hash($_POST['answer_5'], PASSWORD_DEFAULT);
        
        // Check if student_id already exists (shouldn't happen but safety check)
        $check_sql = "SELECT * FROM student WHERE student_id = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("s", $student_id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if($check_result->num_rows > 0) {
            $error = "Student record already exists!";
        } else {
            // Begin transaction
            $conn->begin_transaction();
            
            try {
                // Update password in users table
                $password_sql = "UPDATE users SET password = ? WHERE user_id = ?";
                $password_stmt = $conn->prepare($password_sql);
                $password_stmt->bind_param("si", $hashed_password, $user_id);
                $password_stmt->execute();
                
                // Insert into student table
                $student_sql = "INSERT INTO student (user_id, student_id, first_name, middle_initial, last_name, year_level, sex, student_set, course) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $student_stmt = $conn->prepare($student_sql);
                $student_stmt->bind_param("issssssss", $user_id, $student_id, $first_name, $middle_initial, $last_name, $year_level, $sex, $student_set, $course);
                $student_stmt->execute();
                
                // Insert into secret_question table
                $secret_sql = "INSERT INTO secret_question (user_id, secret_question_1, secret_question_2, secret_question_3, secret_question_4, secret_question_5, 
                              answer_1, answer_2, answer_3, answer_4, answer_5) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $secret_stmt = $conn->prepare($secret_sql);
                $secret_stmt->bind_param("issssssssss", $user_id, $sq1, $sq2, $sq3, $sq4, $sq5, $ans1, $ans2, $ans3, $ans4, $ans5);
                $secret_stmt->execute();
                
                // Commit transaction
                $conn->commit();
                
                // Set session variables
                $_SESSION['student_id'] = $student_id;
                $_SESSION['session_id'] = $user_id;
                $_SESSION['role'] = 'student';
                
                $success = true;
                
            } catch (Exception $e) {
                // Rollback on error
                $conn->rollback();
                $error = "Registration failed. Please try again.";
            }
        }
    }
}

$verify_stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Registration - SCC-AMEXA</title>
    <link rel="stylesheet" href="../../css/registration.css">
    <link rel="icon" type="image/png" href="../../images/logo.png">
</head>
<body>
    <div class="registration-container">
        <div class="registration-header">
            <div class="logo">
                <div class="logo-inner">
                    <img src="../../images/logo.png" alt="SCC Logo">
                </div>
            </div>
            <h1>Student Registration</h1>
            <p>Complete your profile to access SCC-AMEXA</p>
        </div>

        <div class="registration-body">
            <?php if($error): ?>
                <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="POST" action="" id="registrationForm">
                <!-- Personal Information Section -->
                <div class="form-section">
                    <div class="section-title">
                        <div class="section-icon">👤</div>
                        Personal Information
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="student_id">Student ID</label>
                            <input type="text" id="student_id" name="student_id" value="<?php echo htmlspecialchars($username); ?>" readonly style="background-color: #e9ecef; cursor: not-allowed;">
                            <small style="color: #6c757d; font-size: 12px; margin-top: 5px; display: block;">Your Student ID is automatically set from your Client ID</small>
                        </div>
                        <div class="form-group">
                            <label for="sex">Sex <span class="required">*</span></label>
                            <select id="sex" name="sex" required>
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="first_name">First Name <span class="required">*</span></label>
                            <input type="text" id="first_name" name="first_name" required>
                        </div>
                        <div class="form-group">
                            <label for="middle_initial">Middle Initial</label>
                            <input type="text" id="middle_initial" name="middle_initial" maxlength="5" placeholder="e.g., A." style="text-transform: uppercase;">
                        </div>
                        <div class="form-group">
                            <label for="last_name">Last Name <span class="required">*</span></label>
                            <input type="text" id="last_name" name="last_name" required>
                        </div>
                    </div>
                </div>

                <!-- Change Password Section -->
                <div class="form-section">
                    <div class="section-title">
                        <div class="section-icon">🔑</div>
                        Change Password (Required)
                    </div>
                    <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">For security purposes, you must change your password before proceeding.</p>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="new_password">New Password <span class="required">*</span></label>
                            <input type="password" id="new_password" name="new_password" required minlength="8" placeholder="Minimum 8 characters">
                            <small style="color: #6c757d; font-size: 12px; margin-top: 5px; display: block;">Must be at least 8 characters</small>
                        </div>
                        <div class="form-group">
                            <label for="confirm_password">Confirm Password <span class="required">*</span></label>
                            <input type="password" id="confirm_password" name="confirm_password" required minlength="8" placeholder="Re-enter password">
                        </div>
                    </div>
                    <div class="form-group full-width" style="margin-top: 10px;">
                        <label style="display: flex; align-items: center; font-size: 14px; cursor: pointer;">
                            <input type="checkbox" id="show_password" style="width: auto; margin-right: 8px;">
                            Show Password
                        </label>
                    </div>
                </div>

                <!-- Academic Information Section -->
                <div class="form-section">
                    <div class="section-title">
                        <div class="section-icon">🎓</div>
                        Academic Information
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="year_level">Year Level <span class="required">*</span></label>
                            <select id="year_level" name="year_level" required>
                                <option value="">Select Year Level</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="student_set">Student Set <span class="required">*</span></label>
                            <select id="student_set" name="student_set" required>
                                <option value="">Select Set</option>
                                <option value="Set A">Set A</option>
                                <option value="Set B">Set B</option>
                                <option value="Set C">Set C</option>
                                <option value="Set D">Set D</option>
                                <option value="Set E">Set E</option>
                            </select>
                        </div>
                        <div class="form-group full-width">
                            <label for="course">Course <span class="required">*</span></label>
                            <select id="course" name="course" required>
                                <option value="">Select Course</option>
                                <option value="BS Elementary Education">BS Elementary Education</option>
                                <option value="BS Secondary Education">BS Secondary Education</option>
                                <option value="BS Information Technology">BS Information Technology</option>
                                <option value="BS Bussiness Administration">BS Bussiness Administration</option>
                                <option value="BS Criminology">BS Criminology</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Security Questions Section -->
                <div class="form-section">
                    <div class="section-title">
                        <div class="section-icon">🔒</div>
                        Security Questions (For Password Recovery)
                    </div>

                    <div class="secret-question-group">
                        <label>Question 1 <span class="required">*</span></label>
                        <select name="secret_question_1" required>
                            <option value="">Select a question</option>
                            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                            <option value="What city were you born in?">What city were you born in?</option>
                            <option value="What is your favorite color?">What is your favorite color?</option>
                        </select>
                        <input type="text" name="answer_1" placeholder="Your answer" required>
                    </div>

                    <div class="secret-question-group">
                        <label>Question 2 <span class="required">*</span></label>
                        <select name="secret_question_2" required>
                            <option value="">Select a question</option>
                            <option value="What is the name of your favorite teacher?">What is the name of your favorite teacher?</option>
                            <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                            <option value="What is your favorite food?">What is your favorite food?</option>
                            <option value="What is your dream job?">What is your dream job?</option>
                        </select>
                        <input type="text" name="answer_2" placeholder="Your answer" required>
                    </div>

                    <div class="secret-question-group">
                        <label>Question 3 <span class="required">*</span></label>
                        <select name="secret_question_3" required>
                            <option value="">Select a question</option>
                            <option value="What is your father's middle name?">What is your father's middle name?</option>
                            <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                            <option value="What is your favorite movie?">What is your favorite movie?</option>
                            <option value="What is your favorite book?">What is your favorite book?</option>
                        </select>
                        <input type="text" name="answer_3" placeholder="Your answer" required>
                    </div>

                    <div class="secret-question-group">
                        <label>Question 4 <span class="required">*</span></label>
                        <select name="secret_question_4" required>
                            <option value="">Select a question</option>
                            <option value="What is your favorite sport?">What is your favorite sport?</option>
                            <option value="What is your favorite subject?">What is your favorite subject?</option>
                            <option value="What was your first job?">What was your first job?</option>
                            <option value="What is your hobby?">What is your hobby?</option>
                        </select>
                        <input type="text" name="answer_4" placeholder="Your answer" required>
                    </div>

                    <div class="secret-question-group">
                        <label>Question 5 <span class="required">*</span></label>
                        <select name="secret_question_5" required>
                            <option value="">Select a question</option>
                            <option value="What is your favorite band or artist?">What is your favorite band or artist?</option>
                            <option value="What is your best friend's name?">What is your best friend's name?</option>
                            <option value="What is your dream destination?">What is your dream destination?</option>
                            <option value="What is your favorite season?">What is your favorite season?</option>
                        </select>
                        <input type="text" name="answer_5" placeholder="Your answer" required>
                    </div>
                </div>

                <div class="btn-container">
                    <button type="button" class="btn btn-secondary" onclick="window.location.href='../../index.php'">Cancel</button>
                    <button type="submit" class="btn btn-primary" name="register">Complete Registration</button>
                </div>
            </form>
        </div>
    </div>

    <?php if($success): ?>
    <div class="success-modal">
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h2>Registration Successful!</h2>
            <p>Your profile has been created successfully. Redirecting to student dashboard...</p>
            <button class="btn btn-primary" onclick="window.location.href='home.php'">Continue to Dashboard</button>
        </div>
    </div>
    <script>
        setTimeout(function() {
            window.location.href = 'home.php';
        }, 3000);
    </script>
    <?php endif; ?>

    <script>
        // Show/Hide Password Toggle
        document.getElementById('show_password').addEventListener('change', function() {
            const newPassword = document.getElementById('new_password');
            const confirmPassword = document.getElementById('confirm_password');
            const type = this.checked ? 'text' : 'password';
            newPassword.type = type;
            confirmPassword.type = type;
        });

        // Password Match Validation
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            const newPassword = document.getElementById('new_password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            if(newPassword !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match!');
                return false;
            }
            
            if(newPassword.length < 8) {
                e.preventDefault();
                alert('Password must be at least 8 characters long!');
                return false;
            }
        });

        // Real-time password match indicator
        document.getElementById('confirm_password').addEventListener('input', function() {
            const newPassword = document.getElementById('new_password').value;
            const confirmPassword = this.value;
            
            if(confirmPassword.length > 0) {
                if(newPassword === confirmPassword) {
                    this.style.borderColor = '#28a745';
                } else {
                    this.style.borderColor = '#dc3545';
                }
            } else {
                this.style.borderColor = '#e9ecef';
            }
        });
    </script>
</body>
</html>