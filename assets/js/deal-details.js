document.addEventListener('DOMContentLoaded', function() {
    // Get deal ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const dealId = urlParams.get('id');

    // Load deal details
    loadDealDetails(dealId);
    initializeTimer();
});

function loadDealDetails(dealId) {
    // In production, this would be an API call
    fetch('/data/deals.json')
        .then(response => response.json())
        .then(data => {
            const deal = data.featured_deals.find(d => d.id === dealId);
            if (deal) {
                displayDealDetails(deal);
            } else {
                showErrorMessage();
            }
        })
        .catch(error => {
            console.error('Error loading deal details:', error);
            showErrorMessage();
        });
}

function displayDealDetails(deal) {
    // Update page elements with deal details
    document.getElementById('dealImage').src = deal.image;
    document.getElementById('dealImage').alt = deal.title;
    document.getElementById('dealTitle').textContent = deal.title;
    document.getElementById('currentPrice').textContent = `$${deal.currentPrice}`;
    document.getElementById('originalPrice').textContent = `$${deal.originalPrice}`;
    document.getElementById('discountBadge').textContent = `-${deal.discount}%`;
    document.getElementById('dealDescription').textContent = deal.description;

    // Calculate and display savings
    const savings = deal.originalPrice - deal.currentPrice;
    document.getElementById('savings').textContent = `You save $${savings.toFixed(2)}`;

    // Display highlights
    const highlightsList = document.getElementById('highlightsList');
    deal.highlights.forEach(highlight => {
        const li = document.createElement('li');
        li.textContent = highlight;
        highlightsList.appendChild(li);
    });

    // Display terms
    const termsList = document.getElementById('termsList');
    deal.terms.forEach(term => {
        const li = document.createElement('li');
        li.textContent = term;
        termsList.appendChild(li);
    });
}

function initializeTimer() {
    // Set up countdown timer
    const timerContainer = document.getElementById('dealTimer');
    let timeLeft = 172800; // 48 hours in seconds

    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerContainer.innerHTML = '<div class="expired">Deal Expired</div>';
            return;
        }

        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        timerContainer.innerHTML = `
            <div class="timer-unit">
                <span>${hours}</span>
                Hours
            </div>
            <div class="timer-unit">
                <span>${minutes}</span>
                Minutes
            </div>
            <div class="timer-unit">
                <span>${seconds}</span>
                Seconds
            </div>
        `;

        timeLeft--;
    }, 1000);
}

function showErrorMessage() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="alert alert-danger mt-5">
            <h4>Deal Not Found</h4>
            <p>Sorry, the deal you're looking for could not be found.</p>
            <a href="index.html" class="btn btn-primary">Return to Homepage</a>
        </div>
    `;
}
