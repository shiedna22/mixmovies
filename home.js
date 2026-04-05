const API_KEY = '43c2413701b5c752d07b62acf8e57736';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentItem = null;

// FETCH TRENDING
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// FETCH ANIME
async function fetchAnime() {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results.filter(i => i.original_language === "ja");
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

// 🎬 OPEN PLAYER
async function openPlayer(item) {
  currentItem = item;

  const type = item.title ? "movie" : "tv";

  let embed;

  if (type === "movie") {
    embed = `https://vidsrc.cc/v2/embed/movie/${item.id}`;
  } else {
    embed = `https://vidsrc.cc/v2/embed/tv/${item.id}/1/1`;
    await loadSeasons(item.id);
  }

  document.getElementById("modal-title").textContent =
    item.title || item.name;

  document.getElementById("modal-video").src = embed;
  document.getElementById("modal").style.display = "flex";
}

// 🎬 LOAD SEASONS
async function loadSeasons(tvId) {
  const res = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById("season-container");
  container.innerHTML = "";

  data.seasons.forEach(season => {
    if (season.season_number === 0) return;

    const btn = document.createElement("button");
    btn.textContent = "Season " + season.season_number;

    btn.onclick = () => loadEpisodes(tvId, season.season_number);

    container.appendChild(btn);
  });

  // auto load season 1
  loadEpisodes(tvId, 1);
}

// 🎬 LOAD EPISODES
async function loadEpisodes(tvId, seasonNumber) {
  const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById("episodes");
  container.innerHTML = "";

  data.episodes.forEach(ep => {
    const btn = document.createElement("button");

    btn.textContent = "Ep " + ep.episode_number;

    btn.onclick = () => {
      document.getElementById("modal-video").src =
        `https://vidsrc.cc/v2/embed/tv/${tvId}/${seasonNumber}/${ep.episode_number}`;
    };

    container.appendChild(btn);
  });
}

// CLOSE MODAL
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
