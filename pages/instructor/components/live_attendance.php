<div class="page active" id="live-attendance">
    <div class="page-header">
        <h1 class="page-title">Live Attendance Monitor</h1>
        <p class="page-subtitle">Real-time student attendance tracking</p>

    </div>

    <!-- Live Statistics -->
    <div class="live-stats-grid">
        <div class="stat-card">
            <div class="stat-number" id="total-students">0</div>
            <div class="stat-label">Total Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="present-count">0</div>
            <div class="stat-label">Present Now</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="attendance-rate">0%</div>
            <div class="stat-label">Attendance Rate</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="last-checkin">--:--</div>
            <div class="stat-label">Last Check-in</div>
        </div>
    </div>

    <!-- Time Frame Controls -->
    <div class="content-card">
        <div class="time-controls">
            <div class="time-selector">
                <button class="time-btn active" data-timeframe="today">Today</button>
                <button class="time-btn" data-timeframe="this-week">This Week</button>
                <button class="time-btn" data-timeframe="this-month">This Month</button>
            </div>
            
            <div class="filter-controls">
                <input type="text" class="search-box" placeholder="Search students..." id="student-search">
                <select class="filter-dropdown" id="status-filter">
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                </select>
                <button class="refresh-btn" id="refresh-data">
                    <span>🔄</span> Refresh
                </button>
                <button class="export-btn" id="export-attendance">
                    <span>📊</span> Export Data
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div id="loading-state" class="loading" style="display: none;">
            <div class="loading-spinner"></div>
            <span>Loading attendance data...</span>
        </div>

        <!-- Student List -->
        <div class="student-list-container">
            <table class="student-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Course/Year</th>
                        <th>Status</th>
                        <th>Event</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="student-attendance-list">
                    <tr>
                        <td colspan="7" class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <h3>No attendance data available</h3>
                            <p>Attendance records will appear here when students check in</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>