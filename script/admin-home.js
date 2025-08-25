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

            // Generate custom QR format like: SCC-BASKETBALL-2025, CHESS-CLUB-MEETING-AUG2025, etc.
            function generateEventQRFormat(eventData) {
                const eventName = eventData.name.toUpperCase();
                const eventType = eventData.type;
                const eventDate = new Date(eventData.date);
                
                // Clean and format event name (remove special characters, replace spaces with hyphens)
                const cleanEventName = eventName
                    .replace(/[^A-Z0-9\s]/g, '') // Remove special characters
                    .replace(/\s+/g, '-')        // Replace spaces with hyphens
                    .replace(/-+/g, '-');        // Replace multiple hyphens with single
                
                // Generate date suffix
                const year = eventDate.getFullYear();
                const month = eventDate.toLocaleString('en', { month: 'short' }).toUpperCase();
                const day = String(eventDate.getDate()).padStart(2, '0');
                
                // Different formats based on event type and name
                let qrFormat = '';
                
                if (eventType === 'BASKETBALL') {
                    if (cleanEventName.includes('TOURNAMENT')) {
                        qrFormat = `SCC-BASKETBALL-${year}`;
                    } else {
                        qrFormat = `BASKETBALL-TRAINING-${year}`;
                    }
                }
                else if (eventType === 'CHESS') {
                    if (cleanEventName.includes('CLUB') || cleanEventName.includes('MEETING')) {
                        qrFormat = `CHESS-CLUB-MEETING-${month}${year}`;
                    } else {
                        qrFormat = `CHESS-TOURNAMENT-${year}`;
                    }
                }
                else if (eventType === 'VOLLEYBALL') {
                    qrFormat = `VOLLEYBALL-TRAINING-${year}`;
                }
                else if (eventType === 'STUDENT-COUNCIL') {
                    qrFormat = `STUDENT-COUNCIL-SESSION`;
                }
                else if (eventType === 'WORKSHOP') {
                    if (cleanEventName.includes('SCIENCE') || cleanEventName.includes('LAB')) {
                        qrFormat = `SCIENCE-EXPERIMENT-LAB`;
                    } else if (cleanEventName.includes('COMPUTER') || cleanEventName.includes('TECH')) {
                        qrFormat = `TECH-WORKSHOP-${month}${year}`;
                    } else {
                        qrFormat = `WORKSHOP-${eventType}-${year}`;
                    }
                }
                else if (eventType === 'SEMINAR') {
                    if (cleanEventName.includes('CAREER')) {
                        qrFormat = `CAREER-SEMINAR-${month}${year}`;
                    } else {
                        qrFormat = `SEMINAR-${month}${year}`;
                    }
                }
                else if (eventType === 'DEBATE') {
                    qrFormat = `DEBATE-COMPETITION-${year}`;
                }
                else if (eventType === 'COMPETITION') {
                    if (cleanEventName.includes('DRAMA')) {
                        qrFormat = `DRAMA-REHEARSAL-${year}${month}${day}`;
                    } else if (cleanEventName.includes('MUSIC')) {
                        qrFormat = `MUSIC-BAND-PRACTICE`;
                    } else {
                        qrFormat = `COMPETITION-${month}${year}`;
                    }
                }
                else if (eventType === 'CLUB') {
                    if (cleanEventName.includes('MUSIC') || cleanEventName.includes('BAND')) {
                        qrFormat = `MUSIC-BAND-PRACTICE`;
                    } else if (cleanEventName.includes('DRAMA') || cleanEventName.includes('THEATER')) {
                        qrFormat = `DRAMA-REHEARSAL-${year}${month}${day}`;
                    } else if (cleanEventName.includes('SCIENCE')) {
                        qrFormat = `SCIENCE-EXPERIMENT-LAB`;
                    } else {
                        // Generic club format
                        const clubName = cleanEventName.replace('-CLUB', '').replace('-MEETING', '');
                        qrFormat = `${clubName}-CLUB-${month}${year}`;
                    }
                }
                else {
                    // Default format for other event types
                    qrFormat = `${cleanEventName}-${year}`;
                }
                
                return qrFormat;
            }

            // Enhanced attendance tracking
            function initializeAttendanceSession() {
                currentSessionActive = true;
                attendanceData = []; // Reset for new session
                updateAttendanceStats(0, 0);
                
                // Add session info to event data
                if (currentEventData) {
                    currentEventData.sessionActive = true;
                    currentEventData.attendanceData = attendanceData;
                }
            }

            // Simulate QR code scanning (like test.php manual entry)
            function simulateQRScan(studentName, qrCode) {
                if (!currentSessionActive) {
                    showToast('No active session. Please generate QR code first.', 'error');
                    return;
                }

                const now = new Date();
                const attendanceRecord = {
                    id: Date.now(),
                    name: studentName,
                    sessionId: currentEventData.id,
                    qrCode: qrCode,
                    timestamp: now.toISOString(),
                    date: now.toLocaleDateString(),
                    time: now.toLocaleTimeString()
                };

                // Check for duplicates
                const existingRecord = attendanceData.find(record =>
                    record.name.toLowerCase() === studentName.toLowerCase()
                );

                if (existingRecord) {
                    showToast('Student already marked attendance!', 'error');
                    return;
                }

                attendanceData.push(attendanceRecord);
                addAttendanceRow(attendanceRecord);
                updateAttendanceStats(attendanceData.length, attendanceData.length);
                
                return attendanceRecord;
            }

            // Add attendance row to table
            function addAttendanceRow(record) {
                const attendanceList = document.getElementById('attendance-list');
                
                // Remove "waiting" message if it exists
                if (attendanceList.children.length === 1 && 
                    attendanceList.children[0].children.length === 1) {
                    attendanceList.innerHTML = '';
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${record.time}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">STU-${String(attendanceData.length).padStart(3, '0')}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${record.name}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 12px;">${record.qrCode}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">
                        <span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Present</span>
                    </td>
                `;
                
                attendanceList.appendChild(row);
            }

            // Event form submission
            document.getElementById('event-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const eventName = document.getElementById('event-name').value;
                const eventDate = document.getElementById('event-date').value;
                const eventType = document.getElementById('event-type').value;
                const eventDescription = document.getElementById('event-description').value;
                const maxParticipants = document.getElementById('max-participants').value;

                // Generate unique event ID
                const eventId = generateEventId();
                
                // Create event data object
                currentEventData = {
                    id: eventId,
                    name: eventName,
                    date: eventDate,
                    type: eventType,
                    description: eventDescription,
                    maxParticipants: maxParticipants,
                    createdAt: new Date().toISOString()
                };

                // Generate QR code data (simplified approach like test.php)
                const qrCodeData = eventId; // Use event ID as QR data
                
                // Generate QR Code using the test.php approach
                generateQRCode(currentEventData);
                
                // Initialize attendance session (like test.php)
                initializeAttendanceSession();
                
                // Show QR section and hide form
                document.getElementById('qr-section').style.display = 'block';
                document.getElementById('event-form').style.display = 'none';
                
                // Show success toast
                showToast('Event created successfully!', 'success');
            });

            // Generate unique event ID
            function generateEventId() {
                const timestamp = Date.now();
                const randomNum = Math.floor(Math.random() * 10000);
                return `EVT-${timestamp}-${randomNum}`;
            }

            // Generate QR Code using QRCode.js library (inspired by test.php admin approach)
            function generateQRCode(eventData) {
                const qrContainer = document.getElementById('qr-code-container');
                const qrTextElement = document.getElementById('qr-code-text');
                
                // Clear previous QR code
                qrContainer.innerHTML = '';
                
                // Generate custom QR data format based on event details
                const qrCodeData = generateEventQRFormat(currentEventData);
                
                if (typeof QRCode === 'undefined') {
                    console.error('QRCode library not loaded.');
                    qrContainer.innerHTML = '<p style="color: red;">QR Code library missing</p>';
                    showToast('QR Code library not found', 'error');
                    return;
                }

                // Generate QR code using the same approach as test.php
                QRCode.toCanvas(qrCodeData, {
                    width: 200,
                    height: 200,
                    margin: 2,
                    color: {
                        dark: '#0066cc',  // Blue QR code to match theme
                        light: '#FFFFFF' // White background
                    }
                }, function (error, canvas) {
                    if (error) {
                        console.error('QR Code generation failed:', error);
                        qrContainer.innerHTML = '<p style="color: red;">Error generating QR code</p>';
                        showToast('Failed to generate QR code', 'error');
                        return;
                    }
                    
                    // Append canvas to container
                    qrContainer.appendChild(canvas);
                    
                    // Display QR code data text
                    qrTextElement.textContent = qrCodeData;
                    
                    console.log('QR Code generated successfully');
                    showToast('QR Code generated successfully!', 'success');
                });
            }

            // Download QR Code functionality
            document.getElementById('download-qr').addEventListener('click', function() {
                const canvas = document.querySelector('#qr-code-container canvas');
                if (canvas) {
                    const link = document.createElement('a');
                    link.download = `${currentEventData.name}-QRCode.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                    showToast('QR Code downloaded successfully!', 'success');
                } else {
                    showToast('No QR code to download', 'error');
                }
            });

            // Copy QR Code data functionality
            document.getElementById('copy-qr-code').addEventListener('click', function() {
                const qrText = document.getElementById('qr-code-text').textContent;
                navigator.clipboard.writeText(qrText).then(function() {
                    showToast('QR Code data copied to clipboard!', 'success');
                }).catch(function(err) {
                    console.error('Could not copy text: ', err);
                    showToast('Failed to copy QR code data', 'error');
                });
            });

            // View Event Page functionality
            document.getElementById('view-event-page').addEventListener('click', function() {
                if (currentEventData) {
                    // Switch to event attendance page
                    showEventAttendancePage(currentEventData);
                } else {
                    showToast('No event data available', 'error');
                }
            });

            // Create New Event functionality (enhanced like test.php clear function)
            document.getElementById('create-new-event').addEventListener('click', function() {
                // Reset form and show it again
                document.getElementById('event-form').reset();
                document.getElementById('event-form').style.display = 'block';
                document.getElementById('qr-section').style.display = 'none';
                
                // Reset session data
                currentEventData = null;
                currentSessionActive = false;
                attendanceData = [];
                
                showToast('Ready to create a new event', 'success');
            });

            // Show Event Attendance Page
            function showEventAttendancePage(eventData) {
                // Update attendance page title and info
                document.getElementById('attendance-event-title').textContent = eventData.name;
                document.getElementById('attendance-event-subtitle').textContent = `Track attendance for ${eventData.type} event`;
                
                const eventInfo = document.getElementById('event-info');
                eventInfo.innerHTML = `
                    <strong>Date:</strong> ${new Date(eventData.date).toLocaleString()}<br>
                    <strong>Type:</strong> ${eventData.type}<br>
                    <strong>Max Participants:</strong> ${eventData.maxParticipants || 'Unlimited'}<br>
                    <strong>Event ID:</strong> ${eventData.id}
                `;

                // Hide all pages and show attendance page
                pages.forEach(page => page.classList.remove('active'));
                document.getElementById('event-attendance').classList.add('active');

                // Update navigation
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                // Simulate some initial data
                updateAttendanceStats(0, 0);
                
                // Start simulating real-time attendance (for demo purposes)
                simulateAttendanceUpdates();
            }

            // Update attendance statistics
            function updateAttendanceStats(registered, present) {
                document.getElementById('total-registered').textContent = registered;
                document.getElementById('total-present').textContent = present;
                
                const attendanceRate = registered > 0 ? Math.round((present / registered) * 100) : 0;
                document.getElementById('attendance-rate').textContent = attendanceRate + '%';
            }

            // Enhanced simulation with better logic (inspired by test.php)
            function simulateAttendanceUpdates() {
                const attendanceList = document.getElementById('attendance-list');
                
                // Clear existing content
                attendanceList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #666;">Waiting for students to scan QR code...</td></tr>';

                const studentNames = [
                    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown',
                    'Emily Davis', 'Chris Miller', 'Lisa Garcia', 'Kevin Martinez', 'Amy Rodriguez',
                    'Daniel Lee', 'Jessica Taylor', 'Matthew Anderson', 'Ashley Thompson', 'Ryan White',
                    'Hannah Martin', 'Brandon Clark', 'Samantha Lewis', 'Justin Hall', 'Megan Walker'
                ];

                let currentIndex = 0;

                const simulateNextStudent = () => {
                    if (currentIndex < Math.min(studentNames.length, 15)) { // Limit to 15 students for demo
                        const studentName = studentNames[currentIndex];
                        const qrCode = `QR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
                        
                        // Simulate QR scan
                        simulateQRScan(studentName, qrCode);
                        
                        currentIndex++;
                        
                        // Continue simulation with random delay
                        setTimeout(simulateNextStudent, Math.random() * 3000 + 1000); // 1-4 seconds
                    } else {
                        showToast('Demo simulation completed!', 'success');
                    }
                };

                // Start simulation after a short delay
                setTimeout(simulateNextStudent, 2000);
            }

            // Back to Events functionality
            document.getElementById('back-to-events').addEventListener('click', function() {
                // Go back to start-event page
                pages.forEach(page => page.classList.remove('active'));
                document.getElementById('start-event').classList.add('active');
                
                // Update navigation
                navButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelector('[data-page="start-event"]').classList.add('active');
            });

            // Export Attendance functionality
            document.getElementById('export-attendance').addEventListener('click', function() {
                if (currentEventData) {
                    const attendanceData = gatherAttendanceData();
                    exportToCSV(attendanceData, `${currentEventData.name}-Attendance.csv`);
                    showToast('Attendance data exported successfully!', 'success');
                } else {
                    showToast('No event data to export', 'error');
                }
            });

            // Gather attendance data for export (enhanced)
            function gatherAttendanceData() {
                if (!currentEventData || !attendanceData.length) {
                    return [['Time', 'Student ID', 'Name', 'QR Code', 'Status']];
                }

                const data = [];
                
                // Add header with event info
                data.push(['Event Name:', currentEventData.name]);
                data.push(['Event Type:', currentEventData.type]);
                data.push(['Event Date:', new Date(currentEventData.date).toLocaleString()]);
                data.push(['Session ID:', currentEventData.id]);
                data.push(['']); // Empty row
                
                // Add attendance header
                data.push(['Time', 'Student ID', 'Name', 'QR Code', 'Status']);
                
                // Add attendance records
                attendanceData.forEach((record, index) => {
                    data.push([
                        record.time,
                        `STU-${String(index + 1).padStart(3, '0')}`,
                        record.name,
                        record.qrCode,
                        'Present'
                    ]);
                });
                
                return data;
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

            // Toast notification system
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
            // ===== END START EVENT FUNCTIONALITY =====

            // Handle logout confirmation
            document.querySelector('#logout .btn-danger').addEventListener('click', function() {
                window.location.href= "../../index.php";
            });

            document.querySelector('#logout .btn-secondary').addEventListener('click', function() {
                // Go back to home page
                navButtons.forEach(btn => btn.classList.remove('active'));
                navButtons[0].classList.add('active');
                pages.forEach(page => page.classList.remove('active'));
                document.getElementById('home').classList.add('active');
            });
        });