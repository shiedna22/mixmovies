const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

let movies = [];
let tvshows = [];
let anime = [];

let isViewAll = false;
let bannerTimer;

/* 🎬 FETCH */
async function fetchData(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
}

/* 🎬 CREATE CARD */
function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = item.poster_path
    ? IMG + item.poster_path
    : "https://via.placeholder.com/150x220?text=No+Image";

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
    ? item.overview.slice(0, 50) + "..."
    : "No description";

  overlay.append(title, rating, desc);
  card.append(img, overlay);

  card.onclick = () => openPlayer(item);

  return card;
}

/* 🎬 SHOW */
function show(list, id) {
  const box = document.getElementById(id);
  if (!box) return;

  box.innerHTML = "";

  list.forEach(i => {
    if (!i.poster_path) return;
    box.appendChild(createCard(i));
  });
}

/* ▶ PLAYER */
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

/* ❌ CLOSE */
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

/* 🎬 BANNER FIX */
function startBanner() {
  const valid = movies.filter(m => m.backdrop_path);
  if (valid.length === 0) return;

  clearInterval(bannerTimer);

  bannerTimer = setInterval(() => {
    const m = valid[Math.floor(Math.random() * valid.length)];

    document.getElementById("banner").style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

    document.getElementById("banner-title").innerText = m.title;
    document.getElementById("watchBtn").onclick = () => openPlayer(m);
  }, 4000);
}

/* 🔥 VIEW ALL */
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

/* 🔥 LIVE + SMART SEARCH + SUGGESTIONS (FIXED FOR YOUR SYSTEM) */

function similarity(a,b){
let longer=a.length>b.length?a:b;
let shorter=a.length>b.length?b:a;
let same=0;
for(let i=0;i<shorter.length;i++){
if(longer.includes(shorter[i])) same++;
}
return same/longer.length;
}

document.addEventListener("DOMContentLoaded", () => {

const search = document.getElementById("searchInput");
if(!search) return;

/* combine all */
function getAll(){
return [...movies,...tvshows,...anime];
}

search.addEventListener("input",(e)=>{
const value=e.target.value.toLowerCase().trim();

const suggestBox=document.getElementById("suggestions");

/* reset */
if(value===""){
show(movies,"movies-list");
show(tvshows,"tvshows-list");
show(anime,"anime-list");

if(suggestBox) suggestBox.style.display="none";
return;
}

const all = getAll();

const results = all.filter(m=>{
let t=(m.title||m.name||"").toLowerCase();
return t.includes(value) || similarity(t,value)>0.5;
});

/* show results */
show(results,"movies-list");

/* clear other rows */
document.getElementById("tvshows-list").innerHTML="";
document.getElementById("anime-list").innerHTML="";

/* 🔽 SUGGESTIONS */
if(!suggestBox) return;

suggestBox.innerHTML="";
suggestBox.style.display="block";

results.slice(0,5).forEach(i=>{
let t=i.title||i.name;

let div=document.createElement("div");

div.innerHTML=t.replace(
new RegExp(value,"gi"),
m=>`<mark>${m}</mark>`
);

div.onclick=()=>{
search.value=t;
suggestBox.style.display="none";
show([i],"movies-list");
};

suggestBox.appendChild(div);
});

});

});


/* 🎮 ULTRA GESTURES (SAFE VERSION) */
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  if (!overlay) return;

  let lastTap = 0;
  let startX = 0;
  let startY = 0;

  overlay.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  overlay.addEventListener("touchend", (e) => {
    let now = Date.now();
    let x = e.changedTouches[0].clientX;

    if (now - lastTap < 300) {
      if (x < window.innerWidth / 2) {
        showIcon("⏪ 10s");
      } else {
        showIcon("⏩ 10s");
      }
    }
    lastTap = now;
  });

  overlay.addEventListener("touchmove", (e) => {
    let y = e.touches[0].clientY;
    let dy = y - startY;

    if (startX < window.innerWidth / 2) {
      document.body.style.filter = `brightness(${1 - dy / 300})`;
    } else {
      showIcon("🔊");
    }
  });
});

/* ICON */
function showIcon(txt) {
  const el = document.getElementById("centerIcon");
  if (!el) return;

  el.innerText = txt;
  el.style.opacity = 1;

  setTimeout(() => {
    el.style.opacity = 0;
  }, 500);
}

/* 🎤 VOICE SEARCH */
function startVoice(){
if(!('webkitSpeechRecognition' in window)){
alert("Voice not supported");
return;
}

let rec=new webkitSpeechRecognition();

rec.onresult=(e)=>{
document.getElementById("searchInput").value=e.results[0][0].transcript;
document.getElementById("searchInput").dispatchEvent(new Event("input"));
};

rec.start();
}

/* 🚀 INIT */
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

/* GLOBAL */
window.viewAll = viewAll;
window.closeModal = closeModal;
