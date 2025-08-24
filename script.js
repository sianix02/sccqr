$(document).ready(function() {
    let html5QrcodeScanner = null;
    let attendanceData = [];
    let currentSessionId = null;
    let cameraId = null;

    init();

    $('.tab-button').on('click', function() {
        const tabName = $(this).data('tab');
        showTab(tabName);
    });

    $('#generateQRBtn').on('click', generateQR);
    $('#clearAttendanceBtn').on('click', clearAttendance);
    $('#scanButton').on('click', startScanning);
    $('#stopButton').on('click', stopScanning);
    $('#markAttendanceBtn').on('click', markAttendanceManual);

    $('#manualName').on('keypress', function(e) {
        if (e.which === 13) markAttendanceManual();
    });

    function loadAttendanceData() {
        return attendanceData;
    }

    function saveAttendanceData() {
        updateAttendanceDisplay();
        updateStats();
    }

    function generateQR() {
        currentSessionId = 'session_' + Date.now();
        const qrData = {
            type: 'attendance',
            sessionId: currentSessionId,
            timestamp: new Date().toISOString(),
            location: 'Main Hall'
        };

        const $qrCodeContainer = $('#qrcode');
        $qrCodeContainer.empty();

        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded.');
            $qrCodeContainer.html('<p style="color: red;">QR Code library missing</p>');
            return;
        }

        QRCode.toCanvas(qrData.sessionId, {
            width: 200,
            margin: 2,
            color: {
                dark: '#333333',
                light: '#FFFFFF'
            }
        }, function (error, canvas) {
            if (error) {
                console.error(error);
                $qrCodeContainer.html('<p style="color: red;">Error generating QR code</p>');
            } else {
                $qrCodeContainer.append(canvas);
                showMessage('QR Code generated successfully!', 'success');
            }
        });
    }

    async function getCameraId() {
        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length > 0) {
                // Prefer rear camera if available
                const rearCamera = devices.find(device => 
                    device.label.toLowerCase().includes('back') || 
                    device.label.toLowerCase().includes('rear') ||
                    device.label.toLowerCase().includes('environment')
                );
                return rearCamera ? rearCamera.id : devices[0].id;
            }
            return null;
        } catch (error) {
            console.error('Error getting cameras:', error);
            return null;
        }
    }

    async function startScanning() {
        try {
            // Check if we're on HTTPS or localhost

            

            $('#scanButton').prop('disabled', true);
            showMessage('Requesting camera permission...', 'warning');

            // Get camera ID
            cameraId = await getCameraId();
            if (!cameraId) {
                showMessage('No camera found on this device', 'error');
                $('#scanButton').prop('disabled', false);
                return;
            }

            $('#scanButton').hide();
            $('#stopButton').show();
            $('#reader').show();

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                defaultZoomValueIfSupported: 2
            };

            html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
            
            showMessage('Camera is ready! Point at a QR code to scan', 'success');

        } catch (error) {
            console.error('Error starting scanner:', error);
            showMessage('Failed to start camera. Please check permissions and try again.', 'error');
            $('#scanButton').show().prop('disabled', false);
            $('#stopButton').hide();
            $('#reader').hide();
        }
    }

    function stopScanning() {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().then(() => {
                console.log('Scanner stopped successfully');
            }).catch(error => {
                console.error('Error stopping scanner:', error);
            });
            html5QrcodeScanner = null;
        }

        $('#scanButton').show().prop('disabled', false);
        $('#stopButton').hide();
        $('#reader').hide();
        $('#scanMessage').empty();
    }

    function onScanSuccess(decodedText) {
        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        const name = prompt('QR Code scanned successfully!\nPlease enter your name:');
        if (name && name.trim()) {
            markAttendance(name.trim(), decodedText);
            stopScanning();
        }
    }

    function onScanFailure(error) {
        // Handle scan failure silently - too noisy otherwise
        // console.log('Scan failed:', error);
    }

    function markAttendance(name, sessionId) {
        const now = new Date();
        const attendanceRecord = {
            id: Date.now(),
            name,
            sessionId,
            timestamp: now.toISOString(),
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString()
        };

        const existingRecord = attendanceData.find(record =>
            record.name.toLowerCase() === name.toLowerCase() && record.sessionId === sessionId
        );

        if (existingRecord) {
            showMessage('You have already marked attendance for this session!', 'error');
            return;
        }

        attendanceData.push(attendanceRecord);
        saveAttendanceData();
        showMessage(`Attendance marked successfully for ${name}! ✅`, 'success');
    }

    function markAttendanceManual() {
        const $nameInput = $('#manualName');
        const name = $nameInput.val().trim();

        if (!name) return showMessage('Please enter your name', 'error');
        if (!currentSessionId) return showMessage('No active session. Please ask admin to generate QR code.', 'error');

        markAttendance(name, currentSessionId);
        $nameInput.val('');
    }

    function showMessage(message, type) {
        const $messageDiv = $('#scanMessage');
        $messageDiv.html(`<div class="message ${type}">${message}</div>`);
        setTimeout(() => $messageDiv.empty(), 5000);
    }

    function updateAttendanceDisplay() {
        const $attendanceList = $('#attendanceList');

        if (attendanceData.length === 0) {
            $attendanceList.html('<div class="empty-state">No attendance records yet</div>');
            return;
        }

        const sortedData = attendanceData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const attendanceHtml = sortedData.map(record => `
            <div class="attendance-item">
                <div class="attendance-info">
                    <div class="attendance-name">${record.name}</div>
                    <div class="attendance-time">${record.date} at ${record.time}</div>
                </div>
                <div class="status">Present</div>
            </div>`).join('');

        $attendanceList.html(attendanceHtml);
    }

    function updateStats() {
        const totalAttendees = attendanceData.length;
        const today = new Date().toLocaleDateString();
        const todayAttendees = attendanceData.filter(record => record.date === today).length;

        $('#totalAttendees').text(totalAttendees);
        $('#todayAttendees').text(todayAttendees);
    }

    function clearAttendance() {
        if (confirm('Are you sure you want to clear all attendance records?')) {
            attendanceData = [];
            saveAttendanceData();
            showMessage('All attendance records cleared', 'success');
        }
    }

    function showTab(tabName) {
        $('.tab-content').removeClass('active');
        $('.tab-button').removeClass('active');
        $(`#${tabName}`).addClass('active');
        $(`.tab-button[data-tab="${tabName}"]`).addClass('active');

        if (tabName !== 'client') stopScanning();
    }

    function init() {
        loadAttendanceData();
        updateAttendanceDisplay();
        updateStats();
        
        // Check camera availability on load
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('Camera API available');
        } else {
            console.warn('Camera API not available');
        }
    }

    // Handle visibility change to stop camera when tab is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && html5QrcodeScanner) {
            stopScanning();
        }
    });
});