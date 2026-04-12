const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

let movies = [];
let tvshows = [];
let anime = [];

let isViewAll = false;

// 🎬 FETCH
async function fetchData(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
}

// 🎬 DISPLAY CARD (PREMIUM)
function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = IMG + item.poster_path;

  const overlay = document.createElement("div");
  overlay.className = "overlay";

  const title = document.createElement("div");
  title.className = "title";
  title.innerText = item.title || item.name;

  const rating = document.createElement("div");
  rating.className = "rating";
  rating.innerText = "⭐ " + (item.vote_average || "N/A");

  const desc = document.createElement("div");
  desc.className = "desc";
  desc.innerText = item.overview
    ? item.overview.slice(0, 40) + "..."
    : "";

  overlay.append(title, rating, desc);
  card.append(img, overlay);

  card.onclick = () => openPlayer(item);

  return card;
}

// 🎬 SHOW LIST
function show(list, id) {
  const box = document.getElementById(id);
  if (!box) return;

  box.innerHTML = "";

  list.forEach(i => {
    if (!i.poster_path) return;
    box.appendChild(createCard(i));
  });
}

// ▶ PLAYER
function openPlayer(item) {
  const video = document.getElementById("modal-video");

  const src = item.title
    ? `https://vidsrc.cc/v2/embed/movie/${item.id}`
    : `https://vidsrc.cc/v2/embed/tv/${item.id}/1/1`;

  document.getElementById("modal-title").innerText =
    item.title || item.name;

  video.src = src;
  document.getElementById("modal").style.display = "flex";
}

// ❌ CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

// 🎬 BANNER
function startBanner() {
  const valid = movies.filter(m => m.backdrop_path);
  if (valid.length === 0) return;

  setInterval(() => {
    const m = valid[Math.floor(Math.random() * valid.length)];

    document.getElementById("banner").style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

    document.getElementById("banner-title").innerText = m.title;

    document.getElementById("watchBtn").onclick = () => openPlayer(m);
  }, 3000);
}

// 🔥 VIEW ALL (MOVIES ONLY)
function viewAll() {
  const box = document.getElementById("movies-list");
  const btn = document.getElementById("viewBtn");

  if (!box) return;

  if (isViewAll) {
    isViewAll = false;

    box.style.flexWrap = "nowrap";
    box.style.overflowX = "auto";

    show(movies, "movies-list");

    if (btn) btn.innerText = "View All";
    return;
  }

  isViewAll = true;

  box.innerHTML = "";
  box.style.flexWrap = "wrap";
  box.style.overflowX = "hidden";
  box.style.justifyContent = "center";

  movies.forEach(i => {
    if (!i.poster_path) return;

    const card = createCard(i);
    card.style.margin = "5px";

    box.appendChild(card);
  });

  if (btn) btn.innerText = "Back";
}

// 🔍 SEARCH (ALL TYPES)
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("searchInput");
  if (!search) return;

  search.addEventListener("input", async function () {
    const q = this.value;

    if (!q) {
      show(movies, "movies-list");
      show(tvshows, "tvshows-list");
      show(anime, "anime-list");
      return;
    }

    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${q}`);
    const data = await res.json();

    show(data.results, "movies-list");
  });
});

// 🚀 INIT
async function init() {
  movies = await fetchData("movie");
  tvshows = await fetchData("tv");
  anime = tvshows.filter(x => x.original_language === "ja");

  show(movies, "movies-list");
  show(tvshows, "tvshows-list");
  show(anime, "anime-list");

  startBanner();
}

init();

// GLOBAL
window.viewAll = viewAll;
window.closeModal = closeModal;
