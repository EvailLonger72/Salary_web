// calendar.js - Calendar functionality for Shift Pay Calculator

// Global variables
let currentDate = new Date();
let selectedDate = null;
let weeklyData = JSON.parse(localStorage.getItem("weeklyData") || "[]");

// Month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Initialize calendar on page load
document.addEventListener("DOMContentLoaded", function () {
  // Safely reload data from localStorage to ensure sync with main app
  try {
    weeklyData = JSON.parse(localStorage.getItem("weeklyData") || "[]");
  } catch (error) {
    console.warn("Failed to load weeklyData from localStorage:", error);
    weeklyData = [];
  }
  
  renderCalendar();
  initializeSalaryPeriod();
  updateMonthlySummary();
  setupSwipeGestures();
  initializeBreakToggle();
});

// Refresh calendar when page becomes visible (useful when navigating back from main app)
document.addEventListener("visibilitychange", function() {
  if (!document.hidden) {
    // Reload data in case it was updated in another tab/window
    const updatedData = JSON.parse(localStorage.getItem("weeklyData") || "[]");
    if (JSON.stringify(updatedData) !== JSON.stringify(weeklyData)) {
      weeklyData = updatedData;
      renderCalendar();
      updateMonthlySummary();
    }
    
    // Update pay preview if form is open (in case settings changed)
    const shiftForm = document.getElementById("shiftForm");
    if (shiftForm && shiftForm.style.display !== "none") {
      updatePayPreview();
    }
  }
});

// Listen for storage changes (when settings are updated in main app)
window.addEventListener('storage', function(event) {
  if (event.key === 'weeklyData') {
    weeklyData = JSON.parse(event.newValue || "[]");
    renderCalendar();
    updateMonthlySummary();
  } else if (event.key === 'settings') {
    // Refresh pay preview if form is open
    const shiftForm = document.getElementById("shiftForm");
    if (shiftForm && shiftForm.style.display !== "none") {
      updatePayPreview();
    }
    updateMonthlySummary(); // Recalculate with new rates
  }
});

/**
 * Render calendar for current month
 */
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Update month/year display
  document.getElementById(
    "currentMonthYear"
  ).textContent = `${monthNames[month]} ${year}`;

  // Clear existing calendar
  const calendarGrid = document.getElementById("calendarGrid");
  calendarGrid.innerHTML = "";

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Calculate total cells needed (6 weeks × 7 days = 42)
  const totalCells = 42;

  // Add previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayCell = createDayCell(
      daysInPrevMonth - i,
      month - 1,
      year,
      true // inactive
    );
    calendarGrid.appendChild(dayCell);
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = createDayCell(day, month, year, false);
    calendarGrid.appendChild(dayCell);
  }

  // Add next month's leading days
  const cellsUsed = firstDay + daysInMonth;
  const remainingCells = totalCells - cellsUsed;

  for (let day = 1; day <= remainingCells; day++) {
    const dayCell = createDayCell(
      day,
      month + 1,
      year,
      true // inactive
    );
    calendarGrid.appendChild(dayCell);
  }
}

/**
 * Create a day cell for the calendar
 */
function createDayCell(day, month, year, isInactive) {
  const dayCell = document.createElement("div");
  dayCell.className = "calendar-day";

  if (isInactive) {
    dayCell.classList.add("inactive");
  }

  // Create date object for this cell
  const cellDate = new Date(year, month, day);
  const dateStr = getLocalDateString(cellDate);

  // Check if today (using local date comparison)
  const today = new Date();
  const todayStr = getLocalDateString(today);
  if (!isInactive && dateStr === todayStr) {
    dayCell.classList.add("today");
  }

  // Check if pay day (25th)
  if (!isInactive && day === 25) {
    dayCell.classList.add("pay-day");
  }

  // Day number
  const dayNumber = document.createElement("div");
  dayNumber.className = "day-number";
  dayNumber.textContent = day;
  dayCell.appendChild(dayNumber);

  // Check for shift data
  const shiftData = getShiftDataForDate(dateStr);
  if (shiftData) {
    // Add shift indicator
    const shiftIndicator = document.createElement("div");
    shiftIndicator.className = "shift-indicator";

    if (shiftData.shiftType === "C341") {
      shiftIndicator.classList.add("day-shift");
      shiftIndicator.innerHTML = "☀️";
    } else if (shiftData.shiftType === "C342") {
      shiftIndicator.classList.add("night-shift");
      shiftIndicator.innerHTML = "🌙";
    }

    dayCell.appendChild(shiftIndicator);

    // Add earnings amount
    const earnings = document.createElement("div");
    earnings.className = "day-earnings";
    earnings.textContent = `¥${Math.round(
      shiftData.payInfo.totalPay
    ).toLocaleString()}`;
    dayCell.appendChild(earnings);
  }

  // Add click handler
  if (!isInactive) {
    dayCell.addEventListener("click", () => showDayDetails(cellDate));
    dayCell.style.cursor = "pointer";
  }

  return dayCell;
}

