// assets/js/main.js

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCoupons();
    initializeLanguage();
});

// Load coupons
async function loadCoupons() {
    try {
        const response = await fetch('data/coupons.json');
        const data = await response.json();
        displayCoupons(data.coupons);
    } catch (error) {
        console.error('Error loading coupons:', error);
    }
}

// Display coupons
function displayCoupons(coupons) {
    const container = document.getElementById('couponsContainer');
    container.innerHTML = coupons.map(coupon => `
        <div class="col-md-4 mb-4">
            <div class="coupon-card">
                <img src="assets/images/stores/${coupon.store.toLowerCase()}.png" 
                     alt="${coupon.store}" 
                     class="store-logo mb-3">
                ${coupon.verified ? `
                    <span class="verified-badge">
                        <i class="fas fa-check-circle"></i>
                        ${translations[currentLanguage].verified}
                    </span>
                ` : ''}
                <h3>${coupon.title}</h3>
                <p>${coupon.description}</p>
                <div class="coupon-code">
                    <span class="code">${coupon.code}</span>
                    <button class="copy-btn" onclick="copyCoupon('${coupon.code}', '${coupon.store}')">
                        <i class="far fa-copy"></i>
                        ${translations[currentLanguage].copy}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Copy coupon code
function copyCoupon(code, store) {
    navigator.clipboard.writeText(code).then(() => {
        showToast('success', `${translations[currentLanguage].copied} - ${store}`);
    }).catch(err => {
        showToast('error', translations[currentLanguage].copyError);
    });
}

// Show toast notification
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
