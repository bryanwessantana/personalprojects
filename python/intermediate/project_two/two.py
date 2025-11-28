# Public API Data Viewer (e.g., Weather):

# Python: Uses the requests library to consume a free public API 
# (e.g., OpenWeatherMap, CoinGecko) and process the returned JSON 
# data.

# Front-end: Displays the data in a user-friendly way 
# (e.g., current temperature, humidity, and a weather icon for a 
# city).

# ------------------------------------------------------------------------------------------- #
import requests
import sys
import json
from datetime import datetime

# --- CONFIGURATION ---
# IMPORTANT: Replace the placeholder below with your actual, activated API key.
# API Key provided by the user.
API_KEY = "947a024ed009c5fc686cb57b419dc2e0"
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

def fetch_weather_data(city_name, api_key):
    """Fetches weather data from the external API (OpenWeatherMap)."""
    
    if not api_key:
         return None, "Error: API Key is missing."

    # Request parameters: city name, API key, and metric units (Celsius)
    params = {
        "q": city_name,
        "appid": api_key,
        "units": "metric", 
        "lang": "en"       
    }
    
    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status() # Raises an exception for bad status codes (4xx or 5xx)
        return response.json(), None
    except requests.exceptions.HTTPError as errh:
        if response.status_code == 404:
            return None, f"Error: City '{city_name}' not found."
        if response.status_code == 401:
             return None, "Error: Invalid API Key or key is not yet activated (may take a few hours)."
        return None, f"HTTP Error: {errh}"
    except requests.exceptions.RequestException as e:
        return None, f"An unexpected error occurred during request: {e}"

def display_weather_info(data, city_name):
    """Formats and displays the weather data in the terminal."""
    
    try:
        main = data.get('main', {})
        weather = data.get('weather', [{}])[0]
        sys_info = data.get('sys', {})

        temp = main.get('temp')
        feels_like = main.get('feels_like')
        description = weather.get('description', 'N/A').title()
        humidity = main.get('humidity')
        country = sys_info.get('country', 'N/A')
        
        # Convert Unix timestamp to human-readable time
        sunrise_ts = sys_info.get('sunrise')
        sunset_ts = sys_info.get('sunset')
        
        sunrise = datetime.fromtimestamp(sunrise_ts).strftime('%H:%M:%S') if sunrise_ts else 'N/A'
        sunset = datetime.fromtimestamp(sunset_ts).strftime('%H:%M:%S') if sunset_ts else 'N/A'

        print(f"\n--- WEATHER IN {city_name.upper()}, {country} ---")
        print(f"Condition: {description}")
        print(f"Temperature: {temp}°C (Feels like: {feels_like}°C)")
        print(f"Humidity: {humidity}%")
        print(f"Sunrise: {sunrise}")
        print(f"Sunset: {sunset}")
        print("--------------------------------------\n")
        
    except Exception as e:
        print(f"Error parsing weather data: {e}")

def run_cli():
    """Main function CLI."""
    print("\n--- OPENWEATHERMAP VIEWER (CLI) ---")
    
    if API_KEY == "YOUR_OPENWEATHERMAP_API_KEY" or not API_KEY:
        print("\nFATAL ERROR: Please set your OpenWeatherMap API key in the code.")
        sys.exit(1)
        
    city = input("Enter city name (e.g., London or Curitiba): ").strip()
    if not city:
        print("City name cannot be empty.")
        return

    data, error = fetch_weather_data(city, API_KEY)
    
    if error:
        print(f"\nAPI Request Failed: {error}")
    elif data:
        display_weather_info(data, city)

if __name__ == '__main__':
    # REMINDER: This script requires 'requests'. Use: pip install requests
    run_cli()