/**
 * Get shift data for a specific date
 */
function getShiftDataForDate(dateStr) {
  return weeklyData.find((entry) => entry.workDate === dateStr);
}

/**
 * Show day details in modal
 */
function showDayDetails(date) {
  selectedDate = date;
  const dateStr = getLocalDateString(date);
  const shiftData = getShiftDataForDate(dateStr);

  // Update modal header
  const modalDate = document.getElementById("modalDate");
  modalDate.textContent = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Update modal body
  const modalBody = document.getElementById("modalBody");

  if (shiftData) {
    modalBody.innerHTML = `
            <div class="shift-details">
                <div class="detail-item">
                    <span class="detail-label">Shift Type:</span>
                    <span class="detail-value">${shiftData.shiftType}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${shiftData.startTime} - ${
      shiftData.endTime
    }</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Hours:</span>
                    <span class="detail-value">${(
                      shiftData.workingTime.totalMinutes / 60
                    ).toFixed(2)}h</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Break Time:</span>
                    <span class="detail-value">${(
                      shiftData.workingTime.breakMinutes / 60
                    ).toFixed(2)}h</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Net Working:</span>
                    <span class="detail-value">${shiftData.workingTime.netHours.toFixed(
                      2
                    )}h</span>
                </div>
                <div class="detail-separator"></div>
                <div class="detail-item">
                    <span class="detail-label">Regular Pay:</span>
                    <span class="detail-value">¥${Math.round(
                      shiftData.payInfo.regularPay
                    ).toLocaleString()}</span>
                </div>
                ${
                  shiftData.payInfo.overtimeHours > 0
                    ? `
                <div class="detail-item">
                    <span class="detail-label">Overtime Pay:</span>
                    <span class="detail-value">¥${Math.round(
                      shiftData.payInfo.overtimePay
                    ).toLocaleString()}</span>
                </div>
                `
                    : ""
                }
                ${
                  shiftData.payInfo.hasNightHours
                    ? `
                <div class="detail-item">
                    <span class="detail-label">Night Premium:</span>
                    <span class="detail-value">¥${Math.round(
                      shiftData.payInfo.nightPay
                    ).toLocaleString()}</span>
                </div>
                `
                    : ""
                }
                <div class="detail-separator"></div>
                <div class="detail-item total">
                    <span class="detail-label">Total Pay:</span>
                    <span class="detail-value">¥${Math.round(
                      shiftData.payInfo.totalPay
                    ).toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Take-home (77.7%):</span>
                    <span class="detail-value">¥${Math.round(
                      shiftData.payInfo.totalPay * 0.777
                    ).toLocaleString()}</span>
                </div>
            </div>
        `;

    // Show edit and delete buttons, hide add button
    document.querySelector(".btn-edit").style.display = "inline-block";
    document.querySelector(".btn-delete").style.display = "inline-block";
    document.querySelector(".btn-add").style.display = "none";
  } else {
    modalBody.innerHTML = `
            <div class="no-shift">
                <p>No shift recorded for this date.</p>
                <p>Click "Add Shift" to record a new shift.</p>
            </div>
        `;

    // Hide edit and delete buttons, show add button
    document.querySelector(".btn-edit").style.display = "none";
    document.querySelector(".btn-delete").style.display = "none";
    document.querySelector(".btn-add").style.display = "inline-block";
  }

  // Update break toggle state when modal opens
  updateBreakToggleState();
  
  // Show modal
  document.getElementById("dayModal").style.display = "block";
}

/**
 * Close day details modal
 */
function closeDayModal() {
  // Hide modal
  document.getElementById("dayModal").style.display = "none";
  
  // Reset form visibility
  document.getElementById("modalBody").style.display = "block";
  document.getElementById("shiftForm").style.display = "none";
  
  // Only reset button visibility when actually closing the modal
  if (selectedDate) {
    resetModalButtons();
  }
  
  selectedDate = null;
}

/**
 * Navigate to previous month
 */
function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
  updateMonthlySummary();
}

/**
 * Navigate to next month
 */
function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
  updateMonthlySummary();
}

/**
 * Initialize salary period inputs
 */
