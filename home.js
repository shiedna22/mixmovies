const API_KEY = '43c2413701b5c752d07b62acf8e57736';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let movies = [];

// 🎭 DRAMA (Dailymotion)
const dramas = [
  {
    title: "Prison Born Avenger 🔥",
    image: "https://i.imgur.com/8Km9tLL.jpg", // working image
    video: "https://www.dailymotion.com/embed/video/xa3qsp2"
  }
];

// FETCH
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// 🔥 ANIME
async function fetchAnime() {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results.filter(i => i.original_language === "ja");
}

// DISPLAY
function displayList(items, id) {
  const container = document.getElementById(id);
  container.innerHTML = "";

  items.forEach(item => {
    if (!item.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG_URL + item.poster_path;

    img.onclick = () => openPlayer(item);

    container.appendChild(img);
  });
}

// 🎭 DISPLAY DRAMA
function displayDramas() {
  const container = document.getElementById("drama-list");
  if (!container) return;

  container.innerHTML = "";

  dramas.forEach(drama => {
    const img = document.createElement("img");
    img.src = drama.image;

    img.onclick = () => {
      document.getElementById("modal-title").textContent = drama.title;
      document.getElementById("modal-video").src =
        drama.video + "?autoplay=1";

      document.getElementById("season-container").innerHTML = "";
      document.getElementById("episodes").innerHTML = "";

      document.getElementById("modal").style.display = "flex";
    };

    container.appendChild(img);
  });
}

// PLAYER
async function openPlayer(item) {
  const type = item.title ? "movie" : "tv";

  document.getElementById("modal-title").textContent =
    item.title || item.name;

  if (type === "movie") {
    document.getElementById("modal-video").src =
      `https://vidsrc.cc/v2/embed/movie/${item.id}`;

    document.getElementById("season-container").innerHTML = "";
    document.getElementById("episodes").innerHTML = "";
  } else {
    document.getElementById("modal-video").src =
      `https://vidsrc.cc/v2/embed/tv/${item.id}/1/1`;

    loadSeasons(item.id);
  }

  document.getElementById("modal").style.display = "flex";
}

// SEASONS
async function loadSeasons(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById("season-container");
  container.innerHTML = "";

  data.seasons.forEach(s => {
    if (s.season_number === 0) return;

    const btn = document.createElement("button");
    btn.textContent = "Season " + s.season_number;

    btn.onclick = () => loadEpisodes(id, s.season_number);

    container.appendChild(btn);
  });

  loadEpisodes(id, 1);
}

// EPISODES
async function loadEpisodes(id, season) {
  const res = await fetch(`${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById("episodes");
  container.innerHTML = "";

  data.episodes.forEach(ep => {
    const btn = document.createElement("button");
    btn.textContent = "Ep " + ep.episode_number;

    btn.onclick = () => {
      document.getElementById("modal-video").src =
        `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${ep.episode_number}`;
    };

    container.appendChild(btn);
  });
}

// CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

// SEARCH
document.getElementById("searchInput").addEventListener("input", async function() {
  const q = this.value;

  if (!q) {
    document.getElementById("search-results").innerHTML = "";
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${q}`);
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

// 🎬 INIT (WITH BANNER FIX)
async function init() {
  movies = await fetchTrending("movie");
  const tv = await fetchTrending("tv");
  const anime = await fetchAnime();

  displayList(movies, "movies-list");
  displayList(tv, "tvshows-list");
  displayList(anime, "anime-list");
  displayDramas(); // ✅ DRAMA

  // 🎯 BANNER (FIXED)
  const m = movies[Math.floor(Math.random() * movies.length)];

  if (m && m.backdrop_path) {
    document.getElementById("banner").style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

    document.getElementById("banner-title").textContent = m.title;

    document.getElementById("watchBtn").onclick = () => openPlayer(m);
  }
}

init();
