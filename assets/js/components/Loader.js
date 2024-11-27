class Loader {
    constructor() {
        this.template = `
            <div class="loader-overlay">
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p class="loader-text">Loading...</p>
                </div>
            </div>
        `;
    }

    show(container = document.body) {
        const loader = document.createElement('div');
        loader.innerHTML = this.template;
        container.appendChild(loader.firstElementChild);
    }

    hide() {
        const loader = document.querySelector('.loader-overlay');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 300);
        }
    }

    showSkeleton(container, count = 6) {
        if (!container) return;

        container.innerHTML = Array(count).fill().map(() => `
            <div class="skeleton-item">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-button"></div>
            </div>
        `).join('');
    }
}

window.Loader = new Loader();
