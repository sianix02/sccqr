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