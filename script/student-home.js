// ATTENDANCE DATA MANAGER
class AttendanceDataManager {
    constructor() {
        this.attendanceData = [];
        this.allRecords = [];
        this.activeSession = null;
        this.stats = null;
        this.isLoading = false;
        this.eventFilters = [];
        this.currentFilter = null;
    }

    async loadAttendanceRecords(forceRefresh = false) {
        if (this.isLoading && !forceRefresh) {
            return { success: true, cached: true };
        }

        this.isLoading = true;
        
        try {
            const response = await $.ajax({
                url: '../../sql_php/get_attendance_records.php',
                type: 'GET',
                dataType: 'json',
                timeout: 10000,
                cache: false
            });

            console.log('API Response:', response);

            if (response && response.success) {
                // Store all records
                this.allRecords = response.records.map(record => ({
                    dateTime: record.date_time_formatted,
                    activity: record.event_name,
                    description: record.description,
                    scheduledTime: record.scheduled_time,
                    timeIn: record.time_in,
                    timeOut: record.time_out,
                    status: record.status,
                    remarks: record.remarks,
                    isActive: record.is_active
                }));

                // Extract unique event descriptions for filtering
                this.eventFilters = response.event_filters || [];

                this.attendanceData = [...this.allRecords];

                if (response.active_session) {
                    if (typeof response.active_session === 'object') {
                        this.activeSession = response.active_session.event_name;
                    } else {
                        this.activeSession = response.active_session;
                    }
                } else {
                    this.activeSession = null;
                }
                
                this.stats = response.stats;
                
                console.log('✅ Loaded records:', this.attendanceData.length);
                console.log('✅ Available filters:', this.eventFilters);
                console.log('✅ Active session:', this.activeSession);
                
                this.isLoading = false;
                return response;
            } else {
                console.error('API returned error:', response.error);
                this.isLoading = false;
                return response;
            }
        } catch (error) {
            console.error('Error loading attendance records:', error);
            this.isLoading = false;
            
            return { 
                success: false, 
                error: error.responseJSON?.error || error.statusText || 'Network error',
                details: {
                    status: error.status,
                    statusText: error.statusText,
                    responseText: error.responseText
                }
            };
        }
    }

    // Filter records by event description
    filterByDescription(description) {
        if (!description || description === 'all') {
            this.attendanceData = [...this.allRecords];
            this.currentFilter = null;
        } else {
            this.attendanceData = this.allRecords.filter(record => 
                record.description === description
            );
            this.currentFilter = description;
        }
        
        console.log('🔍 Filtered to', this.attendanceData.length, 'records');
        return this.attendanceData;
    }

    getAvailableFilters() {
        return this.eventFilters;
    }

