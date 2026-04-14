<script>
const API="https://api.themoviedb.org/3";
const KEY="43c2413701b5c752d07b62acf8e57736";
const IMG="https://image.tmdb.org/t/p/w500";

let current=null,currentType="movie";
let continueList=JSON.parse(localStorage.getItem("continue"))||[];

/* SAFE FETCH */
async function safeFetch(url){
try{
const res=await fetch(url);
const data=await res.json();
return data.results || [];
}catch(e){
console.log("Fetch error:",e);
return [];
}
}

/* CARD */
function createCard(i,type){
const c=document.createElement("div");
c.className="card";

c.innerHTML=`
<img src="${i.poster_path?IMG+i.poster_path:'https://via.placeholder.com/150x220?text=No+Image'}">
<div>${i.title||i.name||"No title"}</div>
`;

c.onclick=()=>openPreview(i,type);
return c;
}

/* SHOW */
function show(list,id,type){
const box=document.getElementById(id);
box.innerHTML="";

if(list.length===0){
box.innerHTML="<p style='padding:10px'>No data available</p>";
return;
}

list.forEach(i=>{
if(!i.poster_path)return;
box.appendChild(createCard(i,type));
});
}

/* HERO FIX */
function setHero(m){
if(!m)return;

document.getElementById("hero-title").innerText=m.title||m.name||"No Title";
document.getElementById("hero-desc").innerText=(m.overview||"No description");

if(m.backdrop_path){
document.getElementById("hero").style.backgroundImage=
`url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;
}
}

/* PREVIEW */
async function openPreview(i,type){
current=i;currentType=type;

preview.style.display="block";
previewTitle.innerText=i.title||i.name;
previewDesc.innerText=i.overview||"No description";

/* trailer safe */
try{
const res=await fetch(`${API}/${type}/${i.id}/videos?api_key=${KEY}`);
const data=await res.json();
const t=data.results.find(v=>v.site==="YouTube");

previewTrailer.src = t
?`https://www.youtube.com/embed/${t.key}`
:"";
}catch{
previewTrailer.src="";
}
}

function closePreview(){preview.style.display="none";}

/* PLAYER */
function playNow(){
openPlayer(current);
closePreview();
}

function openPlayer(i){
if(!i)return;

full.src = currentType==="movie"
?`https://vidsrc.cc/v2/embed/movie/${i.id}`
:`https://vidsrc.cc/v2/embed/tv/${i.id}/1/1`;

player.style.display="block";

/* save continue */
continueList.unshift(i);
localStorage.setItem("continue",JSON.stringify(continueList));
renderContinue();
}

/* FULLSCREEN FIX */
function goFull(){
const iframe=document.getElementById("full");
if(iframe.requestFullscreen){
iframe.requestFullscreen();
}else if(iframe.webkitRequestFullscreen){
iframe.webkitRequestFullscreen();
}
}

function closePlayer(){
player.style.display="none";
full.src="";
}

/* CONTINUE */
function renderContinue(){
continue.innerHTML="";
continueList.slice(0,10).forEach(i=>{
continue.appendChild(createCard(i,"movie"));
});
}

/* SEARCH FIX */
let d;
search.oninput=e=>{
clearTimeout(d);
d=setTimeout(async()=>{
const v=e.target.value.trim();

if(!v){
searchRow.style.display="none";
return;
}

const res=await safeFetch(`${API}/search/multi?api_key=${KEY}&query=${v}`);

searchRow.style.display="block";
searchResults.innerHTML="";

res.forEach(i=>{
if(!i.poster_path)return;
searchResults.appendChild(createCard(i,i.media_type));
});
},400);
};

/* INIT FIX */
async function init(){
const trending=await safeFetch(`${API}/trending/all/week?api_key=${KEY}`);
const movies=await safeFetch(`${API}/movie/popular?api_key=${KEY}`);
const tv=await safeFetch(`${API}/tv/popular?api_key=${KEY}`);

show(trending,"trending","movie");
show(movies,"movies","movie");
show(tv,"tv","tv");

setHero(trending[0] || movies[0]);
renderContinue();
}

init();
</script>
