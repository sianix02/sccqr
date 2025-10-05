// Admin Password and Security Questions Handler
(function() {
    let hasSecurityQuestions = false;
    let isMandatory = false;
    
    // Check if security questions exist
    function checkSecurityQuestions() {
        $.ajax({
            url: '../../sql_php/check_security.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                hasSecurityQuestions = response.has_security;
                
                if (!hasSecurityQuestions) {
                    // Mandatory security setup
                    showPasswordModal(true);
                }
            },
            error: function() {
                console.error('Failed to check security questions');
            }
        });
    }
    
    // Show password modal
    function showPasswordModal(mandatory = false) {
        isMandatory = mandatory;
        $('#password-modal-overlay').addClass('active');
        
        if (mandatory) {
            $('#close-password-modal').hide();
            $('#cancel-password-btn').hide();
            $('#password-alert').show();
        } else {
            $('#close-password-modal').show();
            $('#cancel-password-btn').show();
            $('#password-alert').hide();
        }
        
        // Clear previous messages
        $('#password-error').hide();
        $('#password-success').hide();
    }
    
    // Close password modal
    function closePasswordModal() {
        if (isMandatory && !hasSecurityQuestions) {
            alert('Please complete your security setup to continue.');
            return;
        }
        $('#password-modal-overlay').removeClass('active');
        $('#change-password-form')[0].reset();
    }
    
    // Show/Hide passwords
    $('#show_passwords').on('change', function() {
        const type = this.checked ? 'text' : 'password';
        $('#current_password, #new_password, #confirm_new_password').attr('type', type);
    });
    
    // Real-time password match indicator
    $('#confirm_new_password').on('input', function() {
        const newPassword = $('#new_password').val();
        const confirmPassword = $(this).val();
        
        if (confirmPassword.length > 0) {
            if (newPassword === confirmPassword) {
                $(this).css('border-color', '#28a745');
            } else {
                $(this).css('border-color', '#dc3545');
            }
        } else {
            $(this).css('border-color', '#e0e0e0');
        }
    });
    
    // Handle form submission
    $('#change-password-form').on('submit', function(e) {
        e.preventDefault();
        
        const newPassword = $('#new_password').val();
        const confirmPassword = $('#confirm_new_password').val();
        
        // Validate passwords
        if (newPassword !== confirmPassword) {
            $('#password-error-message').text('New passwords do not match!');
            $('#password-error').show();
            return;
        }
        
        if (newPassword.length < 8) {
            $('#password-error-message').text('Password must be at least 8 characters long!');
            $('#password-error').show();
            return;
        }
        
        const formData = $(this).serialize();
        const $saveBtn = $('#save-password-btn');
        const $saveText = $('#password-save-text');
        const $saveLoader = $('#password-save-loader');
        
        // Disable button and show loader
        $saveBtn.prop('disabled', true);
        $saveText.hide();
        $saveLoader.show();
        $('#password-error').hide();
        $('#password-success').hide();
        
        $.ajax({
            url: '../../sql_php/change_password.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#password-success-message').text(response.message);
                    $('#password-success').show();
                    
                    hasSecurityQuestions = true;
                    
                    // Close modal after 2 seconds
                    setTimeout(function() {
                        closePasswordModal();
                        if (isMandatory) {
                            location.reload();
                        }
                    }, 2000);
                } else {
                    $('#password-error-message').text(response.message);
                    $('#password-error').show();
                }
            },
            error: function() {
                $('#password-error-message').text('Network error. Please try again.');
                $('#password-error').show();
            },
            complete: function() {
                $saveBtn.prop('disabled', false);
                $saveText.show();
                $saveLoader.hide();
            }
        });
    });
    
    // Close modal button
    $('#close-password-modal').on('click', closePasswordModal);
    $('#cancel-password-btn').on('click', closePasswordModal);
    
    // Prevent closing modal by clicking overlay if mandatory
    $('#password-modal-overlay').on('click', function(e) {
        if (e.target === this && (!isMandatory || hasSecurityQuestions)) {
            closePasswordModal();
        }
    });
    
    // Add change password button to profile modal
    function addChangePasswordButton() {
        // Check if button already exists
        if ($('#open-password-modal').length > 0) {
            return;
        }
        
        const changePasswordBtn = `
            <button type="button" class="btn-secondary" id="open-password-modal" 
                style="background: linear-gradient(135deg, #dc3545, #c82333); color: white;">
                Change Password
            </button>
        `;
        
        // Add button to profile actions in view mode
        $('#edit-profile-btn').before(changePasswordBtn);
        
        $('#open-password-modal').on('click', function() {
            showPasswordModal(false);
        });
    }
    
    // Initialize on document ready
    $(document).ready(function() {
        checkSecurityQuestions();
        addChangePasswordButton();
    });
    
    // Expose functions globally
    window.adminPasswordHandler = {
        showModal: showPasswordModal,
        closeModal: closePasswordModal,
        checkSecurity: checkSecurityQuestions
    };
})();