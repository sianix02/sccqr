// ATTENDANCE DATA MANAGER
        class AttendanceDataManager {
            constructor() {
                this.attendanceData = [
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
            }

            getAttendanceData() {
                return this.attendanceData;
            }

            addAttendanceRecord(record) {
                this.attendanceData.unshift(record);
            }

            getStats() {
                const total = this.attendanceData.length;
                const present = this.attendanceData.filter(record => record.status === 'present').length;
                const absent = this.attendanceData.filter(record => record.status === 'absent').length;
                const late = this.attendanceData.filter(record => record.status === 'late').length;
                const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

                return { total, present, absent, late, attendanceRate };
            }
        }

        // QR SCANNER MANAGER
        class QRScannerManager {
            constructor() {
                this.html5QrcodeScanner = null;
                this.isScanning = false;
                this.onScanSuccess = null;
                this.onScanError = null;
            }

            init(onScanSuccess, onScanError) {
                this.onScanSuccess = onScanSuccess;
                this.onScanError = onScanError;
            }

            startScanning() {
                if (this.isScanning) return;

                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    disableFlip: false,
                };

                this.html5QrcodeScanner = new Html5QrcodeScanner(
                    "qr-reader",
                    config,
                    false
                );

                this.html5QrcodeScanner.render(
                    (decodedText, decodedResult) => {
                        console.log(`QR Code detected: ${decodedText}`);
                        // Immediately stop scanner to prevent multiple scans
                        this.stopScanning();
                        if (this.onScanSuccess) {
                            this.onScanSuccess(decodedText, decodedResult);
                        }
                    },
                    (error) => {
                        // Only log actual errors, not "No QR code found" messages
                        if (!error.includes('QR code parse error') && 
                            !error.includes('No QR code found')) {
                            console.warn(`QR Code scan error: ${error}`);
                            if (this.onScanError) {
                                this.onScanError(error);
                            }
                        }
                    }
                );

                this.isScanning = true;
            }

            stopScanning() {
                if (this.html5QrcodeScanner && this.isScanning) {
                    this.html5QrcodeScanner.clear().then(() => {
                        console.log("QR Code scanner cleared successfully.");
                    }).catch(error => {
                        console.error("Failed to clear QR Code scanner.", error);
                    });
                    
                    this.html5QrcodeScanner = null;
                    this.isScanning = false;
                }
            }

            getIsScanning() {
                return this.isScanning;
            }
        }

        // UI MANAGER
        class UIManager {
            constructor() {
                this.attendanceManager = new AttendanceDataManager();
                this.scannerManager = new QRScannerManager();
                this.initializeComponents();
            }

            initializeComponents() {
                // Initialize QR Scanner
                this.scannerManager.init(
                    (decodedText) => this.handleScanSuccess(decodedText),
                    (error) => this.handleScanError(error)
                );

                // Initialize UI
                this.updateAttendanceStats();
                this.populateAttendanceTable();
                this.bindEventListeners();
            }

            bindEventListeners() {
                $('#startScanBtn').click(() => this.startScanning());
                $('#stopScanBtn').click(() => this.stopScanning());
                $('#logoutBtn').click(() => this.handleLogout());
            }

            startScanning() {
                $('#scanResult').removeClass('hidden status-success status-error')
                              .addClass('status-info')
                              .text('Initializing camera...');
                
                $('#qr-reader').removeClass('hidden');
                $('#startScanBtn').addClass('hidden');
                $('#stopScanBtn').removeClass('hidden');
                
                setTimeout(() => {
                    this.scannerManager.startScanning();
                    $('#scanResult').text('Camera ready. Point at QR code to scan...');
                }, 500);
            }

            stopScanning() {
                this.scannerManager.stopScanning();
                
                $('#qr-reader').addClass('hidden');
                $('#startScanBtn').removeClass('hidden');
                $('#stopScanBtn').addClass('hidden');
                $('#scanResult').removeClass('status-info status-success status-error')
                              .addClass('hidden');
            }

            handleScanSuccess(decodedText) {
                console.log('QR Code scanned:', decodedText);
                
                // Immediately stop scanning to prevent multiple scans
                this.scannerManager.stopScanning();
                
                $('#scanResult').removeClass('status-info status-error')
                              .addClass('status-success')
                              .text('✅ QR Code detected! Processing attendance...');
                
                // Simulate API call
                setTimeout(() => {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                    });
                    
                    $('#scanResult').text(`✅ Attendance recorded at ${timeString}`);
                    
                    // Add new attendance record
                    const newRecord = {
                        date: now.toISOString().split('T')[0],
                        activity: this.getActivityFromQR(decodedText),
                        timeIn: timeString,
                        status: 'present',
                        remarks: 'Scanned via QR'
                    };
                    
                    this.attendanceManager.addAttendanceRecord(newRecord);
                    this.updateAttendanceStats();
                    this.populateAttendanceTable();
                    
                    // Complete the scanning process and reset UI
                    setTimeout(() => {
                        this.completeScanProcess();
                    }, 2000);
                    
                }, 1000);
            }

            completeScanProcess() {
                // Hide scanner and reset UI to initial state
                $('#qr-reader').addClass('hidden');
                $('#startScanBtn').removeClass('hidden');
                $('#stopScanBtn').addClass('hidden');
                $('#scanResult').removeClass('status-info status-success status-error')
                              .addClass('hidden');
            }

            handleScanError(error) {
                $('#scanResult').removeClass('status-info status-success')
                              .addClass('status-error')
                              .text('Camera error occurred. Please try again.');
            }

            getActivityFromQR(qrText) {
                // Extract activity from QR code
                if (qrText.includes('BASKETBALL')) return 'Basketball Practice';
                if (qrText.includes('CHESS')) return 'Chess Club Meeting';
                if (qrText.includes('DRAMA')) return 'Drama Club Rehearsal';
                if (qrText.includes('COUNCIL')) return 'Student Council Meeting';
                if (qrText.includes('SCIENCE')) return 'Science Club Experiment';
                if (qrText.includes('MUSIC')) return 'Music Band Practice';
                if (qrText.includes('VOLLEYBALL')) return 'Volleyball Training';
                
                return 'Invalid Attendance';
            }

            updateAttendanceStats() {
                const stats = this.attendanceManager.getStats();
                
                $('#totalEvents').text(stats.total);
                $('#presentCount').text(stats.present);
                $('#absentCount').text(stats.absent);
                $('#lateCount').text(stats.late);
                $('#attendanceRate').text(stats.attendanceRate + '%');
            }

            populateAttendanceTable() {
                const tbody = $('#attendanceTableBody');
                tbody.empty();

                const data = this.attendanceManager.getAttendanceData();
                data.forEach(record => {
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

            handleLogout() {
                if (confirm('Are you sure you want to logout?')) {
                    this.stopScanning();
                    // window.location.href = "../../index.php";
                    alert('Logout successful! (Redirect disabled for demo)');
                }
            }
        }

        // Initialize the application when document is ready
        $(document).ready(function() {
            const uiManager = new UIManager();
            console.log('Student Dashboard initialized successfully');
        });