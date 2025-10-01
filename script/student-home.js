// ATTENDANCE DATA MANAGER
class AttendanceDataManager {
    constructor() {
        this.attendanceData = [
            {
                date: '2025-08-23',
                activity: 'STUDENT ASSEMBLY',
                timeIn: '3:00 PM',
                timeOut: '5:00 PM',
                status: 'absent',
                remarks: 'Not on time'
            },
        ];
        this.activeSession = null;
    }

    getAttendanceData() {
        return this.attendanceData;
    }

    addAttendanceRecord(record) {
        this.attendanceData.unshift(record);
    }

    updateTimeOut(activityName, timeOut) {
        const record = this.attendanceData.find(r => 
            r.activity === activityName && r.timeOut === 'Pending'
        );
        if (record) {
            record.timeOut = timeOut;
            const duration = this.calculateDuration(record.timeIn, timeOut);
            record.remarks = record.status === 'late' 
                ? `Duration: ${duration} (Arrived late)` 
                : `Duration: ${duration}`;
            return true;
        }
        return false;
    }

    calculateDuration(timeIn, timeOut) {
        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };

        const inMinutes = parseTime(timeIn);
        const outMinutes = parseTime(timeOut);
        const diff = outMinutes - inMinutes;
        
        if (diff < 0) return '0m';
        
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }

    // NEW: Calculate time difference in minutes
    calculateTimeDifference(scheduledTime, actualTime) {
        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };

        const scheduledMinutes = parseTime(scheduledTime);
        const actualMinutes = parseTime(actualTime);
        
        return actualMinutes - scheduledMinutes;
    }

    // NEW: Determine attendance status based on scheduled time
    determineAttendanceStatus(scheduledTime, actualTime) {
        const diffMinutes = this.calculateTimeDifference(scheduledTime, actualTime);
        
        // If 30 minutes or more late, mark as late
        if (diffMinutes >= 30) {
            return {
                status: 'late',
                remarks: `Arrived ${diffMinutes} minutes after scheduled time`
            };
        } else if (diffMinutes > 0) {
            return {
                status: 'present',
                remarks: `Arrived ${diffMinutes} minutes after scheduled time`
            };
        } else {
            return {
                status: 'present',
                remarks: 'On time'
            };
        }
    }

    hasActiveSession() {
        return this.activeSession !== null;
    }

    setActiveSession(activityName) {
        this.activeSession = activityName;
    }

    clearActiveSession() {
        this.activeSession = null;
    }

    getActiveSession() {
        return this.activeSession;
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
                this.stopScanning();
                if (this.onScanSuccess) {
                    this.onScanSuccess(decodedText, decodedResult);
                }
            },
            (error) => {
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
        this.scannerManager.init(
            (decodedText) => this.handleScanSuccess(decodedText),
            (error) => this.handleScanError(error)
        );

        this.updateAttendanceStats();
        this.populateAttendanceTable();
        this.bindEventListeners();
        this.updateScanButtonState();
    }

    bindEventListeners() {
        $('#startScanBtn').click(() => this.startScanning());
        $('#stopScanBtn').click(() => this.stopScanning());
        $('#logoutBtn').click(() => this.handleLogout());
    }

    updateScanButtonState() {
        const hasActiveSession = this.attendanceManager.hasActiveSession();
        if (hasActiveSession) {
            $('#startScanBtn').text('Scan to Time Out');
        } else {
            $('#startScanBtn').text('Start Scanning');
        }
    }

    startScanning() {
        const hasActiveSession = this.attendanceManager.hasActiveSession();
        const actionText = hasActiveSession ? 'timing out' : 'timing in';
        
        $('#scanResult').removeClass('hidden status-success status-error')
                      .addClass('status-info')
                      .text(`Initializing camera for ${actionText}...`);
        
        $('#qr-reader').removeClass('hidden');
        $('#startScanBtn').addClass('hidden');
        $('#stopScanBtn').removeClass('hidden');
        
        setTimeout(() => {
            this.scannerManager.startScanning();
            $('#scanResult').text(`Camera ready. Scan QR code to ${actionText}...`);
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
        
        this.scannerManager.stopScanning();
        
        // NEW: Parse QR code to get activity details
        const qrData = this.parseQRCode(decodedText);
        
        if (!qrData) {
            $('#scanResult').removeClass('status-info status-success')
                          .addClass('status-error')
                          .text('❌ Invalid QR Code. Please scan a valid event QR code.');
            
            setTimeout(() => {
                this.completeScanProcess();
            }, 3000);
            return;
        }

        const { activityName, scheduledTime } = qrData;

        // Check if this is a time-out scan
        const activeSession = this.attendanceManager.getActiveSession();
        
        if (activeSession) {
            // Time Out Process
            if (activeSession !== activityName) {
                $('#scanResult').removeClass('status-info status-success')
                              .addClass('status-error')
                              .text(`❌ Wrong QR code! You are currently timed in to "${activeSession}". Please scan the correct event QR code to time out.`);
                
                setTimeout(() => {
                    this.completeScanProcess();
                }, 4000);
                return;
            }

            $('#scanResult').removeClass('status-info status-error')
                          .addClass('status-success')
                          .text('✅ QR Code detected! Recording time out...');
            
            setTimeout(() => {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                const updated = this.attendanceManager.updateTimeOut(activityName, timeString);
                
                if (updated) {
                    $('#scanResult').text(`✅ Time Out recorded at ${timeString} for ${activityName}`);
                    this.attendanceManager.clearActiveSession();
                    this.updateAttendanceStats();
                    this.populateAttendanceTable();
                    this.updateScanButtonState();
                } else {
                    $('#scanResult').removeClass('status-success')
                                  .addClass('status-error')
                                  .text('❌ Error recording time out. Please try again.');
                }
                
                setTimeout(() => {
                    this.completeScanProcess();
                }, 2000);
                
            }, 1000);
            
        } else {
            // Time In Process
            $('#scanResult').removeClass('status-info status-error')
                          .addClass('status-success')
                          .text('✅ QR Code detected! Recording time in...');
            
            setTimeout(() => {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                // NEW: Determine status based on scheduled time
                const attendanceStatus = this.attendanceManager.determineAttendanceStatus(
                    scheduledTime, 
                    timeString
                );
                
                const statusMessage = attendanceStatus.status === 'late' 
                    ? `⚠️ Time In recorded at ${timeString} (LATE - ${attendanceStatus.remarks})`
                    : `✅ Time In recorded at ${timeString} (On Time)`;
                
                $('#scanResult').text(statusMessage);
                
                const newRecord = {
                    date: now.toISOString().split('T')[0],
                    activity: activityName,
                    timeIn: timeString,
                    timeOut: 'Pending',
                    status: attendanceStatus.status,
                    remarks: attendanceStatus.remarks + ' - Please scan to time out'
                };
                
                this.attendanceManager.addAttendanceRecord(newRecord);
                this.attendanceManager.setActiveSession(activityName);
                this.updateAttendanceStats();
                this.populateAttendanceTable();
                this.updateScanButtonState();
                
                setTimeout(() => {
                    this.completeScanProcess();
                }, 3000);
                
            }, 1000);
        }
    }

    completeScanProcess() {
        $('#qr-reader').addClass('hidden');
        $('#startScanBtn').removeClass('hidden');
        $('#stopScanBtn').addClass('hidden');
        $('#scanResult').removeClass('status-info status-success status-error')
                      .addClass('hidden');
    }

    handleScanError(error) {
        $('#scanResult').removeClass('status-info status-success')
                      .addClass('status-error')
                      .text('❌ Camera error occurred. Please try again.');
    }

    // UPDATED: Parse QR code to extract activity name and scheduled time
    parseQRCode(qrText) {
        console.log('Original QR Code content:', qrText);

        // Expected format: SIBONGA-ACTIVITY_NAME-SCHEDULED_TIME
        // Example: SIBONGA-STUDENT ASSEMBLY-2:30 PM
        if (qrText.includes('SIBONGA')) {
            const parts = qrText.split('-');
            
            if (parts.length >= 3) {
                // Extract activity name (all parts between first and last)
                const activityName = parts.slice(1, -1).join('-');
                // Extract scheduled time (last part)
                const scheduledTime = parts[parts.length - 1];
                
                console.log('Extracted Activity:', activityName);
                console.log('Scheduled Time:', scheduledTime);
                
                return {
                    activityName: activityName,
                    scheduledTime: scheduledTime
                };
            }
        }
        
        return null;
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
            
            // Highlight pending time out
            const timeOutDisplay = record.timeOut === 'Pending' 
                ? '<strong style="color: #ffc107;">⏱️ Pending</strong>' 
                : record.timeOut;
            
            const row = `
                <tr ${record.timeOut === 'Pending' ? 'style="background-color: #fff3cd;"' : ''}>
                    <td>${record.date}</td>
                    <td>${record.activity}</td>
                    <td>${record.timeIn}</td>
                    <td>${timeOutDisplay}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${record.remarks}</td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    handleLogout() {
        if (this.attendanceManager.hasActiveSession()) {
            const activeSession = this.attendanceManager.getActiveSession();
            if (!confirm(`You have an active session for "${activeSession}". Are you sure you want to logout without timing out?`)) {
                return;
            }
        }
        
        if (confirm('Are you sure you want to logout?')) {
            this.stopScanning();
            window.location.href = "../../sql_php/logout.php";
        }
    }
}

function getYearSuffix(year) {
    const yearNum = parseInt(year);
    if (yearNum === 1) return 'st';
    if (yearNum === 2) return 'nd';
    if (yearNum === 3) return 'rd';
    return 'th';
}

function getStudent() {
    return $.ajax({
        url: '../../sql_php/user_data.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                const student = response.student;
                
                $('.user-name').text(student.first_name + ' ' + student.last_name);
                $('.user-id').eq(0).text('ID: ' + student.student_id);
                $('.user-set').text('Year & Set: ' + student.year_level + getYearSuffix(student.year_level) + '-' + student.student_set);
                $('.user-course').text('Course: ' + student.course);
                $('.user-sex').text('Sex: ' + student.sex);
                
                console.log('Student loaded:', response.student);
                return response.student;
            } else {
                console.error('Error:', response.error);
                $('.user-name').text('Error loading student');
                $('.user-id').eq(0).text('Error: ' + response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error);
            $('.user-name').text('Connection Error');
            $('.user-id').eq(0).text('Failed to connect to server');
        }
    });
}

// Initialize the application when document is ready
$(document).ready(function() {
    const uiManager = new UIManager();
    console.log('Student Dashboard initialized successfully');
    getStudent();
});