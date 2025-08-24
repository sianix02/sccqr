<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code Attendance System</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://unpkg.com/html5-qrcode"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="tab-buttons">
            <button class="tab-button active" data-tab="admin">Admin</button>
            <button class="tab-button" data-tab="client">Client</button>
        </div>
        
        <!-- Admin Tab -->
        <div id="admin" class="tab-content active">
            <h2>Admin Panel</h2>
            
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number" id="totalAttendees">0</div>
                    <div class="stat-label">Total Attendees</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="todayAttendees">0</div>
                    <div class="stat-label">Today</div>
                </div>
            </div>
            
            <button class="btn" id="generateQRBtn">Generate QR Code</button>
            <button class="btn" id="clearAttendanceBtn">Clear Records</button>
            
            <div class="qr-display">
                <div id="qrcode">
                    <p style="color: #666;">Click "Generate QR Code" to create attendance QR</p>
                </div>
            </div>
            
            <div class="attendance-list">
                <h3>Attendance Records</h3>
                <div id="attendanceList">
                    <div class="empty-state">No attendance records yet</div>
                </div>
            </div>
        </div>
        
        <!-- Client Tab -->
        <div id="client" class="tab-content">
            <h2>Mark Attendance</h2>
            
            <div class="camera-info">
                <h4>📱 Camera Access</h4>
                <p>• Make sure to allow camera permissions when prompted</p>
                <p>• For best results, use the rear camera</p>
                <p>• Ensure good lighting when scanning QR codes</p>
            </div>
            
            <div class="scanner-container">
                <div id="reader" style="width: 100%; display: none;"></div>
                <button class="btn" id="scanButton">Start QR Scanner</button>
                <button class="btn" id="stopButton" style="display: none;">Stop Scanner</button>
            </div>
            
            <div id="scanMessage"></div>
            
            <div style="margin-top: 30px;">
                <h3>Manual Entry</h3>
                <input type="text" id="manualName" placeholder="Enter your name">
                <button class="btn" id="markAttendanceBtn">Mark Attendance</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>