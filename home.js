const API_KEY = '43c2413701b5c752d07b62acf8e57736';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// 🎬 GOOGLE DRIVE VIDEO
const driveVideoId = "1b4lWCUHE7EQS3HXqBrGSQoT9r1jgW7bq";

let currentEmbed = "";

// FETCH
async function fetchData(url){
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

// DISPLAY FIX 🔥
function displayList(items, id){
  const container = document.getElementById(id);
  container.innerHTML = "";

  items.slice(0,20).forEach(item=>{
    if(!item.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG_URL + item.poster_path;

    img.onclick = ()=>{
      openPlayer(item);
    };

    container.appendChild(img);
  });
}

// PLAYER
function openPlayer(item){
  document.getElementById("modal").style.display="flex";

  document.getElementById("modal-title").innerText =
    item.title || item.name;

  currentEmbed = item.title
    ? `https://vidsrc.to/embed/movie/${item.id}`
    : `https://vidsrc.to/embed/tv/${item.id}/1/1`;

  resetPlayer();
}

// 🎬 DRIVE MOVIE
function openDriveMovie(){
  document.getElementById("modal").style.display="flex";
  document.getElementById("modal-title").innerText="🎬 Full Drama Movie";

  currentEmbed = `https://drive.google.com/file/d/${driveVideoId}/preview`;

  resetPlayer();
}

// RESET
function resetPlayer(){
  document.getElementById("modal-video").style.display="none";
  document.getElementById("modal-video").src="";
  document.getElementById("playNow").style.display="block";
}

// CLOSE
function closeModal(){
  document.getElementById("modal").style.display="none";
  document.getElementById("modal-video").src="";
}

// PLAY
document.getElementById("playNow").onclick = ()=>{
  const iframe = document.getElementById("modal-video");

  iframe.src = currentEmbed;
  iframe.style.display="block";

  document.getElementById("playNow").style.display="none";
};

// INIT
async function init(){
  const movies = await fetchData(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const tv = await fetchData(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const anime = tv.filter(i=>i.original_language==="ja");

  displayList(movies,"movies-list");
  displayList(tv,"tvshows-list");
  displayList(anime,"anime-list");

  // banner button = drive movie
  document.getElementById("watchBtn").onclick = openDriveMovie;
}

init();
