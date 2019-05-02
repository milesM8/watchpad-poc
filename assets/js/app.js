$(document).ready(function () {

    // TMDB API Query call
    const tmdbQuery = (type, parameters = {}) => {
        let queryURL = strings.TMDB_URL
        const requestData = { api_key: strings.TMDB_KEY }

        switch (type) {
            case "discoverMovie":
                queryURL += "/discover/movie"
                break;
            case "discoverTV":
                queryURL += "/discover/tv"
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

        return query = $.ajax({
            url: queryURL,
            type: 'GET',
            data: { ...requestData, ...parameters },
            dataType: 'json'
        });
    }

    const renderPoster = media => {
        const posterContainer = $("<div>")

        const posterImage = $("<img>").attr("src", `${strings.TMDB_IMAGE_URL}${media.poster_path}`)
        const posterTitle = $("<h3>").text(media.title)
        const posterButtons = $("<div>")
        const collectionButton = $("<button>").text(strings.COLLECTION)
        const watchListButton = $("<button>").text(strings.WATCHLIST)
        const ignoreButton = $("<button>").text(strings.IGNORE)

        

        posterButtons.append(collectionButton, watchListButton, ignoreButton)
        posterContainer.append(posterImage, posterTitle, posterButtons)

        return posterContainer
    }


    const search = (query, page = 1) => {
        tmdbQuery("search", { query: query, page: page }).then(function (response) {
            console.log(response);
        })
    }

    const discover = (type, page = 1) => {
        tmdbQuery(`discover${type}`, { page: page }).then(function (response) {
            for (media of response.results){
                $("#discoverCarousel").append(renderPoster(media))
            }
        })
    }

    discover("Movie")
})