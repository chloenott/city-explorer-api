'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');
const app = express()

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

function handleWeather(request, response) {
    let input = {
        lat: Number(request.query.lat),
        lon: Number(request.query.lon),
        searchQuery: request.query.searchQuery || ''
    }

    let weatherAtCity = weather.find( weatherObj => findCity(weatherObj, input) );

    let forecasts = weatherAtCity && weatherAtCity.data.map( forecast => {
        let date = forecast.datetime;
        let description = `Low of ${forecast.low_temp}, high of ${forecast.high_temp} with ${forecast.weather.description}`;
        return new Forecast(date, description);
    });

    return weatherAtCity ? response.status(200).send(forecasts) : response.status(400).send('Unable to find weather data.');
}

function findCity(weatherObj, input) {
    return findByCityName(weatherObj, input.searchQuery) || findByCoordinates(weatherObj, input.lat, input.lon);
}

function findByCityName(weatherObj, cityName) {
    return weatherObj.city_name.toLowerCase() === cityName.toLowerCase();
}

function findByCoordinates(weatherObj, lat, lon) {
    let checkLat = Math.abs(Number(weatherObj.lat) - lat) < 0.1
    let checkLon = Math.abs(Number(weatherObj.lon) - lon) < 0.1;
    return checkLat && checkLon;
}

function handleError(request, response) {
    response.status(500).send('Not found.')
}

app.use(cors())
app.get('/weather', handleWeather );
app.get('/*', handleError )
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`) );
