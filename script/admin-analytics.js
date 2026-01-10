
// ============================================================
// MODULE STATE
// ============================================================

let analyticsChart = null;
let currentChartView = 'line';
let currentFilter = 'all';
let analyticsData = null;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================
// NUMBER ANIMATION
// ============================================================

function animateNumber(element, target, duration = 1500) {
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// ============================================================
// PROGRESS RING ANIMATION
// ============================================================

function setProgressRing(ringId, textId, percentage) {
    const ring = document.getElementById(ringId);
    const text = document.getElementById(textId);
    
    if (!ring || !text) return;
    
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percentage / 100) * circumference;
    
    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
        animateNumber(text, percentage, 1500);
        text.textContent = percentage + '%';
    }, 300);
}

// ============================================================
// INSIGHTS GENERATION
// ============================================================

function generateInsights(data) {
    const insights = [];
    
    // Engagement insight
    if (data.stats.engagement_rate > 75) {
        insights.push(`🎉 Excellent! ${data.stats.engagement_rate}% student engagement - above target!`);
    } else if (data.stats.engagement_rate > 50) {
        insights.push(`📈 Good progress: ${data.stats.engagement_rate}% engagement. Keep improving!`);
    } else {
        insights.push(`⚠️ Low engagement at ${data.stats.engagement_rate}%. Consider engagement strategies.`);
    }
    
    // On-time rate insight
    if (data.stats.on_time_rate > 80) {
        insights.push(`⏰ Great punctuality! ${data.stats.on_time_rate}% on-time attendance.`);
    } else {
        insights.push(`⏰ ${data.stats.on_time_rate}% on-time rate. Consider timing adjustments.`);
    }
    
    // Event participation
    if (data.stats.total_events > 0) {
        const avgAttendeesPerEvent = Math.round(data.stats.total_attendance_records / data.stats.total_events);
        insights.push(`📊 Average ${avgAttendeesPerEvent} attendees per event across ${data.stats.total_events} events.`);
    }
    
    // Top performing course (if available)
    if (data.chartData && data.chartData.datasets) {
        const courses = Object.keys(data.chartData.datasets);
        if (courses.length > 0) {
            const topCourse = courses.reduce((max, course) => {
                const total = data.chartData.datasets[course].total.reduce((a, b) => a + b, 0);
                const maxTotal = data.chartData.datasets[max]?.total.reduce((a, b) => a + b, 0) || 0;
                return total > maxTotal ? course : max;
            }, courses[0]);
            insights.push(`🏆 ${topCourse} leads with highest participation rates!`);
        }
    }
    
    return insights;
}

function renderInsights(insights) {
    const container = document.getElementById('insights-container');
    if (!container) return;
    
    container.innerHTML = insights.map(insight => 
        `<div class="insight-item">${insight}</div>`
    ).join('');
}

// ============================================================
// DASHBOARD STATS UPDATE
// ============================================================

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
            // Use animation for numeric values
            if (typeof statElements[id] === 'number') {
                animateNumber(el, statElements[id]);
            } else {
                el.textContent = statElements[id];
            }
        }
    });
    
    // Set progress rings if elements exist
    const attendanceRate = Math.round((stats.present_count + stats.late_count) / stats.total_attendance_records * 100);
    setProgressRing('ring-attendance', 'ring-attendance-text', attendanceRate || 0);
    setProgressRing('ring-ontime', 'ring-ontime-text', Math.round(stats.on_time_rate) || 0);
    setProgressRing('ring-engagement', 'ring-engagement-text', Math.round(stats.engagement_rate) || 0);
    
    // Update comparison cards if they exist
    const compareElements = {
        'compare-present': stats.present_count,
        'compare-late': stats.late_count,
        'compare-absent': stats.absent_count
    };
    
    Object.keys(compareElements).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = compareElements[id];
        }
    });
}

// ============================================================
// CHART RENDERING
// ============================================================

