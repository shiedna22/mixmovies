const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

let movies = [];

// DRAMA
const dramas = [
  {
    title: "Batang Martial Arts 🔥",
    image: "https://i.imgur.com/8Km9tLL.jpg",
    video: "https://drive.google.com/file/d/1b4lWCUHE7EQS3HXqBrGSQoT9r1jgW7bq/preview"
  }
];

// FETCH
async function fetchData(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// SAVE LAST
function saveLast(video, title, image) {
  localStorage.setItem("lastVideo", video);
  localStorage.setItem("lastTitle", title);
  localStorage.setItem("lastImage", image);
}

// CONTINUE WATCHING
function loadContinueWatching() {
  const video = localStorage.getItem("lastVideo");
  const title = localStorage.getItem("lastTitle");
  let image = localStorage.getItem("lastImage");

  const box = document.getElementById("continue-list");
  box.innerHTML = "";

  if (!video) return;

  // 🔥 AUTO FIX OLD DATA
  if (!image) {
    image = "https://i.imgur.com/8Km9tLL.jpg";
  }

  const card = document.createElement("div");
  card.className = "continue-card";

  const img = document.createElement("img");
  img.src = image;

  img.onclick = () => {
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-video").src = video;
    document.getElementById("modal").style.display = "flex";
  };

  const play = document.createElement("div");
  play.className = "play-icon";
  play.innerText = "▶";

  const label = document.createElement("p");
  label.innerText = title;

  card.appendChild(img);
  card.appendChild(play);
  card.appendChild(label);

  box.appendChild(card);
}

// FAVORITES
function loadFavorites() {
  const likes = JSON.parse(localStorage.getItem("likes")) || [];
  const box = document.getElementById("favorites-list");

  box.innerHTML = "";

  dramas.forEach(d => {
    if (likes.includes(d.title)) {
      const img = document.createElement("img");
      img.src = d.image;

      img.onclick = () => {
        document.getElementById("modal-title").innerText = d.title;
        document.getElementById("modal-video").src = d.video;
        document.getElementById("modal").style.display = "flex";
      };

      box.appendChild(img);
    }
  });
}

// DISPLAY
function show(items, id) {
  const box = document.getElementById(id);
  box.innerHTML = "";

  items.forEach(i => {
    if (!i.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG + i.poster_path;

    img.onclick = () => openPlayer(i);

    box.appendChild(img);
  });
}

// DRAMA
function showDrama() {
  const box = document.getElementById("drama-list");
  box.innerHTML = "";

  dramas.forEach(d => {
    const img = document.createElement("img");
    img.src = d.image;

    img.onclick = () => {
  const player = document.getElementById("modal-video");

  player.classList.add("portrait");
  player.src = d.video;

  document.getElementById("modal-title").innerText = d.title;
  document.getElementById("modal").style.display = "flex";

  // 🔥 FIXED
  saveLast(d.video, d.title, d.image);
  loadContinueWatching();
};

    box.appendChild(img);
  });
}

// PLAYER
function openPlayer(item) {
  const player = document.getElementById("modal-video");
  player.classList.remove("portrait");

  const title = item.title || item.name;
  const image = IMG + item.poster_path;

  const video = item.title
    ? `https://vidsrc.cc/v2/embed/movie/${item.id}`
    : `https://vidsrc.cc/v2/embed/tv/${item.id}/1/1`;

  document.getElementById("modal-title").innerText = title;
  player.src = video;
  document.getElementById("modal").style.display = "flex";

  // 🔥 FIXED
  saveLast(video, title, image);
  loadContinueWatching();
}

// CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

// BANNER
function startBanner() {
  const valid = movies.filter(m => m.backdrop_path);

  setInterval(() => {
    const m = valid[Math.floor(Math.random() * valid.length)];

    document.getElementById("banner").style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

    document.getElementById("banner-title").innerText = m.title;
    document.getElementById("watchBtn").onclick = () => openPlayer(m);
  }, 3000);
}

// SEARCH
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("searchInput");

  search.addEventListener("input", async function () {
    const q = this.value;
    if (!q) return;

    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${q}`);
    const data = await res.json();

    const container = document.getElementById("movies-list");
    container.innerHTML = "";

    data.results.forEach(item => {
      if (item.poster_path) {
        const img = document.createElement("img");
        img.src = IMG + item.poster_path;

        img.onclick = () => openPlayer(item);

        container.appendChild(img);
      }
    });
  });
});

// INIT
async function init() {
  movies = await fetchData("movie");
  const tv = await fetchData("tv");
  const anime = tv.filter(x => x.original_language === "ja");

  show(movies, "movies-list");
  show(tv, "tvshows-list");
  show(anime, "anime-list");
  showDrama();
  loadFavorites();
  loadContinueWatching();
  startBanner();
}

init();
