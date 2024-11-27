function createCouponCard(coupon) {
    return `
        <div class="col-md-4">
            <div class="coupon-card">
                <div class="store-logo-container">
                    <img src="assets/images/stores/${coupon.store.toLowerCase()}.png" 
                         alt="${coupon.store}" 
                         class="store-logo"
                         onerror="this.src='assets/images/stores/default.png'">
                </div>
                ${coupon.verified ? `
                    <span class="verified-badge">
                        <i class="fas fa-check-circle"></i>
                        ${translations[currentLanguage].coupons.verified}
                    </span>
                ` : ''}
                ${coupon.discount.value ? `
                    <span class="discount-badge">
                        ${coupon.discount.type === 'percentage' ? coupon.discount.value + '%' : '$' + coupon.discount.value}
                        ${translations[currentLanguage].coupons.off}
                    </span>
                ` : ''}
                <h3 class="coupon-title">${coupon.title}</h3>
                <p class="coupon-description">${coupon.description}</p>
                <div class="coupon-code">
                    <span class="code">${coupon.code}</span>
                    <button class="copy-btn" onclick="copyCoupon('${coupon.code}', '${coupon.store}')">
                        <i class="far fa-copy"></i>
                        ${translations[currentLanguage].coupons.copy}
                    </button>
                </div>
                <div class="coupon-meta">
                    <span class="expiry">
                        <i class="far fa-clock"></i>
                        ${translations[currentLanguage].coupons.expires}: 
                        ${new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                    <a href="${coupon.url}" target="_blank" class="store-link">
                        ${translations[currentLanguage].coupons.shopNow}
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}
