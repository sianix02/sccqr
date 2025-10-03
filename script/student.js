// Toast notification system - MOVED TO GLOBAL SCOPE
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    // Sidebar navigation
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            const targetPage = this.getAttribute('data-page');
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
            }

            // Close mobile sidebar after selection
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });

    // Mobile menu toggle
    function openMobileSidebar() {
        sidebar.classList.add('mobile-open');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', function() {
        if (sidebar.classList.contains('mobile-open')) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
    });

    // Close sidebar when clicking overlay
    mobileOverlay.addEventListener('click', closeMobileSidebar);

    // Close sidebar on window resize to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });

    // Enhanced Chart with Chart.js
    const ctx = document.getElementById('enhancedChart').getContext('2d');
    
    // Chart data with multiple datasets
    const chartData = {
        '6months': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Student Attendance',
                    data: [85, 92, 78, 96, 89, 94],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#0066cc',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Event Participation',
                    data: [62, 75, 84, 73, 91, 88],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Course Completion',
                    data: [70, 68, 82, 87, 85, 90],
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffc107',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }
            ]
        },
        '3months': {
            labels: ['Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Student Attendance',
                    data: [96, 89, 94],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#0066cc',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Event Participation',
                    data: [73, 91, 88],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Course Completion',
                    data: [87, 85, 90],
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffc107',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }
            ]
        },
        '1year': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Student Attendance',
                    data: [78, 85, 92, 78, 96, 89, 94, 87, 91, 95, 88, 93],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#0066cc',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Event Participation',
                    data: [55, 62, 75, 84, 73, 91, 88, 82, 86, 79, 84, 89],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Course Completion',
                    data: [65, 70, 68, 82, 87, 85, 90, 88, 92, 89, 91, 94],
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffc107',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }
            ]
        }
    };

    let enhancedChart = new Chart(ctx, {
        type: 'line',
        data: chartData['6months'],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 13,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#0066cc',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Months',
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        color: '#666'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#666'
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage (%)',
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#666',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#ffffff'
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });

    // Time range selector functionality
    document.getElementById('timeRange').addEventListener('change', function(e) {
        const selectedRange = e.target.value;
        enhancedChart.data = chartData[selectedRange];
        enhancedChart.update('active');
    });

    // Global variables for event management
    let currentEventData = null;
    let currentSessionActive = false;
    let attendanceData = [];

    // Enhanced attendance tracking
    function initializeAttendanceSession() {
        currentSessionActive = true;
        attendanceData = [];
        updateAttendanceStats(0, 0);
        
        if (currentEventData) {
            currentEventData.sessionActive = true;
            currentEventData.attendanceData = attendanceData;
        }
    }

    // Enhanced QR Code generation
    function generateQRCode(eventData) {
        const qrContainer = document.getElementById('qr-code-container');
        const qrTextElement = document.getElementById('qr-code-text');
        
        qrContainer.innerHTML = '';
        
        const qrCodeData = "SIBONGA-"+ (eventData.name.trim()).toUpperCase()+"-"+ new Date(eventData.date).toLocaleTimeString();
        
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded.');
            qrContainer.innerHTML = '<p style="color: red;">QR Code library missing</p>';
            showToast('QR Code library not found', 'error');
            return;
        }

        QRCode.toCanvas(qrCodeData, {
            width: 250,
            height: 250,
            margin: 3,
            color: {
                dark: '#0066cc',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            scale: 4
        }, function (error, canvas) {
            if (error) {
                console.error('QR Code generation failed:', error);
                qrContainer.innerHTML = '<p style="color: red;">Error generating QR code</p>';
                showToast('Failed to generate QR code', 'error');
                return;
            }
            
            canvas.style.borderRadius = '12px';
            canvas.style.boxShadow = '0 8px 25px rgba(0, 102, 204, 0.15)';
            canvas.style.border = '3px solid #f0f8ff';
            
            qrContainer.appendChild(canvas);
            qrTextElement.textContent = qrCodeData;
            
            const eventInfoDiv = document.createElement('div');
            eventInfoDiv.style.marginTop = '15px';
            eventInfoDiv.style.padding = '12px';
            eventInfoDiv.style.backgroundColor = '#e8f4fd';
            eventInfoDiv.style.borderRadius = '8px';
            eventInfoDiv.style.fontSize = '14px';
            eventInfoDiv.style.color = '#004080';
            eventInfoDiv.innerHTML = `
                <strong>Event Details:</strong><br>
                <strong>Type:</strong> ${eventData.type}<br>
                <strong>Date:</strong> ${new Date(eventData.date).toLocaleString()}<br>
                <strong>Max Participants:</strong> ${eventData.maxParticipants || 'Unlimited'}
            `;
            
            qrTextElement.parentNode.insertBefore(eventInfoDiv, qrTextElement.nextSibling);
            
            console.log('QR Code generated successfully with event name:', qrCodeData);
            showToast('QR Code generated successfully!', 'success');
        });
    }

    // Continue with rest of the code (event form, attendance tracking, etc.)
    // ... rest of your existing admin-home.js code ...
    
    // Handle logout confirmation
    document.querySelector('#logout .btn-danger').addEventListener('click', function() {
        window.location.href= "../../index.php";
    });

    document.querySelector('#logout .btn-secondary').addEventListener('click', function() {
        navButtons.forEach(btn => btn.classList.remove('active'));
        navButtons[0].classList.add('active');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById('home').classList.add('active');
    });
});

// STUDENT MANAGEMENT - remains the same
// ... (keep all your existing student management code)