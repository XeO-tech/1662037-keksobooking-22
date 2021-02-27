import {setDefaultMarkerPosition} from './map.js';
import {sendFormData} from './api.js';
import {isEscEvent} from './util.js'

const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');

const handleForm = () => {
  const minPrices = {
    bungalow: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };
  const FORM_RESET_DELAY = 100;

  const placeType = adForm.querySelector('#type');
  const checkIn = adForm.querySelector('#timein');
  const checkOut = adForm.querySelector('#timeout');

  const setPlaceMinPrice = () => {
    const nightPrice = adForm.querySelector('#price');

    let minPrice = 0;
    switch (placeType.value) {
      case 'bungalow':
        minPrice = minPrices.bungalow;
        break;
      case 'flat':
        minPrice = minPrices.flat;
        break;
      case 'house':
        minPrice = minPrices.house;
        break;
      case 'palace':
        minPrice = minPrices.palace;
        break;
    }
    nightPrice.min = nightPrice.placeholder = minPrice;
  };

  const onPlaceTypeChanged = () => setPlaceMinPrice();

  const onCheckInOut = (evt) => {
    (evt.target === checkIn) ? checkOut.value = evt.target.value : checkIn.value = evt.target.value;
  };

  const onFormMessageEscKeydown = (evt) => {
    if (isEscEvent) {
      evt.preventDefault();
      document.querySelector('main').lastChild.remove();
      document.removeEventListener('click', onFormMessageClick, { once: true });
    }
  };

  const onFormMessageClick = () => {
    document.querySelector('main').lastChild.remove();
    document.removeEventListener('keydown', onFormMessageEscKeydown, { once: true });
  };

  const showSuccessMessage = () => {
    const successTemplate = document.querySelector('#success').content;
    const successMessage = successTemplate.querySelector('.success').cloneNode(true);
    document.querySelector('main').appendChild(successMessage);

    document.addEventListener('keydown', onFormMessageEscKeydown, { once: true });
    document.addEventListener('click', onFormMessageClick, { once: true });
  };

  const showErrorMessage = () => {
    const errorTemplate = document.querySelector('#error').content;
    const errorMessage = errorTemplate.querySelector('.error').cloneNode(true);
    document.querySelector('main').appendChild(errorMessage);

    document.addEventListener('keydown', onFormMessageEscKeydown, { once: true });
    document.addEventListener('click', onFormMessageClick, { once: true });
  };

  // Handling form fields
  setPlaceMinPrice();

  [checkIn, checkOut].forEach((element) => element.addEventListener('change', onCheckInOut));

  placeType.addEventListener('change', onPlaceTypeChanged);

  // Handling submitting
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendFormData(
      () => {
        showSuccessMessage();
        adForm.reset();
      },
      showErrorMessage,
      new FormData(evt.target),
    );
  });

  // Handling reset
  adForm.addEventListener('reset', () => {
    setTimeout(() => {
      setDefaultMarkerPosition();
      setPlaceMinPrice();
      mapFilters.reset();
    }, FORM_RESET_DELAY);
  });
};


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

    case 'form_fields_enabled':
      adForm.classList.remove('ad-form--disabled');
      adFormElements.forEach((element) => element.disabled = false);
      break;

    case 'filters_enabled':
      mapFilters.classList.remove('map__filters--disabled');
      for (let element of mapFiltersElements) {
        element.disabled = false;
      }
      break;
  }
};

export {handleForm, changeFormStatus}
