// Profile Modal Handler - Updated with Assigned Sets Support
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
        const fullName = `${data.first_name} ${data.middle_initial || ''} ${data.last_name}`.trim();
        const initials = `${data.first_name.charAt(0)}${data.last_name.charAt(0)}`.toUpperCase();
        
        $('#avatar-initials').text(initials);
        $('#display-full-name').text(fullName);
        $('#display-department').text(data.department);
        $('#display-year-level').text(data.year_level_assigned);
        $('#display-user-id').text(data.adviser_id);
        
        const position = data.position || 'Not Assigned';
        $('#display-position').text(position);
        
        // Display assigned sets
        displayAssignedSets(data.assigned_sets || [], '#display-assigned-sets', data);
        
        // Populate form fields
        $('#first_name').val(data.first_name);
        $('#middle_initial').val(data.middle_initial || '');
        $('#last_name').val(data.last_name);
        
        // Populate READ-ONLY fields
        $('#department_readonly').val(data.department);
        $('#department').val(data.department);
        
        $('#year_level_readonly').val(data.year_level_assigned);
        $('#year_level').val(data.year_level_assigned);
        
        $('#position_readonly').val(position);
        $('#position').val(position);
        
        // Store assigned sets
        $('#assigned_sets').val(JSON.stringify(data.assigned_sets || []));
        displayAssignedSets(data.assigned_sets || [], '#assigned_sets_display', data);
        
        $('#profile-view').show();
        $('#profile-form').hide();
        $('#profile-modal-title').text('Your Profile');
        $('#profile-alert').hide();
    }
    
    // Display assigned sets as badges
    function displayAssignedSets(sets, targetSelector, profileData) {
        const container = $(targetSelector);
        container.empty();
        
        if (!sets || sets.length === 0) {
            container.html('<span style="color: #999;">No sets assigned</span>');
            return;
        }
        
        // Check if Department Head or Dean
        const position = (profileData?.position || '').toLowerCase();
        const isDeanOrHead = position.includes('dean') || 
                            position.includes('department head') || 
                            position.includes('head');
        
        if (isDeanOrHead) {
            // Show "All Sets" badge for Department Heads/Deans
            const allSetsBadge = $(`
                <span class="set-badge" style="
                    background: linear-gradient(135deg, #ffd700, #ffed4e);
                    color: #333;
                    font-weight: 700;
                    border: 2px solid #f0c000;
                ">
                    ⭐ All Sets
                </span>
            `);
            container.append(allSetsBadge);
            
            // Add count
            const countText = $(`
                <span style="
                    color: #666;
                    font-size: 12px;
                    margin-left: 8px;
                    font-style: italic;
                ">
                    (${sets.length} sets)
                </span>
            `);
            container.append(countText);
        } else {
            // Show individual set badges for Advisers
            sets.forEach(set => {
                const badge = $('<span class="set-badge"></span>').text(set);
                container.append(badge);
            });
        }
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
            if (typeof Notifications !== 'undefined') {
                Notifications.alert({
                    title: 'Profile Required',
                    message: 'Please complete your profile to continue.',
                    icon: 'warning',
                    buttonText: 'OK',
                    buttonClass: 'primary'
                });
            } else {
                alert('Please complete your profile to continue.');
            }
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
            url: '../../sql_php/save_profile.php',
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
    
    // Add profile button to sidebar
    function addProfileButton() {
        const profileButton = `
            <li class="nav-item">
                <button class="nav-button" id="open-profile-modal">
                    <span class="nav-icon">👤</span>
                    Profile
                </button>
            </li>
        `;
        
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
    
    // Expose functions globally
    window.profileHandler = {
        showModal: showProfileModal,
        closeModal: closeProfileModal,
        checkProfile: checkProfile
    };
})();