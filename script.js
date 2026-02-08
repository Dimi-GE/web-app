
// Hardcoded data for testing
const weekData = {
    current: {
        Mon: 3,
        Tue: 3,
        Wed: 3,
        Thu: 3,
        Fri: 3
    },
    previous: {
        Mon: 5,
        Tue: 5,
        Wed: 5,
        Thu: 5,
        Fri: 5
    }
};

// Calculate total
function calculateTotal(data) {
    return Object.values(data).reduce((sum, val) => sum + val, 0);
}

// Create a single quad element
function createQuad(label, value, isTotal = false) {
    const quad = document.createElement('div');
    quad.className = isTotal ? 'quad total' : 'quad';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'quad-label';
    labelDiv.textContent = label;
    
    const valueDiv = document.createElement('div');
    valueDiv.className = 'quad-value';
    valueDiv.textContent = value;
    
    quad.appendChild(labelDiv);
    quad.appendChild(valueDiv);
    
    return quad;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Render all quads
function renderQuads(data) {
    const container = document.getElementById('quads-container');
    container.innerHTML = ''; // Clear existing
    
    // Create quads for each day
    days.forEach(day => {
        const quad = createQuad(day, data[day]);
        container.appendChild(quad);
    });
    
    // Create total quad
    const total = calculateTotal(data);
    const totalQuad = createQuad('Total', total, true);
    container.appendChild(totalQuad);
}

// Create chart
let chartInstance = null;

function renderChart(currentData, previousData) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    
    const currentValues = days.map(day => currentData[day]);
    const previousValues = days.map(day => previousData[day]);
    
    // Destroy existing chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Previous Week',
                    data: previousValues,
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 1)',
                },
                {
                    label: 'Current Week',
                    data: currentValues,
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33, 150, 243, 1)',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Current vs Previous Week'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function handleUpdateClick() {
    console.log('Update button clicked!');
    
    // Add timestamp to force fresh fetch
    const url = `reports/simplified-report-09-10-25.json?t=${Date.now()}`;
    
    getData(url).then(data => {
        if (data) {
            renderQuads(data.current);
            renderChart(data.current, data.previous);
            console.log('Data loaded successfully!');
        } else {
            renderQuads(weekData.current);
            renderChart(weekData.current, weekData.previous);
            alert('Failed to load data. Check console for errors.');
        }
    });
}

// Initialize the app
function init() {
    handleUpdateClick();
    
    // Attach button event listener
    document.getElementById('updateButton').addEventListener('click', handleUpdateClick);
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);
