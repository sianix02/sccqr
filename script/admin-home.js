// ============================================================
// CONSOLIDATED ADMIN DASHBOARD SCRIPT
// File: admin-home.js (replaces both admin-home.js and student.js)
// ============================================================

// ============================================================
// GLOBAL UTILITIES
// ============================================================

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Export data to CSV
function exportToCSV(data, filename) {
    const csvContent = data.map(row => 
        row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// ============================================================
// MAIN INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeChart();
    initializeEventManagement();
    initializeStudentManagement();
    initializeLogout();
});

// ============================================================
// NAVIGATION MODULE
// ============================================================

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function closeMobileSidebar() {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMobileSidebar() {
        sidebar.classList.add('mobile-open');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            pages.forEach(page => page.classList.remove('active'));
            
            const targetPage = this.getAttribute('data-page');
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
            }

            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });

    mobileMenuBtn?.addEventListener('click', function() {
        sidebar.classList.contains('mobile-open') ? closeMobileSidebar() : openMobileSidebar();
    });

    mobileOverlay?.addEventListener('click', closeMobileSidebar);

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
}

// ============================================================
// CHART MODULE
// ============================================================

let courseChart = null;
let analyticsData = null;

function initializeChart() {
    loadAnalyticsData();
    
    document.getElementById('timeRange')?.addEventListener('change', () => {
        updateChartTimeRange();
    });
    
    document.getElementById('refreshChart')?.addEventListener('click', () => {
        loadAnalyticsData();
        showToast('Refreshing analytics data...', 'success');
    });
}

async function loadAnalyticsData() {
    const canvas = document.getElementById('courseAttendanceChart');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    console.log('Loading analytics data...');
    showChartLoading(true);
    
    try {
        const response = await fetch('../../api/get_analytics_data.php');
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('API Result:', result);
        
        if (result.success) {
            analyticsData = result;
            updateDashboardStats(result.stats);
            renderCourseChart(result.chartData);
        } else {
            throw new Error(result.error || 'Failed to load analytics');
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
        showChartError(error.message);
        showToast('Failed to load analytics data', 'error');
    } finally {
        showChartLoading(false);
    }
}

function updateDashboardStats(stats) {
    document.getElementById('stat-total-students').textContent = stats.total_students || 0;
    document.getElementById('stat-total-instructors').textContent = stats.total_instructors || 0;
    document.getElementById('stat-total-events').textContent = stats.total_events || 0;
    document.getElementById('stat-engagement-rate').textContent = (stats.engagement_rate || 0) + '%';
}

function renderCourseChart(chartData) {
    const canvas = document.getElementById('courseAttendanceChart');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    console.log('Chart Data Received:', chartData);
    
    // Destroy existing chart if it exists
    if (courseChart) {
        courseChart.destroy();
        courseChart = null;
    }
    
    if (!chartData.labels || chartData.labels.length === 0) {
        console.log('No data - showing empty state');
        showChartEmpty();
        return;
    }
    
    console.log('Labels:', chartData.labels);
    console.log('Datasets:', chartData.datasets);
    
    const colors = [
        '#0066cc', '#28a745', '#ffc107', '#dc3545', '#17a2b8',
        '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6c757d'
    ];
    
    const datasets = Object.keys(chartData.datasets).map((course, index) => {
        const color = colors[index % colors.length];
        const data = chartData.datasets[course];
        
        console.log(`Course: ${course}, Data:`, data);
        
        return {
            label: course || 'Unknown Course',
            data: data,
            borderColor: color,
            backgroundColor: hexToRgba(color, 0.1),
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: color,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 3
        };
    });
    
    console.log('Final datasets for Chart.js:', datasets);
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        showChartError('Chart.js library not loaded');
        return;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        
        courseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'start',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: 12, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y} attendees`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time Period',
                            font: { size: 13, weight: '600' }
                        },
                        grid: { display: false }
                    },
                    y: {
                        display: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Attendees',
                            font: { size: 13, weight: '600' }
                        },
                        ticks: {
                            stepSize: 1,
                            callback: (value) => Number.isInteger(value) ? value : null
                        }
                    }
                }
            }
        });
        
        console.log('Chart created successfully:', courseChart);
        
    } catch (error) {
        console.error('Error creating chart:', error);
        showChartError(error.message);
    }
}

function updateChartTimeRange() {
    if (!analyticsData) return;
    
    const months = parseInt(document.getElementById('timeRange').value);
    
    showToast(`Updating chart for last ${months} months...`, 'success');
    
    // In a real implementation, you would fetch new data based on the time range
    // For now, we'll just reload the data
    loadAnalyticsData();
}

function showChartLoading(show) {
    const container = document.querySelector('.chart-container');
    if (!container) return;
    
    let canvas = document.getElementById('courseAttendanceChart');
    let loadingDiv = container.querySelector('.chart-loading');
    
    if (show) {
        if (canvas) canvas.style.display = 'none';
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'chart-loading';
            loadingDiv.innerHTML = `
                <div class="chart-loading-spinner"></div>
                <div class="chart-loading-text">Loading analytics data...</div>
            `;
            container.appendChild(loadingDiv);
        }
        loadingDiv.style.display = 'block';
    } else {
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'courseAttendanceChart';
            container.appendChild(canvas);
        }
        canvas.style.display = 'block';
    }
}

function showChartEmpty() {
    const container = document.querySelector('.chart-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="chart-empty">
            <div class="chart-empty-icon">📊</div>
            <div class="chart-empty-text">No attendance data available</div>
            <div class="chart-empty-subtext">Data will appear here once students start attending events</div>
        </div>
    `;
}

