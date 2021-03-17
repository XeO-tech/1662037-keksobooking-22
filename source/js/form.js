import {setDefaultMarkerPosition, resetMarks} from './map.js';
import {sendFormData} from './api.js';
import {isEscEvent, defineWordEnding} from './utils.js';
import {setupAllPicturesUploaders, clearAllPicturesPreview } from './picture-uploader.js';

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE = 1000000;
const MinPrices = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

const adForm = document.querySelector('.ad-form');
const nightPriceField = adForm.querySelector('#price');
const mapFiltersForm = document.querySelector('.map__filters');

const setupForm = () => {
  const placeTypeField = adForm.querySelector('#type');
  const checkInField = adForm.querySelector('#timein');
  const checkOutField = adForm.querySelector('#timeout');
  const resetFormButton = adForm.querySelector('.ad-form__reset');

  const onCheckInOut = (evt) => {
    (evt.target === checkInField) ? checkOutField.value = evt.target.value : checkInField.value = evt.target.value;
  };
  const setPlaceMinPrice = () => {
    let minPrice = MinPrices[placeTypeField.value];
    nightPriceField.min = nightPriceField.placeholder = minPrice;
  };
  const onPlaceTypeChanged = () => setPlaceMinPrice();

  const onMessageEscKeydown = (evt) => {
    if (isEscEvent) {
      evt.preventDefault();
      document.querySelector('main').lastChild.remove();
      document.removeEventListener('click', onMessageClick, { once: true });
    }
  };
  const onMessageClick = () => {
    document.querySelector('main').lastChild.remove();
    document.removeEventListener('keydown', onMessageEscKeydown, { once: true });
  };
  const showSuccessMessage = () => {
    const successTemplate = document.querySelector('#success').content;
    const successMessage = successTemplate.querySelector('.success').cloneNode(true);
    document.querySelector('main').appendChild(successMessage);
    document.addEventListener('keydown', onMessageEscKeydown, { once: true });
    document.addEventListener('click', onMessageClick, { once: true });
  };
  const showErrorMessage = () => {
    const errorTemplate = document.querySelector('#error').content;
    const errorMessage = errorTemplate.querySelector('.error').cloneNode(true);
    document.querySelector('main').appendChild(errorMessage);
    document.addEventListener('keydown', onMessageEscKeydown, { once: true });
    document.addEventListener('click', onMessageClick, { once: true });
  };
  // Handling form fields
  setPlaceMinPrice();
  [checkInField, checkOutField].forEach((element) => element.addEventListener('change', onCheckInOut));
  placeTypeField.addEventListener('change', onPlaceTypeChanged);
  // Handling reset
  const resetAdForm = () => {
    adForm.reset();
    clearAllPicturesPreview();
    setDefaultMarkerPosition();
    setPlaceMinPrice();
    mapFiltersForm.reset();
    resetMarks();
  };
  resetFormButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    resetAdForm();
  });
  // Handling submitting
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    sendFormData(
      () => {
        showSuccessMessage();
        resetAdForm();
      },
      showErrorMessage,
      new FormData(evt.target),
    );
  });
};
const changeFormStatus = (status) => {
  const adFormNodes = adForm.querySelectorAll('.ad-form__element');
  const mapFiltersNodes = mapFiltersForm.children;

  switch (status) {
    case 'disabled':
      adForm.classList.add('ad-form--disabled');
      adFormNodes.forEach((element) => element.disabled = true);
      mapFiltersForm.classList.add('map__filters--disabled');
      for (let element of mapFiltersNodes) {
        element.disabled = true;
      }
      break;
    case 'form_fields_enabled':
      adForm.classList.remove('ad-form--disabled');
      adFormNodes.forEach((element) => element.disabled = false);
      break;
    case 'filters_enabled':
      mapFiltersForm.classList.remove('map__filters--disabled');
      for (let element of mapFiltersNodes) {
        element.disabled = false;
      }
      break;
  }
};
const setupFormValidity = () => {
  const adTitleField = adForm.querySelector('#title');
  const roomNumberField = adForm.querySelector('#room_number');
  const guestsNumberField = adForm.querySelector('#capacity');

  const changeRoomNumber = () => {
    const guestsFor1RoomOption = guestsNumberField.querySelector('option[value=\'1\']');
    const guestsFor2RoomsOption = guestsNumberField.querySelector('option[value=\'2\']');
    const guestsFor3RoomsOption = guestsNumberField.querySelector('option[value=\'3\']');
    const guestsFor100RoomsOption = guestsNumberField.querySelector('option[value=\'0\']');

    for (let element of guestsNumberField.children) {
      element.disabled = true;
      element.selected = false;
    }
    switch (roomNumberField.value) {
      case '3':
        guestsFor3RoomsOption.disabled = false;
        // falls through
      case '2':
        guestsFor2RoomsOption.disabled = false;
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
  setupAllPicturesUploaders();
};
export {setupForm, changeFormStatus, setupFormValidity};
