const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

let movies = [];

// 🎭 DRAMA (WORKING)
const dramas = [
  {
    title: "Prison Born Avenger 🔥",
    image: "https://i.imgur.com/8Km9tLL.jpg",
    video: "https://www.dailymotion.com/embed/video/xa3wpbk"
  }
];

// FETCH
async function fetchData(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// DISPLAY LIST
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

  dramas.forEach(d => {
    const img = document.createElement("img");
    img.src = d.image;

    img.onclick = () => {
  document.getElementById("modal-title").innerText = drama.title;

  const player = document.getElementById("modal-video");

  // 👉 ADD CLASS (portrait mode)
  player.classList.add("portrait");

  player.src = drama.video + "?autoplay=1";

  document.getElementById("modal").style.display = "flex";
};

    box.appendChild(img);
  });
}

// PLAYER
function openPlayer(item) {
  const player = document.getElementById("modal-video");
player.classList.remove("portrait");
  
  const type = item.title ? "movie" : "tv";

  document.getElementById("modal-title").innerText =
    item.title || item.name;

  if (type === "movie") {
    document.getElementById("modal-video").src =
      `https://vidsrc.cc/v2/embed/movie/${item.id}`;
  } else {
    document.getElementById("modal-video").src =
      `https://vidsrc.cc/v2/embed/tv/${item.id}/1/1`;
  }

  document.getElementById("modal").style.display = "flex";
}

// CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
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

  // 🎬 BANNER FIXED
  const valid = movies.filter(m => m.backdrop_path);
  const m = valid[Math.floor(Math.random() * valid.length)];

  document.getElementById("banner").style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

  document.getElementById("banner-title").innerText = m.title;
  document.getElementById("watchBtn").onclick = () => openPlayer(m);
}

init();
