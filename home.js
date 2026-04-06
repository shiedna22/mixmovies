const API_KEY = "43c2413701b5c752d07b62acf8e57736";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// 🔥 GOOGLE DRIVE DRAMA
const dramas = [
  {
    title: "Love Story 😭",
    episodes: [
      {
        title: "Part 1",
        video: "https://drive.google.com/file/d/1ABCxyz/preview"
      },
      {
        title: "Part 2",
        video: "https://drive.google.com/file/d/2ABCxyz/preview"
      },
      {
        title: "Part 3",
        video: "https://drive.google.com/file/d/3ABCxyz/preview"
      }
    ]
  }
];

let currentEmbed = "";
let currentDrama = null;
let currentEpisode = 0;

// 🎬 FETCH MOVIES
async function fetchMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
  );
  const data = await res.json();
  return data.results;
}

// 🎬 DISPLAY MOVIES
function displayMovies(movies) {
  const container = document.getElementById("movies-list");

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG_URL + movie.poster_path;

    img.onclick = () => openMovie(movie);

    container.appendChild(img);
  });
}

// 🎬 OPEN MOVIE
function openMovie(movie) {
  currentEmbed = `https://vidsrc.to/embed/movie/${movie.id}`;

  document.getElementById("modal-title").textContent = movie.title;

  document.getElementById("modal-video").style.display = "none";
  document.getElementById("playNow").style.display = "block";

  document.getElementById("modal").style.display = "flex";
}

// 🎬 DISPLAY DRAMA
function displayDrama() {
  const container = document.getElementById("drama-list");

  dramas.forEach(drama => {
    const btn = document.createElement("button");

    btn.textContent = drama.title;
    btn.style.padding = "10px";
    btn.style.margin = "10px";

    btn.onclick = () => playDrama(drama, 0);

    container.appendChild(btn);
  });
}

// 🎬 PLAY DRAMA
function playDrama(drama, index) {
  currentDrama = drama;
  currentEpisode = index;

  const ep = drama.episodes[index];

  currentEmbed = ep.video;

  document.getElementById("modal-title").textContent =
    drama.title + " - " + ep.title;

  document.getElementById("modal-video").style.display = "none";
  document.getElementById("playNow").style.display = "block";

  document.getElementById("modal").style.display = "flex";
}

// ▶ PLAY BUTTON
document.getElementById("playNow").onclick = () => {
  document.getElementById("modal-video").src = currentEmbed;
  document.getElementById("modal-video").style.display = "block";
  document.getElementById("playNow").style.display = "none";

  // 🔥 AUTO NEXT
  setTimeout(() => {
    if (!currentDrama) return;

    currentEpisode++;

    if (currentEpisode < currentDrama.episodes.length) {
      playDrama(currentDrama, currentEpisode);
    }
  }, 30000);
};

// ❌ CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

// 🚀 INIT
async function init() {
  const movies = await fetchMovies();
  displayMovies(movies);

  displayDrama();
}

init();
