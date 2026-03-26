// Mock Weather Data
const mockWeatherData = {
    jakarta: {
        location: 'Jakarta, Indonesia',
        current: {
            temp: 28,
            feelsLike: 26,
            description: 'Berawan',
            humidity: 75,
            windSpeed: 15,
            pressure: 1013,
            visibility: 10,
            uvIndex: 6,
            icon: 'cloudy'
        },
        hourly: [
            { time: '12:00', temp: 28, rain: 10, icon: 'sunny' },
            { time: '13:00', temp: 29, rain: 5, icon: 'sunny' },
            { time: '14:00', temp: 30, rain: 0, icon: 'sunny' },
            { time: '15:00', temp: 29, rain: 15, icon: 'cloudy' },
            { time: '16:00', temp: 27, rain: 30, icon: 'rainy' },
            { time: '17:00', temp: 25, rain: 50, icon: 'rainy-heavy' }
        ],
        daily: [
            { day: 'Kamis', date: '27 Mar', high: 31, low: 24, description: 'Berawan', rain: 20, icon: 'cloudy' },
            { day: 'Jumat', date: '28 Mar', high: 32, low: 25, description: 'Cerah', rain: 5, icon: 'sunny' },
            { day: 'Sabtu', date: '29 Mar', high: 30, low: 23, description: 'Hujan Ringan', rain: 60, icon: 'rainy' },
            { day: 'Minggu', date: '30 Mar', high: 28, low: 22, description: 'Hujan', rain: 80, icon: 'rainy-heavy' },
            { day: 'Senin', date: '31 Mar', high: 29, low: 23, description: 'Berawan', rain: 35, icon: 'cloudy' }
        ]
    },
    bandung: {
        location: 'Bandung, Indonesia',
        current: {
            temp: 22,
            feelsLike: 20,
            description: 'Cerah',
            humidity: 60,
            windSpeed: 10,
            pressure: 1010,
            visibility: 15,
            uvIndex: 5,
            icon: 'sunny'
        },
        hourly: [
            { time: '12:00', temp: 22, rain: 0, icon: 'sunny' },
            { time: '13:00', temp: 23, rain: 0, icon: 'sunny' },
            { time: '14:00', temp: 24, rain: 5, icon: 'sunny' },
            { time: '15:00', temp: 23, rain: 10, icon: 'cloudy' },
            { time: '16:00', temp: 21, rain: 20, icon: 'rainy' },
            { time: '17:00', temp: 19, rain: 40, icon: 'rainy-heavy' }
        ],
        daily: [
            { day: 'Kamis', date: '27 Mar', high: 26, low: 19, description: 'Cerah', rain: 5, icon: 'sunny' },
            { day: 'Jumat', date: '28 Mar', high: 27, low: 20, description: 'Cerah', rain: 0, icon: 'sunny' },
            { day: 'Sabtu', date: '29 Mar', high: 25, low: 18, description: 'Berawan', rain: 30, icon: 'cloudy' },
            { day: 'Minggu', date: '30 Mar', high: 23, low: 17, description: 'Hujan', rain: 70, icon: 'rainy-heavy' },
            { day: 'Senin', date: '31 Mar', high: 24, low: 18, description: 'Berawan', rain: 25, icon: 'cloudy' }
        ]
    },
    surabaya: {
        location: 'Surabaya, Indonesia',
        current: {
            temp: 31,
            feelsLike: 29,
            description: 'Panas',
            humidity: 80,
            windSpeed: 12,
            pressure: 1015,
            visibility: 12,
            uvIndex: 8,
            icon: 'sunny'
        },
        hourly: [
            { time: '12:00', temp: 31, rain: 0, icon: 'sunny' },
            { time: '13:00', temp: 32, rain: 0, icon: 'sunny' },
            { time: '14:00', temp: 33, rain: 0, icon: 'sunny' },
            { time: '15:00', temp: 31, rain: 5, icon: 'sunny' },
            { time: '16:00', temp: 29, rain: 20, icon: 'cloudy' },
            { time: '17:00', temp: 27, rain: 45, icon: 'rainy' }
        ],
        daily: [
            { day: 'Kamis', date: '27 Mar', high: 34, low: 27, description: 'Panas', rain: 0, icon: 'sunny' },
            { day: 'Jumat', date: '28 Mar', high: 35, low: 28, description: 'Panas', rain: 0, icon: 'sunny' },
            { day: 'Sabtu', date: '29 Mar', high: 33, low: 26, description: 'Berawan', rain: 40, icon: 'cloudy' },
            { day: 'Minggu', date: '30 Mar', high: 30, low: 24, description: 'Hujan Ringan', rain: 55, icon: 'rainy' },
            { day: 'Senin', date: '31 Mar', high: 31, low: 25, description: 'Cerah', rain: 15, icon: 'sunny' }
        ]
    }
};

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const geolocateBtn = document.getElementById('geolocateBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const weatherContent = document.getElementById('weatherContent');
const alertsSection = document.getElementById('alertsSection');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');

// State
let currentCity = 'jakarta';
let currentData = null;

// Icon Generator
function getWeatherIcon(iconType) {
    const icons = {
        sunny: `<circle cx="50" cy="50" r="25" fill="#FFD700"/>`,
        cloudy: `<circle cx="50" cy="40" r="30" fill="#FFD700"/>
                 <path d="M 30 55 Q 30 70 45 70 L 75 70 Q 85 70 85 60 Q 85 50 75 50 Q 72 40 60 40 Q 50 30 40 35 Q 25 40 30 55" fill="#B0B0B0"/>`,
        rainy: `<path d="M 30 55 Q 30 70 45 70 L 75 70 Q 85 70 85 60 Q 85 50 75 50 Q 72 40 60 40 Q 50 30 40 35 Q 25 40 30 55" fill="#B0B0B0"/>
                <line x1="35" y1="75" x2="33" y2="85" stroke="#4A90E2" stroke-width="2"/>
                <line x1="55" y1="75" x2="53" y2="85" stroke="#4A90E2" stroke-width="2"/>
                <line x1="75" y1="75" x2="73" y2="85" stroke="#4A90E2" stroke-width="2"/>`,
        'rainy-heavy': `<path d="M 30 55 Q 30 70 45 70 L 75 70 Q 85 70 85 60 Q 85 50 75 50 Q 72 40 60 40 Q 50 30 40 35 Q 25 40 30 55" fill="#808080"/>
                        <line x1="35" y1="75" x2="33" y2="88" stroke="#4A90E2" stroke-width="2"/>
                        <line x1="55" y1="75" x2="53" y2="88" stroke="#4A90E2" stroke-width="2"/>
                        <line x1="75" y1="75" x2="73" y2="88" stroke="#4A90E2" stroke-width="2"/>`
    };
    return icons[iconType] || icons.sunny;
}

// Show/Hide States
function showLoading() {
    loadingState.hidden = false;
    errorState.hidden = true;
    weatherContent.style.opacity = '0.5';
    weatherContent.style.pointerEvents = 'none';
}

function hideLoading() {
    loadingState.hidden = true;
    weatherContent.style.opacity = '1';
    weatherContent.style.pointerEvents = 'auto';
}

function showError(message) {
    errorMessage.textContent = message;
    errorState.hidden = false;
    loadingState.hidden = true;
    weatherContent.style.opacity = '0.5';
    weatherContent.style.pointerEvents = 'none';
}

function hideError() {
    errorState.hidden = true;
    weatherContent.style.opacity = '1';
    weatherContent.style.pointerEvents = 'auto';
}

// Format Date
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// Format Time
function formatTime(date) {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// Update Current Weather
function updateCurrentWeather(data) {
    const current = data.current;

    document.getElementById('locationName').textContent = data.location;
    document.getElementById('currentDate').textContent = formatDate(new Date());
    document.getElementById('currentTemp').textContent = current.temp;
    document.getElementById('weatherDescription').textContent = current.description;
    document.getElementById('feelsLike').textContent = `${current.feelsLike}°C`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.windSpeed} km/h`;
    document.getElementById('pressure').textContent = `${current.pressure} mb`;
    document.getElementById('visibility').textContent = `${current.visibility} km`;
    document.getElementById('uvIndex').textContent = current.uvIndex;

    // Update weather icon
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.innerHTML = getWeatherIcon(current.icon);

    // Update timestamp
    document.getElementById('lastUpdated').textContent = `Terakhir diupdate: ${formatTime(new Date())}`;
}

// Update Hourly Forecast
function updateHourlyForecast(data) {
    const hourlyContainer = document.querySelector('.hourly-container');
    hourlyContainer.innerHTML = '';

    data.hourly.forEach(hour => {
        const hourlyItem = document.createElement('article');
        hourlyItem.className = 'hourly-item';
        hourlyItem.setAttribute('role', 'listitem');

        hourlyItem.innerHTML = `
            <time>${hour.time}</time>
            <svg class="hourly-icon" viewBox="0 0 100 100" role="img" aria-label="${hour.icon}" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                ${getWeatherIcon(hour.icon)}
            </svg>
            <span class="hourly-temp">${hour.temp}°C</span>
            <span class="hourly-rain">${hour.rain}%</span>
        `;

        hourlyContainer.appendChild(hourlyItem);
    });
}

// Update Daily Forecast
function updateDailyForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = '';

    data.daily.forEach(day => {
        const forecastItem = document.createElement('article');
        forecastItem.className = 'forecast-item';
        forecastItem.setAttribute('role', 'listitem');

        forecastItem.innerHTML = `
            <h4>${day.day}</h4>
            <time class="forecast-date">${day.date}</time>
            <svg class="forecast-icon" viewBox="0 0 100 100" role="img" aria-label="${day.description}" xmlns="http://www.w3.org/2000/svg">
                ${getWeatherIcon(day.icon)}
            </svg>
            <div class="forecast-temps">
                <span class="temp-high">${day.high}°C</span>
                <span class="temp-low">${day.low}°C</span>
            </div>
            <p class="forecast-description">${day.description}</p>
            <span class="rain-chance">${day.rain}%</span>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

// Update Alerts (if temp too high)
function updateAlerts(data) {
    const temp = data.current.temp;

    if (temp > 30) {
        alertsSection.hidden = false;
    } else {
        alertsSection.hidden = true;
    }
}

// Fetch Weather Data (simulated)
async function fetchWeatherData(city) {
    return new Promise((resolve, reject) => {
        showLoading();

        // Simulate API call delay
        setTimeout(() => {
            const cityKey = city.toLowerCase().replace(/[^a-z]/g, '');

            if (mockWeatherData[cityKey]) {
                hideLoading();
                hideError();
                currentCity = cityKey;
                currentData = mockWeatherData[cityKey];
                updateCurrentWeather(currentData);
                updateHourlyForecast(currentData);
                updateDailyForecast(currentData);
                updateAlerts(currentData);
                resolve(currentData);
            } else {
                hideLoading();
                showError(`Kota "${city}" tidak ditemukan. Coba: Jakarta, Bandung, atau Surabaya`);
                reject(`Kota "${city}" tidak ditemukan`);
            }
        }, 800);
    });
}

// Search Handler
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();

    if (city) {
        await fetchWeatherData(city);
        searchInput.value = '';
    }
});

// Refresh Handler
refreshBtn.addEventListener('click', async () => {
    if (currentData) {
        await fetchWeatherData(currentCity);
    }
});

// Geolocation Handler
geolocateBtn.addEventListener('click', () => {
    showLoading();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Simulate getting Jakarta as default location
                setTimeout(() => {
                    hideLoading();
                    fetchWeatherData('Jakarta');
                }, 500);
            },
            (error) => {
                hideLoading();
                showError('Gagal mendapatkan lokasi. Silakan aktifkan geolocation atau cari kota secara manual.');
            }
        );
    } else {
        hideLoading();
        showError('Geolocation tidak didukung di browser Anda. Silakan cari kota secara manual.');
    }
});

// Retry Handler
retryBtn.addEventListener('click', async () => {
    if (currentData) {
        await fetchWeatherData(currentCity);
    } else {
        await fetchWeatherData('Jakarta');
    }
});

// Initialize with default city
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData('Jakarta');
});