function initializeSalaryPeriod() {
  const salaryStartInput = document.getElementById("salaryStartDate");
  const salaryEndInput = document.getElementById("salaryEndDate");
  
  // Load saved dates from localStorage
  const savedStartDate = localStorage.getItem("salaryStartDate");
  const savedEndDate = localStorage.getItem("salaryEndDate");
  
  if (savedStartDate) {
    salaryStartInput.value = savedStartDate;
  }
  if (savedEndDate) {
    salaryEndInput.value = savedEndDate;
  }
  
  // Add event listeners to save dates and update summary
  salaryStartInput.addEventListener("change", function() {
    localStorage.setItem("salaryStartDate", this.value);
    updateMonthlySummary();
  });
  
  salaryEndInput.addEventListener("change", function() {
    localStorage.setItem("salaryEndDate", this.value);
    updateMonthlySummary();
  });
}

/**
 * Update monthly summary statistics
 */
function updateMonthlySummary() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Filter data for current month
  const monthlyData = weeklyData.filter((entry) => {
    const entryDate = createLocalDate(entry.workDate);
    return entryDate.getFullYear() === year && entryDate.getMonth() === month;
  });

  // Calculate statistics
  let totalDays = monthlyData.length;
  let dayShifts = monthlyData.filter((e) => e.shiftType === "C341").length;
  let nightShifts = monthlyData.filter((e) => e.shiftType === "C342").length;
  let totalHours = monthlyData.reduce(
    (sum, e) => sum + e.workingTime.netHours,
    0
  );
  let totalEarnings = monthlyData.reduce(
    (sum, e) => sum + e.payInfo.totalPay,
    0
  );
  let takeHome = totalEarnings * 0.777; // 77.7% after tax

  // Get user-defined salary period dates
  const salaryStartInput = document.getElementById("salaryStartDate");
  const salaryEndInput = document.getElementById("salaryEndDate");
  
  // Filter data for salary period if dates are set
  let filteredData = monthlyData;
  if (salaryStartInput.value && salaryEndInput.value) {
    const startDate = new Date(salaryStartInput.value);
    const endDate = new Date(salaryEndInput.value);
    
    filteredData = weeklyData.filter((entry) => {
      const entryDate = createLocalDate(entry.workDate);
      return entryDate >= startDate && entryDate <= endDate;
    });
    
    // Recalculate statistics with filtered data
    const totalDaysFiltered = filteredData.length;
    const dayShiftsFiltered = filteredData.filter((e) => e.shiftType === "C341").length;
    const nightShiftsFiltered = filteredData.filter((e) => e.shiftType === "C342").length;
    const totalHoursFiltered = filteredData.reduce((sum, e) => sum + e.workingTime.netHours, 0);
    const totalEarningsFiltered = filteredData.reduce((sum, e) => sum + e.payInfo.totalPay, 0);
    const takeHomeFiltered = totalEarningsFiltered * 0.777;
    
    // Use filtered data for display
    totalDays = totalDaysFiltered;
    dayShifts = dayShiftsFiltered;
    nightShifts = nightShiftsFiltered;
    totalHours = totalHoursFiltered;
    totalEarnings = totalEarningsFiltered;
    takeHome = takeHomeFiltered;
  }
  document.getElementById("totalDaysWorked").textContent = totalDays;
  document.getElementById("dayShifts").textContent = dayShifts;
  document.getElementById("nightShifts").textContent = nightShifts;
  document.getElementById("totalHours").textContent = `${totalHours.toFixed(
    1
  )}h`;
  document.getElementById("totalEarnings").textContent = `¥${Math.round(
    totalEarnings
  ).toLocaleString()}`;
  document.getElementById("takeHome").textContent = `¥${Math.round(
    takeHome
  ).toLocaleString()}`;

  // Update quick stats
  const avgDailyEarnings = totalDays > 0 ? totalEarnings / totalDays : 0;
  const avgDailyHours = totalDays > 0 ? totalHours / totalDays : 0;

  document.getElementById("avgDailyEarnings").textContent = `¥${Math.round(
    avgDailyEarnings
  ).toLocaleString()}`;
  document.getElementById(
    "avgDailyHours"
  ).textContent = `${avgDailyHours.toFixed(1)}h`;

  // Calculate monthly goal progress (assuming goal from settings)
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");
  const monthlyGoal = settings.weeklyGoalPay
    ? settings.weeklyGoalPay * 4
    : 400000;
  const progress = (totalEarnings / monthlyGoal) * 100;

  document.getElementById("monthlyProgress").textContent = `${Math.min(
    100,
    progress
  ).toFixed(0)}%`;

  // Calculate work streak using the appropriate data set
  const dataForStreak = (salaryStartInput.value && salaryEndInput.value) ? filteredData : monthlyData;
  const streak = calculateWorkStreak(dataForStreak);
  document.getElementById("streakDays").textContent = streak;
}

/**
 * Calculate consecutive work days streak
 */
