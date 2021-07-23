import '../css/style.css';
import Notiflix from 'notiflix';
import _debounce from 'lodash.debounce';
import getRefs from './get-refs';
import NewsApiService from './api-service';
import photoCardTpl from '../templates/photo-card-tpl.hbs';

const refs = getRefs();
const newsApiService = new NewsApiService();
const backgroundBody = 'https://st.depositphotos.com/2486211/3843/i/950/depositphotos_38431613-stock-photo-water-drops.jpg';
const DEBOUNCE_DELAY = 300;

newsApiService.randomBackgroundBody(backgroundBody);

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
window.addEventListener('scroll', _debounce(onInfinityScroll, DEBOUNCE_DELAY));


function onSearch(ev) {
    ev.preventDefault();

    newsApiService.query = ev.currentTarget.elements.searchQuery.value;
    
    if (newsApiService.query === '') {
        clearHitsContainer();
        Notiflix.Notify.failure("Sorry, you need to enter something into the search.");
        return
    }

    newsApiService.resetPage();
    console.log(newsApiService.page)
    newsApiService.fetchCountries()
        .then(hits => {
            console.log(newsApiService.valueSearch)
            console.log(hits.length)
            if (hits.length !== 0) {
                Notiflix.Notify.info(`Hooray! We found ${newsApiService.totalHits} images.`);
            }
            else {
                throw Error("Sorry, there are no images matching your search query. Please try again.");
            }
            if (newsApiService.totalHits < newsApiService.page * newsApiService.perPage) {
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            }
            newsApiService.randomUrlImg(hits);
            clearHitsContainer();
            appendHits(hits);
            newsApiService.lightbox();
            console.log(hits.length)

        })
        .catch(onFetchError);
    
    
}

function onFetchError(error) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    clearHitsContainer();
    newsApiService.randomBackgroundBody(backgroundBody);
}

function onLoadMore() {
    newsApiService.fetchCountries().then(hits => {
        appendHits(hits);
        smoothScroll()
    });
    
}

function smoothScroll() {
    const cardHeight = refs.hitsContainer.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight.height * 3,
        behavior: 'smooth',
    });
}

function appendHits(hits) {
    refs.hitsContainer.insertAdjacentHTML('beforeend', photoCardTpl(hits));
    newsApiService.lightbox().refresh();
}

function clearHitsContainer() {
    refs.hitsContainer.innerHTML = '';
}

function onInfinityScroll() {
    const contentHeight = refs.hitsContainer.offsetHeight;      // 1) высота блока контента вместе с границами
    const yOffset       = window.pageYOffset;      // 2) текущее положение скролбара
    const window_height = window.innerHeight;      // 3) высота внутренней области окна документа
    const y             = yOffset + window_height;
    // если пользователь достиг конца
    if(y >= contentHeight){
        //загружаем новое содержимое в элемент
        onLoadMore();
        console.log(contentHeight)
    }
}