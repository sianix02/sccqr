<?php
session_start();

if (!isset($_SESSION['session_id'])) {
    header('location: ../../index.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../../images/logo.png">
    <title>Change Password - SCC Extracurricular Attendance</title>
    <link rel="stylesheet" href="../../css/student_change_password.css">
    <script src="../../script/jquery-3.7.1.min.js"></script>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="header-left">
                <div class="logo">
                    <div class="logo-inner">
                        <img src="../../images/logo.png" alt="" srcset="">
                    </div>
                </div>
                <div class="header-text">
                    <h1>Change Password</h1>
                    <p>Update your account security</p>
                </div>
            </div>
            <div class="user-info">
                <button class="back-btn" onclick="window.location.href='home.php'">← Back to Dashboard</button>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="card">
            <div class="card-header">
                <div class="card-icon">🔒</div>
                <h2 class="card-title">Change Your Password</h2>
            </div>
            
            <div id="alertMessage" class="alert hidden"></div>

            <form id="changePasswordForm">
                <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" name="currentPassword" required>
                </div>

                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                    <small class="help-text">Password must be at least 8 characters long</small>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>

                <div class="password-requirements">
                    <p><strong>Password Requirements:</strong></p>
                    <ul>
                        <li id="req-length">At least 8 characters</li>
                        <li id="req-match">Passwords match</li>
                    </ul>
                </div>

                <button type="submit" class="btn btn-primary">Change Password</button>
            </form>
        </div>
    </div>

    <script src="../../script/student_change_password.js"></script>
</body>
</html>