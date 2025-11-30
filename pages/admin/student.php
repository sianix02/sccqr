<!-- Enhanced Students Page with Archive & Course Column -->
<div class="page" id="students">
    <div class="page-header">
        <h1 class="page-title">Student Management</h1>
        <p class="page-subtitle">Manage student records and attendance information</p>
    </div>
    
    <!-- Search and Controls Section -->
    <div class="content-card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap;">
            <!-- Search Bar -->
            <div style="flex: 1; min-width: 250px;">
                <input type="text" id="student-search" placeholder="Search by ID, name, course, or set..." 
                       style="width: 100%; padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
            </div>
            
            <!-- Filter and Sort Controls -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <select id="filter-status" style="padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    <option value="all">All Students</option>
                    <option value="active">Active Students</option>
                    <option value="inactive">Inactive Students</option>
                    <option value="archived">Archived Students</option>
                </select>
                
                <select id="filter-course" style="padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    <option value="all">All Courses</option>
                    <!-- Will be populated dynamically -->
                </select>
                
                <select id="filter-year" style="padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    <option value="all">All Year Levels</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>
                
                <select id="sort-students" style="padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    <option value="id-asc">Sort by ID (Ascending)</option>
                    <option value="id-desc">Sort by ID (Descending)</option>
                    <option value="name-asc">Sort by Name (A-Z)</option>
                    <option value="name-desc">Sort by Name (Z-A)</option>
                    <option value="course-asc">Sort by Course (A-Z)</option>
                    <option value="course-desc">Sort by Course (Z-A)</option>
                    <option value="year-asc">Sort by Year Level (1-4)</option>
                    <option value="year-desc">Sort by Year Level (4-1)</option>
                    <option value="attendance-high">Sort by Attendance (High-Low)</option>
                    <option value="attendance-low">Sort by Attendance (Low-High)</option>
                </select>
                
                <button class="btn" id="export-all-pdf" style="background: #28a745;">
                    📄 Export PDF
                </button>
                
                <button class="btn btn-secondary" id="refresh-students">↻ Refresh</button>
            </div>
        </div>
    </div>
    
    <!-- Students Statistics -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div class="stat-card">
            <div class="stat-number" id="total-students-count">0</div>
            <div class="stat-label">Total Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="active-students-count">0</div>
            <div class="stat-label">Active Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="inactive-students-count">0</div>
            <div class="stat-label">Inactive Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="archived-students-count">0</div>
            <div class="stat-label">Archived Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="avg-attendance">0%</div>
            <div class="stat-label">Avg. Attendance</div>
        </div>
    </div>
    
    <!-- Student List Table -->
    <div class="content-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: var(--dark-blue);">Student List</h3>
            <span id="filter-info" style="color: #666; font-size: 14px;"></span>
        </div>
        
        <div class="table-container">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--light-blue-bg);">
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Student ID</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Name</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Course</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Set</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Year Level</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Attendance</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Status</th>
                        <th style="padding: 12px; text-align: center; color: var(--dark-blue);">Actions</th>
                    </tr>
                </thead>
                <tbody id="students-table-body">
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

<!-- Add/Edit Student Modal -->
<div id="student-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; overflow-y: auto;">
    <div style="background: white; max-width: 600px; margin: 50px auto; border-radius: 12px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="color: var(--dark-blue); margin: 0;" id="modal-title">Edit Student</h2>
            <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        </div>
        
        <form id="student-form">
            <input type="hidden" id="student-id-hidden">
            
            <div class="form-group">
                <label for="student-id-input">Student ID</label>
                <input type="text" id="student-id-input" placeholder="e.g., 2024-001" required disabled>
            </div>
            
            <div class="form-group">
                <label for="student-first-name">First Name</label>
                <input type="text" id="student-first-name" placeholder="Enter first name" required>
            </div>

            <div class="form-group">
                <label for="student-middle-initial">Middle Initial (Optional)</label>
                <input type="text" id="student-middle-initial" placeholder="e.g., M" maxlength="1" style="text-transform: uppercase;">
            </div>

            <div class="form-group">
                <label for="student-last-name">Last Name</label>
                <input type="text" id="student-last-name" placeholder="Enter last name" required>
            </div>
                        
            <div class="form-group">
                <label for="student-course">Course</label>
                <input type="text" id="student-course" placeholder="e.g., BSIT, BSBA" required>
            </div>
            
            <div class="form-group">
                <label for="student-set">Set</label>
                <input type="text" id="student-set" placeholder="e.g., Set A" required>
            </div>
            
            <div class="form-group">
                <label for="student-year">Year Level</label>
                <select id="student-year" required>
                    <option value="">Select year level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 25px;">
                <button type="submit" class="btn" style="flex: 1;">Save Student</button>
                <button type="button" class="btn btn-secondary" id="cancel-modal" style="flex: 1;">Cancel</button>
            </div>
        </form>
    </div>
</div>

<!-- Student Details/Attendance Modal -->
<div id="student-details-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; overflow-y: auto;">
    <div style="background: white; max-width: 900px; margin: 50px auto; border-radius: 12px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="color: var(--dark-blue); margin: 0;">Student Information & Attendance Report</h2>
            <button id="close-details-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        </div>
        
        <!-- Student Info Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Student ID</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="detail-student-id">-</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Full Name</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="detail-student-name">-</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Course</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="detail-student-course">-</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Set</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="detail-student-set">-</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 12px; margin: 0;">Year Level</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="detail-student-year">-</p>
                </div>
            </div>
        </div>
        
        <!-- Attendance Statistics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
            <div class="stat-card">
                <div class="stat-number" id="detail-total-events">0</div>
                <div class="stat-label">Total Events</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="detail-present">0</div>
                <div class="stat-label">Present</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="detail-late">0</div>
                <div class="stat-label">Late</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="detail-absent">0</div>
                <div class="stat-label">Absent</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="detail-attendance-rate">0%</div>
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
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Time In</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Time Out</th>
                        <th style="padding: 12px; text-align: center; color: var(--dark-blue);">Status</th>
                    </tr>
                </thead>
                <tbody id="attendance-history-body">
                    <tr>
                        <td colspan="5" style="padding: 20px; text-align: center; color: #666;">
                            No attendance records found
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn" id="export-student-report">Export Report</button>
            <button class="btn btn-secondary" id="close-details-btn">Close</button>
        </div>
    </div>
</div>

<!-- Archive Confirmation Modal -->
<div id="archive-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
    <div style="background: white; max-width: 400px; margin: 150px auto; border-radius: 12px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center;">
        <h3 style="color: var(--dark-blue); margin-bottom: 15px;">Archive Student</h3>
        <p style="color: #666; margin-bottom: 25px;">Are you sure you want to archive this student? They will be marked as inactive but data will be preserved.</p>
        <p style="color: var(--dark-blue); font-weight: 600; margin-bottom: 25px;" id="archive-student-name">-</p>
        
        <div style="display: flex; gap: 10px;">
            <button class="btn" id="confirm-archive" style="flex: 1; background: #ffc107;">Archive</button>
            <button class="btn btn-secondary" id="cancel-archive" style="flex: 1;">Cancel</button>
        </div>
    </div>
</div>
