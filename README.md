# Weather Dashboard

A responsive web-based Weather Dashboard that provides real-time weather information for cities around the world. Users can search for a city, view current weather conditions, check a 5-day forecast, use their current location, and manage their recent searches.

## Overview

The Weather Dashboard was developed as part of a Frontend Development Internship Mini Project.

The project focuses on creating a simple, responsive, and user-friendly interface while working with JavaScript, APIs, browser features, and client-side storage.

Weather information is retrieved using the Open-Meteo API and displayed dynamically based on the selected location.

## Features

### Core Features

- Search for weather information by city name
- Display current temperature
- Display weather condition
- Display humidity
- Display wind speed
- Dynamic weather icons
- Loading state while retrieving weather data
- Error handling for invalid searches and API issues
- Responsive design for different screen sizes

### Additional Features

- 5-day weather forecast
- Current location weather using browser geolocation
- Light and dark mode
- Recent city searches
- Clear search history
- Local storage for theme preference and recent searches
- Day and night weather indication

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Open-Meteo API
- Browser Geolocation API
- LocalStorage

## API

The project uses the Open-Meteo API to retrieve weather and forecast information.

Open-Meteo provides weather data including:

- Temperature
- Humidity
- Wind speed
- Weather conditions
- Weather codes
- Daily forecasts
- Sunrise and sunset information

Weather data is displayed dynamically according to the selected city or current location.

## Project Structure

```text
Weather-Dashboard/
│
├── index.html
├── style.css
├── script.js
└── README.md

index.html
Contains the structure and content of the Weather Dashboard, including the search section, weather information, forecast section, recent searches, and controls.

style.css
Contains the complete styling of the application, including the responsive layout, weather cards, buttons, dark mode, and mobile-friendly design.

script.js
Handles the application's functionality, including:

- City search
- API requests
- Weather data processing
- Current location detection
- 5-day forecast
- Recent searches
- Search history management
- Dark mode
- Loading and error states
- Dynamic weather information


How to Run the Project
Using Live Server
1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open index.html.
4. Run the project using Live Server.
5. The Weather Dashboard will open in your browser.

Using a Browser
The index.html file can also be opened directly in a modern web browser.
For the best experience, using a local development server such as Live Server is recommended.

How to Use
1. Enter a city name in the search bar.
2. Click the Search button.
3. View the current weather information.
4. Scroll down to view the 5-day forecast.
5. Use the Current Location option to get weather for your location.
6. Switch between light and dark mode.
7. Select a city from Recent Searches to quickly view its weather again.
8. Use Clear History to remove saved searches.


Responsive Design
The dashboard is designed to adapt to different screen sizes, including:
- Desktop
- Laptop
- Tablet
- Mobile devices
The layout automatically adjusts weather cards, forecast cards, search controls, and other interface elements according to the screen size.

Error Handling
The application provides appropriate messages when:
- No city is entered
- A city cannot be found
- Weather data cannot be retrieved
- Location permission is denied
- Browser location services are unavailable

Data Storage
LocalStorage is used for client-side storage of:
- Recent searches
- Dark mode preference
No backend database or cloud storage is required for the application.

Live Demo
https://mistiofficial29.github.io/Weather-Dashboard/

Repository
https://github.com/mistiofficial29/Weather-Dashboard

Project Purpose
The project was created to gain practical experience in frontend development, API integration, responsive web design, JavaScript programming, browser APIs, and client-side storage.
Future Improvements

Acknowledgement
Weather data is provided by Open-Meteo.
Project: Weather Dashboard
Type: Frontend Development Mini Project
Technologies: HTML, CSS, JavaScript
Weather API: Open-Meteo
Deployment: GitHub Pages