    getCurrentFilter() {
        return this.currentFilter;
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
                    remarks: remarks
                }
            });

            if (response.success) {
                this.activeSession = eventName;
                console.log('✅ Time In recorded:', eventName);
            } else {
                console.error('❌ Time In failed:', response.error);
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

            if (response.success) {
                this.activeSession = null;
                console.log('✅ Time Out recorded:', eventName);
            } else {
                console.error('❌ Time Out failed:', response.error);
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
            if (!timeStr) return 0;
            const [time, period] = timeStr.trim().split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };

        try {
            const scheduledMinutes = parseTime(scheduledTime);
            const actualMinutes = parseTime(actualTime);
            const diff = actualMinutes - scheduledMinutes;
            console.log('⏰ Time diff:', scheduledTime, 'vs', actualTime, '=', diff, 'minutes');
            return diff;
        } catch (error) {
            console.error('Error parsing time:', error);
            return 0;
        }
    }

    // FIX: LATE DETECTION - Only mark late if 30+ minutes AFTER scheduled time
    determineAttendanceStatus(scheduledTime, actualTime) {
        if (!scheduledTime || scheduledTime === 'N/A') {
            console.log('📝 No scheduled time, marking as PRESENT');
            return 'present';
        }

        const diffMinutes = this.calculateTimeDifference(scheduledTime, actualTime);
        
        // ONLY mark LATE if 30 or more minutes AFTER scheduled time
        if (diffMinutes >= 30) {
            console.log('⚠️ LATE: Arrived', diffMinutes, 'minutes after scheduled time');
            return 'late';
        } else if (diffMinutes >= 0) {
            console.log('✅ PRESENT: Arrived on time or early (', diffMinutes, 'min before)');
            return 'present';
        } else {
            console.log('✅ PRESENT: Early arrival');
            return 'present';
        }
    }

    hasActiveSession() {
        return this.activeSession !== null && this.activeSession !== undefined;
    }

    getActiveSession() {
        return this.activeSession;
    }

    getStats() {
        if (this.stats) {
            return {
                total: parseInt(this.stats.total) || 0,
                present: parseInt(this.stats.present) || 0,
                absent: parseInt(this.stats.absent) || 0,
                late: parseInt(this.stats.late) || 0,
                pending: parseInt(this.stats.pending) || 0,
                attendanceRate: this.stats.completion_rate || 0
            };
        }

        const total = this.attendanceData.length;
        const present = this.attendanceData.filter(record => 
            record.status === 'present'
        ).length;
        const late = this.attendanceData.filter(record => 
            record.status === 'late'
        ).length;
        const absent = this.attendanceData.filter(record => 
            record.status === 'absent'
        ).length;
        const pending = this.attendanceData.filter(record => 
            record.status === 'pending'
        ).length;
        const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

        return { total, present, absent, late, pending, attendanceRate };
    }

    addLocalRecord(eventName, timeIn, status, dateTimeFormatted, scheduledTime) {
        this.attendanceData.unshift({
            dateTime: dateTimeFormatted,
            activity: eventName,
            description: 'N/A',
            scheduledTime: scheduledTime,
            timeIn: timeIn,
            timeOut: 'Pending',
            status: status,
            remarks: 'Active - Time out required',
            isActive: true
        });
    }

    updateLocalRecord(eventName, timeOut) {
        const record = this.attendanceData.find(r => 
            r.activity === eventName && r.timeOut === 'Pending'
        );
        if (record) {
            record.timeOut = timeOut;
            record.remarks = 'Completed Attendance';
            record.isActive = false;
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
                console.log('📱 QR Code detected:', decodedText);
                this.stopScanning();
                if (this.onScanSuccess) {
                    this.onScanSuccess(decodedText, decodedResult);
                }
            },
            (error) => {
                if (!error.includes('QR code parse error') && 
                    !error.includes('No QR code found')) {
                    console.warn('⚠️ QR Code scan error:', error);
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
                console.log("✅ QR Code scanner cleared");
            }).catch(error => {
                console.error("❌ Failed to clear QR Code scanner:", error);
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

        console.log('📊 Loading attendance records...');
        const result = await this.attendanceManager.loadAttendanceRecords(true);
        
        console.log('Load result:', result);
        
        if (result && result.success) {
            console.log('✅ Attendance records loaded successfully');
            this.setupFilterDropdown();
            this.updateAttendanceStats();
            this.populateAttendanceTable();
        } else {
            console.error('❌ Failed to load attendance records:', result);
            
            let errorMsg = 'Error loading attendance records. ';
            if (result && result.details) {
                errorMsg += `Status: ${result.details.status || 'unknown'}. `;
            }
            
            $('#attendanceTableBody').html(
                `<tr><td colspan="6" style="text-align: center; color: red;">` +
                errorMsg +
                `<br><button onclick="location.reload()" style="margin-top: 10px;">Refresh Page</button>` +
                `</td></tr>`
            );
        }
        
        this.bindEventListeners();
        this.updateScanButtonState();
    }

    setupFilterDropdown() {
        const filters = this.attendanceManager.getAvailableFilters();
        const filterContainer = $('#filterContainer');
        
        if (filterContainer.length === 0 || filters.length === 0) {
            console.log('No filters available');
            filterContainer.html('<span style="color: #666;">No event types available</span>');
            return;
        }

        let filterHTML = '<select id="eventFilter" class="filter-select"><option value="all">All Events</option>';
        
        filters.forEach(filter => {
            filterHTML += `<option value="${filter}">${filter}</option>`;
        });
        
        filterHTML += '</select>';
        filterContainer.html(filterHTML);

        $('#eventFilter').on('change', (e) => {
            const selectedFilter = $(e.target).val();
            console.log('🔍 Applying filter:', selectedFilter);
            this.attendanceManager.filterByDescription(selectedFilter);
            this.updateAttendanceStats();
            this.populateAttendanceTable();
        });
    }

    bindEventListeners() {
        $('#timeInBtn').click(() => this.startTimeInScan());
        $('#timeOutBtn').click(() => this.startTimeOutScan());
        $('#stopScanBtn').click(() => this.stopScanning());
        $('#logoutBtn').click(() => this.handleLogout());
        $('#exportPdfBtn').click(() => this.exportToCSV());
    }

    updateScanButtonState() {
        const hasActiveSession = this.attendanceManager.hasActiveSession();
        console.log('🔍 Has active session:', hasActiveSession);
        
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
        
        this.currentScanMode = null;
        this.updateScanButtonState();
    }

    async handleScanSuccess(decodedText) {
        console.log('✅ QR Code scanned:', decodedText);
        
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
                    const finalStatus = response.remarks || 'present';
                    $('#scanResult').text(`✅ Time Out recorded at ${timeString} - Status: ${finalStatus.toUpperCase()}`);
                    
                    this.attendanceManager.updateLocalRecord(activityName, timeString);
                    
                    // REFRESH DATA FROM DATABASE
                    setTimeout(() => {
                        this.attendanceManager.loadAttendanceRecords(true).then(() => {
                            this.updateAttendanceStats();
                            this.populateAttendanceTable();
                            this.updateScanButtonState();
                        });
                    }, 1000);
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
                    attendanceStatus
                );
                
                if (response.success) {
                    const statusMessage = attendanceStatus === 'late' 
                        ? `⚠️ Time In recorded at ${timeString} (LATE - 30+ minutes)`
                        : `✅ Time In recorded at ${timeString} (On Time)`;
                    
                    $('#scanResult').text(statusMessage);
                    
                    // Format: "11/22/25-4:37 PM" (date-scheduledTime)
                    const dateTimeFormatted = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear().toString().slice(-2)}-${scheduledTime}`;
                    
                    this.attendanceManager.addLocalRecord(activityName, timeString, attendanceStatus, dateTimeFormatted, scheduledTime);
                    
                    // REFRESH DATA FROM DATABASE
                    setTimeout(() => {
                        this.attendanceManager.loadAttendanceRecords(true).then(() => {
                            this.updateAttendanceStats();
                            this.populateAttendanceTable();
                            this.updateScanButtonState();
                        });
                    }, 1000);
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
        
        hours = parseInt(hours, 10);
        
        if (hours === 12) {
            hours = modifier === 'AM' ? 0 : 12;
        } else if (modifier === 'PM') {
            hours += 12;
        }
        
        return `${String(hours).padStart(2, '0')}:${minutes}:00`;
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
        console.log('🔍 Parsing QR Code:', qrText);

        if (qrText.includes('SIBONGA')) {
            const parts = qrText.split('-');
            
            if (parts.length >= 3) {
                const activityName = parts.slice(1, -1).join('-');
                const scheduledTime = parts[parts.length - 1];
                
                console.log('✅ Extracted Activity:', activityName);
                console.log('✅ Scheduled Time:', scheduledTime);
                
                return {
                    activityName: activityName,
                    scheduledTime: scheduledTime
                };
            }
        }
        
        return null;
    }

    // EXPORT TO CSV (Changed from PDF)
    exportToCSV() {
        const currentFilter = this.attendanceManager.getCurrentFilter();
        let url = '../../sql_php/export_attendance_pdf.php?type=filtered';
        
        if (currentFilter) {
            url += '&filter=' + encodeURIComponent(currentFilter);
        }
        
        console.log('📥 Exporting to CSV with filter:', currentFilter);
        window.location.href = url;
    }

    updateAttendanceStats() {
        const stats = this.attendanceManager.getStats();
        
        console.log('📊 Updating stats:', stats);
        
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
        
        console.log('📋 Populating table with records:', data.length);
        
        if (data.length === 0) {
            tbody.append('<tr><td colspan="6" style="text-align: center;">No attendance records found</td></tr>');
            return;
        }

        // REMARKS: Show DB value with badge styling
        const remarksBadgeConfig = {
            'present': 'status-present',
            'late': 'status-late',
            'absent': 'status-absent',
            'pending': 'status-pending'
        };

        // STATUS TEXT CUSTOMIZATION - Based on remarks from DB
        const statusTextConfig = {
            'present': 'Completed Attendance',
            'late': 'Arrive 30+ minutes late',
            'absent': 'Failed to Attend',
            'pending': 'Active - Time out required'
        };

        data.forEach(record => {
            // Get badge class for remarks
            const remarksBadgeClass = remarksBadgeConfig[record.status] || 'status-present';
            
            // Get custom status text based on database remarks
            const statusText = statusTextConfig[record.status] || record.remarks;
            
            const timeOutDisplay = record.timeOut === 'Pending' 
                ? '<strong style="color: #ffc107;">⏳ Pending</strong>' 
                : record.timeOut;
            
            // Format Date and Time Started column to show scheduledTime
            const dateTimeDisplay = record.scheduledTime && record.scheduledTime !== 'N/A'
                ? `${record.dateTime.split('-')[0]}-<strong style="color: #007bff;">${record.scheduledTime}</strong>`
                : record.dateTime;
            
            const row = `
                <tr ${record.isActive ? 'style="background-color: #fff3cd;"' : ''}>
                    <td>${dateTimeDisplay}</td>
                    <td>${record.activity}</td>
                    <td>${record.timeIn || 'N/A'}</td>
                    <td>${timeOutDisplay}</td>
                    <td><span class="status-badge ${remarksBadgeClass}">${record.remarks}</span></td>
                    <td>${statusText}</td>
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
        cache: false,
        success: function(response) {
            if (response.success) {
                const student = response.student;
                
                $('.user-name').text(student.first_name + ' ' + student.last_name);
                $('.user-id').eq(0).text('ID: ' + student.student_id);
                $('.user-set').text('Year & Set: ' + student.year_level + getYearSuffix(student.year_level) + '-' + student.student_set);
                $('.user-course').text('Course: ' + student.course);
                $('.user-sex').text('Sex: ' + student.sex);
                
                console.log('✅ Student loaded:', response.student);
                return response.student;
            } else {
                console.error('❌ Error:', response.error);
                $('.user-name').text('Error loading student');
                $('.user-id').eq(0).text('Error: ' + response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('❌ AJAX Error:', error);
            $('.user-name').text('Connection Error');
            $('.user-id').eq(0).text('Failed to connect to server');
        }
    });
}

$(document).ready(function() {
    console.log('🎯 Initializing Student Dashboard...');
    const uiManager = new UIManager();
    console.log('✅ Student Dashboard initialized successfully');
    getStudent();
});