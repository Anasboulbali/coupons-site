// assets/js/performance.js

class PerformanceOptimizer {
    constructor() {
        this.initializeLazyLoading();
        this.setupInfiniteScroll();
        this.cacheDOM();
    }

    initializeLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupInfiniteScroll() {
        let page = 1;
        const loadMore = document.getElementById('loadMore');
        
        if (!loadMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.loadMoreCoupons(page++);
            }
        });

        observer.observe(loadMore);
    }

    async loadMoreCoupons(page) {
        try {
            const response = await fetch(`data/coupons-${page}.json`);
            const data = await response.json();
            this.appendCoupons(data.coupons);
        } catch (error) {
            console.error('Error loading more coupons:', error);
        }
    }

    appendCoupons(coupons) {
        const container = document.getElementById('couponsContainer');
        // Append new coupons to container
        // Implementation similar to displayCoupons function
    }

    cacheDOM() {
        this.domElements = {
            searchInput: document.getElementById('searchInput'),
            couponsContainer: document.getElementById('couponsContainer'),
            categoryFilter: document.getElementById('categoryFilter'),
            newsletterForm: document.querySelector('.newsletter-form')
        };
    }
}
