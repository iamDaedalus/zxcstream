const searchBar = document.getElementById("searchInput");
const searchResultContainer = document.querySelector(".searchResultContainer");
const resultsContainer = document.getElementById("results");
const typeText = document.getElementById("typeText");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showResultsContainer() {
  searchBar.classList.add("active");
  searchResultContainer.classList.add("active");
  document.body.style.overflow = "hidden";
}
function hideResultsContainer() {
  if (searchBar.value.trim() === "") {
    searchBar.classList.remove("active");
    searchResultContainer.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

let currentPage = 1;

searchBar.addEventListener("input", () => {
  if (searchBar.value.trim() !== "") {
    showResultsContainer();
  } else {
    hideResultsContainer();
  }
});

searchBar.addEventListener("focus", showResultsContainer);

searchBar.addEventListener("blur", () => {
  setTimeout(() => {
    hideResultsContainer();
  }, 50);
});

async function searchFetch(query, page = 1) {
  resultsContainer.innerHTML = "";
  const endpoint = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
    query
  )}&page=${page}`;
  const response = await fetch(endpoint);
  const data = await response.json();

  resultsContainer.innerHTML = "";

  data.results.forEach(async (meow) => {
    const movieDetails = await fetchShows(meow.id, meow.media_type);
    displaySearch(movieDetails);
  });
}

function displaySearch(data) {
  const searchCard = document.createElement("div");
  searchCard.className = "searchCard";
  searchCard.innerHTML = `<img class="searchCardImage" src="${data.english}"/>`;

  console.log();
  resultsContainer.appendChild(searchCard);
}

let debounceTimeout;
searchBar.addEventListener("input", (e) => {
  const typed = e.target.value;
  typeText.innerText = typed;
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    searchFetch(typed, currentPage);
  }, 500);
});
