import SimpleLightbox from "simplelightbox";

const KEY = '22580473-9722fdac11ed5197610aea928';
const BASE_URL = 'https://pixabay.com/';
const param = '&image_type=photo&orientation=horizontal&safesearch=true';

export default class NewsApiService{
    constructor() {
        this.valueSearch = null;
        this.page = 1;
        this.perPage = 40;
        this.totalHits = null;
        //this.fetchCountries
    }
    
    fetchCountries = async () => {
        const url = `${BASE_URL}api/?key=${KEY}&q=${this.valueSearch}${param}&page=${this.page}&per_page=${this.perPage}`;
        return await fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.totalHits = data.totalHits;
                this.incrementPage();
                console.log(this.page)
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

    randomUrlImg(hits) {
        const randomIndexHits = Math.floor(Math.random() * this.perPage);
        const randomUrlHit = hits[randomIndexHits].largeImageURL;
        this.randomBackgroundBody(randomUrlHit);
    }

    randomBackgroundBody(url) {
        document.body.style.backgroundImage = `url("${url}")`;
    }

    lightbox() {
        return new SimpleLightbox('.gallery .photo-card a');
    }
}
