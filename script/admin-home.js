// ============================================================
// COMPLETE ADMIN-HOME.JS FILE - UPDATED VERSION
// ============================================================

// ============================================================
// GLOBAL UTILITIES
// ============================================================

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

// PDF Header Helper Function
function addPDFHeader(doc) {
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 8.5, 1.8, 'F');

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.02);
    doc.circle(1.0, 0.9, 0.35, 'S');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('LOGO', 1.0, 0.92, { align: 'center' });

    doc.circle(7.5, 0.9, 0.35, 'S');
    doc.text('LOGO', 7.5, 0.92, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Republic of the Philippines', 4.25, 0.4, { align: 'center' });
    doc.text('Province of Cebu', 4.25, 0.55, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SIBONGA COMMUNITY COLLEGE', 4.25, 0.8, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Poblacion, Sibonga, Cebu', 4.25, 0.98, { align: 'center' });
    doc.text('Tel. No.: (032) 485-9405', 4.25, 1.13, { align: 'center' });
    doc.text('Email: sibongacommunitycollege@gmail.com', 4.25, 1.28, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('QR CODE ATTENDANCE MONITORING SYSTEM', 4.25, 1.55, { align: 'center' });
}

// Export to PDF
function exportToPDF(data, filename, title = 'Report') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [8.5, 13]
    });

    addPDFHeader(doc);

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(title, 4.25, 2.3, { align: 'center' });

    if (data.length > 0) {
        const headers = [data[0]];
        const body = data.slice(1);

        doc.autoTable({
            startY: 2.6,
            head: headers,
            body: body,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 0.08
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250]
            },
            margin: { left: 0.5, right: 0.5 }
        });
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 4.25, 12.7, { align: 'center' });
        doc.text(`Sibonga Community College - Attendance System`, 4.25, 12.85, { align: 'center' });
    }

    doc.save(filename.replace('.csv', '.pdf'));
    showToast('Data exported successfully!', 'success');
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

function initializeEventManagement() {
    document.getElementById('event-form')?.addEventListener('submit', handleEventSubmit);
    document.getElementById('download-qr')?.addEventListener('click', downloadQRCode);
    document.getElementById('create-new-event')?.addEventListener('click', createNewEvent);
}

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const eventType = document.getElementById('event-type').value;
    const eventDescription = document.getElementById('event-description').value;
    
    // Generate QR code data
    const qrCodeData = `SIBONGA-${eventName.trim().toUpperCase()}-${new Date(eventDate).toLocaleTimeString()}`;
    
    currentEventData = {
        name: eventName,
        date: eventDate,
        type: eventType,
        description: eventDescription,
        qrCodeData: qrCodeData,
        createdAt: new Date().toISOString()
    };

    // Save event to database first
    try {
        const response = await fetch('../../api/save_event.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_name: eventName,
                event_date: eventDate,
                event_type: eventType,
                event_description: eventDescription,
                qr_code_data: qrCodeData
            })
        });

        const result = await response.json();

        if (result.success) {
            currentEventData.id = result.event_id;
            
            // Generate and display QR code
            generateQRCode(currentEventData);
            
            document.getElementById('qr-section').style.display = 'block';
            document.getElementById('event-form').style.display = 'none';
            
            showToast('Event created and saved successfully!', 'success');
        } else {
            throw new Error(result.error || 'Failed to save event');
        }
    } catch (error) {
        console.error('Error saving event:', error);
        showToast('Error: ' + error.message, 'error');
    }
}

