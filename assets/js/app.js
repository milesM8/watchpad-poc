$(document).ready(function () {
    const TMDB_KEY = "d0b28beed08738ad2e0d147556889274" // https://developers.themoviedb.org/3/
    const FANDANGO_KEY = "ug4pcrn8cz2n5eb3jpgfh425" // https://developer.fandango.com/docs
    const TVDB_KEY = "KELUL9S1XY9AR8ZN" // https://api.thetvdb.com/swagger

    const tmdbQuery = (type, callBack, parameters = {}) => {
        let queryURL = "https://api.themoviedb.org/3"
        const requestData = { api_key: TMDB_KEY }

        switch (type) {
            case "discover":
                queryURL += "/discover/movie"
                break;
            case "movie":
                queryURL += `/movie/${parameters.movie_id}`
                break;
        }

        $.ajax({
            url: queryURL,
            type: 'GET',
            data: { ...requestData, ...parameters},
            dataType: 'json',
            success: function (data) {
                callBack({ ...data, success: true });
            },
            error: function (request, error) {
                callBack({ ...request, success: false });
            }
        });
    }
})