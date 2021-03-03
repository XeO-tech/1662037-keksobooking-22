import {setDefaultMarkerPosition, resetMapMarks} from './map.js';
import {sendFormData} from './api.js';
import {isEscEvent} from './util.js'

const adForm = document.querySelector('.ad-form');
const nightPriceField = adForm.querySelector('#price');
const mapFilters = document.querySelector('.map__filters');

const handleForm = () => {
  const placeTypeField = adForm.querySelector('#type');
  const checkInField = adForm.querySelector('#timein');
  const checkOutField = adForm.querySelector('#timeout');

  const minPrices = {
    bungalow: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };
  const FORM_RESET_DELAY = 100;

  const onCheckInOut = (evt) => {
    (evt.target === checkInField) ? checkOutField.value = evt.target.value : checkInField.value = evt.target.value;
  };

  const setPlaceMinPrice = () => {
    let minPrice = 0;
    switch (placeTypeField.value) {
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
    nightPriceField.min = nightPriceField.placeholder = minPrice;
  };

  const onPlaceTypeChanged = () => setPlaceMinPrice();

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

  [checkInField, checkOutField].forEach((element) => element.addEventListener('change', onCheckInOut));

  placeTypeField.addEventListener('change', onPlaceTypeChanged);

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
      resetMapMarks();
    }, FORM_RESET_DELAY);
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
}

const setupFormValidity = () => {

  const adTitleField = adForm.querySelector('#title');
  const roomNumberField = adForm.querySelector('#room_number');
  const guestsNumberField = adForm.querySelector('#capacity');

  const MIN_TITLE_LENGTH = 30;
  const MAX_TITLE_LENGTH = 100;
  const MAX_PRICE = 1000000;

  const changeRoomNumber = () => {

    const guestsFor1RoomOption = guestsNumberField.querySelector('option[value=\'1\']');
    const guestsFor100RoomsOption = guestsNumberField.querySelector('option[value=\'0\']');

    for (let element of guestsNumberField.children) {
      element.disabled = true;
      element.selected = false;
    }

    switch (roomNumberField.value) {
      case '3':
        guestsNumberField.querySelector('option[value=\'3\']').disabled = false;
        // falls through
      case '2':
        guestsNumberField.querySelector('option[value=\'2\']').disabled = false;
        // falls through
      case '1':
        guestsFor1RoomOption.disabled = false;
        guestsFor1RoomOption.selected = true;
        break;
      case '100':
        guestsFor100RoomsOption.disabled = false;
        guestsFor100RoomsOption.selected = true;
        break;
    }
  };

  const onRoomNumberChange = () => changeRoomNumber();

  adTitleField.addEventListener('input', () => {

    const valueLength = adTitleField.value.length;

    const defineWordEnding = (number, word) => {
      switch (true) {
        case (number % 10 === 1 && number !== 11):
          return word;
        case (number % 10 === 2 && number !== 12):
        case (number % 10 === 3 && number !== 13):
        case (number % 10 === 4 && number !== 14):
          return word + 'а';
        default:
          return word + 'ов';
      }
    }

    if (valueLength < MIN_TITLE_LENGTH) {
      adTitleField.setCustomValidity(`Еще ${MIN_TITLE_LENGTH - valueLength} ${defineWordEnding(MIN_TITLE_LENGTH - valueLength, 'символ')}`);

    } else if (valueLength > MAX_TITLE_LENGTH) {
      adTitleField.setCustomValidity(`Удалите ${valueLength - MAX_TITLE_LENGTH} ${defineWordEnding(valueLength - MAX_TITLE_LENGTH, 'символ')}`);

    } else {
      adTitleField.setCustomValidity('');
    }

    adTitleField.reportValidity();
  });

  changeRoomNumber();

  roomNumberField.addEventListener('change', onRoomNumberChange);

  nightPriceField.max = MAX_PRICE;
}

export {handleForm, changeFormStatus, setupFormValidity}
