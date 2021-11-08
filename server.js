'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const weather = require('./modules/weather.js');
const movie = require('./modules/movies.js');
const app = express();

app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);
app.get('/*', handleError);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong!')
  });
}

function movieHandler(request, response) {
    const { input } = request.query;
    movie(input)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!')
    });
  }

function handleError(request, response) {
    response.status(404).send('Not found.');
}

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));