$(document).ready(function() {
    const $form = $('#changePasswordForm');
    const $currentPassword = $('#currentPassword');
    const $newPassword = $('#newPassword');
    const $confirmPassword = $('#confirmPassword');
    const $alertMessage = $('#alertMessage');
    const $reqLength = $('#req-length');
    const $reqMatch = $('#req-match');

    function validatePassword() {
        const newPass = $newPassword.val();
        const confirmPass = $confirmPassword.val();
        
        if (newPass.length >= 8) {
            $reqLength.addClass('valid');
        } else {
            $reqLength.removeClass('valid');
        }

        if (newPass && confirmPass && newPass === confirmPass) {
            $reqMatch.addClass('valid');
        } else {
            $reqMatch.removeClass('valid');
        }
    }

    $newPassword.on('input', validatePassword);
    $confirmPassword.on('input', validatePassword);

    function showAlert(message, type) {
        $alertMessage.removeClass('hidden success error')
                    .addClass(type)
                    .text(message);
        
        $('html, body').animate({
            scrollTop: $alertMessage.offset().top - 100
        }, 300);

        if (type === 'success') {
            setTimeout(() => {
                $alertMessage.addClass('hidden');
            }, 5000);
        }
    }

    $form.on('submit', function(e) {
        e.preventDefault();

        const currentPassword = $currentPassword.val();
        const newPassword = $newPassword.val();
        const confirmPassword = $confirmPassword.val();

        if (newPassword.length < 8) {
            showAlert('New password must be at least 8 characters long', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert('New passwords do not match', 'error');
            return;
        }

        if (currentPassword === newPassword) {
            showAlert('New password must be different from current password', 'error');
            return;
        }

        const $submitBtn = $form.find('button[type="submit"]');
        $submitBtn.prop('disabled', true).text('Changing Password...');

        $.ajax({
            url: '../../sql_php/student_process_change_password.php',
            type: 'POST',
            dataType: 'json',
            data: {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            },
            success: function(response) {
                if (response.success) {
                    showAlert(response.message, 'success');
                    $form[0].reset();
                    $reqLength.removeClass('valid');
                    $reqMatch.removeClass('valid');

                    setTimeout(() => {
                        window.location.href = '../../sql_php/logout.php';
                    }, 3000);
                } else {
                    showAlert(response.error || 'Failed to change password', 'error');
                    $submitBtn.prop('disabled', false).text('Change Password');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                showAlert('Connection error. Please try again.', 'error');
                $submitBtn.prop('disabled', false).text('Change Password');
            }
        });
    });
});