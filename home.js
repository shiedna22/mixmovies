const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

let movies = [];
let tvshows = [];
let anime = [];

let debounceTimer;
let bannerTimer;

/* 🎬 FETCH */
async function fetchData(type) {
  try {
    const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

/* 🎬 CREATE CARD (WITH TITLE LABEL) */
function createCard(item) {
  const card = document.createElement("div");
  card.style.position = "relative";
  card.style.minWidth = "130px";

  const img = document.createElement("img");
  img.src = item.poster_path
    ? IMG + item.poster_path
    : "https://via.placeholder.com/150x220?text=No+Image";

  img.style.width = "100%";
  img.style.borderRadius = "8px";

  /* 🔥 TITLE LABEL */
  const label = document.createElement("div");
  label.innerText = item.title || item.name;
  label.style.position = "absolute";
  label.style.bottom = "0";
  label.style.left = "0";
  label.style.width = "100%";
  label.style.padding = "6px";
  label.style.fontSize = "12px";
  label.style.background = "linear-gradient(to top, rgba(0,0,0,0.95), transparent)";
  label.style.color = "white";

  card.appendChild(img);
  card.appendChild(label);

  card.onclick = () => openPlayer(item);

  return card;
}

/* 🎬 SHOW */
function show(list, id) {
  const box = document.getElementById(id);
  if (!box) return;

  box.innerHTML = "";

  if (list.length === 0) {
    box.innerHTML = "<p style='color:white'>No results</p>";
    return;
  }

  list.forEach(i => {
    if (!i.poster_path) return;
    box.appendChild(createCard(i));
  });
}

/* ▶ PLAYER */
function openPlayer(item) {
  const video = document.getElementById("full");
  const player = document.getElementById("player");

  if (!video || !player) return;

  const isMovie = item.media_type === "movie" || item.title;

  video.src = isMovie
    ? `https://vidsrc.cc/v2/embed/movie/${item.id}`
    : `https://vidsrc.cc/v2/embed/tv/${item.id}/1/1`;

  player.style.display = "block";
}

/* ❌ CLOSE PLAYER */
function closePlayer() {
  document.getElementById("player").style.display = "none";
  document.getElementById("full").src = "";
}

/* 🎬 SEARCH (REAL API) */
async function searchMulti(value) {
  try {
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${value}`);
    const data = await res.json();
    const results = data.results || [];

    const moviesRes = results.filter(i => i.media_type === "movie");
    const tvRes = results.filter(i => i.media_type === "tv");

    show(moviesRes, "movies");
    show(tvRes, "tv");
    show(tvRes.filter(x => x.original_language === "ja"), "anime");

  } catch (err) {
    console.log(err);
  }
}

/* 🔍 SEARCH LISTENER */
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search");

  if (search) {
    search.addEventListener("input", (e) => {

      const value = e.target.value;

      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {

        if (!value.trim()) {
          show(movies, "movies");
          show(tvshows, "tv");
          show(anime, "anime");
          return;
        }

        searchMulti(value);

      }, 400);
    });
  }
});

/* 🎬 BANNER */
function startBanner() {
  const banner = document.getElementById("banner");
  if (!banner) return;

  const valid = movies.filter(m => m.backdrop_path);

  bannerTimer = setInterval(() => {
    const m = valid[Math.floor(Math.random() * valid.length)];

    banner.style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

  }, 4000);
}

/* 🚀 INIT */
async function init() {
  movies = await fetchData("movie");
  tvshows = await fetchData("tv");
  anime = tvshows.filter(x => x.original_language === "ja");

  show(movies, "movies");
  show(tvshows, "tv");
  show(anime, "anime");

  startBanner();
}

init();

/* GLOBAL */
window.closePlayer = closePlayer;
