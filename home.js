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

// ❤️ FAVORITES LOAD
function loadFavorites() {
  const likes = JSON.parse(localStorage.getItem("likes")) || [];
  const box = document.getElementById("favorites-list");
  if (!box) return;

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

// ▶ CONTINUE
function loadLast() {
  const video = localStorage.getItem("lastVideo");
  const title = localStorage.getItem("lastTitle");

  if (!video) return;

  const box = document.getElementById("movies-list");

  const btn = document.createElement("button");
  btn.innerText = "▶ Continue: " + title;

  btn.style.background = "red";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.padding = "8px";
  btn.style.marginRight = "10px";
  btn.style.borderRadius = "5px";

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

// DISPLAY MOVIES
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

// 🎭 DRAMA
function showDrama() {
  const box = document.getElementById("drama-list");
  box.innerHTML = "";

  dramas.forEach(d => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const img = document.createElement("img");
    img.src = d.image;

    img.onclick = () => {
      const player = document.getElementById("modal-video");

      player.classList.add("portrait");
      player.src = d.video;

      document.getElementById("modal-title").innerText = d.title;
      document.getElementById("modal").style.display = "flex";

      saveLast(player.src, d.title);
      saveHistory(d.title);
    };

    const play = document.createElement("span");
    play.innerText = "▶";
    play.style.position = "absolute";
    play.style.top = "50%";
    play.style.left = "50%";
    play.style.transform = "translate(-50%, -50%)";
    play.style.fontSize = "30px";

    wrapper.appendChild(img);
    wrapper.appendChild(play);
    box.appendChild(wrapper);
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

// 📱 ULTRA MODE (FIXED)
function ultraMode() {
  const container = document.getElementById("ultra-container");
  if (!container) return;

  container.innerHTML = "";

  if (dramas.length === 0) {
    container.innerHTML = "<p style='text-align:center'>No videos yet</p>";
    return;
  }

  dramas.forEach(d => {
    const div = document.createElement("div");
    div.className = "ultra-item";

    div.innerHTML = `
  <div class="ultra-video" onclick="playUltra('${d.video}', '${d.title}')">
    
    <img src="${d.image}" style="width:100%; height:100%; object-fit:cover;">
    
    <div class="ultra-overlay">
      <h3>${d.title}</h3>
      <button onclick="likeDrama('${d.title}')">❤️</button>
    </div>

    <div style="
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
      font-size:30px;
    ">▶</div>

  </div>
`;

    container.appendChild(div);
  });
}

function playUltra(video, title) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-video").src = video;
  document.getElementById("modal").style.display = "flex";
}

// 🔄 AUTO NEXT (FIXED)
function autoNextUltra() {
  const items = document.querySelectorAll(".ultra-item");

  if (items.length <= 1) return; // 🔥 FIX NO BUG

  setInterval(() => {
    currentIndex++;

    if (currentIndex >= items.length) {
      currentIndex = 0;
    }

    items[currentIndex].scrollIntoView({ behavior: "smooth" });
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

    const all = [...data.results, ...dramas];

    all.forEach(item => {
      if (item.poster_path || item.image) {
        const img = document.createElement("img");

        img.src = item.poster_path
          ? IMG + item.poster_path
          : item.image;

        img.onclick = () => {
          if (item.video) {
            document.getElementById("modal-title").innerText = item.title;
            document.getElementById("modal-video").src = item.video;
            document.getElementById("modal").style.display = "flex";
          } else {
            openPlayer(item);
          }
        };

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
  loadLast();
  startBanner();
  ultraMode();
  autoNextUltra();
}

init();
