// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize components
    setupNavbar();
    setupSearch();
    loadCoupons();
    setupNewsletterForm();
    setupScrollEffects();
}

// Navbar functionality
function setupNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterCoupons(searchTerm);
    }, 300));
}

// Load and display coupons
async function loadCoupons() {
    try {
        showLoadingState('couponsContainer');
        const response = await fetch('data/coupons.json');
        const data = await response.json();
        displayCoupons(data.coupons);
    } catch (error) {
        console.error('Error loading coupons:', error);
        showError('couponsContainer', 'Failed to load coupons');
    }
}

// Display coupons
function displayCoupons(coupons) {
    const container = document.getElementById('couponsContainer');
    if (!container) return;

    container.innerHTML = coupons.map(coupon => `
        <div class="col-md-4 mb-4" data-category="${coupon.category}">
            <div class="coupon-card">
                <div class="store-logo-container">
                    <img src="assets/images/stores/${coupon.store.toLowerCase()}.png" 
                         alt="${coupon.store}" 
                         class="store-logo"
                         onerror="this.src='assets/images/stores/default.png'">
                </div>
                
                ${coupon.verified ? `
                    <div class="verified-badge">
                        <i class="fas fa-check-circle"></i>
                        <span>Verified</span>
                    </div>
                ` : ''}
                
                <h3 class="coupon-title">${coupon.title}</h3>
                <p class="coupon-description">${coupon.description}</p>
                
                <div class="coupon-code">
                    <span class="code">${coupon.code}</span>
                    <button class="copy-btn" onclick="copyCoupon('${coupon.code}', '${coupon.store}')">
                        <i class="far fa-copy"></i>
                        <span>Copy</span>
                    </button>
                </div>
                
                <div class="coupon-meta">
                    <span class="expiry">
                        <i class="far fa-clock"></i>
                        Expires: ${formatDate(coupon.expiryDate)}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Copy coupon functionality
function copyCoupon(code, store) {
    navigator.clipboard.writeText(code).then(() => {
        showToast('success', `Code copied for ${store}!`);
        updateCopyButton(event.target.closest('.copy-btn'), true);
        
        setTimeout(() => {
            updateCopyButton(event.target.closest('.copy-btn'), false);
        }, 2000);
    }).catch(err => {
        showToast('error', 'Failed to copy code');
        console.error('Copy failed:', err);
    });
}

// Update copy button state
function updateCopyButton(button, copied) {
    if (!button) return;
    
    if (copied) {
        button.innerHTML = `
            <i class="fas fa-check"></i>
            <span>Copied!</span>
        `;
        button.classList.add('copied');
    } else {
        button.innerHTML = `
            <i class="far fa-copy"></i>
            <span>Copy</span>
        `;
        button.classList.remove('copied');
    }
}

// Filter coupons
function filterCoupons(searchTerm) {
    const cards = document.querySelectorAll('.col-md-4');
    let hasResults = false;

    cards.forEach(card => {
        const content = card.textContent.toLowerCase();
        const isMatch = content.includes(searchTerm);
        card.style.display = isMatch ? 'block' : 'none';
        if (isMatch) hasResults = true;
    });

    updateNoResultsMessage(hasResults);
}

// Show/hide no results message
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

// Newsletter form handling
function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (validateEmail(email)) {
            showToast('success', 'Thank you for subscribing!');
            this.reset();
        } else {
            showToast('error', 'Please enter a valid email');
        }
    });
}

// Toast notifications
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Utility functions
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

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showLoadingState(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = Array(6).fill().map(() => `
        <div class="col-md-4 mb-4">
            <div class="coupon-card skeleton">
                <div class="store-logo skeleton-animate"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    `).join('');
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="error-message">
                <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
                <h3>${message}</h3>
                <button onclick="location.reload()" class="btn btn-primary mt-3">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        </div>
    `;
}

// Scroll effects
function setupScrollEffects() {
    const scrollElements = document.querySelectorAll('.scroll-fade');
    
    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            (window.innerHeight || document.documentElement.clientHeight) - offset
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', debounce(handleScrollAnimation, 100));
}
// Animation Handler
class AnimationHandler {
    constructor() {
        this.observeElements();
        this.setupCopyAnimation();
    }

    observeElements() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe coupon cards
        document.querySelectorAll('.coupon-card').forEach(card => {
            observer.observe(card);
        });
    }

    setupCopyAnimation() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.classList.remove('copied');
                }, 1000);
            });
        });
    }

    static animateElement(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animationHandler = new AnimationHandler();

    // Add stagger animation to coupon container
    const couponsContainer = document.getElementById('couponsContainer');
    if (couponsContainer) {
        couponsContainer.classList.add('stagger-animation');
    }

    // Animate search results
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            document.querySelectorAll('.search-result').forEach(result => {
                AnimationHandler.animateElement(result, 'fade-in');
            });
        }, 300));
    }

    // Newsletter animation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            AnimationHandler.animateElement(newsletterForm, 'pulse');
        });
    }
});

// Utility function for debouncing
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