function calculateWorkStreak(data) {
  if (data.length === 0) return 0;

  // Sort by date
  const sorted = data.sort(
    (a, b) => createLocalDate(a.workDate) - createLocalDate(b.workDate)
  );

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = createLocalDate(sorted[i - 1].workDate);
    const currDate = createLocalDate(sorted[i].workDate);
    const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Setup swipe gestures for mobile
 */
function setupSwipeGestures() {
  let touchStartX = 0;
  let touchEndX = 0;

  const calendarContainer = document.querySelector(".calendar-container");

  calendarContainer.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  calendarContainer.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next month
        nextMonth();
      } else {
        // Swipe right - previous month
        previousMonth();
      }
    }
  }
}

/**
 * Edit shift - redirect to calculator with shift data
 */
function editShift() {
  if (selectedDate) {
    const dateStr = getLocalDateString(selectedDate);
    const shiftData = getShiftDataForDate(dateStr);
    
    if (shiftData) {
      // Store complete shift data for editing
      const editData = {
        date: dateStr,
        shiftType: shiftData.shiftType,
        startTime: shiftData.startTime,
        endTime: shiftData.endTime
      };
      localStorage.setItem("editShiftData", JSON.stringify(editData));
      window.location.href = "../index.html#calculator";
    }
  }
}

/**
 * Show add shift form in modal
 */
function showAddShiftForm() {
  try {
    // Hide day details and show form
    document.getElementById("modalBody").style.display = "none";
    document.getElementById("shiftForm").style.display = "block";
    
    // Update button visibility
    const editBtn = document.getElementById("editBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const addBtn = document.getElementById("addBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");
    
    if (editBtn) editBtn.style.display = "none";
    if (deleteBtn) deleteBtn.style.display = "none";
    if (addBtn) addBtn.style.display = "none";
    if (cancelBtn) cancelBtn.style.display = "inline-block";
    if (saveBtn) saveBtn.style.display = "inline-block";
    
    // Clear form
    clearShiftForm();
    
    // Set default values
    setDefaultShiftTimes();
    
    // Setup real-time calculation
    setupPayCalculation();
  } catch (error) {
    console.error("Error in showAddShiftForm:", error);
  }
}

/**
 * Original addShift function for compatibility
 */
function addShift() {
  showAddShiftForm();
}

/**
 * Delete shift entry
 */
function deleteShift() {
  if (selectedDate) {
    const dateStr = getLocalDateString(selectedDate);
    
    // Show confirmation dialog
    if (confirm("Are you sure you want to delete this shift entry? This action cannot be undone.")) {
      // Remove the shift from weeklyData
      weeklyData = weeklyData.filter(entry => entry.workDate !== dateStr);
      
      // Save updated data to localStorage
      localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
      
      // Update global reference for main app
      if (typeof window.weeklyData !== 'undefined') {
        window.weeklyData = weeklyData;
      }
      
      // Close modal
      closeDayModal();
      
      // Refresh calendar display
      renderCalendar();
      updateMonthlySummary();
      
      // Trigger update in main app if it's loaded
      if (typeof updateDashboard === 'function') {
        updateDashboard();
      }
      if (typeof updateWeeklyDisplay === 'function') {
        updateWeeklyDisplay();
      }
      
      // Show success message
      showNotification("Shift deleted successfully!", "success");
    }
  }
}

/**
 * Show notification message
 */
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);
  
  // Hide and remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("dayModal");
  if (event.target === modal) {
    closeDayModal();
  }
};

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") {
    previousMonth();
  } else if (e.key === "ArrowRight") {
    nextMonth();
  } else if (e.key === "Escape") {
    closeDayModal();
  }
});

/**
 * Clear shift form inputs
 */
function clearShiftForm() {
  try {
    const shiftTypeEl = document.getElementById("modalShiftType");
    const startTimeEl = document.getElementById("modalStartTime");
    const endTimeEl = document.getElementById("modalEndTime");
    const shiftInfoEl = document.getElementById("modalShiftInfo");
    
    if (shiftTypeEl) shiftTypeEl.value = "";
    if (startTimeEl) startTimeEl.value = "";
    if (endTimeEl) endTimeEl.value = "";
    if (shiftInfoEl) shiftInfoEl.style.display = "none";
    
    updatePayPreview();
  } catch (error) {
    console.error("Error clearing shift form:", error);
  }
}

/**
 * Set default shift times based on shift type
 */
function setDefaultShiftTimes() {
  const shiftType = document.getElementById("modalShiftType").value;
  const startTimeInput = document.getElementById("modalStartTime");
  const endTimeInput = document.getElementById("modalEndTime");
  
  if (shiftType && SHIFTS[shiftType]) {
    const defaultTimes = getDefaultTimes(shiftType);
    startTimeInput.value = defaultTimes.defaultStart;
    endTimeInput.value = defaultTimes.defaultEnd;
    
    // Show break schedule
    updateModalBreakDisplay();
    document.getElementById("modalShiftInfo").style.display = "block";
  } else {
    document.getElementById("modalShiftInfo").style.display = "none";
  }
  
  updatePayPreview();
}

