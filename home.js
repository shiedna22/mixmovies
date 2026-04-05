const API_KEY = '43c2413701b5c752d07b62acf8e57736';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentItem;

// FETCH
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// ANIME
async function fetchAnime() {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results.filter(item => item.original_language === "ja");
}

// DISPLAY
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(item => {
    if (!item.poster_path) return;

    const div = document.createElement("div");
    div.style.position = "relative";

    const img = document.createElement("img");
    img.src = IMG_URL + item.poster_path;

    // 🎬 CLICK PLAY
    img.onclick = () => openPlayer(item);

    // ❤️ FAVORITE BUTTON
    const fav = document.createElement("button");
    fav.textContent = "❤️";
    fav.style.position = "absolute";
    fav.style.top = "5px";
    fav.style.right = "5px";
    fav.style.background = "rgba(0,0,0,0.6)";
    fav.style.border = "none";
    fav.style.color = "white";
    fav.style.cursor = "pointer";

    fav.onclick = (e) => {
      e.stopPropagation();
      localStorage.setItem(item.id, JSON.stringify(item));
      alert("Added to Favorites ❤️");
    };

    div.appendChild(img);
    div.appendChild(fav);
    container.appendChild(div);
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

  // 🎬 INITIAL BANNER
  const firstMovie = movies.find(m => m.backdrop_path);

  if (firstMovie) {
    document.getElementById("banner").style.backgroundImage =
      `url(${IMG_URL}${firstMovie.backdrop_path})`;

    document.getElementById("banner-title").textContent =
      firstMovie.title || firstMovie.name;

    document.getElementById("watchBtn").onclick =
      () => openPlayer(firstMovie);
  }

  // 🔥 AUTO SLIDE + FADE
  let index = 0;

  setInterval(() => {
    const banner = document.getElementById("banner");

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

      banner.style.opacity = 1;

      index++;
    }, 300);

  }, 5000);

  // DISPLAY
  displayList(movies, "movies-list");
  displayList(tv, "tvshows-list");
  displayList(anime, "anime-list");
}

// RUN
init();

// 🔍 SEARCH (PRO VERSION)
document.getElementById("searchInput").addEventListener("input", async function () {
  const query = this.value;

  const sections = document.querySelectorAll("h2, .list");

  if (!query) {
    document.getElementById("search-results").innerHTML = "";
    sections.forEach(el => el.style.display = "block");
    return;
  }

  sections.forEach(el => el.style.display = "none");

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
