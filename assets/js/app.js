$(document).ready(function () {

    // TMDB API Query call
    const tmdbQuery = (type, callBack, parameters = {}) => {
        let queryURL = "https://api.themoviedb.org/3"
        const requestData = { api_key: strings.TMDB_KEY }

        switch (type) {
            case "discover":
                queryURL += "/discover/movie"
                break;
            case "movie":
                queryURL += `/movie/${parameters.movie_id}`
                break;
            case "tv":
                queryURL += `/tv/${parameters.tv_id}`
                break;
            case "tvSeason":
                queryURL += `/tv/${parameters.tv_id}/season/${parameters.season_number}`
                break;
            case "tvEpisode":
                queryURL += `/tv/${parameters.tv_id}/season/${parameters.season_number}/episode/${parameters.episode_number}`
                break;
            case "company":
                queryURL += `/search/company`
                break;
            case "search":
                queryURL += `/search/multi`
                break;
        }

        $.ajax({
            url: queryURL,
            type: 'GET',
            data: { ...requestData, ...parameters },
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