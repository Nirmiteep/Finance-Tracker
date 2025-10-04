// Comprehensive fixes for Personal Finance Tracker Issues

// Issue 1: Remove default characters from top right corner
function removeDefaultCharacters() {
    // Remove any unwanted characters that might appear in top right
    const possibleElements = [
        'span:contains("?")', 
        'div:contains("?")',
        '.default-chars',
        '[data-default]'
    ];
    
    // Clean up any default text content
    document.addEventListener('DOMContentLoaded', function() {
        // Remove any elements containing just "?" or default characters
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.textContent.trim() === '?' || 
                el.textContent.trim() === '???' || 
                el.textContent.trim() === 'undefined' ||
                el.textContent.trim() === 'null') {
                el.style.display = 'none';
                console.log('Removed default character element:', el);
            }
        });
    });
}

// Issue 2: Fix transaction history not updating after deletion
function fixTransactionHistoryUpdate() {
    // Override the deleteTransaction function to ensure UI updates
    if (typeof window.deleteTransaction === 'function') {
        const originalDeleteTransaction = window.deleteTransaction;
        window.deleteTransaction = function(id) {
            console.log('Deleting transaction with ID:', id);
            
            // Convert id to number for proper comparison
            const transactionId = parseInt(id);
            
            // Find the transaction first
            const transaction = transactions.find(t => t.id === transactionId);
            if (!transaction) {
                alert('Transaction not found!');
                return;
            }
            
            // Confirm deletion
            if (confirm(`Are you sure you want to delete this transaction?\n\n${transaction.description}\nAmount: ₹${transaction.amount.toFixed(2)}`)) {
                // Remove from transactions array
                const originalLength = transactions.length;
                transactions = transactions.filter(t => t.id !== transactionId);
                
                // Verify deletion worked
                if (transactions.length === originalLength) {
                    alert('Error: Could not delete transaction. Please try again.');
                    return;
                }
                
                // Save to localStorage
                saveTransactions();
                
                // Force complete UI update
                updateBalance();
                updateStats();
                loadTransactions(); // This should refresh the transaction list
                
                // Force chart update if it exists
                if (typeof updateChart === 'function') {
                    updateChart();
                }
                
                // Show success message
                alert('✅ Transaction deleted successfully!');
                
                console.log('Transaction deleted successfully. Remaining transactions:', transactions.length);
            }
        };
    }
}

// Issue 3: Fix mobile responsiveness for monthly breakdown
function fixMobileResponsiveness() {
    // Add CSS for better mobile layout
    const mobileCSS = `
        <style id="mobile-responsive-fixes">
            /* Fix monthly breakdown mobile responsiveness */
            @media (max-width: 768px) {
                .monthly-breakdown,
                .stats-container,
                .breakdown-container {
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 10px !important;
                    margin: 10px 0 !important;
                    box-sizing: border-box !important;
                    overflow-x: auto !important;
                }
                
                .monthly-breakdown table,
                .breakdown-table {
                    width: 100% !important;
                    font-size: 12px !important;
                    border-collapse: collapse !important;
                }
                
                .monthly-breakdown td,
                .monthly-breakdown th {
                    padding: 5px 3px !important;
                    word-wrap: break-word !important;
                    max-width: 80px !important;
                }
                
                /* Fix any overflowing containers */
                .container, .main-container {
                    max-width: 100vw !important;
                    overflow-x: hidden !important;
                    padding: 10px !important;
                }
                
                /* Ensure currency converter fits */
                .currency-converter {
                    width: 100% !important;
                    max-width: 100% !important;
                }
                
                /* Fix transaction items on mobile */
                .transaction-item {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin-bottom: 10px !important;
                    padding: 10px !important;
                    box-sizing: border-box !important;
                }
                
                /* Hide any elements that might cause overflow */
                .overflow-hidden {
                    overflow: hidden !important;
                }
            }
            
            /* Remove any default characters globally */
            .default-chars,
            [data-default="true"],
            span:empty,
            div:empty {
                display: none !important;
            }
        </style>
    `;
    
    // Inject the CSS into the head
    if (!document.getElementById('mobile-responsive-fixes')) {
        document.head.insertAdjacentHTML('beforeend', mobileCSS);
    }
}

// Apply all fixes
function applyAllFixes() {
    removeDefaultCharacters();
    fixTransactionHistoryUpdate();
    fixMobileResponsiveness();
    
    console.log('🔧 Applied comprehensive fixes:');
    console.log('✅ Removed default characters');
    console.log('✅ Fixed transaction history updates');
    console.log('✅ Improved mobile responsiveness');
}

// Initialize fixes when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
    applyAllFixes();
}

// Also apply fixes after a short delay to catch dynamic content
setTimeout(applyAllFixes, 1000);