/**
 * Setup pay calculation listeners
 */
function setupPayCalculation() {
  const inputs = ["modalShiftType", "modalStartTime", "modalEndTime"];
  
  inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      // Remove existing listeners to prevent duplicates
      element.removeEventListener("change", debouncedUpdatePayPreview);
      element.removeEventListener("input", debouncedUpdatePayPreview);
      
      // Add new listeners with debouncing for better performance
      element.addEventListener("change", debouncedUpdatePayPreview);
      element.addEventListener("input", debouncedUpdatePayPreview);
    }
  });
  
  // Update times when shift type changes
  const shiftTypeElement = document.getElementById("modalShiftType");
  if (shiftTypeElement) {
    shiftTypeElement.removeEventListener("change", setDefaultShiftTimes);
    shiftTypeElement.addEventListener("change", setDefaultShiftTimes);
  }
}

/**
 * Debounced version of updatePayPreview for better performance
 */
let payPreviewTimeout;
function debouncedUpdatePayPreview() {
  clearTimeout(payPreviewTimeout);
  payPreviewTimeout = setTimeout(updatePayPreview, 150);
}

/**
 * Update pay preview in real-time
 */
function updatePayPreview() {
  const shiftType = document.getElementById("modalShiftType").value;
  const startTime = document.getElementById("modalStartTime").value;
  const endTime = document.getElementById("modalEndTime").value;
  
  // Update break display
  updateModalBreakDisplay();
  
  // Update break summary for compact view
  updateBreakSummary(shiftType, startTime, endTime);
  
  if (!shiftType || !startTime || !endTime) {
    resetPayPreview();
    return;
  }
  
  // Validate shift times first
  const validation = validateShiftTimes(shiftType, startTime, endTime);
  if (!validation.isValid) {
    resetPayPreview();
    return;
  }
  
  // Calculate using exact same logic as main calculator
  const workingTime = calculateNetWorkingTime(startTime, endTime, shiftType);
  const payInfo = calculatePayAmount(workingTime.netHours, startTime, endTime);
  
  // Update all preview elements
  document.getElementById("previewTotalHours").textContent = `${(workingTime.totalMinutes / 60).toFixed(2)}h`;
  document.getElementById("previewBreak").textContent = `${(workingTime.breakMinutes / 60).toFixed(2)}h`;
  document.getElementById("previewNetHours").textContent = `${workingTime.netHours.toFixed(2)}h`;
  document.getElementById("previewRegularPay").textContent = `¥${Math.round(payInfo.regularPay).toLocaleString()}`;
  document.getElementById("previewTotalPay").textContent = `¥${Math.round(payInfo.totalPay).toLocaleString()}`;
  document.getElementById("previewTakeHome").textContent = `¥${Math.round(payInfo.totalPay * 0.777).toLocaleString()}`;
  
  // Show/hide overtime pay
  const overtimeRow = document.getElementById("previewOvertimeRow");
  if (payInfo.overtimeHours > 0) {
    document.getElementById("previewOvertimePay").textContent = `¥${Math.round(payInfo.overtimePay).toLocaleString()}`;
    overtimeRow.style.display = "flex";
  } else {
    overtimeRow.style.display = "none";
  }
  
  // Show/hide night pay
  const nightRow = document.getElementById("previewNightRow");
  if (payInfo.hasNightHours && payInfo.nightPay > 0) {
    document.getElementById("previewNightPay").textContent = `¥${Math.round(payInfo.nightPay).toLocaleString()}`;
    nightRow.style.display = "flex";
  } else {
    nightRow.style.display = "none";
  }
}

/**
 * Reset pay preview to zero values
 */
function resetPayPreview() {
  document.getElementById("previewTotalHours").textContent = "0h";
  document.getElementById("previewBreak").textContent = "0h";
  document.getElementById("previewNetHours").textContent = "0h";
  document.getElementById("previewRegularPay").textContent = "¥0";
  document.getElementById("previewTotalPay").textContent = "¥0";
  document.getElementById("previewTakeHome").textContent = "¥0";
  document.getElementById("previewOvertimeRow").style.display = "none";
  document.getElementById("previewNightRow").style.display = "none";
}

/**
 * Update break display in modal (using exact same logic as main calculator)
 */
