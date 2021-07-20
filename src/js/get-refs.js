export default function getRefs() {
    return {
        searchForm: document.querySelector('.search-form'),
        hitsContainer: document.querySelector('.gallery'),
        loadMoreBtn: document.querySelector('.load-more'),
    };
}