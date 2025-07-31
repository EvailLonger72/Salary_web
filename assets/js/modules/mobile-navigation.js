// mobile-navigation.js - Unified mobile navigation for all pages
// Fixes iOS and Android navigation issues

/**
 * Unified Mobile Navigation Handler
 * Works across all pages with consistent behavior
 */
class MobileNavigationHandler {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.toggle = null;
        this.isInitialized = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        // Bind methods to preserve context
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }
    
    /**
     * Initialize mobile navigation
     */
    init() {
        if (this.isInitialized) {
            console.log('Mobile navigation already initialized');
            return;
        }
        
        try {
            // Find navigation elements
            this.sidebar = document.querySelector('.sidebar');
            this.overlay = document.querySelector('.mobile-overlay');
            this.toggle = document.querySelector('.mobile-menu-toggle');
            
            if (!this.sidebar || !this.overlay || !this.toggle) {
                console.warn('Mobile navigation elements not found, retrying...');
                
                // Retry after a short delay (for pages that load scripts asynchronously)
                setTimeout(() => {
                    if (!this.isInitialized) {
                        this.init();
                    }
                }, 100);
                return;
            }
            
            // Add iOS/Android specific improvements
            this.setupMobileOptimizations();
            
            // Add event listeners
            this.addEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Mobile navigation initialized successfully');
            
            // Ensure onclick handlers on nav items are not blocked
            this.ensureOnclickHandlersWork();
            
        } catch (error) {
            console.error('Error initializing mobile navigation:', error);
        }
    }
    
    /**
     * Ensure onclick handlers work properly (especially for external pages)
     */
    ensureOnclickHandlersWork() {
        const navItemsWithOnclick = this.sidebar.querySelectorAll('.nav-item[onclick]');
        console.log(`Found ${navItemsWithOnclick.length} navigation items with onclick handlers`);
        
        navItemsWithOnclick.forEach(item => {
            // Ensure the onclick attribute is preserved and working
            const onclickAttr = item.getAttribute('onclick');
            if (onclickAttr) {
                console.log(`Preserving onclick for: ${item.textContent.trim()} → ${onclickAttr}`);
                
                // Add a safety click handler that ensures onclick works
                item.addEventListener('click', function(e) {
                    // Let the onclick handler execute
                    console.log(`Navigation item clicked: ${this.textContent.trim()}`);
                    
                    // Close mobile menu after a short delay
                    setTimeout(() => {
                        if (window.MobileNavigation && window.MobileNavigation.closeMenu) {
                            window.MobileNavigation.closeMenu();
                        }
                    }, 100);
                }, { passive: true });
            }
        });
    }
    
    /**
     * Setup mobile-specific optimizations
     */
    setupMobileOptimizations() {
        // Prevent bounce scrolling on iOS
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Add mobile-specific classes for iOS/Android detection
        if (this.isIOS()) {
            document.body.classList.add('ios-device');
        }
        
        if (this.isAndroid()) {
            document.body.classList.add('android-device');
        }
        
        // Ensure proper z-index stacking
        this.overlay.style.zIndex = '998';
        this.sidebar.style.zIndex = '1001';
        this.toggle.style.zIndex = '1002';
    }
    
    /**
     * Add all event listeners
     */
    addEventListeners() {
        // Remove any existing listeners to prevent duplicates
        this.removeEventListeners();
        
        // Toggle button
        this.toggle.addEventListener('click', this.toggleMenu, { passive: false });
        this.toggle.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.toggle.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        
        // Overlay
        this.overlay.addEventListener('click', this.handleOverlayClick, { passive: false });
        this.overlay.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.overlay.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.overlay.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        
        // Keyboard support
        document.addEventListener('keydown', this.handleEscape, { passive: false });
        
        // Window resize
        window.addEventListener('resize', this.handleResize, { passive: true });
        
        // Navigation items in sidebar
        this.setupSidebarNavigation();
        
        console.log('📱 Mobile navigation event listeners added');
    }
    
    /**
     * Remove event listeners
     */
    removeEventListeners() {
        if (this.toggle) {
            this.toggle.removeEventListener('click', this.toggleMenu);
            this.toggle.removeEventListener('touchstart', this.handleTouchStart);
            this.toggle.removeEventListener('touchend', this.handleTouchEnd);
        }
        
        if (this.overlay) {
            this.overlay.removeEventListener('click', this.handleOverlayClick);
            this.overlay.removeEventListener('touchstart', this.handleTouchStart);
            this.overlay.removeEventListener('touchmove', this.handleTouchMove);
            this.overlay.removeEventListener('touchend', this.handleTouchEnd);
        }
        
        document.removeEventListener('keydown', this.handleEscape);
        window.removeEventListener('resize', this.handleResize);
    }
    
    /**
     * Setup sidebar navigation items
     */
    setupSidebarNavigation() {
        const navItems = this.sidebar.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            // Skip items that have onclick handlers (external links)
            if (item.hasAttribute('onclick')) {
                console.log('Skipping nav item with onclick:', item.textContent.trim());
                
                // Add touch handling for iOS/Android without interfering with onclick
                item.addEventListener('touchstart', (e) => {
                    item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }, { passive: true });
                
                item.addEventListener('touchend', (e) => {
                    item.style.backgroundColor = '';
                    // Close menu after navigation for external links
                    setTimeout(() => this.closeMenu(), 50);
                }, { passive: true });
                
                item.addEventListener('touchcancel', (e) => {
                    item.style.backgroundColor = '';
                }, { passive: true });
                
                return; // Skip adding click handlers for external links
            }
            
            // Add touch handling for internal navigation items
            item.addEventListener('touchstart', (e) => {
                item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }, { passive: true });
            
            item.addEventListener('touchend', (e) => {
                item.style.backgroundColor = '';
                // Close menu after navigation
                setTimeout(() => this.closeMenu(), 150);
            }, { passive: true });
            
            item.addEventListener('touchcancel', (e) => {
                item.style.backgroundColor = '';
            }, { passive: true });
        });
    }
    
    /**
     * Toggle mobile menu
     */
    toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        try {
            const isOpen = this.sidebar.classList.contains('mobile-open');
            
            if (isOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
            
            // Haptic feedback on supported devices
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
        } catch (error) {
            console.error('Error toggling mobile menu:', error);
        }
    }
    
    /**
     * Open mobile menu
     */
    openMenu() {
        this.sidebar.classList.add('mobile-open');
        this.overlay.classList.add('active');
        this.toggle.innerHTML = '✕';
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        
        // Show overlay
        this.overlay.style.display = 'block';
        
        console.log('📱 Mobile menu opened');
    }
    
    /**
     * Close mobile menu
     */
    closeMenu() {
        try {
            this.sidebar.classList.remove('mobile-open');
            this.overlay.classList.remove('active');
            this.toggle.innerHTML = '☰';
            
            // Restore body interactions
            this.resetBodyInteractions();
            
            // Hide overlay after animation
            setTimeout(() => {
                if (!this.overlay.classList.contains('active')) {
                    this.overlay.style.display = 'none';
                }
            }, 300);
            
            console.log('📱 Mobile menu closed');
            
        } catch (error) {
            console.error('Error closing mobile menu:', error);
        }
    }
    
    /**
     * Reset body interactions for iOS/Android
     */
    resetBodyInteractions() {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.style.pointerEvents = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.userSelect = '';
        
        // iOS specific fixes
        if (this.isIOS()) {
            document.body.style.webkitOverflowScrolling = 'touch';
            
            // Force refresh of touch handling
            setTimeout(() => {
                document.body.style.transform = 'translate3d(0,0,0)';
                setTimeout(() => {
                    document.body.style.transform = '';
                }, 10);
            }, 100);
        }
    }
    
    /**
     * Handle overlay click/touch
     */
    handleOverlayClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.closeMenu();
    }
    
    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }
    
    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        // Prevent scrolling when overlay is active
        if (this.overlay.classList.contains('active')) {
            e.preventDefault();
        }
    }
    
    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        if (e.target === this.toggle) {
            // Let the click handler handle toggle button
            return;
        }
        
        this.touchEndY = e.changedTouches[0].clientY;
        
        // If touch was on overlay, close menu
        if (e.target === this.overlay) {
            this.closeMenu();
        }
        
        // If touch was on a nav item with onclick, let the onclick handler work
        const navItem = e.target.closest('.nav-item');
        if (navItem && navItem.hasAttribute('onclick')) {
            console.log('Touch ended on nav item with onclick, allowing onclick handler');
            // Don't interfere with the onclick handler
            return;
        }
    }
    
    /**
     * Handle escape key
     */
    handleEscape(e) {
        if (e.key === 'Escape' && this.sidebar.classList.contains('mobile-open')) {
            this.closeMenu();
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Close menu on resize to prevent layout issues
        if (this.sidebar.classList.contains('mobile-open')) {
            this.closeMenu();
        }
    }
    
    /**
     * Check if device is iOS
     */
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    
    /**
     * Check if device is Android
     */
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }
    
    /**
     * Cleanup on page unload
     */
    destroy() {
        this.removeEventListeners();
        this.resetBodyInteractions();
        this.isInitialized = false;
        console.log('Mobile navigation destroyed');
    }
}

// Create global instance
window.MobileNavigation = new MobileNavigationHandler();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.MobileNavigation.init();
    });
} else {
    window.MobileNavigation.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.MobileNavigation.destroy();
});

// Export functions for backward compatibility
window.toggleMobileMenu = () => window.MobileNavigation.toggleMenu();
window.closeMobileMenu = () => window.MobileNavigation.closeMenu();

console.log('📱 Mobile Navigation Module Loaded');