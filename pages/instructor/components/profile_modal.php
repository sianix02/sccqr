<!-- Profile Modal -->
<div class="modal-overlay" id="profile-modal-overlay">
    <div class="modal-content profile-modal">
        <div class="modal-header">
            <h2 class="modal-title" id="profile-modal-title">Complete Your Profile</h2>
            <button class="modal-close" id="close-profile-modal" style="display: none;">&times;</button>
        </div>
        
        <div class="modal-body">
            <div class="profile-info" id="profile-view" style="display: none;">
                <div class="profile-avatar">
                    <div class="avatar-circle">
                        <span id="avatar-initials">IN</span>
                    </div>
                </div>
                
                <div class="profile-details">
                    <div class="profile-field">
                        <label>Full Name:</label>
                        <p id="display-full-name">-</p>
                    </div>
                    <div class="profile-field">
                        <label>Department:</label>
                        <p id="display-department">-</p>
                    </div>
                    <div class="profile-field">
                        <label>Year Level Assigned:</label>
                        <p id="display-year-level">-</p>
                    </div>
                    <div class="profile-field">
                        <label>Instructor ID:</label>
                        <p id="display-user-id">-</p>
                    </div>
                </div>
                
                <button class="btn btn-secondary" id="edit-profile-btn">Edit Profile</button>
            </div>
            
            <form id="profile-form" class="profile-form">
                <div class="alert alert-info" id="profile-alert">
                    <strong>📋 Profile Setup Required</strong>
                    <p>Please complete your profile information to continue using the system.</p>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="first_name">First Name <span class="required">*</span></label>
                        <input type="text" id="first_name" name="first_name" required placeholder="Enter your first name">
                    </div>
                    
                    <div class="form-group">
                        <label for="last_name">Last Name <span class="required">*</span></label>
                        <input type="text" id="last_name" name="last_name" required placeholder="Enter your last name">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="department">Department <span class="required">*</span></label>
                    <select id="department" name="department" required>
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Education">Education</option>
                        <option value="Arts and Sciences">Arts and Sciences</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="year_level">Year Level Assigned <span class="required">*</span></label>
                    <select id="year_level" name="year_level" required>
                        <option value="">Select Year Level</option>
                        <option value="First">First Year</option>
                        <option value="Second">Second Year</option>
                        <option value="Third">Third Year</option>
                        <option value="Fourth">Fourth Year</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="save-profile-btn">
                        <span id="save-btn-text">Save Profile</span>
                        <span id="save-btn-loader" style="display: none;">Saving...</span>
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancel-profile-btn" style="display: none;">Cancel</button>
                </div>
                
                <div class="alert alert-danger" id="profile-error" style="display: none;">
                    <strong>Error:</strong> <span id="error-message"></span>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
}

.modal-overlay.active {
    display: flex;
}

.modal-content {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
}

.profile-modal {
    max-width: 700px;
}

.modal-header {
    padding: 30px;
    border-bottom: 2px solid #f0f8ff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #0066cc 0%, #004080 100%);
    color: white;
    border-radius: 20px 20px 0 0;
}

.modal-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 32px;
    color: white;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.modal-body {
    padding: 30px;
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #004080;
    font-size: 14px;
}

.required {
    color: #dc3545;
}

.form-group input,
.form-group select {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.alert {
    padding: 15px 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.alert-info {
    background: #d1ecf1;
    border-left: 4px solid #0c5460;
    color: #0c5460;
}

.alert-danger {
    background: #f8d7da;
    border-left: 4px solid #721c24;
    color: #721c24;
}

.alert strong {
    font-size: 16px;
}

.alert p {
    margin: 0;
    font-size: 14px;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 10px;
}

.btn {
    padding: 14px 28px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    flex: 1;
}

.btn-primary {
    background: linear-gradient(135deg, #0066cc, #004080);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 102, 204, 0.3);
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #5a6268;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.profile-avatar {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0066cc, #004080);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 36px;
    font-weight: 700;
    box-shadow: 0 8px 25px rgba(0, 102, 204, 0.3);
}

.profile-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.profile-field {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    border-left: 4px solid #0066cc;
}

.profile-field label {
    font-size: 12px;
    color: #666;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 5px;
    display: block;
}

.profile-field p {
    font-size: 16px;
    color: #004080;
    font-weight: 600;
    margin: 0;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { 
        opacity: 0; 
        transform: translateY(50px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .profile-details {
        grid-template-columns: 1fr;
    }
    
    .modal-content {
        width: 95%;
        margin: 20px;
    }
    
    .form-actions {
        flex-direction: column;
    }
}
</style>