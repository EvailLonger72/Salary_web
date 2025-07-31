// UI Enhancement Functions for Shift Pay Calculator

/**
 * Modern Notification System
 */
class NotificationManager {
    constructor() {
        this.container = document.getElementById('notificationContainer') || this.createContainer();
        this.notifications = [];
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', title = '', duration = 4000) {
        const notification = this.createNotification(message, type, title, duration);
        this.container.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }

        this.notifications.push(notification);
        return notification;
    }

    createNotification(message, type, title, duration) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const icon = icons[type] || icons.info;

        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                ${title ? `<div class="notification-title">${title}</div>` : ''}
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="notificationManager.remove(this.parentElement)">×</button>
            ${duration > 0 ? '<div class="notification-progress"></div>' : ''}
        `;

        return notification;
    }

    remove(notification) {
        if (notification && notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
                this.notifications = this.notifications.filter(n => n !== notification);
            }, 400);
        }
    }

    success(message, title = 'Success') {
        return this.show(message, 'success', title);
    }

    error(message, title = 'Error') {
        return this.show(message, 'error', title);
    }

    warning(message, title = 'Warning') {
        return this.show(message, 'warning', title);
    }

    info(message, title = 'Info') {
        return this.show(message, 'info', title);
    }

    clear() {
        this.notifications.forEach(notification => this.remove(notification));
    }
}

// Global notification manager instance
const notificationManager = new NotificationManager();

/**
 * Loading Manager
 */
class LoadingManager {
    constructor() {
        this.overlay = document.getElementById('loadingOverlay') || this.createOverlay();
        this.text = document.getElementById('loadingText');
        this.isActive = false;
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text" id="loadingText">Processing...</div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.text = overlay.querySelector('#loadingText');
        return overlay;
    }

    show(text = 'Processing...') {
        if (this.text) {
            this.text.textContent = text;
        }
        this.overlay.classList.add('active');
        this.isActive = true;
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.overlay.classList.remove('active');
        this.isActive = false;
        document.body.style.overflow = '';
    }

    toggle(text) {
        if (this.isActive) {
            this.hide();
        } else {
            this.show(text);
        }
    }
}

// Global loading manager instance
const loadingManager = new LoadingManager();

/**
 * Form Validation Manager
 */
class FormValidator {
    constructor() {
        this.rules = {};
        this.errors = {};
    }

    addRule(fieldId, validator, errorMessage) {
        if (!this.rules[fieldId]) {
            this.rules[fieldId] = [];
        }
        this.rules[fieldId].push({ validator, errorMessage });
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const fieldGroup = field?.closest('.form-group');
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (!field || !this.rules[fieldId]) return true;

        // Clear previous states
        fieldGroup?.classList.remove('has-error', 'has-success');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }

        // Run validators
        for (const rule of this.rules[fieldId]) {
            if (!rule.validator(field.value, field)) {
                this.setFieldError(fieldId, rule.errorMessage);
                return false;
            }
        }

        this.setFieldSuccess(fieldId);
        return true;
    }

    setFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const fieldGroup = field?.closest('.form-group');
        const errorElement = document.getElementById(fieldId + 'Error');

        fieldGroup?.classList.add('has-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        this.errors[fieldId] = message;
    }

    setFieldSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        const fieldGroup = field?.closest('.form-group');

        fieldGroup?.classList.add('has-success');
        delete this.errors[fieldId];
    }

    validateAll(fieldIds) {
        let isValid = true;
        fieldIds.forEach(fieldId => {
            if (!this.validateField(fieldId)) {
                isValid = false;
            }
        });
        return isValid;
    }

    getErrors() {
        return Object.values(this.errors);
    }

    clearErrors() {
        this.errors = {};
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error', 'has-success');
        });
        document.querySelectorAll('.form-error').forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });
    }
}

// Global form validator instance
const formValidator = new FormValidator();

/**
 * Button Enhancement Manager
 */
class ButtonManager {
    static setLoading(buttonId, isLoading = true, loadingText = 'Processing...') {
        const button = document.getElementById(buttonId);
        if (!button) return;

        if (isLoading) {
            button.dataset.originalText = button.innerHTML;
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
            if (button.dataset.originalText) {
                button.innerHTML = button.dataset.originalText;
            }
        }
    }

    static disable(buttonId, disabled = true) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = disabled;
            if (disabled) {
                button.classList.add('disabled');
            } else {
                button.classList.remove('disabled');
            }
        }
    }

    static addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }
}

/**
 * Enhanced Animation Utilities
 */
class AnimationManager {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = performance.now();
        
        function animate(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        let start = performance.now();
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }

    static slideIn(element, direction = 'up', duration = 300) {
        const directions = {
            up: 'translateY(20px)',
            down: 'translateY(-20px)',
            left: 'translateX(20px)',
            right: 'translateX(-20px)'
        };

        element.style.transform = directions[direction];
        element.style.opacity = '0';
        element.style.display = 'block';

        setTimeout(() => {
            element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            element.style.transform = 'translate(0)';
            element.style.opacity = '1';
        }, 10);
    }

    static pulse(element, intensity = 1.05, duration = 300) {
        element.style.transform = `scale(${intensity})`;
        element.style.transition = `transform ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration);
    }

    static shake(element, intensity = 5, duration = 300) {
        let start = performance.now();
        const originalTransform = element.style.transform;
        
        function animate(timestamp) {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const displacement = Math.sin(progress * Math.PI * 8) * intensity * (1 - progress);
                element.style.transform = `${originalTransform} translateX(${displacement}px)`;
                requestAnimationFrame(animate);
            } else {
                element.style.transform = originalTransform;
            }
        }
        
        requestAnimationFrame(animate);
    }
}

