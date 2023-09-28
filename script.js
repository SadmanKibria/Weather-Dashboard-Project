document.addEventListener("DOMContentLoaded", () => {
    const locationInput = document.getElementById("locationInput");
    const searchButton = document.getElementById("searchButton");
    const weatherInfo = document.getElementById("weatherInfo");
    const weatherIcon = document.getElementById("weatherIcon");
    const temperature = document.getElementById("temperature");
    const condition = document.getElementById("condition");
    const forecastContainer = document.getElementById("forecastContainer");
    const forecast = document.getElementById("forecast");

    searchButton.addEventListener("click", () => {
        const location = locationInput.value;
        if (location.trim() === "") {
            alert("Please enter a location.");
            return;
        }

        // Below here "YOUR_API_KEY" insert your actual API key that you can get for free on OpenWeatherMap website.
        const apiKey = "YOUR_API_KEY";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                let weatherClass = "";
                if (data.weather[0].description.includes("sunny")) {
                    weatherClass = "sunny";
                    weatherIcon.classList.add("fa-sun");
                } else if (data.weather[0].description.includes("rain")) {
                    weatherClass = "rainy";
                    weatherIcon.classList.add("fa-cloud-rain");
                } else if (data.weather[0].description.includes("cloud")) {
                    weatherClass = "cloudy";
                    weatherIcon.classList.add("fa-cloud");
                } else if (data.weather[0].description.includes("snow")) {
                    weatherClass = "snowy";
                    weatherIcon.classList.add("fa-snowflake");
                }

                weatherInfo.classList.remove("hidden");
                weatherInfo.style.opacity = 1;
                weatherInfo.classList.add(weatherClass);
                temperature.textContent = `${data.main.temp}°C`;
                condition.textContent = data.weather[0].description;

                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

                fetch(forecastUrl)
                    .then((response) => response.json())
                    .then((forecastData) => {
                        displayForecast(forecastData.list);
                    })
                    .catch((error) => {
                        console.error("Error fetching forecast data:", error);
                        forecastContainer.innerHTML = "Error fetching forecast data.";
                    });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                weatherInfo.innerHTML = "Error fetching weather data.";
            });
    });

    function displayForecast(forecastList) {
        forecastContainer.innerHTML = "";

        for (let i = 0; i < forecastList.length; i += 8) {
            const forecastItem = forecastList[i];
            const date = new Date(forecastItem.dt * 1000);
            const temperatureValue = forecastItem.main.temp;
            const description = forecastItem.weather[0].description;

            const forecastElement = document.createElement("div");
            forecastElement.classList.add("forecast-item");
            forecastElement.innerHTML = `
                <div>${date.toLocaleDateString()}</div>
                <div>${temperatureValue}°C</div>
                <div>${description}</div>
            `;

            forecastContainer.appendChild(forecastElement);
        }

        forecast.classList.remove("hidden");
    }
});
