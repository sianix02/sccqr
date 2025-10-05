<!-- Admin Profile Modal - Complete Version -->
<div class="modal-overlay" id="profile-modal-overlay">
    <div class="modal-container">
        <button class="modal-close" id="close-profile-modal" style="display: none;">&times;</button>
        
        <div class="modal-header">
            <h2 id="profile-modal-title">Your Profile</h2>
        </div>

        <!-- Alert for mandatory profile -->
        <div class="profile-alert" id="profile-alert" style="display: none;">
            <strong>⚠️ Action Required:</strong> Please complete your profile information to continue using the system.
        </div>

        <!-- Error Message -->
        <div class="profile-error" id="profile-error" style="display: none;">
            <strong>Error:</strong> <span id="error-message"></span>
        </div>

        <!-- Profile View Mode -->
        <div id="profile-view" style="display: none;">
            <div class="profile-avatar">
                <div class="avatar-circle">
                    <span id="avatar-initials">AB</span>
                </div>
            </div>

            <div class="profile-info-grid">
                <div class="profile-info-item">
                    <label>Full Name</label>
                    <div class="info-value" id="display-full-name">-</div>
                </div>

                <div class="profile-info-item">
                    <label>Admin ID</label>
                    <div class="info-value" id="display-user-id">-</div>
                </div>

                <div class="profile-info-item">
                    <label>Position</label>
                    <div class="info-value" id="display-position">Administrator</div>
                </div>

                <div class="profile-info-item">
                    <label>Email</label>
                    <div class="info-value" id="display-email">-</div>
                </div>
            </div>

            <div class="profile-actions">
                <button type="button" class="btn-secondary" id="cancel-profile-btn">Close</button>
                <button type="button" class="btn-primary" id="edit-profile-btn">Edit Profile</button>
            </div>
        </div>

        <!-- Profile Edit Form -->
        <form id="profile-form" style="display: none;">
            <div class="form-grid">
                <div class="form-group">
                    <label for="first_name">First Name *</label>
                    <input type="text" id="first_name" name="first_name" required>
                </div>

                <div class="form-group">
                    <label for="middle_initial">Middle Initial</label>
                    <input type="text" id="middle_initial" name="middle_initial" maxlength="5" placeholder="e.g., A." style="text-transform: uppercase;">
                </div>

                <div class="form-group">
                    <label for="last_name">Last Name *</label>
                    <input type="text" id="last_name" name="last_name" required>
                </div>

                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required>
                </div>
            </div>

            <div class="form-note">
                <strong>Note:</strong> Position is set as Administrator and cannot be edited.
            </div>

            <div class="profile-actions">
                <button type="button" class="btn-secondary" id="cancel-profile-btn">Cancel</button>
                <button type="submit" class="btn-primary" id="save-profile-btn">
                    <span id="save-btn-text">Save Profile</span>
                    <span id="save-btn-loader" style="display: none;">Saving...</span>
                </button>
            </div>
        </form>
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
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
}

.modal-overlay.active {
    display: flex;
}

.modal-container {
    background: white;
    border-radius: 16px;
    padding: 30px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 32px;
    color: #666;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
}

.modal-close:hover {
    color: #dc3545;
}

.modal-header {
    margin-bottom: 25px;
    text-align: center;
}

.modal-header h2 {
    color: #0066cc;
    font-size: 28px;
    margin: 0;
}

.profile-alert {
    background: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.profile-error {
    background: #f8d7da;
    border: 1px solid #dc3545;
    color: #721c24;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.profile-avatar {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0066cc, #004080);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 36px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.profile-info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.profile-info-item {
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #0066cc;
}

.profile-info-item label {
    display: block;
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
    font-weight: 600;
}

.profile-info-item .info-value {
    font-size: 16px;
    color: #333;
    font-weight: 500;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 600;
}

.form-group input,
.form-group select {
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #0066cc;
}

.form-note {
    background: #e3f2fd;
    border: 1px solid #0066cc;
    color: #004080;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
}

.profile-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {
    background: linear-gradient(135deg, #0066cc, #004080);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    background: #e0e0e0;
    color: #333;
}

.btn-secondary:hover {
    background: #d0d0d0;
}

@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .profile-actions {
        flex-direction: column;
    }
    
    .btn-primary,
    .btn-secondary {
        width: 100%;
    }
}
</style>