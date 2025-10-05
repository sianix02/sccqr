<!-- Home Page -->
<div class="page active" id="home">
    <div class="page-header">
        <h1 class="page-title">Welcome to Admin Dashboard</h1>
        <p class="page-subtitle">Overview of your system analytics and performance</p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-number" id="stat-total-students">0</div>
            <div class="stat-label">Total Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="stat-total-instructors">0</div>
            <div class="stat-label">Total Instructors</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="stat-total-events">0</div>
            <div class="stat-label">Total Events</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="stat-engagement-rate">0%</div>
            <div class="stat-label">Student Engagement</div>
        </div>
    </div>

    <!-- Enhanced Chart Section -->
    <div class="content-card analytics-chart-card">
        <div class="chart-header">
            <div>
                <h3 class="chart-title">Course Attendance Analytics</h3>
                <p class="chart-subtitle">Total attendees by course over time</p>
            </div>
            <div class="chart-controls">
                <select id="timeRange" class="chart-select">
                    <option value="6">Last 6 Months</option>
                    <option value="3">Last 3 Months</option>
                    <option value="12">Last Year</option>
                </select>
                <button id="refreshChart" class="btn-refresh" title="Refresh Data">
                    <span>↻</span>
                </button>
            </div>
        </div>
        <div class="chart-container">
            <canvas id="courseAttendanceChart"></canvas>
        </div>
        <div id="chartLegendInfo" class="chart-legend-info"></div>
    </div>
    
    <div class="content-card">
        <h3 style="margin-bottom: 15px; color: var(--dark-blue);">Recent Activity</h3>
        <p>The analytics chart displays real-time attendance data grouped by course. Track student participation trends across different programs and identify engagement patterns over time.</p>
    </div>
</div>