<?php
include "sql_php/connection.php";
session_start();

$step = isset($_GET['step']) ? $_GET['step'] : 1;
$notice = "";
$success = "";

// Step 1: Verify Username
if(isset($_POST['verify_username'])){
    $username = $_POST['username'];
    
    $sql = "SELECT user_id FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if($row = $result->fetch_assoc()){
        $_SESSION['reset_user_id'] = $row['user_id'];
        $_SESSION['reset_username'] = $username;
        
        // Check if user has secret questions
        $check_sql = "SELECT * FROM secret_question WHERE user_id = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("i", $row['user_id']);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if($check_result->num_rows > 0){
            header("location: forgot-password.php?step=2");
            exit();
        } else {
            $notice = "No security questions found. Please contact administrator.";
        }
        $check_stmt->close();
    } else {
        $notice = "Username not found";
    }
    $stmt->close();
}

// Step 2: Answer Security Questions (UPDATED to use password_verify)
if(isset($_POST['verify_answers'])){
    $user_id = $_SESSION['reset_user_id'];
    
    $answer1 = trim($_POST['answer_1']);
    $answer2 = trim($_POST['answer_2']);
    $answer3 = trim($_POST['answer_3']);
    
    $sql = "SELECT answer_1, answer_2, answer_3 FROM secret_question WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if($row = $result->fetch_assoc()){
        // Verify hashed answers using password_verify
        $answer1_valid = password_verify($answer1, $row['answer_1']);
        $answer2_valid = password_verify($answer2, $row['answer_2']);
        $answer3_valid = password_verify($answer3, $row['answer_3']);
        
        if($answer1_valid && $answer2_valid && $answer3_valid){
            header("location: forgot-password.php?step=3");
            exit();
        } else {
            $notice = "Incorrect answers. Please try again.";
        }
    }
    $stmt->close();
}

// Step 3: Reset Password
if(isset($_POST['reset_password'])){
    $user_id = $_SESSION['reset_user_id'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];
    
    if($new_password === $confirm_password){
        if(strlen($new_password) >= 6){
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            
            $sql = "UPDATE users SET password = ? WHERE user_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("si", $hashed_password, $user_id);
            
            if($stmt->execute()){
                $success = "Password reset successful! Redirecting to login...";
                unset($_SESSION['reset_user_id']);
                unset($_SESSION['reset_username']);
                header("refresh:2;url=index.php");
            } else {
                $notice = "Failed to reset password. Please try again.";
            }
            $stmt->close();
        } else {
            $notice = "Password must be at least 6 characters long";
        }
    } else {
        $notice = "Passwords do not match";
    }
}

// Get security questions for step 2
$questions = [];
if($step == 2 && isset($_SESSION['reset_user_id'])){
    $sql = "SELECT secret_question_1, secret_question_2, secret_question_3 FROM secret_question WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_SESSION['reset_user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    if($row = $result->fetch_assoc()){
        $questions = $row;
    }
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - SCC-AMEXA</title>
    <link rel="stylesheet" href="css/forgot-password.css">
    <link rel="icon" type="image/png" href="images/logo.png">
</head>
<body>
    <div class="forgot-container">
        <div class="forgot-header">
            <div class="logo">
                <div class="logo-inner"><img src="images/logo.png" alt=""></div>
            </div>
            <h1>Reset Password</h1>
            <p>SCC-AMEXA Password Recovery</p>
        </div>

        <!-- Step Indicator -->
        <div class="step-indicator">
            <div class="step <?php echo $step >= 1 ? 'active' : ''; ?>">
                <div class="step-number">1</div>
                <div class="step-label">Verify ID</div>
            </div>
            <div class="step-line <?php echo $step >= 2 ? 'active' : ''; ?>"></div>
            <div class="step <?php echo $step >= 2 ? 'active' : ''; ?>">
                <div class="step-number">2</div>
                <div class="step-label">Security Questions</div>
            </div>
            <div class="step-line <?php echo $step >= 3 ? 'active' : ''; ?>"></div>
            <div class="step <?php echo $step >= 3 ? 'active' : ''; ?>">
                <div class="step-number">3</div>
                <div class="step-label">New Password</div>
            </div>
        </div>

        <?php if($step == 1): ?>
        <!-- Step 1: Enter Username -->
        <form class="forgot-form" action="" method="POST">
            <div class="form-group">
                <label for="username">Enter Your ID</label>
                <input type="text" id="username" name="username" required placeholder="Enter your client ID">
            </div>
            <button type="submit" class="submit-button" name="verify_username">Continue</button>
            <?php if($notice): ?>
                <p class="notice error"><?php echo htmlspecialchars($notice); ?></p>
            <?php endif; ?>
        </form>
        <?php endif; ?>

        <?php if($step == 2): ?>
        <!-- Step 2: Answer Security Questions -->
        <form class="forgot-form" action="" method="POST">
            <p class="info-text">Please answer your security questions</p>
            
            <div class="form-group">
                <label><?php echo htmlspecialchars($questions['secret_question_1']); ?></label>
                <input type="text" name="answer_1" required placeholder="Your answer">
            </div>
            
            <div class="form-group">
                <label><?php echo htmlspecialchars($questions['secret_question_2']); ?></label>
                <input type="text" name="answer_2" required placeholder="Your answer">
            </div>
            
            <div class="form-group">
                <label><?php echo htmlspecialchars($questions['secret_question_3']); ?></label>
                <input type="text" name="answer_3" required placeholder="Your answer">
            </div>
            
            <button type="submit" class="submit-button" name="verify_answers">Verify Answers</button>
            <?php if($notice): ?>
                <p class="notice error"><?php echo htmlspecialchars($notice); ?></p>
            <?php endif; ?>
        </form>
        <?php endif; ?>

        <?php if($step == 3): ?>
        <!-- Step 3: Reset Password -->
        <form class="forgot-form" action="" method="POST">
            <p class="info-text">Create your new password</p>
            
            <div class="form-group">
                <label for="new_password">New Password</label>
                <input type="password" id="new_password" name="new_password" required placeholder="Enter new password" minlength="6">
            </div>
            
            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="confirm_password" required placeholder="Confirm new password" minlength="6">
            </div>
            
            <button type="submit" class="submit-button" name="reset_password">Reset Password</button>
            <?php if($notice): ?>
                <p class="notice error"><?php echo htmlspecialchars($notice); ?></p>
            <?php endif; ?>
            <?php if($success): ?>
                <p class="notice success"><?php echo htmlspecialchars($success); ?></p>
            <?php endif; ?>
        </form>
        <?php endif; ?>

        <div class="back-to-login">
            <a href="index.php">← Back to Login</a>
        </div>

        <div class="forgot-footer">
            Sibonga Community College@2008
        </div>
    </div>
</body>
</html>