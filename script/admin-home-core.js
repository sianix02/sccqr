// ============================================================
// ADMIN-HOME-CORE.JS - Core Utilities & Analytics
// Part 1: Global utilities, navigation, charts, and events
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
    console.log('🚀 Initializing Admin Dashboard...');
    
    initializeNavigation();
    initializeChart();
    initializeEventManagement();
    initializeLogout();
    
    console.log('✅ Admin Dashboard initialized successfully');
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
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    function openMobileSidebar() {
        if (sidebar) {
            sidebar.classList.add('mobile-open');
        }
        if (mobileOverlay) {
            mobileOverlay.classList.add('active');
        }
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

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileSidebar);
    }

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
    
    const timeRangeEl = document.getElementById('timeRange');
    if (timeRangeEl) {
        timeRangeEl.addEventListener('change', () => {
            updateChartTimeRange();
        });
    }
    
    const refreshChartBtn = document.getElementById('refreshChart');
    if (refreshChartBtn) {
        refreshChartBtn.addEventListener('click', () => {
            loadAnalyticsData();
            showToast('Refreshing analytics data...', 'success');
        });
    }
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
    const statElements = {
        'stat-total-students': stats.total_students || 0,
        'stat-total-instructors': stats.total_instructors || 0,
        'stat-total-events': stats.total_events || 0,
        'stat-engagement-rate': (stats.engagement_rate || 0) + '%'
    };
    
    Object.keys(statElements).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = statElements[id];
        }
    });
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
    
    const timeRangeEl = document.getElementById('timeRange');
    if (!timeRangeEl) return;
    
    const months = parseInt(timeRangeEl.value);
    
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
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }
    
    const downloadQrBtn = document.getElementById('download-qr');
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', downloadQRCode);
    }
    
    const createNewEventBtn = document.getElementById('create-new-event');
    if (createNewEventBtn) {
        createNewEventBtn.addEventListener('click', createNewEvent);
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const eventType = document.getElementById('event-type').value;
    const eventDescription = document.getElementById('event-description').value;
    
    const qrCodeData = `SIBONGA-${eventName.trim().toUpperCase()}-${new Date(eventDate).toLocaleTimeString()}`;
    
    currentEventData = {
        name: eventName,
        date: eventDate,
        type: eventType,
        description: eventDescription,
        qrCodeData: qrCodeData,
        createdAt: new Date().toISOString()
    };

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
            generateQRCode(currentEventData);
            
            const qrSection = document.getElementById('qr-section');
            const eventForm = document.getElementById('event-form');
            
            if (qrSection) qrSection.style.display = 'block';
            if (eventForm) eventForm.style.display = 'none';
            
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
    
    if (!qrContainer) return;
    
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
        
        if (qrTextElement) {
            qrTextElement.textContent = qrCodeData;
        }
        
        const eventInfoDiv = document.createElement('div');
        eventInfoDiv.style.cssText = 'margin-top: 15px; padding: 12px; background-color: #e8f4fd; border-radius: 8px; font-size: 14px; color: #004080;';
        eventInfoDiv.innerHTML = `
            <strong>Event Details:</strong><br>
            <strong>Type:</strong> ${eventData.type}<br>
            <strong>Date:</strong> ${new Date(eventData.date).toLocaleString()}
        `;
        
        if (qrTextElement && qrTextElement.parentNode) {
            qrTextElement.parentNode.insertBefore(eventInfoDiv, qrTextElement.nextSibling);
        }
        
        showToast('QR Code generated successfully!', 'success');
    });
}

function downloadQRCode() {
    const canvas = document.querySelector('#qr-code-container canvas');
    if (canvas && currentEventData) {
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
    const eventForm = document.getElementById('event-form');
    const qrSection = document.getElementById('qr-section');
    const qrContainer = document.getElementById('qr-code-container');
    const qrText = document.getElementById('qr-code-text');
    
    if (eventForm) {
        eventForm.reset();
        eventForm.style.display = 'block';
    }
    
    if (qrSection) qrSection.style.display = 'none';
    if (qrContainer) qrContainer.innerHTML = '';
    if (qrText) qrText.textContent = '';
    
    currentEventData = null;
    showToast('Ready to create a new event', 'success');
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
    }
}