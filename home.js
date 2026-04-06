const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

let movies = [];

// 🎭 DRAMA (FIXED)
const dramas = [
  {
    title: "Batang Martial Arts 🔥",
    image: "https://i.imgur.com/8Km9tLL.jpg",
    video: "https://drive.google.com/file/d/1b4lWCUHE7EQS3HXqBrGSQoT9r1jgW7bq/preview"
  },
  {
    title: "Chinese Revenge Drama 💔",
    image: "https://i.imgur.com/5tj6S7Ol.jpg",
    video: "https://www.dailymotion.com/embed/video/x7tgczk"
  },
  {
    title: "Love Story Full Movie 😭",
    image: "https://i.imgur.com/3ZQ3Z5h.jpg",
    video: "https://www.dailymotion.com/embed/video/x80abc1"
  }
];

// FETCH
async function fetchData(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
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

// 🎭 DRAMA DISPLAY
function showDrama() {
  const box = document.getElementById("drama-list");
  box.innerHTML = "";

  dramas.forEach(d => {
    const img = document.createElement("img");
    img.src = d.image;

    img.onclick = () => {
      const player = document.getElementById("modal-video");

      // 👉 portrait mode
      player.classList.add("portrait");

      document.getElementById("modal-title").innerText = d.title;
      player.src = d.video + "?autoplay=1";

      document.getElementById("modal").style.display = "flex";
    };

    box.appendChild(img);
  });
}

// PLAYER
function openPlayer(item) {
  const player = document.getElementById("modal-video");

  // 👉 remove portrait for movies
  player.classList.remove("portrait");

  const type = item.title ? "movie" : "tv";

  document.getElementById("modal-title").innerText =
    item.title || item.name;

  if (type === "movie") {
    player.src = `https://vidsrc.cc/v2/embed/movie/${item.id}`;
  } else {
    player.src = `https://vidsrc.cc/v2/embed/tv/${item.id}/1/1`;
  }

  document.getElementById("modal").style.display = "flex";
}

// CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

// 🎬 BANNER AUTO
let bannerIndex = 0;

function startBanner() {
  const valid = movies.filter(m => m.backdrop_path);

  setInterval(() => {
    const m = valid[bannerIndex % valid.length];

    document.getElementById("banner").style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

    document.getElementById("banner-title").innerText = m.title;

    document.getElementById("watchBtn").onclick = () => openPlayer(m);

    bannerIndex++;
  }, 3000);
}

// INIT
async function init() {
  movies = await fetchData("movie");
  const tv = await fetchData("tv");
  const anime = tv.filter(x => x.original_language === "ja");

  show(movies, "movies-list");
  show(tv, "tvshows-list");
  show(anime, "anime-list");
  showDrama();

  startBanner(); // ✅ FIXED
}

init();

// 🔍 SEARCH
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("searchInput");

  if (!search) return;

  search.addEventListener("input", async function () {
    const q = this.value;

    if (!q) return;

    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${q}`);
    const data = await res.json();

    const container = document.getElementById("movies-list");
    container.innerHTML = "";

    data.results.forEach(item => {
      if (!item.poster_path) return;

      const img = document.createElement("img");
      img.src = IMG + item.poster_path;
      img.onclick = () => openPlayer(item);

      container.appendChild(img);
    });
  });
});