function updateModalBreakDisplay() {
  const shiftType = document.getElementById("modalShiftType").value;
  const startTime = document.getElementById("modalStartTime").value;
  const endTime = document.getElementById("modalEndTime").value;
  const breakList = document.getElementById("modalBreakList");
  
  if (!breakList) return;
  
  if (!shiftType || !startTime || !endTime) {
    // Show all breaks if times not set
    if (shiftType && SHIFTS[shiftType]) {
      const shift = SHIFTS[shiftType];
      breakList.innerHTML = "";
      shift.breaks.forEach((breakItem) => {
        const breakDiv = document.createElement("div");
        breakDiv.className = "break-item";
        breakDiv.innerHTML = `
          <span>${breakItem.start} 〜 ${breakItem.end}</span>
          <span><strong>${breakItem.minutes} mins</strong></span>
        `;
        breakList.appendChild(breakDiv);
      });
    }
    return;
  }
  
  // Get actual break details using calculator logic
  const breakDetails = getBreakDetails(shiftType, startTime, endTime);
  breakList.innerHTML = "";
  
  // Show taken breaks
  breakDetails.taken.forEach((breakItem) => {
    const breakDiv = document.createElement("div");
    breakDiv.className = "break-item taken";
    breakDiv.innerHTML = `
      <span>${breakItem.start} 〜 ${breakItem.end}</span>
      <span><strong>${breakItem.minutes} mins ✓</strong></span>
    `;
    breakList.appendChild(breakDiv);
  });
  
  // Show skipped breaks
  breakDetails.skipped.forEach((breakItem) => {
    const breakDiv = document.createElement("div");
    breakDiv.className = "break-item skipped";
    breakDiv.innerHTML = `
      <span>${breakItem.start} 〜 ${breakItem.end}</span>
      <span style="opacity: 0.6;"><strong>${breakItem.minutes} mins (skipped)</strong></span>
    `;
    breakList.appendChild(breakDiv);
  });
  
  // Add summary if there are skipped breaks
  if (breakDetails.skipped.length > 0) {
    const summaryDiv = document.createElement("div");
    summaryDiv.className = "break-summary";
    summaryDiv.innerHTML = `
      <p style="margin: 0; font-size: 0.9rem;">
        <strong>Break Summary:</strong><br>
        Taken: ${breakDetails.totalMinutes} minutes<br>
        Skipped: ${breakDetails.skipped.reduce((sum, b) => sum + b.minutes, 0)} minutes
      </p>
    `;
    breakList.appendChild(summaryDiv);
  }
}

/**
 * Calculate net working time using exact calculator logic
 */
function calculateNetWorkingTime(startTime, endTime, shiftType) {
  let startMinutes = timeToMinutes(startTime);
  let endMinutes = timeToMinutes(endTime);
  
  // Handle overnight shifts
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60; // Add 24 hours
  }
  
  const totalMinutes = endMinutes - startMinutes;
  
  // Use dynamic break calculation from break_schedule.js
  const breakMinutes = getActualBreakMinutes(shiftType, startTime, endTime);
  const netMinutes = Math.max(0, totalMinutes - breakMinutes);
  
  return {
    totalMinutes,
    breakMinutes,
    netMinutes,
    netHours: netMinutes / 60,
  };
}

/**
 * Calculate pay using exact calculator logic
 */
function calculatePayAmount(netHours, startTime, endTime) {
  // Load fresh settings each time to ensure accuracy
  const settings = JSON.parse(localStorage.getItem("settings") || JSON.stringify({
    baseRate: PAY_RATES.base,
    overtimeRate: PAY_RATES.overtime,
    weeklyGoalHours: 40,
    weeklyGoalPay: 100000,
  }));
  
  const baseRate = settings.baseRate || PAY_RATES.base;
  const overtimeRate = settings.overtimeRate || PAY_RATES.overtime;
  
  // Calculate regular and overtime hours
  const regularHours = Math.min(netHours, TIME_THRESHOLDS.regularHoursLimit);
  const overtimeHours = Math.max(0, netHours - TIME_THRESHOLDS.regularHoursLimit);
  
  // Calculate night hours
  const nightInfo = calculateNightHours(startTime, endTime);
  
  // Calculate pay
  let regularPay = 0;
  let overtimePay = 0;
  let nightPay = 0;
  
  if (nightInfo.hasNightHours) {
    // If shift includes night hours, use night rate for those hours
    const nightHours = Math.min(nightInfo.nightHours, netHours);
    const remainingHours = netHours - nightHours;
    
    nightPay = nightHours * overtimeRate; // Night rate = overtime rate
    
    if (remainingHours > 0) {
      const remainingRegular = Math.min(remainingHours, TIME_THRESHOLDS.regularHoursLimit);
      const remainingOvertime = Math.max(0, remainingHours - TIME_THRESHOLDS.regularHoursLimit);
      
      regularPay = remainingRegular * baseRate;
      overtimePay = remainingOvertime * overtimeRate;
    }
  } else {
    // Standard calculation without night premium
    regularPay = regularHours * baseRate;
    overtimePay = overtimeHours * overtimeRate;
  }
  
  return {
    regularHours,
    overtimeHours,
    nightHours: nightInfo.nightHours,
    regularPay,
    overtimePay,
    nightPay,
    totalPay: regularPay + overtimePay + nightPay,
    hasNightHours: nightInfo.hasNightHours,
  };
}

