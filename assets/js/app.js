$(document).ready(function () {
    // adds to the local storage list
    const localStorageAdd = (type, data) => {
        switch (type) {
            case "toCollection":
                const currentCollection = localStorage.getItem("collection") ? JSON.parse(localStorage.getItem("collection")) : [];
                let match = currentCollection.find(obj => {
                    return obj.name === data.name;
                });
                if (match) return false;
                currentCollection.push(data);
                localStorage.setItem("collection", JSON.stringify(currentCollection));
                return JSON.parse(localStorage.getItem("collection"));
                break;
            case "toWatchList":
                const currentWatchList = localStorage.getItem("watchList") ? JSON.parse(localStorage.getItem("watchList")) : [];
                let match2 = currentWatchList.find(obj => {
                    return obj.name === data.name;
                });
                if (match2) return false;
                currentWatchList.push(data);
                localStorage.setItem("watchList", JSON.stringify(currentWatchList));
                return JSON.parse(localStorage.getItem("watchList"));
                break;
            case "toIgnore":
                const currentIgnoreList = localStorage.getItem("ignoreList") ? JSON.parse(localStorage.getItem("ignoreList")) : [];
                let match3 = currentIgnoreList.find(obj => {
                    return obj.name === data.name;
                });
                if (match3) return false;
                currentIgnoreList.push(data);
                localStorage.setItem("ignoreList", JSON.stringify(currentIgnoreList));
                return JSON.parse(localStorage.getItem("ignoreList"));
                break;
            default:
                return false;
                break;
        }
    };

    // gets currently stored lists
    const localStorageGet = type => {
        switch (type) {
            case "collection":
                return localStorage.getItem("collection") ? JSON.parse(localStorage.getItem("collection")) : [];
                break;
            case "watchList":
                return localStorage.getItem("watchList") ? JSON.parse(localStorage.getItem("watchList")) : [];
                break;
            case "ignore":
                return localStorage.getItem("ignoreList") ? JSON.parse(localStorage.getItem("ignoreList")) : [];
                break;
            default:
                return false;
                break;
        }
    };

    // TMDB API Query call
    const tmdbQuery = (type, parameters = {}) => {
        let queryURL = strings.TMDB_URL;
        const requestData = { api_key: strings.TMDB_KEY };
        let mediaType;

        parameters.region = "US"

        switch (type) {
            case "discoverMovie":
                mediaType = "movie";
                queryURL += "/discover/movie";
                break;
            case "discoverTV":
                mediaType = "tv";
                queryURL += "/discover/tv";
                break;
            case "movie":
                mediaType = "movie";
                queryURL += `/movie/${parameters.media_id}`;
                break;
            case "tv":
                mediaType = "tv";
                queryURL += `/tv/${parameters.media_id}`;
                break;
            case "tvSeason":
                queryURL += `/tv/${parameters.media_id}/season/${parameters.season_number}`;
                break;
            case "tvEpisode":
                queryURL += `/tv/${parameters.media_id}/season/${parameters.season_number}/episode/${parameters.episode_number}`;
                break;
            case "company":
                queryURL += `/search/company`;
                break;
            case "search":
                mediaType = "multi";
                queryURL += `/search/multi`;
                break;
            default:
                return;
        }

        return {
            request: $.ajax({
                url: queryURL,
                type: "GET",
                data: { ...requestData, ...parameters },
                dataType: "json"
            }), mediaType: mediaType
        };
    };

    //renders a single poster
    const renderPoster = (media, mediaType) => {
        const posterContainer = $("<div>").addClass("poster");

        const posterImageBackdrop = $("<div>").addClass("imgBackdrop");
        const posterImage = $("<img>").attr("src", `${strings.TMDB_IMAGE_URL}${media.poster_path}`);
        posterImageBackdrop.append(posterImage);

        const posterBody = $("<div>").addClass("posterBody");
        const posterTitle = $("<h3>")
            .text(media.title)
            .addClass("posterTitle");
        const posterButtons = $("<div>").addClass("posterButtons");
        const collectionButton = $("<button>")
            .addClass("listButton")
            .attr("data-name", media.title)
            .attr("data-action", "toCollection")
            .attr("data-media-type", mediaType)
            .attr("data-id", media.id)
            .text(strings.COLLECTION);
        const watchListButton = $("<button>")
            .addClass("listButton")
            .attr("data-name", media.title)
            .attr("data-action", "toWatchList")
            .attr("data-media-type", mediaType)
            .attr("data-id", media.id)
            .text(strings.WATCHLIST);
        const ignoreButton = $("<button>")
            .addClass("listButton")
            .attr("data-name", media.title)
            .attr("data-action", "toIgnore")
            .attr("data-media-type", mediaType)
            .attr("data-id", media.id)
            .text(strings.IGNORE);

        posterButtons.append(collectionButton, watchListButton, ignoreButton);
        posterBody.append(posterTitle, posterButtons);
        posterContainer.append(posterImageBackdrop, posterBody);

        return posterContainer;
    };

    // takes a search query and adds the result to a given container
    const search = (query, container, page = 1) => {
        container.empty();
        const call = tmdbQuery("search", { query: query, page: page })
        call.request.then(function (response) {
            for (media of response.results) {
                let mediaType = (call.mediaType === "multi") ? media.media_type : call.mediaType
                container.append(renderPoster(media, mediaType));
            }
        });
    };

    // renders the trending movies to a given container
    const discover = (type, container, page = 1) => {
        container.empty();
        const call = tmdbQuery(type, { page: page })
        call.request.then(function (response) {
            for (media of response.results) {
                let mediaType = (call.mediaType === "multi") ? media.media_type : call.mediaType
                container.append(renderPoster(media, mediaType));
            }
        });
    };

    // renders the watch list to a given container
    const watchList = (list, container) => {
        container.empty();
        for (media of list) {
            const call = tmdbQuery(media.mediaType, { media_id: media.id })
            call.request.then(function (response) {
                container.append(renderPoster(response, call.mediaType));
            });
        }
    };

    const handlePageChange = (view, parameters = {}) => {
        const carousel = $("<div>").addClass("carousel")
        const section = heading => {
            return $("<div>").append($("<h2>").text(heading))
        }
        const content = $("#content")
        content.empty()

        if (view === "dashboardEmpty") view = "discoverMovie";
        if (!parameters.page) parameters.page = 1;

        switch (view) {
            case "discoverTV":
            case "discoverMovie":
                const discoverDiv = $("<div>");
                discover(view, discoverDiv, parameters.page);
                content.html(section("Discover Movies").append(discoverDiv));
                break;
            case "search":
                const searchDiv = $("<div>");
                search(parameters.query, searchDiv, parameters.page);
                content.html(section("Search Results").append(searchDiv));
                break;
            case "dashboard":
                const watchListCarousel = carousel
                storedWatchList = localStorageGet("watchList")
                if (storedWatchList !== []) {
                    watchList(storedWatchList, watchListCarousel);
                    content.append(section("Watch List").append(watchListCarousel));
                }
                const dashboardDiv = $("<div>");
                discover("discoverMovie", dashboardDiv, parameters.page);
                content.append(section("Discover Movies").append(dashboardDiv));
                break;
            case "watchList":
                storedWatchList = localStorageGet("watchList")
                const watchListDiv = $("<div>");
                if (storedWatchList !== []) {
                    watchList(storedWatchList, watchListDiv);
                    content.append(section("Watch List").append(watchListDiv));
                }
                break;
            case "collection":
                const collectionContainer = $("<div>").attr("id", "collectionContainer");
                break;
            case "queue":
                break;
        }
    };

    $("#toggleSidebar").click(function (e) {
        const main = $("#main-section");
        if (main.attr("data-state") === "open") {
            main.attr("data-state", "closed");
            main.removeClass("open");
            main.addClass("closed");
        } else {
            main.attr("data-state", "open");
            main.removeClass("closed");
            main.addClass("open");
        }
    });

    $(document).on("click", ".viewLink", function () {
        const button = $(this);
        const page = button.attr("data-page") ? button.attr("data-page") : 1;
        handlePageChange(button.attr("data-view"), { page: page });
    });

    handlePageChange("dashboard");

    $(document).on("click", ".listButton", function () {
        const button = $(this);
        console.log(button.attr("data-action"));
        localStorageAdd(button.attr("data-action"), { name: button.attr("data-name"), id: button.attr("data-id"), mediaType: button.attr("data-media-type"), date: new Date() });
    });

    $("#search").keypress(function (e) {
        const searchTerm = $("#search").val();
        handlePageChange("search", { query: searchTerm });
    });
});
