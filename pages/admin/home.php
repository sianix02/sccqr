<!-- Enhanced Home Page with Interactive Analytics -->
<div class="page active" id="home">
    <!-- Page Header with Live Indicator -->
    <div class="page-header">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div>
                <h1 class="page-title">Welcome to Admin Dashboard</h1>
                <p class="page-subtitle">Real-time analytics and performance insights</p>
            </div>
            <div>
                <span class="live-indicator">● Live Data</span>
                <button class="btn-export" onclick="exportAnalyticsReport()">
                    📥 Export Report
                </button>
            </div>
        </div>
    </div>

    <!-- Quick Insights Panel -->
    <div class="insights-panel">
        <h3 class="insights-title">💡 Quick Insights</h3>
        <div id="insights-container">
            <div class="insight-item">Loading insights...</div>
        </div>
    </div>

    <!-- Enhanced Statistics Cards with Trends -->
    <div class="stats-grid">
        <div class="stat-card" data-icon="👥">
            <div class="stat-number" id="stat-total-students" data-target="0">0</div>
            <div class="stat-label">Total Students</div>
            <div class="stat-trend up" style="display: none;">
                <span id="student-trend">+0%</span> vs last month
            </div>
        </div>
        <div class="stat-card success" data-icon="👨‍🏫">
            <div class="stat-number" id="stat-total-instructors" data-target="0">0</div>
            <div class="stat-label">Instructors</div>
            <div class="stat-trend up" style="display: none;">
                <span id="instructor-trend">+0%</span> vs last month
            </div>
        </div>
        <div class="stat-card warning" data-icon="📅">
            <div class="stat-number" id="stat-total-events" data-target="0">0</div>
            <div class="stat-label">Total Events</div>
            <div class="stat-trend up" style="display: none;">
                <span id="event-trend">+0%</span> this quarter
            </div>
        </div>
        <div class="stat-card" data-icon="📊">
            <div class="stat-number" id="stat-engagement-rate" data-target="0">0%</div>
            <div class="stat-label">Student Engagement</div>
            <div class="stat-trend up" style="display: none;">
                <span id="engagement-trend">+0%</span> improvement
            </div>
        </div>
    </div>

    <!-- Progress Rings for Key Metrics -->
    <div class="progress-ring-container">
        <div class="progress-ring-item">
            <div class="progress-ring">
                <svg width="120" height="120">
                    <circle class="progress-ring-circle" cx="60" cy="60" r="45"></circle>
                    <circle class="progress-ring-value" cx="60" cy="60" r="45" id="ring-attendance"></circle>
                </svg>
                <div class="progress-ring-text" id="ring-attendance-text">0%</div>
            </div>
            <div class="progress-ring-label">Attendance Rate</div>
        </div>
        <div class="progress-ring-item">
            <div class="progress-ring">
                <svg width="120" height="120">
                    <circle class="progress-ring-circle" cx="60" cy="60" r="45"></circle>
                    <circle class="progress-ring-value" cx="60" cy="60" r="45" id="ring-ontime" style="stroke: #28a745;"></circle>
                </svg>
                <div class="progress-ring-text" id="ring-ontime-text" style="color: #28a745;">0%</div>
            </div>
            <div class="progress-ring-label">On-Time Rate</div>
        </div>
        <div class="progress-ring-item">
            <div class="progress-ring">
                <svg width="120" height="120">
                    <circle class="progress-ring-circle" cx="60" cy="60" r="45"></circle>
                    <circle class="progress-ring-value" cx="60" cy="60" r="45" id="ring-engagement" style="stroke: #ff9800;"></circle>
                </svg>
                <div class="progress-ring-text" id="ring-engagement-text" style="color: #ff9800;">0%</div>
            </div>
            <div class="progress-ring-label">Engagement Score</div>
        </div>
    </div>

    <!-- Interactive Filters Bar -->
    <div class="filters-bar">
        <span style="font-weight: 600; color: var(--dark-blue); margin-right: 10px;">View:</span>
        <button class="filter-chip active" onclick="filterChart('all')">All Courses</button>
        <button class="filter-chip" onclick="filterChart('bsit')">BSIT</button>
        <button class="filter-chip" onclick="filterChart('bscs')">BSCS</button>
        <button class="filter-chip" onclick="filterChart('act')">ACT</button>
        <button class="filter-chip" onclick="filterChart('bsds')">BSDS</button>
    </div>

    <!-- Enhanced Chart Section with View Toggles -->
    <div class="content-card analytics-chart-card">
        <div class="chart-header">
            <div>
                <h3 class="chart-title">Course Attendance Analytics</h3>
                <p class="chart-subtitle">Track student participation trends by course</p>
            </div>
            <div class="chart-controls">
                <select id="timeRange" class="chart-select" onchange="updateChartTimeRange()">
                    <option value="6">Last 6 Months</option>
                    <option value="3">Last 3 Months</option>
                    <option value="12">Last Year</option>
                </select>
                <button id="refreshChart" class="btn-refresh" title="Refresh Data" onclick="refreshAnalytics()">
                    <span>↻</span>
                </button>
            </div>
        </div>
        
        <!-- Chart View Toggle -->
        <div class="chart-toolbar">
            <button class="chart-view-btn active" onclick="changeChartView('line')">📈 Line Chart</button>
            <button class="chart-view-btn" onclick="changeChartView('bar')">📊 Bar Chart</button>
            <button class="chart-view-btn" onclick="changeChartView('area')">📉 Area Chart</button>
        </div>
        
        <div class="chart-container">
            <canvas id="courseAttendanceChart"></canvas>
        </div>
        <div id="chartLegendInfo" class="chart-legend-info active">
            <div style="font-weight: 600; margin-bottom: 8px; color: var(--dark-blue);">📌 Chart Legend:</div>
            <div id="legend-items"></div>
        </div>
    </div>

    <!-- Comparison Cards - Period over Period -->
    <div class="comparison-grid">
        <div class="comparison-card">
            <div class="comparison-header">
                <span class="comparison-title">Present</span>
                <span style="font-size: 24px;">✅</span>
            </div>
            <div class="comparison-value" id="compare-present">0</div>
            <div class="comparison-change positive">
                <span>↑</span>
                <span id="compare-present-change">0%</span>
            </div>
            <canvas class="mini-sparkline" id="sparkline-present"></canvas>
        </div>
        <div class="comparison-card">
            <div class="comparison-header">
                <span class="comparison-title">Late</span>
                <span style="font-size: 24px;">⏰</span>
            </div>
            <div class="comparison-value" id="compare-late">0</div>
            <div class="comparison-change negative">
                <span>↓</span>
                <span id="compare-late-change">0%</span>
            </div>
            <canvas class="mini-sparkline" id="sparkline-late"></canvas>
        </div>
        <div class="comparison-card">
            <div class="comparison-header">
                <span class="comparison-title">Absent</span>
                <span style="font-size: 24px;">❌</span>
            </div>
            <div class="comparison-value" id="compare-absent">0</div>
            <div class="comparison-change negative">
                <span>↓</span>
                <span id="compare-absent-change">0%</span>
            </div>
            <canvas class="mini-sparkline" id="sparkline-absent"></canvas>
        </div>
    </div>

    <!-- Top Events Table -->
    <div class="data-table-wrapper">
        <h3 style="margin-bottom: 20px; color: var(--dark-blue); font-weight: 700;">🏆 Top Performing Events</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Event Name</th>
                    <th>Total Attendees</th>
                    <th>Present</th>
                    <th>Late</th>
                    <th>Absent</th>
                    <th>Performance</th>
                    <th>Last Date</th>
                </tr>
            </thead>
            <tbody id="top-events-body">
                <tr>
                    <td colspan="7" style="text-align: center; padding: 30px;">Loading events data...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Recent Activity Feed -->
    <div class="content-card" style="margin-top: 20px;">
        <h3 style="margin-bottom: 15px; color: var(--dark-blue);">Recent Activity</h3>
        <div id="recent-activity-feed">
            <p>Loading recent activity...</p>
        </div>
    </div>
</div>

