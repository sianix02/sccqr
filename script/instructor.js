// ============================================================
// COMPLETE INSTRUCTOR.JS FILE - WITH ENHANCED PDF EXPORT
// File Location: C:\laragon\www\sccqr\pages\instructor\instructor.js
// ============================================================

// Instructor Dashboard JavaScript - Enhanced Version
class InstructorDashboard {
    constructor() {
        this.attendanceData = [];
        this.filteredData = [];
        this.currentTimeframe = 'today';
        this.refreshInterval = null;
        this.lastUpdate = null;
        this.apiBaseUrl = '../../api';
        this.previousDataHash = '';
        
        // Image paths for PDF header
        this.logoPath = '../../images/logo.png';
        this.sibongaPath = '../../images/sibonga.jpg';
        
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
                this.exportToPDF();
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

    createDataHash(data) {
        return JSON.stringify(data.map(item => item.id + item.timestamp));
    }

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
            `;
            
            tbody.appendChild(row);
        });
    }

    formatTime(timeString) {
        if (!timeString) return 'N/A';
        
        if (timeString.includes('AM') || timeString.includes('PM')) {
            return timeString;
        }
        
        const timeParts = timeString.split(':');
        if (timeParts.length < 2) return timeString;
        
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        return `${hours}:${minutes} ${ampm}`;
    }

    // Enhanced PDF Header with Images
    async addPDFHeader(doc) {
        return new Promise((resolve) => {
            // Header background
            doc.setFillColor(0, 102, 204);
            doc.rect(0, 0, 8.5, 1.8, 'F');

            let imagesLoaded = 0;
            const totalImages = 2;

            const checkComplete = () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    // Header text
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(9);
                    doc.setFont(undefined, 'normal');
                    doc.text('Republic of the Philippines', 4.25, 0.35, { align: 'center' });
                    doc.text('Province of Cebu', 4.25, 0.5, { align: 'center' });
                    
                    doc.setFontSize(14);
                    doc.setFont(undefined, 'bold');
                    doc.text('SIBONGA COMMUNITY COLLEGE', 4.25, 0.75, { align: 'center' });
                    
                    doc.setFontSize(9);
                    doc.setFont(undefined, 'normal');
                    doc.text('Poblacion, Sibonga, Cebu', 4.25, 0.93, { align: 'center' });
                    doc.text('Tel. No.: (032) 485-9405', 4.25, 1.08, { align: 'center' });
                    doc.text('Email: sibongacommunitycollege@gmail.com', 4.25, 1.23, { align: 'center' });
                    
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'bold');
                    doc.text('QR CODE ATTENDANCE MONITORING SYSTEM', 4.25, 1.5, { align: 'center' });
                    
                    resolve();
                }
            };

            // Load left logo (SCC Logo)
            const leftLogo = new Image();
            leftLogo.crossOrigin = 'Anonymous';
            leftLogo.onload = () => {
                doc.addImage(leftLogo, 'PNG', 0.65, 0.55, 0.7, 0.7);
                checkComplete();
            };
            leftLogo.onerror = () => {
                console.warn('Left logo failed to load');
                checkComplete();
            };
            leftLogo.src = this.logoPath;

            // Load right logo (Sibonga Seal)
            const rightLogo = new Image();
            rightLogo.crossOrigin = 'Anonymous';
            rightLogo.onload = () => {
                doc.addImage(rightLogo, 'JPEG', 7.15, 0.55, 0.7, 0.7);
                checkComplete();
            };
            rightLogo.onerror = () => {
                console.warn('Right logo failed to load');
                checkComplete();
            };
            rightLogo.src = this.sibongaPath;
        });
    }

    // Enhanced Export to PDF with Proper Tabular Format
    async exportToPDF() {
        if (this.filteredData.length === 0) {
            this.showNotification('No data to export', 'error');
            return;
        }

        this.showNotification('Generating PDF report...', 'success');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [8.5, 13] // Legal size
        });

        // Add header with images
        await this.addPDFHeader(doc);

        // Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('LIVE ATTENDANCE REPORT', 4.25, 2.2, { align: 'center' });

        // Report metadata
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = today.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        doc.text(`Generated: ${dateStr} at ${timeStr}`, 1, 2.5);
        doc.text(`Total Records: ${this.filteredData.length}`, 1, 2.65);

        // Prepare table data
        const tableData = this.filteredData.map((entry, index) => [
            index + 1,
            entry.studentId,
            entry.name,
            entry.course,
            entry.event,
            entry.date,
            this.formatTime(entry.timeIn) || 'N/A',
            this.formatTime(entry.timeOut) || '--:--',
            entry.status.toUpperCase()
        ]);

        // Add table with improved styling
        doc.autoTable({
            startY: 2.85,
            head: [['#', 'Student ID', 'Name', 'Course/Year', 'Event', 'Date', 'Time In', 'Time Out', 'Status']],
            body: tableData,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 0.06,
                lineColor: [200, 200, 200],
                lineWidth: 0.01,
            },
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
                valign: 'middle',
                fontSize: 9,
                cellPadding: 0.08,
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 0.06,
                valign: 'middle',
            },
            columnStyles: {
                0: { cellWidth: 0.35, halign: 'center' },  // #
                1: { cellWidth: 0.85, halign: 'center' },  // Student ID
                2: { cellWidth: 1.4 },                      // Name
                3: { cellWidth: 0.95 },                     // Course/Year
                4: { cellWidth: 1.2 },                      // Event
                5: { cellWidth: 0.75, halign: 'center' },  // Date
                6: { cellWidth: 0.7, halign: 'center' },   // Time In
                7: { cellWidth: 0.7, halign: 'center' },   // Time Out
                8: { cellWidth: 0.65, halign: 'center' }   // Status
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250]
            },
            didParseCell: function(data) {
                // Style status column
                if (data.section === 'body' && data.column.index === 8) {
                    const status = data.cell.raw.toLowerCase();
                    data.cell.styles.fontStyle = 'bold';
                    
                    if (status === 'present') {
                        data.cell.styles.textColor = [21, 87, 36];
                        data.cell.styles.fillColor = [212, 237, 218];
                    } else if (status === 'late') {
                        data.cell.styles.textColor = [133, 100, 4];
                        data.cell.styles.fillColor = [255, 243, 205];
                    } else if (status === 'absent') {
                        data.cell.styles.textColor = [114, 28, 36];
                        data.cell.styles.fillColor = [248, 215, 218];
                    }
                }
                
                // Bold font for student ID and name
                if (data.section === 'body' && (data.column.index === 1 || data.column.index === 2)) {
                    data.cell.styles.fontStyle = 'bold';
                }
            },
            margin: { left: 1, right: 1, top: 1, bottom: 1 },
            tableWidth: 6.5,
        });

        // Add footer with page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Footer line
            doc.setDrawColor(0, 102, 204);
            doc.setLineWidth(0.02);
            doc.line(1, 12, 7.5, 12);
            
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Page ${i} of ${pageCount}`, 4.25, 12.3, { align: 'center' });
            doc.text('Sibonga Community College - QR Attendance System', 4.25, 12.5, { align: 'center' });
            