function showChartError(message) {
    const container = document.querySelector('.chart-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="chart-empty">
            <div class="chart-empty-icon" style="color: #dc3545;">⚠️</div>
            <div class="chart-empty-text">Error loading data</div>
            <div class="chart-empty-subtext">${message}</div>
        </div>
    `;
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================
// EVENT MANAGEMENT MODULE
// ============================================================

let currentEventData = null;
let currentSessionActive = false;
let attendanceData = [];

function initializeEventManagement() {
    document.getElementById('event-form')?.addEventListener('submit', handleEventSubmit);
    document.getElementById('download-qr')?.addEventListener('click', downloadQRCode);
    document.getElementById('copy-qr-code')?.addEventListener('click', copyQRCode);
    document.getElementById('view-event-page')?.addEventListener('click', viewEventPage);
    document.getElementById('create-new-event')?.addEventListener('click', createNewEvent);
    document.getElementById('back-to-events')?.addEventListener('click', backToEvents);
    document.getElementById('export-attendance')?.addEventListener('click', exportAttendance);
}

function handleEventSubmit(e) {
    e.preventDefault();
    
    currentEventData = {
        id: generateEventId(),
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        type: document.getElementById('event-type').value,
        description: document.getElementById('event-description').value,
        maxParticipants: document.getElementById('max-participants').value,
        createdAt: new Date().toISOString()
    };

    generateQRCode(currentEventData);
    initializeAttendanceSession();
    
    document.getElementById('qr-section').style.display = 'block';
    document.getElementById('event-form').style.display = 'none';
    
    showToast('Event created successfully!', 'success');
}

function generateQRCode(eventData) {
    const qrContainer = document.getElementById('qr-code-container');
    const qrTextElement = document.getElementById('qr-code-text');
    
    qrContainer.innerHTML = '';
    
    const qrCodeData = `SIBONGA-${eventData.name.trim().toUpperCase()}-${new Date(eventData.date).toLocaleTimeString()}`;
    
    if (typeof QRCode === 'undefined') {
        qrContainer.innerHTML = '<p style="color: red;">QR Code library missing</p>';
        showToast('QR Code library not found', 'error');
        return;
    }

    QRCode.toCanvas(qrCodeData, {
        width: 250,
        height: 250,
        margin: 3,
        color: { dark: '#0066cc', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        scale: 4
    }, function (error, canvas) {
        if (error) {
            qrContainer.innerHTML = '<p style="color: red;">Error generating QR code</p>';
            showToast('Failed to generate QR code', 'error');
            return;
        }
        
        canvas.style.cssText = 'border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 102, 204, 0.15); border: 3px solid #f0f8ff;';
        qrContainer.appendChild(canvas);
        qrTextElement.textContent = qrCodeData;
        
        const eventInfoDiv = document.createElement('div');
        eventInfoDiv.style.cssText = 'margin-top: 15px; padding: 12px; background-color: #e8f4fd; border-radius: 8px; font-size: 14px; color: #004080;';
        eventInfoDiv.innerHTML = `
            <strong>Event Details:</strong><br>
            <strong>Type:</strong> ${eventData.type}<br>
            <strong>Date:</strong> ${new Date(eventData.date).toLocaleString()}<br>
            <strong>Max Participants:</strong> ${eventData.maxParticipants || 'Unlimited'}
        `;
        qrTextElement.parentNode.insertBefore(eventInfoDiv, qrTextElement.nextSibling);
        
        showToast('QR Code generated successfully!', 'success');
    });
}

function initializeAttendanceSession() {
    currentSessionActive = true;
    attendanceData = [];
    updateAttendanceStats(0, 0);
    
    if (currentEventData) {
        currentEventData.sessionActive = true;
        currentEventData.attendanceData = attendanceData;
    }
}

function updateAttendanceStats(registered, present) {
    const el = (id) => document.getElementById(id);
    if (el('total-registered')) el('total-registered').textContent = registered;
    if (el('total-present')) el('total-present').textContent = present;
    
    const rate = registered > 0 ? Math.round((present / registered) * 100) : 0;
    if (el('attendance-rate')) el('attendance-rate').textContent = rate + '%';
}

function downloadQRCode() {
    const canvas = document.querySelector('#qr-code-container canvas');
    if (canvas) {
        const sanitizedName = currentEventData.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase();
        const link = document.createElement('a');
        link.download = `${sanitizedName}-qr-code.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        showToast('QR Code downloaded successfully!', 'success');
    } else {
        showToast('No QR code to download', 'error');
    }
}

