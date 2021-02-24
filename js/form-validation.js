const validateForm = () => {

  const adForm = document.querySelector('.ad-form');
  const adTitle = adForm.querySelector('#title');
  const nightPrice = adForm.querySelector('#price');
  const roomNumber = adForm.querySelector('#room_number');
  const guests = adForm.querySelector('#capacity');

  adTitle.minLength = 30;
  adTitle.maxLength = 100;
  nightPrice.max = 1000000;

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

  document.addEventListener('DOMContentLoaded', onRoomNumberChange)
  roomNumber.addEventListener('change', onRoomNumberChange);
}

export {validateForm}
