<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../../images/logo.png">
    <title>Dashboard with Enhanced Analytics</title>
    <script src="../../script/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="../../css/admin_home.css">
</head>
<body>
    <?php include 'sidebar.php'; ?>

    <!-- Main Content -->
    <main class="main-content">
        <?php include 'home.php'; ?>
        <?php include 'start-event.php'; ?>
        <?php include 'event.php'; ?>
        <?php include 'student.php'; ?>
        <?php include 'create-acc.php'; ?>
        <?php include 'logout.php'; ?>
    </main>

    <script src="../../script/admin-home.js"></script>
</body>
</html>