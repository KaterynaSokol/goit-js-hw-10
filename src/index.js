import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  event.preventDefault();
  if (event.target.value === '') {
    return;
  } else {
    fetchCountries(searchBox.value.trim())
      .then(data => {
        if (data.length > 10) {
          clearHtml(countryList);
          clearHtml(countryInfo);
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length === 1) {
          clearHtml(countryList);
          createCountryCard(data[0]);
        } else {
          clearHtml(countryInfo);
          insertContent(data);
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        clearHtml(countryList);
        clearHtml(countryInfo);
      });
  }
}

function createList(item) {
  return `<li class = 'item'>
 <img class='item-img' src='${item.flags.svg}' alt = "flag of ${item.flags.alt}">
 <p class = 'item-descr'>${item.name.official}</p>
</li>`;
}

function generateCountry(array) {
  return array.reduce((acc, item) => acc + createList(item), '');
}

function insertContent(array) {
  const result = generateCountry(array);
  return (countryList.innerHTML = result);
}

function createCountryCard(item) {
  const languagesList = Object.values(item.languages);
  return (countryInfo.innerHTML = ` <div class ='country-card'> <img class='card-img' src='${item.flags.svg}' alt = "flag of ${item.flags.alt} width = '50px'">
 <h2 class = 'card-name'>${item.name.official}</h2>
 </div>
 <p class = 'card-descr'><span class = 'card-subtitle'>Capital:</span>${item.capital}</p>
 <p class = 'card-descr'><span class = 'card-subtitle'>Population:</span>${item.population}</p>
 <p class = 'card-descr'><span class = 'card-subtitle'>Languages:</span>${languagesList}
 </p>`);
}
function clearHtml(element) {
  return (element.innerHTML = '');
}
