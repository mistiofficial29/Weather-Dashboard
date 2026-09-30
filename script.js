const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const headerIcon = document.getElementById("headerIcon");
const locationButton = document.getElementById("locationButton");
const themeToggle = document.getElementById("themeToggle");
const recentSearches = document.getElementById("recentSearches");
const forecastContainer = document.getElementById("forecastContainer");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const temperature = document.getElementById("temperature");
const temperatureSmall = document.getElementById("temperatureSmall");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");
const updatedTime = document.getElementById("updatedTime");

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const weatherDescriptions = {
    0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"], 45: ["Fog", "🌫️"], 48: ["Depositing rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"], 53: ["Moderate drizzle", "🌦️"], 55: ["Dense drizzle", "🌧️"],
    56: ["Light freezing drizzle", "🌨️"], 57: ["Dense freezing drizzle", "🌨️"],
    61: ["Slight rain", "🌦️"], 63: ["Moderate rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
    66: ["Light freezing rain", "🌨️"], 67: ["Heavy freezing rain", "🌨️"],
    71: ["Slight snow", "🌨️"], 73: ["Moderate snow", "❄️"], 75: ["Heavy snow", "❄️"],
    77: ["Snow grains", "❄️"], 80: ["Slight rain showers", "🌦️"], 81: ["Moderate rain showers", "🌧️"],
    82: ["Violent rain showers", "⛈️"], 85: ["Slight snow showers", "🌨️"],
    86: ["Heavy snow showers", "❄️"], 95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"], 99: ["Thunderstorm with heavy hail", "⛈️"]
};

function getDescription(code) {
    return weatherDescriptions[code] || ["Unknown", "🌍"];
}

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return showError("Please enter a city name.");
    getWeatherByCity(city);
});

if (locationButton) {
    locationButton.addEventListener("click", () => {
        if (!navigator.geolocation) return showError("Location is not supported by this browser.");
        setLoading(true);
        clearMessage();
        navigator.geolocation.getCurrentPosition(
            position => getWeatherByCoordinates(position.coords.latitude, position.coords.longitude),
            () => {
                setLoading(false);
                showError("Unable to access your location. Please allow location permission and try again.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    });
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("weatherTheme", document.body.classList.contains("dark-mode") ? "dark" : "light");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });
}

if (localStorage.getItem("weatherTheme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️";
}

async function getWeatherByCity(city) {
    
    setLoading(true);
    clearMessage();

    try {
        const response = await fetch(
            `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=10&language=en&format=json`
        );

        if (!response.ok) {
            throw new Error("Unable to search for the city.");
        }

        const data = await response.json();

        if (!data.results || !data.results.length) {
            throw new Error(
                "City not found. Please check the spelling and try again."
            );
        }

        // Find a proper city/town result
        const location = data.results.find(place => {
            const featureCode = place.feature_code || "";
            const population = Number(place.population || 0);

            // Major cities / administrative cities
            if (
                featureCode === "PPLC" ||
                featureCode === "PPLA" ||
                featureCode === "PPLA2" ||
                featureCode === "PPLA3" ||
                featureCode === "PPLA4"
            ) {
                return true;
            }

            // Other populated places with a reasonable population
            if (
                featureCode === "PPL" &&
                population >= 5000
            ) {
                return true;
            }

            return false;
        });

        if (!location) {
            throw new Error(
                "City not found. Please enter a valid city name."
            );
        }

        await fetchWeather(
            location.latitude,
            location.longitude,
            location
        );

        saveRecentSearch(location.name);
        renderRecentSearches();

    } catch (error) {
        showError(
            error.message ||
            "Something went wrong. Please try again."
        );
    } finally {
        setLoading(false);
    }

}
async function getWeatherByCoordinates(latitude, longitude) {
    try {
        // Get the actual city/location name from the coordinates
        const locationResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to determine your location.");
        }

        const locationData = await locationResponse.json();

        const city =
            locationData.city ||
            locationData.locality ||
            locationData.principalSubdivision ||
            "Your Location";

        const country = locationData.countryName || "";
        const state = locationData.principalSubdivision || "";

        const location = {
            name: city,
            country: country,
            admin1: state
        };

        await fetchWeather(
            latitude,
            longitude,
            location
        );

    } catch (error) {
        showError(
            error.message ||
            "Unable to load weather for your location."
        );
    } finally {
        setLoading(false);
    }
}
async function fetchWeather(latitude, longitude, location) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
        forecast_days: "5",
        temperature_unit: "celsius",
        wind_speed_unit: "kmh",
        timezone: "auto"
    });

    const response = await fetch(`${WEATHER_API}?${params}`);
    if (!response.ok) throw new Error("Weather data could not be loaded.");
    const weatherData = await response.json();
    displayWeather(location, weatherData.current, weatherData.daily);
}

