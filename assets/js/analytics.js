// assets/js/analytics.js

class Analytics {
    constructor() {
        this.initializeGoogleAnalytics();
        this.setupEventTracking();
    }

    initializeGoogleAnalytics() {
        // Add Google Analytics snippet
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-5ERST2ND1V';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-5ERST2ND1V');
    }

    setupEventTracking() {
        // Track coupon copies
        document.addEventListener('couponCopy', (e) => {
            this.trackEvent('Coupon', 'Copy', e.detail.store);
        });

        // Track searches
        document.getElementById('searchInput')?.addEventListener('input', 
            debounce((e) => {
                if (e.target.value.length > 2) {
                    this.trackEvent('Search', 'Query', e.target.value);
                }
            }, 1000)
        );

        // Track category filters
        document.getElementById('categoryFilter')?.addEventListener('change', 
            (e) => {
                this.trackEvent('Filter', 'Category', e.target.value);
            }
        );
    }

    trackEvent(category, action, label) {
        if (window.gtag) {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }
}