function generateQRCode(eventData) {
    const qrContainer = document.getElementById('qr-code-container');
    const qrTextElement = document.getElementById('qr-code-text');
    
    qrContainer.innerHTML = '';
    
    const qrCodeData = eventData.qrCodeData;
    
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
            <strong>Date:</strong> ${new Date(eventData.date).toLocaleString()}
        `;
        qrTextElement.parentNode.insertBefore(eventInfoDiv, qrTextElement.nextSibling);
        
        showToast('QR Code generated successfully!', 'success');
    });
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

function createNewEvent() {
    document.getElementById('event-form').reset();
    document.getElementById('event-form').style.display = 'block';
    document.getElementById('qr-section').style.display = 'none';
    
    document.getElementById('qr-code-container').innerHTML = '';
    document.getElementById('qr-code-text').textContent = '';
    
    currentEventData = null;
    
    showToast('Ready to create a new event', 'success');
}

// ============================================================
// STUDENT MANAGEMENT MODULE
// ============================================================

let studentsData = [];
let currentEditingStudent = null;
let studentToDelete = null;
let isLoadingStudents = false;
let selectedStudents = new Set();

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
            <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
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
                <td colspan="8" style="padding: 40px; text-align: center; color: #dc3545;">
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
                <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                    <p style="font-size: 18px; margin-bottom: 10px;">No students found</p>
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
    const searchInput = document.getElementById('student-search');
    const sortSelect = document.getElementById('sort-students');
    const refreshBtn = document.getElementById('refresh-students');
    
    searchInput?.addEventListener('input', (e) => searchStudents(e.target.value));
    sortSelect?.addEventListener('change', (e) => sortStudents(e.target.value));
    refreshBtn?.addEventListener('click', () => {
        selectedStudents.clear();
        loadStudentsFromDatabase();
        showToast('Refreshing student list...', 'success');
    });
    
    document.getElementById('close-modal')?.addEventListener('click', closeStudentModal);
    document.getElementById('cancel-modal')?.addEventListener('click', closeStudentModal);
    document.getElementById('close-details-modal')?.addEventListener('click', closeDetailsModal);
    document.getElementById('close-details-btn')?.addEventListener('click', closeDetailsModal);
    
    document.getElementById('student-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveStudent();
    });
    
    document.getElementById('export-student-report')?.addEventListener('click', exportStudentReport);
}

function openStudentModal(student = null) {
    currentEditingStudent = student;
    const modal = document.getElementById('student-modal');
    const title = document.getElementById('modal-title');
    
    if (!modal) return;
    
    if (student) {
        title.textContent = 'Edit Student Information';
        document.getElementById('student-id-hidden').value = student.id;
        document.getElementById('student-id-input').value = student.id;
        document.getElementById('student-id-input').disabled = true;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-set').value = student.email;
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
    const studentSet = document.getElementById('student-set').value.trim();
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
        student_set: studentSet,
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

window.viewStudentDetails = function(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('detail-student-id').textContent = student.id;
    document.getElementById('detail-student-name').textContent = student.name;
    document.getElementById('detail-student-set').textContent = student.email;
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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [8.5, 13]
    });

    addPDFHeader(doc);

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Student Attendance Report', 4.25, 2.3, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Student Information:', 0.5, 2.7);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const infoY = 2.9;
    const lineHeight = 0.18;
    doc.text(`Student ID: ${student.id}`, 0.5, infoY);
    doc.text(`Name: ${student.name}`, 0.5, infoY + lineHeight);
    doc.text(`Set: ${student.email}`, 0.5, infoY + lineHeight * 2);
    doc.text(`Year Level: ${student.year} Year`, 0.5, infoY + lineHeight * 3);
    doc.text(`Course: ${student.course || 'N/A'}`, 0.5, infoY + lineHeight * 4);
    doc.text(`Status: ${student.status}`, 0.5, infoY + lineHeight * 5);

    const totalEvents = getTotalEvents();
    const attended = student.attendanceCount || student.attendance.length;
    const attendanceRate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : (attended > 0 ? 100 : 0);

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Attendance Summary:', 4.5, 2.7);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Events: ${totalEvents}`, 4.5, infoY);
    doc.text(`Events Attended: ${attended}`, 4.5, infoY + lineHeight);
    doc.text(`Attendance Rate: ${attendanceRate}%`, 4.5, infoY + lineHeight * 2);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 4.5, infoY + lineHeight * 3);

    if (student.attendance && student.attendance.length > 0) {
        const tableData = student.attendance.map(record => [
            record.date,
            record.event,
            record.time,
            record.status,
            record.remarks || ''
        ]);

        doc.autoTable({
            startY: 4.2,
            head: [['Date', 'Event Name', 'Time Scanned', 'Status', 'Remarks']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 0.08
            },
            columnStyles: {
                0: { cellWidth: 1.0 },
                1: { cellWidth: 2.5 },
                2: { cellWidth: 1.0 },
                3: { cellWidth: 0.9, halign: 'center' },
                4: { cellWidth: 1.1 }
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250]
            },
            didParseCell: function(data) {
                if (data.section === 'body' && data.column.index === 3) {
                    const status = data.cell.raw;
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
            margin: { left: 0.5, right: 0.5 }
        });
    } else {
        doc.setFontSize(10);
        doc.text('No attendance records found for this student.', 4.25, 4.5, { align: 'center' });
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 4.25, 12.7, { align: 'center' });
        doc.text(`Sibonga Community College - Attendance System`, 4.25, 12.85, { align: 'center' });
    }

    const filename = `${student.id}-${student.name.replace(/\s+/g, '-')}-Attendance-Report.pdf`;
    doc.save(filename);
    
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
    const logoutBtn = document.querySelector('#logout .btn-danger');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('Logout button clicked');
            
            this.textContent = 'Logging out...';
            this.disabled = true;
            
            const logoutPath = "../../sql_php/log_out.php";
            
            console.log('Redirecting to:', logoutPath);
            console.log('Current URL:', window.location.href);
            
            window.location.href = logoutPath;
        });
    } else {
        console.error('Logout button not found!');
    }

    const cancelBtn = document.querySelector('#logout .btn-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            console.log('Cancel button clicked - returning to home');
            
            const navButtons = document.querySelectorAll('.nav-button');
            const pages = document.querySelectorAll('.page');
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            if (navButtons[0]) navButtons[0].classList.add('active');
            
            pages.forEach(page => page.classList.remove('active'));
            const homePage = document.getElementById('home');
            if (homePage) homePage.classList.add('active');
        });
    } else {
        console.error('Cancel button not found!');
    }
}