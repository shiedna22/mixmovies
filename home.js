const API_KEY = '43c2413701b5c752d07b62acf8e57736';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// 🎬 GOOGLE DRIVE VIDEO ID
const driveVideoId = "1b4lWCUHE7EQS3HXqBrGSQoT9r1jgW7bq";

let movies = [];
let currentEmbed = "";
let isDriveVideo = false;

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

// PLAYER
async function openPlayer(item) {
  const type = item.title ? "movie" : "tv";

  document.getElementById("modal-title").textContent =
    item.title || item.name;

  isDriveVideo = false;

  if (type === "movie") {
    currentEmbed = `https://vidsrc.to/embed/movie/${item.id}`;
    document.getElementById("season-container").innerHTML = "";
    document.getElementById("episodes").innerHTML = "";
  } else {
    currentEmbed = `https://vidsrc.to/embed/tv/${item.id}/1/1`;
    loadSeasons(item.id);
  }

  document.getElementById("modal").style.display = "flex";

  // reset
  document.getElementById("modal-video").style.display = "none";
  document.getElementById("modal-video").src = "";
  document.getElementById("playNow").style.display = "block";
}

// 🎬 OPEN GOOGLE DRIVE MOVIE
function openDriveMovie() {
  document.getElementById("modal-title").textContent = "🎬 Full Drama Movie";

  currentEmbed = `https://drive.google.com/file/d/${driveVideoId}/preview`;
  isDriveVideo = true;

  document.getElementById("modal").style.display = "flex";

  document.getElementById("modal-video").style.display = "none";
  document.getElementById("modal-video").src = "";
  document.getElementById("playNow").style.display = "block";

  document.getElementById("season-container").innerHTML = "";
  document.getElementById("episodes").innerHTML = "";
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
  document.getElementById("modal-video").style.display = "none";
  document.getElementById("playNow").style.display = "block";
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

// INIT
async function init() {
  movies = await fetchTrending("movie");
  const tv = await fetchTrending("tv");
  const anime = await fetchAnime();

  displayList(movies, "movies-list");
  displayList(tv, "tvshows-list");
  displayList(anime, "anime-list");

  const m = movies[Math.floor(Math.random() * movies.length)];

  document.getElementById("banner").style.backgroundImage =
    `url(${IMG_URL}${m.backdrop_path})`;

  document.getElementById("banner-title").textContent = m.title;

  // 🔥 IMPORTANT: banner click = GOOGLE DRIVE MOVIE
  document.getElementById("watchBtn").onclick = openDriveMovie;
}

init();

// PLAY BUTTON
document.getElementById("playNow").onclick = () => {
  const iframe = document.getElementById("modal-video");

  iframe.src = currentEmbed;
  iframe.style.display = "block";

  document.getElementById("playNow").style.display = "none";
};
