<div class="page" id="class-management">
    <div class="page-header">
        <h1 class="page-title">Class Management</h1>
        <p class="page-subtitle">View and manage your assigned students</p>
    </div>
    
    <!-- Search and Controls Section -->
    <div class="content-card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap;">
            <!-- Search Bar -->
            <div style="flex: 1; min-width: 250px;">
                <input type="text" id="class-student-search" placeholder="Search by ID, name, or set..." 
                       style="width: 100%; padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
            </div>
            
            <!-- Sort and Export Controls -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <select id="class-sort-students" style="padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    <option value="id-asc">Sort by ID (Ascending)</option>
                    <option value="id-desc">Sort by ID (Descending)</option>
                    <option value="name-asc">Sort by Name (A-Z)</option>
                    <option value="name-desc">Sort by Name (Z-A)</option>
                    <option value="attendance-high">Sort by Attendance (High-Low)</option>
                    <option value="attendance-low">Sort by Attendance (Low-High)</option>
                </select>
                <button class="btn" id="class-export-btn">📊 Export List</button>
                <button class="btn btn-secondary" id="class-refresh-students">↻ Refresh</button>
            </div>
        </div>
    </div>
    
    <!-- Students Statistics -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div class="stat-card">
            <div class="stat-number" id="class-total-students-count">0</div>
            <div class="stat-label">Total Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="class-active-students-count">0</div>
            <div class="stat-label">Active Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="class-avg-attendance">0%</div>
            <div class="stat-label">Avg. Attendance</div>
        </div>
    </div>
    
    <!-- Student List Table -->
    <div class="content-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: var(--dark-blue);">My Assigned Students</h3>
            <span id="class-info-badge" style="background: #e8f4fd; color: #0066cc; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;"></span>
        </div>
        
        <div class="table-container">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--light-blue-bg);">
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Student ID</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Name</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Set</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Year Level</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Course</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Attendance</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Status</th>
                        <th style="padding: 12px; text-align: center; color: var(--dark-blue);">Actions</th>
                    </tr>
                </thead>
                <tbody id="class-students-table-body">
                    <tr>
                        <td colspan="8" style="padding: 40px; text-align: center; color: #666;">
                            Loading students...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Student Details Modal -->
<div id="class-student-details-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; overflow-y: auto;">
    <div style="background: white; max-width: 800px; margin: 50px auto; border-radius: 12px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="color: var(--dark-blue); margin: 0;">Student Information & Attendance Report</h2>
            <button id="class-close-details-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        </div>
        
        <!-- Student Info Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Student ID</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="class-detail-student-id">-</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Full Name</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="class-detail-student-name">-</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Set</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="class-detail-student-set">-</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Year Level</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="class-detail-student-year">-</p>
                </div>
            </div>
        </div>
        
        <!-- Attendance Statistics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
            <div class="stat-card">
                <div class="stat-number" id="class-detail-total-events">0</div>
                <div class="stat-label">Total Events</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="class-detail-attended">0</div>
                <div class="stat-label">Attended</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="class-detail-attendance-rate">0%</div>
                <div class="stat-label">Attendance Rate</div>
            </div>
        </div>
        
        <!-- Attendance History Table -->
        <h3 style="color: var(--dark-blue); margin-bottom: 15px;">Attendance History</h3>
        <div class="table-container" style="max-height: 400px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="position: sticky; top: 0; background: white;">
                    <tr style="background-color: var(--light-blue-bg);">
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Date</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Event Name</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Time Scanned</th>
                        <th style="padding: 12px; text-align: center; color: var(--dark-blue);">Status</th>
                    </tr>
                </thead>
                <tbody id="class-attendance-history-body">
                    <tr>
                        <td colspan="4" style="padding: 20px; text-align: center; color: #666;">
                            No attendance records found
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn" id="class-export-student-report">Export Report</button>
            <button class="btn btn-secondary" id="class-close-details-btn">Close</button>
        </div>
    </div>
</div>