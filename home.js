const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

let movies = [];
let currentIndex = 0;

// 🎭 DRAMA
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

// 🎬 SAVE LAST
function saveLast(video, title) {
  localStorage.setItem("lastVideo", video);
  localStorage.setItem("lastTitle", title);
}

// ▶ CONTINUE
function loadLast() {
  const video = localStorage.getItem("lastVideo");
  const title = localStorage.getItem("lastTitle");

  if (!video) return;

  const box = document.getElementById("movies-list");

  const btn = document.createElement("button");
  btn.innerText = "▶ Continue: " + title;

  btn.onclick = () => {
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-video").src = video;
    document.getElementById("modal").style.display = "flex";
  };

  box.prepend(btn);
}

// ❤️ LIKE
function likeDrama(title) {
  let likes = JSON.parse(localStorage.getItem("likes")) || [];

  if (!likes.includes(title)) {
    likes.push(title);
    localStorage.setItem("likes", JSON.stringify(likes));
    alert("❤️ Added to favorites!");
  }
}

// 📊 HISTORY
function saveHistory(title) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(title);
  localStorage.setItem("history", JSON.stringify(history));
}

// DISPLAY
function show(items, id) {
  const box = document.getElementById(id);
  box.innerHTML = "";

  items.forEach(i => {
    if (!i.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG + i.poster_path;

    img.onmouseover = () => img.style.transform = "scale(1.2)";
    img.onmouseout = () => img.style.transform = "scale(1)";

    img.onclick = () => openPlayer(i);

    box.appendChild(img);
  });
}

// 🎭 DRAMA NORMAL
function showDrama() {
  const box = document.getElementById("drama-list");
  box.innerHTML = "";

  dramas.forEach((d, index) => {
    const img = document.createElement("img");
    img.src = d.image;

    img.onclick = () => {
      const player = document.getElementById("modal-video");

      player.classList.add("portrait");

      player.src = d.video + "?autoplay=1";

      document.getElementById("modal-title").innerText = d.title;
      document.getElementById("modal").style.display = "flex";

      saveLast(player.src, d.title);
      saveHistory(d.title);

      // auto next
      if (dramas[index + 1]) {
        setTimeout(() => {
          player.src = dramas[index + 1].video + "?autoplay=1";
        }, 15000);
      }
    };

    box.appendChild(img);
  });
}

// 🎬 PLAYER
function openPlayer(item) {
  const player = document.getElementById("modal-video");

  player.classList.remove("portrait");

  const title = item.title || item.name;

  document.getElementById("modal-title").innerText = title;

  player.src = item.title
    ? `https://vidsrc.cc/v2/embed/movie/${item.id}`
    : `https://vidsrc.cc/v2/embed/tv/${item.id}/1/1`;

  document.getElementById("modal").style.display = "flex";

  saveLast(player.src, title);
}

// CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

// 🎬 BANNER
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

// 📱 ULTRA MODE
function ultraMode() {
  const container = document.getElementById("ultra-container");
  if (!container) return;

  container.innerHTML = "";

  dramas.forEach(d => {
    const div = document.createElement("div");
    div.className = "ultra-item";

    div.innerHTML = `
      <div class="ultra-video">
        <iframe src="${d.video}?autoplay=1&mute=1"></iframe>
        <div class="ultra-overlay">
          <h3>${d.title}</h3>
          <button onclick="likeDrama('${d.title}')">❤️</button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}

// 🔄 AUTO NEXT ULTRA
function autoNextUltra() {
  const items = document.querySelectorAll(".ultra-item");

  setInterval(() => {
    currentIndex++;
    if (items[currentIndex]) {
      items[currentIndex].scrollIntoView({ behavior: "smooth" });
    }
  }, 15000);
}

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

// INIT
async function init() {
  movies = await fetchData("movie");
  const tv = await fetchData("tv");
  const anime = tv.filter(x => x.original_language === "ja");

  show(movies, "movies-list");
  show(tv, "tvshows-list");
  show(anime, "anime-list");
  showDrama();

  loadLast();
  startBanner();
  ultraMode();
  autoNextUltra();
}

init();
