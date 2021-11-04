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

class Movie {
    constructor({title, overview, vote_average, vote_count, original_language, popularity, released_date}) {
        this.title = title;
        this.overview = overview;
        this.vote_average = vote_average;
        this.vote_count = vote_count;
        this.original_language = original_language;
        this.popularity = popularity;
        this.released_date = released_date;
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

        return forecasts.length ? response.status(200).send(forecasts) : response.status(404).send('Unable to find weather data.');

    } catch {
        return response.status(404).send('Unable to find weather data.');
    }
}

async function handleMovies(request, response) {
    try {
        let input = request.query.city;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${input}&page=1&include_adult=false`;
        const results = await axios.get(url);
        let movies = results.data.results.map( movie => {
            return new Movie(movie);
        });

        return movies.length ? response.status(200).send(movies) : response.status(404).send('Unable to find movie data.');

    } catch {
        return response.status(404).send('Unable to find movie data.');
    }
}

function handleError(request, response) {
    response.status(404).send('Not found.');
}

app.use(cors());
app.get('/weather', handleWeather);
app.get('/movies', handleMovies);
app.get('/*', handleError);
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`) );