/**
 * Accessibility Enhancements
 */
class AccessibilityManager {
    static init() {
        this.addKeyboardNavigation();
        this.addAriaLabels();
        this.addFocusManagement();
    }

    static addKeyboardNavigation() {
        // Add keyboard support for custom buttons
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('btn')) {
                e.target.click();
            }
        });
    }

    static addAriaLabels() {
        // Add ARIA labels to buttons without text
        document.querySelectorAll('button').forEach(button => {
            if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
                const icon = button.querySelector('span');
                if (icon) {
                    button.setAttribute('aria-label', icon.textContent || 'Button');
                }
            }
        });
    }

    static addFocusManagement() {
        // Improve focus visibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    static announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        document.body.appendChild(announcement);
        announcement.textContent = message;
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Initialize UI enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('UI Enhancements loaded');
    
    // Initialize accessibility features
    AccessibilityManager.init();
    
    // Add ripple effects to buttons
    document.querySelectorAll('.btn, .calculate-btn, .add-btn').forEach(button => {
        ButtonManager.addRippleEffect(button);
    });
    
    // Setup form validation
    setupFormValidation();
});

/**
 * Setup Form Validation Rules
 */
function setupFormValidation() {
    // Shift Type validation
    formValidator.addRule('shiftType', 
        (value) => value !== '', 
        'Please select a shift type'
    );

    // Start Time validation
    formValidator.addRule('startTime', 
        (value) => value !== '', 
        'Please enter start time'
    );

    // End Time validation
    formValidator.addRule('endTime', 
        (value) => value !== '', 
        'Please enter end time'
    );

    // End Time should be different from start time
    formValidator.addRule('endTime', 
        (value) => {
            const startTime = document.getElementById('startTime').value;
            return startTime === '' || value !== startTime;
        }, 
        'End time must be different from start time'
    );

    // Work Date validation
    formValidator.addRule('workDate', 
        (value) => value !== '', 
        'Please select work date'
    );

    // Work Date should not be in the future
    formValidator.addRule('workDate', 
        (value) => {
            if (value === '') return true;
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(23, 59, 59, 999); // End of today
            return selectedDate <= today;
        }, 
        'Work date cannot be in the future'
    );

    // Add real-time validation
    ['shiftType', 'startTime', 'endTime', 'workDate'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => formValidator.validateField(fieldId));
            field.addEventListener('change', () => formValidator.validateField(fieldId));
        }
    });
}

// Export for global access
window.notificationManager = notificationManager;
window.loadingManager = loadingManager;
window.formValidator = formValidator;
window.ButtonManager = ButtonManager;
window.AnimationManager = AnimationManager;
window.AccessibilityManager = AccessibilityManager;

console.log('✅ UI Enhancement system loaded successfully');