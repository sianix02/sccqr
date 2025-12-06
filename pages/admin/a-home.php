<?php
session_start();

// Check if user is logged in
if(!isset($_SESSION['session_id'])) {
    header("location: ../../index.php");
    exit();
}

// Check if user has admin role
if(!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    // Redirect based on their actual role
    if(isset($_SESSION['role'])) {
        switch($_SESSION['role']) {
            case 'student':
                header("location: ../student/home.php");
                exit();
                break;
            case 'instructor':
                header("location: ../instructor/home.php");
                exit();
                break;
            default:
                // If role is invalid, destroy session and go to login
                session_destroy();
                header("location: ../../index.php");
                exit();
        }
    } else {
        // No role set, destroy session and go to login
        session_destroy();
        header("location: ../../index.php");
        exit();
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../../images/logo.png">
    <title>Dashboard with Enhanced Analytics</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
    <script src="../../script/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

    <script src="../../script-lib/chart.min.js"></script>
    <script src="../../script-lib/qrcode.min.js"></script>
    <script src="../../script-lib/jspdf.plugin.autotable.min.js"></script>
    <script src="../../script-lib/jspdf.umd.min.js"></script>

    <link rel="stylesheet" href="../../css/admin_home.css">
    <link rel="stylesheet" href="../../css/analytics_chart.css">
</head>
<body>
    <?php include 'sidebar.php'; ?>

    <!-- Main Content -->
    <main class="main-content">
        <?php include 'home.php'; ?>
        <?php include 'start-event.php'; ?>
        <?php include 'event-history.php'; ?>
        <?php include 'student.php'; ?>
        <?php include 'create-acc.php'; ?>
        <?php include 'logout.php'; ?>
        <?php include 'admin_profile_modal.php'; ?>
        <?php include 'admin_change_password_modal.php'; ?>
    </main>

    <script src="../../script/admin-home-core.js"></script>
    <script src="../../script/admin-home-events.js"></script>
    <script src="../../script/admin-home-students.js"></script>
    <script src="../../script/admin_profile_handler.js"></script>
    <script src="../../script/admin_password_handler.js"></script>
    <script src="../../script/admin-analytics.js"></script>


</body>
</html>