function renderCourseChart(chartData) {
    const canvas = document.getElementById('courseAttendanceChart');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    console.log('Chart Data Received:', chartData);
    
    // Destroy existing chart
    if (analyticsChart) {
        analyticsChart.destroy();
        analyticsChart = null;
    }
    
    // Check for empty data
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
    
    // Extract datasets based on current filter
    const datasets = Object.keys(chartData.datasets)
        .filter(course => currentFilter === 'all' || course.toLowerCase().includes(currentFilter.toLowerCase()))
        .map((course, index) => {
            const color = colors[index % colors.length];
            const courseData = chartData.datasets[course];
            
            // Get the 'total' array from the nested structure
            const data = courseData.total || [];
            
            console.log(`Course: ${course}, Total Data:`, data);
            
            return {
                label: course || 'Unknown Course',
                data: data,
                borderColor: color,
                backgroundColor: hexToRgba(color, currentChartView === 'area' ? 0.2 : 0.1),
                borderWidth: 3,
                fill: currentChartView === 'area',
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
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        showChartError('Chart.js library not loaded');
        return;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        
        analyticsChart = new Chart(ctx, {
            type: currentChartView === 'bar' ? 'bar' : 'line',
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
                        display: false // We'll use custom legend
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        padding: 12,
                        bodyFont: { size: 13 },
                        callbacks: {
                            title: function(context) {
                                return `📅 ${context[0].label}`;
                            },
                            label: function(context) {
                                const course = context.dataset.label;
                                const total = context.parsed.y;
                                
                                // Get additional stats if available
                                const courseKey = Object.keys(chartData.datasets).find(
                                    key => key === course
                                );
                                
                                if (courseKey) {
                                    const courseData = chartData.datasets[courseKey];
                                    const idx = context.dataIndex;
                                    const present = courseData.present ? courseData.present[idx] : 0;
                                    const late = courseData.late ? courseData.late[idx] : 0;
                                    const absent = courseData.absent ? courseData.absent[idx] : 0;
                                    
                                    return [
                                        `${course}:`,
                                        `  Total: ${total} attendees`,
                                        `  Present: ${present}`,
                                        `  Late: ${late}`,
                                        `  Absent: ${absent}`
                                    ];
                                }
                                
                                return `  ${course}: ${total} attendees`;
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
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
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
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
        
        console.log('✅ Chart created successfully:', analyticsChart);
        
        // Update custom legend
        updateLegend(datasets);
        
    } catch (error) {
        console.error('❌ Error creating chart:', error);
        showChartError(error.message);
    }
}

// ============================================================
// LEGEND UPDATE
// ============================================================

function updateLegend(datasets) {
    const legendContainer = document.getElementById('legend-items');
    if (!legendContainer) return;
    
    legendContainer.innerHTML = datasets.map(dataset => `
        <span class="legend-item">
            <span class="legend-color" style="background-color: ${dataset.borderColor}"></span>
            <span class="legend-label">${dataset.label}</span>
        </span>
    `).join('');
}

// ============================================================
// CHART VIEW CONTROLS
// ============================================================

function changeChartView(view) {
    currentChartView = view;
    
    // Update button states
    document.querySelectorAll('.chart-view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-render chart
    if (analyticsData && analyticsData.chartData) {
        renderCourseChart(analyticsData.chartData);
    }
}

function filterChart(filter) {
    currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-render chart
    if (analyticsData && analyticsData.chartData) {
        renderCourseChart(analyticsData.chartData);
    }
}

// ============================================================
// CHART LOADING STATES
// ============================================================

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

// ============================================================
// TOP EVENTS RENDERING
// ============================================================

function renderTopEvents(events) {
    const tbody = document.getElementById('top-events-body');
    if (!tbody) return;
    
    if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No events data available</td></tr>';
        return;
    }
    
    tbody.innerHTML = events.map(event => {
        const performance = Math.round((event.present / event.attendees) * 100);
        let badge = 'high';
        if (performance < 60) badge = 'low';
        else if (performance < 80) badge = 'medium';
        
        return `
            <tr>
                <td style="font-weight: 600;">${event.name}</td>
                <td>${event.attendees}</td>
                <td><span style="color: #28a745; font-weight: 600;">${event.present}</span></td>
                <td><span style="color: #ff9800; font-weight: 600;">${event.late}</span></td>
                <td><span style="color: #dc3545; font-weight: 600;">${event.absent}</span></td>
                <td><span class="status-badge ${badge}">${performance}%</span></td>
                <td>${event.last_date}</td>
            </tr>
        `;
    }).join('');
}

// ============================================================
// RECENT ACTIVITY RENDERING
// ============================================================

function renderRecentActivity(activities) {
    const container = document.getElementById('recent-activity-feed');
    if (!container) return;
    
    if (activities.length === 0) {
        container.innerHTML = '<p>No recent activity</p>';
        return;
    }
    
    container.innerHTML = activities.slice(0, 5).map(activity => {
        const statusColor = activity.status === 'Present' ? '#28a745' : 
                           activity.status === 'Late' ? '#ff9800' : '#dc3545';
        return `
            <div style="padding: 12px; border-left: 3px solid ${statusColor}; margin-bottom: 8px; background: #f8f9fa; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-weight: 600; color: var(--dark-blue);">${activity.event}</span>
                    <span style="font-size: 12px; color: #666;">${activity.datetime}</span>
                </div>
                <div style="font-size: 13px; color: #666;">
                    ${activity.student} • <span style="color: ${statusColor}; font-weight: 600;">${activity.status}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
// DATA LOADING
// ============================================================

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
            
            // Render insights if container exists
            if (document.getElementById('insights-container')) {
                const insights = generateInsights(result);
                renderInsights(insights);
            }
            
            // Render top events if container exists
            if (document.getElementById('top-events-body')) {
                renderTopEvents(result.topEvents || []);
            }
            
            // Render recent activity if container exists
            if (document.getElementById('recent-activity-feed')) {
                renderRecentActivity(result.recentActivity || []);
            }
        } else {
            throw new Error(result.error || 'Failed to load analytics');
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
        showChartError(error.message);
        
        // Show toast if available
        if (typeof showToast !== 'undefined') {
            showToast('Failed to load analytics data', 'error');
        }
    } finally {
        showChartLoading(false);
    }
}

// ============================================================
// REFRESH ANALYTICS
// ============================================================

function refreshAnalytics() {
    const refreshBtn = document.getElementById('refreshChart');
    if (refreshBtn) {
        const icon = refreshBtn.querySelector('span');
        if (icon) {
            icon.style.animation = 'rotate-refresh 0.6s ease';
            setTimeout(() => {
                icon.style.animation = '';
            }, 600);
        }
    }
    
    loadAnalyticsData();
    
    if (typeof showToast !== 'undefined') {
        showToast('Refreshing analytics data...', 'success');
    }
}

// ============================================================
// TIME RANGE UPDATE
// ============================================================

function updateChartTimeRange() {
    if (!analyticsData) return;
    
    const timeRangeEl = document.getElementById('timeRange');
    if (!timeRangeEl) return;
    
    const months = parseInt(timeRangeEl.value);
    
    if (typeof showToast !== 'undefined') {
        showToast(`Updating chart for last ${months} months...`, 'success');
    }
    
    loadAnalyticsData();
}

// ============================================================
// EXPORT ANALYTICS REPORT
// ============================================================

function exportAnalyticsReport() {
    alert('Export functionality: This would generate a PDF report with all analytics data.');
    // Implement PDF export using jsPDF library
    // This would use the exportToPDF function from admin-home-core.js
}

// ============================================================
// INITIALIZATION
// ============================================================

function initializeAnalytics() {
    console.log('🚀 Initializing Analytics Module...');
    
    // Load analytics data
    loadAnalyticsData();
    
    // Set up time range listener
    const timeRangeEl = document.getElementById('timeRange');
    if (timeRangeEl) {
        timeRangeEl.addEventListener('change', updateChartTimeRange);
    }
    
    // Set up refresh button
    const refreshChartBtn = document.getElementById('refreshChart');
    if (refreshChartBtn) {
        refreshChartBtn.addEventListener('click', refreshAnalytics);
    }
    
    // Set up auto-refresh every 5 minutes
    setInterval(refreshAnalytics, 300000);
    
    console.log('✅ Analytics Module initialized successfully');
}

// ============================================================
// MODULE EXPORTS
// ============================================================

// Make functions available globally for HTML onclick handlers
window.changeChartView = changeChartView;
window.filterChart = filterChart;
window.refreshAnalytics = refreshAnalytics;
window.updateChartTimeRange = updateChartTimeRange;
window.exportAnalyticsReport = exportAnalyticsReport;
window.initializeAnalytics = initializeAnalytics;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
});