'use strict';
const axios = require('axios');

class Forecast {
    constructor(forecast) {
        this.date = forecast.datetime;
        this.description = `Low of ${forecast.low_temp}, high of ${forecast.high_temp} with ${forecast.weather.description}`;
    }
}

async function handleWeather(request, response) {
    try {
        let { lat, lon } = request.query;
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
        const results = await axios.get(url);
        let forecasts = results.data.data.map( forecast => new Forecast(forecast) );
        return forecasts.length ? response.status(200).send(forecasts) : response.status(404).send('Unable to find weather data.');
    } catch {
        return response.status(404).send('Unable to find weather data.');
    }
}

module.exports = handleWeather;
