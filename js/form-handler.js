import {setDefaultMarkerPosition} from './map.js';

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

  [checkIn, checkOut].forEach((element) => element.addEventListener('change', onCheckInOut));


  setPlaceMinPrice();

  placeType.addEventListener('change', onPlaceTypeChanged);

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
