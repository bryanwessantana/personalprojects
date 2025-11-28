/* --- JAVASCRIPT LOGIC (Fetches real data from OpenWeatherMap) --- */

// ⚠️ IMPORTANT: Replace this placeholder with your actual API key.
// Your API key provided earlier: 947a024ed009c5fc686cb57b419dc2e0
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
    
    output.style.display = 'flex'; 
    output.classList.remove('error');
    
    // Processamento dos dados da API
    const temp = data.main.temp;
    const feels_like = data.main.feels_like;
    const description = data.weather[0].description.toUpperCase();
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
    
    const icon = getIconForCondition(description);
    cityOutput.innerHTML = `${icon} ${cityOutput.textContent}`;
}

function displayError(message) {
    const output = document.getElementById('weather-output');
    output.style.display = 'flex';
    output.classList.add('error');
    output.style.justifyContent = 'center';
    output.innerHTML = `<p style="color: red; font-weight: bold; text-align: center;">${message}</p>`;
    document.getElementById('current-city').textContent = '';
    document.getElementById('details-container').innerHTML = '';
}

async function searchWeather(event) {
    event.preventDefault();
    const cityInput = document.getElementById('city-input').value.trim();
    
    if (cityInput === "") {
        return displayError("Please enter a city name.");
    }
    
    if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY" || API_KEY.length !== 32) {
        return displayError("FATAL: Please set a valid 32-character API key in the JavaScript file.");
    }

    // 1. Construir a URL da API
    const url = `${BASE_URL}?q=${encodeURIComponent(cityInput)}&appid=${API_KEY}&units=metric&lang=en`;

    // 2. Exibir loading (opcional, mas bom UX)
    const output = document.getElementById('weather-output');
    output.style.display = 'flex';
    output.innerHTML = '<p>Loading weather data...</p>';
    output.classList.remove('error');
    
    try {
        // 3. Realizar a busca usando Fetch API
        const response = await fetch(url);
        const data = await response.json();

        // 4. Checar por erros de API (como 404 Not Found)
        if (response.status !== 200) {
            let errorMessage = `Error fetching data (${response.status}).`;
            if (data.message) {
                 // Captura mensagens como "city not found"
                errorMessage = `API Error: ${data.message.charAt(0).toUpperCase() + data.message.slice(1)}`;
            }
            return displayError(errorMessage);
        }

        // 5. Exibir o resultado
        displayResult(cityInput, data);

    } catch (error) {
        // 6. Tratar erros de rede (CORS, conexão, etc.)
        console.error("Network or Fetch Error:", error);
        displayError("Connection Error. Ensure your API key is active and you are running on a secure server (HTTPS).");
    }
}