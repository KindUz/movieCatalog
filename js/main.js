const API_KEY = "0035cf73-b1a2-4fe2-82f8-bb11a6cf0c79";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_BEST = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=";
const API_URL_AWAIT = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS&page=";

let currentPage = 1; // начальная страница
let search_flag = false; // флаг поиска

const API_URL_FACT = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

const open_form = document.querySelector(".open__input");
const close_form = document.querySelector(".close__input");
const form_search = document.querySelector(".header__search");
const form_block = document.querySelector(".header__search-input");
const tabs = document.querySelector(".header__tabs");

const popularMovies = document.querySelector(".tabs__top");
const bestMovies = document.querySelector(".tabs__best");
const awaitMovies = document.querySelector(".tabs__await");

popularMovies.addEventListener("click", (e) => {
   e.preventDefault();
   currentPage = 1;
   getMovies(API_URL_POPULAR, currentPage);  
   popularMovies.classList.add("active");
   bestMovies.classList.remove("active"); 
   awaitMovies.classList.remove("active");
   search_flag = false;
});

bestMovies.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = 1;
    getMovies(API_URL_BEST, currentPage);   
    popularMovies.classList.remove("active");
    bestMovies.classList.add("active"); 
    awaitMovies.classList.remove("active");
    search_flag = false;
 });

 awaitMovies.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = 1;
    getMovies(API_URL_AWAIT, currentPage);   
    popularMovies.classList.remove("active");
    bestMovies.classList.remove("active"); 
    awaitMovies.classList.add("active");
    search_flag = false;
 });

open_form.addEventListener("click", function(e) {
    e.preventDefault();
    open_form.style.display = "none";
    form_search.classList.add("active");
    close_form.classList.add("active")
});

close_form.addEventListener("click", function(e) {
    e.preventDefault();
    open_form.style.display = "block";
    form_search.classList.remove("active");
    close_form.classList.remove("active")
    form_search.value = "";
});

getMovies(API_URL_POPULAR, currentPage);

async function getMovies(url, currentPage) {
    const resp = await fetch(url+currentPage, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });
    const respData = await resp.json();



    showMovies(respData);
}

function getClassByRate(vote) {
    if (vote >= 7) return "green";
    if (vote < 7 && vote >= 5.4) return "orange";
    if (vote <5.4) return "red";
}

function showMovies(data) {
    const moviesEl = document.querySelector('.content__movies');
    
    document.querySelector(".content__movies").innerHTML = "";
    
    data.films.forEach((movie) => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("content__movie");

        movieEl.innerHTML = `

        
        <div class="movie__cover-img">
        <img src="${movie.posterUrlPreview}" class="movie__cover" alt="${movie.nameRu}">
        <div class="movie__cover-hover"></div>
    </div>
    <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__year-genre">
            <div class="movie__year">${movie.year}</div>

        <div class="movie__category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
        </div>
        ${movie.rating!=null && movie.rating.slice(-1) != "%" ?
            `
            <div class="movie__average movie__average-${getClassByRate(
                movie.rating
              )}">${movie.rating}</div>
            ` : ''
        }
          
    </div>
        `;
        
        movieEl.addEventListener("click", () => openModal(movie.filmId))
        moviesEl.appendChild(movieEl);
    });
}


const form = document.querySelector(".header__search-input");
const search = document.querySelector(".header__search");
let apiSearchUrl = null;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        currentPage = 1;
        search_flag = true;
        bestMovies.classList.remove("active");
        awaitMovies.classList.remove("active");
        popularMovies.classList.remove("active");
        getMovies(apiSearchUrl, currentPage);
        search.value = "";
    }

})

const API_CURRENT_MOVIE = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const popupEl = document.querySelector(".content__popup");

async function openModal(id) {
    const resp_main = await fetch(API_CURRENT_MOVIE + id, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });
    const respData = await resp_main.json();

    const resp_fact = await fetch(API_URL_FACT + id + "/facts", {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      });
      const respFact = await resp_fact.json();
    
      const randomFact = Math.floor(Math.random() * respFact.items.length);

    popupEl.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");
    popupEl.innerHTML = `
    <div class="popup__item">
    <div class="popup__main">
        <div class="popup__image">
            <img src="${respData.posterUrlPreview}" class="popup__img" alt="">
        </div>
        <div class="popup__close">
            <button class="popup__button-close fa fa-times"></button>
        </div>
        <div class="popup__body">
            <div class="name__movie">
                <h1>Название: </h1>
                <p class="movie__name">${respData.nameRu}</p>
            </div>
            <div class="popup__category">
                <h3>Жанр картины:</h3>
                <div class="genre">${respData.genres.map((genre) => ` ${genre.genre}`)}</div>
            </div>
            <div class="desc__movie">
                <h2>Описание: </h2>
                <p class="description">${respData.description}</p>
            </div>
        </div>
    </div>
    ${
        respFact.items.length > 0 ? `
        
        <div class="popup__facts">
          <h2>Факт №${randomFact+1}</h2>
          <div class="popup__fact">${respFact.items[randomFact].text}</div>
        ` : 
        `
            <div class="popup__facts"><h2>Нет фактов :(</h2></div>
        `
    }
</div>
    `
    const btnClose = document.querySelector(".popup__button-close");
    btnClose.addEventListener("click", () => closeModal());
  }
  
  function closeModal() {
    popupEl.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
  }
  
  window.addEventListener("click", (e) => {
    if (e.target === popupEl) {
      closeModal();
    }
  })
  
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      closeModal();
    }
  })





  // Пагинация

const pagination = document.querySelector('.pagination');
const prevBtn = pagination.querySelector('.prev-btn');
const nextBtn = pagination.querySelector('.next-btn');
const pages = pagination.querySelector('.pages');


let totalPages = 0; // общее количество страниц

function updatePageNumbers() {
    // очищаем список кнопок с номерами страниц
    pages.innerHTML = '';
  
    // генерируем кнопки с номерами страниц
    
}

function handleNextClick() {
    currentPage++;
    updateButtons();
}

function handlePrevClick() {
    currentPage--;
    if (currentPage < 1) {
      currentPage = 1;
    }
    updateButtons();
  }

  function handlePageClick(e) {
    if (e.target.tagName === 'BUTTON') {
      currentPage = parseInt(e.target.textContent);
      updateButtons();
    }
  }

  function updateButtons() {
    document.documentElement.scrollTop = 0;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    updatePageNumbers();
    if (popularMovies.classList.contains("active")) {
        getMovies(API_URL_POPULAR, currentPage);
    }
    if (bestMovies.classList.contains("active")) {
        getMovies(API_URL_BEST, currentPage);
    }
    if (awaitMovies.classList.contains("active")) {
        getMovies(API_URL_UPCOMING, currentPage);
    }

    if (search_flag === true) {
        console.log(currentPage);
        console.log(apiSearchUrl);
        getMovies(apiSearchUrl, currentPage);
    }



  }

  
  // добавляем обработчики кликов на кнопки пагинации
  prevBtn.addEventListener('click', handlePrevClick);
  nextBtn.addEventListener('click', handleNextClick);
  pages.addEventListener('click', handlePageClick);