function copyQRCode() {
    const qrText = document.getElementById('qr-code-text').textContent;
    navigator.clipboard.writeText(qrText)
        .then(() => showToast('Event name copied to clipboard!', 'success'))
        .catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = qrText;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('Event name copied to clipboard!', 'success');
            } catch {
                showToast('Failed to copy event name', 'error');
            }
            document.body.removeChild(textArea);
        });
}

function viewEventPage() {
    if (currentEventData) {
        showEventAttendancePage(currentEventData);
    } else {
        showToast('No event data available', 'error');
    }
}

function createNewEvent() {
    document.getElementById('event-form').reset();
    document.getElementById('event-form').style.display = 'block';
    document.getElementById('qr-section').style.display = 'none';
    
    document.getElementById('qr-code-container').innerHTML = '';
    document.getElementById('qr-code-text').textContent = '';
    
    const attendanceList = document.getElementById('attendance-list');
    attendanceList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #666;">Waiting for students to scan QR code...</td></tr>';
    
    updateAttendanceStats(0, 0);
    document.getElementById('event-info').innerHTML = '';
    
    currentEventData = null;
    currentSessionActive = false;
    attendanceData = [];
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('start-event').classList.add('active');
    
    showToast('Ready to create a new event', 'success');
}

function showEventAttendancePage(eventData) {
    document.getElementById('attendance-event-title').textContent = eventData.name;
    document.getElementById('attendance-event-subtitle').textContent = `Track attendance for ${eventData.type} event`;
    
    document.getElementById('event-info').innerHTML = `
        <strong>Date:</strong> ${new Date(eventData.date).toLocaleString()}<br>
        <strong>Type:</strong> ${eventData.type}<br>
        <strong>Max Participants:</strong> ${eventData.maxParticipants || 'Unlimited'}<br>
        <strong>Event ID:</strong> ${eventData.id}
    `;

    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('event-attendance').classList.add('active');

    updateAttendanceStats(0, 0);
}

function backToEvents() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('start-event').classList.add('active');
}

function exportAttendance() {
    if (currentEventData) {
        const data = gatherAttendanceData();
        exportToCSV(data, `${currentEventData.name}-Attendance.csv`);
        showToast('Attendance data exported successfully!', 'success');
    } else {
        showToast('No event data to export', 'error');
    }
}

