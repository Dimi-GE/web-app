// Load cards from the cards grid interface and inject into home view
function loadHomeCards() {
    const cardsContainer = document.getElementById('home-cards-container');
    if (!cardsContainer) return;
    
    fetch('../../components/cards/cards-grid-interface.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load cards');
            return response.text();
        })
        .then(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const cardsElement = tempDiv.querySelector('.cards');
            if (!cardsElement) throw new Error('No .cards element found');
            const innerCards = cardsElement.innerHTML;
            const homeCardHtml = innerCards.replace(/class="card"/g, 'class="home-card"');
            cardsContainer.innerHTML = homeCardHtml;
        })
        .catch(error => {
            console.error('Error loading home cards:', error);
        });
}

function initHome() {
    console.log('Home view initialized');
    loadHomeCards();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initHome);
