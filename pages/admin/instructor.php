<div class="page" id="instructor">
    <div class="page-header">
        <h1 class="page-title">Instructor Management</h1>
        <p class="page-subtitle">Manage instructors, assign multiple sets (A, B, C, D), and define positions</p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-number" id="total-instructors">0</div>
            <div class="stat-label">Total Instructors</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="department-head-count">0</div>
            <div class="stat-label">Department Heads</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="dean-count">0</div>
            <div class="stat-label">Deans</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="instructor-count">0</div>
            <div class="stat-label">Instructors</div>
        </div>
    </div>

    <!-- Controls Section -->
    <div class="content-card">
        <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 20px;">
            <!-- Search Bar -->
            <div style="flex: 1; min-width: 250px;">
                <input 
                    type="text" 
                    id="instructor-search" 
                    placeholder="🔍 Search by name or ID..." 
                    style="width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;"
                >
            </div>

            <!-- Filter by Set -->
            <div style="min-width: 150px;">
                <select 
                    id="filter-set" 
                    style="width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; cursor: pointer;"
                >
                    <option value="">All Sets</option>
                    <!-- Sets will be loaded dynamically from database -->
                    <option value="Unassigned">Unassigned</option>
                </select>
            </div>

            <!-- Filter by Position -->
            <div style="min-width: 150px;">
                <select 
                    id="filter-position" 
                    style="width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; cursor: pointer;"
                >
                    <option value="">All Positions</option>
                    <option value="Dean">Dean</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Instructor">Instructor</option>
                </select>
            </div>
        </div>

        <!-- Filter Info -->
        <div id="instructor-filter-info" style="font-size: 14px; color: #666; font-style: italic; margin-bottom: 15px;"></div>

        <!-- Instructors Table -->
        <div class="table-container" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f0f8ff;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">Instructor ID</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">Name</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">Department</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">Year Level</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">Assigned Sets</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">Position</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e0e0e0;">Actions</th>
                    </tr>
                </thead>
                <tbody id="instructor-table-body">
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                            <div class="loading-spinner" style="margin: 0 auto;"></div>
                            <p style="margin-top: 15px;">Loading instructors...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add/Edit Instructor Modal -->
<div id="instructor-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
    <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
        <h2 id="instructor-modal-title" style="margin-bottom: 20px; color: #004080;">Add Instructor</h2>
        
        <form id="instructor-form">
            <input type="hidden" id="instructor-modal-id">
            
            <div class="form-group">
                <label for="instructor-first-name">First Name *</label>
                <input type="text" id="instructor-first-name" required>
            </div>

            <div class="form-group">
                <label for="instructor-middle-initial">Middle Initial</label>
                <input type="text" id="instructor-middle-initial" maxlength="5" placeholder="Optional">
            </div>

            <div class="form-group">
                <label for="instructor-last-name">Last Name *</label>
                <input type="text" id="instructor-last-name" required>
            </div>

            <div class="form-group">
                <label for="instructor-department">Department *</label>
                <select id="instructor-department" required>
                    <option value="">Select Department</option>
                    <option value="BS Information Technology">BS Information Technology</option>
                    <option value="BS Business Administration">BS Business Administration</option>
                    <option value="BS Criminology">BS Criminology</option>
                    <option value="BS Secondary Education">BS Secondary Education</option>
                    <option value="Bachelor of Elementary Education">Bachelor of Elementary Education</option>
                </select>
            </div>

            <div class="form-group">
                <label for="instructor-position">Position *</label>
                <select id="instructor-position" required>
                    <option value="">Select Position</option>
                    <option value="Dean">Dean</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Instructor">Instructor</option>
                </select>
                <small style="color: #666; font-size: 12px;">Note: Department Heads will be automatically assigned to "All Year Level"</small>
            </div>

            <div class="form-group">
                <label for="instructor-year-level">Year Level Assigned *</label>
                <select id="instructor-year-level" required>
                    <option value="">Select Year Level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="All Year Level">All Year Level</option>
                </select>
            </div>

            <div class="form-group">
                <label style="display: block; margin-bottom: 10px;">Assigned Sets (Select Multiple) *</label>
                <div class="set-selection-container" id="set-checkboxes-container">
                    <!-- Sets will be loaded dynamically from database -->
                </div>
                <small style="color: #666; font-size: 12px;">Select one or more sets to assign to this instructor</small>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 25px;">
                <button type="button" class="btn btn-secondary" id="cancel-instructor-btn">Cancel</button>
                <button type="submit" class="btn" id="save-instructor-btn">Save Instructor</button>
            </div>
        </form>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="delete-instructor-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1001; justify-content: center; align-items: center;">
    <div style="background: white; border-radius: 12px; padding: 30px; max-width: 400px; width: 90%; text-align: center;">
        <h3 style="color: #dc3545; margin-bottom: 15px;">⚠️ Delete Instructor</h3>
        <p style="margin-bottom: 20px; color: #666;">Are you sure you want to delete this instructor?</p>
        <p id="delete-instructor-name" style="font-weight: 600; margin-bottom: 25px; color: #333;"></p>
        
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn btn-secondary" id="cancel-delete-instructor-btn">Cancel</button>
            <button class="btn btn-danger" id="confirm-delete-instructor-btn">Delete</button>
        </div>
    </div>
</div>