function gatherAttendanceData() {
    if (!currentEventData || !attendanceData.length) {
        return [['Time', 'Student ID', 'Name', 'Event Name', 'Status']];
    }

    const data = [
        ['Event Name:', currentEventData.name],
        ['Event Type:', currentEventData.type],
        ['Event Date:', new Date(currentEventData.date).toLocaleString()],
        ['Session ID:', currentEventData.id],
        ['QR Code Content:', currentEventData.name],
        [''],
        ['Time', 'Student ID', 'Name', 'Event Name', 'Status']
    ];
    
    attendanceData.forEach((record, index) => {
        data.push([
            record.time,
            `STU-${String(index + 1).padStart(3, '0')}`,
            record.name,
            record.scannedEvent || currentEventData.name,
            'Present'
        ]);
    });
    
    return data;
}

function generateEventId() {
    return `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// ============================================================
// STUDENT MANAGEMENT MODULE
// ============================================================

let studentsData = [];
let currentEditingStudent = null;
let studentToDelete = null;
let isLoadingStudents = false;

function initializeStudentManagement() {
    setTimeout(() => {
        loadStudentsFromDatabase();
        attachStudentEventListeners();
    }, 500);
}

async function loadStudentsFromDatabase() {
    if (isLoadingStudents) return;
    
    isLoadingStudents = true;
    const tbody = document.getElementById('students-table-body');
    
    if (!tbody) {
        isLoadingStudents = false;
        return;
    }
    
    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="padding: 40px; text-align: center; color: #666;">
                <div class="loading-spinner" style="margin: 0 auto 10px;"></div>
                <p>Loading students from database...</p>
            </td>
        </tr>
    `;
    
    try {
        const response = await fetch('../../api/get_students_with_attendance.php');
        const result = await response.json();
        
        if (result.success) {
            studentsData = result.data;
            renderStudentsTable();
            updateStudentStats();
            showToast(`Loaded ${result.total} students successfully`, 'success');
        } else {
            throw new Error(result.message || 'Failed to load students');
        }
    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 40px; text-align: center; color: #dc3545;">
                    <p style="font-size: 18px; margin-bottom: 10px;">Error Loading Students</p>
                    <p style="margin-bottom: 15px;">${error.message}</p>
                    <button class="btn" onclick="loadStudentsFromDatabase()">Retry</button>
                </td>
            </tr>
        `;
        showToast('Failed to load students from database', 'error');
    } finally {
        isLoadingStudents = false;
    }
}

function renderStudentsTable(filteredData = null) {
    const data = filteredData || studentsData;
    const tbody = document.getElementById('students-table-body');
    
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 40px; text-align: center; color: #666;">
                    <p style="font-size: 18px; margin-bottom: 10px;">No students found</p>
                    <p>Click "Add New Student" to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map(student => {
        const attendanceCount = student.attendanceCount || student.attendance.length;
        const totalEvents = getTotalEvents();
        const attendanceRate = totalEvents > 0 ? Math.round((attendanceCount / totalEvents) * 100) : (attendanceCount > 0 ? 100 : 0);
        const statusColor = student.status === 'Active' ? '#28a745' : '#dc3545';
        
        return `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.id}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.email}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${student.year} Year</td>
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
                    <div style="display: flex; gap: 5px; justify-content: center;">
                        <button class="btn" style="font-size: 11px; padding: 6px 10px;" onclick="viewStudentDetails('${student.id}')">View</button>
                        <button class="btn" style="font-size: 11px; padding: 6px 10px; background: #ffc107;" onclick="editStudent('${student.id}')">Edit</button>
                        <button class="btn btn-danger" style="font-size: 11px; padding: 6px 10px;" onclick="confirmDeleteStudent('${student.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateStudentStats() {
    const totalStudents = studentsData.length;
    const activeStudents = studentsData.filter(s => s.status === 'Active').length;
    
    let totalAttendanceEvents = 0;
    studentsData.forEach(student => {
        totalAttendanceEvents += (student.attendanceCount || 0);
    });
    const avgAttendance = totalStudents > 0 ? Math.round(totalAttendanceEvents / totalStudents) : 0;
    
    const totalEl = document.getElementById('total-students-count');
    const activeEl = document.getElementById('active-students-count');
    const avgEl = document.getElementById('avg-attendance');
    
    if (totalEl) totalEl.textContent = totalStudents;
    if (activeEl) activeEl.textContent = activeStudents;
    if (avgEl) avgEl.textContent = avgAttendance + ' events';
}

