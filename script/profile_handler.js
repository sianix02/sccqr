// Profile Modal Handler
(function() {
    let hasProfile = false;
    let isEditMode = false;
    
    // Check profile on page load
    function checkProfile() {
        $.ajax({
            url: '../../sql_php/check_profile.php?ajax=1',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                hasProfile = response.has_profile;
                
                if (hasProfile && response.profile_data) {
                    // User has profile - show view mode by default
                    displayProfile(response.profile_data);
                    $('#close-profile-modal').show();
                    $('#cancel-profile-btn').show();
                } else {
                    // User doesn't have profile - force them to create one
                    showProfileModal(true);
                }
            },
            error: function() {
                console.error('Failed to check profile status');
                showProfileModal(true);
            }
        });
    }
    
    // Display profile information
    function displayProfile(data) {
        const fullName = `${data.first_name} ${data.last_name}`;
        const initials = `${data.first_name.charAt(0)}${data.last_name.charAt(0)}`.toUpperCase();
        
        $('#avatar-initials').text(initials);
        $('#display-full-name').text(fullName);
        $('#display-department').text(data.department);
        $('#display-year-level').text(data.year_level_assigned);
        $('#display-user-id').text(data.adviser_id);
        
        // Populate form fields for editing
        $('#first_name').val(data.first_name);
        $('#last_name').val(data.last_name);
        $('#department').val(data.department);
        $('#year_level').val(data.year_level_assigned);
        
        // Show profile view, hide form
        $('#profile-view').show();
        $('#profile-form').hide();
        $('#profile-modal-title').text('Your Profile');
        $('#profile-alert').hide();
    }
    
    // Show profile modal
    function showProfileModal(mandatory = false) {
        $('#profile-modal-overlay').addClass('active');
        
        if (mandatory) {
            // Mandatory profile creation
            $('#close-profile-modal').hide();
            $('#cancel-profile-btn').hide();
            $('#profile-modal-title').text('Complete Your Profile');
            $('#profile-alert').show();
            $('#profile-view').hide();
            $('#profile-form').show();
        } else {
            // Optional profile view/edit
            $('#close-profile-modal').show();
        }
    }
    
    // Close modal
    function closeProfileModal() {
        if (!hasProfile) {
            // Don't allow closing if profile is not complete
            alert('Please complete your profile to continue.');
            return;
        }
        $('#profile-modal-overlay').removeClass('active');
        isEditMode = false;
    }
    
    // Handle profile form submission
    $('#profile-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        const $saveBtn = $('#save-profile-btn');
        const $saveBtnText = $('#save-btn-text');
        const $saveBtnLoader = $('#save-btn-loader');
        
        // Disable button and show loader
        $saveBtn.prop('disabled', true);
        $saveBtnText.hide();
        $saveBtnLoader.show();
        $('#profile-error').hide();
        
        $.ajax({
            url: '../../sql_php/save_profile.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    // Show success message
                    alert(response.message);
                    
                    // Reload profile data
                    checkProfile();
                    
                    // Close modal if it was a new profile
                    if (!hasProfile) {
                        hasProfile = true;
                        closeProfileModal();
                    }
                    
                    isEditMode = false;
                } else {
                    // Show error
                    $('#error-message').text(response.message);
                    $('#profile-error').show();
                }
            },
            error: function() {
                $('#error-message').text('Network error. Please try again.');
                $('#profile-error').show();
            },
            complete: function() {
                // Re-enable button and hide loader
                $saveBtn.prop('disabled', false);
                $saveBtnText.show();
                $saveBtnLoader.hide();
            }
        });
    });
    
    // Edit profile button
    $('#edit-profile-btn').on('click', function() {
        isEditMode = true;
        $('#profile-view').hide();
        $('#profile-form').show();
        $('#profile-modal-title').text('Edit Profile');
        $('#profile-alert').hide();
        $('#save-btn-text').text('Update Profile');
    });
    
    // Cancel edit
    $('#cancel-profile-btn').on('click', function() {
        if (isEditMode && hasProfile) {
            // Return to view mode
            $('#profile-form').hide();
            $('#profile-view').show();
            $('#profile-modal-title').text('Your Profile');
            $('#profile-error').hide();
            isEditMode = false;
        } else {
            closeProfileModal();
        }
    });
    
    // Close modal button
    $('#close-profile-modal').on('click', closeProfileModal);
    
    // Prevent closing modal by clicking overlay if profile is not complete
    $('#profile-modal-overlay').on('click', function(e) {
        if (e.target === this && hasProfile) {
            closeProfileModal();
        }
    });
    
    // Add profile button to sidebar (optional)
    function addProfileButton() {
        const profileButton = `
            <li class="nav-item">
                <button class="nav-button" id="open-profile-modal">
                    <span class="nav-icon">👤</span>
                    Profile
                </button>
            </li>
        `;
        
        // Insert before logout button
        $('.nav-button[data-page="logout"]').parent().before(profileButton);
        
        $('#open-profile-modal').on('click', function() {
            showProfileModal(false);
        });
    }
    
    // Initialize on document ready
    $(document).ready(function() {
        checkProfile();
        addProfileButton();
    });
    
    // Expose functions globally if needed
    window.profileHandler = {
        showModal: showProfileModal,
        closeModal: closeProfileModal,
        checkProfile: checkProfile
    };
})();