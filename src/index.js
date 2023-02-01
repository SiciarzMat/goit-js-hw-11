import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
const axios = require('axios').default;

const input = document.querySelector('input');
const btn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const more = document.querySelector('.load-more');
const moreDiv = document.querySelector('.load-btn');

let page;

async function takeData(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  if (input.value !== '') {
    const response = await axios.get(
      `https://pixabay.com/api/?key=33205968-8b41858d570a210f657d54e85&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    const ArrayOfObjects = await response.data;
    console.log(ArrayOfObjects);
    if (ArrayOfObjects.total == 0) {
      moreDiv.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      moreDiv.style.display = 'flex';
      Notiflix.Notify.success(
        `Hooray! We found ${ArrayOfObjects.totalHits} images!`
      );
    }
    const itemsMap = ArrayOfObjects.hits
      .map(item => {
        return `<div class="photo-card">
    <img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
      <span>Likes:</span> ${item.likes}
      </p>
      <p class="info-item">
      <span>Views:</span> ${item.views}
      </p>
      <p class="info-item">
      <span>Comments:</span> ${item.comments}
      </p>
      <p class="info-item">
        <span>Downloads:</span> ${item.downloads}
      </p>
    </div>
  </div>`;
      })
      .join('');

    gallery.insertAdjacentHTML('beforeend', itemsMap);
  } else {
    moreDiv.style.display = 'none';
    Notiflix.Notify.info('Sorry, "search" field cannot be empty.');
  }
}

async function nextPage(e) {
  e.preventDefault();

  page += 1;
  const response = await axios.get(
    `https://pixabay.com/api/?key=33205968-8b41858d570a210f657d54e85&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  const ArrayOfObjects = await response.data;

  if (ArrayOfObjects.totalHits <= page * 40) {
    moreDiv.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  const itemsMap = ArrayOfObjects.hits
    .map(item => {
      return `<div class="photo-card">
      <img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
        <span>Likes:</span> ${item.likes}
        </p>
        <p class="info-item">
        <span>Views:</span> ${item.views}
        </p>
        <p class="info-item">
        <span>Comments:</span> ${item.comments}
        </p>
        <p class="info-item">
          <span>Downloads:</span> ${item.downloads}
        </p>
      </div>
    </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', itemsMap);
}

btn.addEventListener('click', takeData);
more.addEventListener('click', nextPage);

const lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});