function getTotalEvents() {
    const uniqueEvents = new Set();
    studentsData.forEach(student => {
        student.attendance.forEach(record => {
            uniqueEvents.add(record.event);
        });
    });
    return uniqueEvents.size || 1;
}

function attachStudentEventListeners() {
    const addBtn = document.getElementById('add-student-btn');
    const searchInput = document.getElementById('student-search');
    const sortSelect = document.getElementById('sort-students');
    const refreshBtn = document.getElementById('refresh-students');
    
    addBtn?.addEventListener('click', () => openStudentModal());
    searchInput?.addEventListener('input', (e) => searchStudents(e.target.value));
    sortSelect?.addEventListener('change', (e) => sortStudents(e.target.value));
    refreshBtn?.addEventListener('click', () => {
        loadStudentsFromDatabase();
        showToast('Refreshing student list...', 'success');
    });
    
    document.getElementById('close-modal')?.addEventListener('click', closeStudentModal);
    document.getElementById('cancel-modal')?.addEventListener('click', closeStudentModal);
    document.getElementById('close-details-modal')?.addEventListener('click', closeDetailsModal);
    document.getElementById('close-details-btn')?.addEventListener('click', closeDetailsModal);
    document.getElementById('cancel-delete')?.addEventListener('click', closeDeleteModal);
    
    document.getElementById('student-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveStudent();
    });
    
    document.getElementById('confirm-delete')?.addEventListener('click', deleteStudent);
    document.getElementById('export-student-report')?.addEventListener('click', exportStudentReport);
}

function openStudentModal(student = null) {
    currentEditingStudent = student;
    const modal = document.getElementById('student-modal');
    const title = document.getElementById('modal-title');
    
    if (!modal) return;
    
    if (student) {
        title.textContent = 'Update Student Information';
        document.getElementById('student-id-hidden').value = student.id;
        document.getElementById('student-id-input').value = student.id;
        document.getElementById('student-id-input').disabled = true;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-email').value = student.email;
        document.getElementById('student-year').value = student.year;
        document.getElementById('student-status').value = student.status;
    } else {
        title.textContent = 'Add New Student';
        document.getElementById('student-form').reset();
        document.getElementById('student-id-input').disabled = false;
    }
    
    modal.style.display = 'block';
    }

function closeStudentModal() {
    const modal = document.getElementById('student-modal');
    if (modal) modal.style.display = 'none';
    document.getElementById('student-form')?.reset();
    currentEditingStudent = null;
}

async function saveStudent() {
    const id = document.getElementById('student-id-input').value.trim();
    const name = document.getElementById('student-name').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const year = document.getElementById('student-year').value;
    const status = document.getElementById('student-status').value;
    
    if (!id || !name || !year) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const nameParts = name.split(' ');
    const studentData = {
        student_id: id,
        first_name: nameParts[0],
        last_name: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
        year_level: year,
        sex: 'Not Specified',
        student_set: '',
        course: '',
        is_update: currentEditingStudent !== null
    };
    
    try {
        const submitBtn = document.querySelector('#student-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = currentEditingStudent ? 'Updating...' : 'Adding...';
        
        const response = await fetch('../../api/save_student.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(result.message, 'success');
            closeStudentModal();
            await loadStudentsFromDatabase();
        } else {
            throw new Error(result.error || 'Failed to save student');
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        const submitBtn = document.querySelector('#student-form button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Student';
        }
    }
}

window.editStudent = function(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) openStudentModal(student);
}

window.confirmDeleteStudent = function(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) {
        studentToDelete = student;
        document.getElementById('delete-student-name').textContent = `${student.name} (${student.id})`;
        document.getElementById('delete-modal').style.display = 'block';
    }
}

async function deleteStudent() {
    if (!studentToDelete) return;
    
    try {
        const deleteBtn = document.getElementById('confirm-delete');
        const originalText = deleteBtn.textContent;
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Deleting...';
        
        const response = await fetch('../../api/delete_student.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentToDelete.id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(`${result.message} (${result.deleted_attendance_records} attendance records removed)`, 'success');
            closeDeleteModal();
            await loadStudentsFromDatabase();
        } else {
            throw new Error(result.error || 'Failed to delete student');
        }
        
        deleteBtn.disabled = false;
        deleteBtn.textContent = originalText;
        
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        const deleteBtn = document.getElementById('confirm-delete');
        if (deleteBtn) {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Delete';
        }
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) modal.style.display = 'none';
    studentToDelete = null;
}

