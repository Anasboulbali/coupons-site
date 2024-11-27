// Language management
let currentLanguage = 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update active state of language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${lang}-btn`).classList.add('active');
    
    // Update all translations
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[lang];
        keys.forEach(k => {
            value = value[k];
        });
        
        if (element.tagName === 'INPUT') {
            element.placeholder = value;
        } else {
            element.textContent = value;
        }
    });
}

// Load and display coupons
async function loadCoupons() {
    try {
        const response = await fetch('data/coupons.json');
        const data = await response.json();
        const couponsContainer = document.getElementById('couponsContainer');
        
        couponsContainer.innerHTML = data.coupons.map(coupon => `
            <div class="col-md-4">
                <div class="coupon-card">
                    <div class="store-name">${coupon.store}</div>
                    <h3 class="coupon-title">${coupon.title}</h3>
                    <p class="coupon-description">${coupon.description}</p>
                    <div class="coupon-code">
                        <span class="code">${coupon.code}</span>
                        <button class="copy-btn" onclick="copyCoupon('${coupon.code}')">
                            ${translations[currentLanguage].coupons.copy}
                        </button>
                    </div>
                    <div class="coupon-meta">
                        <span class="expiry">
                            ${translations[currentLanguage].coupons.expires}: 
                            ${new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                        ${coupon.verified ? `
                            <span class="verified">
                                <i class="fas fa-check-circle"></i>
                                ${translations[currentLanguage].coupons.verified}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading coupons:', error);
    }
}

// Copy coupon code
function copyCoupon(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert(translations[currentLanguage].coupons.copied);
    }).catch(err => {
        console.error('Error copying code:', err);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('en');
    loadCoupons();
});
