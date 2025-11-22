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
    <title>Student Dashboard - SCC Extracurricular Attendance</title>
    <!-- QR Code Scanner Library -->
    <link rel="stylesheet" href="../../css/student_home.css">
    <link rel="stylesheet" href="../../css/student_home_css_extension.css">
    <script src="https://unpkg.com/html5-qrcode@2.3.4/html5-qrcode.min.js"></script>
    <!-- jQuery -->
    <script src="../../script/jquery-3.7.1.min.js"></script>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="header-left">
                <div class="logo">
                    <div class="logo-inner">
                        <img src="../../images/logo.png" alt="" srcset="">
                    </div>
                </div>
                <div class="header-text">
                    <h1>Student Dashboard</h1>
                    <p>Extracurricular Activities Attendance System</p>
                </div>
            </div>
            <div class="user-info">
                <div class="user-details">
                    <div class="user-name">Juan Dela Cruz</div>
                    <div class="user-id">ID: 2024-001234</div>
                    <div class="user-set">Year & Set: 2nd-A</div>
                    <div class="user-course">Course: BSIT</div>
                    <div class="user-sex">Sex: Male</div>
                </div>
                <div class="user-actions">
                    <button class="change-password-btn" onclick="window.location.href='change_password.php'">🔐 Change Password</button>
                    <button class="logout-btn" id="logoutBtn">Logout</button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="container">
        <div class="dashboard-grid">
            <!-- QR Scanner Section -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">📱</div>
                    <h2 class="card-title">QR Code Scanner</h2>
                </div>
                <div class="qr-scanner-container">
                    <!-- QR Reader container - this will be populated by html5-qrcode -->
                    <div id="qr-reader" class="hidden"></div>
                    
                    <div class="scanner-controls">
                        <!-- CAMERA ICON MAINTAINED HERE -->
                        <button class="btn btn-primary" id="timeInBtn">
                            📷 Time In
                        </button>
                        <!-- CAMERA ICON MAINTAINED HERE -->
                        <button class="btn btn-success hidden" id="timeOutBtn">
                            📷 Time Out
                        </button>
                        <button class="btn btn-secondary hidden" id="stopScanBtn">
                            ⹎️ Stop Scanning
                        </button>
                    </div>
                    
                    <div id="scanResult" class="scanner-status hidden">
                        Ready to scan QR code
                    </div>
                </div>
            </div>

            <!-- Attendance Overview -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">📊</div>
                    <h2 class="card-title">Attendance Overview</h2>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" id="totalEvents">0</div>
                        <div class="stat-label">Total Events</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="presentCount">0</div>
                        <div class="stat-label">Present</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="absentCount">0</div>
                        <div class="stat-label">Absent</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="lateCount">0</div>
                        <div class="stat-label">Late</div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <div style="font-size: 24px; font-weight: bold; color: var(--success-green);">
                        <span id="attendanceRate">0%</span> Attendance Rate
                    </div>
                </div>
            </div>
        </div>

        <!-- Attendance Report Table -->
        <div class="card">
            <div class="card-header">
                <div class="card-icon">📋</div>
                <h2 class="card-title">Recent Attendance Records</h2>
            </div>

            <!-- Filter and Export Controls -->
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <label for="eventFilter" style="font-weight: 600; font-size: 14px;">Filter by Event Type:</label>
                    <div id="filterContainer"></div>
                </div>
                <button class="btn btn-primary" id="exportPdfBtn" style="margin-left: auto;">
                    📥 Export to PDF
                </button>
            </div>
            
            <div style="overflow-x: auto;">
                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th>Date and Time Started</th>
                            <th>Activity</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Remarks</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="attendanceTableBody">
                        <!-- Data will be populated by JavaScript -->
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 20px;">
                                Loading attendance records...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="../../script/student-home.js"></script>
</body>
</html>