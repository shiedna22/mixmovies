const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

let movies = [];
let isViewAll = false;

// 🎬 FETCH
async function fetchMovies() {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();

    movies = data.results || [];

    showMovies(movies);
    startBanner();

  } catch (e) {
    console.log("Error loading movies", e);
  }
}

// 🎬 DISPLAY MOVIES (PREMIUM CARD)
function showMovies(list) {
  const box = document.getElementById("movies-list");
  if (!box) return;

  box.innerHTML = "";

  list.forEach(item => {
    if (!item.poster_path) return;

    const card = document.createElement("div");
    card.className = "card";

    // IMAGE
    const img = document.createElement("img");
    img.src = IMG + item.poster_path;

    // OVERLAY
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    // TITLE
    const title = document.createElement("div");
    title.className = "title";
    title.innerText = item.title || item.name;

    // RATING
    const rating = document.createElement("div");
    rating.className = "rating";
    rating.innerText = "⭐ " + (item.vote_average || "N/A");

    // DESCRIPTION
    const desc = document.createElement("div");
    desc.className = "desc";
    desc.innerText = item.overview
      ? item.overview.slice(0, 50) + "..."
      : "";

    overlay.appendChild(title);
    overlay.appendChild(rating);
    overlay.appendChild(desc);

    card.appendChild(img);
    card.appendChild(overlay);

    // CLICK → PLAY
    card.onclick = () => openPlayer(item);

    box.appendChild(card);
  });
}

// ▶ PLAYER
function openPlayer(item) {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modal-video");

  const title = item.title || item.name;

  modal.style.display = "flex";
  document.getElementById("modal-title").innerText = title;

  video.src = `https://vidsrc.cc/v2/embed/movie/${item.id}`;
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

// 🔥 VIEW ALL (FIXED TOGGLE)
function viewAll(type) {
  const box = document.getElementById("movies-list");
  const btn = document.getElementById("viewBtn");

  if (!box) return;

  if (isViewAll) {
    // 🔙 BACK TO NORMAL
    isViewAll = false;

    box.style.flexWrap = "nowrap";
    box.style.overflowX = "auto";

    showMovies(movies);

    if (btn) btn.innerText = "View All";
    return;
  }

  // 🔥 GRID VIEW
  isViewAll = true;

  box.innerHTML = "";
  box.style.flexWrap = "wrap";
  box.style.overflowX = "hidden";
  box.style.justifyContent = "center";

  movies.forEach(item => {
    if (!item.poster_path) return;

    const card = document.createElement("div");
    card.className = "card";
    card.style.margin = "5px";

    const img = document.createElement("img");
    img.src = IMG + item.poster_path;

    img.onclick = () => openPlayer(item);

    card.appendChild(img);
    box.appendChild(card);
  });

  if (btn) btn.innerText = "Back";
}

// 🔍 SEARCH
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("searchInput");

  if (!search) return;

  search.addEventListener("input", async function () {
    const q = this.value;

    if (!q) {
      showMovies(movies);
      return;
    }

    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${q}`);
    const data = await res.json();

    showMovies(data.results || []);
  });
});

// 🚀 INIT
fetchMovies();

// GLOBAL (important for HTML button)
window.viewAll = viewAll;
window.closeModal = closeModal;
