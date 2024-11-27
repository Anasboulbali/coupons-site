// Setup category filter
function setupCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    if (!filter) return;

    filter.addEventListener('change', function(e) {
        const category = e.target.value;
        filterByCategory(category);
    });
}

// Filter coupons by category
function filterByCategory(category) {
    const cards = document.querySelectorAll('[data-category]');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
}

// Check URL for initial category
function checkInitialCategory() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    
    if (category) {
        const filter = document.getElementById('categoryFilter');
        if (filter) {
            filter.value = category;
            filterByCategory(category);
        }
    }
}
