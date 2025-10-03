// Instructor Dashboard JavaScript - Integrated Version with Database Support
class InstructorDashboard {
    constructor() {
        this.attendanceData = [];
        this.filteredData = [];
        this.currentTimeframe = 'today';
        this.refreshInterval = null;
        this.isOnline = true;
        this.lastUpdate = null;
        this.apiBaseUrl = '../../api';
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupEventListeners();
        this.setupConnectionMonitoring();
        this.loadAttendanceData(); // Initial load from database
        this.startAutoRefresh(); // Start auto-refresh
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

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                if (sidebar.classList.contains('mobile-open')) {
                    this.closeMobileSidebar();
                } else {
                    this.openMobileSidebar();
                }
            });
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => this.closeMobileSidebar());
        }

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
                this.loadAttendanceData(); // Reload with new timeframe
            });
        });

        // Search and filter
        const searchInput = document.getElementById('student-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterAndUpdateDisplay();
            });
        }

        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterAndUpdateDisplay();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.showNotification('Refreshing data...', 'success');
                this.loadAttendanceData();
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-attendance');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportAttendanceData();
            });
        }

        // Logout handlers
        const confirmLogout = document.getElementById('confirm-logout');
        if (confirmLogout) {
            confirmLogout.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        const cancelLogout = document.getElementById('cancel-logout');
        if (cancelLogout) {
            cancelLogout.addEventListener('click', () => {
                // Go back to home page
                const navButtons = document.querySelectorAll('.nav-button');
                const pages = document.querySelectorAll('.page');
                
                navButtons.forEach(btn => btn.classList.remove('active'));
                navButtons[0].classList.add('active');
                pages.forEach(page => page.classList.remove('active'));
                document.getElementById('live-attendance').classList.add('active');
            });
        }
    }

    // Enhanced Logout Handler
    async handleLogout() {
        try {
            const confirmBtn = document.getElementById('confirm-logout');
            const originalText = confirmBtn.textContent;
            confirmBtn.textContent = 'Logging out...';
            confirmBtn.disabled = true;

            // Call logout API
            const response = await fetch('../../sql_php/logout.php', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Logged out successfully!', 'success');
                
                // Fade out and redirect
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = result.redirect || '../../index.php';
                }, 500);
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Logout failed. Please try again.', 'error');
            const confirmBtn = document.getElementById('confirm-logout');
            if (confirmBtn) {
                confirmBtn.textContent = 'Yes, Logout';
                confirmBtn.disabled = false;
            }
        }
    }

    // Connection Monitoring
    setupConnectionMonitoring() {
        const statusElement = document.getElementById('connection-status');
        const statusText = document.getElementById('status-text');

        if (!statusElement || !statusText) return;

        const updateConnectionStatus = () => {
            if (navigator.onLine && this.isOnline) {
                statusElement.className = 'connection-status connection-online';
                statusText.textContent = 'Online';
            } else {
                statusElement.className = 'connection-status connection-offline';
                statusText.textContent = 'Offline';
            }
        };

        window.addEventListener('online', () => {
            this.isOnline = true;
            updateConnectionStatus();
            this.showNotification('Connection restored', 'success');
            this.loadAttendanceData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            updateConnectionStatus();
            this.showNotification('Connection lost', 'error');
        });
        
        updateConnectionStatus();
    }

    // Load Attendance Data from Database with Real-time Updates
    async loadAttendanceData() {
        try {
            this.showLoading(true);
            
            const searchTerm = document.getElementById('student-search')?.value || '';
            const statusFilter = document.getElementById('status-filter')?.value || 'all';
            
            const params = new URLSearchParams({
                timeframe: this.currentTimeframe,
                status: statusFilter,
                search: searchTerm
            });

            const apiUrl = `${this.apiBaseUrl}/get_attendance.php?${params}`;
            console.log('Fetching from:', apiUrl); // Debug

            const response = await fetch(apiUrl);
            console.log('Response status:', response.status); // Debug
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Data received:', result); // Debug
            
            if (result.success) {
                // Check for new entries
                const oldIds = new Set(this.attendanceData.map(entry => entry.id));
                const newEntries = result.data.filter(entry => !oldIds.has(entry.id));
                
                // Mark new entries for animation
                newEntries.forEach(entry => {
                    entry.isNew = true;
                });
                
                this.attendanceData = result.data;
                this.lastUpdate = result.timestamp;
                
                console.log('Loaded records:', this.attendanceData.length); // Debug
                
                this.updateLiveStats(result.stats);
                this.filterAndUpdateDisplay();
                this.isOnline = true;
                
                // Show notification for new check-ins (only if not initial load)
                if (newEntries.length > 0 && oldIds.size > 0) {
                    const names = newEntries.slice(0, 3).map(e => e.name).join(', ');
                    const message = newEntries.length === 1 
                        ? `${names} just checked in!`
                        : newEntries.length <= 3
                        ? `${names} just checked in!`
                        : `${newEntries.length} new check-ins!`;
                    this.showNotification(message, 'success');
                }
                
            } else {
                throw new Error(result.message || 'Failed to load data');
            }
            
        } catch (error) {
            console.error('Failed to load attendance data:', error);
            this.showNotification('Failed to load attendance data. Check console for details.', 'error');
            this.isOnline = false;
        } finally {
            this.showLoading(false);
        }
    }

    // Show/Hide Loading State
    showLoading(show) {
        const loadingElement = document.getElementById('loading-state');
        const tableContainer = document.querySelector('.student-list-container');
        
        if (loadingElement && tableContainer) {
            if (show) {
                loadingElement.style.display = 'flex';
                tableContainer.style.opacity = '0.5';
            } else {
                loadingElement.style.display = 'none';
                tableContainer.style.opacity = '1';
            }
        }
    }

    // Update Live Statistics
    updateLiveStats(stats) {
        if (!stats) return;
        
        const elements = {
            'total-students': stats.totalStudents,
            'present-count': stats.presentCount,
            'attendance-rate': stats.attendanceRate + '%',
            'last-checkin': stats.lastCheckin
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                // Animate number changes
                if (element.textContent !== String(value)) {
                    element.style.transition = 'transform 0.2s ease';
                    element.style.transform = 'scale(1.1)';
                    element.textContent = value;
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        });
    }

    // Filter and Update Display
    filterAndUpdateDisplay() {
        const searchTerm = document.getElementById('student-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('status-filter')?.value || 'all';

        this.filteredData = this.attendanceData.filter(entry => {
            const matchesSearch = !searchTerm || 
                entry.name.toLowerCase().includes(searchTerm) ||
                String(entry.studentId).toLowerCase().includes(searchTerm) ||
                entry.course.toLowerCase().includes(searchTerm);
            
            const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

        this.updateStudentList();
    }

    // Update Student List Display
    updateStudentList() {
        const tbody = document.getElementById('student-attendance-list');
        
        if (!tbody) return;

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
            row.dataset.entryId = entry.id;
            
            if (entry.isNew) {
                row.classList.add('new-entry');
                setTimeout(() => {
                    entry.isNew = false;
                    row.classList.remove('new-entry');
                }, 2000);
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
                    <button onclick="dashboard.viewStudentDetails('${entry.studentId}')" 
                        style="padding: 4px 8px; border: 1px solid #0066cc; background: transparent; 
                        color: #0066cc; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        View
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // Add New Attendance Entry (from external QR scan system)
    addAttendanceEntry(attendanceEntry) {
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

        // Add to beginning of array
        this.attendanceData.unshift(formattedEntry);
        
        // Keep only last 1000 entries
        if (this.attendanceData.length > 1000) {
            this.attendanceData = this.attendanceData.slice(0, 1000);
        }

        this.filterAndUpdateDisplay();
        this.showNotification(`${formattedEntry.name} checked in for ${formattedEntry.event}`, 'success');
        
        // Reload from database to sync
        setTimeout(() => this.loadAttendanceData(), 1000);
        
        return true;
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
            URL.revokeObjectURL(url);
            
            this.showNotification('Attendance data exported successfully!', 'success');
        }
    }

    // View Student Details
    viewStudentDetails(studentId) {
        const studentData = this.filteredData.filter(entry => entry.studentId == studentId);
        if (studentData.length === 0) return;

        const student = studentData[0];
        const totalCheckins = studentData.length;
        const latestCheckin = studentData[0]?.time || 'N/A';
        
        alert(`Student Details for ${studentId}:\n\nName: ${student.name}\nCourse: ${student.course}\nTotal Check-ins: ${totalCheckins}\nLatest: ${latestCheckin}`);
    }

    // Auto-refresh functionality (every 10 seconds)
    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            if (document.getElementById('live-attendance')?.classList.contains('active')) {
                console.log('Auto-refreshing attendance data...'); // Debug
                this.loadAttendanceData();
            }
        }, 10000); // Update every 10 seconds
    }

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Enhanced Notification System
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const icon = type === 'success' ? '✓' : '✕';
        const bgColor = type === 'success' ? '#28a745' : '#dc3545';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        notification.innerHTML = `<span style="font-size: 18px;">${icon}</span><span>${message}</span>`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
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
            dashboard.loadAttendanceData();
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