<!-- Home Page -->
<div class="page active" id="home">
    <div class="page-header">
        <h1 class="page-title">Welcome to Admin Dashboard</h1>
        <p class="page-subtitle">Overview of your system analytics and performance</p>
    </div>

    <!-- Enhanced Chart Section -->
    <div class="content-card" style="margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
            <div>
                <h3 style="color: var(--dark-blue); margin-bottom: 5px;">Analytics Overview</h3>
                <p style="color: #666; font-size: 14px;">Student engagement and event participation trends</p>
            </div>
            <div class="chart-controls">
                <select id="timeRange">
                    <option value="6months">Last 6 Months</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="1year">Last Year</option>
                </select>
            </div>
        </div>
        <div class="chart-container">
            <canvas id="enhancedChart"></canvas>
        </div>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-number">247</div>
            <div class="stat-label">Total Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">12</div>
            <div class="stat-label">Active Events</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">89</div>
            <div class="stat-label">User Accounts</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">98%</div>
            <div class="stat-label">System Uptime</div>
        </div>
    </div>
    
    <div class="content-card">
        <h3 style="margin-bottom: 15px; color: var(--dark-blue);">Recent Activity</h3>
        <p>Welcome to the enhanced dashboard! The analytics chart above shows real-time performance metrics including student attendance, event participation, and course completion rates.</p>
    </div>
</div>