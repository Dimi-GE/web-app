// Load card grid fragment and inject into the cards container
function loadCardGrid() {
    const cardsContainer = document.querySelector('.cards');
    
    if (!cardsContainer) {
        console.warn('Cards container not found');
        return;
    }
    
    console.log('Starting to load card grid...');
    
    // Fetch the card grid interface HTML
    fetch('cards-grid-interface.html')
        .then(response => {
            console.log('Fetch response:', response.status, response.ok);
            if (!response.ok) {
                throw new Error(`Failed to load cards-grid-interface.html: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            console.log('Fetched HTML length:', html.length);
            console.log('Fetched HTML preview:', html.substring(0, 200));
            
            // Extract only the inner HTML (cards), not the wrapper
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const cardsElement = tempDiv.querySelector('.cards');
            
            if (!cardsElement) {
                throw new Error('No .cards element found in fetched HTML');
            }
            
            const innerCards = cardsElement.innerHTML;
            console.log('Extracted cards HTML length:', innerCards.length);
            
            // Inject cards into the container
            cardsContainer.innerHTML = innerCards;
            console.log('Card grid loaded successfully');
        })
        .catch(error => {
            console.error('Error loading card grid:', error);
            cardsContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; color: red;">
                    <p>Error loading cards: ${error.message}</p>
                </div>
            `;
        });
}

// Card view initialization
function initCard() {
    console.log('Card view initialized');
    loadCardGrid();
}
// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCard);
