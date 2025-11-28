/* --- JAVASCRIPT LOGIC (Fetch API Real Data) --- */

// ⚠️ IMPORTANT: Ensure your API Key is active
const API_KEY = "947a024ed009c5fc686cb57b419dc2e0"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Função utilitária para converter timestamp Unix em hora
function formatTime(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getIconForCondition(description) {
    if (description.includes("rain")) return '🌧️';
    if (description.includes("sun") || description.includes("clear")) return '☀️';
    if (description.includes("cloud")) return '☁️';
    if (description.includes("fog") || description.includes("mist")) return '🌫️';
    return '🌡️';
}

function displayResult(city, data) {
    const output = document.getElementById('weather-output');
    const cityOutput = document.getElementById('current-city');
    const details = document.getElementById('details-container');
    
    // Safety check: if elements are missing, stop execution
    if (!output || !cityOutput || !details) {
        console.error("Critical HTML elements missing.");
        return;
    }
    
    output.style.display = 'flex'; 
    output.classList.remove('error');
    
    // Processamento dos dados da API
    const temp = data.main.temp;
    const feels_like = data.main.feels_like;
    // Safe access to weather description array
    const description = data.weather && data.weather.length > 0 ? data.weather[0].description.toUpperCase() : "N/A";
    const humidity = data.main.humidity;
    const country = data.sys.country;
    const sunrise = formatTime(data.sys.sunrise);
    const sunset = formatTime(data.sys.sunset);

    cityOutput.textContent = `${city.toUpperCase()}, ${country}`;
    
    details.innerHTML = `
        <div class="weather-detail"><strong>Condition:</strong> ${description}</div>
        <div class="weather-detail"><strong>Temperature:</strong> ${temp}°C</div>
        <div class="weather-detail"><strong>Feels Like:</strong> ${feels_like}°C</div>
        <div class="weather-detail"><strong>Humidity:</strong> ${humidity}%</div>
        <div class="weather-detail"><strong>Sunrise:</strong> ${sunrise}</div>
        <div class="weather-detail"><strong>Sunset:</strong> ${sunset}</div>
    `;
    
    const icon = getIconForCondition(description.toLowerCase());
    cityOutput.innerHTML = `${icon} ${cityOutput.textContent}`;
}

function displayError(message) {
    const output = document.getElementById('weather-output');
    const cityOutput = document.getElementById('current-city');
    const details = document.getElementById('details-container');

    // Safety check
    if (!output) {
        console.error("Error container missing: " + message);
        return;
    }

    output.style.display = 'flex';
    output.classList.add('error');
    output.style.justifyContent = 'center';
    output.innerHTML = `<p style="color: red; font-weight: bold; text-align: center;">${message}</p>`;
    
    // Clean up potentially stale elements inside output if they still exist
    // Note: InnerHTML above might have removed them, so we recreate structure if needed next search
}

async function searchWeather(event) {
    event.preventDefault();
    const cityInput = document.getElementById('city-input');
    
    if (!cityInput) return; // Safety check
    
    const cityValue = cityInput.value.trim();
    
    if (cityValue === "") {
        // We recreate the structure if it was overwritten by an error message previously
        resetOutputStructure();
        return displayError("Please enter a city name.");
    }

    // 1. Reset output area for new search
    resetOutputStructure();
    const output = document.getElementById('weather-output');
    output.style.display = 'flex';
    output.innerHTML = '<p>Loading weather data...</p>';
    output.classList.remove('error');

    // 2. Build URL
    const url = `${BASE_URL}?q=${encodeURIComponent(cityValue)}&appid=${API_KEY}&units=metric&lang=en`;
    
    try {
        // 3. Fetch Data
        const response = await fetch(url);
        const data = await response.json();

        // 4. Handle API Errors (e.g., 404 City Not Found, 401 Unauthorized)
        if (response.status !== 200) {
            let errorMessage = `Error fetching data (${response.status}).`;
            if (data.message) {
                errorMessage = `API Error: ${data.message.charAt(0).toUpperCase() + data.message.slice(1)}`;
            }
            // Re-render structure to show error cleanly
            resetOutputStructure();
            return displayError(errorMessage);
        }

        // 5. Success
        resetOutputStructure(); // Ensure divs exist
        displayResult(cityValue, data);

    } catch (error) {
        console.error("Network or Fetch Error:", error);
        resetOutputStructure();
        displayError("Connection Error. Check your internet or API key.");
    }
}

// Helper to restore the inner divs of weather-output if they were overwritten
function resetOutputStructure() {
    const output = document.getElementById('weather-output');
    if (output) {
        output.innerHTML = `
            <div id="current-city"></div>
            <div id="details-container"></div>
        `;
    }
}