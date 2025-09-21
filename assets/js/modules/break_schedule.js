// Shift Break Schedule Configuration
const SHIFTS = {
    C341: {
        name: "Day Shift",
        defaultStart: "06:30",
        defaultEnd: "17:30",
        breaks: [
            { start: "08:30", end: "08:40", minutes: 10 },
            { start: "10:40", end: "11:25", minutes: 45 },
            { start: "13:05", end: "13:15", minutes: 10 },
            { start: "14:35", end: "14:45", minutes: 10 },
            { start: "16:10", end: "16:20", minutes: 10 },
            { start: "17:20", end: "17:35", minutes: 15 }
        ],
        totalBreakMinutes: 100
    },
    C342: {
        name: "Night Shift",
        defaultStart: "16:45",
        defaultEnd: "04:25", // Corrected end time to account for 3 additional hours
        breaks: [
            { start: "18:45", end: "18:55", minutes: 10 },
            { start: "20:55", end: "21:40", minutes: 45 },
            { start: "23:10", end: "23:20", minutes: 10 },
            { start: "00:50", end: "01:00", minutes: 10 },
            { start: "02:25", end: "02:35", minutes: 10 },
            { start: "03:35", end: "03:50", minutes: 15 } // This break seems to be after the original end time, will need to be adjusted or confirmed.
        ],
        totalBreakMinutes: 100 // The `getActualBreakMinutes` function dynamically calculates breaks, so this static value is less critical but should reflect the default breaks within the default shift duration.
    }
};

// Pay rate configuration
const PAY_RATES = {
    base: 2100,        // Base hourly rate ¥2,100
    overtime: 2625,    // Overtime rate ¥2,625 (after 7h 35m)
    night: 2625        // Night rate ¥2,625 (after 22:00)
};

// Working time thresholds
const TIME_THRESHOLDS = {
    regularHoursLimit: 7 + 35/60,  // 7h 35m in decimal hours
    nightStartHour: 22             // 22:00 (10 PM)
};

/**
 * Get total break minutes for a shift type
 * @param {string} shiftType - The shift type (C341 or C342)
 * @returns {number} Total break minutes
 */
function getBreakMinutes(shiftType) {
    if (!SHIFTS[shiftType]) return 0;
    return SHIFTS[shiftType].totalBreakMinutes;
}

/**
 * Get break schedule for a shift type
 * @param {string} shiftType - The shift type (C341 or C342)
 * @returns {Array} Array of break objects
 */
function getBreakSchedule(shiftType) {
    if (!SHIFTS[shiftType]) return [];
    return SHIFTS[shiftType].breaks;
}

/**
 * Get default start and end times for a shift
 * @param {string} shiftType - The shift type (C341 or C342)
 * @returns {Object} Object with defaultStart and defaultEnd times
 */
function getDefaultTimes(shiftType) {
    if (!SHIFTS[shiftType]) return { defaultStart: "", defaultEnd: "" };
    return {
        defaultStart: SHIFTS[shiftType].defaultStart,
        defaultEnd: SHIFTS[shiftType].defaultEnd
    };
}

/**
 * Check if work time includes night hours (after 22:00)
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {Object} Object with night hours information
 */
function calculateNightHours(startTime, endTime) {
    const startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);
    
    // Handle overnight shifts
    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
    }
    
    const nightStartMinutes = TIME_THRESHOLDS.nightStartHour * 60; // 22:00 in minutes
    let nightHours = 0;
    
    nightHours = 0;
    const nightStart = TIME_THRESHOLDS.nightStartHour * 60; // 22:00
    const nightEnd = (24 + 6) * 60; // 06:00 next day

    // Calculate night hours from 22:00 to midnight
    const overlap1Start = Math.max(startMinutes, nightStart);
    const overlap1End = Math.min(endMinutes, 24 * 60); // Up to midnight
    if (overlap1End > overlap1Start) {
        nightHours += (overlap1End - overlap1Start) / 60;
    }

    // Calculate night hours from midnight to 06:00 (next day)
    const overlap2Start = Math.max(startMinutes, 24 * 60); // From midnight
    const overlap2End = Math.min(endMinutes, nightEnd); // Up to 06:00 next day
    if (overlap2End > overlap2Start) {
        nightHours += (overlap2End - overlap2Start) / 60;
    }

    // Round to two decimal places to avoid floating point inaccuracies
    nightHours = parseFloat(nightHours.toFixed(2));


    
    return {
        nightHours: Math.max(0, nightHours),
        hasNightHours: nightHours > 0
    };
}

/**
 * Validate shift time inputs
 * @param {string} shiftType - The shift type
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @returns {Object} Validation result
 */
