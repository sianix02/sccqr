<!-- Students Page -->
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
                <input type="text" id="student-search" placeholder="Search by ID, name, or email..." 
                       style="width: 100%; padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
            </div>
            
            <!-- Sort and Add Controls -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <select id="sort-students" style="padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    <option value="id-asc">Sort by ID (Ascending)</option>
                    <option value="id-desc">Sort by ID (Descending)</option>
                    <option value="name-asc">Sort by Name (A-Z)</option>
                    <option value="name-desc">Sort by Name (Z-A)</option>
                    <option value="attendance-high">Sort by Attendance (High-Low)</option>
                    <option value="attendance-low">Sort by Attendance (Low-High)</option>
                </select>
                <button class="btn" id="add-student-btn">+ Add New Student</button>
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
            <div class="stat-number" id="avg-attendance">0%</div>
            <div class="stat-label">Avg. Attendance</div>
        </div>
    </div>
    
    <!-- Student List Table -->
    <div class="content-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: var(--dark-blue);">All Current Students</h3>
            <button class="btn btn-secondary" id="refresh-students">↻ Refresh</button>
        </div>
        
        <div class="table-container">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--light-blue-bg);">
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Student ID</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Name</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Email</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Year Level</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Attendance</th>
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Status</th>
                        <th style="padding: 12px; text-align: center; color: var(--dark-blue);">Actions</th>
                    </tr>
                </thead>
                <tbody id="students-table-body">
                    <tr>
                        <td colspan="7" style="padding: 40px; text-align: center; color: #666;">
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
            <h2 style="color: var(--dark-blue); margin: 0;" id="modal-title">Add New Student</h2>
            <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        </div>
        
        <form id="student-form">
            <input type="hidden" id="student-id-hidden">
            
            <div class="form-group">
                <label for="student-id-input">Student ID</label>
                <input type="text" id="student-id-input" placeholder="e.g., 2024-001" required>
            </div>
            
            <div class="form-group">
                <label for="student-name">Full Name</label>
                <input type="text" id="student-name" placeholder="Enter full name" required>
            </div>
            
            <div class="form-group">
                <label for="student-email">Email Address</label>
                <input type="email" id="student-email" placeholder="student@example.com" required>
            </div>
            
            <div class="form-group">
                <label for="student-year">Year Level</label>
                <select id="student-year" required>
                    <option value="">Select year level</option>
                    <option value="First">First Year</option>
                    <option value="Second">Second Year</option>
                    <option value="Third">Third Year</option>
                    <option value="Fourth">Fourth Year</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="student-status">Status</label>
                <select id="student-status" required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
    <div style="background: white; max-width: 800px; margin: 50px auto; border-radius: 12px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
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
                    <p style="color: #666; font-size: 12px; margin: 0;">Set</p>
                    <p style="color: var(--dark-blue); font-weight: 600; margin: 5px 0 0 0;" id="detail-student-email">-</p>
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
                <div class="stat-number" id="detail-attended">0</div>
                <div class="stat-label">Attended</div>
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
                        <th style="padding: 12px; text-align: left; color: var(--dark-blue);">Time Scanned</th>
                        <th style="padding: 12px; text-align: center; color: var(--dark-blue);">Status</th>
                    </tr>
                </thead>
                <tbody id="attendance-history-body">
                    <tr>
                        <td colspan="4" style="padding: 20px; text-align: center; color: #666;">
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

<!-- Delete Confirmation Modal -->
<div id="delete-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
    <div style="background: white; max-width: 400px; margin: 150px auto; border-radius: 12px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center;">
        <h3 style="color: var(--dark-blue); margin-bottom: 15px;">Delete Student</h3>
        <p style="color: #666; margin-bottom: 25px;">Are you sure you want to delete this student? This action cannot be undone.</p>
        <p style="color: var(--dark-blue); font-weight: 600; margin-bottom: 25px;" id="delete-student-name">-</p>
        
        <div style="display: flex; gap: 10px;">
            <button class="btn btn-danger" id="confirm-delete" style="flex: 1;">Delete</button>
            <button class="btn btn-secondary" id="cancel-delete" style="flex: 1;">Cancel</button>
        </div>
    </div>
</div>