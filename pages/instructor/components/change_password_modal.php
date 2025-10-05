<!-- Change Password Modal -->
<div class="modal-overlay" id="password-modal-overlay">
    <div class="modal-container">
        <button class="modal-close" id="close-password-modal">&times;</button>
        
        <div class="modal-header">
            <h2>Change Password & Security Questions</h2>
        </div>

        <!-- Alert for mandatory setup -->
        <div class="password-alert" id="password-alert" style="display: none;">
            <strong>⚠️ Security Setup Required:</strong> Please set up your password and security questions for account recovery.
        </div>

        <!-- Error/Success Messages -->
        <div class="password-error" id="password-error" style="display: none;">
            <strong>Error:</strong> <span id="password-error-message"></span>
        </div>

        <div class="password-success" id="password-success" style="display: none;">
            <strong>✓ Success:</strong> <span id="password-success-message"></span>
        </div>

        <!-- Change Password Form -->
        <form id="change-password-form">
            <!-- Current Password Section -->
            <div class="form-section">
                <div class="section-title">
                    <div class="section-icon">🔒</div>
                    Current Password
                </div>
                <div class="form-group">
                    <label for="current_password">Current Password <span class="required">*</span></label>
                    <input type="password" id="current_password" name="current_password" required>
                </div>
            </div>

            <!-- New Password Section -->
            <div class="form-section">
                <div class="section-title">
                    <div class="section-icon">🔑</div>
                    New Password
                </div>
                <div class="form-grid-2col">
                    <div class="form-group">
                        <label for="new_password">New Password <span class="required">*</span></label>
                        <input type="password" id="new_password" name="new_password" required minlength="8">
                        <small style="color: #6c757d; font-size: 12px; margin-top: 5px; display: block;">Must be at least 8 characters</small>
                    </div>
                    <div class="form-group">
                        <label for="confirm_new_password">Confirm New Password <span class="required">*</span></label>
                        <input type="password" id="confirm_new_password" name="confirm_new_password" required minlength="8">
                    </div>
                </div>
                <div class="form-group" style="margin-top: 10px;">
                    <label style="display: flex; align-items: center; font-size: 14px; cursor: pointer;">
                        <input type="checkbox" id="show_passwords" style="width: auto; margin-right: 8px;">
                        Show Passwords
                    </label>
                </div>
            </div>

            <!-- Security Questions Section -->
            <div class="form-section">
                <div class="section-title">
                    <div class="section-icon">🔐</div>
                    Security Questions (For Password Recovery)
                </div>

                <div class="secret-question-group">
                    <label>Question 1 <span class="required">*</span></label>
                    <select name="secret_question_1" id="sq1" required>
                        <option value="">Select a question</option>
                        <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                        <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                        <option value="What city were you born in?">What city were you born in?</option>
                        <option value="What is your favorite color?">What is your favorite color?</option>
                    </select>
                    <input type="text" name="answer_1" id="ans1" placeholder="Your answer" required>
                </div>

                <div class="secret-question-group">
                    <label>Question 2 <span class="required">*</span></label>
                    <select name="secret_question_2" id="sq2" required>
                        <option value="">Select a question</option>
                        <option value="What is the name of your favorite teacher?">What is the name of your favorite teacher?</option>
                        <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                        <option value="What is your favorite food?">What is your favorite food?</option>
                        <option value="What is your dream job?">What is your dream job?</option>
                    </select>
                    <input type="text" name="answer_2" id="ans2" placeholder="Your answer" required>
                </div>

                <div class="secret-question-group">
                    <label>Question 3 <span class="required">*</span></label>
                    <select name="secret_question_3" id="sq3" required>
                        <option value="">Select a question</option>
                        <option value="What is your father's middle name?">What is your father's middle name?</option>
                        <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                        <option value="What is your favorite movie?">What is your favorite movie?</option>
                        <option value="What is your favorite book?">What is your favorite book?</option>
                    </select>
                    <input type="text" name="answer_3" id="ans3" placeholder="Your answer" required>
                </div>

                <div class="secret-question-group">
                    <label>Question 4 <span class="required">*</span></label>
                    <select name="secret_question_4" id="sq4" required>
                        <option value="">Select a question</option>
                        <option value="What is your favorite sport?">What is your favorite sport?</option>
                        <option value="What is your favorite subject?">What is your favorite subject?</option>
                        <option value="What was your first job?">What was your first job?</option>
                        <option value="What is your hobby?">What is your hobby?</option>
                    </select>
                    <input type="text" name="answer_4" id="ans4" placeholder="Your answer" required>
                </div>

                <div class="secret-question-group">
                    <label>Question 5 <span class="required">*</span></label>
                    <select name="secret_question_5" id="sq5" required>
                        <option value="">Select a question</option>
                        <option value="What is your favorite band or artist?">What is your favorite band or artist?</option>
                        <option value="What is your best friend's name?">What is your best friend's name?</option>
                        <option value="What is your dream destination?">What is your dream destination?</option>
                        <option value="What is your favorite season?">What is your favorite season?</option>
                    </select>
                    <input type="text" name="answer_5" id="ans5" placeholder="Your answer" required>
                </div>
            </div>

            <div class="password-actions">
                <button type="button" class="btn-secondary" id="cancel-password-btn">Cancel</button>
                <button type="submit" class="btn-primary" id="save-password-btn">
                    <span id="password-save-text">Save Changes</span>
                    <span id="password-save-loader" style="display: none;">Saving...</span>
                </button>
            </div>
        </form>
    </div>
</div>

<style>
.form-grid-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.secret-question-group {
    margin-bottom: 20px;
}

.secret-question-group label {
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 600;
}

.secret-question-group select,
.secret-question-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 10px;
    transition: border-color 0.3s;
}

.secret-question-group select:focus,
.secret-question-group input:focus {
    outline: none;
    border-color: #0066cc;
}

.password-alert {
    background: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.password-error {
    background: #f8d7da;
    border: 1px solid #dc3545;
    color: #721c24;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.password-success {
    background: #d4edda;
    border: 1px solid #28a745;
    color: #155724;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.password-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
}

.required {
    color: #dc3545;
}

@media (max-width: 768px) {
    .form-grid-2col {
        grid-template-columns: 1fr;
    }
    
    .password-actions {
        flex-direction: column;
    }
    
    .btn-primary,
    .btn-secondary {
        width: 100%;
    }
}
</style>