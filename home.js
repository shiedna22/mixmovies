const API_KEY = '43c2413701b5c752d07b62acf8e57736';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentItem;

// FETCH DATA
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// ANIME FILTER
async function fetchAnime() {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results.filter(item =>
    item.original_language === "ja"
  );
}

// DISPLAY MOVIES
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(item => {
    if (!item.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG_URL + item.poster_path;

    img.onclick = () => openPlayer(item);

    container.appendChild(img);
  });
}

// PLAYER
function openPlayer(item) {
  currentItem = item;

  const type = item.title ? "movie" : "tv";

  const embed = `https://vidsrc.cc/v2/embed/${type}/${item.id}`;

  document.getElementById("modal-title").textContent = item.title || item.name;
  document.getElementById("modal-video").src = embed;

  document.getElementById("modal").style.display = "flex";
}

// CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

// INIT
async function init() {
  const movies = await fetchTrending("movie");
  const tv = await fetchTrending("tv");
  const anime = await fetchAnime();

  displayList(movies, "movies-list");
  displayList(tv, "tvshows-list");
  displayList(anime, "anime-list");
}

init();
document.getElementById("searchInput").addEventListener("input", async function() {
  const query = this.value;

  if (!query) {
    document.getElementById("search-results").innerHTML = "";
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  const container = document.getElementById("search-results");
  container.innerHTML = "";

  data.results.forEach(item => {
    if (!item.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG_URL + item.poster_path;

    img.onclick = () => openPlayer(item);

    container.appendChild(img);
  });
});const movies = await fetchTrending("movie");

const randomMovie = movies[Math.floor(Math.random() * movies.length)];

document.getElementById("banner").style.backgroundImage =
  `url(${IMG_URL}${randomMovie.backdrop_path})`;

document.getElementById("banner-title").textContent =
  randomMovie.title;

document.getElementById("watchBtn").onclick = () => openPlayer(randomMovie);
