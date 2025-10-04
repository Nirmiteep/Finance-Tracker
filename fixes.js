// JavaScript fixes for Finance Tracker
// This file contains patches for common errors

// Fix 1: Chart initialization and destruction
(function() {
    // Ensure Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Override the updateChart function to fix destroy error
    const originalUpdateChart = window.updateChart;
    window.updateChart = function() {
        try {
            const ctx = document.getElementById('expenseChart');
            if (!ctx) return;
            
            const chartCtx = ctx.getContext('2d');
            
            // Safely destroy existing chart
            if (window.expenseChart && typeof window.expenseChart.destroy === 'function') {
                window.expenseChart.destroy();
                window.expenseChart = null;
            }

            // Get transactions data
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const expensesByCategory = {};
            
            transactions
                .filter(t => t.type === 'expense')
                .forEach(t => {
                    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                });

            const labels = Object.keys(expensesByCategory);
            const data = Object.values(expensesByCategory);

            if (labels.length === 0) {
                chartCtx.clearRect(0, 0, ctx.width, ctx.height);
                return;
            }

            // Create new chart
            window.expenseChart = new Chart(chartCtx, {
                type: 'doughnut',
                data: {
                    labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#ffffff',
                                font: { size: 12 }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Chart update error:', error);
        }
    };

    // Fix 2: Safe switchTab function
    const originalSwitchTab = window.switchTab;
    window.switchTab = function(tabName) {
        try {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Remove active from all nav tabs
            const navTabs = document.querySelectorAll('.nav-tab');
            navTabs.forEach(tab => tab.classList.remove('active'));

            // Show selected tab content
            const targetTab = document.getElementById(tabName);
            if (targetTab) {
                targetTab.classList.add('active');
            }

            // Add active to clicked nav tab (if event exists)
            if (window.event && window.event.target) {
                const clickedTab = window.event.target.closest('.nav-tab');
                if (clickedTab) {
                    clickedTab.classList.add('active');
                }
            }

            // Update stats and chart if history tab is selected
            if (tabName === 'history') {
                if (typeof updateStats === 'function') {
                    updateStats();
                }
            }
        } catch (error) {
            console.error('Tab switch error:', error);
        }
    };

    // Fix 3: Ensure DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize chart variable
        window.expenseChart = null;
        
        // Apply fixes after DOM is loaded
        console.log('Finance Tracker fixes applied successfully');
    });
})();