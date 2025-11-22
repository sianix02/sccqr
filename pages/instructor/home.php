<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['session_id'])) {
    header("Location: ../../index.php");
    exit();
}

$user_id = $_SESSION['session_id'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../../images/logo.png">
    <title>Instructor Dashboard - Live Attendance</title>
    <script src="../../script/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
    <link rel="stylesheet" href="../../css/toast_notifications.css">
    <link rel="stylesheet" href="../../css/instructor.css">
</head>
<body>

    <button class="mobile-menu-btn" id="mobile-menu-btn">
        <span style="font-size: 18px;">☰</span>
    </button>
    
    <div class="mobile-overlay" id="mobile-overlay"></div>
    

    
    <?php include 'components/sidebar.php'; ?>

    <main class="main-content">
        <?php include 'components/live_attendance.php'; ?>
        <?php include 'components/class_management.php'; ?>
        <?php include 'components/logout_modal.php'; ?>
        <?php include 'components/profile_modal.php'; ?>
        <?php include 'components/change_password_modal.php'; ?>
    </main>

    <script src="../../script/instructor.js"></script>
    <script src="../../script/profile_handler.js"></script>
    <script src="../../script/password_handler.js"></script>
    <script src="../../script/notifications.js"></script>
</body>
</html>