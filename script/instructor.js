// Instructor Dashboard JavaScript - Database Ready Version
        class InstructorDashboard {
            constructor() {
                this.attendanceData = [];
                this.filteredData = [];
                this.currentTimeframe = 'today';
                this.refreshInterval = null;
                this.isOnline = true;
                
                this.init();
            }

            init() {
                this.setupNavigation();
                this.setupMobileMenu();
                this.setupEventListeners();
                this.setupConnectionMonitoring();
                this.loadAttendanceData();
                this.startAutoRefresh();
            }

            // Navigation Setup
            setupNavigation() {
                const navButtons = document.querySelectorAll('.nav-button');
                const pages = document.querySelectorAll('.page');

                navButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        navButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');

                        pages.forEach(page => page.classList.remove('active'));
                        const targetPage = button.getAttribute('data-page');
                        const targetElement = document.getElementById(targetPage);
                        if (targetElement) {
                            targetElement.classList.add('active');
                        }

                        if (window.innerWidth <= 768) {
                            this.closeMobileSidebar();
                        }
                    });
                });
            }

            // Mobile Menu Setup
            setupMobileMenu() {
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                const sidebar = document.querySelector('.sidebar');
                const mobileOverlay = document.getElementById('mobile-overlay');

                mobileMenuBtn.addEventListener('click', () => {
                    if (sidebar.classList.contains('mobile-open')) {
                        this.closeMobileSidebar();
                    } else {
                        this.openMobileSidebar();
                    }
                });

                mobileOverlay.addEventListener('click', () => this.closeMobileSidebar());

                window.addEventListener('resize', () => {
                    if (window.innerWidth > 768) {
                        this.closeMobileSidebar();
                    }
                });
            }

            openMobileSidebar() {
                document.querySelector('.sidebar').classList.add('mobile-open');
                document.getElementById('mobile-overlay').classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeMobileSidebar() {
                document.querySelector('.sidebar').classList.remove('mobile-open');
                document.getElementById('mobile-overlay').classList.remove('active');
                document.body.style.overflow = '';
            }

            // Event Listeners Setup
            setupEventListeners() {
                // Time frame buttons
                const timeButtons = document.querySelectorAll('.time-btn');
                timeButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        timeButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        this.currentTimeframe = button.getAttribute('data-timeframe');
                        this.filterAndUpdateDisplay();
                    });
                });

                // Search and filter
                document.getElementById('student-search').addEventListener('input', () => {
                    this.filterAndUpdateDisplay();
                });

                document.getElementById('status-filter').addEventListener('change', () => {
                    this.filterAndUpdateDisplay();
                });

                // Refresh button
                document.getElementById('refresh-data').addEventListener('click', () => {
                    this.loadAttendanceData();
                });

                // Export button
                document.getElementById('export-attendance').addEventListener('click', () => {
                    this.exportAttendanceData();
                });

                // Logout handlers
                document.getElementById('confirm-logout').addEventListener('click', () => {
                    window.location.href = "../../index.php";
                });

                document.getElementById('cancel-logout').addEventListener('click', () => {
                    // Go back to home page
                    const navButtons = document.querySelectorAll('.nav-button');
                    const pages = document.querySelectorAll('.page');
                    
                    navButtons.forEach(btn => btn.classList.remove('active'));
                    navButtons[0].classList.add('active');
                    pages.forEach(page => page.classList.remove('active'));
                    document.getElementById('live-attendance').classList.add('active');
                });
            }

            // Connection Monitoring
            setupConnectionMonitoring() {
                const statusElement = document.getElementById('connection-status');
                const statusText = document.getElementById('status-text');

                // Check online status
                const updateConnectionStatus = () => {
                    if (navigator.onLine && this.isOnline) {
                        statusElement.className = 'connection-status connection-online';
                        statusText.textContent = 'Online';
                    } else {
                        statusElement.className = 'connection-status connection-offline';
                        statusText.textContent = 'Offline';
                    }
                };

                window.addEventListener('online', updateConnectionStatus);
                window.addEventListener('offline', updateConnectionStatus);
                updateConnectionStatus();
            }

            // Load Attendance Data from Database
            async loadAttendanceData() {
                try {
                    this.showLoading(true);
                    
                    // Replace this with actual API call to your backend
                    // table
                    const response = await fetch('../../api/get_attendance.php');
                    const data = await response.json();
                    
                    // For now, initialize with empty data (will be populated by real database calls)
                    this.attendanceData = [];
                    
                    this.updateLiveStats();
                    this.filterAndUpdateDisplay();
                    this.isOnline = true;
                    
                } catch (error) {
                    console.error('Failed to load attendance data:', error);
                    this.showNotification('Failed to load attendance data', 'error');
                    this.isOnline = false;
                } finally {
                    this.showLoading(false);
                }
            }

            // Show/Hide Loading State
            showLoading(show) {
                const loadingElement = document.getElementById('loading-state');
                const tableContainer = document.querySelector('.student-list-container');
                
                if (show) {
                    loadingElement.style.display = 'flex';
                    tableContainer.style.opacity = '0.5';
                } else {
                    loadingElement.style.display = 'none';
                    tableContainer.style.opacity = '1';
                }
            }

            // Update Live Statistics
            updateLiveStats() {
                const today = new Date().toDateString();
                const todayData = this.attendanceData.filter(entry => 
                    new Date(entry.timestamp).toDateString() === today
                );

                const totalStudents = new Set(todayData.map(entry => entry.studentId)).size;
                const presentCount = todayData.filter(entry => entry.status === 'present').length;
                const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
                const lastCheckin = this.attendanceData.length > 0 ? 
                    new Date(this.attendanceData[0].timestamp).toLocaleTimeString() : '--:--';

                document.getElementById('total-students').textContent = totalStudents;
                document.getElementById('present-count').textContent = presentCount;
                document.getElementById('attendance-rate').textContent = attendanceRate + '%';
                document.getElementById('last-checkin').textContent = lastCheckin;
            }

            // Filter and Update Display
            filterAndUpdateDisplay() {
                const searchTerm = document.getElementById('student-search').value.toLowerCase();
                const statusFilter = document.getElementById('status-filter').value;

                // Filter by timeframe
                let timeFilteredData = this.attendanceData;
                const now = new Date();

                switch (this.currentTimeframe) {
                    case 'today':
                        timeFilteredData = this.attendanceData.filter(entry => 
                            new Date(entry.timestamp).toDateString() === now.toDateString()
                        );
                        break;
                    case 'this-week':
                        const startOfWeek = new Date(now);
                        startOfWeek.setDate(now.getDate() - now.getDay());
                        timeFilteredData = this.attendanceData.filter(entry => 
                            new Date(entry.timestamp) >= startOfWeek
                        );
                        break;
                    case 'this-month':
                        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                        timeFilteredData = this.attendanceData.filter(entry => 
                            new Date(entry.timestamp) >= startOfMonth
                        );
                        break;
                }

                // Apply additional filters
                this.filteredData = timeFilteredData.filter(entry => {
                    const matchesSearch = entry.name.toLowerCase().includes(searchTerm) ||
                                        entry.studentId.toLowerCase().includes(searchTerm) ||
                                        entry.course.toLowerCase().includes(searchTerm);
                    
                    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
                    
                    return matchesSearch && matchesStatus;
                });

                this.updateStudentList();
            }

            // Update Student List Display
            updateStudentList() {
                const tbody = document.getElementById('student-attendance-list');
                
                if (this.filteredData.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="7" class="empty-state">
                                <div class="empty-state-icon">📄</div>
                                <h3>No attendance records found</h3>
                                <p>Try adjusting your filters or wait for new check-ins</p>
                            </td>
                        </tr>
                    `;
                    return;
                }

                tbody.innerHTML = '';
                
                this.filteredData.forEach(entry => {
                    const row = document.createElement('tr');
                    row.className = 'student-row';
                    if (entry.isNew) {
                        row.classList.add('new-entry');
                        // Remove new flag after animation
                        setTimeout(() => {
                            entry.isNew = false;
                        }, 1000);
                    }

                    const statusClass = `status-${entry.status}`;
                    const statusText = entry.status.charAt(0).toUpperCase() + entry.status.slice(1);

                    row.innerHTML = `
                        <td>${entry.time}</td>
                        <td><strong>${entry.studentId}</strong></td>
                        <td>${entry.name}</td>
                        <td>${entry.course}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>${entry.event}</td>
                        <td>
                            <button onclick="dashboard.viewStudentDetails('${entry.studentId}')" style="padding: 4px 8px; border: 1px solid #0066cc; background: transparent; color: #0066cc; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                View
                            </button>
                        </td>
                    `;
                    
                    tbody.appendChild(row);
                });
            }

            // Add New Attendance Entry (called from external systems)
            addAttendanceEntry(attendanceEntry) {
                // Add timestamp and format data
                const formattedEntry = {
                    id: Date.now(),
                    timestamp: attendanceEntry.timestamp || new Date().toISOString(),
                    time: attendanceEntry.time || new Date().toLocaleTimeString(),
                    studentId: attendanceEntry.studentId,
                    name: attendanceEntry.name,
                    course: attendanceEntry.course,
                    status: attendanceEntry.status || 'present',
                    event: attendanceEntry.event,
                    isNew: true
                };

                // Check for duplicates
                const existingEntry = this.attendanceData.find(entry =>
                    entry.studentId === formattedEntry.studentId &&
                    entry.event === formattedEntry.event &&
                    new Date(entry.timestamp).toDateString() === new Date(formattedEntry.timestamp).toDateString()
                );

                if (existingEntry) {
                    this.showNotification(`${formattedEntry.name} already checked in for ${formattedEntry.event}`, 'error');
                    return false;
                }

                // Add to beginning of array (most recent first)
                this.attendanceData.unshift(formattedEntry);
                
                // Keep only last 1000 entries to prevent memory issues
                if (this.attendanceData.length > 1000) {
                    this.attendanceData = this.attendanceData.slice(0, 1000);
                }

                this.updateLiveStats();
                this.filterAndUpdateDisplay();
                this.showNotification(`${formattedEntry.name} checked in for ${formattedEntry.event}`, 'success');
                
                // Save to database (replace with actual API call)
                this.saveToDatabase(formattedEntry);
                
                return true;
            }

            // Save to Database (replace with actual implementation)
            async saveToDatabase(attendanceEntry) {
                try {
                    // Replace with actual API call
                    // const response = await fetch('../../api/save_attendance.php', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(attendanceEntry)
                    // });
                    
                    console.log('Would save to database:', attendanceEntry);
                } catch (error) {
                    console.error('Failed to save to database:', error);
                }
            }

            // Export Attendance Data
            exportAttendanceData() {
                if (this.filteredData.length === 0) {
                    this.showNotification('No data to export', 'error');
                    return;
                }

                const csvData = [
                    ['Timestamp', 'Time', 'Student ID', 'Name', 'Course', 'Status', 'Event']
                ];

                this.filteredData.forEach(entry => {
                    csvData.push([
                        entry.timestamp,
                        entry.time,
                        entry.studentId,
                        entry.name,
                        entry.course,
                        entry.status,
                        entry.event
                    ]);
                });

                const csvContent = csvData.map(row => 
                    row.map(cell => `"${cell}"`).join(',')
                ).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `attendance-${this.currentTimeframe}-${new Date().toISOString().split('T')[0]}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    this.showNotification('Attendance data exported successfully!', 'success');
                }
            }

            // View Student Details
            viewStudentDetails(studentId) {
                const studentData = this.filteredData.filter(entry => entry.studentId === studentId);
                if (studentData.length === 0) return;

                const student = studentData[0];
                const totalCheckins = studentData.length;
                const latestCheckin = studentData[0]?.time || 'N/A';
                
                alert(`Student Details for ${studentId}:\n\nName: ${student.name}\nCourse: ${student.course}\nTotal Check-ins: ${totalCheckins}\nLatest: ${latestCheckin}`);
            }

            // Auto-refresh functionality
            startAutoRefresh() {
                // Refresh every 30 seconds
                this.refreshInterval = setInterval(() => {
                    if (document.getElementById('live-attendance').classList.contains('active')) {
                        this.loadAttendanceData();
                    }
                }, 30000);
            }

            // Stop auto-refresh
            stopAutoRefresh() {
                if (this.refreshInterval) {
                    clearInterval(this.refreshInterval);
                    this.refreshInterval = null;
                }
            }

            // Notification System
            showNotification(message, type = 'success') {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${type === 'success' ? '#28a745' : '#dc3545'};
                    color: white;
                    padding: 16px 24px;
                    border-radius: 8px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    z-index: 1000;
                    font-weight: 600;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                    word-wrap: break-word;
                `;
                notification.textContent = message;
                
                document.body.appendChild(notification);
                
                // Show notification
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                // Hide and remove notification
                setTimeout(() => {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (document.body.contains(notification)) {
                            document.body.removeChild(notification);
                        }
                    }, 300);
                }, 4000);
            }

            // Cleanup
            destroy() {
                this.stopAutoRefresh();
            }
        }

        // Initialize Dashboard
        let dashboard;
        
        document.addEventListener('DOMContentLoaded', function() {
            dashboard = new InstructorDashboard();
            
            // Handle page visibility change
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    dashboard.stopAutoRefresh();
                } else {
                    dashboard.startAutoRefresh();
                }
            });

            // Cleanup on page unload
            window.addEventListener('beforeunload', function() {
                dashboard.destroy();
            });
        });

        // Global API for external integration
        window.InstructorDashboard = {
            // Add attendance from external systems (e.g., QR scanner)
            addAttendance: function(attendanceData) {
                if (dashboard) {
                    return dashboard.addAttendanceEntry(attendanceData);
                }
                return false;
            },
            
            // Refresh data manually
            refresh: function() {
                if (dashboard) {
                    dashboard.loadAttendanceData();
                }
            },
            
            // Get current attendance data
            getData: function() {
                return dashboard ? dashboard.attendanceData : [];
            },
            
            // Show notification
            notify: function(message, type = 'success') {
                if (dashboard) {
                    dashboard.showNotification(message, type);
                }
            }
        };

        // Example of how to integrate with QR scanning system:
        // When a QR code is scanned in the admin system, call:
   
        // window.InstructorDashboard.addAttendance({
        //     studentId: 'STU-001',
        //     name: 'John Doe',
        //     course: 'BSIT-4A',
        //     event: 'Morning Assembly',
        //     status: 'present'
        // });
        