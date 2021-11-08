'use strict';

let cache = require('./cache.js');
const axios = require('axios');
const { response } = require('express');

module.exports = getMovie;

function getMovie(input) {
  const key = 'movie-' + input;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${input}&page=1&include_adult=false`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
    .then(response => parseMovie(response));
  }

  return cache[key].data;
}

function parseMovie(movieData) {
  try {
    const movieSummaries = movieData.data.results.map(movie => {
      return new Movie(movie);
    });
    return Promise.resolve(movieSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Movie {
    constructor(movie) {
        this.title = movie.title;
        this.overview = movie.overview;
        this.vote_average = movie.vote_average;
        this.vote_count = movie.vote_count;
        this.original_language = movie.original_language;
        this.popularity = movie.popularity;
        this.released_date = movie.released_date;
    }
}