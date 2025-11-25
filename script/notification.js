// Enhanced Notification System with Configurable Duration
const Notifications = (function() {
    
    // Create styles if not already added
    function addStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            /* Toast Container */
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }
            
            /* Toast Notification */
            .toast {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                background: white;
                padding: 16px 20px;
                margin-bottom: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                pointer-events: auto;
                animation: slideIn 0.3s ease-out;
                min-width: 300px;
                max-width: 500px;
                position: relative;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            .toast.hiding {
                animation: slideOut 0.3s ease-in;
            }
            
            .toast-icon {
                font-size: 20px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .toast-content {
                flex: 1;
            }
            
            .toast-title {
                font-weight: 600;
                margin-bottom: 4px;
                font-size: 15px;
            }
            
            .toast-message {
                font-size: 14px;
                opacity: 0.8;
                line-height: 1.4;
            }
            
            .toast-close {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 20px;
                opacity: 0.5;
                transition: opacity 0.2s;
                flex-shrink: 0;
                padding: 0;
                margin-left: 8px;
                line-height: 1;
            }
            
            .toast-close:hover {
                opacity: 1;
            }
            
            /* Progress bar */
            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(0, 0, 0, 0.2);
                width: 100%;
                transform-origin: left;
                animation: progress linear;
            }
            
            @keyframes progress {
                from {
                    transform: scaleX(1);
                }
                to {
                    transform: scaleX(0);
                }
            }
            
            /* Toast Types */
            .toast-success {
                border-left: 4px solid #28a745;
            }
            
            .toast-success .toast-icon {
                color: #28a745;
            }
            
            .toast-success .toast-progress {
                background: #28a745;
            }
            
            .toast-error {
                border-left: 4px solid #dc3545;
            }
            
            .toast-error .toast-icon {
                color: #dc3545;
            }
            
            .toast-error .toast-progress {
                background: #dc3545;
            }
            
            .toast-warning {
                border-left: 4px solid #ffc107;
            }
            
            .toast-warning .toast-icon {
                color: #ffc107;
            }
            
            .toast-warning .toast-progress {
                background: #ffc107;
            }
            
            .toast-info {
                border-left: 4px solid #0066cc;
            }
            
            .toast-info .toast-icon {
                color: #0066cc;
            }
            
            .toast-info .toast-progress {
                background: #0066cc;
            }
            
            /* Confirm Dialog Overlay */
            .confirm-dialog-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            
            .confirm-dialog-overlay.active {
                opacity: 1;
                pointer-events: auto;
            }
            
            /* Confirm Dialog */
            .confirm-dialog {
                background: white;
                border-radius: 12px;
                padding: 32px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                text-align: center;
                max-width: 400px;
                animation: dialogAppear 0.3s ease-out;
            }
            
            @keyframes dialogAppear {
                from {
                    transform: scale(0.9);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            .confirm-dialog-icon {
                font-size: 48px;
                margin-bottom: 16px;
                display: block;
            }
            
            .confirm-dialog-title {
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 12px 0;
                color: #333;
            }
            
            .confirm-dialog-message {
                font-size: 14px;
                color: #666;
                margin: 0 0 24px 0;
                line-height: 1.5;
            }
            
            .confirm-dialog-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
            }
            
            .confirm-dialog-btn {
                padding: 10px 24px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
                min-width: 100px;
            }
            
            .confirm-dialog-btn.primary {
                background: #0066cc;
                color: white;
            }
            
            .confirm-dialog-btn.primary:hover {
                background: #0052a3;
            }
            
            .confirm-dialog-btn.secondary {
                background: #e9ecef;
                color: #333;
            }
            
            .confirm-dialog-btn.secondary:hover {
                background: #dee2e6;
            }
            
            .confirm-dialog-btn.danger {
                background: #dc3545;
                color: white;
            }
            
            .confirm-dialog-btn.danger:hover {
                background: #c82333;
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
                .toast-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }
                
                .toast {
                    min-width: auto;
                    max-width: none;
                }
                
                .confirm-dialog {
                    margin: 20px;
                    max-width: calc(100% - 40px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create toast container if it doesn't exist
    function createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }
    
    // Show toast notification with configurable duration
    function showToast(message, type = 'success', title = '', duration = 5000) {
        addStyles();
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
            <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
        `;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Pause on hover
        let timeoutId;
        let remainingTime = duration;
        let startTime = Date.now();
        let progressBar = toast.querySelector('.toast-progress');
        
        function startTimeout() {
            startTime = Date.now();
            progressBar.style.animationPlayState = 'running';
            timeoutId = setTimeout(() => {
                closeToast(toast);
            }, remainingTime);
        }
        
        function pauseTimeout() {
            clearTimeout(timeoutId);
            remainingTime -= Date.now() - startTime;
            progressBar.style.animationPlayState = 'paused';
        }
        
        toast.addEventListener('mouseenter', pauseTimeout);
        toast.addEventListener('mouseleave', startTimeout);
        
        // Start auto-close timer
        startTimeout();
        
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
            addStyles();
            
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
                question: '❓',
                success: '✓',
                error: '✕'
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
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                    config.onConfirm();
                    resolve(true);
                }, 300);
            });
            
            // Handle cancel
            document.getElementById('confirm-cancel').addEventListener('click', () => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                    config.onCancel();
                    resolve(false);
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
            addStyles();
            
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
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
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
    
    // Public API with configurable durations
    return {
        // Main toast function with custom duration
        toast: showToast,
        
        // Convenience methods with default durations
        success: (message, title, duration = 5000) => showToast(message, 'success', title, duration),
        error: (message, title, duration = 7000) => showToast(message, 'error', title, duration),
        warning: (message, title, duration = 6000) => showToast(message, 'warning', title, duration),
        info: (message, title, duration = 5000) => showToast(message, 'info', title, duration),
        
        // Close toast manually
        closeToast: closeToast,
        
        // Dialog methods
        confirm: confirm,
        alert: alert
    };
})();

// Make it globally available
window.Notifications = Notifications;