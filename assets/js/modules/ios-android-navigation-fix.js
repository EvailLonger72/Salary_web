// iOS/Android Navigation Fix - Comprehensive solution for navigation errors
// This module specifically addresses iOS and Android navigation issues

/**
 * iOS/Android Navigation Fixer
 * Handles navigation errors that occur on mobile devices
 */
class iOSAndroidNavigationFixer {
    constructor() {
        this.isFixing = false;
        this.originalOnclickHandlers = new Map();
        this.touchStartTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        
        // Device detection
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        this.isAndroid = /Android/.test(navigator.userAgent);
        this.isMobile = this.isIOS || this.isAndroid;
        
        console.log(`📱 iOS/Android Navigation Fixer - iOS: ${this.isIOS}, Android: ${this.isAndroid}`);
        
        // Bind methods
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.preventDefaultClick = this.preventDefaultClick.bind(this);
    }
    
    /**
     * Initialize the navigation fixer
     */
    init() {
        if (!this.isMobile) {
            console.log('📱 Not a mobile device, skipping navigation fix');
            return;
        }
        
        console.log('🔧 Initializing iOS/Android navigation fixes...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyFixes());
        } else {
            this.applyFixes();
        }
        
        // Apply fixes when page becomes visible (return from other pages)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('📄 Page visible, reapplying navigation fixes...');
                setTimeout(() => this.applyFixes(), 100);
            }
        });
    }
    
    /**
     * Apply all navigation fixes
     */
    applyFixes() {
        try {
            this.fixNavigationItems();
            this.addMobileEventHandlers();
            this.preventNavigationBlocking();
            console.log('✅ iOS/Android navigation fixes applied');
        } catch (error) {
            console.error('❌ Error applying navigation fixes:', error);
        }
    }
    
    /**
     * Fix navigation items with onclick handlers
     */
    fixNavigationItems() {
        const navItems = document.querySelectorAll('.nav-item[onclick]');
        console.log(`🔍 Found ${navItems.length} navigation items with onclick handlers`);
        
        navItems.forEach((item, index) => {
            const onclickAttr = item.getAttribute('onclick');
            if (!onclickAttr) return;
            
            console.log(`🔧 Fixing nav item ${index + 1}: ${item.textContent.trim()}`);
            
            // Store original onclick
            this.originalOnclickHandlers.set(item, onclickAttr);
            
            // Remove the onclick attribute to prevent conflicts
            item.removeAttribute('onclick');
            
            // Add our custom event handlers
            this.addCustomClickHandler(item, onclickAttr);
        });
    }
    
    /**
     * Add custom click handler that works on iOS/Android
     */
    addCustomClickHandler(item, originalOnclick) {
        // Remove any existing listeners
        const clonedItem = item.cloneNode(true);
        item.parentNode.replaceChild(clonedItem, item);
        
        // Add touch-friendly event listeners
        clonedItem.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        clonedItem.addEventListener('touchend', (e) => this.handleTouchEnd(e, originalOnclick), { passive: false });
        clonedItem.addEventListener('click', (e) => this.handleNavClick(e, originalOnclick), { passive: false });
        
        // Add visual feedback
        clonedItem.addEventListener('touchstart', () => {
            clonedItem.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }, { passive: true });
        
        clonedItem.addEventListener('touchend', () => {
            setTimeout(() => {
                clonedItem.style.backgroundColor = '';
            }, 150);
        }, { passive: true });
    }
    
    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        this.touchStartTime = Date.now();
        this.touchStartPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
    
    /**
     * Handle touch end
     */
    handleTouchEnd(e, originalOnclick) {
        e.preventDefault();
        e.stopPropagation();
        
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - this.touchStartTime;
        
        // Check if this was a tap (not a scroll)
        const touchEndPos = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
        
        const distance = Math.sqrt(
            Math.pow(touchEndPos.x - this.touchStartPos.x, 2) + 
            Math.pow(touchEndPos.y - this.touchStartPos.y, 2)
        );
        
        // If it's a valid tap (short duration, small movement)
        if (touchDuration < 500 && distance < 10) {
            console.log('👆 Valid tap detected, executing navigation...');
            this.executeNavigation(originalOnclick);
        }
    }
    
    /**
     * Handle regular click (fallback)
     */
    handleNavClick(e, originalOnclick) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🖱️ Click detected, executing navigation...');
        this.executeNavigation(originalOnclick);
    }
    
    /**
     * Execute navigation safely
     */
    executeNavigation(originalOnclick) {
        if (this.isFixing) {
            console.log('🔄 Navigation already in progress...');
            return;
        }
        
        this.isFixing = true;
        
        try {
            console.log(`🚀 Executing navigation: ${originalOnclick}`);
            
            // Close mobile menu if open
            if (typeof window.closeMobileMenu === 'function') {
                window.closeMobileMenu();
            }
            
            // Reset body styles that might interfere
            this.resetBodyStyles();
            
            // Execute the navigation after a short delay
            setTimeout(() => {
                try {
                    // Parse and execute the onclick command
                    if (originalOnclick.includes('window.location.href')) {
                        const urlMatch = originalOnclick.match(/window\.location\.href\s*=\s*['"`]([^'"`]+)['"`]/);
                        if (urlMatch) {
                            const url = urlMatch[1];
                            console.log(`🔗 Navigating to: ${url}`);
                            window.location.href = url;
                        }
                    } else {
                        // Fallback: execute the original code
                        eval(originalOnclick);
                    }
                } catch (error) {
                    console.error('❌ Navigation execution error:', error);
                    // Try direct eval as last resort
                    try {
                        eval(originalOnclick);
                    } catch (fallbackError) {
                        console.error('❌ Fallback navigation failed:', fallbackError);
                    }
                }
                
                this.isFixing = false;
            }, 100);
            
        } catch (error) {
            console.error('❌ Error in executeNavigation:', error);
            this.isFixing = false;
        }
    }
    
    /**
     * Add mobile-specific event handlers
     */
    addMobileEventHandlers() {
        // Prevent default touch behavior on nav items
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.nav-item')) {
                // Allow the touch but prepare for custom handling
                console.log('👆 Touch on navigation item detected');
            }
        }, { passive: true });
        
        // Handle back button / page visibility
        window.addEventListener('pageshow', () => {
            console.log('📄 Page shown, resetting navigation state...');
            this.resetNavigationState();
        });
        
        window.addEventListener('focus', () => {
            console.log('🎯 Window focused, checking navigation...');
            setTimeout(() => this.resetNavigationState(), 200);
        });
    }
    
    /**
     * Prevent navigation blocking
     */
    preventNavigationBlocking() {
        // Ensure body interactions are never permanently blocked
        const resetInterval = setInterval(() => {
            if (document.body.style.pointerEvents === 'none' && 
                !document.body.classList.contains('mobile-menu-open')) {
                
                console.log('🚨 Detected blocked navigation, auto-fixing...');
                this.resetBodyStyles();
            }
        }, 1000);
        
        // Clear interval after 30 seconds to avoid memory leaks
        setTimeout(() => clearInterval(resetInterval), 30000);
    }
    
    /**
     * Reset body styles that might block navigation
     */
    resetBodyStyles() {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.style.pointerEvents = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.userSelect = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        // Remove problematic classes
        document.body.classList.remove('mobile-menu-open');
        
        // iOS specific resets
        if (this.isIOS) {
            document.body.style.webkitOverflowScrolling = 'touch';
            document.body.style.webkitTouchCallout = '';
            
            // Force layout recalculation
            document.body.offsetHeight;
        }
        
        console.log('🔄 Body styles reset for navigation');
    }
    
    /**
     * Reset navigation state
     */
    resetNavigationState() {
        this.isFixing = false;
        this.resetBodyStyles();
        
        // Ensure mobile menu is closed
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.mobile-overlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
        if (toggle) toggle.innerHTML = '☰';
        
        console.log('🔄 Navigation state reset complete');
    }
    
    /**
     * Emergency fix function
     */
    emergencyFix() {
        console.log('🚨 EMERGENCY NAVIGATION FIX ACTIVATED');
        
        this.resetNavigationState();
        this.resetBodyStyles();
        
        // Reapply fixes
        setTimeout(() => {
            this.applyFixes();
            console.log('✅ Emergency fix completed');
        }, 300);
    }
}

// Create global instance
window.iOSAndroidNavFixer = new iOSAndroidNavigationFixer();

// Auto-initialize
window.iOSAndroidNavFixer.init();

// Export emergency fix function globally
window.emergencyFixNavigation = () => window.iOSAndroidNavFixer.emergencyFix();

// Log that module is loaded
console.log('📱 iOS/Android Navigation Fix Module Loaded');

// Compatibility with existing functions
if (typeof window.fixMobileNavigation === 'undefined') {
    window.fixMobileNavigation = () => window.iOSAndroidNavFixer.emergencyFix();
}