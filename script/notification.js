// Enhanced Notification System
const Notifications = (function() {
    
    // Create toast container if it doesn't exist
    function createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }
    
    // Show toast notification
    function showToast(message, type = 'success', title = '') {
        createToastContainer();
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const titles = {
            success: title || 'Success',
            error: title || 'Error',
            warning: title || 'Warning',
            info: title || 'Info'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="Notifications.closeToast(this)">×</button>
        `;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            closeToast(toast);
        }, 4000);
        
        return toast;
    }
    
    // Close toast
    function closeToast(element) {
        const toast = element.classList ? element : element.closest('.toast');
        if (toast) {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }
    
    // Show confirmation dialog
    function confirm(options) {
        return new Promise((resolve) => {
            const defaults = {
                title: 'Confirm Action',
                message: 'Are you sure you want to proceed?',
                icon: 'warning',
                confirmText: 'Confirm',
                cancelText: 'Cancel',
                confirmClass: 'primary',
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            };
            
            const config = { ...defaults, ...options };
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'confirm-dialog-overlay active';
            
            const iconEmojis = {
                warning: '⚠️',
                danger: '🚨',
                info: 'ℹ️',
                question: '❓'
            };
            
            overlay.innerHTML = `
                <div class="confirm-dialog">
                    <div class="confirm-dialog-icon ${config.icon}">
                        ${iconEmojis[config.icon] || '❓'}
                    </div>
                    <h3 class="confirm-dialog-title">${config.title}</h3>
                    <p class="confirm-dialog-message">${config.message}</p>
                    <div class="confirm-dialog-actions">
                        <button class="confirm-dialog-btn secondary" id="confirm-cancel">
                            ${config.cancelText}
                        </button>
                        <button class="confirm-dialog-btn ${config.confirmClass}" id="confirm-ok">
                            ${config.confirmText}
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Handle confirm
            document.getElementById('confirm-ok').addEventListener('click', () => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    config.onConfirm();
                }, 300);
            });
            
            // Handle cancel
            document.getElementById('confirm-cancel').addEventListener('click', () => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    config.onCancel();
                }, 300);
            });
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.getElementById('confirm-cancel').click();
                }
            });
        });
    }
    
    // Show alert dialog
    function alert(options) {
        return new Promise((resolve) => {
            const defaults = {
                title: 'Alert',
                message: 'This is an alert message',
                icon: 'info',
                buttonText: 'OK',
                buttonClass: 'primary'
            };
            
            const config = { ...defaults, ...options };
            
            const overlay = document.createElement('div');
            overlay.className = 'confirm-dialog-overlay active';
            
            const iconEmojis = {
                success: '✓',
                error: '✕',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            overlay.innerHTML = `
                <div class="confirm-dialog">
                    <div class="confirm-dialog-icon ${config.icon}">
                        ${iconEmojis[config.icon] || 'ℹ️'}
                    </div>
                    <h3 class="confirm-dialog-title">${config.title}</h3>
                    <p class="confirm-dialog-message">${config.message}</p>
                    <div class="confirm-dialog-actions">
                        <button class="confirm-dialog-btn ${config.buttonClass}" id="alert-ok">
                            ${config.buttonText}
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            document.getElementById('alert-ok').addEventListener('click', () => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, 300);
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.getElementById('alert-ok').click();
                }
            });
        });
    }
    
    // Public API
    return {
        toast: showToast,
        success: (message, title) => showToast(message, 'success', title),
        error: (message, title) => showToast(message, 'error', title),
        warning: (message, title) => showToast(message, 'warning', title),
        info: (message, title) => showToast(message, 'info', title),
        closeToast: closeToast,
        confirm: confirm,
        alert: alert
    };
})();

// Make it globally available
window.Notifications = Notifications;