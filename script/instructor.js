// Instructor Dashboard JavaScript - Updated Version
class InstructorDashboard {
    constructor() {
        this.attendanceData = [];
        this.filteredData = [];
        this.currentTimeframe = 'today';
        this.refreshInterval = null;
        this.lastUpdate = null;
        this.apiBaseUrl = '../../api';
        this.previousDataHash = '';
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupEventListeners();
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
                this.exportToExcel();
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

            const response = await fetch('../../sql_php/log_out.php', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Logged out successfully!', 'success');
                
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

    // Create hash for data comparison
    createDataHash(data) {
        return JSON.stringify(data.map(item => item.id + item.timestamp));
    }

    // Load Attendance Data from Database
    async loadAttendanceData() {
        try {
            this.showLoading(true);
            
            const searchTerm = document.getElementById('student-search')?.value || '';
            const statusFilter = document.getElementById('status-filter')?.value || 'all';
            
            const params = new URLSearchParams({
                status: statusFilter,
                search: searchTerm
            });

            const apiUrl = `${this.apiBaseUrl}/get_attendance.php?${params}`;

            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const newHash = this.createDataHash(result.data);
                
                // Only update if data actually changed
                if (newHash !== this.previousDataHash) {
                    this.attendanceData = result.data;
                    this.previousDataHash = newHash;
                    this.lastUpdate = result.timestamp;
                    
                    this.updateLiveStats(result.stats);
                    this.filterAndUpdateDisplay();
                }
                
            } else {
                throw new Error(result.message || 'Failed to load data');
            }
            
        } catch (error) {
            console.error('Failed to load attendance data:', error);
            this.showNotification('Failed to load attendance data.', 'error');
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
            } else {
                loadingElement.style.display = 'none';
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
            if (element && element.textContent !== String(value)) {
                element.textContent = value;
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
                    <td colspan="9" class="empty-state">
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

            const statusClass = `status-${entry.status}`;
            const statusText = entry.status.charAt(0).toUpperCase() + entry.status.slice(1);
            
            // Format time in and time out
            const timeIn = entry.timeIn ? this.formatTime(entry.timeIn) : 'N/A';
            const timeOut = entry.timeOut ? this.formatTime(entry.timeOut) : '--:--';

            row.innerHTML = `
                <td>${entry.time}</td>
                <td><strong>${entry.studentId}</strong></td>
                <td>${entry.name}</td>
                <td>${entry.course}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${entry.event}</td>
                <td>${timeIn}</td>
                <td>${timeOut}</td>
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

    // Helper function to format time
    formatTime(timeString) {
        if (!timeString) return 'N/A';
        
        // If it's already formatted (contains AM/PM), return as is
        if (timeString.includes('AM') || timeString.includes('PM')) {
            return timeString;
        }
        
        // Parse time string (format: HH:MM:SS)
        const timeParts = timeString.split(':');
        if (timeParts.length < 2) return timeString;
        
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes} ${ampm}`;
    }

    // Export to Excel with better formatting
    exportToExcel() {
        if (this.filteredData.length === 0) {
            this.showNotification('No data to export', 'error');
            return;
        }

        // Create HTML table for Excel
        let html = `
            <html xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="UTF-8">
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th { background-color: #0066cc; color: white; font-weight: bold; 
                         padding: 12px; border: 1px solid #ddd; text-align: left; }
                    td { padding: 10px; border: 1px solid #ddd; }
                    .present { background-color: #d4edda; color: #155724; }
                    .late { background-color: #fff3cd; color: #856404; }
                    .absent { background-color: #f8d7da; color: #721c24; }
                    tr:nth-child(even) { background-color: #f8f9fa; }
                    h2 { color: #0066cc; font-family: Arial, sans-serif; }
                    .header-info { margin-bottom: 20px; color: #666; }
                </style>
            </head>
            <body>
                <h2>Live Attendance Report</h2>
                <div class="header-info">
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Total Records:</strong> ${this.filteredData.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Course/Year</th>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.filteredData.forEach(entry => {
            const timeIn = entry.timeIn ? this.formatTime(entry.timeIn) : 'N/A';
            const timeOut = entry.timeOut ? this.formatTime(entry.timeOut) : 'N/A';
            
            html += `
                <tr>
                    <td>${entry.studentId}</td>
                    <td>${entry.name}</td>
                    <td>${entry.course}</td>
                    <td>${entry.event}</td>
                    <td>${entry.date}</td>
                    <td>${timeIn}</td>
                    <td>${timeOut}</td>
                    <td class="${entry.status}">${entry.status.toUpperCase()}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Attendance_Report_${new Date().toISOString().split('T')[0]}.xls`;
        link.click();
        
        this.showNotification('Attendance data exported successfully!', 'success');
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

    // Auto-refresh every 15 seconds (reduced to prevent flickering)
    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            if (document.getElementById('live-attendance')?.classList.contains('active')) {
                this.loadAttendanceData();
            }
        }, 15000);
    }

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

    destroy() {
        this.stopAutoRefresh();
    }
}

// Class Management Module for Instructor Dashboard
// Add this to instructor.js or create as separate module

class ClassManagement {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.studentsData = [];
        this.filteredData = [];
        this.instructorInfo = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadClassStudents();
    }

    attachEventListeners() {
        // Search input
        const searchInput = document.getElementById('class-student-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchStudents(e.target.value);
            });
        }

        // Sort select
        const sortSelect = document.getElementById('class-sort-students');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortStudents(e.target.value);
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('class-refresh-students');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.dashboard.showNotification('Refreshing student list...', 'success');
                this.loadClassStudents();
            });
        }

        // Export button
        const exportBtn = document.getElementById('class-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportClassList();
            });
        }

        // Modal close buttons
        document.getElementById('class-close-details-modal')?.addEventListener('click', () => {
            this.closeDetailsModal();
        });
        
        document.getElementById('class-close-details-btn')?.addEventListener('click', () => {
            this.closeDetailsModal();
        });

        // Export student report
        document.getElementById('class-export-student-report')?.addEventListener('click', () => {
            this.exportStudentReport();
        });
    }

    async loadClassStudents() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const tbody = document.getElementById('class-students-table-body');
        
        if (!tbody) {
            this.isLoading = false;
            return;
        }
        
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                    <div class="loading-spinner" style="margin: 0 auto 10px;"></div>
                    <p>Loading students from database...</p>
                </td>
            </tr>
        `;
        
        try {
            const response = await fetch('../../api/get_class_students.php');
            const result = await response.json();
            
            if (result.success) {
                this.studentsData = result.data;
                this.instructorInfo = result.instructor;
                this.updateInfoBadge();
                this.renderStudentsTable();
                this.updateStats();
                this.dashboard.showNotification(`Loaded ${result.total} students successfully`, 'success');
            } else {
                throw new Error(result.message || 'Failed to load students');
            }
        } catch (error) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="padding: 40px; text-align: center; color: #dc3545;">
                        <p style="font-size: 18px; margin-bottom: 10px;">Error Loading Students</p>
                        <p style="margin-bottom: 15px;">${error.message}</p>
                        <button class="btn" onclick="classManagement.loadClassStudents()">Retry</button>
                    </td>
                </tr>
            `;
            this.dashboard.showNotification('Failed to load students', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    updateInfoBadge() {
        const badge = document.getElementById('class-info-badge');
        if (badge && this.instructorInfo) {
            const position = this.instructorInfo.position || '';
            const isDean = position.toLowerCase().includes('dean');
            
            if (isDean) {
                badge.textContent = `${this.instructorInfo.department} - All Year Levels`;
            } else {
                badge.textContent = `${this.instructorInfo.department} - ${this.instructorInfo.yearLevel}`;
            }
        }
    }

    renderStudentsTable(data = null) {
        const displayData = data || this.studentsData;
        const tbody = document.getElementById('class-students-table-body');
        
        if (!tbody) return;
        
        if (displayData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                        <p style="font-size: 18px; margin-bottom: 10px;">No students found</p>
                        <p>No students are assigned to your class yet</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = displayData.map(student => {
            const attendanceCount = student.attendanceCount || 0;
            const totalEvents = this.getTotalEvents();
            const attendanceRate = totalEvents > 0 ? Math.round((attendanceCount / totalEvents) * 100) : (attendanceCount > 0 ? 100 : 0);
            const statusColor = student.status === 'Active' ? '#28a745' : '#dc3545';
            
            return `
                <tr style="transition: background-color 0.2s;">
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.id}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 500;">${student.name}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.set}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.year}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.course}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="flex: 1; background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="width: ${attendanceRate}%; height: 100%; background: #0066cc; transition: width 0.3s;"></div>
                            </div>
                            <span style="font-size: 12px; font-weight: 600;">${attendanceCount} events</span>
                        </div>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">
                        <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            ${student.status}
                        </span>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                        <button class="btn" style="font-size: 11px; padding: 6px 10px;" 
                                onclick="classManagement.viewStudentDetails('${student.id}')">
                            View Details
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateStats() {
        const totalStudents = this.studentsData.length;
        const activeStudents = this.studentsData.filter(s => s.status === 'Active').length;
        
        let totalAttendanceEvents = 0;
        this.studentsData.forEach(student => {
            totalAttendanceEvents += (student.attendanceCount || 0);
        });
        
        const avgAttendance = totalStudents > 0 ? Math.round(totalAttendanceEvents / totalStudents) : 0;
        
        const totalEl = document.getElementById('class-total-students-count');
        const activeEl = document.getElementById('class-active-students-count');
        const avgEl = document.getElementById('class-avg-attendance');
        
        if (totalEl) totalEl.textContent = totalStudents;
        if (activeEl) activeEl.textContent = activeStudents;
        if (avgEl) avgEl.textContent = avgAttendance + ' events';
    }

    getTotalEvents() {
        const uniqueEvents = new Set();
        this.studentsData.forEach(student => {
            if (student.attendance) {
                student.attendance.forEach(record => {
                    uniqueEvents.add(record.event);
                });
            }
        });
        return uniqueEvents.size || 1;
    }

    searchStudents(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.renderStudentsTable();
            return;
        }
        
        const filtered = this.studentsData.filter(student => {
            return student.id.toLowerCase().includes(searchTerm) ||
                   student.name.toLowerCase().includes(searchTerm) ||
                   student.set.toLowerCase().includes(searchTerm) ||
                   student.year.toLowerCase().includes(searchTerm) ||
                   student.course.toLowerCase().includes(searchTerm);
        });
        
        this.renderStudentsTable(filtered);
    }

    sortStudents(sortType) {
        let sorted = [...this.studentsData];
        
        switch(sortType) {
            case 'id-asc':
                sorted.sort((a, b) => a.id.localeCompare(b.id));
                break;
            case 'id-desc':
                sorted.sort((a, b) => b.id.localeCompare(a.id));
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'attendance-high':
                sorted.sort((a, b) => (b.attendanceCount || 0) - (a.attendanceCount || 0));
                break;
            case 'attendance-low':
                sorted.sort((a, b) => (a.attendanceCount || 0) - (b.attendanceCount || 0));
                break;
        }
        
        this.renderStudentsTable(sorted);
        this.dashboard.showNotification('Students sorted', 'success');
    }

    viewStudentDetails(studentId) {
        const student = this.studentsData.find(s => s.id === studentId);
        if (!student) return;
        
        document.getElementById('class-detail-student-id').textContent = student.id;
        document.getElementById('class-detail-student-name').textContent = student.name;
        document.getElementById('class-detail-student-set').textContent = student.set;
        document.getElementById('class-detail-student-year').textContent = student.year;
        
        const totalEvents = this.getTotalEvents();
        const attended = student.attendanceCount || 0;
        const attendanceRate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : (attended > 0 ? 100 : 0);
        
        document.getElementById('class-detail-total-events').textContent = totalEvents;
        document.getElementById('class-detail-attended').textContent = attended;
        document.getElementById('class-detail-attendance-rate').textContent = attendanceRate + '%';
        
        const historyBody = document.getElementById('class-attendance-history-body');
        if (!student.attendance || student.attendance.length === 0) {
            historyBody.innerHTML = `
                <tr>
                    <td colspan="4" style="padding: 20px; text-align: center; color: #666;">
                        No attendance records found for this student
                    </td>
                </tr>
            `;
        } else {
            historyBody.innerHTML = student.attendance.map(record => `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${record.date}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${record.event}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${record.time}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                        <span style="
                            background: ${record.status === 'Present' ? '#28a745' : record.status === 'Late' ? '#ff9800' : '#dc3545'}; 
                            color: white; 
                            padding: 4px 12px; 
                            border-radius: 4px; 
                            font-size: 12px;
                            display: inline-block;
                            min-width: 70px;
                        ">
                            ${record.status}
                        </span>
                    </td>
                </tr>
            `).join('');
        }
        
        document.getElementById('class-student-details-modal').style.display = 'block';
        this.currentViewingStudent = student;
    }

    closeDetailsModal() {
        document.getElementById('class-student-details-modal').style.display = 'none';
        this.currentViewingStudent = null;
    }

    exportClassList() {
        if (this.studentsData.length === 0) {
            this.dashboard.showNotification('No data to export', 'error');
            return;
        }

        const position = this.instructorInfo?.position || 'Instructor';
        const department = this.instructorInfo?.department || '';
        const yearLevel = this.instructorInfo?.yearLevel || '';

        let html = `
            <html xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="UTF-8">
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th { background-color: #0066cc; color: white; font-weight: bold; 
                         padding: 12px; border: 1px solid #ddd; text-align: left; }
                    td { padding: 10px; border: 1px solid #ddd; }
                    tr:nth-child(even) { background-color: #f8f9fa; }
                    h2 { color: #0066cc; font-family: Arial, sans-serif; }
                    .header-info { margin-bottom: 20px; color: #666; }
                </style>
            </head>
            <body>
                <h2>Class List Report</h2>
                <div class="header-info">
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Position:</strong> ${position}</p>
                    <p><strong>Department:</strong> ${department}</p>
                    <p><strong>Year Level:</strong> ${yearLevel}</p>
                    <p><strong>Total Students:</strong> ${this.studentsData.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Set</th>
                            <th>Year Level</th>
                            <th>Course</th>
                            <th>Attendance Count</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.studentsData.forEach(student => {
            html += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.set}</td>
                    <td>${student.year}</td>
                    <td>${student.course}</td>
                    <td>${student.attendanceCount || 0}</td>
                    <td>${student.status}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Class_List_${department}_${yearLevel}_${new Date().toISOString().split('T')[0]}.xls`;
        link.click();
        
        this.dashboard.showNotification('Class list exported successfully!', 'success');
    }

    exportStudentReport() {
        if (!this.currentViewingStudent) return;
        
        const student = this.currentViewingStudent;
        const data = [
            ['Student Attendance Report'],
            ['Generated:', new Date().toLocaleString()],
            ['Instructor:', this.instructorInfo?.position || 'N/A'],
            [''],
            ['Student ID:', student.id],
            ['Name:', student.name],
            ['Set:', student.set],
            ['Year Level:', student.year],
            ['Course:', student.course],
            ['Status:', student.status],
            [''],
            ['Total Events:', this.getTotalEvents()],
            ['Events Attended:', student.attendanceCount || 0],
            ['Attendance Rate:', (this.getTotalEvents() > 0 ? Math.round(((student.attendanceCount || 0) / this.getTotalEvents()) * 100) : 0) + '%'],
            [''],
            ['Attendance History'],
            ['Date', 'Event Name', 'Time Scanned', 'Status']
        ];
        
        if (student.attendance) {
            student.attendance.forEach(record => {
                data.push([
                    record.date, 
                    record.event, 
                    record.time, 
                    record.status
                ]);
            });
        }
        
        this.exportToCSV(data, `${student.id}-${student.name.replace(/\s+/g, '-')}-Attendance-Report.csv`);
        this.dashboard.showNotification('Report exported successfully', 'success');
    }

    exportToCSV(data, filename) {
        const csvContent = data.map(row => 
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// Initialize Class Management when dashboard is ready
// Add this initialization to the existing instructor.js file

// Initialize Dashboard
let dashboard;

document.addEventListener('DOMContentLoaded', function() {
    dashboard = new InstructorDashboard();
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            dashboard.stopAutoRefresh();
        } else {
            dashboard.startAutoRefresh();
            dashboard.loadAttendanceData();
        }
    });

    window.addEventListener('beforeunload', function() {
        dashboard.destroy();
    });
});

// Initialize Class Management Module
document.addEventListener('DOMContentLoaded', function() {
    // Wait for dashboard to be initialized
    setTimeout(() => {
        if (typeof dashboard !== 'undefined') {
            window.classManagement = new ClassManagement(dashboard);
        }
    }, 500);
});

window.InstructorDashboard = {
    refresh: function() {
        if (dashboard) {
            dashboard.loadAttendanceData();
        }
    },
    
    getData: function() {
        return dashboard ? dashboard.attendanceData : [];
    },
    
    notify: function(message, type = 'success') {
        if (dashboard) {
            dashboard.showNotification(message, type);
        }
    }
};