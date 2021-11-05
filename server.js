'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const handleWeather = require('./weather.js');
const handleMovies = require('./movies.js');

const app = express();

app.use(cors());

app.get('/weather', handleWeather);
app.get('/movies', handleMovies);
app.get('/*', handleError);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`) );

function handleError(request, response) {
    response.status(404).send('Not found.');
}
