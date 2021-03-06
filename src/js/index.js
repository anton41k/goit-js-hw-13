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
newsApiService.lightbox();

refs.searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', _debounce(onInfinityScroll, DEBOUNCE_DELAY));


function onSearch(ev) {
    ev.preventDefault();

    newsApiService.query = ev.currentTarget.elements.searchQuery.value.trim();
    
    if (newsApiService.query === '') {
        clearHitsContainer();
        Notiflix.Notify.failure("Sorry, you need to enter something into the search.");
        return
    }
    scrollTo(0, 0)
    newsApiService.resetPage();
    newsApiService.fetchCountries()
        .then(hits => {console.log(hits)
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
        const cardHeight = refs.hitsContainer.firstElementChild.getBoundingClientRect().height;
        smoothScroll(cardHeight)
    });
    
}

function smoothScroll(cardHeight) {
    window.scrollBy({
        top: cardHeight * 3,
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
    const contentHeight = refs.hitsContainer.offsetHeight;      // 1) ???????????? ?????????? ???????????????? ???????????? ?? ??????????????????
    const yOffset       = window.pageYOffset;      // 2) ?????????????? ?????????????????? ??????????????????
    const window_height = window.innerHeight;      // 3) ???????????? ???????????????????? ?????????????? ???????? ??????????????????
    const y             = yOffset + window_height;
    // ???????? ???????????????????????? ???????????? ??????????
    if(y >= contentHeight){
        //?????????????????? ?????????? ???????????????????? ?? ??????????????
        onLoadMore();
    }
}