/**
 * Cancel shift form and return to day details
 */
function cancelShiftForm() {
  // Show day details and hide form
  document.getElementById("modalBody").style.display = "block";
  document.getElementById("shiftForm").style.display = "none";
  
  // Reset button visibility to show appropriate buttons for current date
  if (selectedDate) {
    const shiftData = getShiftDataForDate(getLocalDateString(selectedDate));
    
    const editBtn = document.getElementById("editBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const addBtn = document.getElementById("addBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");
    
    if (shiftData) {
      // Show edit and delete buttons for existing shifts
      if (editBtn) editBtn.style.display = "inline-block";
      if (deleteBtn) deleteBtn.style.display = "inline-block";
      if (addBtn) addBtn.style.display = "none";
    } else {
      // Show add button for days without shifts
      if (editBtn) editBtn.style.display = "none";
      if (deleteBtn) deleteBtn.style.display = "none";
      if (addBtn) addBtn.style.display = "inline-block";
    }
    
    // Hide form buttons
    if (cancelBtn) cancelBtn.style.display = "none";
    if (saveBtn) saveBtn.style.display = "none";
  }
}

/**
 * Save shift data
 */
function saveShift() {
  if (!selectedDate) return;
  
  const dateStr = getLocalDateString(selectedDate);
  const shiftType = document.getElementById("modalShiftType").value;
  const startTime = document.getElementById("modalStartTime").value;
  const endTime = document.getElementById("modalEndTime").value;
  
  // Validation
  if (!shiftType) {
    showNotification("Please select a shift type", "error");
    return;
  }
  
  if (!startTime || !endTime) {
    let missingFields = [];
    if (!startTime) missingFields.push("Start Time");
    if (!endTime) missingFields.push("End Time");
    
    showNotification(`Please fill in: ${missingFields.join(" and ")}`, "error");
    return;
  }
  
  // Validate shift times
  const validation = validateShiftTimes(shiftType, startTime, endTime);
  if (!validation.isValid) {
    showNotification("Please correct the following errors:\n" + validation.errors.join("\n"), "error");
    return;
  }
  
  // Calculate working time and pay using exact calculator logic
  const workingTime = calculateNetWorkingTime(startTime, endTime, shiftType);
  const payInfo = calculatePayAmount(workingTime.netHours, startTime, endTime);
  
  // Create shift entry with same structure as main calculator
  const shiftEntry = {
    workDate: dateStr,
    shiftType,
    startTime,
    endTime,
    workingTime,
    payInfo,
    timestamp: new Date().toISOString(),
  };
  
  // Remove existing entry for this date if any
  weeklyData = weeklyData.filter(entry => entry.workDate !== dateStr);
  
  // Add new entry
  weeklyData.push(shiftEntry);
  
  // Save to localStorage
  localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
  
  // Update global reference for main app
  if (typeof window.weeklyData !== 'undefined') {
    window.weeklyData = weeklyData;
  }
  
  // Close modal and refresh
  closeDayModal();
  renderCalendar();
  updateMonthlySummary();
  
  // Trigger update in main app if it's loaded
  if (typeof updateDashboard === 'function') {
    updateDashboard();
  }
  if (typeof updateWeeklyDisplay === 'function') {
    updateWeeklyDisplay();
  }
  
  showNotification("Shift saved successfully!", "success");
}

/**
 * Reset modal buttons to default state
 */
function resetModalButtons() {
  if (!selectedDate) {
    return;
  }
  
  const shiftData = getShiftDataForDate(getLocalDateString(selectedDate));
  
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const addBtn = document.getElementById("addBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  
  if (shiftData) {
    if (editBtn) editBtn.style.display = "inline-block";
    if (deleteBtn) deleteBtn.style.display = "inline-block";
    if (addBtn) addBtn.style.display = "none";
  } else {
    if (editBtn) editBtn.style.display = "none";
    if (deleteBtn) deleteBtn.style.display = "none";
    if (addBtn) addBtn.style.display = "inline-block";
  }
  
  if (cancelBtn) cancelBtn.style.display = "none";
  if (saveBtn) saveBtn.style.display = "none";
}

/**
 * Enhanced edit shift function
 */
function editShift() {
  if (selectedDate) {
    const dateStr = getLocalDateString(selectedDate);
    const shiftData = getShiftDataForDate(dateStr);
    
    if (shiftData) {
      // Show form with existing data
      document.getElementById("modalBody").style.display = "none";
      document.getElementById("shiftForm").style.display = "block";
      
      // Populate form with existing data
      document.getElementById("modalShiftType").value = shiftData.shiftType;
      document.getElementById("modalStartTime").value = shiftData.startTime;
      document.getElementById("modalEndTime").value = shiftData.endTime;
      
      // Show shift info and update break display
      if (shiftData.shiftType && SHIFTS[shiftData.shiftType]) {
        document.getElementById("modalShiftInfo").style.display = "block";
      }
      
      // Update button visibility
      document.getElementById("editBtn").style.display = "none";
      document.getElementById("deleteBtn").style.display = "none";
      document.getElementById("addBtn").style.display = "none";
      document.getElementById("cancelBtn").style.display = "inline-block";
      document.getElementById("saveBtn").style.display = "inline-block";
      
      // Setup calculation and update preview
      setupPayCalculation();
      updatePayPreview();
    }
  }
}

/**
 * Format date to local date string (fixing timezone issue)
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} - Local date string in YYYY-MM-DD format
 */
function formatLocalDate(dateInput) {
  let date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    date = dateInput;
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get local date string from Date object (avoiding timezone issues)
 * @param {Date} date - Date object
 * @returns {string} - Local date string in YYYY-MM-DD format
 */
function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Create a local Date object from a date string (avoiding timezone issues)
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Date} - Date object in local timezone
 */
function createLocalDate(dateStr) {
  return new Date(dateStr + "T00:00:00");
}

/**
 * Navigate to main app with specific page
 * @param {string} page - Page to navigate to
 */
function navigateToMainApp(page) {
  // Store current calendar state
  localStorage.setItem('calendarReturnState', JSON.stringify({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    selectedDate: selectedDate ? getLocalDateString(selectedDate) : null
  }));
  
  // Navigate to main app
  if (page) {
    window.location.href = `../index.html#${page}`;
  } else {
    window.location.href = '../index.html';
  }
}

// Break Details Toggle Functionality
let breakDetailsVisible = false;

/**
 * Initialize break toggle functionality
 */
function initializeBreakToggle() {
  // Set initial state
  breakDetailsVisible = localStorage.getItem('breakDetailsVisible') === 'true';
  updateBreakToggleState();
}

/**
 * Toggle break details visibility
 */
function toggleBreakDetails() {
  breakDetailsVisible = !breakDetailsVisible;
  localStorage.setItem('breakDetailsVisible', breakDetailsVisible.toString());
  updateBreakToggleState();
  
  // Add haptic feedback on mobile
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

/**
 * Update the break toggle state and UI
 */
function updateBreakToggleState() {
  const toggleBtn = document.getElementById('breakToggleBtn');
  const breakList = document.getElementById('modalBreakList');
  const breakSummary = document.getElementById('breakSummaryOnly');
  
  if (!toggleBtn || !breakList || !breakSummary) return;
  
  if (breakDetailsVisible) {
    // Show detailed break list
    breakList.classList.add('expanded');
    breakList.style.display = 'flex';
    breakSummary.style.display = 'none';
    
    // Update button appearance
    toggleBtn.classList.add('expanded');
    toggleBtn.querySelector('.toggle-text').textContent = 'Hide Details';
    toggleBtn.querySelector('.toggle-icon').textContent = '🙈';
  } else {
    // Hide detailed break list
    breakList.classList.remove('expanded');
    setTimeout(() => {
      if (!breakList.classList.contains('expanded')) {
        breakList.style.display = 'none';
      }
    }, 300); // Wait for animation to complete
    
    breakSummary.style.display = 'block';
    
    // Update button appearance
    toggleBtn.classList.remove('expanded');
    toggleBtn.querySelector('.toggle-text').textContent = 'Show Details';
    toggleBtn.querySelector('.toggle-icon').textContent = '👁️';
  }
}

/**
 * Update break summary in compact view
 */
function updateBreakSummary(shiftType, startTime, endTime) {
  const breakSummary = document.getElementById('breakSummaryOnly');
  if (!breakSummary || !shiftType) return;
  
  try {
    const breakDetails = getBreakDetails(shiftType, startTime, endTime);
    const breakMinutes = getActualBreakMinutes(shiftType, startTime, endTime);
    const breakHours = (breakMinutes / 60).toFixed(1);
    
    let summaryText = `Total Break Time: ${breakHours}h`;
    
    if (breakDetails.taken.length > 0) {
      summaryText += ` • ${breakDetails.taken.length} breaks taken`;
    }
    
    if (breakDetails.skipped.length > 0) {
      summaryText += ` • ${breakDetails.skipped.length} breaks skipped`;
    }
    
    breakSummary.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>⏱️</span>
        <span>${summaryText}</span>
      </div>
    `;
  } catch (error) {
    console.error('Error updating break summary:', error);
    breakSummary.innerHTML = '<div>Break information not available</div>';
  }
}