            // Add printed by info
            doc.setFontSize(7);
            doc.text(`Printed: ${dateStr} at ${timeStr}`, 7.5, 12.7, { align: 'right' });
        }

        // Save PDF
        const filename = `Attendance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        this.showNotification('Attendance report exported successfully!', 'success');
    }

    viewStudentDetails(studentId) {
        const studentData = this.filteredData.filter(entry => entry.studentId == studentId);
        if (studentData.length === 0) return;

        const student = studentData[0];
        const totalCheckins = studentData.length;
        const latestCheckin = studentData[0]?.time || 'N/A';
        
    }

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

// ============================================================
// CLASS MANAGEMENT MODULE
// ============================================================

class ClassManagement {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.studentsData = [];
        this.filteredData = [];
        this.instructorInfo = null;
        this.isLoading = false;
        this.logoPath = '../../images/logo.png';
        this.sibongaPath = '../../images/sibonga.jpg';
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadClassStudents();
    }

    attachEventListeners() {
        const searchInput = document.getElementById('class-student-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchStudents(e.target.value);
            });
        }

        const sortSelect = document.getElementById('class-sort-students');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortStudents(e.target.value);
            });
        }

        const refreshBtn = document.getElementById('class-refresh-students');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.dashboard.showNotification('Refreshing student list...', 'success');
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
                        <button class="btn-view-details" onclick="classManagement.viewStudentDetails('${student.id}')">
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

    // Enhanced PDF Header with Images
    async addPDFHeader(doc) {
        return new Promise((resolve) => {
            // Header background
            doc.setFillColor(0, 102, 204);
            doc.rect(0, 0, 8.5, 1.8, 'F');

            let imagesLoaded = 0;
            const totalImages = 2;

            const checkComplete = () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    // Header text
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(9);
                    doc.setFont(undefined, 'normal');
                    doc.text('Republic of the Philippines', 4.25, 0.35, { align: 'center' });
                    doc.text('Province of Cebu', 4.25, 0.5, { align: 'center' });
                    
                    doc.setFontSize(14);
                    doc.setFont(undefined, 'bold');
                    doc.text('SIBONGA COMMUNITY COLLEGE', 4.25, 0.75, { align: 'center' });
                    
                    doc.setFontSize(9);
                    doc.setFont(undefined, 'normal');
                    doc.text('Poblacion, Sibonga, Cebu', 4.25, 0.93, { align: 'center' });
                    doc.text('Tel. No.: (032) 485-9405', 4.25, 1.08, { align: 'center' });
                    doc.text('Email: sibongacommunitycollege@gmail.com', 4.25, 1.23, { align: 'center' });
                    
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'bold');
                    doc.text('QR CODE ATTENDANCE MONITORING SYSTEM', 4.25, 1.5, { align: 'center' });
                    
                    resolve();
                }
            };

            // Load left logo (SCC Logo)
            const leftLogo = new Image();
            leftLogo.crossOrigin = 'Anonymous';
            leftLogo.onload = () => {
                doc.addImage(leftLogo, 'PNG', 0.65, 0.55, 0.7, 0.7);
                checkComplete();
            };
            leftLogo.onerror = () => {
                console.warn('Left logo failed to load');
                checkComplete();
            };
            leftLogo.src = this.logoPath;

            // Load right logo (Sibonga Seal)
            const rightLogo = new Image();
            rightLogo.crossOrigin = 'Anonymous';
            rightLogo.onload = () => {
                doc.addImage(rightLogo, 'JPEG', 7.15, 0.55, 0.7, 0.7);
                checkComplete();
            };
            rightLogo.onerror = () => {
                console.warn('Right logo failed to load');
                checkComplete();
            };
            rightLogo.src = this.sibongaPath;
        });
    }

    // Export Class List to PDF
    async exportClassList() {
        if (this.studentsData.length === 0) {
            this.dashboard.showNotification('No data to export', 'error');
            return;
        }

        this.dashboard.showNotification('Generating class list PDF...', 'success');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [8.5, 13]
        });

        const position = this.instructorInfo?.position || 'Instructor';
        const department = this.instructorInfo?.department || '';
        const yearLevel = this.instructorInfo?.yearLevel || '';

        await this.addPDFHeader(doc);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('CLASS LIST REPORT', 4.25, 2.2, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = today.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        doc.text(`Generated: ${dateStr} at ${timeStr}`, 1, 2.5);
        doc.text(`Instructor: ${position}`, 1, 2.65);
        doc.text(`Department: ${department}`, 1, 2.8);
        doc.text(`Year Level: ${yearLevel}`, 1, 2.95);
        doc.text(`Total Students: ${this.studentsData.length}`, 1, 3.1);

        const tableData = this.studentsData.map((student, index) => [
            index + 1,
            student.id,
            student.name,
            student.set,
            student.year,
            student.course,
            student.attendanceCount || 0,
            student.status
        ]);

        doc.autoTable({
            startY: 3.3,
            head: [['#', 'Student ID', 'Name', 'Set', 'Year', 'Course', 'Attendance', 'Status']],
            body: tableData,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 0.06,
                lineColor: [200, 200, 200],
                lineWidth: 0.01,
            },
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center',
                valign: 'middle',
                fontSize: 9,
                cellPadding: 0.08,
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 0.06,
                valign: 'middle',
            },
            columnStyles: {
                0: { cellWidth: 0.35, halign: 'center' },
                1: { cellWidth: 0.9, halign: 'center' },
                2: { cellWidth: 1.6, fontStyle: 'bold' },
                3: { cellWidth: 0.6, halign: 'center' },
                4: { cellWidth: 0.6, halign: 'center' },
                5: { cellWidth: 1.4 },
                6: { cellWidth: 0.8, halign: 'center' },
                7: { cellWidth: 0.7, halign: 'center' }
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250]
            },
            didParseCell: function(data) {
                if (data.section === 'body' && data.column.index === 7) {
                    const status = data.cell.raw;
                    data.cell.styles.fontStyle = 'bold';
                    if (status === 'Active') {
                        data.cell.styles.textColor = [21, 87, 36];
                        data.cell.styles.fillColor = [212, 237, 218];
                    } else {
                        data.cell.styles.textColor = [114, 28, 36];
                        data.cell.styles.fillColor = [248, 215, 218];
                    }
                }
            },
            margin: { left: 1, right: 1, top: 1, bottom: 1 },
            tableWidth: 6.5,
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            doc.setDrawColor(0, 102, 204);
            doc.setLineWidth(0.02);
            doc.line(1, 12, 7.5, 12);
            
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Page ${i} of ${pageCount}`, 4.25, 12.3, { align: 'center' });
            doc.text('Sibonga Community College - QR Attendance System', 4.25, 12.5, { align: 'center' });
            
            doc.setFontSize(7);
            doc.text(`Printed: ${dateStr} at ${timeStr}`, 7.5, 12.7, { align: 'right' });
        }

        const filename = `Class_List_${department}_${yearLevel}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        this.dashboard.showNotification('Class list exported successfully!', 'success');
    }

    // Export Student Report to PDF
    async exportStudentReport() {
        if (!this.currentViewingStudent) return;
        
        const student = this.currentViewingStudent;
        
        this.dashboard.showNotification('Generating student report...', 'success');
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [8.5, 13]
        });

        await this.addPDFHeader(doc);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('STUDENT ATTENDANCE REPORT', 4.25, 2.2, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Student Information:', 1, 2.6);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const infoY = 2.8;
        const lineHeight = 0.18;
        doc.text(`Student ID: ${student.id}`, 1, infoY);
        doc.text(`Name: ${student.name}`, 1, infoY + lineHeight);
        doc.text(`Set: ${student.set}`, 1, infoY + lineHeight * 2);
        doc.text(`Year Level: ${student.year}`, 1, infoY + lineHeight * 3);
        doc.text(`Course: ${student.course}`, 1, infoY + lineHeight * 4);
        doc.text(`Status: ${student.status}`, 1, infoY + lineHeight * 5);

        const totalEvents = this.getTotalEvents();
        const attended = student.attendanceCount || 0;
        const attendanceRate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : (attended > 0 ? 100 : 0);

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Attendance Summary:', 4.7, 2.6);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Total Events: ${totalEvents}`, 4.7, infoY);
        doc.text(`Events Attended: ${attended}`, 4.7, infoY + lineHeight);
        doc.text(`Attendance Rate: ${attendanceRate}%`, 4.7, infoY + lineHeight * 2);
        
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = today.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        doc.text(`Generated: ${dateStr}`, 4.7, infoY + lineHeight * 3);

        if (student.attendance && student.attendance.length > 0) {
            const tableData = student.attendance.map((record, index) => [
                index + 1,
                record.date,
                record.event,
                record.time,
                record.status
            ]);

            doc.autoTable({
                startY: 4.0,
                head: [['#', 'Date', 'Event Name', 'Time Scanned', 'Status']],
                body: tableData,
                theme: 'grid',
                styles: {
                    fontSize: 8,
                    cellPadding: 0.06,
                    lineColor: [200, 200, 200],
                    lineWidth: 0.01,
                },
                headStyles: {
                    fillColor: [0, 102, 204],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                    valign: 'middle',
                    fontSize: 9,
                    cellPadding: 0.08,
                },
                bodyStyles: {
                    fontSize: 8,
                    cellPadding: 0.06,
                    valign: 'middle',
                },
                columnStyles: {
                    0: { cellWidth: 0.35, halign: 'center' },
                    1: { cellWidth: 1.0, halign: 'center' },
                    2: { cellWidth: 2.6 },
                    3: { cellWidth: 1.1, halign: 'center' },
                    4: { cellWidth: 0.9, halign: 'center' }
                },
                alternateRowStyles: {
                    fillColor: [248, 249, 250]
                },
                didParseCell: function(data) {
                    if (data.section === 'body' && data.column.index === 4) {
                        const status = data.cell.raw;
                        data.cell.styles.fontStyle = 'bold';
                        
                        if (status === 'Present') {
                            data.cell.styles.textColor = [21, 87, 36];
                            data.cell.styles.fillColor = [212, 237, 218];
                        } else if (status === 'Late') {
                            data.cell.styles.textColor = [133, 100, 4];
                            data.cell.styles.fillColor = [255, 243, 205];
                        } else {
                            data.cell.styles.textColor = [114, 28, 36];
                            data.cell.styles.fillColor = [248, 215, 218];
                        }
                    }
                },
                margin: { left: 1, right: 1, top: 1, bottom: 1 },
                tableWidth: 5.95,
            });
        } else {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('No attendance records found for this student.', 4.25, 4.5, { align: 'center' });
        }

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            doc.setDrawColor(0, 102, 204);
            doc.setLineWidth(0.02);
            doc.line(1, 12, 7.5, 12);
            
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Page ${i} of ${pageCount}`, 4.25, 12.3, { align: 'center' });
            doc.text('Sibonga Community College - QR Attendance System', 4.25, 12.5, { align: 'center' });
            
            doc.setFontSize(7);
            doc.text(`Printed: ${dateStr} at ${timeStr}`, 7.5, 12.7, { align: 'right' });
        }

        const filename = `${student.id}_${student.name.replace(/\s+/g, '_')}_Attendance_Report.pdf`;
        doc.save(filename);
        
        this.dashboard.showNotification('Student report exported successfully!', 'success');
    }
}

// ============================================================
// INITIALIZATION
// ============================================================

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
    setTimeout(() => {
        if (typeof dashboard !== 'undefined') {
            window.classManagement = new ClassManagement(dashboard);
        }
    }, 500);
});

// Public API
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