import {setDefaultMarkerPosition} from './map.js';
import {sendFormData} from './api.js';
import {isEscEvent} from '/.util.js'

const adForm = document.querySelector('.ad-form');
const placeType = adForm.querySelector('#type');
const mapFilters = document.querySelector('.map__filters');


const handleForm = () => {
  const BUNGALOW_MIN_PRICE = 0;
  const FLAT_MIN_PRICE = 1000;
  const HOUSE_MIN_PRICE = 5000;
  const PALACE_MIN_PRICE = 10000;

  const checkIn = adForm.querySelector('#timein');
  const checkOut = adForm.querySelector('#timeout');

  const setPlaceMinPrice = () => {
    const nightPrice = adForm.querySelector('#price');

    let minPrice = 0;
    switch (placeType.value) {
      case 'bungalow':
        minPrice = BUNGALOW_MIN_PRICE;
        break;
      case 'flat':
        minPrice = FLAT_MIN_PRICE;
        break;
      case 'house':
        minPrice = HOUSE_MIN_PRICE;
        break;
      case 'palace':
        minPrice = PALACE_MIN_PRICE;
        break;
    }
    nightPrice.min = nightPrice.placeholder = minPrice;
  };

  const onPlaceTypeChanged = () => setPlaceMinPrice();

  const onCheckInOut = (evt) => {
    (evt.target === checkIn) ? checkOut.value = evt.target.value : checkIn.value = evt.target.value;
  };

  const showSuccessMessage = () => {
    const successTemplate = document.querySelector('#success').content;
    const successMessage = successTemplate.querySelector('.success').cloneNode(true);
    document.querySelector('main').appendChild(successMessage);

    document.addEventListener('keydown', (evt) => {
      if (isEscEvent) {
        evt.preventDefault();
        successMessage.remove();
      }
    }, { once: true });

    document.addEventListener('click', (evt) => {
      successMessage.remove();
    }, { once: true });
  };

  const showFailMessage = () => {

  }
  // Handling form fields
  setPlaceMinPrice();

  [checkIn, checkOut].forEach((element) => element.addEventListener('change', onCheckInOut));

  placeType.addEventListener('change', onPlaceTypeChanged);

  // Handling submitting
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendFormData(
      () => showSuccessMessage(),
      () => showFailMessage('Не удалось разместить объявление'),
      new FormData(evt.target),
    );
  });

  // Handling reset
  adForm.addEventListener('reset', () => {
    setTimeout(() => {
      setDefaultMarkerPosition();
      setPlaceMinPrice();
      mapFilters.reset();
    }, 100);
  });
}

const changeFormStatus = (status) => {
  const adFormElements = adForm.querySelectorAll('.ad-form__element');
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

export {handleForm, changeFormStatus}