function displayWeather(location, current, daily) {
    const [description, weatherIconSymbol] = getDescription(current.weather_code);
    const isDay = current.is_day === 1;

    cityName.textContent = location.name || "Your Location";
    countryName.textContent = location.country
        ? `${location.admin1 ? location.admin1 + ", " : ""}${location.country}`
        : "Current location";
    temperature.textContent = Math.round(current.temperature_2m);
    temperatureSmall.textContent = `${Math.round(current.temperature_2m)}°C`;
    condition.textContent = description;
    humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
    windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    weatherIcon.textContent = isDay ? weatherIconSymbol : "🌙";
    headerIcon.textContent = isDay ? "☀️" : "🌙";

    const time = new Date(current.time);
    updatedTime.textContent = `Updated: ${time.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}`;
    renderForecast(daily);
}

function renderForecast(daily) {
    if (!forecastContainer || !daily || !daily.time) return;
    forecastContainer.innerHTML = "";

    daily.time.forEach((date, index) => {
        const [description, icon] = getDescription(daily.weather_code[index]);
        const dateObject = new Date(`${date}T12:00:00`);
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <div class="forecast-day">${index === 0 ? "Today" : dateObject.toLocaleDateString([], { weekday: "short" })}</div>
            <div class="forecast-date">${dateObject.toLocaleDateString([], { day: "numeric", month: "short" })}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-condition">${description}</div>
            <div class="forecast-temp"><strong>${Math.round(daily.temperature_2m_max[index])}°</strong> / ${Math.round(daily.temperature_2m_min[index])}°</div>
        `;
        forecastContainer.appendChild(card);
    });
}

function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem("recentWeatherSearches") || "[]");
    searches = [city, ...searches.filter(item => item.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    localStorage.setItem("recentWeatherSearches", JSON.stringify(searches));
}

function renderRecentSearches() {
    if (!recentSearches) return;

    const searches = JSON.parse(
        localStorage.getItem("recentWeatherSearches") || "[]"
    );

    recentSearches.innerHTML = "";

    searches.forEach(city => {
        const button = document.createElement("button");

        button.className = "recent-chip";
        button.textContent = city;

        button.addEventListener("click", () => {
            cityInput.value = city;
            getWeatherByCity(city);
        });

        recentSearches.appendChild(button);
    });

    // Clear history button
    if (searches.length > 0) {
        const clearButton = document.createElement("button");

        clearButton.className = "clear-history";
        clearButton.textContent = "Clear History";

        clearButton.addEventListener("click", () => {
            localStorage.removeItem("recentWeatherSearches");
            renderRecentSearches();
        });

        recentSearches.appendChild(clearButton);
    }
}

function setLoading(isLoading) {
    searchButton.disabled = isLoading;
    searchButton.textContent = isLoading ? "Loading..." : "Search";
    if (locationButton) locationButton.disabled = isLoading;
}

function showError(text) { message.textContent = text; }
function clearMessage() { message.textContent = ""; }

renderRecentSearches();
getWeatherByCity("Indore");
