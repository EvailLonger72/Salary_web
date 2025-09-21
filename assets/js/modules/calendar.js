/**
 * Calendar Module for ShiftPay Calculator
 * Handles calendar view, shift management, and monthly summaries
 */

// Calendar state management
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.weeklyData = [];
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        this.init();
    }
    
    // Initialize calendar
    init() {
        this.loadData();
        this.setupEventListeners();
        this.render();
        this.updateMonthlySummary();
    }
    
    // Load data from localStorage
    loadData() {
        try {
            const stored = localStorage.getItem('weeklyData');
            this.weeklyData = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading calendar data:', error);
            this.weeklyData = [];
        }
    }
    
    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem('weeklyData', JSON.stringify(this.weeklyData));
            return true;
        } catch (error) {
            console.error('Error saving calendar data:', error);
            return false;
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'ArrowLeft':
                    this.previousMonth();
                    break;
                case 'ArrowRight':
                    this.nextMonth();
                    break;
                case 'Escape':
                    this.closeModal();
                    break;
            }
        });
        
        // Touch/swipe support for mobile
        this.setupTouchEvents();
        
        // Modal close on outside click
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('shiftModal');
            if (event.target === modal) {
                this.closeModal();
            }
        });
    }
    
    // Setup touch events for mobile swipe
    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (event) => {
            touchStartX = event.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (event) => {
            touchEndX = event.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }
    
    // Handle swipe gestures
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next month
                this.nextMonth();
            } else {
                // Swipe right - previous month
                this.previousMonth();
            }
        }
    }
    
    // Render calendar
    render() {
        this.updateMonthDisplay();
        this.renderCalendarGrid();
    }
    
    // Update month display
    updateMonthDisplay() {
        const monthElement = document.getElementById('currentMonth');
        if (monthElement) {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            monthElement.textContent = `${this.monthNames[month]} ${year}`;
        }
    }
    
    // Render calendar grid
    renderCalendarGrid() {
        const calendarBody = document.getElementById('calendarBody');
        if (!calendarBody) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Get calendar data
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Get previous month data
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        // Clear existing content
        calendarBody.innerHTML = '';
        
        let date = 1;
        let nextMonthDate = 1;
        
        // Create calendar rows
        for (let week = 0; week < 6; week++) {
            const row = document.createElement('tr');
            
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement('td');
                const button = document.createElement('button');
                button.className = 'calendar-day';
                
                if (week === 0 && day < startingDayOfWeek) {
                    // Previous month days
                    const prevDate = daysInPrevMonth - startingDayOfWeek + day + 1;
                    button.innerHTML = `<div class="day-number">${prevDate}</div>`;
                    button.classList.add('other-month');
                    button.onclick = () => this.navigateToMonth(-1);
                } else if (date > daysInMonth) {
                    // Next month days
                    button.innerHTML = `<div class="day-number">${nextMonthDate}</div>`;
                    button.classList.add('other-month');
                    button.onclick = () => this.navigateToMonth(1);
                    nextMonthDate++;
                } else {
                    // Current month days
                    const currentDateStr = this.formatDate(year, month, date);
                    const dayShifts = this.getShiftsForDate(currentDateStr);
                    
                    button.innerHTML = this.renderDayContent(date, dayShifts);
                    
                    // Add classes
                    if (dayShifts.length > 0) {
                        button.classList.add('has-shift');
                    }
                    
                    if (this.isToday(year, month, date)) {
                        button.classList.add('today');
                    }
                    
                    button.onclick = () => this.showDayDetails(currentDateStr, dayShifts);
                    date++;
                }
                
                cell.appendChild(button);
                row.appendChild(cell);
            }
            
            calendarBody.appendChild(row);
            
            // Break if we've filled all days
            if (date > daysInMonth) break;
        }
    }
    
    // Render day content
    renderDayContent(date, shifts) {
        let content = `<div class="day-number">${date}</div>`;
        
        if (shifts.length > 0) {
            content += '<div class="shift-info">';
            shifts.forEach(shift => {
                const shiftType = shift.shiftType || 'Unknown';
                const totalPay = shift.payInfo ? shift.payInfo.totalPay : 0;
                content += `<div class="shift-badge">${shiftType}</div>`;
                content += `<div class="shift-badge">¥${totalPay.toLocaleString()}</div>`;
            });
            content += '</div>';
        }
        
        return content;
    }
    
    // Format date string
    formatDate(year, month, date) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    }
    
    // Get shifts for specific date
    getShiftsForDate(dateStr) {
        return this.weeklyData.filter(shift => shift.workDate === dateStr);
    }
    
    // Check if date is today
    isToday(year, month, date) {
        const today = new Date();
        return year === today.getFullYear() && 
               month === today.getMonth() && 
               date === today.getDate();
    }
    
    // Navigate to different month
    navigateToMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.render();
        this.updateMonthlySummary();
    }
    
    // Navigation methods
    previousMonth() {
        this.navigateToMonth(-1);
    }
    
    nextMonth() {
        this.navigateToMonth(1);
    }
    
    // Show day details modal
    showDayDetails(dateStr, shifts) {
        this.selectedDate = dateStr;
        const modal = document.getElementById('shiftModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        if (!modal || !modalTitle || !modalContent) return;
        
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        modalTitle.textContent = formattedDate;
        modalContent.innerHTML = this.renderModalContent(dateStr, shifts);
        modal.style.display = 'block';
    }
    
    // Render modal content
    renderModalContent(dateStr, shifts) {
        if (shifts.length === 0) {
            return `
                <p style="text-align: center; color: #666; margin: 20px 0;">No shifts scheduled for this day</p>
                <div style="text-align: center;">
                    <button class="action-btn" onclick="calendarManager.addShiftForDate('${dateStr}')">
                        ➕ Add Shift
                    </button>
                </div>
            `;
        }
        
        let content = '<div style="margin-bottom: 20px;">';
        shifts.forEach((shift, index) => {
            const payInfo = shift.payInfo || {};
            const workingHours = shift.workingTime ? (shift.workingTime.netHours || 0).toFixed(2) : '0.00';
            const totalPay = payInfo.totalPay || 0;
            
            content += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                    <h4 style="margin: 0 0 10px 0; color: #667eea;">${shift.shiftType || 'Unknown Shift'}</h4>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${shift.startTime || 'N/A'} - ${shift.endTime || 'N/A'}</p>
                    <p style="margin: 5px 0;"><strong>Working Hours:</strong> ${workingHours}h</p>
                    <p style="margin: 5px 0;"><strong>Total Pay:</strong> ¥${totalPay.toLocaleString()}</p>
                    <div style="margin-top: 10px;">
                        <button class="action-btn" style="margin-right: 10px; padding: 8px 15px; font-size: 0.9rem;" onclick="calendarManager.editShift(${index}, '${dateStr}')">
                            ✏️ Edit
                        </button>
                        <button class="action-btn danger" style="padding: 8px 15px; font-size: 0.9rem;" onclick="calendarManager.deleteShift(${index}, '${dateStr}')">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        });
        content += '</div>';
        content += `
            <div style="text-align: center;">
                <button class="action-btn" onclick="calendarManager.addShiftForDate('${dateStr}')">
                    ➕ Add Another Shift
                </button>
            </div>
        `;
        
        return content;
    }
    
    // Close modal
    closeModal() {
        const modal = document.getElementById('shiftModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Add shift for specific date
    addShiftForDate(dateStr) {
        localStorage.setItem('newShiftDate', dateStr);
        window.location.href = '../index.html#calculator';
    }
    
    // Edit shift
    editShift(index, dateStr) {
        const dayShifts = this.getShiftsForDate(dateStr);
        if (dayShifts[index]) {
            const shiftData = {
                date: dateStr,
                shiftType: dayShifts[index].shiftType,
                startTime: dayShifts[index].startTime,
                endTime: dayShifts[index].endTime
            };
            localStorage.setItem('editShiftData', JSON.stringify(shiftData));
            window.location.href = '../index.html#calculator';
        }
    }
    
    // Delete shift
    deleteShift(index, dateStr) {
        if (!confirm('Are you sure you want to delete this shift?')) return;
        
        const dayShifts = this.getShiftsForDate(dateStr);
        if (!dayShifts[index]) return;
        
        // Find and remove the shift from weeklyData
        const shiftToDelete = dayShifts[index];
        const globalIndex = this.weeklyData.findIndex(shift => 
            shift.workDate === shiftToDelete.workDate &&
            shift.startTime === shiftToDelete.startTime &&
            shift.endTime === shiftToDelete.endTime &&
            shift.shiftType === shiftToDelete.shiftType
        );
        
        if (globalIndex !== -1) {
            this.weeklyData.splice(globalIndex, 1);
            this.saveData();
            this.render();
            this.updateMonthlySummary();
            this.closeModal();
            this.showNotification('Shift deleted successfully', 'success');
        }
    }
    
    // Update monthly summary
    updateMonthlySummary() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Filter shifts for current month
        const monthlyShifts = this.weeklyData.filter(shift => {
            const shiftDate = new Date(shift.workDate);
            return shiftDate.getFullYear() === year && shiftDate.getMonth() === month;
        });
        
        // Calculate totals
        const stats = this.calculateMonthlyStats(monthlyShifts);
        
        // Update display
        this.updateSummaryDisplay(stats);
    }
    
    // Calculate monthly statistics
    calculateMonthlyStats(shifts) {
        let totalShifts = shifts.length;
        let totalHours = 0;
        let totalEarnings = 0;
        
        shifts.forEach(shift => {
            if (shift.workingTime && shift.workingTime.netHours) {
                totalHours += shift.workingTime.netHours;
            }
            if (shift.payInfo && shift.payInfo.totalPay) {
                totalEarnings += shift.payInfo.totalPay;
            }
        });
        
        const averageDaily = totalShifts > 0 ? totalEarnings / totalShifts : 0;
        
        return {
            totalShifts,
            totalHours,
            totalEarnings,
            averageDaily
        };
    }
    
    // Update summary display
    updateSummaryDisplay(stats) {
        const elements = {
            totalShifts: document.getElementById('totalShifts'),
            totalHours: document.getElementById('totalHours'),
            totalEarnings: document.getElementById('totalEarnings'),
            averageDaily: document.getElementById('averageDaily')
        };
        
        if (elements.totalShifts) elements.totalShifts.textContent = stats.totalShifts;
        if (elements.totalHours) elements.totalHours.textContent = `${stats.totalHours.toFixed(1)}h`;
        if (elements.totalEarnings) elements.totalEarnings.textContent = `¥${stats.totalEarnings.toLocaleString()}`;
        if (elements.averageDaily) elements.averageDaily.textContent = `¥${Math.round(stats.averageDaily).toLocaleString()}`;
    }
    
    // Action methods
    addNewShift() {
        window.location.href = '../index.html#calculator';
    }
    
    exportCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Filter shifts for current month
        const monthlyShifts = this.weeklyData.filter(shift => {
            const shiftDate = new Date(shift.workDate);
            return shiftDate.getFullYear() === year && shiftDate.getMonth() === month;
        });
        
        if (monthlyShifts.length === 0) {
            this.showNotification('No data to export for this month', 'warning');
            return;
        }
        
        // Create CSV content
        let csvContent = 'Date,Shift Type,Start Time,End Time,Working Hours,Total Pay\n';
        monthlyShifts.forEach(shift => {
            const workingHours = shift.workingTime ? shift.workingTime.netHours.toFixed(2) : '0.00';
            const totalPay = shift.payInfo ? shift.payInfo.totalPay : 0;
            csvContent += `${shift.workDate},${shift.shiftType || 'Unknown'},${shift.startTime || 'N/A'},${shift.endTime || 'N/A'},${workingHours},${totalPay}\n`;
        });
        
        // Download CSV
        this.downloadFile(csvContent, `shift_calendar_${year}_${String(month + 1).padStart(2, '0')}.csv`, 'text/csv');
        this.showNotification('Calendar data exported successfully', 'success');
    }
    
    clearMonth() {
        if (!confirm('Are you sure you want to clear all shifts for this month? This action cannot be undone.')) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Filter out shifts for current month
        this.weeklyData = this.weeklyData.filter(shift => {
            const shiftDate = new Date(shift.workDate);
            return !(shiftDate.getFullYear() === year && shiftDate.getMonth() === month);
        });
        
        this.saveData();
        this.render();
        this.updateMonthlySummary();
        this.showNotification('Month cleared successfully', 'success');
    }
    
    // Utility methods
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#667eea'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    goBack() {
        window.location.href = '../index.html';
    }
}

// Global calendar manager instance
let calendarManager;

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    calendarManager = new CalendarManager();
});

// Export for global access
if (typeof window !== 'undefined') {
    window.CalendarManager = CalendarManager;
    window.calendarManager = calendarManager;
}