window.viewStudentDetails = function(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('detail-student-id').textContent = student.id;
    document.getElementById('detail-student-name').textContent = student.name;
    document.getElementById('detail-student-email').textContent = student.email;
    document.getElementById('detail-student-year').textContent = student.year + ' Year';
    
    const totalEvents = getTotalEvents();
    const attended = student.attendanceCount || student.attendance.length;
    const attendanceRate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : (attended > 0 ? 100 : 0);
    
    document.getElementById('detail-total-events').textContent = totalEvents;
    document.getElementById('detail-attended').textContent = attended;
    document.getElementById('detail-attendance-rate').textContent = attendanceRate + '%';
    
    const historyBody = document.getElementById('attendance-history-body');
    if (student.attendance.length === 0) {
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
    
    document.getElementById('student-details-modal').style.display = 'block';
    window.currentViewingStudent = student;
}

function closeDetailsModal() {
    const modal = document.getElementById('student-details-modal');
    if (modal) modal.style.display = 'none';
    window.currentViewingStudent = null;
}

function exportStudentReport() {
    if (!window.currentViewingStudent) return;
    
    const student = window.currentViewingStudent;
    const data = [
        ['Student Attendance Report'],
        ['Generated:', new Date().toLocaleString()],
        [''],
        ['Student ID:', student.id],
        ['Name:', student.name],
        ['Email:', student.email],
        ['Year Level:', student.year + ' Year'],
        ['Course:', student.course || 'N/A'],
        ['Status:', student.status],
        [''],
        ['Total Events:', getTotalEvents()],
        ['Events Attended:', student.attendanceCount || student.attendance.length],
        ['Attendance Rate:', (getTotalEvents() > 0 ? Math.round(((student.attendanceCount || student.attendance.length) / getTotalEvents()) * 100) : 0) + '%'],
        [''],
        ['Attendance History'],
        ['Date', 'Event Name', 'Time Scanned', 'Status', 'Remarks']
    ];
    
    student.attendance.forEach(record => {
        data.push([
            record.date, 
            record.event, 
            record.time, 
            record.status,
            record.remarks || ''
        ]);
    });
    
    exportToCSV(data, `${student.id}-${student.name.replace(/\s+/g, '-')}-Attendance-Report.csv`);
    showToast('Report exported successfully', 'success');
}

function searchStudents(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderStudentsTable();
        return;
    }
    
    const filteredStudents = studentsData.filter(student => {
        return student.id.toLowerCase().includes(searchTerm) ||
               student.name.toLowerCase().includes(searchTerm) ||
               student.email.toLowerCase().includes(searchTerm) ||
               student.year.toLowerCase().includes(searchTerm) ||
               (student.course && student.course.toLowerCase().includes(searchTerm));
    });
    
    renderStudentsTable(filteredStudents);
}

function sortStudents(sortType) {
    let sortedData = [...studentsData];
    
    switch(sortType) {
        case 'id-asc':
            sortedData.sort((a, b) => a.id.localeCompare(b.id));
            break;
        case 'id-desc':
            sortedData.sort((a, b) => b.id.localeCompare(a.id));
            break;
        case 'name-asc':
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedData.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'attendance-high':
            sortedData.sort((a, b) => (b.attendanceCount || 0) - (a.attendanceCount || 0));
            break;
        case 'attendance-low':
            sortedData.sort((a, b) => (a.attendanceCount || 0) - (b.attendanceCount || 0));
            break;
    }
    
    renderStudentsTable(sortedData);
    showToast('Students sorted', 'success');
}

// ============================================================
// LOGOUT MODULE
// ============================================================

function initializeLogout() {
    document.querySelector('#logout .btn-danger')?.addEventListener('click', function() {
        window.location.href = "../../sql_php/log_out.php";
    });

    document.querySelector('#logout .btn-secondary')?.addEventListener('click', function() {
        const navButtons = document.querySelectorAll('.nav-button');
        const pages = document.querySelectorAll('.page');
        
        navButtons.forEach(btn => btn.classList.remove('active'));
        navButtons[0].classList.add('active');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById('home').classList.add('active');
    });
}