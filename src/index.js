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


