$(document).ready(function () {

    // adds to the local storage list
    const localStorageAdd = (type, data) => {
        switch (type) {
            case "toCollection":
                const currentCollection = localStorage.getItem("collection") || {}
                localStorage.setItem("collection", { ...currentCollection, data })
                return localStorage.getItem("collection")
                break;
            case "toWatchList":
                const currentWatchList = localStorage.getItem("watchList") || {}
                localStorage.setItem("watchList", { ...currentCollection, data })
                return localStorage.getItem("watchList")
                break;
            case "toIgnore":
                const currentIgnoreList = localStorage.getItem("ignoreList") || {}
                localStorage.setItem("ignoreList", { ...currentCollection, data })
                return localStorage.getItem("ignoreList")
                break;
            default:
                return false
                break;
        }
    }

    // gets currently stored lists
    const localStorageGet = (type) => {
        switch (type) {
            case "collection":
                return localStorage.getItem("collection") || {}
                break;
            case "watchList":
                return localStorage.getItem("watchList") || {}
                break;
            case "ignore":
                return localStorage.getItem("ignoreList") || {}
                break;
            default:
                return false
                break;
        }
    }

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

    //renders a single poster
    const renderPoster = media => {
        const posterContainer = $("<div>").addClass("poster")

        const posterImageBackdrop = $("<div>").addClass("imgBackdrop")
        const posterImage = $("<img>").attr("src", `${strings.TMDB_IMAGE_URL}${media.poster_path}`)
        posterImageBackdrop.append(posterImage)

        const posterBody = $("<div>").addClass("posterBody")
        const posterTitle = $("<h3>").text(media.title).addClass("posterTitle")
        const posterButtons = $("<div>").addClass("posterButtons")
        const collectionButton = $("<button>").text(strings.COLLECTION)
        const watchListButton = $("<button>").text(strings.WATCHLIST)
        const ignoreButton = $("<button>").text(strings.IGNORE)

        posterButtons.append(collectionButton, watchListButton, ignoreButton)
        posterBody.append(posterTitle, posterButtons)
        posterContainer.append(posterImageBackdrop, posterBody)

        return posterContainer
    }

    // takes a search query and adds the result to a given container
    const search = (query, container, page = 1) => {
        container = $(container)
        container.empty();
        tmdbQuery("search", { query: query, page: page }).then(function (response) {
            for (media of response.results) {
                container.append(renderPoster(media))
            }
        })
    }

    // renders the trending movies to a given container
    const discover = (type, container, page = 1) => {
        container = $(container)
        container.empty();
        tmdbQuery(`discover${type}`, { page: page }).then(function (response) {
            for (media of response.results) {
                container.append(renderPoster(media))
            }
        })
    }

    discover("Movie", "#discoverCarousel")
})