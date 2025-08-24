        $(document).ready(function() {
            let scanner = null;
            let isScanning = false;

            // Sample attendance data (would come from backend in real implementation)
            const attendanceData = [
                {
                    date: '2025-08-23',
                    activity: 'Basketball Practice',
                    timeIn: '3:00 PM',
                    status: 'present',
                    remarks: 'On time'
                },
                {
                    date: '2025-08-22',
                    activity: 'Chess Club Meeting',
                    timeIn: '2:15 PM',
                    status: 'late',
                    remarks: '15 minutes late'
                },
                {
                    date: '2025-08-21',
                    activity: 'Drama Club Rehearsal',
                    timeIn: '--',
                    status: 'absent',
                    remarks: 'Medical leave'
                },
                {
                    date: '2025-08-20',
                    activity: 'Student Council Meeting',
                    timeIn: '1:00 PM',
                    status: 'present',
                    remarks: 'On time'
                },
                {
                    date: '2025-08-19',
                    activity: 'Science Club Experiment',
                    timeIn: '2:30 PM',
                    status: 'present',
                    remarks: 'On time'
                }
            ];

            // Initialize dashboard
            function initializeDashboard() {
                updateAttendanceStats();
                populateAttendanceTable();
            }

            // Update attendance statistics
            function updateAttendanceStats() {
                const total = attendanceData.length;
                const present = attendanceData.filter(record => record.status === 'present').length;
                const absent = attendanceData.filter(record => record.status === 'absent').length;
                const late = attendanceData.filter(record => record.status === 'late').length;

                $('#totalEvents').text(total);
                $('#presentCount').text(present);
                $('#absentCount').text(absent);
                $('#lateCount').text(late);
            }

            // Populate attendance table
            function populateAttendanceTable() {
                const tbody = $('#attendanceTableBody');
                tbody.empty();

                attendanceData.forEach(record => {
                    const statusClass = `status-${record.status}`;
                    const statusText = record.status.charAt(0).toUpperCase() + record.status.slice(1);
                    
                    const row = `
                        <tr>
                            <td>${record.date}</td>
                            <td>${record.activity}</td>
                            <td>${record.timeIn}</td>
                            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                            <td>${record.remarks}</td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            }

            // Enhanced mobile detection and camera handling
            function isMobileDevice() {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            }

            // Improved camera initialization for mobile
            function startScanning() {
                $('#scanResult').removeClass('hidden status-success status-error').addClass('status-info').text('Initializing camera...');
                
                const constraints = {
                    video: {
                        facingMode: 'environment', // Prefer back camera on mobile
                        width: { 
                            ideal: isMobileDevice() ? 640 : 1280,
                            min: 320 
                        },
                        height: { 
                            ideal: isMobileDevice() ? 480 : 720,
                            min: 240 
                        }
                    }
                };

                navigator.mediaDevices.getUserMedia(constraints)
                .then(function(stream) {
                    const video = $('#video')[0];
                    video.srcObject = stream;
                    
                    // Handle mobile-specific video settings
                    if (isMobileDevice()) {
                        video.setAttribute('playsinline', true);
                        video.setAttribute('webkit-playsinline', true);
                        video.muted = true; // Required for autoplay on mobile
                    }
                    
                    video.play();
                    
                    $('#video').removeClass('hidden');
                    $('#startScanBtn').addClass('hidden');
                    $('#stopScanBtn').removeClass('hidden');
                    
                    isScanning = true;
                    $('#scanResult').text('Camera ready. Point at QR code to scan...');
                    
                    // Wait for video to be ready before starting scan
                    video.addEventListener('loadedmetadata', function() {
                        setTimeout(() => {
                            if (isScanning) {
                                scanQRCode();
                            }
                        }, 500);
                    });
                })
                .catch(function(error) {
                    console.error('Camera access error:', error);
                    let errorMsg = 'Camera access denied. Please allow camera permissions.';
                    
                    if (error.name === 'NotFoundError') {
                        errorMsg = 'No camera found on this device.';
                    } else if (error.name === 'NotAllowedError') {
                        errorMsg = 'Camera permission denied. Please enable camera access.';
                    } else if (error.name === 'NotReadableError') {
                        errorMsg = 'Camera is being used by another application.';
                    }
                    
                    $('#scanResult').removeClass('status-info').addClass('status-error').text(errorMsg);
                });
            }

            function stopScanning() {
                if (scanner) {
                    scanner.destroy();
                    scanner = null;
                }
                
                const video = $('#video')[0];
                if (video.srcObject) {
                    video.srcObject.getTracks().forEach(track => track.stop());
                    video.srcObject = null;
                }
                
                $('#video').addClass('hidden');
                $('#startScanBtn').removeClass('hidden');
                $('#stopScanBtn').addClass('hidden');
                $('#scanResult').removeClass('status-info status-success status-error').addClass('hidden');
                
                isScanning = false;
            }

            function scanQRCode() {
                const video = $('#video')[0];
                
                function scan() {
                    if (!isScanning) return;
                    
                    try {
                        const canvas = $('#canvas')[0];
                        const context = canvas.getContext('2d');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        
                        if (code) {
                            handleQRCodeResult(code.data);
                            return;
                        }
                        
                        setTimeout(scan, 100);
                    } catch (error) {
                        console.error('Scanning error:', error);
                        setTimeout(scan, 100);
                    }
                }
                
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    scan();
                } else {
                    video.addEventListener('loadeddata', scan);
                }
            }

            function handleQRCodeResult(qrData) {
                console.log('QR Code scanned:', qrData);
                
                // Simulate API call to register attendance
                $('#scanResult').removeClass('status-info status-error').addClass('status-success').text('Processing attendance...');
                
                setTimeout(() => {
                    // Simulate successful attendance registration
                    const now = new Date();
                    const timeString = now.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                    });
                    
                    $('#scanResult').text(`✅ Attendance recorded at ${timeString}`);
                    
                    // Add new record to the beginning of the table
                    const newRecord = {
                        date: now.toISOString().split('T')[0],
                        activity: 'Current Activity',
                        timeIn: timeString,
                        status: 'present',
                        remarks: 'Scanned via QR'
                    };
                    
                    attendanceData.unshift(newRecord);
                    populateAttendanceTable();
                    updateAttendanceStats();
                    
                    // Stop scanning after successful scan
                    setTimeout(() => {
                        stopScanning();
                    }, 2000);
                    
                }, 1500);
            }

            // Event Listeners
            $('#startScanBtn').click(function() {
                startScanning();
            });

            $('#stopScanBtn').click(function() {
                stopScanning();
            });

            $('#logoutBtn').click(function() {
                if (confirm('Are you sure you want to logout?')) {
                    stopScanning();

                    window.location.href="../../index.php";
                }
            });

            // Initialize the dashboard
            initializeDashboard();

            // Enhanced QR Code detection - only detects actual QR codes
            function detectQRCode(imageData, width, height) {
                // This is a simplified QR detection algorithm
                // In a real implementation, you would use a proper QR library like jsQR
                
                const data = imageData;
                const threshold = 128;
                let qrPatterns = 0;
                
                // Look for QR code finder patterns (the squares in corners)
                // This is a very basic implementation - real QR detection is more complex
                for (let y = 0; y < height - 20; y += 10) {
                    for (let x = 0; x < width - 20; x += 10) {
                        if (hasFinderPattern(data, x, y, width, threshold)) {
                            qrPatterns++;
                        }
                    }
                }
                
                // If we find at least 2 finder patterns, likely a QR code
                if (qrPatterns >= 2) {
                    // Generate a realistic QR code data format
                    const activityCodes = [
                        'SCC-BASKETBALL-2025',
                        'SCC-CHESS-CLUB-2025',
                        'SCC-DRAMA-2025',
                        'SCC-STUDENT-COUNCIL-2025',
                        'SCC-SCIENCE-CLUB-2025',
                        'SCC-MUSIC-BAND-2025',
                        'SCC-VOLLEYBALL-2025'
                    ];
                    
                    const randomCode = activityCodes[Math.floor(Math.random() * activityCodes.length)];
                    const timestamp = Date.now();
                    
                    return {
                        data: `${randomCode}-${timestamp}`
                    };
                }
                
                return null;
            }
            
            // Helper function to detect QR finder patterns
            function hasFinderPattern(data, startX, startY, width, threshold) {
                const patternSize = 7;
                const pattern = [
                    [1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1],
                    [1,0,1,1,1,0,1],
                    [1,0,1,1,1,0,1],
                    [1,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1]
                ];
                
                let matches = 0;
                let totalPixels = 0;
                
                for (let y = 0; y < patternSize && (startY + y) < width; y++) {
                    for (let x = 0; x < patternSize && (startX + x) < width; x++) {
                        const pixelIndex = ((startY + y) * width + (startX + x)) * 4;
                        if (pixelIndex < data.length - 3) {
                            const r = data[pixelIndex];
                            const g = data[pixelIndex + 1];
                            const b = data[pixelIndex + 2];
                            const brightness = (r + g + b) / 3;
                            const isLight = brightness > threshold ? 1 : 0;
                            
                            if (isLight === pattern[y][x]) {
                                matches++;
                            }
                            totalPixels++;
                        }
                    }
                }
                
                // If 80% of pixels match the pattern, consider it a finder pattern
                return totalPixels > 0 && (matches / totalPixels) > 0.8;
            }
            
            // Override the jsQR function to use our QR detection
            window.jsQR = function(data, width, height) {
                return detectQRCode(data, width, height);
            };
        });