// Admin Profile Modal Handler
(function() {
    let hasProfile = false;
    let isEditMode = false;
    
    // Check profile on page load
    function checkProfile() {
        $.ajax({
            url: '../../sql_php/admin/check_admin_profile.php?ajax=1',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                hasProfile = response.has_profile;
                
                if (hasProfile && response.profile_data) {
                    displayProfile(response.profile_data);
                    $('#close-profile-modal').show();
                    $('#cancel-profile-btn').show();
                } else {
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
        const fullName = `${data.first_name} ${data.middle_initial ? data.middle_initial + ' ' : ''}${data.last_name}`;
        const initials = `${data.first_name.charAt(0)}${data.last_name.charAt(0)}`.toUpperCase();
        
        $('#avatar-initials').text(initials);
        $('#display-full-name').text(fullName);
        $('#display-user-id').text(data.user_id);
        $('#display-email').text(data.email || 'Not set');
        
        $('#first_name').val(data.first_name);
        $('#middle_initial').val(data.middle_initial || '');
        $('#last_name').val(data.last_name);
        $('#email').val(data.email || '');
        
        $('#profile-view').show();
        $('#profile-form').hide();
        $('#profile-modal-title').text('Your Profile');
        $('#profile-alert').hide();
    }
    
    // Show profile modal
    function showProfileModal(mandatory = false) {
        $('#profile-modal-overlay').addClass('active');
        
        if (mandatory) {
            $('#close-profile-modal').hide();
            $('#cancel-profile-btn').hide();
            $('#profile-modal-title').text('Complete Your Profile');
            $('#profile-alert').show();
            $('#profile-view').hide();
            $('#profile-form').show();
        } else {
            $('#close-profile-modal').show();
        }
    }
    
    // Close modal
    function closeProfileModal() {
        if (!hasProfile) {
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
        
        $saveBtn.prop('disabled', true);
        $saveBtnText.hide();
        $saveBtnLoader.show();
        $('#profile-error').hide();
        
        $.ajax({
            url: '../../sql_php/admin/save_admin_profile.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    checkProfile();
                    
                    if (!hasProfile) {
                        hasProfile = true;
                        closeProfileModal();
                    }
                    
                    isEditMode = false;
                } else {
                    $('#error-message').text(response.message);
                    $('#profile-error').show();
                }
            },
            error: function() {
                $('#error-message').text('Network error. Please try again.');
                $('#profile-error').show();
            },
            complete: function() {
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
    
    // Add profile button to sidebar (if not already exists)
    function addProfileButton() {
        // Check if profile button already exists
        if ($('#open-profile-modal').length > 0) {
            return;
        }
        
        const profileButton = `
            <li class="nav-item">
                <button class="nav-button" id="open-profile-modal">
                    <span class="nav-icon">👤</span>
                    Profile
                </button>
            </li>
        `;
        
        // Find logout button and add profile button before it
        const $logoutButton = $('.nav-button[data-page="logout"]').parent();
        if ($logoutButton.length > 0) {
            $logoutButton.before(profileButton);
        } else {
            // If logout button not found, append to nav list
            $('.sidebar nav ul').append(profileButton);
        }
        
        $('#open-profile-modal').on('click', function() {
            showProfileModal(false);
        });
    }
    
    // Initialize on document ready
    $(document).ready(function() {
        checkProfile();
        addProfileButton();
    });
    
    // Expose functions globally
    window.adminProfileHandler = {
        showModal: showProfileModal,
        closeModal: closeProfileModal,
        checkProfile: checkProfile
    };
})();