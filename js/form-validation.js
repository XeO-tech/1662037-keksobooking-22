const setupFormValidity = () => {

  const adForm = document.querySelector('.ad-form');
  const adTitleField = adForm.querySelector('#title');
  const nightPriceField = adForm.querySelector('#price');
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

  const onRoomNumberFieldChange = () => changeRoomNumber();

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

  roomNumberField.addEventListener('change', onRoomNumberFieldChange);

  nightPriceField.max = MAX_PRICE;
}

export {setupFormValidity}
