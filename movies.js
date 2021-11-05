'use strict';
const axios = require('axios');

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

async function handleMovies(request, response) {
    try {
        let input = request.query.city;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${input}&page=1&include_adult=false`;
        const results = await axios.get(url);
        let movies = results.data.results.map( movie => new Movie(movie) );
        return movies.length ? response.status(200).send(movies) : response.status(404).send('Unable to find movie data.');
    } catch {
        return response.status(404).send('Unable to find movie data.');
    }
}

module.exports = handleMovies;
