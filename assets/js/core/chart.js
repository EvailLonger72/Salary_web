// Chart.js configurations and functions - UPDATED WITH NEW CHARTS

let dashboardChartInstance = null;
let pieChartInstance = null;
let barChartInstance = null;
let weeklyChartInstance = null;
let monthlyComparisonChartInstance = null;
let shiftHeatmapChartInstance = null;

/**
 * Professional chart colors and styling
 */
const CHART_COLORS = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4facfe',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    
    // Modern gradient combinations
    gradients: {
        ocean: ['#667eea', '#764ba2'],
        sunset: ['#ff6b6b', '#ffa726'],
        forest: ['#10b981', '#059669'],
        sky: ['#4facfe', '#00f2fe'],
        purple: ['#a855f7', '#6366f1'],
        warm: ['#f59e0b', '#ea580c'],
        cool: ['#06b6d4', '#0891b2']
    },
    
    // Chart-specific colors
    workingTime: '#667eea',
    breakTime: '#ff6b6b',
    regularPay: '#4facfe',
    overtimePay: '#a855f7',
    nightPay: '#10b981',
    
    // Data visualization palette
    palette: [
        '#667eea', '#10b981', '#f59e0b', '#ef4444', 
        '#a855f7', '#06b6d4', '#84cc16', '#f97316'
    ],
    
    // Professional backgrounds
    backgrounds: {
        light: 'rgba(255, 255, 255, 0.9)',
        dark: 'rgba(0, 0, 0, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
    }
};

/**
 * Create gradient background
 */
function createGradient(ctx, colors, direction = 'vertical') {
    if (!ctx || !ctx.canvas) {
        console.warn('Invalid canvas context provided to createGradient');
        return colors[0]; // Fallback to solid color
    }
    
    try {
        const gradient = direction === 'vertical' 
            ? ctx.createLinearGradient(0, 0, 0, ctx.canvas.height || 400)
            : ctx.createLinearGradient(0, 0, ctx.canvas.width || 400, 0);
        
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        return gradient;
    } catch (error) {
        console.warn('Error creating gradient:', error);
        return colors[0]; // Fallback to solid color
    }
}

/**
 * Professional chart options with animations
 */
const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    
    // Smooth animations
    animation: {
        duration: 1500,
        easing: 'easeInOutQuart'
    },
    
    // Hover animations
    hover: {
        animationDuration: 300
    },
    
    plugins: {
        legend: {
            position: 'bottom',
            align: 'center',
            labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                    size: 12,
                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    weight: '500'
                },
                color: '#374151',
                boxWidth: 8,
                boxHeight: 8
            }
        },
        
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: {
                size: 13,
                weight: '600'
            },
            bodyFont: {
                size: 12,
                weight: '400'
            },
            displayColors: true,
            boxPadding: 6
        }
    },
    
    layout: {
        padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    },
    
    elements: {
        point: {
            hoverRadius: 8,
            hoverBorderWidth: 3
        },
        line: {
            tension: 0.4
        },
        arc: {
            borderWidth: 2,
            hoverBorderWidth: 4
        },
        bar: {
            borderRadius: 4,
            borderSkipped: false
        }
    }
};

/**
 * Create dashboard earnings trend chart
 */
