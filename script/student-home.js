// ATTENDANCE DATA MANAGER
class AttendanceDataManager {
    constructor() {
        this.attendanceData = [];
        this.activeSession = null;
        this.stats = null;
        this.isLoading = false;
    }

    async loadAttendanceRecords(forceRefresh = false) {
        // Prevent multiple simultaneous calls
        if (this.isLoading && !forceRefresh) {
            return { success: true, cached: true };
        }

        this.isLoading = true;
        
        try {
            const response = await $.ajax({
                url: '../../sql_php/get_attendance_records.php',
                type: 'GET',
                dataType: 'json'
            });

            if (response.success) {
                this.attendanceData = response.records.map(record => ({
                    date: record.date,
                    activity: record.event_name,
                    timeIn: record.time_in,
                    timeOut: record.time_out,
                    status: record.remarks || 'present', // remarks now contains: present, late, or absent
                    remarks: record.is_active ? 'Active - Time out required' : 'Completed'
                }));

                this.activeSession = response.active_session;
                this.stats = response.stats;
                
                this.isLoading = false;
                return response;
            }
        } catch (error) {
            console.error('Error loading attendance records:', error);
            this.isLoading = false;
            return { success: false, error: error };
        }
    }

    async recordTimeIn(eventName, scheduledTime, actualTime, remarks) {
        try {
            const response = await $.ajax({
                url: '../../sql_php/record_attendance.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'time_in',
                    event_name: eventName,
                    scheduled_time: scheduledTime,
                    actual_time: actualTime,
                    remarks: remarks // This is the status: present, late, or absent
                }
            });

            // Update active session immediately without reloading
            if (response.success) {
                this.activeSession = eventName;
            }

            return response;
        } catch (error) {
            console.error('Error recording time in:', error);
            return { success: false, error: error.responseJSON?.error || 'Network error' };
        }
    }

    async recordTimeOut(eventName, timeOut) {
        try {
            const response = await $.ajax({
                url: '../../sql_php/record_attendance.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'time_out',
                    event_name: eventName,
                    time_out: timeOut
                }
            });

            // Clear active session immediately without reloading
            if (response.success) {
                this.activeSession = null;
            }

            return response;
        } catch (error) {
            console.error('Error recording time out:', error);
            return { success: false, error: error.responseJSON?.error || 'Network error' };
        }
    }

    getAttendanceData() {
        return this.attendanceData;
    }

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

    determineAttendanceStatus(scheduledTime, actualTime) {
        const diffMinutes = this.calculateTimeDifference(scheduledTime, actualTime);
        
        if (diffMinutes >= 30) {
            return 'late'; // Returns: late
        } else {
            return 'present'; // Returns: present
        }
    }

    hasActiveSession() {
        return this.activeSession !== null;
    }

    getActiveSession() {
        return this.activeSession;
    }

    getStats() {
        // Use cached stats if available
        if (this.stats) {
            return {
                total: parseInt(this.stats.total) || 0,
                present: parseInt(this.stats.present) || 0,
                absent: parseInt(this.stats.absent) || 0,
                late: parseInt(this.stats.late) || 0,
                attendanceRate: this.stats.total > 0 ? 
                    Math.round((parseInt(this.stats.completed) / parseInt(this.stats.total)) * 100) : 0
            };
        }

        // Fallback to calculating from data
        const total = this.attendanceData.length;
        const present = this.attendanceData.filter(record => 
            record.status === 'present' && record.timeOut !== 'Pending'
        ).length;
        const late = this.attendanceData.filter(record => 
            record.status === 'late' && record.timeOut !== 'Pending'
        ).length;
        const absent = this.attendanceData.filter(record => 
            record.status === 'absent'
        ).length;
        const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

        return { total, present, absent, late, attendanceRate };
    }

    // Add new record locally without full reload
    addLocalRecord(eventName, timeIn, status) {
        this.attendanceData.unshift({
            date: new Date().toISOString().split('T')[0],
            activity: eventName,
            timeIn: timeIn,
            timeOut: 'Pending',
            status: status, // present, late, or absent
            remarks: 'Active - Time out required'
        });
    }

    // Update existing record locally
    updateLocalRecord(eventName, timeOut) {
        const record = this.attendanceData.find(r => 
            r.activity === eventName && r.timeOut === 'Pending'
        );
        if (record) {
            record.timeOut = timeOut;
            record.remarks = 'Completed';
        }
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
        this.currentScanMode = null;
        this.initializeComponents();
    }

    async initializeComponents() {
        this.scannerManager.init(
            (decodedText) => this.handleScanSuccess(decodedText),
            (error) => this.handleScanError(error)
        );

        // Single load on initialization
        await this.attendanceManager.loadAttendanceRecords();
        
        this.updateAttendanceStats();
        this.populateAttendanceTable();
        this.bindEventListeners();
        this.updateScanButtonState();
    }

    bindEventListeners() {
        $('#timeInBtn').click(() => this.startTimeInScan());
        $('#timeOutBtn').click(() => this.startTimeOutScan());
        $('#stopScanBtn').click(() => this.stopScanning());
        $('#logoutBtn').click(() => this.handleLogout());
    }

    updateScanButtonState() {
        const hasActiveSession = this.attendanceManager.hasActiveSession();
        if (hasActiveSession) {
            $('#timeInBtn').addClass('hidden');
            $('#timeOutBtn').removeClass('hidden');
        } else {
            $('#timeInBtn').removeClass('hidden');
            $('#timeOutBtn').addClass('hidden');
        }
    }

    startTimeInScan() {
        if (this.attendanceManager.hasActiveSession()) {
            alert('You already have an active session. Please time out first.');
            return;
        }

        this.currentScanMode = 'time_in';
        
        $('#scanResult').removeClass('hidden status-success status-error')
                      .addClass('status-info')
                      .text('Initializing camera for Time In...');
        
        $('#qr-reader').removeClass('hidden');
        $('#timeInBtn').addClass('hidden');
        $('#stopScanBtn').removeClass('hidden');
        
        setTimeout(() => {
            this.scannerManager.startScanning();
            $('#scanResult').text('Camera ready. Scan QR code to Time In...');
        }, 500);
    }

    startTimeOutScan() {
        if (!this.attendanceManager.hasActiveSession()) {
            alert('You do not have an active session. Please time in first.');
            return;
        }

        this.currentScanMode = 'time_out';
        
        $('#scanResult').removeClass('hidden status-success status-error')
                      .addClass('status-info')
                      .text('Initializing camera for Time Out...');
        
        $('#qr-reader').removeClass('hidden');
        $('#timeOutBtn').addClass('hidden');
        $('#stopScanBtn').removeClass('hidden');
        
        setTimeout(() => {
            this.scannerManager.startScanning();
            $('#scanResult').text('Camera ready. Scan QR code to Time Out...');
        }, 500);
    }

    stopScanning() {
        this.scannerManager.stopScanning();
        
        $('#qr-reader').addClass('hidden');
        $('#stopScanBtn').addClass('hidden');
        $('#scanResult').removeClass('status-info status-success status-error')
                      .addClass('hidden');
        
        this.updateScanButtonState();
    }

    async handleScanSuccess(decodedText) {
        console.log('QR Code scanned:', decodedText);
        
        this.scannerManager.stopScanning();
        
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
        const activeSession = this.attendanceManager.getActiveSession();
        
        // TIME OUT MODE
        if (this.currentScanMode === 'time_out') {
            if (!activeSession) {
                $('#scanResult').removeClass('status-info status-success')
                              .addClass('status-error')
                              .text('❌ No active session found. Please time in first.');
                
                setTimeout(() => {
                    this.completeScanProcess();
                }, 3000);
                return;
            }

            if (activeSession !== activityName) {
                $('#scanResult').removeClass('status-info status-success')
                              .addClass('status-error')
                              .text(`❌ Wrong QR code! You are timed in to "${activeSession}". Please scan the correct event QR code.`);
                
                setTimeout(() => {
                    this.completeScanProcess();
                }, 4000);
                return;
            }

            $('#scanResult').removeClass('status-info status-error')
                          .addClass('status-success')
                          .text('✅ QR Code detected! Recording time out...');
            
            setTimeout(async () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                const time24 = this.convertTo24Hour(timeString);
                
                const response = await this.attendanceManager.recordTimeOut(activityName, time24);
                
                if (response.success) {
                    $('#scanResult').text(`✅ Time Out recorded at ${timeString} for ${activityName}`);
                    
                    // Update locally without full reload
                    this.attendanceManager.updateLocalRecord(activityName, timeString);
                    
                    this.updateAttendanceStats();
                    this.populateAttendanceTable();
                    this.updateScanButtonState();
                } else {
                    $('#scanResult').removeClass('status-success')
                                  .addClass('status-error')
                                  .text('❌ ' + (response.error || 'Error recording time out'));
                }
                
                setTimeout(() => {
                    this.completeScanProcess();
                }, 2000);
                
            }, 1000);
        } 
        // TIME IN MODE
        else if (this.currentScanMode === 'time_in') {
            if (activeSession) {
                $('#scanResult').removeClass('status-info status-success')
                              .addClass('status-error')
                              .text(`❌ You already have an active session for "${activeSession}". Please time out first.`);
                
                setTimeout(() => {
                    this.completeScanProcess();
                }, 3000);
                return;
            }

            $('#scanResult').removeClass('status-info status-error')
                          .addClass('status-success')
                          .text('✅ QR Code detected! Recording time in...');
            
            setTimeout(async () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                const attendanceStatus = this.attendanceManager.determineAttendanceStatus(
                    scheduledTime, 
                    timeString
                );
                
                const time24 = this.convertTo24Hour(timeString);
                
                const response = await this.attendanceManager.recordTimeIn(
                    activityName, 
                    scheduledTime, 
                    time24,
                    attendanceStatus // This is now just: 'present' or 'late'
                );
                
                if (response.success) {
                    const statusMessage = attendanceStatus === 'late' 
                        ? `⚠️ Time In recorded at ${timeString} (LATE)`
                        : `✅ Time In recorded at ${timeString} (On Time)`;
                    
                    $('#scanResult').text(statusMessage);
                    
                    // Add locally without full reload
                    this.attendanceManager.addLocalRecord(activityName, timeString, attendanceStatus);
                    
                    this.updateAttendanceStats();
                    this.populateAttendanceTable();
                    this.updateScanButtonState();
                } else {
                    $('#scanResult').removeClass('status-success')
                                  .addClass('status-error')
                                  .text('❌ ' + (response.error || 'Error recording time in'));
                }
                
                setTimeout(() => {
                    this.completeScanProcess();
                }, 3000);
                
            }, 1000);
        }
    }

    convertTo24Hour(time12h) {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        
        if (hours === '12') {
            hours = '00';
        }
        
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        
        return `${hours}:${minutes}:00`;
    }

    completeScanProcess() {
        $('#qr-reader').addClass('hidden');
        $('#stopScanBtn').addClass('hidden');
        $('#scanResult').removeClass('status-info status-success status-error')
                      .addClass('hidden');
        
        this.currentScanMode = null;
        this.updateScanButtonState();
    }

    handleScanError(error) {
        $('#scanResult').removeClass('status-info status-success')
                      .addClass('status-error')
                      .text('❌ Camera error occurred. Please try again.');
    }

    parseQRCode(qrText) {
        console.log('Original QR Code content:', qrText);

        if (qrText.includes('SIBONGA')) {
            const parts = qrText.split('-');
            
            if (parts.length >= 3) {
                const activityName = parts.slice(1, -1).join('-');
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
        
        if (data.length === 0) {
            tbody.append('<tr><td colspan="6" style="text-align: center;">No attendance records yet</td></tr>');
            return;
        }

        data.forEach(record => {
            const statusClass = `status-${record.status}`;
            const statusText = record.status.charAt(0).toUpperCase() + record.status.slice(1);
            
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

    async handleLogout() {
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

$(document).ready(function() {
    const uiManager = new UIManager();
    console.log('Student Dashboard initialized successfully');
    getStudent();
});