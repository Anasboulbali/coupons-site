// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Sample deals data (in production, this would come from an API)
    const deals = [
        {
            id: 1,
            title: "50% Off Premium Headphones",
            category: "Electronics",
            currentPrice: 99.99,
            originalPrice: 199.99,
            discount: 50,
            image: "https://via.placeholder.com/300x200",
            location: "Online Deal",
            expiresIn: "2 days"
        },
        // Add more deals here
    ];

    // Initialize the page
    initializePage();
    loadFeaturedDeals();
    loadTrendingDeals();
    initializeSearch();
});

// Initialize page functionality
function initializePage() {
    // Add scroll event listener for sticky header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
}

// Create deal card HTML
function createDealCard(deal) {
    return `
        <div class="col-md-4 col-sm-6">
            <div class="deal-card">
                <div class="card-img-wrapper">
                    <img src="${deal.image}" alt="${deal.title}">
                    <span class="discount-badge">-${deal.discount}%</span>
                </div>
                <div class="card-body">
                    <h3 class="deal-title">${deal.title}</h3>
                    <div class="deal-price">
                        <span class="current-price">$${deal.currentPrice}</span>
                        <span class="original-price">$${deal.originalPrice}</span>
                    </div>
                    <div class="deal-footer">
                        <span class="location">${deal.location}</span>
                        <span class="expires">Expires in ${deal.expiresIn}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load featured deals
function loadFeaturedDeals() {
    const featuredDealsContainer = document.getElementById('featuredDeals');
    const featuredDeals = deals.slice(0, 6); // Get first 6 deals
    
    featuredDeals.forEach(deal => {
        featuredDealsContainer.innerHTML += createDealCard(deal);
    });
}

// Load trending deals
function loadTrendingDeals() {
    const trendingDealsContainer = document.getElementById('trendingDeals');
    const trendingDeals = deals.slice(6, 12); // Get next 6 deals
    
    trendingDeals.forEach(deal => {
        trendingDealsContainer.innerHTML += createDealCard(deal);
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredDeals = deals.filter(deal => 
            deal.title.toLowerCase().includes(searchTerm) ||
            deal.category.toLowerCase().includes(searchTerm)
        );
        
        // Update deals display
        updateDealsDisplay(filteredDeals);
    });
}

// Update deals display based on search/filter
function updateDealsDisplay(filteredDeals) {
    const featuredDealsContainer = document.getElementById('featuredDeals');
    featuredDealsContainer.innerHTML = '';
    
    filteredDeals.forEach(deal => {
        featuredDealsContainer.innerHTML += createDealCard(deal);
    });
}
