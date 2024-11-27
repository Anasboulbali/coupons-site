// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadDeals();
    initializeSearch();
    initializeNewsletter();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Load and display deals
function loadDeals() {
    // Sample deals data (in production, this would come from an API)
    const deals = [
        {
            id: 1,
            title: "Premium Wireless Headphones",
            currentPrice: 149.99,
            originalPrice: 299.99,
            discount: 50,
            image: "path-to-image.jpg",
            merchant: "ElectroStore",
            expiresIn: "2 days",
            category: "Electronics"
        },
        // Add more deals...
    ];

    displayDeals(deals);
}

// Create and display deal cards
function displayDeals(deals) {
    const dealsGrid = document.querySelector('.deals-grid');
    
    deals.forEach(deal => {
        const dealCard = createDealCard(deal);
        dealsGrid.appendChild(dealCard);
    });
}

// Create individual deal card
function createDealCard(deal) {
    const discount = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100);
    
    const card = document.createElement('div');
    card.className = 'deal-card';
    card.innerHTML = `
        <div class="deal-image">
            <img src="${deal.image}" alt="${deal.title}">
            <span class="deal-tag">${discount}% OFF</span>
        </div>
        <div class="deal-content">
            <h3 class="deal-title">${deal.title}</h3>
            <div class="deal-price">
                <span class="current-price">$${deal.currentPrice}</span>
                <span class="original-price">$${deal.originalPrice}</span>
            </div>
            <div class="deal-footer">
                <span class="deal-merchant">${deal.merchant}</span>
                <span class="deal-expires">Expires in ${deal.expiresIn}</span>
            </div>
        </div>
    `;

    return card;
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', searchTerm);
        }, 300);
    });
}

// Newsletter functionality
function initializeNewsletter() {
    const form = document.querySelector('.newsletter-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input').value;
        
        // Implement newsletter signup logic here
        console.log('Newsletter signup:', email);
        
        // Show success message
        showNotification('Thanks for subscribing!');
    });
}

// Utility function for notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
