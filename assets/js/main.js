// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize libraries
    initializeAOS();
    initializeSwiper();
    
    // Load content
    loadCoupons();
    loadStores();
    
    // Setup event listeners
    setupSearchListener();
    setupScrollEffect();
    setupNewsletterForm();
});

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });
}

// Initialize Swiper for store logos
function initializeSwiper() {
    new Swiper('.storesSwiper', {
        slidesPerView: 2,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            1024: {
                slidesPerView: 5,
            },
        },
    });
}

// Load and display coupons
async function loadCoupons() {
    try {
        showLoader('couponsContainer');
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
    
    container.innerHTML = coupons.map(coupon => `
        <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-category="${coupon.category}">
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
                
                <h3 class="coupon-title mt-3">${coupon.title}</h3>
                <p class="coupon-description text-muted">${coupon.description}</p>
                
                <div class="coupon-code">
                    <span class="code">${coupon.code}</span>
                    <button class="copy-btn" onclick="copyCoupon('${coupon.code}', '${coupon.store}')">
                        <i class="far fa-copy me-2"></i>
                        Copy
                    </button>
                </div>
                
                <div class="coupon-meta">
                    <span class="expiry">
                        <i class="far fa-clock me-1"></i>
                        Expires: ${formatDate(coupon.expiryDate)}
                    </span>
                    
                    <div class="share-buttons">
                        <button onclick="shareCoupon('${coupon.title}')" class="share-btn">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load and display stores
async function loadStores() {
    try {
        const response = await fetch('data/coupons.json');
        const data = await response.json();
        const stores = [...new Set(data.coupons.map(coupon => coupon.store))];
        displayStores(stores);
    } catch (error) {
        console.error('Error loading stores:', error);
    }
}

// Display stores
function displayStores(stores) {
    const container = document.querySelector('.swiper-wrapper');
    
    container.innerHTML = stores.map(store => `
        <div class="swiper-slide">
            <div class="store-card">
                <img src="assets/images/stores/${store.toLowerCase()}.png" 
                     alt="${store}" 
                     class="store-logo"
                     onerror="this.src='assets/images/stores/default.png'">
                <h4>${store}</h4>
            </div>
        </div>
    `).join('');
}

// Copy coupon code
function copyCoupon(code, store) {
    navigator.clipboard.writeText(code).then(() => {
        const btn = event.target.closest('.copy-btn');
        updateCopyButton(btn, true);
        showToast('success', `Code copied for ${store}!`);
        
        setTimeout(() => {
            updateCopyButton(btn, false);
        }, 2000);
    }).catch(err => {
        showToast('error', 'Failed to copy code');
        console.error('Copy failed:', err);
    });
}

// Share coupon
function shareCoupon(title) {
    if (navigator.share) {
        navigator.share({
            title: 'DealSpot Coupon',
            text: `Check out this deal: ${title}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        showToast('info', 'Sharing is not supported on this device');
    }
}

// Setup search functionality
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterCoupons(searchTerm);
    }, 300));
}

// Setup scroll effect for navbar
function setupScrollEffect() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Setup newsletter form
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
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
// Setup category filter
function setupCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    if (!filter) return;

    filter.addEventListener('change', function(e) {
        const category = e.target.value;
        filterByCategory(category);
    });
}

// Filter coupons by category
function filterByCategory(category) {
    const cards = document.querySelectorAll('[data-category]');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
}

// Check URL for initial category
function checkInitialCategory() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    
    if (category) {
        const filter = document.getElementById('categoryFilter');
        if (filter) {
            filter.value = category;
            filterByCategory(category);
        }
    }
}
function showLoadingState() {
    const container = document.getElementById('couponsContainer');
    container.innerHTML = Array(6).fill().map(() => `
        <div class="col-md-4 mb-4">
            <div class="coupon-card skeleton">
                <div class="store-header skeleton-animate"></div>
                <div class="coupon-content">
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
        </div>
    `).join('');
}