function validateShiftTimes(shiftType, startTime, endTime) {
    const errors = [];
    
    if (!shiftType) {
        errors.push("⚠️ Shift type is required - Please select either C341 (Day Shift) or C342 (Night Shift)");
    }
    
    if (!startTime) {
        errors.push("⏰ Start time is required - Please enter when you started work");
    }
    
    if (!endTime) {
        errors.push("⏰ End time is required - Please enter when you finished work");
    }
    
    if (startTime && endTime) {
        const startMinutes = timeToMinutes(startTime);
        let endMinutes = timeToMinutes(endTime);
        
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60; // Handle overnight
        }
        
        const totalMinutes = endMinutes - startMinutes;
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
        
        if (totalMinutes < 60) {
            errors.push(`⏱️ Shift too short - Your shift duration is ${totalHours}h, but must be at least 1 hour`);
        }
        
        if (totalMinutes > 16 * 60) {
            errors.push(`⏱️ Shift too long - Your shift duration is ${totalHours}h, but cannot exceed 16 hours for safety regulations`);
        }
        
        if (startTime === endTime) {
            errors.push("⚠️ Start and end times cannot be the same - Please check your work hours");
        }
        
        // Additional validation for shift type compatibility
        if (shiftType === 'C341' && totalMinutes > 12 * 60) {
            errors.push(`⚠️ Day shift (C341) duration is ${totalHours}h - This seems unusually long for a day shift. Please verify your times.`);
        }
        
        if (shiftType === 'C342' && totalMinutes > 10 * 60) {
            errors.push(`⚠️ Night shift (C342) duration is ${totalHours}h - This seems unusually long for a night shift. Please verify your times.`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Convert time string to minutes
 * @param {string} time - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
// Add this function to break_schedule.js to replace getBreakMinutes

/**
 * Calculate actual break minutes based on work hours
 * @param {string} shiftType - The shift type (C341 or C342)
 * @param {string} startTime - Actual start time in HH:MM format
 * @param {string} endTime - Actual end time in HH:MM format
 * @returns {number} Actual break minutes taken
 */
function getActualBreakMinutes(shiftType, startTime, endTime) {
    if (!SHIFTS[shiftType]) return 0;
    
    const startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);
    
    // Handle overnight shifts
    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
    }
    
    const breaks = SHIFTS[shiftType].breaks;
    let actualBreakMinutes = 0;
    
    // Check each break to see if it falls within actual work hours
    breaks.forEach(breakItem => {
        const breakStart = timeToMinutes(breakItem.start);
        let breakEnd = timeToMinutes(breakItem.end);
        
        // Handle overnight break times
        if (breakEnd < breakStart) {
            breakEnd += 24 * 60;
        }
        
        // Adjust break times for overnight shifts (C342)
        let adjustedBreakStart = breakStart;
        let adjustedBreakEnd = breakEnd;
        
        if (shiftType === 'C342' && breakStart < 12 * 60) {
            // Break is after midnight, add 24 hours
            adjustedBreakStart += 24 * 60;
            adjustedBreakEnd += 24 * 60;
        }
        
        // Check if break falls within actual work period
        if (adjustedBreakStart >= startMinutes && adjustedBreakEnd <= endMinutes) {
            actualBreakMinutes += breakItem.minutes;
        } else if (adjustedBreakStart >= startMinutes && adjustedBreakStart < endMinutes) {
            // Partial break - worker left during break
            const partialBreak = Math.min(endMinutes - adjustedBreakStart, breakItem.minutes);
            actualBreakMinutes += partialBreak;
        }
    });
    
    return actualBreakMinutes;
}

/**
 * Get detailed break information for display
 * @param {string} shiftType - The shift type
 * @param {string} startTime - Actual start time
 * @param {string} endTime - Actual end time
 * @returns {Object} Break information with taken and skipped breaks
 */
function getBreakDetails(shiftType, startTime, endTime) {
    if (!SHIFTS[shiftType]) return { taken: [], skipped: [], totalMinutes: 0 };
    
    const startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);
    
    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
    }
    
    const breaks = SHIFTS[shiftType].breaks;
    const takenBreaks = [];
    const skippedBreaks = [];
    let totalMinutes = 0;
    
    breaks.forEach(breakItem => {
        const breakStart = timeToMinutes(breakItem.start);
        let breakEnd = timeToMinutes(breakItem.end);
        
        if (breakEnd < breakStart) {
            breakEnd += 24 * 60;
        }
        
        let adjustedBreakStart = breakStart;
        let adjustedBreakEnd = breakEnd;
        
        if (shiftType === 'C342' && breakStart < 12 * 60) {
            adjustedBreakStart += 24 * 60;
            adjustedBreakEnd += 24 * 60;
        }
        
        if (adjustedBreakStart >= startMinutes && adjustedBreakEnd <= endMinutes) {
            takenBreaks.push(breakItem);
            totalMinutes += breakItem.minutes;
        } else {
            skippedBreaks.push(breakItem);
        }
    });
    
    return {
        taken: takenBreaks,
        skipped: skippedBreaks,
        totalMinutes: totalMinutes
    };
}