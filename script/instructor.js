// ============================================================
// INSTRUCTOR DASHBOARD - CLASS MANAGEMENT ONLY VERSION
// File: instructor.js
// Updated to remove Live Attendance
// ============================================================

// ============================================================
// DASHBOARD CLASS - Navigation & Core Functionality
// ============================================================
class Dashboard {
    constructor() {
        this.currentPage = 'class-management'; // Changed from 'live-attendance'
        this.init();
    }

    init() {
        this.attachNavigationListeners();
        this.attachLogoutListeners();
        this.showPage(this.currentPage);
    }

    attachLogoutListeners() {
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');
    const logoutModal = document.getElementById('logout-modal');
    
    if (confirmLogout) {
        confirmLogout.addEventListener('click', () => {
            // Redirect to logout API
            window.location.href = '../../sql_php/logout.php';
        });
    }
    
    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.classList.remove('show');
                logoutModal.style.display = 'none';
            }
        });
    }
    
    // Close modal when clicking outside
    if (logoutModal) {
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.classList.remove('show');
                logoutModal.style.display = 'none';
            }
        });
    }
}

    attachNavigationListeners() {
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                
                if (page === 'logout') {
                    this.showLogoutModal();
                    return;
                }
                
                this.showPage(page);
                
                document.querySelectorAll('.nav-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
                
                this.closeMobileMenu();
            });
        });

        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const sidebar = document.querySelector('.sidebar');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
            });
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = pageId;
            
            if (pageId === 'class-management' && window.classManagement) {
                window.classManagement.loadClassStudents();
            }
        }
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const mobileOverlay = document.getElementById('mobile-overlay');
        
        if (sidebar) sidebar.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
    }

    showLogoutModal() {
    const modal = document.getElementById('logout-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    showNotification(message, type = 'success') {
        // Simple console notification if toast system not available
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Optional: Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0066cc'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ============================================================
// CLASS MANAGEMENT MODULE - ENHANCED WITH FILTERS
// ============================================================
class ClassManagement {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.studentsData = [];
        this.filteredData = [];
        this.instructorInfo = null;
        this.isLoading = false;
        this.currentViewingStudent = null;
        
        // Filter options
        this.availableEvents = [];
        this.availableDates = [];
        this.availableSets = [];
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadClassStudents();
    }

    attachEventListeners() {
        // Search
        const searchInput = document.getElementById('class-student-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.applyFilters();
            });
        }

        // Sort
        const sortSelect = document.getElementById('class-sort-students');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortStudents(e.target.value);
            });
        }

        // NEW FILTERS
        const statusFilter = document.getElementById('class-filter-status');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.applyFilters();
                this.updateClearFiltersButton();
            });
        }

        const eventFilter = document.getElementById('class-filter-event');
        if (eventFilter) {
            eventFilter.addEventListener('change', () => {
                this.applyFilters();
                this.updateClearFiltersButton();
            });
        }

        const dateFilter = document.getElementById('class-filter-date');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                this.applyFilters();
                this.updateClearFiltersButton();
            });
        }

        const setFilter = document.getElementById('class-filter-set');
        if (setFilter) {
            setFilter.addEventListener('change', () => {
                this.applyFilters();
                this.updateClearFiltersButton();
            });
        }

        // Clear Filters
        const clearFiltersBtn = document.getElementById('class-clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Other buttons
        const refreshBtn = document.getElementById('class-refresh-students');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadClassStudents();
            });
        }

        const exportBtn = document.getElementById('class-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportClassList();
            });
        }

        document.getElementById('class-close-details-modal')?.addEventListener('click', () => {
            this.closeDetailsModal();
        });
        
        document.getElementById('class-close-details-btn')?.addEventListener('click', () => {
            this.closeDetailsModal();
        });

        document.getElementById('class-export-student-report')?.addEventListener('click', () => {
            this.exportStudentReport();
        });

        document.getElementById('class-student-details-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'class-student-details-modal') {
                this.closeDetailsModal();
            }
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
            const response = await fetch('../../api/instructor_get_class_students.php');
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.studentsData = result.data;
                this.instructorInfo = result.instructor;
                
                this.extractFilterOptions();
                this.populateFilterDropdowns();
                this.updateInfoBadge();
                this.applyFilters();
                this.updateStats();
                
                this.dashboard.showNotification(
                    `Loaded ${result.total} students successfully`, 
                    'success'
                );
            } else {
                throw new Error(result.message || 'Failed to load students');
            }
        } catch (error) {
            console.error('Load error:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="padding: 40px; text-align: center; color: #dc3545;">
                        <p style="font-size: 18px; margin-bottom: 10px;">Error Loading Students</p>
                        <p style="margin-bottom: 15px;">${error.message}</p>
                        <button class="btn" onclick="classManagement.loadClassStudents()" style="margin-top: 10px;">Retry</button>
                    </td>
                </tr>
            `;
            this.dashboard.showNotification('Failed to load students', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    extractFilterOptions() {
        const events = new Set();
        const dates = new Set();
        const sets = new Set();
        
        this.studentsData.forEach(student => {
            sets.add(student.set);
            if (student.attendance && Array.isArray(student.attendance)) {
                student.attendance.forEach(att => {
                    events.add(att.event);
                    dates.add(att.date);
                });
            }
        });
        
        this.availableEvents = Array.from(events).sort();
        this.availableDates = Array.from(dates).sort().reverse();
        this.availableSets = Array.from(sets).sort();
    }

    populateFilterDropdowns() {
        // Event Filter
        const eventFilter = document.getElementById('class-filter-event');
        if (eventFilter) {
            eventFilter.innerHTML = '<option value="all">All Events</option>';
            this.availableEvents.forEach(event => {
                const option = document.createElement('option');
                option.value = event;
                option.textContent = event;
                eventFilter.appendChild(option);
            });
        }
        
        // Date Filter
        const dateFilter = document.getElementById('class-filter-date');
        if (dateFilter) {
            dateFilter.innerHTML = '<option value="all">All Dates</option>';
            this.availableDates.forEach(date => {
                const option = document.createElement('option');
                option.value = date;
                option.textContent = this.formatDate(date);
                dateFilter.appendChild(option);
            });
        }
        
        // Set Filter
        const setFilter = document.getElementById('class-filter-set');
        if (setFilter) {
            setFilter.innerHTML = '<option value="">All Sets</option>';
            this.availableSets.forEach(set => {
                const option = document.createElement('option');
                option.value = set;
                option.textContent = set;
                setFilter.appendChild(option);
            });
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

    applyFilters() {
        const searchTerm = document.getElementById('class-student-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('class-filter-status')?.value || 'all';
        const eventFilter = document.getElementById('class-filter-event')?.value || 'all';
        const dateFilter = document.getElementById('class-filter-date')?.value || 'all';
        const setFilter = document.getElementById('class-filter-set')?.value || '';

        this.filteredData = this.studentsData.filter(student => {
            // Search filter
            const matchesSearch = !searchTerm || 
                student.id.toLowerCase().includes(searchTerm) ||
                student.name.toLowerCase().includes(searchTerm) ||
                student.set.toLowerCase().includes(searchTerm);
            
            // Status filter
            const matchesStatus = statusFilter === 'all' || 
                student.status.toLowerCase() === statusFilter;
            
            // Set filter
            const matchesSet = !setFilter || student.set === setFilter;
            
            // Event filter
            const matchesEvent = eventFilter === 'all' || 
                (student.attendance && student.attendance.some(att => att.event === eventFilter));
            
            // Date filter
            const matchesDate = dateFilter === 'all' || 
                (student.attendance && student.attendance.some(att => att.date === dateFilter));
            
            return matchesSearch && matchesStatus && matchesSet && matchesEvent && matchesDate;
        });

        const filterInfo = document.getElementById('class-filter-info');
        if (filterInfo) {
            filterInfo.textContent = `Showing ${this.filteredData.length} of ${this.studentsData.length} students`;
        }

        this.renderStudentsTable(this.filteredData);
        this.updateStats();
    }

    sortStudents(sortType) {
        let sorted = [...this.filteredData.length > 0 ? this.filteredData : this.studentsData];
        
        switch(sortType) {
            case 'id-asc':
                sorted.sort((a, b) => String(a.id).localeCompare(String(b.id)));
                break;
            case 'id-desc':
                sorted.sort((a, b) => String(b.id).localeCompare(String(a.id)));
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
                        <p>Try adjusting your filters</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = displayData.map((student, index) => {
            const attendanceCount = student.attendanceCount || 0;
            const bgColor = index % 2 === 0 ? '#f8fcff' : 'white';
            const statusBgColor = student.status === 'Active' ? '#d4edda' : '#dc3545';
            const statusColor = student.status === 'Active' ? '#155724' : '#ffffff';
            const statusBorder = student.status === 'Active' ? '#c3e6cb' : '#dc3545';
                        
            return `
                <tr style="background: ${bgColor};">
                    <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.id}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.name}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.set}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.year}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${student.course}</td>
                    <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">${attendanceCount} events</td>
                    <td style="padding: 16px; border-bottom: 1px solid #f0f8ff;">
                        <span style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${statusBgColor}; color: ${statusColor}; border: 1px solid ${statusBorder};">
                            ${student.status}
                        </span>
                    </td>
                    <td style="padding: 16px; border-bottom: 1px solid #f0f8ff; text-align: center;">
                        <button class="btn-view-details" onclick="classManagement.viewStudentDetails('${student.id}')" style="padding: 8px 16px; border: 2px solid #0066cc; background: transparent; color: #0066cc; border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: 600;">
                            View Details
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateStats() {
        const displayData = this.filteredData.length > 0 ? this.filteredData : this.studentsData;
        const totalStudents = displayData.length;
        const activeStudents = displayData.filter(s => s.status === 'Active').length;
        
        let totalAttendanceEvents = 0;
        displayData.forEach(student => {
            totalAttendanceEvents += (student.attendanceCount || 0);
        });
        
        const avgAttendance = totalStudents > 0 ? (totalAttendanceEvents / totalStudents).toFixed(1) : 0;
        
        const totalEl = document.getElementById('class-total-students-count');
        const activeEl = document.getElementById('class-active-students-count');
        const avgEl = document.getElementById('class-avg-attendance');
        
        if (totalEl) totalEl.textContent = totalStudents;
        if (activeEl) activeEl.textContent = activeStudents;
        if (avgEl) avgEl.textContent = avgAttendance;
    }

    viewStudentDetails(studentId) {
        const student = this.studentsData.find(s => s.id === studentId);
        if (!student) return;
        
        document.getElementById('class-detail-student-id').textContent = student.id;
        document.getElementById('class-detail-student-name').textContent = student.name;
        document.getElementById('class-detail-student-set').textContent = student.set;
        document.getElementById('class-detail-student-year').textContent = student.year;
        
        const totalEvents = student.attendance ? student.attendance.length : 0;
        const attended = student.attendanceCount || 0;
        const attendanceRate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : 0;
        
        document.getElementById('class-detail-total-events').textContent = totalEvents;
        document.getElementById('class-detail-attended').textContent = attended;
        document.getElementById('class-detail-attendance-rate').textContent = attendanceRate + '%';
        
        const historyBody = document.getElementById('class-attendance-history-body');
        if (!student.attendance || student.attendance.length === 0) {
            historyBody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 20px; text-align: center; color: #666;">
                        No attendance records found for this student
                    </td>
                </tr>
            `;
        } else {
            historyBody.innerHTML = student.attendance.map((record, index) => {
                const bgColor = index % 2 === 0 ? 'white' : '#f8fcff';
                const statusBgColor = record.status === 'Present' ? '#d4edda' : '#f8d7da';
                const statusColor = record.status === 'Present' ? '#155724' : '#721c24';
                const statusBorder = record.status === 'Present' ? '#c3e6cb' : '#f5c6cb';
                const formattedDate = this.formatDate(record.date);
                
                return `
                    <tr style="background: ${bgColor};">
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${formattedDate}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${record.event}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${record.time || 'N/A'}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">N/A</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">
                            <span style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${statusBgColor}; color: ${statusColor}; border: 1px solid ${statusBorder};">
                                ${record.status.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');
        }
        
        document.getElementById('class-student-details-modal').style.display = 'block';
        this.currentViewingStudent = student;
    }

    closeDetailsModal() {
        document.getElementById('class-student-details-modal').style.display = 'none';
        this.currentViewingStudent = null;
    }

    clearAllFilters() {
        document.getElementById('class-filter-status').value = 'all';
        document.getElementById('class-filter-event').value = 'all';
        document.getElementById('class-filter-date').value = 'all';
        document.getElementById('class-filter-set').value = '';
        this.applyFilters();
        this.updateClearFiltersButton();
    }

    updateClearFiltersButton() {
        const hasActiveFilters = 
            document.getElementById('class-filter-status')?.value !== 'all' ||
            document.getElementById('class-filter-event')?.value !== 'all' ||
            document.getElementById('class-filter-date')?.value !== 'all' ||
            document.getElementById('class-filter-set')?.value !== '';
        
        const clearBtn = document.getElementById('class-clear-filters');
        if (clearBtn) {
            clearBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    async exportClassList() {
        if (this.studentsData.length === 0) {
            this.dashboard.showNotification('No data to export', 'error');
            return;
        }

        window.open('../../api/instructor_export_all_students.php', '_blank');
    }

    async exportStudentReport() {
        if (!this.currentViewingStudent) return;
        
        const student = this.currentViewingStudent;
        window.open(`../../api/instructor_export_individual_student.php?student_id=${student.id}`, '_blank');
    }
}

// ============================================================
// INITIALIZATION
// ============================================================

let dashboard;

document.addEventListener('DOMContentLoaded', function() {
    dashboard = new Dashboard();
    
    setTimeout(() => {
        window.classManagement = new ClassManagement(dashboard);
    }, 500);
});

// Add CSS animation for toast notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);