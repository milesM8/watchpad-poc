$(document).ready(function() {
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

		switch (type) {
			case "discoverMovie":
				queryURL += "/discover/movie";
				break;
			case "discoverTV":
				queryURL += "/discover/tv";
				break;
			case "movie":
				queryURL += `/movie/${parameters.movie_id}`;
				break;
			case "tv":
				queryURL += `/tv/${parameters.tv_id}`;
				break;
			case "tvSeason":
				queryURL += `/tv/${parameters.tv_id}/season/${parameters.season_number}`;
				break;
			case "tvEpisode":
				queryURL += `/tv/${parameters.tv_id}/season/${parameters.season_number}/episode/${parameters.episode_number}`;
				break;
			case "company":
				queryURL += `/search/company`;
				break;
			case "search":
				queryURL += `/search/multi`;
				break;
			default:
				return;
		}

		return (query = $.ajax({
			url: queryURL,
			type: "GET",
			data: { ...requestData, ...parameters },
			dataType: "json"
		}));
	};

	//renders a single poster
	const renderPoster = media => {
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
			.addClass("addToCollection")
			.attr("data-name", media.title)
			.attr("data-id", media.id)
			.text(strings.COLLECTION);
		const watchListButton = $("<button>")
			.addClass("addToWatchList")
			.attr("data-name", media.title)
			.attr("data-id", media.id)
			.text(strings.WATCHLIST);
		const ignoreButton = $("<button>")
			.addClass("addToIgnore")
			.attr("data-name", media.title)
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
		tmdbQuery("search", { query: query, page: page }).then(function(response) {
			for (media of response.results) {
				container.append(renderPoster(media));
			}
		});
	};

	// renders the trending movies to a given container
	const discover = (type, container, page = 1) => {
		container.empty();
		tmdbQuery(type, { page: page }).then(function(response) {
			for (media of response.results) {
				container.append(renderPoster(media));
			}
		});
	};

	// renders the watch list to a given container
	const watchList = (list, container) => {
		container.empty();
		for (movie of list) {
			tmdbQuery("movie", { movie_id: movie.id }).then(function(response) {
				container.append(renderPoster(response));
			});
		}
	};

	const handlePageChange = (view, parameters = {}) => {
		const carousel = $("<div>").addClass("carousel");
		const content = $("#content");
		content.empty();
		const watchListCarousel = $("<div>")
			.addClass("carousel")
			.attr("id", "watchListCarousel");
		const queueCarousel = $("<div>")
			.addClass("carousel")
			.attr("id", "queueCarousel");

		if (view === "dashboardEmpty") view = "discoverMovie";
		if (!parameters.page) parameters.page = 1;

		switch (view) {
			case "discoverTV":
			case "discoverMovie":
				const discoverDiv = $("<div>");
				discover(view, discoverDiv, parameters.page);
				content.html(discoverDiv);
				break;
			case "search":
				const searchDiv = $("<div>");
				search(parameters.query, searchDiv, parameters.page);
				content.html(searchDiv);
				break;
			case "dashboard":
				break;
			case "watchList":
				storedWatchList = localStorageGet("watchList");
				if (storedWatchList !== []) {
					watchList(storedWatchList, watchListCarousel);
					content.append(watchListCarousel);
				}
				break;
			case "collection":
				const collectionContainer = $("<div>").attr("id", "collectionContainer");
				break;
			case "queue":
				break;
		}
	};

	$("#toggleSidebar").click(function(e) {
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

	$(document).on("click", ".viewLink", function() {
		const button = $(this);
		const page = button.attr("data-page") ? button.attr("data-page") : 1;
		handlePageChange(button.attr("data-view"), { page: page });
	});

	handlePageChange("discoverMovie");

	$(document).on("click", ".addToWatchList", function() {
		const button = $(this);
		localStorageAdd("toWatchList", { name: button.attr("data-name"), id: button.attr("data-id"), date: new Date() });
	});
	$(document).on("click", ".addToCollection", function() {
		const button = $(this);
		localStorageAdd("toCollection", { name: button.attr("data-name"), id: button.attr("data-id"), date: new Date() });
	});
	$(document).on("click", ".addToIgnore", function() {
		const button = $(this);
		localStorageAdd("toIgnore", { name: button.attr("data-name"), id: button.attr("data-id"), date: new Date() });
	});

	$("#searchForm").submit(function(e) {
		e.preventDefault();

		const searchTerm = $("#search").val();
		handlePageChange("search", { query: searchTerm });
	});

	$("#main-section").css("height", $(document).height());
});
