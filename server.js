'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

async function handleWeather(request, response) {
    try {
        let input = {
            lat: request.query.lat,
            lon: request.query.lon
        }

        const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${input.lat}&lon=${input.lon}&key=${process.env.WEATHER_API_KEY}`;
        const results = await axios.get(url);
        let forecasts = results.data.data.map( forecast => {
            let date = forecast.datetime;
            let description = `Low of ${forecast.low_temp}, high of ${forecast.high_temp} with ${forecast.weather.description}`;
            return new Forecast(date, description);
        });

        return response.status(200).send(forecasts);

    } catch {
        return response.status(404).send('Unable to find weather data.')
    }
}

function handleError(request, response) {
    response.status(404).send('Not found.')
}

app.use(cors())
app.get('/weather', handleWeather );
app.get('/*', handleError )
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`) );
