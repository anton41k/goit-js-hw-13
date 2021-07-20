import '../css/style.css';
import Notiflix from 'notiflix';
import getRefs from './get-refs';
import NewsApiService from './api-service';
import photoCardTpl from '../templates/photo-card-tpl.hbs';

const refs = getRefs();
const newsApiService = new NewsApiService()

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);


function onSearch(ev) {
    ev.preventDefault();

    newsApiService.query = ev.currentTarget.elements.searchQuery.value;
    
    if (newsApiService.query === '') {
        toggleClass(document.body, 'default-background');
        clearHitsContainer();
        Notiflix.Notify.failure("Sorry, you need to enter something into the search.");
        return
    }

    newsApiService.resetPage();
    newsApiService.fetchCountries()
        .then(hits => {console.log(hits)
            if (hits.length === 0) {
                throw Error("Sorry, there are no images matching your search query. Please try again.");
            }
            clearHitsContainer();
            appendHits(hits);
            toggleClass(document.body, 'default-background');
        })
        .catch(onFetchError);
    
    
}

function onFetchError(error) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    clearHitsContainer()
    //Notiflix.Loading.remove();
}

function onLoadMore() {
    newsApiService.fetchCountries().then(appendHits);
}

function appendHits(hits) {
    refs.hitsContainer.insertAdjacentHTML('beforeend', photoCardTpl(hits))
}

function clearHitsContainer() {
    refs.hitsContainer.innerHTML = '';
}

function toggleClass(obj, cl) {
    obj.classList.toggle(cl);
}
