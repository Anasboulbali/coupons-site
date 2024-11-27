// assets/js/utils.js

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Validate email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show toast notification
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <i class="fas ${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Get toast icon based on type
function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    return icons[type] || icons.info;
}

// Show loader
function showLoader(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
            <p>Loading...</p>
        </div>
    `;
}

// Show error message
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="error-container">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
}

// Update copy button state
function updateCopyButton(button, copied) {
    if (copied) {
        button.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
        button.classList.add('copied');
    } else {
        button.innerHTML = '<i class="far fa-copy me-2"></i>Copy';
        button.classList.remove('copied');
    }
}

// Filter coupons
function filterCoupons(searchTerm) {
    const cards = document.querySelectorAll('.col-md-6');
    let hasResults = false;

    cards.forEach(card => {
        const content = card.textContent.toLowerCase();
        const isMatch = content.includes(searchTerm);
        card.style.display = isMatch ? 'block' : 'none';
        if (isMatch) hasResults = true;
    });

    updateNoResultsMessage(hasResults);
}

// Update no results message
function updateNoResultsMessage(hasResults) {
    let noResultsDiv = document.getElementById('noResultsMessage');
    
    if (!hasResults) {
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'noResultsMessage';
            noResultsDiv.className = 'col-12 text-center py-5';
            noResultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <h3>No results found</h3>
                    <p>Try different keywords or check for typos</p>
                </div>
            `;
            document.getElementById('couponsContainer').appendChild(noResultsDiv);
        }
        noResultsDiv.style.display = 'block';
    } else if (noResultsDiv) {
        noResultsDiv.style.display = 'none';
    }
}
