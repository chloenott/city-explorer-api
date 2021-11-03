'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');
const app = express()

app.use(cors())
app.get('/weather', handleWeather );

function handleWeather(request, response) {
    let input = {
        lat: Number(request.query.lat),
        lon: Number(request.query.lon),
        searchQuery: request.query.searchQuery
    }

    let weatherAtCity = weather.find( weatherObj => findCity(weatherObj, input) );
    console.log(weatherAtCity || "Error: Cound not find weather data.")
    return response.status(200).send(weatherAtCity) || response.status(400).send('Could not find weather data.');
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

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`) );
