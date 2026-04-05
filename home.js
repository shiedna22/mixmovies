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

// DISPLAY LIST
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

// INIT (MAIN)
async function init() {
  const movies = await fetchTrending("movie");
let index = 0;

setInterval(() => {
  const banner = document.getElementById("banner");

  // fade out
  banner.style.opacity = 0;

  setTimeout(() => {
    const movie = movies[index % movies.length];

    if (!movie.backdrop_path) return;

    banner.style.backgroundImage =
      `url(${IMG_URL}${movie.backdrop_path})`;

    document.getElementById("banner-title").textContent =
      movie.title || movie.name;

    document.getElementById("watchBtn").onclick =
      () => openPlayer(movie);

    // fade in
    banner.style.opacity = 1;

    index++;
  }, 300);

}, 5000);
  const tv = await fetchTrending("tv");
  const anime = await fetchAnime();

  // 🎬 BANNER FIX (SAFE)
  const randomMovie = movies.find(m => m.backdrop_path);

  if (randomMovie) {
    document.getElementById("banner").style.backgroundImage =
      `url(${IMG_URL}${randomMovie.backdrop_path})`;

    document.getElementById("banner-title").textContent =
      randomMovie.title || randomMovie.name;

    document.getElementById("watchBtn").onclick =
      () => openPlayer(randomMovie);
  }
let index = 0;

setInterval(() => {
  const movie = movies[index % movies.length];

  if (!movie.backdrop_path) return;

  document.getElementById("banner").style.backgroundImage =
    `url(${IMG_URL}${movie.backdrop_path})`;

  document.getElementById("banner-title").textContent =
    movie.title || movie.name;

  document.getElementById("watchBtn").onclick =
    () => openPlayer(movie);

  index++;
}, 5000);
  // 🎬 LISTS
  displayList(movies, "movies-list");
  displayList(tv, "tvshows-list");
  displayList(anime, "anime-list");
}

// RUN
init();

// 🔍 SEARCH (FIXED)
document.getElementById("searchInput").addEventListener("input", async function () {
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
});
