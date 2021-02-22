const handleForm = () => {
  const adForm = document.querySelector('.ad-form');
  const placeType = adForm.querySelector('#type');
  const nightPrice = adForm.querySelector('#price');
  const checkIn = adForm.querySelector('#timein');
  const checkOut = adForm.querySelector('#timeout');

  const onCheckInOut = (evt) => {
    (evt.target === checkIn) ? checkOut.value = evt.target.value : checkIn.value = evt.target.value;
  };

  [checkIn, checkOut].forEach((element) => element.addEventListener('change', onCheckInOut));

  const setPlaceMinPrice = () => {
    let minPrice = 0;
    switch (placeType.value) {
      case 'bungalow':
        minPrice = 0;
        break;
      case 'flat':
        minPrice = 1000;
        break;
      case 'house':
        minPrice = 5000;
        break;
      case 'palace':
        minPrice = 10000;
        break;
    }
    nightPrice.min = nightPrice.placeholder = minPrice;
  };

  setPlaceMinPrice();

  placeType.addEventListener('change', setPlaceMinPrice);
}

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

export {handleForm, changeFormStatus}
