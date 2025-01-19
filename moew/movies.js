function movieSection() {
  const genreWrapper = document.getElementById("genreWrapper");
  const genreMovieContainer = document.getElementById("genreMovieContainer");

  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  // Render genre checkboxes
  genres.forEach((genre) => {
    const genreSlide = document.createElement("div");
    genreSlide.className = "swiper-slide genreSlide";

    const genreLabel = document.createElement("label");
    const genreCheckbox = document.createElement("input");
    genreCheckbox.type = "checkbox";
    genreCheckbox.value = genre.id;
    genreCheckbox.id = "genre_" + genre.id;

    genreLabel.innerText = genre.name;
    genreLabel.setAttribute("for", genreCheckbox.id);
    genreCheckbox.addEventListener("change", () => {
      genreLabel.classList.toggle("checked", genreCheckbox.checked);
      updateMoviesBySelectedGenres();
    });

    genreSlide.appendChild(genreLabel);
    genreSlide.appendChild(genreCheckbox);
    genreWrapper.appendChild(genreSlide);
  });

  new Swiper(".genreContainer", {
    slidesPerView: "auto",
    loop: false,
    centeredSlides: false,
    spaceBetween: 10,
    mousewheel: false,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: true,
    // },
  });

  function updateMoviesBySelectedGenres() {
    const selectedGenres = [];
    document
      .querySelectorAll("#genreWrapper input:checked")
      .forEach((checkbox) => {
        selectedGenres.push(checkbox.value);
      });

    if (selectedGenres.length === 0) {
      genreMovieContainer.innerHTML =
        "<p>Please select a genre to display movies.</p>";
      return;
    }

    const genreQuery = selectedGenres.join(",");
    fetchMoviesByGenre(genreQuery);
  }

  // Fetch movies by selected genres
  async function fetchMoviesByGenre(genreQuery) {
    const endpoint = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreQuery}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    genreMovieContainer.innerHTML = "";

    if (data.results.length === 0) {
      genreMovieContainer.innerHTML =
        "<p>No movies found for the selected genres.</p>";
      return;
    }

    data.results.forEach(async (movie) => {
      if (movie.adult === false && movie.vote_average >= 5) {
        console.log(movie);
        const movieDetails = await fetchShows(movie.id, "movie");
        displayMovies(movieDetails);
      }
    });
  }

  // Display movies in the genre container
  function displayMovies(movie) {
    const movieCard = document.createElement("div");
    movieCard.className = "genreCard";

    const movieImage = document.createElement("img");
    movieImage.src = `${movie.poster}`;
    movieImage.alt = movie.title;

    movieCard.appendChild(movieImage);
    genreMovieContainer.appendChild(movieCard);
  }
}