function updateDashboardChart() {
    const ctx = document.getElementById('dashboardChart');
    if (!ctx) {
        console.log('Dashboard chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    // Use global weeklyData reference
    const weeklyData = window.weeklyData || [];
    if (!Array.isArray(weeklyData)) {
        console.log('Weekly data not available for dashboard chart');
        return;
    }

    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        last7Days.push({
            date: date.toISOString().split('T')[0],
            label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
    }

    const dailyEarnings = last7Days.map(day => {
        const dayEntries = weeklyData.filter(entry => entry.workDate === day.date);
        return dayEntries.reduce((sum, entry) => {
            if (entry && entry.payInfo && typeof entry.payInfo.totalPay === 'number') {
                return sum + entry.payInfo.totalPay;
            }
            return sum;
        }, 0);
    });

    if (dashboardChartInstance) {
        try {
            dashboardChartInstance.destroy();
        } catch (error) {
            console.warn('Error destroying dashboard chart:', error);
        }
        dashboardChartInstance = null;
    }

    try {
        // Create gradient for line chart
        const canvasContext = ctx.getContext('2d');
        const gradient = createGradient(canvasContext, [
            'rgba(102, 126, 234, 0.3)',
            'rgba(102, 126, 234, 0.05)'
        ]);
        
        dashboardChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(day => day.label),
                datasets: [{
                    label: '💰 Daily Earnings',
                    data: dailyEarnings,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: CHART_COLORS.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBorderWidth: 4,
                    borderWidth: 3,
                    shadowColor: 'rgba(102, 126, 234, 0.3)',
                    shadowBlur: 10
                }]
            },
            options: {
                ...CHART_OPTIONS,
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.06)',
                            lineWidth: 1
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            callback: function(value) {
                                return '¥' + Math.round(value).toLocaleString();
                            },
                            padding: 8
                        }
                    }
                },
                plugins: {
                    ...CHART_OPTIONS.plugins,
                    tooltip: {
                        ...CHART_OPTIONS.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return '💰 Earnings: ¥' + Math.round(context.parsed.y).toLocaleString();
                            }
                        }
                    }
                },
                // Add smooth entrance animation
                animation: {
                    ...CHART_OPTIONS.animation,
                    x: {
                        type: 'number',
                        easing: 'easeOutQuart',
                        duration: 2000,
                        from: NaN
                    },
                    y: {
                        type: 'number',
                        easing: 'easeOutQuart',
                        duration: 2000,
                        from: (ctx) => ctx.chart.scales.y.getPixelForValue(0)
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating dashboard chart:', error);
    }
}

/**
 * Create pie chart for working time breakdown
 */
function createPieChart(calc) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) {
        console.log('Pie chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    if (!calc || !calc.workingTime || 
        typeof calc.workingTime.netMinutes !== 'number' || 
        typeof calc.workingTime.breakMinutes !== 'number') {
        console.error('Invalid calculation data for pie chart');
        return;
    }

    if (pieChartInstance) {
        try {
            pieChartInstance.destroy();
        } catch (error) {
            console.warn('Error destroying pie chart:', error);
        }
        pieChartInstance = null;
    }

    const data = {
        labels: ['⏱️ Working Time', '☕ Break Time'],
        datasets: [{
            data: [calc.workingTime.netMinutes, calc.workingTime.breakMinutes],
            backgroundColor: [
                CHART_COLORS.primary,
                CHART_COLORS.warning
            ],
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverBorderWidth: 4,
            hoverOffset: 8,
            // Add gradient effect
            borderRadius: 4,
            circumference: 360,
            rotation: -90
        }]
    };

    try {
        pieChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                ...CHART_OPTIONS,
                cutout: '65%',
                radius: '90%',
                plugins: {
                    ...CHART_OPTIONS.plugins,
                    legend: {
                        ...CHART_OPTIONS.plugins.legend,
                        position: 'bottom',
                        labels: {
                            ...CHART_OPTIONS.plugins.legend.labels,
                            padding: 15
                        }
                    },
                    tooltip: {
                        ...CHART_OPTIONS.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const hours = (context.parsed / 60).toFixed(1);
                                const percentage = ((context.parsed / (calc.workingTime.netMinutes + calc.workingTime.breakMinutes)) * 100).toFixed(1);
                                return `${context.label}: ${hours}h (${percentage}%)`;
                            }
                        }
                    }
                },
                // Enhanced animations for doughnut chart
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                hover: {
                    animationDuration: 300
                }
            }
        });
    } catch (error) {
        console.error('Error creating pie chart:', error);
    }
}

/**
 * Create bar chart for pay distribution
 */
