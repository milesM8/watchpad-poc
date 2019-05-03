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

    $("#toggleSidebar").click(function (e) {
        const main = $("#main-section")
        if (main.attr("data-state") === "open") {
            main.attr("data-state", "closed")
            main.removeClass("open")
            main.addClass("closed")
        }else{
            main.attr("data-state", "open")
            main.removeClass("closed")
            main.addClass("open")
        }
    })
})