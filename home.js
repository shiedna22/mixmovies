const API_KEY = '43c2413701b5c752d07b62acf8e57736';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentItem;

// FETCH
async function fetchTrending(type){
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// ANIME
async function fetchAnime(){
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results.filter(i => i.original_language === "ja");
}

// DISPLAY
function displayList(items, containerId){
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(item=>{
    if(!item.poster_path) return;

    const div = document.createElement("div");

    const img = document.createElement("img");
    img.src = IMG_URL + item.poster_path;
    img.onclick = ()=>openPlayer(item);

    const fav = document.createElement("button");
    fav.textContent="❤️";

    fav.onclick=(e)=>{
      e.stopPropagation();
      localStorage.setItem(item.id, JSON.stringify(item));
      alert("Saved ❤️");
    };

    div.appendChild(img);
    div.appendChild(fav);
    container.appendChild(div);
  });
}

// PLAYER
function openPlayer(item){
  currentItem=item;
  const type=item.title?"movie":"tv";

  document.getElementById("modal-title").textContent=item.title||item.name||"No Title";
  document.getElementById("modal-video").src=
    `https://vidsrc.cc/v2/embed/${type}/${item.id}`;

  document.getElementById("modal").style.display="flex";
}

// CLOSE
function closeModal(){
  document.getElementById("modal").style.display="none";
  document.getElementById("modal-video").src="";
}

// INIT
async function init(){
  const movies=await fetchTrending("movie");
  const tv=await fetchTrending("tv");
  const anime=await fetchAnime();

  let index=0;
  const banner=document.getElementById("banner");

  function updateBanner(movie){
    if(!movie.backdrop_path) return;

    banner.style.backgroundImage=`url(${IMG_URL}${movie.backdrop_path})`;
    document.getElementById("banner-title").textContent=movie.title||movie.name;
    document.getElementById("watchBtn").onclick=()=>openPlayer(movie);
  }

  const first=movies.find(m=>m.backdrop_path);
  if(first) updateBanner(first);

  // AUTO SLIDE
  setInterval(()=>{
    banner.style.opacity=0;

    setTimeout(()=>{
      const movie=movies[index%movies.length];
      updateBanner(movie);
      banner.style.opacity=1;
      index++;
    },300);

  },5000);

  displayList(movies,"movies-list");
  displayList(tv,"tvshows-list");
  displayList(anime,"anime-list");
}

init();

// SEARCH
document.getElementById("searchInput").addEventListener("input",async function(){
  const q=this.value;
  const sections=document.querySelectorAll("h2,.list");

  if(!q){
    document.getElementById("search-results").innerHTML="";
    sections.forEach(e=>e.style.display="block");
    return;
  }

  sections.forEach(e=>e.style.display="none");

  const res=await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${q}`);
  const data=await res.json();

  const container=document.getElementById("search-results");
  container.innerHTML="";

  data.results.forEach(item=>{
    if(!item.poster_path) return;

    const img=document.createElement("img");
    img.src=IMG_URL+item.poster_path;
    img.onclick=()=>openPlayer(item);

    container.appendChild(img);
  });
});
