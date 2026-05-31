// Header configuration
const headerConfig = {
    title: 'GHST Admin Panel',
    // Add more header config as needed
};

// Initialize header
function initHeader() {
    const header = document.getElementById('header');
    
    // Center content vertically and horizontally
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'center';

    // Create title element
    const titleElement = document.createElement('h1');
    titleElement.textContent = headerConfig.title;
    titleElement.style.color = '#fff';
    header.appendChild(titleElement);
    // Add more header elements here (e.g., user info, notifications, etc.)
}

// Run header initialization
document.addEventListener('DOMContentLoaded', initHeader);