// assets/js/errorHandler.js

class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
        this.setupNetworkErrorHandling();
    }

    setupGlobalErrorHandling() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.handleError(error, {
                message: msg,
                location: `${url}:${lineNo}:${columnNo}`
            });
            return false;
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'Promise rejection'
            });
        });
    }

    setupNetworkErrorHandling() {
        window.addEventListener('online', () => {
            this.showConnectivityMessage('Connection restored', 'success');
            this.retryFailedOperations();
        });

        window.addEventListener('offline', () => {
            this.showConnectivityMessage('No internet connection', 'error');
        });
    }

    handleError(error, context = {}) {
        console.error('Error occurred:', error, context);

        // Show user-friendly error message
        this.showErrorMessage(error);

        // Log error to analytics
        if (window.gtag) {
            gtag('event', 'error', {
                'event_category': 'Error',
                'event_label': error.message,
                'value': context
            });
        }
    }

    showErrorMessage(error) {
        const message = this.getUserFriendlyMessage(error);
        showToast('error', message);
    }

    getUserFriendlyMessage(error) {
        const errorMessages = {
            'Failed to fetch': 'Unable to load data. Please check your connection.',
            'NetworkError': 'Network error occurred. Please try again.',
            'TypeError': 'Something went wrong. Please refresh the page.'
        };

        return errorMessages[error.name] || 'An unexpected error occurred. Please try again.';
    }

    showConnectivityMessage(message, type) {
        const connectivityBar = document.getElementById('connectivityBar') || 
            this.createConnectivityBar();
        
        connectivityBar.textContent = message;
        connectivityBar.className = `connectivity-bar ${type}`;
    }

    createConnectivityBar() {
        const bar = document.createElement('div');
        bar.id = 'connectivityBar';
        bar.className = 'connectivity-bar';
        document.body.prepend(bar);
        return bar;
    }

    retryFailedOperations() {
        // Implement retry logic for failed operations
        if (window.failedOperations?.length) {
            window.failedOperations.forEach(operation => {
                operation.retry();
            });
            window.failedOperations = [];
        }
    }
}
