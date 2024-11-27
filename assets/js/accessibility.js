// assets/js/accessibility.js

class Accessibility {
    constructor() {
        this.setupA11y();
        this.addKeyboardNavigation();
        this.improveScreenReaderSupport();
    }

    setupA11y() {
        // Add ARIA labels
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            const text = button.textContent.trim();
            if (!text && button.querySelector('i')) {
                const iconClass = button.querySelector('i').className;
                button.setAttribute('aria-label', this.getAriaLabelFromIcon(iconClass));
            }
        });

        // Add skip link
        this.addSkipLink();
    }

    addKeyboardNavigation() {
        // Make coupon cards focusable
        document.querySelectorAll('.coupon-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const copyBtn = card.querySelector('.copy-btn');
                    copyBtn?.click();
                }
            });
        });

        // Add focus trap to modals
        document.querySelectorAll('.modal').forEach(modal => {
            this.trapFocus(modal);
        });
    }

    improveScreenReaderSupport() {
        // Add screen reader announcements
        const announcer = document.createElement('div');
        announcer.id = 'sr-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        document.body.appendChild(announcer);

        // Announce dynamic content changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    this.announceNewContent(mutation.addedNodes);
                }
            });
        });

        observer.observe(document.getElementById('couponsContainer'), {
            childList: true,
            subtree: true
        });
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.prepend(skipLink);
    }

    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    announceNewContent(nodes) {
        const announcer = document.getElementById('sr-announcer');
        if (!announcer) return;

        const newContent = Array.from(nodes)
            .map(node => node.textContent)
            .join(' ');
        
        announcer.textContent = 'New content loaded: ' + newContent;
    }

    getAriaLabelFromIcon(iconClass) {
        const iconMap = {
            'fa-copy': 'Copy code',
            'fa-share': 'Share coupon',
            'fa-search': 'Search',
            'fa-times': 'Close'
        };

        return iconMap[iconClass.split(' ').find(cls => cls.startsWith('fa-'))] || 'Button';
    }
}
