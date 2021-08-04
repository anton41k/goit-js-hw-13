import SimpleLightbox from "simplelightbox";
import axios from "axios";
import { awaitExpression } from "babel-types";

axios.defaults.baseURL = 'https://pixabay.com/';

const KEY = '22580473-9722fdac11ed5197610aea928';
const param = '&image_type=photo&orientation=horizontal&safesearch=true';

export default class NewsApiService{
    constructor() {
        this.valueSearch = null;
        this.page = 1;
        this.perPage = 40;
        this.totalHits = null;
    }
    async fetchCountries(){
        
        const url = `api/?key=${KEY}&q=${this.valueSearch}${param}&page=${this.page}&per_page=${this.perPage}`;
        const response = await axios.get(url);
        this.totalHits = response.data.totalHits;
        this.incrementPage();
        return response.data.hits;
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