function createBarChart(calc) {
    const ctx = document.getElementById('barChart');
    if (!ctx) {
        console.log('Bar chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    if (!calc || !calc.payInfo || typeof calc.payInfo.regularPay !== 'number') {
        console.error('Invalid calculation data for bar chart');
        return;
    }

    if (barChartInstance) {
        try {
            barChartInstance.destroy();
        } catch (error) {
            console.warn('Error destroying bar chart:', error);
        }
        barChartInstance = null;
    }

    const labels = ['💰 Regular Pay'];
    const data = [calc.payInfo.regularPay || 0];
    const colors = [CHART_COLORS.regularPay];
    const gradients = [];

    if (calc.payInfo.overtimeHours > 0 && calc.payInfo.overtimePay > 0) {
        labels.push('⚡ Overtime Pay');
        data.push(calc.payInfo.overtimePay);
        colors.push(CHART_COLORS.overtimePay);
    }

    if (calc.payInfo.hasNightHours && calc.payInfo.nightPay > 0) {
        labels.push('🌙 Night Premium');
        data.push(calc.payInfo.nightPay);
        colors.push(CHART_COLORS.nightPay);
    }

    // Create gradients for each bar
    const canvasCtx = ctx.getContext('2d');
    colors.forEach(color => {
        const gradient = canvasCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '66'); // Add transparency
        gradients.push(gradient);
    });

    try {
        barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: gradients,
                    borderColor: colors,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    hoverBackgroundColor: colors,
                    hoverBorderColor: '#ffffff',
                    hoverBorderWidth: 3,
                    barThickness: 60,
                    maxBarThickness: 80
                }]
            },
            options: {
                ...CHART_OPTIONS,
                plugins: {
                    ...CHART_OPTIONS.plugins,
                    legend: {
                        display: false
                    },
                    tooltip: {
                        ...CHART_OPTIONS.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ¥${Math.round(context.parsed.y).toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.06)',
                            lineWidth: 1
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            callback: function(value) {
                                return '¥' + Math.round(value).toLocaleString();
                            },
                            padding: 8
                        }
                    }
                },
                // Enhanced bar animations
                animation: {
                    ...CHART_OPTIONS.animation,
                    y: {
                        type: 'number',
                        easing: 'easeOutBounce',
                        duration: 2000,
                        from: (ctx) => ctx.chart.scales.y.getPixelForValue(0)
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating bar chart:', error);
    }
}

/**
 * Create weekly performance chart
 */
function updateWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) {
        console.log('Weekly chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    // Use global weeklyData reference
    const weeklyData = window.weeklyData || [];
    if (!Array.isArray(weeklyData) || weeklyData.length === 0) {
        if (weeklyChartInstance) {
            try {
                weeklyChartInstance.destroy();
            } catch (error) {
                console.warn('Error destroying weekly chart:', error);
            }
            weeklyChartInstance = null;
        }
        console.log('No weekly data available for chart');
        return;
    }

    const weeklyStats = {};
    
    weeklyData.forEach(entry => {
        if (!entry || !entry.workDate || !entry.workingTime || !entry.payInfo) {
            console.warn('Invalid entry in weeklyData:', entry);
            return;
        }

        try {
            const date = new Date(entry.workDate);
            const weekKey = getWeekNumber(date) + '-' + date.getFullYear();
            
            if (!weeklyStats[weekKey]) {
                weeklyStats[weekKey] = {
                    week: weekKey,
                    totalHours: 0,
                    totalPay: 0,
                    entries: 0
                };
            }
            
            weeklyStats[weekKey].totalHours += entry.workingTime.netHours || 0;
            weeklyStats[weekKey].totalPay += entry.payInfo.totalPay || 0;
            weeklyStats[weekKey].entries++;
        } catch (error) {
            console.warn('Error processing entry:', entry, error);
        }
    });

    const sortedWeeks = Object.values(weeklyStats).sort((a, b) => {
        const [weekA, yearA] = a.week.split('-').map(Number);
        const [weekB, yearB] = b.week.split('-').map(Number);
        if (yearA !== yearB) return yearA - yearB;
        return weekA - weekB;
    });

    const recentWeeks = sortedWeeks.slice(-8);

    if (recentWeeks.length === 0) {
        if (weeklyChartInstance) {
            try {
                weeklyChartInstance.destroy();
            } catch (error) {
                console.warn('Error destroying weekly chart:', error);
            }
            weeklyChartInstance = null;
        }
        return;
    }

    if (weeklyChartInstance) {
        try {
            weeklyChartInstance.destroy();
        } catch (error) {
            console.warn('Error destroying weekly chart:', error);
        }
        weeklyChartInstance = null;
    }

    try {
        weeklyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: recentWeeks.map(week => `Week ${week.week.split('-')[0]}`),
                datasets: [
                    {
                        label: '⏱️ Hours Worked',
                        data: recentWeeks.map(week => week.totalHours),
                        backgroundColor: (ctx) => {
                            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
                            gradient.addColorStop(0, CHART_COLORS.primary);
                            gradient.addColorStop(1, CHART_COLORS.primary + '40');
                            return gradient;
                        },
                        borderColor: CHART_COLORS.primary,
                        borderWidth: 2,
                        yAxisID: 'y',
                        borderRadius: 6,
                        borderSkipped: false,
                        barThickness: 30
                    },
                    {
                        label: '💰 Total Pay',
                        data: recentWeeks.map(week => week.totalPay),
                        backgroundColor: (ctx) => {
                            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
                            gradient.addColorStop(0, CHART_COLORS.success);
                            gradient.addColorStop(1, CHART_COLORS.success + '40');
                            return gradient;
                        },
                        borderColor: CHART_COLORS.success,
                        borderWidth: 2,
                        yAxisID: 'y1',
                        borderRadius: 6,
                        borderSkipped: false,
                        barThickness: 30
                    }
                ]
            },
            options: {
                ...CHART_OPTIONS,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    ...CHART_OPTIONS.plugins,
                    legend: {
                        ...CHART_OPTIONS.plugins.legend,
                        position: 'top',
                        labels: {
                            ...CHART_OPTIONS.plugins.legend.labels,
                            padding: 20
                        }
                    },
                    tooltip: {
                        ...CHART_OPTIONS.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    return `⏱️ Hours: ${context.parsed.y.toFixed(1)}h`;
                                } else {
                                    return `💰 Pay: ¥${Math.round(context.parsed.y).toLocaleString()}`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(0, 0, 0, 0.06)',
                            lineWidth: 1
                        },
                        border: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: '⏱️ Hours',
                            color: '#6b7280',
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            callback: function(value) {
                                return value.toFixed(0) + 'h';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        border: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: '💰 Pay (¥)',
                            color: '#6b7280',
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            callback: function(value) {
                                return '¥' + Math.round(value).toLocaleString();
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating weekly chart:', error);
    }
}

/**
 * NEW: Process monthly data for comparison chart
 */
function processMonthlyData(data) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Initialize weekly totals
    const current = [0, 0, 0, 0, 0]; // 5 weeks max
    const previous = [0, 0, 0, 0, 0];
    
    data.forEach(entry => {
        const date = new Date(entry.workDate);
        const month = date.getMonth();
        const year = date.getFullYear();
        const weekOfMonth = Math.floor((date.getDate() - 1) / 7);
        
        if (weekOfMonth < 5) { // Ensure we don't exceed array bounds
            if (year === currentYear && month === currentMonth) {
                current[weekOfMonth] += entry.payInfo.totalPay;
            } else if (
                (year === currentYear && month === currentMonth - 1) ||
                (year === currentYear - 1 && currentMonth === 0 && month === 11)
            ) {
                previous[weekOfMonth] += entry.payInfo.totalPay;
            }
        }
    });
    
    return { current, previous };
}

/**
 * NEW: Create monthly comparison chart
 */
function createMonthlyComparisonChart() {
    const ctx = document.getElementById('monthlyComparisonChart');
    if (!ctx) {
        console.log('Monthly comparison chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    // Use global weeklyData reference
    const weeklyData = window.weeklyData || [];
    if (!Array.isArray(weeklyData)) {
        console.log('Weekly data not available for monthly comparison chart');
        return;
    }

    const monthlyData = processMonthlyData(weeklyData);
    
    // Calculate totals
    const currentTotal = monthlyData.current.reduce((a, b) => a + b, 0);
    const previousTotal = monthlyData.previous.reduce((a, b) => a + b, 0);
    const growthRate = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal * 100) : 0;
    
    // Update stats
    const currentMonthTotalEl = document.getElementById('currentMonthTotal');
    const previousMonthTotalEl = document.getElementById('previousMonthTotal');
    const growthRateEl = document.getElementById('growthRate');
    
    if (currentMonthTotalEl) currentMonthTotalEl.textContent = `¥${Math.round(currentTotal).toLocaleString()}`;
    if (previousMonthTotalEl) previousMonthTotalEl.textContent = `¥${Math.round(previousTotal).toLocaleString()}`;
    if (growthRateEl) {
        growthRateEl.textContent = `${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}%`;
        growthRateEl.className = `stat-value growth-rate ${growthRate >= 0 ? 'positive' : 'negative'}`;
    }

    // Destroy existing chart
    if (monthlyComparisonChartInstance) {
        try {
            monthlyComparisonChartInstance.destroy();
        } catch (error) {
            console.warn('Error destroying monthly comparison chart:', error);
        }
        monthlyComparisonChartInstance = null;
    }

    try {
        monthlyComparisonChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                datasets: [
                    {
                        label: 'Current Month',
                        data: monthlyData.current,
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: '#667eea',
                        borderWidth: 2,
                        borderRadius: 8
                    },
                    {
                        label: 'Previous Month',
                        data: monthlyData.previous,
                        backgroundColor: 'rgba(118, 75, 162, 0.8)',
                        borderColor: '#764ba2',
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ¥' + Math.round(context.parsed.y).toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + (value / 1000).toFixed(0) + 'k';
                            }
                        },
                        grid: {
                            borderDash: [5, 5]
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    } catch (error) {
        console.error('Error creating monthly comparison chart:', error);
    }
}

/**
 * NEW: Generate heatmap data
 */
function generateHeatmapData(data) {
    const heatmapData = [];
    const hourCounts = {};
    const dayCounts = {};
    
    // Initialize hour counts
    for (let hour = 0; hour < 24; hour++) {
        hourCounts[hour] = {};
        for (let day = 0; day < 7; day++) {
            hourCounts[hour][day] = 0;
        }
    }
    
    // Process data
    data.forEach(entry => {
        const date = new Date(entry.workDate);
        const dayOfWeek = date.getDay();
        let startHour = parseInt(entry.startTime.split(':')[0]);
        let endHour = parseInt(entry.endTime.split(':')[0]);
        
        // Handle overnight shifts
        if (endHour < startHour) {
            // Count hours until midnight
            for (let hour = startHour; hour < 24; hour++) {
                hourCounts[hour][dayOfWeek]++;
            }
            // Count hours after midnight on next day
            const nextDay = (dayOfWeek + 1) % 7;
            for (let hour = 0; hour <= endHour; hour++) {
                hourCounts[hour][nextDay]++;
            }
        } else {
            // Normal shift
            for (let hour = startHour; hour <= endHour; hour++) {
                hourCounts[hour][dayOfWeek]++;
            }
        }
        
        // Count days
        dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
    });
    
    // Convert to heatmap format
    for (let hour = 0; hour < 24; hour++) {
        for (let day = 0; day < 7; day++) {
            heatmapData.push({
                x: day,
                y: hour,
                v: hourCounts[hour][day]
            });
        }
    }
    
    // Find peak hour and most active day
    let maxHour = 0;
    let maxHourCount = 0;
    for (let hour = 0; hour < 24; hour++) {
        const hourTotal = Object.values(hourCounts[hour]).reduce((a, b) => a + b, 0);
        if (hourTotal > maxHourCount) {
            maxHourCount = hourTotal;
            maxHour = hour;
        }
    }
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let maxDay = 0;
    let maxDayCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
        if (count > maxDayCount) {
            maxDayCount = count;
            maxDay = parseInt(day);
        }
    });
    
    return {
        heatmapData,
        stats: {
            peakHour: `${maxHour}:00-${maxHour + 1}:00`,
            mostActiveDay: days[maxDay],
            totalShifts: data.length
        }
    };
}

/**
 * NEW: Create shift pattern heatmap
 */
function createShiftHeatmap() {
    const ctx = document.getElementById('shiftHeatmapChart');
    if (!ctx) {
        console.log('Shift heatmap chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    // Use global weeklyData reference
    const weeklyData = window.weeklyData || [];
    if (!Array.isArray(weeklyData) || weeklyData.length === 0) {
        console.log('No weekly data available for heatmap');
        return;
    }

    const { heatmapData, stats } = generateHeatmapData(weeklyData);
    
    // Update stats
    const peakHourEl = document.getElementById('peakHour');
    const mostActiveDayEl = document.getElementById('mostActiveDay');
    const totalShiftsEl = document.getElementById('totalShifts');
    
    if (peakHourEl) peakHourEl.textContent = stats.peakHour;
    if (mostActiveDayEl) mostActiveDayEl.textContent = stats.mostActiveDay;
    if (totalShiftsEl) totalShiftsEl.textContent = stats.totalShifts;

    // Destroy existing chart
    if (shiftHeatmapChartInstance) {
        try {
            shiftHeatmapChartInstance.destroy();
        } catch (error) {
            console.warn('Error destroying shift heatmap chart:', error);
        }
        shiftHeatmapChartInstance = null;
    }

    try {
        // Create custom heatmap using scatter chart
        shiftHeatmapChartInstance = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Work Hours',
                    data: heatmapData.map(item => ({
                        x: item.x,
                        y: item.y,
                        v: item.v
                    })),
                    backgroundColor: function(context) {
                        const value = context.raw.v;
                        const maxValue = Math.max(...heatmapData.map(d => d.v)) || 1;
                        if (value === 0) return 'rgba(200, 200, 200, 0.1)';
                        const intensity = value / maxValue;
                        const opacity = 0.3 + (intensity * 0.7);
                        return `rgba(102, 126, 234, ${opacity})`;
                    },
                    borderColor: function(context) {
                        const value = context.raw.v;
                        return value > 0 ? 'rgba(102, 126, 234, 0.8)' : 'transparent';
                    },
                    borderWidth: 1,
                    pointRadius: function(context) {
                        const width = context.chart.width;
                        const height = context.chart.height;
                        const size = Math.min(width / 8, height / 25) * 0.4;
                        return size;
                    },
                    pointHoverRadius: function(context) {
                        const width = context.chart.width;
                        const height = context.chart.height;
                        const size = Math.min(width / 8, height / 25) * 0.45;
                        return size;
                    },
                    pointStyle: 'rect'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            title: function() {
                                return '';
                            },
                            label: function(context) {
                                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                const day = days[context.parsed.x];
                                const hour = context.parsed.y;
                                const count = context.raw.v;
                                return [
                                    `${day} ${hour}:00-${hour + 1}:00`,
                                    `Worked: ${count} time${count !== 1 ? 's' : ''}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'top',
                        min: -0.5,
                        max: 6.5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                return days[value] || '';
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        type: 'linear',
                        reverse: true,
                        min: -0.5,
                        max: 23.5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                if (value % 2 === 0) {
                                    return value + ':00';
                                }
                                return '';
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    } catch (error) {
        console.error('Error creating shift heatmap chart:', error);
    }
}

/**
 * Create charts for calculator results
 */
function createCalculatorCharts(calc) {
    if (!calc || !calc.workingTime || !calc.payInfo) {
        console.error('Invalid calculation data for charts');
        return;
    }
    
    try {
        createPieChart(calc);
        createBarChart(calc);
    } catch (error) {
        console.error('Error creating calculator charts:', error);
    }
}

/**
 * Update all charts when calculation is complete
 */
function updateCharts(calculation) {
    try {
        if (calculation) {
            createPieChart(calculation);
            createBarChart(calculation);
        }
        
        updateDashboardChart();
        updateWeeklyChart();
        
        // NEW: Update advanced charts with delay for smooth loading
        setTimeout(() => {
            createMonthlyComparisonChart();
            createShiftHeatmap();
        }, 500);
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

/**
 * Initialize all dashboard charts
 */
function initializeDashboardCharts() {
    try {
        console.log('Initializing dashboard charts...');
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded - charts cannot be initialized');
            return;
        }
        
        // Ensure weeklyData is available globally
        if (!window.weeklyData || !Array.isArray(window.weeklyData)) {
            console.log('weeklyData not available, initializing empty array');
            window.weeklyData = [];
        }
        
        console.log('Chart.js loaded:', typeof Chart !== 'undefined');
        console.log('weeklyData available:', Array.isArray(window.weeklyData), 'length:', window.weeklyData.length);
        
        // Main dashboard charts
        updateDashboardChart();
        updateWeeklyChart();
        
        // Advanced charts with staggered loading for better performance
        setTimeout(() => {
            try {
                createMonthlyComparisonChart();
            } catch (error) {
                console.error('Error creating monthly comparison chart:', error);
            }
        }, 200);
        
        setTimeout(() => {
            try {
                createShiftHeatmap();
            } catch (error) {
                console.error('Error creating shift heatmap:', error);
            }
        }, 400);
        
        console.log('Dashboard charts initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard charts:', error);
    }
}

/**
 * Responsive chart handling
 */
function handleChartResize() {
    const charts = [
        dashboardChartInstance, 
        pieChartInstance, 
        barChartInstance, 
        weeklyChartInstance,
        monthlyComparisonChartInstance,
        shiftHeatmapChartInstance
    ];
    
    charts.forEach(chart => {
        if (chart) {
            try {
                chart.resize();
            } catch (error) {
                console.warn('Error resizing chart:', error);
            }
        }
    });
}

/**
 * Chart utility functions
 */
function destroyAllCharts() {
    const charts = [
        { instance: dashboardChartInstance, name: 'dashboard' },
        { instance: pieChartInstance, name: 'pie' },
        { instance: barChartInstance, name: 'bar' },
        { instance: weeklyChartInstance, name: 'weekly' },
        { instance: monthlyComparisonChartInstance, name: 'monthly' },
        { instance: shiftHeatmapChartInstance, name: 'heatmap' }
    ];
    
    charts.forEach(chart => {
        if (chart.instance) {
            try {
                chart.instance.destroy();
            } catch (error) {
                console.warn(`Error destroying ${chart.name} chart:`, error);
            }
        }
    });
    
    dashboardChartInstance = null;
    pieChartInstance = null;
    barChartInstance = null;
    weeklyChartInstance = null;
    monthlyComparisonChartInstance = null;
    shiftHeatmapChartInstance = null;
}

/**
 * Export chart as image
 */
function exportChart(chartInstance, filename) {
    if (!chartInstance) {
        console.warn('No chart instance provided for export');
        return;
    }
    
    try {
        const url = chartInstance.toBase64Image();
        const link = document.createElement('a');
        link.download = filename + '.png';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting chart:', error);
    }
}

/**
 * Safe week number calculation
 */
function getWeekNumber(date) {
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            console.warn('Invalid date provided to getWeekNumber:', date);
            return 1;
        }
        
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    } catch (error) {
        console.error('Error calculating week number:', error);
        return 1;
    }
}

// Add resize listener with error handling
window.addEventListener('resize', function() {
    try {
        handleChartResize();
    } catch (error) {
        console.warn('Error in resize handler:', error);
    }
});

// Update charts when page becomes visible (for better performance)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(() => {
            try {
                handleChartResize();
            } catch (error) {
                console.warn('Error in visibility change handler:', error);
            }
        }, 100);
    }
});

/**
 * Test Chart.js functionality
 */
function testChartJS() {
    console.log('Testing Chart.js functionality...');
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return false;
    }
    
    // Test creating a simple chart
    const testCanvas = document.createElement('canvas');
    testCanvas.id = 'test-chart';
    testCanvas.width = 100;
    testCanvas.height = 100;
    testCanvas.style.display = 'none';
    document.body.appendChild(testCanvas);
    
    try {
        const testChart = new Chart(testCanvas, {
            type: 'line',
            data: {
                labels: ['A', 'B'],
                datasets: [{
                    data: [1, 2],
                    borderColor: '#667eea'
                }]
            },
            options: {
                responsive: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
        
        testChart.destroy();
        document.body.removeChild(testCanvas);
        console.log('Chart.js test successful');
        return true;
    } catch (error) {
        console.error('Chart.js test failed:', error);
        document.body.removeChild(testCanvas);
        return false;
    }
}

// Test Chart.js when the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(testChartJS, 100);
    });
} else {
    setTimeout(testChartJS, 100);
}

// Make sure all functions are globally accessible
try {
    window.createCalculatorCharts = createCalculatorCharts;
    window.updateDashboardChart = updateDashboardChart;
    window.createPieChart = createPieChart;
    window.createBarChart = createBarChart;
    window.updateWeeklyChart = updateWeeklyChart;
    window.createMonthlyComparisonChart = createMonthlyComparisonChart;
    window.createShiftHeatmap = createShiftHeatmap;
    window.initializeDashboardCharts = initializeDashboardCharts;
    window.updateCharts = updateCharts;
    
    console.log('✅ Chart functions successfully assigned to window object');
} catch (error) {
    console.error('❌ Error assigning chart functions to window:', error);
}

console.log('Chart.js loaded successfully with new chart features');
console.log('Chart functions available:', {
    createCalculatorCharts: typeof createCalculatorCharts,
    updateDashboardChart: typeof updateDashboardChart,
    initializeDashboardCharts: typeof initializeDashboardCharts
});