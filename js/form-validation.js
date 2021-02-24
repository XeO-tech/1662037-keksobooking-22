import {sendFormData} from './api.js';
import {mainMarker} from './map.js';

const adForm = document.querySelector('.ad-form');

const validateForm = () => {

  const adTitle = adForm.querySelector('#title');
  const nightPrice = adForm.querySelector('#price');
  const roomNumber = adForm.querySelector('#room_number');
  const guests = adForm.querySelector('#capacity');

  const MIN_TITLE_LENGTH = 30;
  const MAX_TITLE_LENGTH = 100;
  const MAX_PRICE = 1000000;

  const onRoomNumberChange = () => {
    for (let element of guests.children) {
      element.disabled = true;
      element.selected = false;
    }

    switch (roomNumber.value) {
      case '3':
        guests.querySelector('option[value=\'3\']').disabled = false;
        // falls through
      case '2':
        guests.querySelector('option[value=\'2\']').disabled = false;
        // falls through
      case '1':
        guests.querySelector('option[value=\'1\']').disabled = false;
        guests.querySelector('option[value=\'1\']').selected = true;
        break;
      case '100':
        guests.querySelector('option[value=\'0\']').disabled = false;
        guests.querySelector('option[value=\'0\']').selected = true;
        break;
    }
  };

  adTitle.addEventListener('input', () => {

    const valueLength = adTitle.value.length;

    if (valueLength < MIN_TITLE_LENGTH) {
      adTitle.setCustomValidity('Ещё ' + (MIN_TITLE_LENGTH - valueLength) +' символов.');
    } else if (valueLength > MAX_TITLE_LENGTH) {
      adTitle.setCustomValidity('Удалите лишние ' + (valueLength - MAX_TITLE_LENGTH) +' символов.');
    } else {
      adTitle.setCustomValidity('');
    }

    adTitle.reportValidity();
  });

  document.addEventListener('DOMContentLoaded', onRoomNumberChange);

  roomNumber.addEventListener('change', onRoomNumberChange);

  nightPrice.max = MAX_PRICE;
}

const setFormReset= () => {
  adForm.addEventListener('reset', (evt) => {
    evt.preventDefault();
    console.log(1)
    const mainMarkerCoordinates = mainMarker.getLatLng();

    mainMarker.setLatLng([35.6825, 139.7512]);

    const addressField = document.querySelector('#address');
    addressField.value = `${mainMarkerCoordinates.lat.toFixed(5)}, ${mainMarkerCoordinates.lng.toFixed(5)}`;

  })
}

const setFormSubmit = (onSuccess) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendFormData(
      () => onSuccess(),
      () => console.log('Не удалось отправить форму', 'form'),
      new FormData(evt.target),
    );
  });
}

export {validateForm, setFormSubmit, setFormReset}
