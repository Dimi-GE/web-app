// Load and parse JSON data
function loadJSONData(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return parseWeekData(data);
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            return null;
        });
}

// Parse JSON into the format your app expects
function parseWeekData(jsonData) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    // Convert arrays to day-keyed objects
    const current = {};
    const previous = {};
    
    jsonData.CurrentWeek.UserSupport.forEach((value, index) => {
        current[days[index]] = value;
    });
    
    jsonData.PrevWeek.UserSupport.forEach((value, index) => {
        previous[days[index]] = value;
    });
    
    return {
        current: current,
        previous: previous
    };
}

// Get data - this is what you'll call from your button
function getData(filePath = 'data.json') {
    return loadJSONData(filePath);
}