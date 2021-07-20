const KEY = '22580473-9722fdac11ed5197610aea928';
const BASE_URL = 'https://pixabay.com/';
const param = '&image_type=photo&orientation=horizontal&safesearch=true';
const perPage = 40;

export default class NewsApiService{
    constructor() {
        this.valueSearch = '';
        this.page = 1;
    }
    
    fetchCountries() {
        const url = `${BASE_URL}api/?key=${KEY}&q=${this.valueSearch}${param}&page=${this.page}&per_page=${perPage}`;
        return fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.incrementPage();
                this.randomBackgroundBody(data.hits);
                return data.hits;
            })
    }

    get query() {
        return this.valueSearch;
    }

    set query(newValue) {
        this.valueSearch = newValue;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    randomBackgroundBody(hits) {
        const randomIndexHits = Math.floor(Math.random() * perPage);
        const randomUrlHit = hits[randomIndexHits].largeImageURL;
        document.body.style.backgroundImage = `url(${randomUrlHit})`
    }
}