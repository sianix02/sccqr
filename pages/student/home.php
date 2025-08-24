<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - SCC Extracurricular Attendance</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qr-scanner/1.4.2/qr-scanner.umd.min.js"></script>
    <link rel="stylesheet" href="../../css/student_home.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="header-left">
                <div class="logo">
                    <div class="logo-inner">
                        <img src="../../images/logo.png" alt="scc_logo" srcset="">
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
                </div>
                <button class="logout-btn" id="logoutBtn">Logout</button>
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
                    <video id="video" class="hidden"></video>
                    <canvas id="canvas" class="hidden"></canvas>
                    
                    <div class="scanner-controls">
                        <button class="btn btn-primary" id="startScanBtn">Start Scanning</button>
                        <button class="btn btn-secondary hidden" id="stopScanBtn">Stop Scanning</button>
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
                        <div class="stat-number" id="totalEvents">24</div>
                        <div class="stat-label">Total Events</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="presentCount">20</div>
                        <div class="stat-label">Present</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="absentCount">3</div>
                        <div class="stat-label">Absent</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="lateCount">1</div>
                        <div class="stat-label">Late</div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <div style="font-size: 24px; font-weight: bold; color: var(--success-green);">
                        83% Attendance Rate
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
            
            <div style="overflow-x: auto;">
                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Activity</th>
                            <th>Time In</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody id="attendanceTableBody">
                        <tr>
                            <td>2025-08-23</td>
                            <td>Basketball Practice</td>
                            <td>3:00 PM</td>
                            <td><span class="status-badge status-present">Present</span></td>
                            <td>On time</td>
                        </tr>
                        <tr>
                            <td>2025-08-22</td>
                            <td>Chess Club Meeting</td>
                            <td>2:15 PM</td>
                            <td><span class="status-badge status-late">Late</span></td>
                            <td>15 minutes late</td>
                        </tr>
                        <tr>
                            <td>2025-08-21</td>
                            <td>Drama Club Rehearsal</td>
                            <td>--</td>
                            <td><span class="status-badge status-absent">Absent</span></td>
                            <td>Medical leave</td>
                        </tr>
                        <tr>
                            <td>2025-08-20</td>
                            <td>Student Council Meeting</td>
                            <td>1:00 PM</td>
                            <td><span class="status-badge status-present">Present</span></td>
                            <td>On time</td>
                        </tr>
                        <tr>
                            <td>2025-08-19</td>
                            <td>Science Club Experiment</td>
                            <td>2:30 PM</td>
                            <td><span class="status-badge status-present">Present</span></td>
                            <td>On time</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

  <script src="../../script/student-home.js"></script>
</body>
</html>