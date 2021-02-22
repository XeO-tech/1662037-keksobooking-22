import {createObjectsArr} from './data.js';
import {renderMap, getAddressByMarkerOnly, showAdsOnMap} from './map.js';
import {handleForm} from './form-handler.js';
// import {changeFormStatus} from './form-handler.js'


const adsList = createObjectsArr(10);

const changeFormStatus = (status) => {
  const adForm = document.querySelector('.ad-form');
  const adFormElements = adForm.querySelectorAll('.ad-form__element');
  const mapFilters = document.querySelector('.map__filters');
  const mapFiltersElements = mapFilters.children;

  switch (status) {
    case 'disabled':
      adForm.classList.add('ad-form--disabled');
      adFormElements.forEach((element) => element.disabled = true);
      mapFilters.classList.add('map__filters--disabled');
      for (let element of mapFiltersElements) {
        element.disabled = true;
      }
      break;

    case 'enabled':
      adForm.classList.remove('ad-form--disabled');
      adFormElements.forEach((element) => element.disabled = false);
      mapFilters.classList.remove('map__filters--disabled');
      for (let element of mapFiltersElements) {
        element.disabled = false;
      }
      break;
  }
}



//changeFormStatus('disabled');

renderMap();

getAddressByMarkerOnly();

handleForm();

showAdsOnMap(adsList);


